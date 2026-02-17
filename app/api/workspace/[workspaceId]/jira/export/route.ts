import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import JiraAPI from "@/lib/jira-api";
import {
  mapLocalPriorityToJira,
  validateAndFormatProjectKey,
  generateProjectKeyFromName,
} from "@/lib/jira-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, find the workspace by workspace_id (short ID)
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id, name")
      .eq("workspace_id", resolvedParams.workspaceId)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      jiraCredentials,
      projectKey,
      projectName,
      createNewProject,
      statusMappings,
      selectedProjectId,
      selectedSpaceId,
    } = body;

    // Validate required fields
    if (!jiraCredentials || !statusMappings) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate and format project key for new projects
    let validatedProjectKey = projectKey;
    if (createNewProject) {
      try {
        if (!projectKey) {
          // Generate project key from project name if not provided
          if (!projectName) {
            return NextResponse.json(
              { error: "Project name is required when creating new project" },
              { status: 400 }
            );
          }
          validatedProjectKey = generateProjectKeyFromName(projectName);
        } else {
          validatedProjectKey = validateAndFormatProjectKey(projectKey);
        }
      } catch (error: any) {
        return NextResponse.json(
          { error: `Invalid project key: ${error.message}` },
          { status: 400 }
        );
      }
    }

    // Debug: Check if selectedProjectId is provided
    if (!selectedProjectId) {
      console.log("No selectedProjectId provided in request");
      return NextResponse.json(
        { error: "No project selected for export" },
        { status: 400 }
      );
    }

    // Debug: Check if the project exists
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id, name, project_id")
      .eq("id", selectedProjectId)
      .single();

    if (projectError || !projectData) {
      console.log("Project not found:", {
        selectedProjectId,
        error: projectError,
      });
      return NextResponse.json(
        { error: "Selected project not found" },
        { status: 404 }
      );
    }

    // Debug: Check tasks in this project
    const { data: projectTasks, error: projectTasksError } = await supabase
      .from("tasks")
      .select("id, name, project_id")
      .eq("project_id", selectedProjectId);

    // Initialize Jira API
    const jiraApi = new JiraAPI({
      domain: jiraCredentials.jira_domain,
      email: jiraCredentials.jira_email,
      apiToken: jiraCredentials.jira_api_token,
    });

    // Step 1: Create project if needed
    let finalProjectKey = validatedProjectKey;
    if (createNewProject) {
      try {
        // Get current user info from Jira for project lead
        const currentUser = await jiraApi.getCurrentUser();

        if (!currentUser.accountId) {
          throw new Error(
            "Could not retrieve current user's account ID from Jira"
          );
        }

        const projectData = {
          key: validatedProjectKey,
          name: projectName,
          description: `Project exported from SprintiQ workspace: ${workspace.name}`,
          projectTypeKey: "software", // Default to software project
          leadAccountId: currentUser.accountId, // Use the account ID from Jira
        };

        const newProject = await jiraApi.createProject(projectData);
        finalProjectKey = newProject.key;

        // AUTO-FIX: Add Story issue type to newly created project
        try {
          const globalTypes = await jiraApi.getGlobalIssueTypes();
          const globalStory = globalTypes.find(
            (t: any) => t.name.toLowerCase().trim() === "story"
          );

          if (globalStory) {
            const projectResponse = await jiraApi.getProjectDetails(
              finalProjectKey
            );
            const currentIssueTypeIds = projectResponse.issueTypes.map(
              (it: any) => it.id
            );

            // Add Story if not already present
            if (!currentIssueTypeIds.includes(globalStory.id)) {
              await jiraApi.updateProjectIssueTypes(finalProjectKey, [
                ...currentIssueTypeIds,
                globalStory.id,
              ]);
            } else {
            }
          } else {
          }
        } catch (error: any) {}
      } catch (error: any) {
        // Check if it's a project lead issue
        if (error.message && error.message.includes("project lead")) {
          return NextResponse.json(
            {
              error: `Invalid project lead. Please ensure your Jira account has admin permissions to create projects.`,
            },
            { status: 400 }
          );
        }

        // Check if it's a project key conflict
        if (error.message && error.message.includes("uses this project key")) {
          return NextResponse.json(
            {
              error: `Project key '${projectKey}' already exists. Please choose a different project key.`,
            },
            { status: 400 }
          );
        }

        // Check if it's a permission issue
        if (error.message && error.message.includes("permission")) {
          return NextResponse.json(
            {
              error: `Permission denied. Please ensure your Jira account has admin permissions to create projects.`,
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            error: `Failed to create Jira project: ${error.message}`,
          },
          { status: 500 }
        );
      }
    }

    // Step 1.5: Check fields for the project (both new and existing)
    console.log("Checking fields for project:", finalProjectKey);
    try {
      const checkFieldsResponse = await fetch(
        `${request.nextUrl.origin}/api/workspace/${resolvedParams.workspaceId}/jira/check-fields`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: request.headers.get("Authorization") || "",
          },
          body: JSON.stringify({
            jiraCredentials,
            projectKey: finalProjectKey,
          }),
        }
      );

      if (checkFieldsResponse.ok) {
        const checkFieldsResult = await checkFieldsResponse.json();
      } else {
        console.warn("Failed to check fields, but continuing with export");
      }
    } catch (error) {
      console.warn("Error checking fields:", error);
      // Continue with export even if field check fails
    }

    // Step 2: Fetch tasks to export

    let tasksQuery = supabase
      .from("tasks")
      .select(
        `
        *,
        status:statuses(*),
        project:projects(*),
        space:spaces(*),
        assignee:profiles!tasks_assignee_id_fkey(id, full_name, email, avatar_url),
        assigned_member:team_members!tasks_assigned_member_id_fkey(
          id,
          name,
          email,
          account_id,
          role_id,
          level_id,
          description,
          is_registered,
          role:roles(name),
          level:levels(name)
        )
      `
      )
      .eq("workspace_id", workspace.id);

    if (selectedProjectId) {
      tasksQuery = tasksQuery.eq("project_id", selectedProjectId);
    } else if (selectedSpaceId) {
      tasksQuery = tasksQuery.eq("space_id", selectedSpaceId);
    }

    const { data: tasks, error: tasksError } = await tasksQuery;

    if (tasksError) {
      console.log("Error fetching tasks:", tasksError);
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 }
      );
    }

    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: "No tasks found to export" },
        { status: 400 }
      );
    }

    // Step 3: Export tasks to Jira
    let exportedCount = 0;
    let failedCount = 0;
    const exportedTasks: any[] = [];

    // First, get available issue types for the project
    let availableIssueTypes: any[] = [];
    try {
      availableIssueTypes = await jiraApi.getProjectIssueTypes(finalProjectKey);
    } catch (error) {
      console.log("Failed to fetch issue types:", error);
      // Continue with default issue type
    }

    // Get available priorities
    let availablePriorities: any[] = [];
    try {
      availablePriorities = await jiraApi.getPriorities();
    } catch (error) {
      console.log("Failed to fetch priorities:", error);
    }

    for (const task of tasks) {
      try {
        // Find the mapped Jira status
        const statusMapping = statusMappings.find(
          (m: any) => m.localStatusId === task.status_id
        );

        if (!statusMapping) {
          console.warn(
            `No status mapping found for task ${task.id}, using first available status`
          );
        }

        // Determine issue type - prioritize "Story" over "Task" or other types
        let issueType = "Story";

        if (availableIssueTypes.length > 0) {
          // First try to find "Story" - check multiple variations
          let selectedType = availableIssueTypes.find((it) => {
            const name = it.name.toLowerCase().trim();
            return name === "story" || name === "user story";
          });

          // If exact story not found, try broader story match
          if (!selectedType) {
            selectedType = availableIssueTypes.find((it) =>
              it.name.toLowerCase().includes("story")
            );
          }

          // AUTO-FIX: If no Story found, try to add it to the project
          if (!selectedType) {
            try {
              // Get all global issue types from Jira
              const globalTypes = await jiraApi.getGlobalIssueTypes();

              // Find Story in global types
              const globalStory = globalTypes.find(
                (t: any) => t.name.toLowerCase().trim() === "story"
              );

              if (globalStory) {
                // Add Story to project using project configuration update
                const projectResponse = await jiraApi.getProjectDetails(
                  finalProjectKey
                );
                const currentIssueTypeIds = projectResponse.issueTypes.map(
                  (it: any) => it.id
                );

                // Update the project to include Story
                await jiraApi.updateProjectIssueTypes(finalProjectKey, [
                  ...currentIssueTypeIds,
                  globalStory.id,
                ]);

                // Refresh available issue types
                availableIssueTypes = await jiraApi.getProjectIssueTypes(
                  finalProjectKey
                );

                // Now try to find Story again
                selectedType = availableIssueTypes.find((it) => {
                  const name = it.name.toLowerCase().trim();
                  return name === "story" || name === "user story";
                });
              } else {
              }
            } catch (error: any) {}
          }

          // If still no Story, try "Task"
          if (!selectedType) {
            selectedType = availableIssueTypes.find(
              (it) => it.name.toLowerCase().trim() === "task"
            );
          }

          // If neither Story nor Task found, try "Issue"
          if (!selectedType) {
            selectedType = availableIssueTypes.find(
              (it) => it.name.toLowerCase().trim() === "issue"
            );
          }

          // Use the found type or fallback to first available
          if (selectedType) {
            issueType = selectedType.name;
          } else {
            issueType = availableIssueTypes[0].name;
          }
        }

        // Determine priority - map local priority to Jira priority
        let priority = "Medium";
        if (availablePriorities.length > 0) {
          const localPriority = task.priority || "medium";
          const mappedPriority = mapLocalPriorityToJira(localPriority);

          // Find the mapped priority in available Jira priorities
          const jiraPriority = availablePriorities.find(
            (p) => p.name === mappedPriority
          );

          if (jiraPriority) {
            priority = jiraPriority.name;
          } else {
            // Fallback to medium priority
            const mediumPriority = availablePriorities.find(
              (p) =>
                p.name.toLowerCase() === "medium" ||
                p.name.toLowerCase() === "normal"
            );
            if (mediumPriority) {
              priority = mediumPriority.name;
            } else {
              priority = availablePriorities[0].name;
            }
          }
        }

        // Prepare task data for Jira
        const jiraIssueData: any = {
          summary: task.name,
          description: task.description || "",
          issueType: issueType,
          priority: priority,
        };

        // Check for assignee but don't set it during creation
        // We'll assign after issue creation using a separate API call
        let assigneeAccountId = null;

        // First check if there's a profile assignee with account_id
        if (task.assignee_id && task.assignee && task.assignee.account_id) {
          assigneeAccountId = task.assignee.account_id;
          console.log(
            `Task ${task.id} has profile assignee with account_id: ${assigneeAccountId}`
          );
        }
        // If no profile assignee, check if there's a team member assignee with account_id
        else if (
          task.assigned_member_id &&
          task.assigned_member &&
          task.assigned_member.account_id
        ) {
          assigneeAccountId = task.assigned_member.account_id;
          console.log(
            `Task ${task.id} has team member assignee with account_id: ${assigneeAccountId}`
          );
        }

        if (!assigneeAccountId) {
          console.log(
            `Task ${
              task.id
            } has no assignee with Jira account_id. Profile assignee: ${
              task.assignee?.email || "none"
            }, Team member assignee: ${task.assigned_member?.email || "none"}`
          );
        }

        // Note: Story Points will be set after issue creation using PUT /rest/api/2/issue/{issueIdOrKey}
        // This is because some custom fields require a separate update call

        // Create issue in Jira
        const jiraIssue = await jiraApi.createIssue(
          finalProjectKey,
          jiraIssueData
        );

        // Step 2: Assign the issue if we have an assignee
        if (assigneeAccountId) {
          try {
            console.log(
              `Assigning issue ${jiraIssue.key} to account_id: ${assigneeAccountId}`
            );
            await jiraApi.assignIssue(jiraIssue.key, assigneeAccountId);
          } catch (assignError) {
            console.log(
              `Failed to assign issue ${jiraIssue.key} to ${assigneeAccountId}:`,
              assignError
            );
            // Continue with export even if assignment fails
          }
        }

        // Step 3: Update the issue with Story Points if available
        if (task.story_points && typeof task.story_points === "number") {
          try {
            // Use the improved story points field detection
            const storyPointsFieldName = await jiraApi.findStoryPointsField(
              finalProjectKey
            );

            if (storyPointsFieldName) {
              // Try to update the issue with story points directly
              try {
                const updatePayload = {
                  fields: {
                    [storyPointsFieldName]: task.story_points,
                  },
                };

                await jiraApi.updateIssue(jiraIssue.key, {
                  fields: updatePayload.fields,
                });
              } catch (updateError) {
                console.log(
                  `Failed to update story points field ${storyPointsFieldName} for issue ${jiraIssue.key}:`,
                  updateError
                );
                // Continue without story points
              }
            } else {
              console.log(
                `No story points field found for project ${finalProjectKey}, skipping story points update`
              );
            }
          } catch (updateError) {
            console.log(
              `Failed to update story points for issue ${jiraIssue.key}:`,
              updateError
            );
            // Continue with export even if Story Points update fails
          }
        }

        // Step 4: Transition the issue to the mapped status if available
        if (statusMapping && statusMapping.jiraStatusId) {
          try {
            console.log(
              `Transitioning issue ${jiraIssue.key} to mapped status: ${statusMapping.jiraStatusName} (${statusMapping.jiraStatusId})`
            );

            const transitionSuccess = await jiraApi.transitionIssueToStatus(
              jiraIssue.key,
              statusMapping.jiraStatusId
            );

            if (transitionSuccess) {
              console.log(
                `Successfully transitioned issue ${jiraIssue.key} to status: ${statusMapping.jiraStatusName}`
              );
            } else {
              console.warn(
                `Failed to transition issue ${jiraIssue.key} to status: ${statusMapping.jiraStatusName}. Issue will remain in its initial status.`
              );
            }
          } catch (transitionError) {
            console.log(
              `Error transitioning issue ${jiraIssue.key} to status ${statusMapping.jiraStatusName}:`,
              transitionError
            );
            // Continue with export even if status transition fails
          }
        } else {
          console.log(
            `No status mapping found for task ${task.id}, issue ${jiraIssue.key} will remain in its initial status`
          );
        }

        // Update task in database to mark as exported
        const { error: updateError } = await supabase
          .from("tasks")
          .update({
            type: "jira",
            external_id: jiraIssue.id, // Use Jira issue id for sync matching
            external_data: {
              jira_key: jiraIssue.key,
              jira_issue_id: jiraIssue.id,
              jira_project_key: finalProjectKey,
              last_synced_at: new Date().toISOString(),
            },
            last_synced_at: new Date().toISOString(),
            sync_status: "synced",
          })
          .eq("id", task.id);

        if (updateError) {
        }

        exportedTasks.push({
          taskId: task.id,
          jiraIssueKey: jiraIssue.key,
          jiraIssueId: jiraIssue.id,
        });

        exportedCount++;
      } catch (error) {
        console.log(`Error exporting task ${task.id}:`, error);
        failedCount++;
      }
    }

    // Step 4: Update project type if exporting from a specific project
    if (selectedProjectId) {
      const { error: projectUpdateError } = await supabase
        .from("projects")
        .update({
          type: "jira",
          external_id: finalProjectKey,
          external_data: {
            jira_project_key: finalProjectKey,
            last_synced_at: new Date().toISOString(),
          },
        })
        .eq("id", selectedProjectId);

      if (projectUpdateError) {
        console.log("Error updating project:", projectUpdateError);
      }
    }

    // Step 5: Update local statuses with Jira integration information
    console.log("Updating local statuses with Jira integration information...");

    // Get all Jira statuses for this project to map them properly
    const jiraStatuses = await jiraApi.getProjectStatuses(finalProjectKey);
    const jiraStatusMap = new Map(
      jiraStatuses.map((status: any) => [status.id, status])
    );

    // Update each mapped status with Jira information
    for (const statusMapping of statusMappings) {
      if (statusMapping.jiraStatusId) {
        const jiraStatus = jiraStatusMap.get(statusMapping.jiraStatusId);

        if (jiraStatus) {
          try {
            await supabase
              .from("statuses")
              .update({
                integration_type: "jira",
                external_id: jiraStatus.id,
                external_data: {
                  jira_status_name: jiraStatus.name,
                  jira_status_category: jiraStatus.statusCategory?.key,
                  jira_status_color: jiraStatus.statusCategory?.colorName,
                  jira_project_key: finalProjectKey,
                  last_synced_at: new Date().toISOString(),
                },
                last_synced_at: new Date().toISOString(),
                sync_status: "synced",
                pending_sync: false,
              })
              .eq("id", statusMapping.localStatusId);

            console.log(
              `Updated local status ${statusMapping.localStatusName} with Jira status ${jiraStatus.name} (${jiraStatus.id})`
            );
          } catch (error) {
            console.error(
              `Failed to update local status ${statusMapping.localStatusName} with Jira information:`,
              error
            );
          }
        } else {
          console.warn(
            `Jira status ${statusMapping.jiraStatusId} not found in project ${finalProjectKey}`
          );
        }
      }
    }

    // Step 6: Create or update Jira integration record
    const { data: existingIntegration } = await supabase
      .from("jira_integrations")
      .select("*")
      .eq("workspace_id", workspace.id) // Use the actual workspace UUID
      .single();

    if (existingIntegration) {
      // Update existing integration
      await supabase
        .from("jira_integrations")
        .update({
          jira_domain: jiraCredentials.jira_domain,
          jira_email: jiraCredentials.jira_email,
          jira_api_token: jiraCredentials.jira_api_token,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingIntegration.id);
    } else {
      // Create new integration
      await supabase.from("jira_integrations").insert({
        workspace_id: workspace.id, // Use the actual workspace UUID
        jira_domain: jiraCredentials.jira_domain,
        jira_email: jiraCredentials.jira_email,
        jira_api_token: jiraCredentials.jira_api_token,
        is_active: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        tasksExported: exportedCount,
        tasksFailed: failedCount,
        totalTasks: tasks.length,
        exportedTasks,
        projectKey: finalProjectKey,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export data to Jira" },
      { status: 500 }
    );
  }
}

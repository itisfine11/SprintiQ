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
      sprintFolderId,
    } = body;

    // Validate required fields
    if (!jiraCredentials || !statusMappings || !sprintFolderId) {
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

    // Get sprint folder data
    const { data: sprintFolder, error: sprintFolderError } = await supabase
      .from("sprint_folders")
      .select(
        `
        *,
        space:spaces(*)
      `
      )
      .eq("id", sprintFolderId)
      .single();

    if (sprintFolderError || !sprintFolder) {
      console.log("Sprint folder not found:", {
        sprintFolderId,
        error: sprintFolderError,
      });
      return NextResponse.json(
        { error: "Sprint folder not found" },
        { status: 404 }
      );
    }

    // Get sprints for this sprint folder
    const { data: sprints, error: sprintsError } = await supabase
      .from("sprints")
      .select(
        `
        *
      `
      )
      .eq("sprint_folder_id", sprintFolderId);

    if (sprintsError) {
      console.log("Error fetching sprints:", sprintsError);
      return NextResponse.json(
        { error: "Failed to fetch sprints" },
        { status: 500 }
      );
    }

    // Get tasks for all sprints
    const sprintIds = sprints?.map((sprint) => sprint.id) || [];
    let tasksData: any[] = [];

    if (sprintIds.length > 0) {
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select(
          `
          *,
          status:statuses(*),
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
        .in("sprint_id", sprintIds);

      if (tasksError) {
        console.log("Error fetching tasks:", tasksError);
        return NextResponse.json(
          { error: "Failed to fetch tasks" },
          { status: 500 }
        );
      }

      tasksData = tasks || [];
    }

    // Combine sprint folder with sprints and tasks
    const sprintFolderWithData = {
      ...sprintFolder,
      sprints:
        sprints?.map((sprint: any) => ({
          ...sprint,
          tasks: tasksData.filter((task) => task.sprint_id === sprint.id),
        })) || [],
    };

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

        const projectData = {
          key: finalProjectKey,
          name: projectName,
          description: `Project created from SprintiQ sprint folder: ${sprintFolder.name}`,
          projectTypeKey: "software",
          leadAccountId: currentUser.accountId,
        };

        const createdProject = await jiraApi.createProject(projectData);
        console.log("Created new Jira project:", createdProject);
      } catch (error: any) {
        console.error("Failed to create Jira project:", error);
        return NextResponse.json(
          { error: `Failed to create Jira project: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // Step 2: Get or create filter for the project
    let filterId: number = 0;
    try {
      // Try to get existing filters first
      let existingFilter = null;
      try {
        const filtersResponse = await jiraApi.getMyFilters();
        console.log("Filters response:", filtersResponse);

        // Ensure filters is an array
        const filters = Array.isArray(filtersResponse) ? filtersResponse : [];
        console.log("Processed filters:", filters);

        // Look for existing filter for this project
        existingFilter = filters.find(
          (filter: any) =>
            filter.jql && filter.jql.includes(`project = ${finalProjectKey}`)
        );
      } catch (filterError) {
        console.log(
          "Could not fetch existing filters, will create new one:",
          filterError
        );
      }

      if (existingFilter) {
        filterId = existingFilter.id;
        console.log("Using existing filter:", existingFilter.name);
      } else {
        // Create new filter for the project with unique name
        const timestamp = Date.now();
        const filterData = {
          name: `${sprintFolder.name} - ${finalProjectKey} Filter (${timestamp})`,
          description: `Filter for ${sprintFolder.name} sprint folder in project ${finalProjectKey}`,
          jql: `project = ${finalProjectKey}`,
        };

        // Try to create filter with retry logic
        let newFilter;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            newFilter = await jiraApi.createFilter(filterData);
            filterId = newFilter.id;
            console.log("Created new filter:", newFilter.name);
            break;
          } catch (error: any) {
            retryCount++;
            if (
              error.message.includes("Filter with same name already exists")
            ) {
              // Update filter name with new timestamp
              filterData.name = `${
                sprintFolder.name
              } - ${finalProjectKey} Filter (${Date.now()})`;
              console.log(`Retrying with new filter name: ${filterData.name}`);
            } else if (retryCount >= maxRetries) {
              throw error;
            } else {
              console.log(
                `Retry ${retryCount}/${maxRetries} due to error:`,
                error.message
              );
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * retryCount)
              ); // Exponential backoff
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Failed to get/create filter:", error);

      // Try to create a simple filter as fallback
      try {
        console.log("Attempting fallback filter creation...");
        const fallbackFilter = await jiraApi.createFilter({
          name: `Sprint Export Filter ${Date.now()}`,
          description: "Fallback filter for sprint export",
          jql: `project = ${finalProjectKey}`,
        });
        filterId = fallbackFilter.id;
        console.log("Created fallback filter:", fallbackFilter.name);
      } catch (fallbackError: any) {
        console.error("Fallback filter creation also failed:", fallbackError);
        return NextResponse.json(
          { error: `Failed to create any filter: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // Step 3: Create board using the filter
    let boardId: number = 0;
    try {
      const boardData = {
        name: `${sprintFolder.name} Board`,
        filterId: filterId,
        projectKeyOrId: finalProjectKey,
        type: "scrum" as const,
      };

      const board = await jiraApi.createBoard(boardData);
      boardId = board.id;
      console.log("Created new board:", board.name);
    } catch (error: any) {
      console.error("Failed to create board:", error);

      // Try with a simpler board name as fallback
      try {
        console.log("Attempting fallback board creation...");
        const fallbackBoard = await jiraApi.createBoard({
          name: `Sprint Board ${Date.now()}`,
          filterId: filterId,
          projectKeyOrId: finalProjectKey,
          type: "scrum" as const,
        });
        boardId = fallbackBoard.id;
        console.log("Created fallback board:", fallbackBoard.name);
      } catch (fallbackError: any) {
        console.error("Fallback board creation also failed:", fallbackError);
        return NextResponse.json(
          { error: `Failed to create any board: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // Step 4: Export all tasks from all sprints in the sprint folder
    const sprintTasksMap = new Map<string, any[]>();

    for (const sprint of sprintFolderWithData.sprints) {
      const sprintTasks = (sprint as any).tasks || [];
      sprintTasksMap.set(sprint.id, sprintTasks);
    }

    const allTasks = sprintFolderWithData.sprints.flatMap(
      (sprint: any) => sprint.tasks || []
    );

    // Fetch detailed task data including assignee information
    const taskIds = allTasks.map((task: any) => task.id);
    const { data: detailedTasks, error: detailedTasksError } = await supabase
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
      .in("id", taskIds);

    if (detailedTasksError) {
      console.error("Error fetching detailed task data:", detailedTasksError);
      return NextResponse.json(
        { error: "Failed to fetch detailed task data" },
        { status: 500 }
      );
    }

    // Create a map of detailed task data by task ID
    const detailedTasksMap = new Map();
    detailedTasks.forEach((task: any) => {
      detailedTasksMap.set(task.id, task);
    });

    if (allTasks.length === 0) {
      return NextResponse.json(
        { error: "No tasks found in sprint folder to export" },
        { status: 400 }
      );
    }

    // Step 5: Create issues in Jira
    const exportedIssues: any[] = [];
    const sprintIssuesMap = new Map<string, any[]>();

    // Get available issue types and priorities
    let availableIssueTypes: any[] = [];
    let availablePriorities: any[] = [];

    try {
      [availableIssueTypes, availablePriorities] = await Promise.all([
        jiraApi.getProjectIssueTypes(finalProjectKey),
        jiraApi.getPriorities(),
      ]);
    } catch (error) {
      console.log("Failed to fetch issue types or priorities:", error);
    }

    let successfulExports = 0;
    let failedExports = 0;

    for (const task of allTasks) {
      // Get detailed task data
      const detailedTask = detailedTasksMap.get(task.id);
      if (!detailedTask) {
        console.warn(`No detailed data found for task ${task.id}, skipping`);
        continue;
      }

      try {
        // Determine issue type - prioritize Story over Task
        let issueType = "Story"; // Default
        if (availableIssueTypes.length > 0) {
          // First try to find Story type
          const storyType = availableIssueTypes.find(
            (type: any) => type.name.toLowerCase() === "story"
          );
          if (storyType) {
            issueType = storyType.name;
          } else {
            // Fallback to Task if Story not available
            const taskType = availableIssueTypes.find(
              (type: any) => type.name.toLowerCase() === "task"
            );
            if (taskType) {
              issueType = taskType.name;
            }
          }
        }

        // Map priority
        let priority = "Medium"; // Default
        if (task.priority && availablePriorities.length > 0) {
          const mappedPriority = mapLocalPriorityToJira(task.priority);
          const jiraPriority = availablePriorities.find(
            (p: any) => p.name === mappedPriority
          );
          if (jiraPriority) {
            priority = jiraPriority.name;
          }
        }

        // Create issue data without assignee to avoid field errors
        const issueData: any = {
          summary: detailedTask.name,
          description: detailedTask.description || "",
          issueType: issueType,
          priority: priority,
        };

        // Note: Assignee will be set later if needed, but not during creation
        // to avoid "Field 'assignee' cannot be set" errors
        // TODO: After issue creation, use jiraApi.assignIssue() to set assignee if needed

        const createdIssue = await jiraApi.createIssue(
          finalProjectKey,
          issueData
        );
        exportedIssues.push(createdIssue);

        // Step 2: Assign the issue if we have an assignee
        let assigneeAccountId = null;

        // Only check team member assignee since profiles don't have account_id
        if (
          detailedTask.assigned_member_id &&
          detailedTask.assigned_member &&
          detailedTask.assigned_member.account_id
        ) {
          assigneeAccountId = detailedTask.assigned_member.account_id;
          console.log(
            `Task ${detailedTask.id} has team member assignee with account_id: ${assigneeAccountId}`
          );
        }

        if (!assigneeAccountId) {
          console.log(
            `Task ${
              detailedTask.id
            } has no assignee with Jira account_id. Profile assignee: ${
              detailedTask.assignee?.email || "none"
            }, Team member assignee: ${
              detailedTask.assigned_member?.email || "none"
            }`
          );
        }

        if (assigneeAccountId) {
          try {
            console.log(
              `Assigning issue ${createdIssue.key} to account_id: ${assigneeAccountId}`
            );
            await jiraApi.assignIssue(createdIssue.key, assigneeAccountId);
          } catch (assignError) {
            console.log(
              `Failed to assign issue ${createdIssue.key} to ${assigneeAccountId}:`,
              assignError
            );
            // Continue with export even if assignment fails
          }
        }

        // Step 3: Update the issue with Story Points if available
        if (
          detailedTask.story_points &&
          typeof detailedTask.story_points === "number"
        ) {
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
                    [storyPointsFieldName]: detailedTask.story_points,
                  },
                };

                await jiraApi.updateIssue(createdIssue.key, {
                  fields: updatePayload.fields,
                });
                console.log(
                  `Updated story points for issue ${createdIssue.key}: ${detailedTask.story_points}`
                );
              } catch (updateError) {
                console.log(
                  `Failed to update story points field ${storyPointsFieldName} for issue ${createdIssue.key}:`,
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
              `Failed to update story points for issue ${createdIssue.key}:`,
              updateError
            );
            // Continue with export even if Story Points update fails
          }
        }

        // Group issues by sprint
        const sprintId = detailedTask.sprint_id;
        if (sprintId) {
          if (!sprintIssuesMap.has(sprintId)) {
            sprintIssuesMap.set(sprintId, []);
          }
          sprintIssuesMap.get(sprintId)!.push(createdIssue);
          console.log(`Added issue ${createdIssue.key} to sprint ${sprintId}`);
        } else {
          console.log(`Task ${detailedTask.name} has no sprint_id`);
        }

        successfulExports++;
        console.log(
          `Created issue: ${createdIssue.key} for task: ${detailedTask.name}`
        );
      } catch (error: any) {
        failedExports++;
        console.error(
          `Failed to create issue for task ${detailedTask?.name || "unknown"}:`,
          error
        );
        // Continue with other tasks even if this one fails
        continue;
      }
    }

    console.log(`=== ISSUE CREATION SUMMARY ===`);
    console.log(`Successful exports: ${successfulExports}`);
    console.log(`Failed exports: ${failedExports}`);
    console.log(`Total exported issues: ${exportedIssues.length}`);
    console.log(`================================`);

    if (exportedIssues.length === 0) {
      return NextResponse.json(
        { error: "No issues were successfully created in Jira" },
        { status: 400 }
      );
    }

    // Step 6: Create sprints and move issues
    const createdSprints: any[] = [];
    console.log(
      `Creating ${sprintFolderWithData.sprints.length} sprints in Jira board`
    );

    for (const sprint of sprintFolderWithData.sprints) {
      try {
        // Create sprint
        const sprintData = {
          name: sprint.name,
          goal: sprint.goal || "",
          startDate: sprint.start_date,
          endDate: sprint.end_date,
          originBoardId: boardId,
        };

        const createdSprint = await jiraApi.createSprint(sprintData);
        createdSprints.push(createdSprint);

        // Move issues to this sprint
        const sprintIssues = sprintIssuesMap.get(sprint.id) || [];
        console.log(
          `Sprint ${sprint.name} (${sprint.id}) has ${sprintIssues.length} issues`
        );

        if (sprintIssues.length > 0) {
          const issueKeys = sprintIssues.map((issue: any) => issue.key);
          console.log(`Moving issues to sprint ${sprint.name}:`, issueKeys);
          await jiraApi.moveIssuesToSprint(createdSprint.id, issueKeys);
          console.log(
            `Moved ${issueKeys.length} issues to sprint: ${sprint.name}`
          );
        } else {
          console.log(`No issues to move for sprint: ${sprint.name}`);
        }

        console.log(`Created sprint: ${createdSprint.name}`);
      } catch (error: any) {
        console.error(`Failed to create sprint ${sprint.name}:`, error);
      }
    }

    // Log summary of issue distribution
    console.log("=== ISSUE DISTRIBUTION SUMMARY ===");
    for (const [sprintId, issues] of sprintIssuesMap.entries()) {
      const sprint = sprintFolderWithData.sprints.find(
        (s: any) => s.id === sprintId
      );
      console.log(
        `Sprint ${sprint?.name || sprintId}: ${issues.length} issues`
      );
    }
    console.log("==================================");

    // Step 7: Update integration records
    try {
      const { data: existingIntegration } = await supabase
        .from("jira_integrations")
        .select("*")
        .eq("workspace_id", workspace.id)
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
          workspace_id: workspace.id,
          jira_domain: jiraCredentials.jira_domain,
          jira_email: jiraCredentials.jira_email,
          jira_api_token: jiraCredentials.jira_api_token,
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Failed to update integration records:", error);
    }

    return NextResponse.json({
      success: true,
      data: {
        tasksExported: exportedIssues.length,
        sprintsCreated: createdSprints.length,
        boardCreated: boardId,
        filterCreated: filterId,
        projectKey: finalProjectKey,
        exportedIssues,
        createdSprints,
      },
    });
  } catch (error: any) {
    console.error("Sprint folder export error:", error);
    return NextResponse.json(
      { error: `Failed to export sprint folder to Jira: ${error.message}` },
      { status: 500 }
    );
  }
}

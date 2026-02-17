import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import JiraAPI from "@/lib/jira-api";

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    console.log("Test export API called for workspace:", params.workspaceId);

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Test export request body:", body);

    const { jiraCredentials, projectKey, selectedProjectId } = body;

    // Validate required fields
    if (!jiraCredentials || !projectKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Jira API
    const jiraApi = new JiraAPI({
      domain: jiraCredentials.jira_domain,
      email: jiraCredentials.jira_email,
      apiToken: jiraCredentials.jira_api_token,
    });

    // Test 1: Test connection
    console.log("Testing Jira connection...");
    const connectionTest = await jiraApi.testConnection();
    console.log("Connection test result:", connectionTest);

    // Test 2: Get project info
    console.log("Getting project info...");
    let projectInfo;
    try {
      // Use the projects endpoint to get project info
      const projects = await jiraApi.getProjects();
      projectInfo = projects.find((p) => p.key === projectKey);
      if (!projectInfo) {
        throw new Error(`Project ${projectKey} not found`);
      }
      console.log("Project info:", projectInfo);
    } catch (error: any) {
      console.error("Failed to get project info:", error);
      return NextResponse.json(
        {
          error: "Failed to get project info",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Test 3: Get issue types
    console.log("Getting issue types...");
    let issueTypes;
    try {
      issueTypes = await jiraApi.getProjectIssueTypes(projectKey);
      console.log("Issue types:", issueTypes);
    } catch (error: any) {
      console.error("Failed to get issue types:", error);
      return NextResponse.json(
        {
          error: "Failed to get issue types",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Test 4: Get priorities
    console.log("Getting priorities...");
    let priorities;
    try {
      priorities = await jiraApi.getPriorities();
      console.log("Priorities:", priorities);
    } catch (error: any) {
      console.error("Failed to get priorities:", error);
      return NextResponse.json(
        {
          error: "Failed to get priorities",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Test 5: Create a test issue
    console.log("Creating test issue...");
    let testIssue;
    try {
      // Prioritize "Story" over "Task" or other types - with auto-fix
      console.log(
        "DEBUG - Test export available issue types:",
        issueTypes.map((it) => ({ id: it.id, name: it.name }))
      );

      // First try to find "Story" - check multiple variations
      let issueType = issueTypes.find((it) => {
        const name = it.name.toLowerCase().trim();
        return name === "story" || name === "user story";
      });
      console.log(
        "DEBUG - Test export found Story type (exact match):",
        issueType
      );

      // If exact story not found, try broader story match
      if (!issueType) {
        issueType = issueTypes.find((it) =>
          it.name.toLowerCase().includes("story")
        );
        console.log(
          "DEBUG - Test export found Story type (contains match):",
          issueType
        );
      }

      // AUTO-FIX: If no Story found, try to add it to the project
      if (!issueType) {
        console.log(
          "DEBUG - Test export: No Story type found! Attempting to add Story to project..."
        );
        try {
          const globalTypes = await jiraApi.getGlobalIssueTypes();
          const globalStory = globalTypes.find(
            (t: any) => t.name.toLowerCase().trim() === "story"
          );

          if (globalStory) {
            console.log(
              "DEBUG - Test export: Found global Story type, adding to project..."
            );
            const projectResponse = await jiraApi.getProjectDetails(projectKey);
            const currentIssueTypeIds = projectResponse.issueTypes.map(
              (it: any) => it.id
            );

            await jiraApi.updateProjectIssueTypes(projectKey, [
              ...currentIssueTypeIds,
              globalStory.id,
            ]);

            console.log(
              "DEBUG - Test export: Successfully added Story to project!"
            );

            // Refresh available issue types
            issueTypes = await jiraApi.getProjectIssueTypes(projectKey);
            console.log(
              "DEBUG - Test export: Refreshed available types:",
              issueTypes.map((it) => ({ id: it.id, name: it.name }))
            );

            // Try to find Story again
            issueType = issueTypes.find((it) => {
              const name = it.name.toLowerCase().trim();
              return name === "story" || name === "user story";
            });
            console.log(
              "DEBUG - Test export: After adding Story, found type:",
              issueType
            );
          } else {
            console.log(
              "DEBUG - Test export: Story type not available globally in Jira instance"
            );
          }
        } catch (error: any) {
          console.log(
            "DEBUG - Test export: Failed to add Story to project:",
            error?.message || error
          );
        }
      }

      // If still no Story, try "Task"
      if (!issueType) {
        issueType = issueTypes.find(
          (it) => it.name.toLowerCase().trim() === "task"
        );
        console.log("DEBUG - Test export using Task type:", issueType);
      }

      // If neither Story nor Task found, try "Issue"
      if (!issueType) {
        issueType = issueTypes.find(
          (it) => it.name.toLowerCase().trim() === "issue"
        );
        console.log("DEBUG - Test export using Issue type:", issueType);
      }

      // Fallback to first available
      if (!issueType) {
        issueType = issueTypes[0];
        console.log(
          "DEBUG - Test export using first available type:",
          issueType
        );
      }

      console.log(
        `DEBUG - TEST EXPORT FINAL ISSUE TYPE: "${issueType?.name}" (This should be "Story" if available!)`
      );

      const priority =
        priorities.find(
          (p) =>
            p.name.toLowerCase() === "medium" ||
            p.name.toLowerCase() === "normal"
        ) || priorities[0];

      // Create test issue with story points
      const testIssueData: any = {
        summary: "Test Issue from SprintiQ Export",
        description: "This is a test issue created during the export process.",
        issueType: issueType.name,
        priority: priority.name,
      };

      // Get the correct story points field name for this project
      const storyPointsFieldName = await jiraApi.getStoryPointsFieldName(
        projectKey
      );

      if (storyPointsFieldName) {
        console.log(
          `DEBUG - Test export: Using story points field: ${storyPointsFieldName}`
        );
        testIssueData[storyPointsFieldName] = 5;
      } else {
        console.log(
          "DEBUG - Test export: No story points field found, trying common field names"
        );
        // Fallback to common field names
        testIssueData.customfield_10016 = 5; // Common story points field
        testIssueData["Story Points"] = 5; // Alternative field name
        testIssueData.storyPoints = 5; // Another alternative
      }

      testIssue = await jiraApi.createIssue(projectKey, testIssueData);
      console.log("Test issue created:", testIssue);
    } catch (error: any) {
      console.error("Failed to create test issue:", error);
      return NextResponse.json(
        {
          error: "Failed to create test issue",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Test 6: Get tasks from database
    console.log("Getting tasks from database...");
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("workspace_id", params.workspaceId)
      .single();

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select(
        `
        *,
        status:statuses(*),
        project:projects(*)
      `
      )
      .eq("workspace_id", workspace.id)
      .eq("project_id", selectedProjectId)
      .limit(5); // Just get first 5 tasks for testing

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      return NextResponse.json(
        {
          error: "Failed to fetch tasks",
          details: tasksError.message,
        },
        { status: 500 }
      );
    }

    console.log("Found tasks:", tasks?.length || 0);

    return NextResponse.json({
      success: true,
      data: {
        connectionTest,
        projectInfo: {
          key: projectInfo.key,
          name: projectInfo.name,
          id: projectInfo.id,
        },
        issueTypes: issueTypes.map((it) => ({ id: it.id, name: it.name })),
        priorities: priorities.map((p) => ({ id: p.id, name: p.name })),
        testIssue: {
          key: testIssue.key,
          id: testIssue.id,
          summary: testIssue.fields.summary,
        },
        tasksFound: tasks?.length || 0,
        sampleTasks: tasks?.slice(0, 2).map((t) => ({
          id: t.id,
          name: t.name,
          status: t.status?.name,
          project: t.project?.name,
        })),
      },
    });
  } catch (error: any) {
    console.error("Test export error:", error);
    return NextResponse.json(
      { error: "Test export failed", details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    console.log(
      "Sprint Folder JSON Export API called for workspace:",
      params.workspaceId
    );

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
      .eq("workspace_id", params.workspaceId)
      .single();

    if (workspaceError || !workspace) {
      console.error("Workspace not found:", workspaceError);
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { sprintFolderId } = body;

    if (!sprintFolderId) {
      return NextResponse.json(
        { error: "Sprint folder ID is required" },
        { status: 400 }
      );
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
      console.error("Sprint folder not found:", sprintFolderError);
      return NextResponse.json(
        { error: "Sprint folder not found" },
        { status: 404 }
      );
    }

    // Get sprints for this sprint folder
    const { data: sprints, error: sprintsError } = await supabase
      .from("sprints")
      .select("*")
      .eq("sprint_folder_id", sprintFolderId)
      .order("created_at", { ascending: true });

    if (sprintsError) {
      console.error("Error fetching sprints:", sprintsError);
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
        .in("sprint_id", sprintIds)
        .order("created_at", { ascending: true });

      if (tasksError) {
        console.error("Error fetching tasks:", tasksError);
        return NextResponse.json(
          { error: "Failed to fetch tasks" },
          { status: 500 }
        );
      }

      tasksData = tasks || [];
    }

    // Group tasks by sprint
    const sprintsWithTasks =
      sprints?.map((sprint) => ({
        ...sprint,
        tasks: tasksData.filter((task) => task.sprint_id === sprint.id),
      })) || [];

    // Prepare export data
    const exportData = {
      exportInfo: {
        exportedAt: new Date().toISOString(),
        workspace: {
          id: workspace.id,
          workspace_id: params.workspaceId,
          name: workspace.name,
        },
        sprintFolder: {
          id: sprintFolder.id,
          sprint_folder_id: sprintFolder.sprint_folder_id,
          name: sprintFolder.name,
          description: sprintFolder.description,
          created_at: sprintFolder.created_at,
          updated_at: sprintFolder.updated_at,
        },
        space: sprintFolder.space,
      },
      sprints: sprintsWithTasks,
      summary: {
        totalSprints: sprints?.length || 0,
        totalTasks: tasksData.length,
        tasksBySprint: sprintsWithTasks.reduce((acc, sprint) => {
          acc[sprint.name] = sprint.tasks.length;
          return acc;
        }, {} as Record<string, number>),
        tasksByStatus: tasksData.reduce((acc, task) => {
          const statusName = task.status?.name || "Unknown";
          acc[statusName] = (acc[statusName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };

    // Return JSON data
    return NextResponse.json({
      success: true,
      data: exportData,
      filename: `${sprintFolder.name.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_sprint_folder_export_${new Date().toISOString().split("T")[0]}.json`,
    });
  } catch (error: any) {
    console.error("Sprint folder JSON export error:", error);
    return NextResponse.json(
      { error: "Failed to export sprint folder data to JSON" },
      { status: 500 }
    );
  }
}

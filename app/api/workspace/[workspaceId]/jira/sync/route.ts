import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { JiraSyncService } from "@/lib/jira-sync-service";
import type { JiraIntegration, Task, Status } from "@/lib/database.types";

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    console.log(`Starting Jira sync for project: ${projectId}`);

    // Get workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("workspace_id", params.workspaceId)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Get project and check if it's a Jira project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("workspace_id", workspace.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.type !== "jira" || !project.external_id) {
      return NextResponse.json(
        { error: "Project is not a Jira project" },
        { status: 400 }
      );
    }

    console.log(
      `Project ${project.name} is a Jira project with external ID: ${project.external_id}`
    );

    // Get Jira integration
    const { data: integration, error: integrationError } = await supabase
      .from("jira_integrations")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("is_active", true)
      .single();

    if (integrationError || !integration) {
      return NextResponse.json(
        { error: "Jira integration not found" },
        { status: 404 }
      );
    }

    // Create JiraSyncService instance
    const syncService = new JiraSyncService(supabase, integration, project);

    // Perform bidirectional sync
    const syncResult = await syncService.performBidirectionalSync({
      pushToJira: true,
      pullFromJira: true,
      syncTasks: true,
      syncStatuses: true,
    });

    if (!syncResult.success) {
      return NextResponse.json({ error: syncResult.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: syncResult.message,
      data: syncResult.data,
    });
  } catch (error: any) {
    console.error("Jira sync error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

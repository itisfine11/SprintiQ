import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import JiraAPI from "@/lib/jira-api";

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    console.log("Users API called for workspace:", params.workspaceId);

    const supabase = await createServerSupabaseClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, find the workspace by workspace_id
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("workspace_id", params.workspaceId)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Check workspace access using the actual workspace id
    const { data: workspaceMember } = await supabase
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .single();

    if (!workspaceMember) {
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { jira_domain, jira_email, jira_api_token, project_key } = body;

    if (!jira_domain || !jira_email || !jira_api_token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Jira API
    const jiraAPI = new JiraAPI({
      domain: jira_domain,
      email: jira_email,
      apiToken: jira_api_token,
    });

    let users;
    if (project_key) {
      // Get users for specific project
      users = await jiraAPI.getProjectUsers(project_key);
    } else {
      // Get all users
      users = await jiraAPI.getAllUsers();
    }

    console.log(`Retrieved ${users.length} users from Jira`);

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error("Error fetching Jira users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch Jira users" },
      { status: 500 }
    );
  }
}

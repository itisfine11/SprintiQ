import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import JiraAPI from "@/lib/jira-api";

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    console.log("Import team API called for workspace:", params.workspaceId);

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
    const {
      jira_domain,
      jira_email,
      jira_api_token,
      team_name,
      team_description,
      team_members,
    } = body;

    if (
      !jira_domain ||
      !jira_email ||
      !jira_api_token ||
      !team_name ||
      !team_members
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get default role and level IDs
    const { data: defaultRole } = await supabase
      .from("roles")
      .select("id")
      .limit(1)
      .single();

    const { data: defaultLevel } = await supabase
      .from("levels")
      .select("id")
      .limit(1)
      .single();

    if (!defaultRole || !defaultLevel) {
      return NextResponse.json(
        { error: "Default role or level not found" },
        { status: 500 }
      );
    }

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: team_name,
        description: team_description || null,
        workspace_id: workspace.id,
        type: "jira",
      })
      .select()
      .single();

    if (teamError) {
      console.error("Error creating team:", teamError);
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      );
    }

    console.log(`Created team: ${team.name} (${team.id})`);

    // Create team members with validation
    const teamMembersToInsert = team_members
      .filter((member: any) => member.accountId) // Only include members with accountId
      .map((member: any) => ({
        team_id: team.id,
        name: member.displayName || null, // Save the display name
        email:
          member.email && member.email.trim() !== ""
            ? member.email.trim()
            : null,
        role_id: member.roleId || defaultRole.id,
        level_id: member.levelId || defaultLevel.id,
        description: null,
        is_registered: false,
        account_id: member.accountId,
        type: "jira",
      }));

    if (teamMembersToInsert.length === 0) {
      // Try to delete the team if no valid members
      await supabase
        .from("teams")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", team.id);
      return NextResponse.json(
        { error: "No valid team members to add" },
        { status: 400 }
      );
    }

    const { data: createdMembers, error: membersError } = await supabase
      .from("team_members")
      .insert(teamMembersToInsert)
      .select();

    if (membersError) {
      console.error("Error creating team members:", membersError);
      // Try to delete the team if member creation fails
      await supabase
        .from("teams")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", team.id);
      return NextResponse.json(
        { error: "Failed to create team members" },
        { status: 500 }
      );
    }

    console.log(`Created ${createdMembers?.length || 0} team members`);

    return NextResponse.json({
      success: true,
      message: "Team imported successfully",
      data: {
        team: {
          id: team.id,
          name: team.name,
          description: team.description,
          type: team.type,
        },
        members: createdMembers?.length || 0,
      },
    });
  } catch (error: any) {
    console.error("Error importing team from Jira:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import team" },
      { status: 500 }
    );
  }
}

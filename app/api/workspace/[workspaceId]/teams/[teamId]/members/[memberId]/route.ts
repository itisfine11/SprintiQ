import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string; teamId: string; memberId: string }>;
  }
) {
  try {
    const { workspaceId, teamId, memberId } = await params;

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the workspace exists and user has access
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("workspace_id", workspaceId)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Verify the team exists and belongs to this workspace
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, workspace_id")
      .eq("id", teamId)
      .eq("workspace_id", workspace.id)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Verify the team member exists and belongs to this team
    const { data: teamMember, error: memberError } = await supabase
      .from("team_members")
      .select("id, team_id, user_id, email")
      .eq("id", memberId)
      .eq("team_id", teamId)
      .single();

    if (memberError || !teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete the team member
    const { error: deleteError } = await supabase
      .from("team_members")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", memberId);

    if (deleteError) {
      console.error("Error deleting team member:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete team member" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Team member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete team member API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

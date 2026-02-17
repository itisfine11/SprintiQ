"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import type {
  Team,
  TeamMember,
  Role,
  Level,
  Profile,
} from "@/lib/database.types";
import TeamsSidebar from "@/components/workspace/teams/teams-sidebar";
import TeamsDashboard from "@/components/workspace/teams/teams-dashboard";
import TeamsList from "@/components/workspace/teams/teams-list";
import DatabaseCheck from "@/components/workspace/teams/database-check";
import SupabaseTest from "@/components/workspace/teams/supabase-test";
import SimpleTeamTest from "@/components/workspace/teams/simple-team-test";
import { LoadingPage } from "@/components/ui/loading-page";
import { Button } from "@/components/ui/button";

type ViewType = "dashboard" | "list";

export default function TeamsPage() {
  const { user } = useAuth();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [view, setView] = useState<ViewType>("dashboard");
  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDatabaseCheck, setShowDatabaseCheck] = useState(false);
  const [showSupabaseTest, setShowSupabaseTest] = useState(false);
  const [showTeamMembersDebug, setShowTeamMembersDebug] = useState(false);
  const [showSimpleTeamTest, setShowSimpleTeamTest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientSupabaseClient();

  useEffect(() => {
    fetchTeamsData();
  }, [workspaceId, user]);

  const fetchTeamsData = async () => {
    try {
      setLoading(true);

      console.log("Fetching teams data for workspace:", workspaceId);

      // Get workspace UUID first
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .single();

      if (workspaceError) {
        console.log("Workspace fetch error:", workspaceError);
        throw workspaceError;
      }

      if (!workspaceData) {
        throw new Error("Workspace not found");
      }

      // Test 1: Simple teams query without joins using UUID
      console.log("Testing simple teams query with UUID:", workspaceData.id);
      const { data: simpleTeamsData, error: simpleTeamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("workspace_id", workspaceData.id)
        .is("deleted_at", null);

      console.log("Simple teams query result:", {
        data: simpleTeamsData,
        error: simpleTeamsError,
      });

      if (simpleTeamsError) {
        console.log("Simple teams query error:", simpleTeamsError);
        throw new Error(
          `Simple teams query failed: ${simpleTeamsError.message}`
        );
      }

      // Test 2: Check if team_members table exists
      console.log("Testing team_members table...");
      const { data: teamMembersTest, error: teamMembersError } = await supabase
        .from("team_members")
        .select("id")
        .is("deleted_at", null)
        .limit(1);

      console.log("Team members test result:", {
        data: teamMembersTest,
        error: teamMembersError,
      });

      if (teamMembersError) {
        console.log("Team members table error:", teamMembersError);
        throw new Error(
          `Team members table not accessible: ${teamMembersError.message}`
        );
      }

      // Test 3: Check if roles table exists
      console.log("Testing roles table...");
      const { data: rolesTest, error: rolesError } = await supabase
        .from("roles")
        .select("id")
        .limit(1);

      console.log("Roles test result:", { data: rolesTest, error: rolesError });

      if (rolesError) {
        console.log("Roles table error:", rolesError);
        throw new Error(`Roles table not accessible: ${rolesError.message}`);
      }

      // Test 4: Check if levels table exists
      console.log("Testing levels table...");
      const { data: levelsTest, error: levelsError } = await supabase
        .from("levels")
        .select("id")
        .limit(1);

      console.log("Levels test result:", {
        data: levelsTest,
        error: levelsError,
      });

      if (levelsError) {
        console.log("Levels table error:", levelsError);
        throw new Error(`Levels table not accessible: ${levelsError.message}`);
      }

      // Test 5: Check if profiles table exists
      console.log("Testing profiles table...");
      const { data: profilesTest, error: profilesError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      console.log("Profiles test result:", {
        data: profilesTest,
        error: profilesError,
      });

      if (profilesError) {
        console.log("Profiles table error:", profilesError);
        throw new Error(
          `Profiles table not accessible: ${profilesError.message}`
        );
      }

      // If all tests pass, try the complex query
      console.log("All tables exist, trying complex query...");

      // First, get all teams for the workspace
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("workspace_id", workspaceData.id)
        .is("deleted_at", null);

      console.log("Teams query result:", {
        data: teamsData,
        error: teamsError,
      });

      if (teamsError) {
        console.log("Teams query error:", teamsError);
        throw new Error(`Teams query failed: ${teamsError.message}`);
      }

      // Then, for each team, get its members
      const teamsWithMembers = [];
      if (teamsData) {
        for (const team of teamsData) {
          console.log(`Fetching members for team: ${team.name} (${team.id})`);

          const { data: teamMembersData, error: teamMembersError } =
            await supabase
              .from("team_members")
              .select(
                `
              id,
              user_id,
              email,
              name,
              role_id,
              level_id,
              is_registered,
              description,
              created_at,
              account_id,
              profile:profiles!user_id(*),
              role:roles!role_id(*),
              level:levels!level_id(*),
              weekly_hours
            `
              )
              .is("deleted_at", null)
              .eq("team_id", team.id);

          if (teamMembersError) {
            console.log(
              `Team members query error for team ${team.id}:`,
              teamMembersError
            );
            // Continue with other teams even if one fails
          }

          teamsWithMembers.push({
            ...team,
            team_members: teamMembersData || [],
          });
        }
      }

      // Fetch roles for this user and workspace
      let rolesData, rolesFetchError;

      try {
        const result = await supabase
          .from("roles")
          .select("*")
          .eq("created_by", user?.id)
          .eq("workspace_id", workspaceData.id);

        rolesData = result.data;
        rolesFetchError = result.error;
      } catch (error) {
        console.log("Error with new columns, trying fallback:", error);
        // Fallback: fetch all roles if new columns don't exist
        const result = await supabase.from("roles").select("*");

        rolesData = result.data;
        rolesFetchError = result.error;
      }

      if (rolesFetchError) {
        console.log("Roles fetch error:", rolesFetchError);
        throw rolesFetchError;
      }

      const { data: levelsData, error: levelsFetchError } = await supabase
        .from("levels")
        .select("*");

      if (levelsFetchError) {
        console.log("Levels fetch error:", levelsFetchError);
        throw levelsFetchError;
      }

      // Fetch workspace member user IDs first
      const { data: workspaceMemberIds, error: workspaceMembersError } =
        await supabase
          .from("workspace_members")
          .select("user_id")
          .eq("workspace_id", workspaceData.id)
          .eq("status", "active");

      if (workspaceMembersError) {
        console.log("Workspace members fetch error:", workspaceMembersError);
        throw workspaceMembersError;
      }

      // Fetch only profiles of users who are members of the current workspace
      let profilesData: any[] = [];
      if (workspaceMemberIds && workspaceMemberIds.length > 0) {
        const userIds = workspaceMemberIds.map((member) => member.user_id);
        const { data: profilesResult, error: profilesFetchError } =
          await supabase.from("profiles").select("*").in("id", userIds);

        if (profilesFetchError) {
          console.log("Profiles fetch error:", profilesFetchError);
          throw profilesFetchError;
        }
        profilesData = profilesResult || [];
      }

      setTeams(teamsWithMembers || []);
      setRoles(rolesData || []);
      setLevels(levelsData || []);
      setProfiles(profilesData || []);

      if (teamsWithMembers && teamsWithMembers.length > 0) {
        setSelectedTeam(teamsWithMembers[0]);
      }
    } catch (error) {
      console.log("Error fetching teams data:", error);
      console.log("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        stack: error instanceof Error ? error.stack : undefined,
      });
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-muted-foreground">Error loading teams data</p>
        </div>

        <div className="mb-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-destructive mb-2">
              Error Details:
            </h3>
            <p className="text-sm text-destructive">{error}</p>
          </div>

          <Button
            onClick={() => setShowDatabaseCheck(!showDatabaseCheck)}
            variant="outline"
            className="mr-2"
          >
            {showDatabaseCheck ? "Hide" : "Show"} Database Check
          </Button>

          <Button
            onClick={() => setShowSupabaseTest(!showSupabaseTest)}
            variant="outline"
            className="mr-2"
          >
            {showSupabaseTest ? "Hide" : "Show"} Supabase Test
          </Button>

          <Button
            onClick={() => setShowTeamMembersDebug(!showTeamMembersDebug)}
            variant="outline"
            className="mr-2"
          >
            {showTeamMembersDebug ? "Hide" : "Show"} Team Members Debug
          </Button>

          <Button
            onClick={() => setShowSimpleTeamTest(!showSimpleTeamTest)}
            variant="outline"
            className="mr-2"
          >
            {showSimpleTeamTest ? "Hide" : "Show"} Simple Team Test
          </Button>

          <Button
            onClick={() => {
              setError(null);
              fetchTeamsData();
            }}
            variant="default"
          >
            Retry
          </Button>
        </div>

        {showDatabaseCheck && <DatabaseCheck />}
        {showSupabaseTest && <SupabaseTest />}
        {showSimpleTeamTest && <SimpleTeamTest />}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <TeamsSidebar
        view={view}
        setView={setView}
        teams={teams}
        roles={roles}
        levels={levels}
        profiles={profiles}
        workspaceId={workspaceId}
        onRefresh={fetchTeamsData}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden" id="sidebar-teams-dashboard">
        {view === "dashboard" ? (
          <TeamsDashboard
            teams={teams}
            roles={roles}
            levels={levels}
            profiles={profiles}
            workspaceId={workspaceId}
            onRefresh={fetchTeamsData}
          />
        ) : (
          <TeamsList
            teams={teams}
            roles={roles}
            levels={levels}
            profiles={profiles}
            workspaceId={workspaceId}
            onRefresh={fetchTeamsData}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
          />
        )}
      </div>
    </div>
  );
}

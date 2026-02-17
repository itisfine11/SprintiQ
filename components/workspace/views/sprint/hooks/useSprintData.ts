import { useState, useCallback, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type {
  Workspace,
  Space,
  Sprint,
  SprintFolder,
  Task,
  Status,
  StatusType,
  Tag,
  Profile,
} from "@/lib/database.types";
import type { SprintViewState } from "../types";
import { createEvent } from "@/lib/events";
import { useAuth } from "@/contexts/auth-context";

interface UseSprintDataProps {
  workspace: Workspace;
  space: Space;
  sprintFolder: SprintFolder;
  sprint: Sprint;
  initialTasks: Task[];
  initialStatuses: Status[];
  initialTags: Tag[];
}

export function useSprintData({
  workspace,
  space,
  sprintFolder,
  sprint,
  initialTasks,
  initialStatuses,
  initialTags,
}: UseSprintDataProps) {
  console.log("useSprintData initialized with:", {
    workspace: {
      id: workspace?.id,
      workspace_id: workspace?.workspace_id,
      name: workspace?.name,
    },
    space: {
      id: space?.id,
      space_id: space?.space_id,
      name: space?.name,
    },
    sprint: {
      id: sprint?.id,
      name: sprint?.name,
    },
  });
  const { user } = useAuth();
  console.log(
    "Current user in useSprintData:",
    user ? { id: user.id, email: user.email } : "No user"
  );
  const [supabase] = useState(() => createClientSupabaseClient());
  const [state, setState] = useState<SprintViewState>({
    view: "board",
    activeViews: ["board", "list"],
    tasks: initialTasks,
    statuses: initialStatuses,
    tags: initialTags,
    statusTypes: [],
    activeTask: null,
    activeStatus: null,
    expandedTasks: new Set(),
    collapsedStatuses: new Set(),
    visibleColumns: new Set(["assignee", "dueDate", "priority", "subtasks"]),
    allSubtasks: [],
    workspaceMembers: [],
    teamMembers: [],
    isLoading: false,
    taskToDelete: null,
    sprintToDelete: null,
    createTaskModalOpen: false,
    createStatusModalOpen: false,
    customizeListModalOpen: false,
    subtaskParentId: undefined,
    // Sprint action modals
    renameSprintModalOpen: false,
    moveSprintModalOpen: false,
    sprintInfoModalOpen: false,
    statusSettingsModalOpen: false,
    statusToEdit: null,
    filters: {
      status: [],
      tags: [],
      priority: [],
      assigned: [],
      sprintPoints: { min: 0, max: 100 },
      showUnassignedOnly: false,
    },
    filterModalOpen: false,
  });

  const updateState = useCallback((updates: Partial<SprintViewState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      const { data: tasksData } = await supabase
        .from("tasks")
        .select(
          `
          *,
          assignee:profiles!tasks_assignee_id_fkey(id, full_name, avatar_url),
          assigned_member:team_members!tasks_assigned_member_id_fkey(
            id,
            name,
            email,
            role_id,
            level_id,
            description,
            is_registered,
            role:roles(name),
            level:levels(name)
          ),
          created_by_profile:profiles!tasks_created_by_fkey(id, full_name, avatar_url),
          status:statuses(*),
          task_tags(tag:tags(*))
        `
        )
        .eq("sprint_id", sprint.id)
        .order("created_at", { ascending: false });

      if (tasksData) {
        updateState({ tasks: tasksData as Task[] });
      }
    } catch (error) {
      console.log("Error refreshing tasks:", error);
    }
  }, [supabase, sprint.id, updateState]);

  const refreshStatuses = useCallback(async () => {
    try {
      const { data: statusesData } = await supabase
        .from("statuses")
        .select(
          `
          *,
          status_type:status_types!statuses_status_type_id_fkey(*)
        `
        )
        .eq("workspace_id", workspace.id)
        .eq("type", "space")
        .is("deleted_at", null)
        .eq("space_id", space.id)
        .order("position", { ascending: true });

      if (statusesData) {
        console.log("[refreshStatuses] statusesData:", statusesData);
        updateState({ statuses: statusesData });
      }
    } catch (error) {
      console.log("Error refreshing statuses:", error);
    }
  }, [supabase, workspace.id, space.id, updateState]);

  const loadAllSubtasks = useCallback(async () => {
    try {
      const { data: subtasksData } = await supabase
        .from("tasks")
        .select(
          `
          *,
          assignee:profiles!tasks_assignee_id_fkey(id, full_name, avatar_url),
          assigned_member:team_members!tasks_assigned_member_id_fkey(
            id,
            name,
            email,
            role_id,
            level_id,
            description,
            is_registered,
            role:roles(name),
            level:levels(name)
          ),
          created_by_profile:profiles!tasks_created_by_fkey(id, full_name, avatar_url),
          status:statuses(*),
          task_tags(tag:tags(*))
        `
        )
        .eq("sprint_id", sprint.id)
        .not("parent_task_id", "is", null);

      if (subtasksData) {
        updateState({ allSubtasks: subtasksData as Task[] });
      }
    } catch (error) {
      console.log("Error loading subtasks:", error);
    }
  }, [supabase, sprint.id, updateState]);

  const createEventLog = useCallback(
    async (eventData: any) => {
      try {
        if (!user?.id) {
          console.warn("No user found, skipping event creation");
          return;
        }

        await createEvent({
          ...eventData,
          userId: user.id,
          workspaceId: workspace.id,
          spaceId: space.id,
          sprintId: sprint.id,
        });
      } catch (error) {
        console.log("Error creating event:", error);
      }
    },
    [user?.id, workspace.id, space.id, sprint.id]
  );

  const fetchWorkspaceMembers = useCallback(async () => {
    console.log("fetchWorkspaceMembers called with workspace:", workspace);
    if (!workspace?.id) {
      console.log("No workspace ID, returning early");
      return;
    }
    try {
      // Test the connection first
      console.log("Testing Supabase connection...");
      const { data: testData, error: testError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("id", workspace.id)
        .limit(1);

      if (testError) {
        console.log("Supabase connection test failed:", {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code,
        });
        return;
      }

      console.log("Supabase connection test successful:", testData);
      // First get the workspace member user IDs
      console.log(
        "Querying workspace_members with workspace_id:",
        workspace.id
      );
      const { data: memberRecords, error: memberError } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspace.id)
        .eq("status", "active");

      console.log("workspace_members query result:", {
        data: memberRecords,
        error: memberError,
        count: memberRecords?.length || 0,
      });

      if (memberError) {
        console.log("Error fetching workspace member IDs:", {
          message: memberError.message,
          details: memberError.details,
          hint: memberError.hint,
          code: memberError.code,
        });
        return;
      }

      if (!memberRecords || memberRecords.length === 0) {
        console.log("No workspace members found, setting empty array");
        updateState({ workspaceMembers: [] });
        return;
      }

      const userIds = memberRecords.map((m) => m.user_id);
      console.log("Fetching profiles for user IDs:", userIds);

      // Then get the profiles for those user IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, email")
        .in("id", userIds);

      if (profilesError) {
        console.log("Error fetching profiles:", profilesError);
        console.log("Error details:", {
          message: profilesError.message,
          details: profilesError.details,
          hint: profilesError.hint,
          code: profilesError.code,
        });
        return;
      }

      console.log(
        "Successfully fetched workspace members:",
        profilesData?.length || 0
      );
      updateState({ workspaceMembers: (profilesData || []) as Profile[] });
    } catch (error) {
      console.log("Error fetching workspace members:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }, [workspace?.id, supabase, updateState]);

  const fetchStatusTypes = useCallback(async () => {
    try {
      const { data: statusTypes } = await supabase
        .from("status_types")
        .select("*")
        .order("name", { ascending: true });

      if (statusTypes) {
        updateState({ statusTypes });
      }
    } catch (error) {
      console.log("Error fetching status types:", error);
    }
  }, [supabase, updateState]);

  const fetchTeamMembers = useCallback(async () => {
    if (!workspace?.id) {
      return;
    }
    try {
      // Test the connection first
      const { data: testData, error: testError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("id", workspace.id)
        .limit(1);

      if (testError) {
        console.log("Supabase connection test failed for teams:", {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code,
        });
        return;
      }

      const { data: teams, error: teamsError } = await supabase
        .from("teams")
        .select("id")
        .eq("workspace_id", workspace.id)
        .is("deleted_at", null);

      if (teamsError) {
        console.log("Error fetching teams:", {
          message: teamsError.message,
          details: teamsError.details,
          hint: teamsError.hint,
          code: teamsError.code,
        });
        return;
      }

      if (!teams || teams.length === 0) {
        console.log("No teams found, setting empty array");
        updateState({ teamMembers: [] });
        return;
      }

      // Get all team members from all teams
      const { data: teamMembersData, error: teamMembersError } = await supabase
        .from("team_members")
        .select(
          `
          id,
          name,
          email,
          role_id,
          level_id,
          description,
          is_registered,
          user_id,
          account_id,
          profile:profiles!team_members_user_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          ),
          role:roles(name),
          level:levels(name)
        `
        )
        .in(
          "team_id",
          teams.map((t) => t.id)
        );

      if (teamMembersError) {
        console.log("Error fetching team members:", {
          message: teamMembersError.message,
          details: teamMembersError.details,
          hint: teamMembersError.hint,
          code: teamMembersError.code,
        });
        return;
      }

      updateState({ teamMembers: teamMembersData || [] });
    } catch (error) {
      console.log("Error fetching team members:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }, [workspace?.id, supabase, updateState]);

  // Load workspace members
  useEffect(() => {
    fetchWorkspaceMembers();
  }, [fetchWorkspaceMembers]);

  // Load team members
  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Load status types
  useEffect(() => {
    fetchStatusTypes();
  }, [fetchStatusTypes]);

  // Load all subtasks on mount
  useEffect(() => {
    loadAllSubtasks();
  }, [loadAllSubtasks]);

  return {
    state,
    updateState,
    supabase,
    refreshTasks,
    refreshStatuses,
    loadAllSubtasks,
    fetchWorkspaceMembers,
    createEventLog,
    fetchStatusTypes,
    fetchTeamMembers,
  };
}

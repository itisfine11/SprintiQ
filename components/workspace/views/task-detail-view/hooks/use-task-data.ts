import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { getTaskActivities } from "@/lib/events";
import type { Task, Workspace } from "@/lib/database.types";

export const useTaskData = (task: Task, workspace: Workspace) => {
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [taskAssignees, setTaskAssignees] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const supabase = createClientSupabaseClient();

  const loadSubtasks = async () => {
    if (!task.id) {
      console.error("❌ Task ID is missing:", task.id);
      return;
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("❌ Auth error:", authError);
        return;
      }

      const { data: subtasksData, error } = await supabase
        .from("tasks")
        .select(
          `
          *,
          assignee:profiles!tasks_assignee_id_fkey(*),
          status:statuses(*),
          task_tags(
            tag:tags(*)
          )
        `
        )
        .eq("parent_task_id", task.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Query failed:", error);
        return;
      }

      setSubtasks(subtasksData || []);
    } catch (exception) {
      console.error("💥 Exception caught:", {
        message: exception instanceof Error ? exception.message : "Unknown",
        stack: exception instanceof Error ? exception.stack : "No stack",
        type: typeof exception,
      });
    }
  };

  const loadWorkspaceMembers = async () => {
    try {
      const { data: members, error: membersError } = await supabase
        .from("workspace_members")
        .select("id, user_id, email, role")
        .eq("workspace_id", workspace.id)
        .eq("status", "active");

      if (membersError) {
        console.error("Error loading workspace members:", membersError);
        return;
      }

      if (!members || members.length === 0) {
        setWorkspaceMembers([]);
        return;
      }

      const userIds = members.map((m) => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error loading profiles:", profilesError);
        const membersWithoutProfiles = members.map((member) => ({
          id: member.user_id,
          full_name: "Unknown User",
          email: member.email || "",
          avatar_url: null,
        }));
        setWorkspaceMembers(membersWithoutProfiles);
        return;
      }

      const formattedMembers = members.map((member) => {
        const profile = profiles?.find((p) => p.id === member.user_id);
        return {
          id: member.user_id,
          full_name: profile?.full_name || "Unknown User",
          email: profile?.email || member.email || "",
          avatar_url: profile?.avatar_url || null,
        };
      });

      setWorkspaceMembers(formattedMembers);
    } catch (error) {
      console.error("Exception in loadWorkspaceMembers:", error);
    }
  };

  const loadTeamMembers = async () => {
    if (!workspace?.id) return;
    try {
      // Get all teams in the workspace
      const { data: teams, error: teamsError } = await supabase
        .from("teams")
        .select("id")
        .eq("workspace_id", workspace.id);

      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        return;
      }

      if (!teams || teams.length === 0) {
        console.log("No teams found, setting empty array");
        setTeamMembers([]);
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
        console.error("Error fetching team members:", teamMembersError);
        return;
      }

      console.log(
        "Successfully fetched team members:",
        teamMembersData?.length || 0
      );
      setTeamMembers(teamMembersData || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const loadTaskAssignees = async () => {
    try {
      console.log("Loading task assignees for task:", {
        taskId: task.id,
        assignee_id: task.assignee_id,
        assigned_member_id: task.assigned_member_id,
        assignee: task.assignee,
        assigned_member: task.assigned_member,
      });

      const assignees = [];

      // Add profile assignee if exists
      if (task.assignee_id && task.assignee) {
        console.log("Adding profile assignee:", task.assignee);
        assignees.push({
          ...task.assignee,
          type: "profile",
        });
      }

      // Add team member assignee if exists
      if (task.assigned_member_id && task.assigned_member) {
        console.log("Adding team member assignee:", task.assigned_member);
        assignees.push({
          ...task.assigned_member,
          id: `team-${task.assigned_member_id}`,
          name:
            task.assigned_member.profile?.full_name ||
            task.assigned_member.name,
          type: "team",
        });
      }

      console.log("Final assignees array:", assignees);
      setTaskAssignees(assignees);
    } catch (error) {
      console.error("Error loading task assignees:", error);
    }
  };

  const loadTaskActivities = async () => {
    try {
      const activitiesData = await getTaskActivities(task.id, workspace.id);
      setActivities(activitiesData || []);
    } catch (error) {
      console.error("Error loading task activities:", error);
    }
  };

  useEffect(() => {
    console.log("Task detail view loaded with:", {
      taskId: task.id,
      workspace: { id: workspace.id, name: workspace.name },
    });

    loadSubtasks();
    loadWorkspaceMembers();
    loadTeamMembers();
    loadTaskAssignees();
    loadTaskActivities();
  }, [task.id]);

  useEffect(() => {
    loadTaskAssignees();
  }, [
    task.assignee_id,
    task.assignee,
    task.assigned_member_id,
    task.assigned_member,
  ]);

  return {
    subtasks,
    setSubtasks,
    workspaceMembers,
    teamMembers,
    taskAssignees,
    setTaskAssignees,
    activities,
    loadSubtasks,
    loadWorkspaceMembers,
    loadTeamMembers,
    loadTaskAssignees,
    loadTaskActivities,
  };
};

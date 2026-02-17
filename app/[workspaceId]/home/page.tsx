import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BarChart3,
  Clock,
  ArrowRight,
  LayoutDashboard,
  Timer,
  Zap,
  Star,
  ChartNoAxesCombined,
  User,
  ShoppingBag,
  Briefcase,
  Code,
  Plus,
  Hash,
  CirclePlay,
  Globe,
  MessageSquareDot,
  Blocks,
  FolderLock,
  Brain,
  FolderKanban,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskCountsByStatus from "@/components/workspace/charts/task-counts-by-status";
import TaskProjectStatus from "@/components/workspace/charts/task-project-status";
import { getStatusTypeColor, STATUS_TYPES } from "@/lib/status-utils";
import SprintSession from "@/components/workspace/sprint-session";
import { Gauge } from "@/components/ui/gauge";
import CreationTrendsChart from "@/components/workspace/charts/creation-trends-chart";
import { Metadata } from "next";
import Link from "next/link";
import ThemeAwareGradient from "@/components/workspace/theme-aware-gradient";

interface WorkspaceHomeProps {
  params: { workspaceId: string };
}

interface TaskCount {
  space: {
    id: string;
    name: string;
  };
  count: number;
}

export const metadata: Metadata = {
  title: "Home",
  description: "Your workspace dashboard",
};

export default async function WorkspaceHomePage(props: WorkspaceHomeProps) {
  const params = await props.params;
  const workspaceId = params.workspaceId;
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get workspace data using short workspace_id
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .single();

  // Get spaces with projects and task counts, ordered by latest first
  const { data: spaces } = await supabase
    .from("spaces")
    .select(
      `
      id,
      name,
      space_id,
      description,
      projects (*)
    `
    )
    .eq("workspace_id", workspace?.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Get workspace members with their profiles
  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", workspace.id)
    .is("deleted_at", null);

  const teamsWithMembers = [];
  if (teamsData) {
    for (const team of teamsData) {
      const { data: teamMembersData, error: teamMembersError } = await supabase
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
              weekly_hours,
              profile:profiles!user_id(*),
              role:roles!role_id(*),
              level:levels!level_id(*)
            `
        )
        .eq("team_id", team.id);

      if (teamMembersError) {
        console.error(
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

  // Get personas data
  const { data: personasData } = await supabase
    .from("personas")
    .select("*")
    .eq("workspace_id", workspace.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  // Calculate story counts for team members
  const teamMembersWithStoryCounts = [];
  for (const team of teamsWithMembers) {
    for (const member of team.team_members || []) {
      const { count: storyCount = 0 } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("assigned_member_id", member.id)
        .is("deleted_at", null);

      teamMembersWithStoryCounts.push({
        ...member,
        storyCount: storyCount || 0,
      });
    }
  }

  // Calculate story counts for personas
  // Note: Since tasks don't have direct persona assignment, we'll use a placeholder count
  // In a real implementation, you might want to add persona_id to tasks or create a relationship table
  const personasWithStoryCounts = (personasData || []).map((persona) => ({
    ...persona,
    storyCount: Math.floor(Math.random() * 15) + 1, // Placeholder - replace with actual logic
  }));

  const totalUsers = teamsWithMembers.reduce(
    (acc, team) => acc + ((team as any).team_members?.length || 0),
    0
  );
  // Get all sprint folders for all spaces in the workspace
  // const { data: sprintFolders } = await supabase
  //   .from("sprint_folders")
  //   .select(
  //     `
  //     *,
  //     space:spaces(id, name, space_id)
  //   `
  //   )
  //   .in(
  //     "space_id",
  //     (spaces || []).map((space) => space.id)
  //   )
  //   .is("deleted_at", null);

  // Get task counts for each space (directly by space_id)
  // const tasksPerSpace: TaskCount[] = await Promise.all(
  //   (spaces || []).map(async (space) => {
  //     const { count = 0 } = await supabase
  //       .from("tasks")
  //       .select("*", { count: "exact", head: true })
  //       .is("deleted_at", null)
  //       .eq("space_id", space.id);
  //     return {
  //       space: {
  //         id: space.id,
  //         name: space.name,
  //       },
  //       count: count || 0,
  //     };
  //   })
  // );

  // Get project counts for each space
  // const projectsPerSpace = (spaces || [])
  //   .filter((space: any) => !space.deleted_at)
  //   .map((space) => ({
  //     space: {
  //       id: space.id,
  //       name: space.name,
  //     },
  //     count: space.projects?.length || 0,
  //   }));

  // Get recent events
  const { data: recentEvents } = await supabase
    .from("events")
    .select(
      `
      *,
      user:profiles(*)
    `
    )
    .eq("workspace_id", workspace?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const events = recentEvents || [];

  // Get story creation sessions for average timing (current user only)
  const { data: storyCreationSessions } = await supabase
    .from("time_tracking_sessions")
    .select("user_id, event_type, timestamp, story_count")
    .eq("event_type", "story_creation")
    .eq("user_id", user?.id)
    .order("timestamp", { ascending: false });

  // Calculate average story creation time
  let averageStoryCreationTime = 0;
  let storiesPerSession = 0;
  let timeSavingPercent = 0;
  if (storyCreationSessions && storyCreationSessions.length > 0) {
    // Filter out sessions with timestamp = 0
    const validSessions = storyCreationSessions.filter(
      (session) => session.timestamp > 0
    );

    if (validSessions.length > 0) {
      // Sum all valid timestamps
      const totalTime = validSessions.reduce(
        (sum, session) => sum + session.timestamp,
        0
      );

      // Calculate average
      averageStoryCreationTime = totalTime / validSessions.length;

      // Calculate stories per session: sum(story_count) / count(sessions)
      const totalStories = validSessions.reduce(
        (sum, session) => sum + (session.story_count || 0),
        0
      );
      const sessionCount = validSessions.length;
      storiesPerSession = sessionCount > 0 ? totalStories / sessionCount : 0;
    }
  }

  // Calculate time savings percentage
  if (user?.id) {
    // Get user baseline data
    const { data: userBaseline } = await supabase
      .from("user_baselines")
      .select(
        "baseline_story_time_ms, baseline_grooming_time_ms, baseline_stories_per_session"
      )
      .eq("user_id", user.id)
      .eq("baseline_method", "manual")
      .single();

    // Get AI sessions for current user
    const { data: aiSessions } = await supabase
      .from("time_tracking_sessions")
      .select("timestamp, story_count")
      .eq("event_type", "story_creation")
      .eq("method", "ai_generated")
      .eq("user_id", user.id);

    if (userBaseline && aiSessions && aiSessions.length > 0) {
      // Calculate baseline time per story
      const baselineTimePerStory = userBaseline.baseline_story_time_ms || 0;

      // Calculate current AI time per story
      const validAiSessions = aiSessions.filter(
        (session) => session.timestamp > 0
      );
      if (validAiSessions.length > 0) {
        const totalAiTime = validAiSessions.reduce(
          (sum, session) => sum + (session.timestamp || 0),
          0
        );
        const totalAiStories = validAiSessions.reduce(
          (sum, session) => sum + (session.story_count || 0),
          0
        );
        const currentTimePerStory =
          totalAiStories > 0 ? totalAiTime / totalAiStories : 0;

        // Calculate time savings percentage
        if (baselineTimePerStory > 0 && currentTimePerStory > 0) {
          timeSavingPercent =
            ((baselineTimePerStory - currentTimePerStory) /
              baselineTimePerStory) *
            100;
        }
      }
    }
  }

  // Calculate Story Quality Score
  let storyQualityScore = 0;
  if (user?.id) {
    // Get weekly progress surveys for current user
    const { data: weeklySurveys } = await supabase
      .from("weekly_progress_surveys")
      .select("satisfaction_level")
      .eq("user_id", user.id);

    if (weeklySurveys && weeklySurveys.length > 0) {
      // Calculate average satisfaction level
      const totalSatisfaction = weeklySurveys.reduce(
        (sum, survey) => sum + (survey.satisfaction_level || 0),
        0
      );
      storyQualityScore = totalSatisfaction / weeklySurveys.length;
    }
  }

  // Get creation trends data for current user
  let storyTrends: Array<{ date: string; count: number }> = [];
  let projectTrends: Array<{ date: string; count: number }> = [];
  let sprintTrends: Array<{ date: string; count: number }> = [];
  let spaceTrends: Array<{ date: string; count: number }> = [];

  if (user?.id) {
    // Get all stories created by current user (no date limit)
    const { data: userStories } = await supabase
      .from("tasks")
      .select("created_at")
      .eq("created_by", user.id)
      .order("created_at", { ascending: true });

    // Get workspaces owned by current user
    const { data: userWorkspaces } = await supabase
      .from("workspaces")
      .select("id")
      .eq("owner_id", user.id);

    let userProjects: any[] = [];
    let userSpaces: any[] = [];
    let userSprints: any[] = [];

    if (userWorkspaces && userWorkspaces.length > 0) {
      const workspaceIds = userWorkspaces.map((w) => w.id);

      // Get projects that belong to user's workspaces
      const { data: projects } = await supabase
        .from("projects")
        .select("created_at")
        .in("workspace_id", workspaceIds)
        .order("created_at", { ascending: true });
      userProjects = projects || [];

      // Get spaces that belong to user's workspaces
      const { data: spaces } = await supabase
        .from("spaces")
        .select("id, created_at")
        .in("workspace_id", workspaceIds)
        .order("created_at", { ascending: true });
      userSpaces = spaces || [];

      // Get sprints that belong to user's spaces
      if (userSpaces.length > 0) {
        const spaceIds = userSpaces.map((s) => s.id);
        const { data: sprints } = await supabase
          .from("sprints")
          .select("created_at")
          .in("space_id", spaceIds)
          .order("created_at", { ascending: true });
        userSprints = sprints || [];
      }
    }

    // Process data to group by creation date
    const processTrends = (data: any[]) => {
      const trends = new Map<string, number>();

      data.forEach((item) => {
        const dateStr = new Date(item.created_at).toISOString().split("T")[0];
        trends.set(dateStr, (trends.get(dateStr) || 0) + 1);
      });

      return Array.from(trends.entries())
        .map(([date, count]) => ({
          date,
          count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    };

    storyTrends = processTrends(userStories || []);
    projectTrends = processTrends(userProjects || []);
    sprintTrends = processTrends(userSprints || []);
    spaceTrends = processTrends(userSpaces || []);

    // Add sample data if no data exists (for testing)
    if (
      storyTrends.length === 0 &&
      projectTrends.length === 0 &&
      sprintTrends.length === 0 &&
      spaceTrends.length === 0
    ) {
      const today = new Date();
      const sampleData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        sampleData.push({
          date: dateStr,
          count: Math.floor(Math.random() * 5) + 1,
        });
      }

      storyTrends = sampleData;
      projectTrends = sampleData.map((item) => ({
        ...item,
        count: Math.floor(Math.random() * 3) + 1,
      }));
      sprintTrends = sampleData.map((item) => ({
        ...item,
        count: Math.floor(Math.random() * 2) + 1,
      }));
      spaceTrends = sampleData.map((item) => ({
        ...item,
        count: Math.floor(Math.random() * 1) + 1,
      }));
    }
  }

  // Get all statuses for the workspace with their status_types
  const { data: statuses = [] } = await supabase
    .from("statuses")
    .select("id, name, color, status_type:status_types(name)")
    .eq("workspace_id", workspace?.id);

  const statusTypeCounts = await Promise.all(
    Object.entries(STATUS_TYPES).map(async ([key, statusTypeName]) => {
      const statusesOfType = (statuses || []).filter((status) => {
        if (status.status_type) {
          if (Array.isArray(status.status_type)) {
            const firstStatusType = status.status_type[0] as any;
            return firstStatusType?.name === statusTypeName;
          } else if (
            typeof status.status_type === "object" &&
            status.status_type !== null
          ) {
            const statusTypeObj = status.status_type as any;
            return statusTypeObj.name === statusTypeName;
          }
        }
        return false;
      });

      let count = 0;
      if (statusesOfType.length > 0) {
        const statusIds = statusesOfType.map((s) => s.id);
        const { count: typeCount = 0 } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null)
          .in("status_id", statusIds);
        count = typeCount || 0;
      }

      // Map status type names to display names
      const displayName =
        key === "NOT_STARTED"
          ? "Not Started"
          : key === "ACTIVE"
          ? "Active"
          : key === "DONE"
          ? "Done"
          : key === "CLOSED"
          ? "Closed"
          : key;

      return {
        name: displayName,
        color: getStatusTypeColor(statusTypeName),
        count: count,
      };
    })
  );

  // Calculate real stats for the header banner
  // Get active stories count
  const activeStatuses = (statuses || []).filter((status) => {
    if (status.status_type) {
      if (Array.isArray(status.status_type)) {
        const firstStatusType = status.status_type[0] as any;
        return firstStatusType?.name === STATUS_TYPES.ACTIVE;
      } else if (
        typeof status.status_type === "object" &&
        status.status_type !== null
      ) {
        const statusTypeObj = status.status_type as any;
        return statusTypeObj.name === STATUS_TYPES.ACTIVE;
      }
    }
    return false;
  });

  let activeStoriesCount = 0;
  if (activeStatuses.length > 0) {
    const activeStatusIds = activeStatuses.map((s) => s.id);
    const { count: activeCount = 0 } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .in("status_id", activeStatusIds);
    activeStoriesCount = activeCount || 0;
  }

  // Get total story points
  const { data: tasksWithStoryPoints } = await supabase
    .from("tasks")
    .select("story_points")
    .eq("workspace_id", workspace?.id)
    .is("deleted_at", null)
    .not("story_points", "is", null);

  const totalStoryPoints = (tasksWithStoryPoints || []).reduce(
    (sum, task) => sum + (task.story_points || 0),
    0
  );

  // Calculate success rate (completed tasks / total tasks)
  const completedStatuses = (statuses || []).filter((status) => {
    if (status.status_type) {
      if (Array.isArray(status.status_type)) {
        const firstStatusType = status.status_type[0] as any;
        return (
          firstStatusType?.name === STATUS_TYPES.DONE ||
          firstStatusType?.name === STATUS_TYPES.CLOSED
        );
      } else if (
        typeof status.status_type === "object" &&
        status.status_type !== null
      ) {
        const statusTypeObj = status.status_type as any;
        return (
          statusTypeObj.name === STATUS_TYPES.DONE ||
          statusTypeObj.name === STATUS_TYPES.CLOSED
        );
      }
    }
    return false;
  });

  let completedTasksCount = 0;
  if (completedStatuses.length > 0) {
    const completedStatusIds = completedStatuses.map((s) => s.id);
    const { count: completedCount = 0 } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .in("status_id", completedStatusIds);
    completedTasksCount = completedCount || 0;
  }

  const totalTasksCount = statusTypeCounts.reduce(
    (sum, status) => sum + status.count,
    0
  );

  const successRate =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  // Calculate sprint count for the workspace
  const { count: totalSprintCount = 0 } = await supabase
    .from("sprints")
    .select("*", { count: "exact", head: true })
    .in(
      "space_id",
      (spaces || []).map((space) => space.id)
    )
    .is("deleted_at", null);

  // Get active sprints for this workspace (today between start and end)
  const spaceIdsForActive = (spaces || []).map((s) => s.id);
  const todayIso = new Date().toISOString().split("T")[0];
  const { data: activeSprints = [] } =
    spaceIdsForActive.length > 0
      ? await supabase
          .from("sprints")
          .select(
            `id, name, start_date, end_date, space:spaces(name, space_id)`
          )
          .in("space_id", spaceIdsForActive)
          .lte("start_date", todayIso)
          .gte("end_date", todayIso)
          .is("deleted_at", null)
      : ({ data: [] } as any);

  // Calculate sprint counts and member counts per space
  const spacesWithSprintCounts = await Promise.all(
    (spaces || []).map(async (space) => {
      const { count: sprintCount = 0 } = await supabase
        .from("sprints")
        .select("*", { count: "exact", head: true })
        .eq("space_id", space.id)
        .is("deleted_at", null);

      // Get unique team members assigned to tasks in this space
      const { data: assignedMembers } = await supabase
        .from("tasks")
        .select("assigned_member_id")
        .eq("space_id", space.id)
        .is("deleted_at", null)
        .not("assigned_member_id", "is", null);

      // Count unique assigned members
      const uniqueMemberIds = new Set(
        (assignedMembers || [])
          .map((task) => task.assigned_member_id)
          .filter(Boolean)
      );
      const memberCount = uniqueMemberIds.size;

      return {
        ...space,
        sprintCount: sprintCount || 0,
        memberCount: memberCount || 0,
      };
    })
  );

  const totalTasksForStatus = statusTypeCounts.reduce(
    (sum, status) => sum + status.count,
    0
  );

  let statusCounts = statusTypeCounts.map((status) => ({
    ...status,
    percentage:
      totalTasksForStatus > 0
        ? Math.round((status.count / totalTasksForStatus) * 100)
        : 0,
  }));

  // Fallback: If no status data found, show a default structure
  if (totalTasksForStatus === 0) {
    statusCounts = [
      { name: "Not Started", color: "#6B7280", count: 0, percentage: 0 },
      { name: "Active", color: "#3B82F6", count: 0, percentage: 0 },
      { name: "Done", color: "#10B981", count: 0, percentage: 0 },
      { name: "Closed", color: "#8B5CF6", count: 0, percentage: 0 },
    ];
  }
  // Use actual space data instead of hardcoded values
  const getSpaceDescription = (space: any) => {
    // Use space description if available, otherwise provide a default based on space name
    if (space.description) {
      return space.description;
    }

    // Generate contextual description based on space name
    const name = space.name.toLowerCase();
    if (name.includes("product") || name.includes("development")) {
      return "Primary workspace for core product features";
    } else if (name.includes("engineering") || name.includes("tech")) {
      return "Technical implementation and infrastructure";
    } else if (name.includes("mobile") || name.includes("app")) {
      return "iOS and Android application development";
    } else if (name.includes("design") || name.includes("ui")) {
      return "User interface and experience design";
    } else if (name.includes("marketing") || name.includes("growth")) {
      return "Marketing and growth initiatives";
    } else if (name.includes("qa") || name.includes("test")) {
      return "Quality assurance and testing";
    } else {
      return "Workspace for team collaboration and project management";
    }
  };

  const gradientColors = [
    "from-blue-500 to-indigo-600",
    "from-green-500 to-emerald-600",
    "from-purple-500 to-pink-600",
  ];

  // Get sprint information for the workspace
  // const { data: sprints } = await supabase
  //   .from("sprints")
  //   .select(
  //     `
  //     id,
  //     sprint_id,
  //     name,
  //     goal,
  //     start_date,
  //     end_date,
  //     space:spaces(id, name, space_id),
  //     sprint_folder:sprint_folders(id, name, sprint_folder_id)
  //   `
  //   )
  //   .eq("space.workspace_id", workspace?.id)
  //   .order("start_date", { ascending: true });

  // Get task counts for each sprint
  // const sprintsWithTaskCounts = await Promise.all(
  //   (sprints || []).map(async (sprint) => {
  //     const { count: taskCount = 0 } = await supabase
  //       .from("tasks")
  //       .select("*", { count: "exact", head: true })
  //       .eq("sprint_id", sprint.id);

  //     const { count: completedCount = 0 } = await supabase
  //       .from("tasks")
  //       .select("*", { count: "exact", head: true })
  //       .eq("sprint_id", sprint.id)
  //       .eq("status", "completed");

  //     const { count: inProgressCount = 0 } = await supabase
  //       .from("tasks")
  //       .select("*", { count: "exact", head: true })
  //       .eq("sprint_id", sprint.id)
  //       .eq("status", "in_progress");

  //     // Get overdue tasks (tasks with due_date in the past and not completed)
  //     const { count: overdueCount = 0 } = await supabase
  //       .from("tasks")
  //       .select("*", { count: "exact", head: true })
  //       .eq("sprint_id", sprint.id)
  //       .not("status", "eq", "completed")
  //       .lt("due_date", new Date().toISOString().split("T")[0]);

  //     // Handle space and sprint_folder data that might come as arrays
  //     const space = Array.isArray(sprint.space)
  //       ? sprint.space[0]
  //       : sprint.space;
  //     const sprint_folder = Array.isArray(sprint.sprint_folder)
  //       ? sprint.sprint_folder[0]
  //       : sprint.sprint_folder;

  //     return {
  //       id: sprint.id,
  //       sprint_id: sprint.sprint_id,
  //       name: sprint.name,
  //       goal: sprint.goal,
  //       start_date: sprint.start_date,
  //       end_date: sprint.end_date,
  //       space: {
  //         id: space?.id || "",
  //         name: space?.name || "",
  //         space_id: space?.space_id || "",
  //       },
  //       sprint_folder: {
  //         id: sprint_folder?.id || "",
  //         name: sprint_folder?.name || "",
  //         sprint_folder_id: sprint_folder?.sprint_folder_id || "",
  //       },
  //       taskCount: taskCount || 0,
  //       completedTasks: completedCount || 0,
  //       inProgressTasks: inProgressCount || 0,
  //       overdueTasks: overdueCount || 0,
  //     };
  //   })
  // );

  // Calculate Sprint Success Rate
  // const currentDate = new Date();
  // const completedSprints = sprintsWithTaskCounts.filter((sprint) => {
  //   if (!sprint.end_date) return false;
  //   const endDate = new Date(sprint.end_date);
  //   return endDate < currentDate;
  // });

  // const totalSprints = sprintsWithTaskCounts.length;
  // const sprintSuccessRate =
  //   totalSprints > 0 ? (completedSprints.length / totalSprints) * 100 : 0;

  return (
    <div
      id="home-dashboard"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      {/* Enhanced Header Banner */}
      <div className="p-3">
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <ThemeAwareGradient className="absolute inset-0 opacity-95" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

          {/* Subtle overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative px-6 py-8">
            <div className="">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex-1 flex flex-row justify-between items-center">
                  {/* Welcome Section */}
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                      <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl lg:text-2xl font-bold text-white mb-1 tracking-tight">
                        Welcome back,{" "}
                        <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-300 bg-clip-text text-transparent font-extrabold">
                          {user?.user_metadata?.full_name ||
                            user?.user_metadata?.name ||
                            "Dr. Nagy"}
                        </span>
                        !
                      </h1>
                      <p className="text-white/90 text-sm font-medium">
                        Your Sprint 23 - Search Enhancement is now active and
                        ready for execution.
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-2xl">
                    <div className="group pr-3 border-r border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xl font-bold text-white">
                          {activeStoriesCount}
                        </div>
                      </div>
                      <div className="text-xs text-white/90 font-semibold mb-2">
                        Active Stories
                      </div>
                    </div>

                    <div className="group pr-3 border-r border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xl font-bold text-white">
                          {totalStoryPoints}
                        </div>
                      </div>
                      <div className="text-xs text-white/90 font-semibold mb-2">
                        Story Points
                      </div>
                    </div>

                    <div className="group pr-3 border-r border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xl font-bold text-white">
                          {totalUsers || 2}
                        </div>
                      </div>
                      <div className="text-xs text-white/90 font-semibold mb-2">
                        Team Members
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xl font-bold text-white">
                          {successRate}%
                        </div>
                      </div>
                      <div className="text-xs text-white/90 font-semibold mb-2">
                        Success Rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Link href={`/${workspaceId}/agents`} className="group">
                <div className="relative shadow-md bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Brain className="w-5 h-5 text-white" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Create Story
                    </h3>
                  </div>
                </div>
              </Link>

              <Link href={`/${workspaceId}/projects`} className="group">
                <div className="relative shadow-md bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <FolderKanban
                        className="w-5 h-5 text-white"
                        aria-hidden
                      />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Create Project
                    </h3>
                  </div>
                </div>
              </Link>

              <Link href={`/${workspaceId}/settings/persona`} className="group">
                <div className="relative shadow-md bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <User className="w-5 h-5 text-white" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Persona
                    </h3>
                  </div>
                </div>
              </Link>

              <Link href={`/${workspaceId}/settings/roles`} className="group">
                <div className="relative shadow-md bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Briefcase className="w-5 h-5 text-white" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Team Roles
                    </h3>
                  </div>
                </div>
              </Link>

              <Link href={`/${workspaceId}/teams`} className="group">
                <div className="relative shadow-md bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Users className="w-5 h-5 text-white" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Add Team Member
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Enhanced Your Workspaces */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                  Your Workspaces
                </h2>
              </div>
              <Link
                href={`/${workspaceId}/settings/spaces`}
                className="inline-flex items-center gap-2 px-2 py-2 hover:text-workspace-primary text-xs font-semibold rounded-lg transition-all duration-300"
              >
                <span>View all</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {spaces && spaces.length > 0 ? (
                spaces.slice(0, 3).map((space, index) => {
                  return (
                    // <Link
                    //   key={space.id}
                    //   href={`/${workspaceId}/space/${space.space_id}`}
                    //   className="group"
                    // >
                    <div
                      key={space.id}
                      className="relative shadow-md bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br ${
                              gradientColors[index] || gradientColors[0]
                            } rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                          >
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-base">
                          {space.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                          {getSpaceDescription(space)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Hash className="w-4 h-4" />
                              <div className="flex items-end gap-1">
                                <span className="font-semibold text-sm">
                                  {space.projects?.length || 0}
                                </span>
                                <span className="font-medium">Projects</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <div className="flex items-end gap-1">
                                <span className="font-semibold text-sm">
                                  {spacesWithSprintCounts.find(
                                    (s) => s.id === space.id
                                  )?.memberCount || 0}{" "}
                                </span>
                                <span className="font-medium">Members</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              <div className="flex items-end gap-1">
                                <span className="font-semibold text-sm">
                                  {spacesWithSprintCounts.find(
                                    (s) => s.id === space.id
                                  )?.sprintCount || 0}{" "}
                                </span>
                                <span className="font-medium">Sprints</span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                    // </Link>
                  );
                })
              ) : (
                // Enhanced fallback workspace cards when no spaces exist
                <></>
              )}
            </div>
          </div>

          {/* Enhanced Team Members, Personas & Active Sprints Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
            {/* Team Members Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      Active Team Members
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${workspaceId}/teams`}
                      className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Manage
                    </Link>
                    {/* <Link href={`/${workspaceId}/teams`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                        + Add
                      </button>
                    </Link> */}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {teamMembersWithStoryCounts.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                    >
                      <div className="flex-shrink-0 relative">
                        <Avatar className="h-10 w-10 rounded-lg transition-all duration-300 group-hover:scale-110">
                          <AvatarImage src={member.profile?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-lg">
                            {(member.profile?.full_name || member.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {member.profile?.full_name ||
                            member.name ||
                            "Unknown"}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {member.role?.name || "Role"} •{" "}
                          {member.weekly_hours || 40}h/week
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold py-1 px-2 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {member.storyCount}{" "}
                          {member.storyCount === 1 ? "story" : "stories"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {teamMembersWithStoryCounts.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        No team members found
                      </p>
                      <Link
                        href={`/${workspaceId}/teams`}
                        className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                      >
                        Add your first team member
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personas Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      Active Personas
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${workspaceId}/settings/persona`}
                      className="text-purple-600 dark:text-purple-400 text-xs font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      Manage
                    </Link>
                    {/* <Link href={`/${workspaceId}/settings/persona`}>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                        + Add
                      </button>
                    </Link> */}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {personasWithStoryCounts.slice(0, 3).map((persona, index) => {
                    // Define icons based on persona name or role
                    const getPersonaIcon = (persona: any) => {
                      const name = persona.name.toLowerCase();
                      const role = (persona.role || "").toLowerCase();

                      if (
                        name.includes("shopper") ||
                        name.includes("customer") ||
                        name.includes("consumer")
                      ) {
                        return <ShoppingBag className="h-4 w-4 text-white" />;
                      } else if (
                        name.includes("product") ||
                        role.includes("product")
                      ) {
                        return <Briefcase className="h-4 w-4 text-white" />;
                      } else if (
                        name.includes("developer") ||
                        name.includes("engineer") ||
                        role.includes("developer")
                      ) {
                        return <Code className="h-4 w-4 text-white" />;
                      } else {
                        return <User className="h-4 w-4 text-white" />;
                      }
                    };

                    const getPersonaGradient = (persona: any) => {
                      const name = persona.name.toLowerCase();
                      const role = (persona.role || "").toLowerCase();

                      if (
                        name.includes("shopper") ||
                        name.includes("customer") ||
                        name.includes("consumer")
                      ) {
                        return "from-green-500 to-emerald-600";
                      } else if (
                        name.includes("product") ||
                        role.includes("product")
                      ) {
                        return "from-blue-500 to-indigo-600";
                      } else if (
                        name.includes("developer") ||
                        name.includes("engineer") ||
                        role.includes("developer")
                      ) {
                        return "from-purple-500 to-pink-600";
                      } else {
                        return "from-slate-500 to-slate-600";
                      }
                    };

                    return (
                      <div
                        key={persona.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`h-10 w-10 bg-gradient-to-br ${getPersonaGradient(
                              persona
                            )} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                          >
                            {getPersonaIcon(persona)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {persona.name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {persona.role || "User"} •{" "}
                            {persona.priority_level
                              ? persona.priority_level.charAt(0).toUpperCase() +
                                persona.priority_level.slice(1)
                              : "Medium"}{" "}
                            Priority
                          </p>
                        </div>
                        {/* <div className="flex-shrink-0">
                          <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold py-1 px-2 rounded-lg">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            {persona.storyCount}{" "}
                            {persona.storyCount === 1 ? "story" : "stories"}
                          </span>
                        </div> */}
                      </div>
                    );
                  })}
                  {personasWithStoryCounts.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        No personas found
                      </p>
                      <Link
                        href={`/${workspaceId}/settings/persona`}
                        className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
                      >
                        Create your first persona
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Sprints Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      Active Sprints
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${workspaceId}/my-tasks`}
                      className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {(activeSprints || []).slice(0, 3).map((sprint: any) => {
                    const space = Array.isArray(sprint.space)
                      ? sprint.space[0]
                      : sprint.space;
                    return (
                      <div
                        key={sprint.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {sprint.name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {space?.name || "Space"} • {sprint.start_date} →{" "}
                            {sprint.end_date}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold py-1 px-2 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          Active
                        </span>
                      </div>
                    );
                  })}
                  {(activeSprints || []).length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CirclePlay className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        No active sprints
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Settings & Configuration */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                  Settings & Configuration
                </h2>
              </div>
              <Link
                href={`/${workspaceId}/settings`}
                className="inline-flex items-center gap-2 px-2 py-2 hover:text-workspace-primary text-xs font-semibold rounded-lg transition-all duration-300"
              >
                <span>Configure all</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                href={`/${workspaceId}/settings/notifications`}
                className="group"
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <MessageSquareDot className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Notifications
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Manage alerts and updates
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href={`/${workspaceId}/settings/integrations`}
                className="group"
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Blocks className="w-5 h-5 text-white" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Integrations
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Connect external tools
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href={`/${workspaceId}/settings/security`}
                className="group"
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <FolderLock className="w-5 h-5 text-white" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-base group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Security
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Protect your workspace
                    </p>
                  </div>
                </div>
              </Link>

              <Link href={`/${workspaceId}/settings/billing`} className="group">
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Billing
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Manage subscription
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

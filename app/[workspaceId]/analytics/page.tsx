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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskCountsByStatus from "@/components/workspace/charts/task-counts-by-status";
import TaskProjectStatus from "@/components/workspace/charts/task-project-status";
import { getStatusTypeColor, STATUS_TYPES } from "@/lib/status-utils";
import SprintSession from "@/components/workspace/sprint-session";
import { Gauge } from "@/components/ui/gauge";
import CreationTrendsChart from "@/components/workspace/charts/creation-trends-chart";
import { Metadata } from "next";

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

  // Get spaces with projects and task counts
  const { data: spaces } = await supabase
    .from("spaces")
    .select(
      `
      id,
      name,
      space_id,
      projects (*)
    `
    )
    .eq("workspace_id", workspace?.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

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

  const totalUsers = teamsWithMembers.reduce(
    (acc, team) => acc + ((team as any).team_members?.length || 0),
    0
  );
  // Get all sprint folders for all spaces in the workspace
  const { data: sprintFolders } = await supabase
    .from("sprint_folders")
    .select(
      `
      *,
      space:spaces(id, name, space_id)
    `
    )
    .in(
      "space_id",
      (spaces || []).map((space) => space.id)
    )
    .is("deleted_at", null);

  // Get task counts for each space (directly by space_id)
  const tasksPerSpace: TaskCount[] = await Promise.all(
    (spaces || []).map(async (space) => {
      const { count = 0 } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("space_id", space.id);
      return {
        space: {
          id: space.id,
          name: space.name,
        },
        count: count || 0,
      };
    })
  );

  // Get project counts for each space
  const projectsPerSpace = (spaces || [])
    .filter((space: any) => !space.deleted_at)
    .map((space) => ({
      space: {
        id: space.id,
        name: space.name,
      },
      count: space.projects?.length || 0,
    }));

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

  // Get sprint information for the workspace
  const { data: sprints } = await supabase
    .from("sprints")
    .select(
      `
      id,
      sprint_id,
      name,
      goal,
      start_date,
      end_date,
      space:spaces(id, name, space_id),
      sprint_folder:sprint_folders(id, name, sprint_folder_id)
    `
    )
    .eq("space.workspace_id", workspace?.id)
    .order("start_date", { ascending: true });

  // Get task counts for each sprint
  const sprintsWithTaskCounts = await Promise.all(
    (sprints || []).map(async (sprint) => {
      const { count: taskCount = 0 } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("sprint_id", sprint.id);

      const { count: completedCount = 0 } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("sprint_id", sprint.id)
        .eq("status", "completed");

      const { count: inProgressCount = 0 } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("sprint_id", sprint.id)
        .eq("status", "in_progress");

      // Get overdue tasks (tasks with due_date in the past and not completed)
      const { count: overdueCount = 0 } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("sprint_id", sprint.id)
        .not("status", "eq", "completed")
        .lt("due_date", new Date().toISOString().split("T")[0]);

      // Handle space and sprint_folder data that might come as arrays
      const space = Array.isArray(sprint.space)
        ? sprint.space[0]
        : sprint.space;
      const sprint_folder = Array.isArray(sprint.sprint_folder)
        ? sprint.sprint_folder[0]
        : sprint.sprint_folder;

      return {
        id: sprint.id,
        sprint_id: sprint.sprint_id,
        name: sprint.name,
        goal: sprint.goal,
        start_date: sprint.start_date,
        end_date: sprint.end_date,
        space: {
          id: space?.id || "",
          name: space?.name || "",
          space_id: space?.space_id || "",
        },
        sprint_folder: {
          id: sprint_folder?.id || "",
          name: sprint_folder?.name || "",
          sprint_folder_id: sprint_folder?.sprint_folder_id || "",
        },
        taskCount: taskCount || 0,
        completedTasks: completedCount || 0,
        inProgressTasks: inProgressCount || 0,
        overdueTasks: overdueCount || 0,
      };
    })
  );

  // Calculate Sprint Success Rate
  const currentDate = new Date();
  const completedSprints = sprintsWithTaskCounts.filter((sprint) => {
    if (!sprint.end_date) return false;
    const endDate = new Date(sprint.end_date);
    return endDate < currentDate;
  });

  const totalSprints = sprintsWithTaskCounts.length;
  const sprintSuccessRate =
    totalSprints > 0 ? (completedSprints.length / totalSprints) * 100 : 0;

  return (
    <div id="home-dashboard">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 px-3 mt-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 col-span-3">
          <Card className="workspace-header-bg border workspace-border col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                {workspace?.name}'s Workspace!
              </CardTitle>
              <div className="flex items-center bg-rose-500/10 rounded-md p-2">
                <LayoutDashboard className="h-6 w-6 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Here's what's happening in your workspace.
            </CardContent>
          </Card>
          {/* Creation Trends Chart */}
          <div className="col-span-3">
            <CreationTrendsChart
              storyData={storyTrends}
              projectData={projectTrends}
              sprintData={sprintTrends}
              spaceData={spaceTrends}
              timeRange="daily"
            />
          </div>
          <div className="col-span-3">
            <TaskProjectStatus
              tasksPerSpace={tasksPerSpace}
              projectsPerSpace={projectsPerSpace.filter(
                (project: any) => !project.space.deleted_at
              )}
            />
          </div>
          <div
            className={`grid grid-cols-1 gap-3 col-span-3 ${
              sprintsWithTaskCounts.filter((sprint) =>
                sprintFolders
                  ?.map((folder) => folder.id)
                  .includes(sprint.sprint_folder.id)
              ).length > 0
                ? "md:grid-cols-2"
                : "md:grid-cols-1"
            }`}
          >
            <SprintSession
              sprints={sprintsWithTaskCounts.filter((sprint) =>
                sprintFolders
                  ?.map((folder) => folder.id)
                  .includes(sprint.sprint_folder.id)
              )}
              workspaceId={workspaceId}
            />
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="workspace-header-bg border workspace-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Story Quality Score
                    </CardTitle>
                    <div className="flex items-center bg-rose-500/10 rounded-md p-2">
                      <Star className="h-4 w-4 text-rose-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {storyQualityScore > 0 ? storyQualityScore.toFixed(1) : 0}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < Math.round(storyQualityScore)
                                ? "text-rose-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      average satisfaction
                    </p>
                  </CardContent>
                </Card>

                <Card className="workspace-header-bg border workspace-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sprint Success
                    </CardTitle>
                    <div className="flex items-center bg-green-500/10 rounded-md p-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(sprintSuccessRate)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {completedSprints.length} of {totalSprints} completed
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card className="workspace-header-bg border workspace-border col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Time Savings
                  </CardTitle>
                  <div className="flex items-center bg-indigo-500/10 rounded-md p-2">
                    <Zap className="h-4 w-4 text-indigo-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        All time efficiency
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-emerald-600">
                          {timeSavingPercent > 0 ? "+" : ""}
                          {timeSavingPercent > 0
                            ? Math.round(timeSavingPercent)
                            : 0}
                          %
                        </span>
                        <ArrowRight className="h-3 w-3 text-emerald-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-3">
                      {timeSavingPercent > 0
                        ? Math.round(timeSavingPercent)
                        : 0}
                      %
                    </div>

                    {/* Horizontal Progress Bar */}
                    <div className="w-full h-3 rounded-full overflow-hidden mb-3">
                      <div className="flex h-full gap-1">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-700 ease-in-out"
                          style={{
                            width: `${Math.min(100, timeSavingPercent)}%`,
                          }}
                        />
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-in-out"
                          style={{
                            width: `${Math.max(0, 100 - timeSavingPercent)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span className="text-muted-foreground">Manual</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-muted-foreground">
                          AI Generated
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="workspace-header-bg border workspace-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Session Time
                </CardTitle>
                <div className="flex items-center bg-purple-500/10 rounded-md p-2">
                  <Timer className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {averageStoryCreationTime > 0
                    ? Math.round(averageStoryCreationTime / 1000)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  seconds per session
                </p>
              </CardContent>
            </Card>

            <Card className="workspace-header-bg border workspace-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stories per Session
                </CardTitle>
                <div className="flex items-center bg-sky-500/10 rounded-md p-2">
                  <BarChart3 className="h-5 w-5 text-sky-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {storiesPerSession > 0 ? storiesPerSession.toFixed(1) : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  stories per session
                </p>
              </CardContent>
            </Card>

            <Card className="workspace-header-bg border workspace-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tasks
                </CardTitle>
                <div className="flex items-center bg-blue-500/10 rounded-md p-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statusCounts.find((status) => status.name === "Active")
                    ?.count || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tasks in progress
                </p>
              </CardContent>
            </Card>

            <Card className="workspace-header-bg border workspace-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <div className="flex items-center bg-emerald-500/10 rounded-md p-2">
                  <Users className="h-5 w-5 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers || 1}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Active members
                </p>
              </CardContent>
            </Card>
          </div>
          <TaskCountsByStatus statusCounts={statusCounts} />

          <Card className="workspace-header-bg border workspace-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Task Progress
              </CardTitle>
              <div className="flex items-center bg-sky-500/10 rounded-md p-2">
                <BarChart3 className="h-5 w-5 text-sky-500" />
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between relative">
              <div className="flex flex-col items-start gap-1 py-4">
                <p className="text-2xl text-center font-bold">
                  {statusCounts.find((status) => status.name === "Done")
                    ?.count || 0}{" "}
                  of {totalTasksForStatus || 0}{" "}
                </p>
                <span className="text-xs text-muted-foreground">
                  tasks completed
                </span>
              </div>
              <div className="absolute right-12 pt-12">
                <Gauge
                  value={Math.round(
                    ((statusCounts.find((status) => status.name === "Done")
                      ?.count || 0) /
                      (totalTasksForStatus || 1)) *
                      100
                  )}
                  label="Task Progress"
                  size="lg"
                  color="#1E90FF"
                  backgroundColor="#F0F0F0"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="workspace-header-bg border workspace-border h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No recent activity to show.
                </p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 overflow-hidden"
                    >
                      <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage src={event.user?.avatar_url} />
                        <AvatarFallback>
                          {event.user?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">
                            {event.user?.full_name || "Unknown User"}
                          </p>

                          <p className="text-xs text-gray-400">
                            {new Date(event.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 w-full line-clamp-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

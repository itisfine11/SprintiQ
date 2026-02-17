"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type {
  Team,
  TeamMember,
  Role,
  Level,
  Profile,
  Task,
} from "@/lib/database.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteMemberModal from "./modals/delete-member-modal";

interface TeamsDashboardProps {
  teams: Team[];
  roles: Role[];
  levels: Level[];
  profiles: Profile[];
  workspaceId: string;
  onRefresh: () => void;
}

interface DashboardStats {
  totalTeams: number;
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  assignedTasks: number;
  completedTasks: number;
}

interface MemberWorkload {
  memberId: string;
  memberName: string;
  storyCount: number;
  totalWorkload: number;
  maxWorkload: number;
  workloadPercentage: number;
  isOverloaded: boolean;
  role: string;
  level: string;
  avatarUrl?: string;
  account_id?: string; // Added for Jira team member badge
}

export default function TeamsDashboard({
  teams,
  roles,
  levels,
  profiles,
  workspaceId,
  onRefresh,
}: TeamsDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    assignedTasks: 0,
    completedTasks: 0,
  });
  const [memberWorkloads, setMemberWorkloads] = useState<MemberWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const supabase = createClientSupabaseClient();

  useEffect(() => {
    fetchDashboardStats();
  }, [teams, workspaceId]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // First, get the workspace UUID from the short ID
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .single();

      if (workspaceError) {
        console.error("Error fetching workspace:", workspaceError);
        throw new Error(`Workspace not found: ${workspaceError.message}`);
      }

      const workspaceUuid = workspaceData.id;

      // Calculate basic stats from teams data
      const totalTeams = teams.length;
      const totalUsers = teams.reduce(
        (acc, team) => acc + ((team as any).team_members?.length || 0),
        0
      );

      // Fetch projects count using workspace UUID
      const { data: projectsData } = await supabase
        .from("projects")
        .select("id")
        .eq("workspace_id", workspaceUuid)
        .is("deleted_at", null);

      // Fetch tasks count and status using workspace UUID
      const { data: tasksData } = await supabase
        .from("tasks")
        .select(
          "id, assignee_id, status_id, estimated_time, story_points, assigned_member_id"
        )
        .eq("workspace_id", workspaceUuid)
        .is("deleted_at", null);

      // Fetch statuses to determine completed tasks using workspace UUID
      const { data: statusesData } = await supabase
        .from("statuses")
        .select("id, name")
        .eq("workspace_id", workspaceUuid)
        .is("deleted_at", null);

      const completedStatusNames = ["Done", "Completed", "Finished", "Closed"];
      const completedStatusIds =
        statusesData
          ?.filter((status) =>
            completedStatusNames.some((name) =>
              status.name.toLowerCase().includes(name.toLowerCase())
            )
          )
          .map((status) => status.id) || [];

      const totalProjects = projectsData?.length || 0;
      const totalTasks = tasksData?.length || 0;
      const assignedTasks =
        tasksData?.filter((task) => task.assignee_id).length || 0;
      const completedTasks =
        tasksData?.filter((task) => completedStatusIds.includes(task.status_id))
          .length || 0;

      setStats({
        totalTeams,
        totalUsers,
        totalProjects,
        totalTasks,
        assignedTasks,
        completedTasks,
      });

      // Calculate member workloads
      await calculateMemberWorkloads(tasksData || [], teams, workspaceUuid);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMemberWorkloads = async (
    tasksData: any[],
    teams: Team[],
    workspaceUuid: string
  ) => {
    try {
      const workloads: MemberWorkload[] = [];

      // Get all team members across all teams
      const allTeamMembers: any[] = [];
      teams.forEach((team) => {
        if ((team as any).team_members) {
          console.log(
            `Team ${team.name} has ${(team as any).team_members.length} members`
          );
          allTeamMembers.push(...(team as any).team_members);
        }
      });

      // Calculate workload for each team member
      for (const member of allTeamMembers) {
        // Find tasks assigned to this team member via assigned_member_id
        const memberTasks =
          tasksData?.filter((task) => {
            // Check if task is assigned to this team member
            return task.assigned_member_id === member.id;
          }) || [];

        // Calculate total workload in hours
        let totalWorkload = 0;
        memberTasks.forEach((task) => {
          if (task.estimated_time) {
            totalWorkload += task.estimated_time;
          } else if (task.story_points) {
            // Estimate: 1 story point ≈ 8 hours
            totalWorkload += task.story_points * 8;
          }
        });

        // Calculate max workload based on level and availability
        const weeklyHours =
          member.weekly_hours !== null && member.weekly_hours !== undefined
            ? member.weekly_hours
            : 40;
        const maxWorkload = weeklyHours * 0.8; // 80% of availability as max workload
        const workloadPercentage = (totalWorkload / maxWorkload) * 100;
        const isOverloaded = workloadPercentage > 100;

        // Get role and level names
        const role =
          roles.find((r) => r.id === member.role_id)?.name || "Unknown";
        const level =
          levels.find((l) => l.id === member.level_id)?.name || "Unknown";

        // Get avatar URL and name from profile using user_id
        let avatarUrl = null;
        let memberName = "Unknown Member";
        let account_id: string | undefined = member.account_id; // Get from team member data

        if (member.user_id && member.profile) {
          // Profile data is available via user_id relationship
          avatarUrl = member.profile.avatar_url || null;
          memberName =
            member.profile.full_name || member.name || "Unknown Member";
        } else {
          // Fallback to member data
          memberName = member.name || "Unknown Member";
        }

        workloads.push({
          memberId: member.id,
          memberName,
          storyCount: memberTasks.length,
          totalWorkload,
          maxWorkload,
          workloadPercentage,
          isOverloaded,
          role,
          level,
          avatarUrl,
          account_id,
        });
      }

      setMemberWorkloads(workloads);
    } catch (error) {
      console.error("Error calculating member workloads:", error);
    }
  };

  const getTeamProgress = (team: Team) => {
    if (!(team as any).team_members || (team as any).team_members.length === 0)
      return 0;

    // This is a simplified calculation - in a real app you'd want to
    // calculate based on actual task assignments to team members
    return Math.floor(Math.random() * 100); // Placeholder
  };

  const getWorkloadColor = (percentage: number) => {
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-orange-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const getWorkloadBadgeVariant = (percentage: number) => {
    if (percentage >= 100) return "destructive";
    if (percentage >= 80) return "secondary";
    if (percentage >= 60) return "outline";
    return "default";
  };

  const handleDeleteMember = (member: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemberToDelete(member);
    setIsDeleteMemberModalOpen(true);
  };

  const handleConfirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      setDeletingMemberId(memberToDelete.id);

      console.log("Deleting member:", {
        memberId: memberToDelete.id,
        teamId: memberToDelete.team_id,
        workspaceId: workspaceId,
      });

      const response = await fetch(
        `/api/workspace/${workspaceId}/teams/${memberToDelete.team_id}/members/${memberToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete team member");
      }

      // Refresh the data
      onRefresh();
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert(
        `Failed to delete team member: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setDeletingMemberId(null);
      setMemberToDelete(null);
    }
  };

  const getMemberDisplayName = (member: TeamMember) => {
    if (member.is_registered && member.profile) {
      return member.profile.full_name || member.profile.email || "Unknown User";
    }
    return member.name || "Unknown User";
  };

  const getMemberEmail = (member: TeamMember) => {
    if (member.is_registered && member.profile) {
      return member.profile.email;
    }
    if (
      member.email === null ||
      member.email === undefined ||
      member.email === ""
    ) {
      return "-";
    } else {
      return member.email;
    }
  };

  const overloadedMembers = memberWorkloads.filter(
    (member) => member.isOverloaded
  );
  const balancedMembers = memberWorkloads.filter(
    (member) => !member.isOverloaded && member.workloadPercentage > 30
  );
  const underutilizedMembers = memberWorkloads.filter(
    (member) => member.workloadPercentage <= 30
  );

  return (
    <div className="h-full overflow-y-auto workspace-header-bg">
      <div className="p-3 border-b workspace-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 workspace-component-bg rounded-md items-center flex justify-center">
              <Users className="w-4 w-4 workspace-component-active-color" />
            </div>
            <div>
              <span className="text-sm font-bold">Teams Dashboard</span>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-[10px] workspace-header-text">
                  Overview of your teams, projects, and task progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workload Warnings */}
      {overloadedMembers.length > 0 && (
        <div className="pt-3 px-3">
          <div className="border-red-200 bg-red-50 p-3 rounded-lg flex items-center gap-2 border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs">
              <strong>{overloadedMembers.length}</strong> team member
              {overloadedMembers.length > 1 ? "s" : ""}{" "}
              {overloadedMembers.length > 1 ? "are" : "is"} currently
              overloaded. Consider redistributing tasks.
            </AlertDescription>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3">
        <Card className="group relative overflow-hidden workspace-surface border workspace-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium workspace-text-secondary">
              Total Teams
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold workspace-text">
              {stats.totalTeams}
            </div>
            <p className="text-xs workspace-text-muted mt-1">
              Active teams in workspace
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden workspace-surface border workspace-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium workspace-text-secondary">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold workspace-text">
              {stats.totalUsers}
            </div>
            <p className="text-xs workspace-text-muted mt-1">
              Team members across all teams
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden workspace-surface border workspace-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium workspace-text-secondary">
              Total Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold workspace-text">
              {stats.totalProjects}
            </div>
            <p className="text-xs workspace-text-muted mt-1">
              Active projects in workspace
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden workspace-surface border workspace-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium workspace-text-secondary">
              Total Tasks
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold workspace-text">
              {stats.totalTasks}
            </div>
            <p className="text-xs workspace-text-muted mt-1">
              Tasks across all projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workload Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-3 mb-3">
        <Card className="workspace-surface border workspace-border shadow-sm">
          <CardHeader>
            <CardTitle className="workspace-text text-sm flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-600" />
              Overloaded Members
            </CardTitle>
            <CardDescription className="workspace-text-muted text-xs">
              Members with &gt;100% workload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overloadedMembers.length}
            </div>
            <p className="text-xs workspace-text-muted mt-1">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="workspace-surface border workspace-border shadow-sm">
          <CardHeader>
            <CardTitle className="workspace-text text-sm flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              Balanced Members
            </CardTitle>
            <CardDescription className="workspace-text-muted text-xs">
              Members with 30-100% workload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {balancedMembers.length}
            </div>
            <p className="text-xs workspace-text-muted mt-1">
              Optimal workload distribution
            </p>
          </CardContent>
        </Card>

        <Card className="workspace-surface border workspace-border shadow-sm">
          <CardHeader>
            <CardTitle className="workspace-text text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Underutilized
            </CardTitle>
            <CardDescription className="workspace-text-muted text-xs">
              Members with &lt;30% workload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {underutilizedMembers.length}
            </div>
            <p className="text-xs workspace-text-muted mt-1">
              Available for more tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Assignment Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-3 pb-3">
        <Card className="workspace-surface border workspace-border shadow-sm">
          <CardHeader>
            <CardTitle className="workspace-text text-sm">
              Task Assignment
            </CardTitle>
            <CardDescription className="workspace-text-muted text-xs">
              Distribution of tasks across team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs workspace-text-secondary">
                  Assigned Tasks
                </span>
                <span className="text-xs font-medium workspace-text">
                  {stats.assignedTasks}
                </span>
              </div>
              <Progress
                value={
                  (stats.assignedTasks / Math.max(stats.totalTasks, 1)) * 100
                }
                variant="workspace"
                className="h-2"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs workspace-text-secondary">
                  Unassigned Tasks
                </span>
                <span className="text-xs font-medium workspace-text">
                  {stats.totalTasks - stats.assignedTasks}
                </span>
              </div>
              <Progress
                value={
                  ((stats.totalTasks - stats.assignedTasks) /
                    Math.max(stats.totalTasks, 1)) *
                  100
                }
                variant="workspace"
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="workspace-surface border workspace-border shadow-sm">
          <CardHeader>
            <CardTitle className="workspace-text text-sm">
              Task Completion
            </CardTitle>
            <CardDescription className="workspace-text-muted text-xs">
              Progress on task completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs workspace-text-secondary">
                  Completed Tasks
                </span>
                <span className="text-xs font-medium workspace-text">
                  {stats.completedTasks}
                </span>
              </div>
              <Progress
                variant="workspace"
                value={
                  (stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100
                }
                className="h-2"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs workspace-text-secondary">
                  In Progress
                </span>
                <span className="text-xs font-medium workspace-text">
                  {stats.totalTasks - stats.completedTasks}
                </span>
              </div>
              <Progress
                variant="workspace"
                value={
                  ((stats.totalTasks - stats.completedTasks) /
                    Math.max(stats.totalTasks, 1)) *
                  100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Workload Details */}
      {memberWorkloads.length > 0 && (
        <div className="pb-3 px-3">
          <Card className="workspace-surface border workspace-border shadow-sm">
            <CardHeader>
              <CardTitle className="workspace-text text-sm">
                Team Member Workloads
              </CardTitle>
              <CardDescription className="workspace-text-muted text-xs">
                Story count and workload balance per team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberWorkloads.map((member, index) => (
                  <div
                    key={member.memberId}
                    className="flex items-center justify-between p-3 workspace-surface-secondary rounded-lg border workspace-border"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback className="workspace-component-bg workspace-component-active-color">
                            {member.memberName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {member.account_id &&
                          member.account_id.trim() !== "" && (
                            <div className="absolute bottom-[-2px] right-[-2px] w-[14px] h-[14px] p-[2px] workspace-surface-secondary border workspace-border rounded-md flex items-center justify-center">
                              <JiraSvg />
                            </div>
                          )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium workspace-text text-sm">
                            {member.memberName}
                          </h3>
                          {member.isOverloaded && (
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs border workspace-border"
                          >
                            {member.role}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs border workspace-border"
                          >
                            {member.level}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs border workspace-border"
                          >
                            {member.storyCount} stories
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${getWorkloadColor(
                            member.workloadPercentage
                          )}`}
                        >
                          {member.workloadPercentage.toFixed(1)}%
                        </div>
                        <div className="text-xs workspace-text-muted">
                          {member.totalWorkload.toFixed(1)}h /{" "}
                          {member.maxWorkload.toFixed(1)}h
                        </div>
                      </div>
                      <div className="w-24">
                        <Progress
                          value={Math.min(member.workloadPercentage, 100)}
                          className="h-2"
                          variant="workspace"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-xs workspace-text-secondary hover:workspace-hover"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={(e) => {
                              // Find the actual TeamMember object and its team
                              let actualMember = null;
                              let teamId = null;

                              for (const team of teams) {
                                const teamMembers =
                                  (team as any).team_members || [];
                                const foundMember = teamMembers.find(
                                  (tm: any) => tm.id === member.memberId
                                );
                                if (foundMember) {
                                  actualMember = foundMember;
                                  teamId = team.id;
                                  break;
                                }
                              }

                              if (actualMember && teamId) {
                                // Ensure the member has the correct team_id
                                const memberWithTeamId = {
                                  ...actualMember,
                                  team_id: teamId,
                                };
                                handleDeleteMember(memberWithTeamId, e);
                              }
                            }}
                            className="text-red-600 focus:text-red-600 text-xs hover:workspace-hover cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teams Overview */}
      <div className="px-3 pb-3">
        <Card className="workspace-surface border workspace-border shadow-sm">
          <CardHeader>
            <CardTitle className="workspace-text text-sm">
              Teams Overview
            </CardTitle>
            <CardDescription className="workspace-text-muted text-xs">
              Progress and member count for each team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-4 workspace-surface-secondary rounded-lg border workspace-border"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 workspace-primary rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium workspace-text text-sm">
                          {team.name}
                        </h3>
                        {team.type === "jira" && (
                          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-1">
                            <div className="w-3 h-3">
                              <JiraSvg />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-blue-800">
                                Jira Team
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs workspace-text-muted">
                        {(team as any).team_members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-medium workspace-text">
                        {getTeamProgress(team)}%
                      </div>
                      <div className="text-xs workspace-text-muted text-xs">
                        Progress
                      </div>
                    </div>
                    <Progress
                      value={getTeamProgress(team)}
                      className="w-24 h-2"
                      variant="workspace"
                    />
                  </div>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 workspace-text-muted mx-auto mb-4" />
                  <h3 className="text-sm font-medium workspace-text mb-2">
                    No teams yet
                  </h3>
                  <p className="workspace-text-muted text-xs">
                    Create your first team to get started
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Member Modal */}
      {memberToDelete && (
        <DeleteMemberModal
          member={memberToDelete}
          teamName={
            teams.find((team) =>
              (team as any).team_members?.some(
                (tm: any) => tm.id === memberToDelete.id
              )
            )?.name || "Unknown Team"
          }
          open={isDeleteMemberModalOpen}
          onOpenChange={setIsDeleteMemberModalOpen}
          onConfirm={handleConfirmDeleteMember}
          isLoading={deletingMemberId === memberToDelete.id}
        />
      )}
    </div>
  );
}

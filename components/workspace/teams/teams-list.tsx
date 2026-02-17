"use client";

import { useState } from "react";
import type {
  Team,
  TeamMember,
  Role,
  Level,
  Profile,
} from "@/lib/database.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  Bot,
  Crown,
  Star,
  Sparkles,
  Trash2,
  ArrowLeft,
  MoreHorizontal,
  X,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import { getAvatarInitials } from "@/lib/utils";
import MemberDetailModal from "./modals/member-detail-modal";
import CreateMemberModal from "./modals/create-member-modal";
import AIAssistantModal from "./modals/ai-assistant-modal";
import DeleteMemberModal from "./modals/delete-member-modal";
import DeleteTeamModal from "./modals/delete-team-modal";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TeamsListProps {
  teams: Team[];
  roles: Role[];
  levels: Level[];
  profiles: Profile[];
  workspaceId: string;
  onRefresh: () => void;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
}

export default function TeamsList({
  teams,
  roles,
  levels,
  profiles,
  workspaceId,
  onRefresh,
  selectedTeam,
  setSelectedTeam,
}: TeamsListProps) {
  // Format skill names from snake_case to Title Case
  const formatSkillName = (skill: string) => {
    return skill
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isMemberDetailModalOpen, setIsMemberDetailModalOpen] = useState(false);
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [isAIAssistantModalOpen, setIsAIAssistantModalOpen] = useState(false);
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsMemberDetailModalOpen(true);
  };

  const handleCreateMember = (team: Team) => {
    setSelectedTeam(team);
    setIsCreateMemberModalOpen(true);
  };

  const handleAIAssistant = (team: Team) => {
    setSelectedTeam(team);
    setIsAIAssistantModalOpen(true);
  };

  const handleDeleteMember = (member: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemberToDelete(member);
    setIsDeleteMemberModalOpen(true);
  };

  const handleConfirmDeleteMember = async () => {
    if (!memberToDelete || !selectedTeam) return;

    try {
      setDeletingMemberId(memberToDelete.id);

      const response = await fetch(
        `/api/workspace/${workspaceId}/teams/${selectedTeam.id}/members/${memberToDelete.id}`,
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

  const handleDeleteTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteTeamModalOpen(true);
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

  const getMemberAvatar = (member: TeamMember) => {
    if (member.is_registered && member.profile) {
      return member.profile.avatar_url || undefined;
    }
    return undefined;
  };

  const getRoleIcon = (roleName: string) => {
    const role = roleName.toLowerCase();
    if (role.includes("manager") || role.includes("lead"))
      return <Crown className="h-4 w-4 text-yellow-500" />;
    if (role.includes("senior"))
      return <Star className="h-4 w-4 text-blue-500" />;
    return <Sparkles className="h-4 w-4 text-blue-500" />;
  };

  console.log(selectedTeam);

  return (
    <div className="h-full overflow-y-auto workspace-header-bg">
      <div className="p-3 border-b workspace-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 workspace-component-bg rounded-md items-center flex justify-center">
              <Users className="w-4 w-4 workspace-component-active-color" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {selectedTeam ? selectedTeam.name : "Teams List"}
                </span>
                {selectedTeam && (
                  <Badge variant="secondary" className="text-xs flex gap-1">
                    {(selectedTeam as any).team_members?.length || 0} members
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-[10px] workspace-header-text">
                  {selectedTeam
                    ? selectedTeam.description
                    : "Manage your teams and their members with precision"}
                </span>
              </div>
            </div>
          </div>
          {selectedTeam && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-7 p-2 text-xs"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2 w-48">
                  <DropdownMenuItem
                    onClick={() => handleCreateMember(selectedTeam as Team)}
                    className="cursor-pointer hover:workspace-hover text-xs"
                  >
                    <Plus className="h-4 w-4" />
                    Add Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAIAssistant(selectedTeam as Team)}
                    className="cursor-pointer hover:workspace-hover text-xs"
                  >
                    <Bot className="h-4 w-4" />
                    AI Assistant
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteTeam(selectedTeam as Team)}
                    className="cursor-pointer hover:bg-rose-50 text-xs text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 p-2 text-xs"
                onClick={() => setSelectedTeam(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 p-3">
        {selectedTeam ? (
          <Card className="workspace-surface border workspace-border shadow-sm">
            <CardContent className="p-3">
              {(selectedTeam as any).team_members &&
              (selectedTeam as any).team_members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(selectedTeam as any).team_members.map(
                    (member: any, memberIndex: number) => (
                      <Card
                        key={member.id}
                        className="group/member cursor-pointer hover:shadow-lg transition-all duration-300 workspace-surface border workspace-border hover:border-workspace-primary hover:scale-105"
                        onClick={() => handleMemberClick(member)}
                        style={{
                          animationDelay: `${memberIndex * 50}ms`,
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                <AvatarImage
                                  src={getMemberAvatar(member)}
                                  alt={getMemberDisplayName(member)}
                                />
                                <AvatarFallback className="workspace-sidebar-header-gradient text-white font-semibold text-3xl">
                                  {getAvatarInitials(member.name, member.email)}
                                </AvatarFallback>
                              </Avatar>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDeleteMember(member, e)}
                                disabled={deletingMemberId === member.id}
                                className="absolute -top-2 -right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover/member:opacity-100 transition-all duration-200 shadow-md bg-white border border-gray-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="text-center space-y-2">
                              <h3 className="font-semibold workspace-text text-lg">
                                {getMemberDisplayName(member)}
                              </h3>

                              <div className="flex items-center justify-center gap-2">
                                {member.is_registered ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-500/10 text-green-700 border-green-200 text-xs px-2 py-1"
                                  >
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                                    Registered
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="border-orange-200 text-orange-700 text-xs px-2 py-1"
                                  >
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="w-full space-y-3">
                              <div className="flex items-center gap-2 p-3 bg-gray-500/10 rounded-lg">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground">
                                    Email
                                  </p>
                                  <p className="text-sm workspace-text font-medium truncate">
                                    {getMemberEmail(member)}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-md">
                                  {getRoleIcon(member.role?.name || "Member")}
                                  <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                      Role
                                    </p>
                                    <p className="text-sm workspace-text font-medium">
                                      {member.role?.name || "Member"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-md">
                                  <Star className="h-4 w-4 text-purple-600" />
                                  <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                      Level
                                    </p>
                                    <p className="text-sm workspace-text font-medium">
                                      {member.level?.name || "Mid-Level"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-md">
                                  <Clock className="h-4 w-4 text-green-600" />
                                  <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                      Hours
                                    </p>
                                    <p className="text-sm workspace-text font-medium">
                                      {member.weekly_hours !== null &&
                                      member.weekly_hours !== undefined
                                        ? member.weekly_hours
                                        : 40}
                                      h/week
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 workspace-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium workspace-text mb-2">
                    No members yet
                  </h3>
                  <p className="workspace-text-muted mb-4">
                    Add team members to get started
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => handleCreateMember(selectedTeam)}
                      className="workspace-primary text-white hover:workspace-primary-hover"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAIAssistant(selectedTeam)}
                      className="workspace-surface-secondary border workspace-border workspace-text-secondary hover:workspace-hover"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      AI Assistant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <Card
                key={team.id}
                className="group cursor-pointer hover:shadow-md transition-all duration-300 workspace-surface border workspace-border hover:border-workspace-primary"
                onClick={() => setSelectedTeam(team)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 workspace-primary rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="workspace-text group-hover:text-workspace-primary transition-colors duration-200">
                        {team.name}
                      </CardTitle>
                      <CardDescription className="workspace-text-muted">
                        {(team as any).team_members?.length || 0} members
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {team.description && (
                    <p className="text-sm workspace-text-muted mb-4">
                      {team.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 workspace-primary rounded-full" />
                      <span className="text-xs workspace-text-secondary">
                        Active Team
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 workspace-text-muted hover:workspace-text"
                    >
                      View Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {teams.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Users className="h-16 w-16 workspace-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-medium workspace-text mb-2">
                  No teams yet
                </h3>
                <p className="workspace-text-muted mb-6">
                  Create your first team to start managing members
                </p>
                <Button className="workspace-primary text-white hover:workspace-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <MemberDetailModal
        member={selectedMember}
        open={isMemberDetailModalOpen}
        onOpenChange={setIsMemberDetailModalOpen}
        onRefresh={onRefresh}
      />

      <CreateMemberModal
        team={selectedTeam}
        roles={roles}
        levels={levels}
        profiles={profiles}
        open={isCreateMemberModalOpen}
        onOpenChange={setIsCreateMemberModalOpen}
        onSuccess={onRefresh}
      />

      <AIAssistantModal
        team={selectedTeam}
        roles={roles}
        levels={levels}
        profiles={profiles}
        open={isAIAssistantModalOpen}
        onOpenChange={setIsAIAssistantModalOpen}
        onSuccess={onRefresh}
      />

      <DeleteMemberModal
        member={memberToDelete}
        teamName={selectedTeam?.name || ""}
        open={isDeleteMemberModalOpen}
        onOpenChange={setIsDeleteMemberModalOpen}
        onConfirm={handleConfirmDeleteMember}
        isLoading={deletingMemberId === memberToDelete?.id}
      />

      <DeleteTeamModal
        team={selectedTeam}
        open={isDeleteTeamModalOpen}
        onOpenChange={setIsDeleteTeamModalOpen}
        onSuccess={onRefresh}
      />
    </div>
  );
}

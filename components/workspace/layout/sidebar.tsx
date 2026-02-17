"use client";

import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  BellOff,
  User,
  LogOut,
  CircleHelp,
  Brain,
  Building2,
  ShieldHalf,
  BookOpenText,
  Globe,
  FolderKanban,
} from "lucide-react";
import type {
  Workspace,
  Profile,
  Space,
  Project,
  SprintFolder,
  Sprint,
} from "@/lib/database.types";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/lib/auth-actions";
import { useAuth } from "@/contexts/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import InboxModal from "../modals/inbox-modal";
import InviteMembersModal from "../modals/invite-members-modal";
import InvestorRelationsModal from "../modals/investor-relations-modal";
import HelpGuideModal from "../modals/help-guide-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingLink } from "@/components/ui/loading-link";
import { getAvatarInitials, getIconColor } from "@/lib/utils";
import WeeklySurveyModalWrapper from "../modals/weekly-survey-modal-wrapper";

interface WorkspaceSidebarProps {
  workspace: Workspace;
  profile: Profile | null;
  spaces?: (Space & { projects: Project[]; sprint_folders: SprintFolder[] })[];
}

export default function WorkspaceSidebar({
  workspace,
  profile,
  spaces: initialSpaces,
}: WorkspaceSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isInviteMembersModalOpen, setIsInviteMembersModalOpen] =
    useState(false);
  const [isInvestorRelationsModalOpen, setIsInvestorRelationsModalOpen] =
    useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isInvestor, setIsInvestor] = useState<boolean | null>(null);
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set());
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );
  const [expandedSprintFolders, setExpandedSprintFolders] = useState<
    Set<string>
  >(new Set());
  const [isSpacesSectionOpen, setIsSpacesSectionOpen] = useState(true);
  const [spaces, setSpaces] = useState<
    (Space & { projects: Project[]; sprint_folders: SprintFolder[] })[]
  >(() =>
    (initialSpaces || [])
      .filter((s: any) => !s.deleted_at)
      .map((s: any) => ({
        ...s,
        projects: (s.projects || []).filter((p: any) => !p.deleted_at),
        sprint_folders: (s.sprint_folders || [])
          .map((sf: any) => ({
            ...sf,
            sprints: (sf.sprints || []).filter((sp: any) => !sp.deleted_at),
          }))
          .filter((sf: any) => !sf.deleted_at),
      }))
  );
  useEffect(() => {
    if (!initialSpaces) return;
    setSpaces(
      (initialSpaces || [])
        .filter((s: any) => !s.deleted_at)
        .map((s: any) => ({
          ...s,
          projects: (s.projects || []).filter((p: any) => !p.deleted_at),
          sprint_folders: (s.sprint_folders || [])
            .map((sf: any) => ({
              ...sf,
              sprints: (sf.sprints || []).filter((sp: any) => !sp.deleted_at),
            }))
            .filter((sf: any) => !sf.deleted_at),
        }))
    );
  }, [initialSpaces]);

  const toggleSpace = (spaceId: string) => {
    const next = new Set(expandedSpaces);
    next.has(spaceId) ? next.delete(spaceId) : next.add(spaceId);
    setExpandedSpaces(next);
  };
  const toggleProject = (projectId: string) => {
    const next = new Set(expandedProjects);
    next.has(projectId) ? next.delete(projectId) : next.add(projectId);
    setExpandedProjects(next);
  };
  const toggleSprintFolder = (sfId: string) => {
    const next = new Set(expandedSprintFolders);
    next.has(sfId) ? next.delete(sfId) : next.add(sfId);
    setExpandedSprintFolders(next);
  };
  const toggleSpacesSection = () => {
    const nextOpen = !isSpacesSectionOpen;
    setIsSpacesSectionOpen(nextOpen);
    if (!nextOpen) {
      setExpandedSpaces(new Set());
      setExpandedProjects(new Set());
      setExpandedSprintFolders(new Set());
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchAdminRole() {
      if (!user?.email) {
        setIsAdmin(false);
        setIsInvestor(false);
        return;
      }
      setIsAdmin(null); // loading
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .maybeSingle();
      if (isMounted) {
        setIsAdmin(data?.role === "admin");
        setIsInvestor(data?.role === "investor" || data?.role === "admin");
      }
    }
    fetchAdminRole();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const navigation = [
    {
      name: "Home",
      id: "sidebar-home-link",
      href: `/${workspaceId}/home`,
      icon: Home,
    },
    {
      name: "Teams",
      id: "sidebar-teams-link",
      href: `/${workspaceId}/teams`,
      icon: Users,
    },
    {
      name: "Workspaces",
      href: `/${workspaceId}/settings/workspaces`,
      icon: Building2,
    },
    // { name: "Analytics", href: `/${workspaceId}/analytics`, icon: BarChart3 },
    {
      name: "Agents",
      id: "sidebar-agents-link",
      href: `/${workspaceId}/agents`,
      icon: Brain,
    },
    {
      name: "Settings",
      href: `/${workspaceId}/settings/users`,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await signOutAction();
    router.push("/signin");
  };

  return (
    <>
      <WeeklySurveyModalWrapper />
      <div
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } workspace-primary-sidebar-bg text-white flex flex-col transition-all duration-300 relative rounded-xl border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {/* Workspace Header */}
        <div className="relative p-2 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm">
          {!isCollapsed && (
            <div className="flex p-2">
              <Image
                src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/sprintiq-logo.png"
                alt="sprintiq-logo"
                width={140}
                height={140}
              />
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center">
              <div className="relative group">
                <Image
                  src="/images/sprint-icon.png"
                  alt="sprintiq-logo"
                  width={80}
                  height={80}
                  className="p-2"
                />
              </div>
            </div>
          )}

          {/* Collapse/Expand Button
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute top-1/2 -translate-y-1/2 -right-3 w-9 h-9 bg-white/95 dark:bg-gray-800/95 border border-gray-200/60 dark:border-gray-600/60 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-900/10 dark:hover:shadow-black/20 transition-all duration-300 z-10 backdrop-blur-md ${
              isHovered
                ? "opacity-100 scale-100 translate-x-0 shadow-md"
                : "opacity-0 scale-95 translate-x-1"
            } group`}
          >
            <div className="relative">
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-200" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-200" />
              )}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </div>
          </button> */}
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 px-2 pb-2 space-y-2 relative z-10 ${
            isCollapsed ? "pt-2 px-3" : "pt-5 px-2"
          }`}
        >
          {navigation.map((item, index) => {
            let isActive = false;

            // Helper function to check if path matches with both /app and non-/app prefixes
            const pathMatches = (basePath: string) => {
              return (
                pathname === basePath ||
                pathname === `/app${basePath}` ||
                pathname.startsWith(`${basePath}/`) ||
                pathname.startsWith(`/app${basePath}/`)
              );
            };

            // Home: active for exact home paths
            if (item.name === "Home") {
              isActive =
                pathname === `/${workspaceId}/space` ||
                pathname === `/${workspaceId}/task` ||
                pathname === `/app/${workspaceId}` ||
                pathname === `/${workspaceId}/home` ||
                pathname === `/app/${workspaceId}/home`;
            }

            // Teams: active for teams paths
            else if (item.name === "Teams") {
              isActive = pathMatches(`/${workspaceId}/teams`);
            }

            // Workspaces: active for workspaces settings paths
            else if (item.name === "Workspaces") {
              isActive = pathMatches(`/${workspaceId}/settings/workspaces`);
            }

            // Analytics: active for analytics paths
            else if (item.name === "Analytics") {
              isActive = pathMatches(`/${workspaceId}/analytics`);
            }

            // Settings: active for settings paths (excluding workspaces)
            else if (item.name === "Settings") {
              isActive =
                (pathname.startsWith(`/${workspaceId}/settings`) ||
                  pathname.startsWith(`/app/${workspaceId}/settings`)) &&
                !pathname.startsWith(`/${workspaceId}/settings/workspaces`) &&
                !pathname.startsWith(`/app/${workspaceId}/settings/workspaces`);
            }

            // Agents: active for agents paths
            else if (item.name === "Agents") {
              isActive = pathMatches(`/${workspaceId}/agents`);
            }

            // Default: exact match
            else {
              isActive = pathname === item.href;
            }

            return (
              <LoadingLink
                key={item.name}
                href={item.href}
                loadingMessage={`Loading ${item.name.toLowerCase()}...`}
                className={`pb-2 ${
                  isCollapsed ? "flex flex-col items-center" : ""
                }`}
              >
                <div
                  id={item.id}
                  className={`group flex items-center p-2 mb-2 ${
                    isCollapsed ? "justify-center " : ""
                  } text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? "text-white shadow-lg border border-workspace-primary workspace-icon-gradient"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 workspace-primary rounded-full" />
                  )}

                  {/* Icon */}
                  <div className={`relative ${isCollapsed ? "" : "mr-2"}`}>
                    <item.icon
                      className={`h-4 w-4 transform group-hover:scale-110 transition-transform duration-200 ${
                        isActive
                          ? "text-workspace-primary-light"
                          : "text-current"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span className="font-medium tracking-wide text-sm text-white/70 group-hover:text-white">
                      {item.name}
                    </span>
                  )}

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                </div>
                {isCollapsed && (
                  <span className="text-[10px]">{item.name}</span>
                )}
              </LoadingLink>
            );
          })}
          {/* Spaces Tree */}
          {spaces && spaces.length > 0 && (
            <div className={`pb-2 ${isCollapsed ? "hidden" : ""}`}>
              <button
                type="button"
                onClick={toggleSpacesSection}
                className={`group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden w-full ${
                  isSpacesSectionOpen
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="mr-2 relative h-4 w-4">
                  <Globe className="h-4 w-4 absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-150 text-white/70 group-hover:text-white" />
                  {isSpacesSectionOpen ? (
                    <ChevronDown className="h-4 w-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-current" />
                  ) : (
                    <ChevronRight className="h-4 w-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-current" />
                  )}
                </div>
                <span className="font-medium tracking-wide text-sm text-white/70 group-hover:text-white">
                  Spaces
                </span>
              </button>
              {isSpacesSectionOpen && (
                <div className="space-y-1">
                  {spaces.map((space) => {
                    const isExpanded = expandedSpaces.has(space.space_id);
                    const spaceBasePath = `/${workspaceId}/space/${space.space_id}`;
                    const spaceActive = pathname === spaceBasePath;
                    return (
                      <div key={space.id} className="">
                        <div
                          className={`group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer relative ${
                            spaceActive
                              ? "text-white shadow-lg border border-workspace-primary workspace-icon-gradient"
                              : "hover:bg-white/10 text-white/70"
                          }`}
                          onClick={() => toggleSpace(space.space_id)}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {spaceActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 workspace-primary rounded-full" />
                          )}
                          <button className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white mr-2">
                            <span className="relative block h-4 w-4">
                              <span
                                className={`absolute w-4 h-4 inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-150 rounded-sm flex items-center justify-center ${getIconColor(
                                  space.icon
                                )}`}
                              >
                                <span className="text-xs font-bold text-current leading-none">
                                  {space.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-4 h-4 text-current" />
                              ) : (
                                <ChevronRight className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-4 h-4 text-current" />
                              )}
                            </span>
                          </button>
                          <span className="text-sm truncate text-white/70">
                            {space.name}
                          </span>
                        </div>
                        {isExpanded && (
                          <div className="ml-6 space-y-1">
                            {space.projects?.map((project) => {
                              const projectPath = `/${workspaceId}/space/${space.space_id}/project/${project.project_id}`;
                              const projectActive = pathname === projectPath;
                              return (
                                <LoadingLink
                                  key={project.id}
                                  href={projectPath}
                                  loadingMessage="Loading project..."
                                >
                                  <div
                                    className={`group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                                      projectActive
                                        ? "text-white shadow-lg border border-workspace-primary workspace-icon-gradient"
                                        : "hover:bg-white/10 text-white/70"
                                    }`}
                                  >
                                    {projectActive && (
                                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 workspace-primary rounded-full" />
                                    )}
                                    <FolderKanban className="h-4 w-4 text-white/70 group-hover:scale-110 transition-transform duration-150 mr-2" />
                                    <span className="truncate text-white/70 text-sm">
                                      {project.name}
                                    </span>
                                  </div>
                                </LoadingLink>
                              );
                            })}

                            {/* Sprint Folders */}
                            {space.sprint_folders?.map((sf) => {
                              const sfExpanded = expandedSprintFolders.has(
                                sf.sprint_folder_id
                              );
                              const sfPath = `/${workspaceId}/space/${space.space_id}/sf/${sf.sprint_folder_id}`;
                              const sfActive = pathname === sfPath;
                              return (
                                <div key={sf.id}>
                                  <div
                                    className={`group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                                      sfActive
                                        ? "text-white shadow-lg border border-workspace-primary workspace-icon-gradient"
                                        : "hover:bg-white/10 text-white/70 hover:text-white"
                                    }`}
                                  >
                                    {sfActive && (
                                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 workspace-primary rounded-full" />
                                    )}
                                    <button
                                      onClick={() =>
                                        toggleSprintFolder(sf.sprint_folder_id)
                                      }
                                      className="w-5 h-5 flex items-center justify-center mr-2"
                                      aria-label={
                                        sfExpanded ? "Collapse" : "Expand"
                                      }
                                    >
                                      {sfExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4" />
                                      )}
                                    </button>
                                    <LoadingLink
                                      href={sfPath}
                                      loadingMessage="Loading sprint folder..."
                                      className="truncate"
                                    >
                                      {sf.name}
                                    </LoadingLink>
                                  </div>
                                  {sfExpanded && (
                                    <div className="ml-6 space-y-1">
                                      {sf.sprints?.map((sp) => {
                                        const spPath = `/${workspaceId}/space/${space.space_id}/sf/${sf.sprint_folder_id}/s/${sp.sprint_id}`;
                                        const spActive =
                                          pathname.startsWith(spPath);
                                        return (
                                          <LoadingLink
                                            key={sp.id}
                                            href={spPath}
                                            loadingMessage="Loading sprint..."
                                          >
                                            <div
                                              className={`group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                                                spActive
                                                  ? "text-white shadow-lg border border-workspace-primary workspace-icon-gradient"
                                                  : "hover:bg-white/10 text-white/70 hover:text-white"
                                              }`}
                                            >
                                              {spActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 workspace-primary rounded-full" />
                                              )}
                                              <span className="truncate">
                                                {sp.name}
                                              </span>
                                            </div>
                                          </LoadingLink>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Investor Relations */}
        {isInvestor && (
          <div className="px-2 relative z-10">
            <button
              className="w-full"
              onClick={() => setIsInvestorRelationsModalOpen(true)}
            >
              {isCollapsed ? (
                <div className="group flex items-center justify-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 text-white/70">
                  <BookOpenText className="h-4 w-4" />
                </div>
              ) : (
                <div className="group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 text-white/70 w-full">
                  <BookOpenText className="h-4 w-4 mr-2" />
                  <span className="truncate">Investor Relations</span>
                </div>
              )}
              {isCollapsed && (
                <span className="font-medium text-[10px]">
                  Investor Relations
                </span>
              )}
            </button>
          </div>
        )}

        {/* Invite Members Button */}
        <div className="px-2 relative z-10">
          <button
            className="w-full"
            onClick={() => setIsInviteMembersModalOpen(true)}
          >
            {isCollapsed ? (
              <div className="group flex items-center justify-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 text-white/70">
                <UserPlus className="h-4 w-4" />
              </div>
            ) : (
              <div className="group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 text-white/70 w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="truncate">Invite Members</span>
              </div>
            )}
            {isCollapsed && (
              <span className="font-medium text-[10px]">Invite</span>
            )}
          </button>
        </div>
        {/* Help Button */}
        <div className="px-2 relative z-10">
          <button className="w-full" onClick={() => setIsHelpModalOpen(true)}>
            {isCollapsed ? (
              <div className="group flex items-center justify-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 text-white/70">
                <CircleHelp className="h-4 w-4" />
              </div>
            ) : (
              <div className="group flex items-center p-2 mb-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 text-white/70 w-full">
                <CircleHelp className="h-4 w-4 mr-2" />
                <span className="truncate">Help</span>
              </div>
            )}
            {isCollapsed && (
              <span className="font-medium text-[10px]">Help</span>
            )}
          </button>
        </div>

        {/* User Dropdown Session */}
        <div className="p-2 relative z-10 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center" : "justify-start space-x-3"
                } text-left hover:bg-white/10 rounded-xl p-2 transition-all duration-200 group`}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 transition-all duration-200 rounded-md">
                    <AvatarImage
                      src={profile?.avatar_url ?? undefined}
                      alt={profile?.email ?? user?.email ?? "User"}
                    />
                    <AvatarFallback className="workspace-sidebar-header-gradient text-white font-semibold text-sm">
                      {getAvatarInitials(
                        profile?.full_name,
                        profile?.email ?? user?.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold truncate text-white/90 group-hover:text-white transition-colors">
                      {profile?.full_name ||
                        profile?.email ||
                        user?.email ||
                        "Guest User"}
                    </h3>
                    <p className="text-xs text-white/60 font-medium">
                      {user?.user_metadata?.role || "Admin"}
                    </p>
                  </div>
                )}
                {!isCollapsed && (
                  <ChevronDown className="h-4 w-4 text-white/60 group-hover:text-white/80 transition-colors ml-auto" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="ml-2 w-64 absolute bottom-0"
            >
              {isAdmin === null ? (
                <DropdownMenuItem
                  disabled
                  className="text-xs cursor-wait rounded-lg m-1 transition-colors"
                >
                  <ShieldHalf className="mr-1 h-4 w-4" />
                  Checking admin...
                </DropdownMenuItem>
              ) : isAdmin ? (
                <>
                  <DropdownMenuItem
                    className="text-xs hover:workspace-hover cursor-pointer rounded-lg m-1 transition-colors"
                    onClick={() => router.push("/admin/dashboard")}
                  >
                    <ShieldHalf className="mr-1 h-4 w-4" />
                    Admin Page
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="workspace-hover my-2" />
                </>
              ) : null}
              <DropdownMenuItem
                className="text-xs hover:workspace-hover cursor-pointer rounded-lg m-1 transition-colors"
                onClick={() => router.push(`/${workspaceId}/settings/profile`)}
              >
                <User className="mr-1 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs hover:workspace-hover cursor-pointer rounded-lg m-1 transition-colors"
                onClick={() =>
                  router.push(`/${workspaceId}/settings/notifications`)
                }
              >
                <BellOff className="mr-1 h-4 w-4" />
                Notification Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="workspace-hover my-2" />
              <DropdownMenuItem
                className="text-rose-500 text-xs hover:bg-rose-500/20 hover:text-rose-300 cursor-pointer rounded-lg m-1 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Inbox Modal (kept for potential future use, though button is removed) */}
        <InboxModal
          open={isInboxOpen}
          onOpenChange={setIsInboxOpen}
          workspace={workspace}
        />

        {/* Invite Members Modal */}
        <InviteMembersModal
          open={isInviteMembersModalOpen}
          onOpenChange={setIsInviteMembersModalOpen}
          workspace={workspace}
        />

        {/* Investor Relations Modal */}
        <InvestorRelationsModal
          open={isInvestorRelationsModalOpen}
          onOpenChange={setIsInvestorRelationsModalOpen}
        />

        {/* Help & Guides Modal */}
        <HelpGuideModal
          open={isHelpModalOpen}
          onOpenChange={setIsHelpModalOpen}
        />
      </div>
    </>
  );
}

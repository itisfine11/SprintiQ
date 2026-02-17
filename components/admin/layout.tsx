"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Mail,
  Clock,
  LogOut,
  Sun,
  Moon,
  Building2,
  LayoutDashboard,
  ChartBar,
  BookOpen,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  EllipsisVertical,
  Bell,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { signOutAction } from "@/lib/auth-actions";
import { useLoading } from "@/contexts/loading-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/provider/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUnreadEventsCount } from "@/lib/events";
import { createClientSupabaseClient } from "@/lib/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: Bell,
  },
  {
    label: "Emails",
    href: "/admin/emails",
    icon: Mail,
  },
  {
    label: "Time Track",
    href: "/admin/time-track",
    icon: Clock,
  },
  {
    label: "User Survey",
    href: "/admin/user-survey",
    icon: ClipboardList,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: ChartBar,
  },
  {
    label: "Insights",
    href: "/admin/insights",
    icon: BookOpen,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { startPageLoading, stopPageLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [workspacesModalOpen, setWorkspacesModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [workspacesError, setWorkspacesError] = useState<string | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const supabase = createClientSupabaseClient();
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // User metadata may have full_name, avatar_url
  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Admin";
  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url || undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stop loading when pathname changes (page has loaded)
  useEffect(() => {
    const timer = setTimeout(() => {
      stopPageLoading();
      setNavigatingTo(null);
    }, 100); // Small delay to ensure the page has rendered

    return () => clearTimeout(timer);
  }, [pathname, stopPageLoading]);

  // Fetch only workspaces where user is owner
  useEffect(() => {
    if (!workspacesModalOpen || !user) return;
    setLoadingWorkspaces(true);
    setWorkspacesError(null);
    const supabase = createClientSupabaseClient();
    supabase
      .from("workspaces")
      .select("id, name, purpose, workspace_id, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }: any) => {
        if (error) setWorkspacesError("Failed to load workspaces");
        else setWorkspaces(data || []);
        setLoadingWorkspaces(false);
      });
  }, [workspacesModalOpen, user]);

  // Fetch unread notifications count and recent events
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const supabase = createClientSupabaseClient();

        // Get total unread events count for admin
        const { count, error } = await supabase
          .from("events")
          .select(
            `
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `,
            { count: "exact", head: true }
          )
          .eq("type", "registered")
          .eq("entity_type", "auth")
          .eq("is_read", false);

        if (error) {
          console.error("Failed to get unread events count:", error);
          return;
        }

        setUnreadNotificationsCount(count || 0);

        // Get latest 5 unread events for notification dropdown
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select(
            `
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `
          )
          .eq("type", "registered")
          .eq("entity_type", "auth")
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(5);

        if (eventsError) {
          console.error("Failed to get recent events:", eventsError);
          console.error("Error details:", JSON.stringify(eventsError, null, 2));
          return;
        }

        console.log("Recent events loaded:", eventsData?.length || 0, "events");
        setRecentEvents(eventsData || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [user]);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      setNavigatingTo(href);
      startPageLoading("Loading admin page...");
      router.push(href);
    }
  };

  const handleLogout = async () => {
    await signOutAction();
    router.push("/signin");
  };

  const handleEventClick = async (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);

    // Mark event as read
    if (!event.is_read) {
      try {
        const supabase = createClientSupabaseClient();
        await supabase
          .from("events")
          .update({ is_read: true })
          .eq("id", event.id);

        // Update local state
        setRecentEvents((prev) =>
          prev.map((e) => (e.id === event.id ? { ...e, is_read: true } : e))
        );

        // Update unread count
        setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking event as read:", error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const supabase = createClientSupabaseClient();

      // Get the IDs of the displayed events
      const eventIds = recentEvents.map((event) => event.id);

      if (eventIds.length === 0) return;

      // Mark only the displayed events as read
      await supabase
        .from("events")
        .update({ is_read: true })
        .in("id", eventIds);

      // Clear the recent events list since they're all read now
      setRecentEvents([]);

      // Update unread count by subtracting the number of events we just marked as read
      setUnreadNotificationsCount((prev) =>
        Math.max(0, prev - eventIds.length)
      );
    } catch (error) {
      console.error("Error marking displayed events as read:", error);
    }
  };

  return (
    <div className="h-screen flex workspace-bg p-2 gap-2">
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-emerald-700 to-emerald-800 rounded-xl text-white flex flex-col transition-all duration-300 relative border-r border-emerald-600/20 shadow-xl`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-900/20 pointer-events-none rounded-xl" />

        {/* Header Section */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-6 relative z-10">
          {!collapsed && (
            <div className="relative">
              <Image
                src="/images/sprint-icon.png"
                height={36}
                width={36}
                alt="SprintiQ Admin"
                className="drop-shadow-lg"
              />
            </div>
          )}
          <div className={`${collapsed ? "flex-1 flex justify-center" : ""}`}>
            {!collapsed ? (
              <>
                <span className="text-xl font-bold text-white drop-shadow-sm">
                  SprintiQ
                </span>
                <div className="text-xs text-emerald-100/80 font-medium">
                  Admin Panel
                </div>
              </>
            ) : (
              <div className="relative">
                <Image
                  src="/images/sprint-icon.png"
                  height={36}
                  width={36}
                  alt="SprintiQ"
                  className="drop-shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-6 space-y-1 relative z-10">
          {adminNavItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              disabled={navigatingTo === item.href}
              className={
                "group flex items-center p-3 mb-1 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden w-full text-left " +
                (pathname === item.href
                  ? "bg-white/15 text-white shadow-lg border border-white/20 font-semibold"
                  : "text-emerald-100 hover:bg-white/10 hover:text-white") +
                (navigatingTo === item.href
                  ? " opacity-50 cursor-not-allowed"
                  : "")
              }
              title={collapsed ? item.label : undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              {navigatingTo === item.href ? (
                <Loader2
                  className={`${
                    collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                  } relative z-10 animate-spin`}
                />
              ) : (
                <item.icon
                  className={`${
                    collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                  } relative z-10`}
                />
              )}
              {!collapsed && (
                <span className="relative z-10">{item.label}</span>
              )}
              {pathname === item.href && !collapsed && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-sm" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer Section */}

        <div className="px-4 pb-6 relative z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
              <button
                className={`bg-white/10 border border-white/10 flex gap-2 items-center w-full justify-between ${
                  collapsed
                    ? "justify-center rounded-md p-[7px]"
                    : "rounded-xl p-4"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-8 w-8 rounded-md ">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="workspace-sidebar-header-gradient font-semibold text-sm">
                        {getAvatarInitials(fullName, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-green-500 border-2 border-[#1F6E57] rounded-full" />
                  </div>

                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold max-w-xs truncate">
                        {fullName}
                      </span>
                      <span className="text-xs text-emerald-100/80 font-medium">
                        Admin Access
                      </span>
                    </div>
                  )}
                </div>
                {!collapsed && <EllipsisVertical className="h-4 w-4" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[200px] absolute bottom-0 ml-2 mb-1"
            >
              <DropdownMenuItem className="text-sm rounded-lg m-1 transition-colors flex items-center gap-2">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold max-w-xs truncate">
                    {fullName}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-sm hover:workspace-hover cursor-pointer rounded-lg m-1 transition-colors flex items-center gap-2"
                onClick={() => setWorkspacesModalOpen(true)}
              >
                <Building2 className="h-4 w-4" />
                Workspaces
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-sm text-rose-500 hover:bg-rose-500/20 hover:text-rose-300 cursor-pointer rounded-lg m-1 transition-colors flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col overflow-hidden gap-2 h-full flex-1">
        <header className="workspace-header-bg p-3 rounded-xl shadow flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hover:workspace-hover [&_svg]:size-5 "
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Notifications"
                  className="hover:workspace-hover relative [&_svg]:size-5"
                >
                  <Bell />
                  {unreadNotificationsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-[2px] right-[2px] h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] font-bold"
                    >
                      {unreadNotificationsCount > 99
                        ? "99+"
                        : unreadNotificationsCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuItem className="text-sm font-semibold p-3">
                  <div className="flex items-center justify-between w-full">
                    <span>Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-rose-500/10 text-rose-500"
                      >
                        {unreadNotificationsCount} new
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {recentEvents.length > 0 ? (
                    recentEvents.map((event) => (
                      <DropdownMenuItem
                        key={event.id}
                        className={`text-sm p-3 hover:bg-gray-50 rounded-none cursor-pointer ${
                          event.is_read ? "" : "border-l-2 border-emerald-500"
                        }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex gap-2 items-start w-full">
                          <Avatar className="h-8 w-8 rounded-md">
                            <AvatarImage
                              src={event.profiles?.avatar_url || ""}
                            />
                            <AvatarFallback className="text-xs font-bold bg-emerald-500/10 text-emerald-600">
                              {getAvatarInitials(
                                event.profiles?.full_name || "",
                                event.profiles?.email || ""
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {event.entity_name}
                              </span>
                              <span className="text-xs text-gray-500 ml-auto">
                                {formatDistanceToNow(
                                  new Date(event.created_at),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600">
                              New user registration: {event.entity_name}
                            </span>
                            {event.metadata?.company && (
                              <span className="text-xs text-gray-500">
                                Company: {event.metadata.company}
                              </span>
                            )}
                            <div className="flex gap-2 mt-2">
                              <span className="px-1 py-0 rounded-md text-[10px] bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                {event.type.charAt(0).toUpperCase() +
                                  event.type.slice(1)}
                              </span>
                              <span className="px-1 py-0 rounded-md text-[10px] bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                {event.entity_type.charAt(0).toUpperCase() +
                                  event.entity_type.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 p-3 text-center">
                      No recent events
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                {recentEvents.length > 0 && (
                  <DropdownMenuItem
                    className="text-sm hover:workspace-hover cursor-pointer rounded-lg m-1 transition-colors flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                    onClick={handleMarkAllAsRead}
                  >
                    <span>Mark all as read</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-sm hover:workspace-hover cursor-pointer rounded-lg m-1 transition-colors flex items-center gap-2"
                  onClick={() => router.push("/admin/events")}
                >
                  <span>View all notifications</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="hover:workspace-hover [&_svg]:size-5"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-full focus:outline-none hover:workspace-hover">
                    <Avatar className="h-8 w-8 rounded-md">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="workspace-sidebar-header-gradient font-semibold text-sm">
                        {getAvatarInitials(fullName, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="text-xs hover:workspace-hover cursor-pointer rounded-lg m-1 transition-colors flex items-center gap-2"
                    onClick={() => setWorkspacesModalOpen(true)}
                  >
                    <Building2 className="h-4 w-4" />
                    Workspaces
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs text-rose-500 hover:bg-rose-500/20 hover:text-rose-300 cursor-pointer rounded-lg m-1 transition-colors flex items-center gap-2"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-auto rounded-xl workspace-header-bg p-8 shadow-inner">
          {children}
        </main>
      </div>

      <Dialog open={workspacesModalOpen} onOpenChange={setWorkspacesModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Workspaces</DialogTitle>
          </DialogHeader>
          {loadingWorkspaces ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading workspaces...</span>
            </div>
          ) : workspacesError ? (
            <div className="text-red-500 text-center py-4">
              {workspacesError}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-gray-600 text-center py-4">
              No workspaces found.
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {workspaces.map((ws) => (
                  <Link
                    key={ws.id}
                    href={`/${ws.workspace_id}/home`}
                    className="block"
                    onClick={() => setWorkspacesModalOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left py-2 h-auto"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{ws.name}</span>
                        <span className="text-xs text-gray-500 capitalize">
                          {ws.purpose}
                        </span>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  selectedEvent?.type === "created"
                    ? "bg-green-500"
                    : selectedEvent?.type === "updated"
                    ? "bg-blue-500"
                    : selectedEvent?.type === "deleted"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Event Type
                  </label>
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-md text-xs bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      {selectedEvent.type.charAt(0).toUpperCase() +
                        selectedEvent.type.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Entity Type
                  </label>
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-md text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {selectedEvent.entity_type.charAt(0).toUpperCase() +
                        selectedEvent.entity_type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Entity Name
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">
                    {selectedEvent.entity_name}
                  </p>
                </div>
              </div>

              {selectedEvent.metadata && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Metadata
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Created At
                  </label>
                  <div className="mt-1 text-sm text-gray-600">
                    {new Date(selectedEvent.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        selectedEvent.is_read
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      }`}
                    >
                      {selectedEvent.is_read ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { LoadingOverlay } from "@/components/ui/loading-page";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  User,
  Building2,
  Folder,
  CheckSquare,
  Hash,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Event } from "@/lib/database.types";

interface EventWithRelations {
  id: string;
  event_id: string;
  type: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  user_id: string;
  workspace_id: string;
  space_id: string | null;
  project_id: string | null;
  parent_task_id: string | null;
  description: string;
  metadata: any;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  user?: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  workspace?: {
    name: string;
    workspace_id: string;
  };
}

interface AdminEventsComponentProps {
  initialEvents?: EventWithRelations[];
  initialTotalCount?: number;
  initialWorkspaces?: any[];
  initialUsers?: any[];
  error?: string | null;
}

export default function AdminEventsComponent({
  initialEvents = [],
  initialTotalCount = 0,
  initialWorkspaces = [],
  initialUsers = [],
  error: initialError = null,
}: AdminEventsComponentProps) {
  const { user } = useAuth();
  const supabase = createClientSupabaseClient();

  // State
  const [events, setEvents] = useState<EventWithRelations[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [workspaces, setWorkspaces] = useState<any[]>(initialWorkspaces);
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [error, setError] = useState<string | null>(initialError);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 20;

  // Load events
  const loadEvents = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
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
        .order("created_at", { ascending: false });
      // Apply event type filter
      if (eventTypeFilter !== "all") {
        query = query.eq("type", eventTypeFilter);
      }

      // Apply entity type filter
      if (entityTypeFilter !== "all") {
        query = query.eq("entity_type", entityTypeFilter);
      }
      // Apply filters
      if (searchQuery) {
        query = query.or(
          `entity_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      if (workspaceFilter !== "all") {
        query = query.eq("workspace_id", workspaceFilter);
      }

      if (statusFilter === "unread") {
        query = query.eq("is_read", false);
      } else if (statusFilter === "read") {
        query = query.eq("is_read", true);
      }

      // Get total count for pagination
      let countQuery = supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("type", "registered")
        .eq("entity_type", "auth");
      // Apply same filters to count query
      if (eventTypeFilter !== "all") {
        countQuery = countQuery.eq("type", eventTypeFilter);
      }

      if (entityTypeFilter !== "all") {
        countQuery = countQuery.eq("entity_type", entityTypeFilter);
      }
      // Apply same filters to count query
      if (searchQuery) {
        countQuery = countQuery.or(
          `entity_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      if (workspaceFilter !== "all") {
        countQuery = countQuery.eq("workspace_id", workspaceFilter);
      }

      if (statusFilter === "unread") {
        countQuery = countQuery.eq("is_read", false);
      } else if (statusFilter === "read") {
        countQuery = countQuery.eq("is_read", true);
      }

      const { count: totalCount } = await countQuery;
      setTotalCount(totalCount || 0);

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error("Failed to load events:", error);
        setError("Failed to load events");
        return;
      }

      setEvents(data || []);
      setError(null);
    } catch (error) {
      console.error("Error loading events:", error);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [
    user,
    searchQuery,
    eventTypeFilter,
    entityTypeFilter,
    statusFilter,
    workspaceFilter,
    currentPage,
    supabase,
  ]);

  // Load workspaces and users for filters
  const loadFilters = useCallback(async () => {
    try {
      // Load workspaces
      const { data: workspacesData } = await supabase
        .from("workspaces")
        .select("id, name, workspace_id")
        .order("name");

      // Load users
      const { data: usersData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name");

      setWorkspaces(workspacesData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  }, [supabase]);

  // Load data on mount
  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Real-time subscription for new events
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("admin_events")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          loadEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, loadEvents]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "workspace":
        return <Building2 className="h-4 w-4" />;
      case "space":
        return <Hash className="h-4 w-4" />;
      case "project":
        return <Folder className="h-4 w-4" />;
      case "task":
      case "subtask":
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <Hash className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "created":
        return "bg-green-100 text-green-800";
      case "updated":
        return "bg-blue-100 text-blue-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      case "reordered":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-muted-foreground text-sm">
          Monitor events and activities in your workspaces
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading events
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Event Types</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
        <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by entity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entity Types</SelectItem>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="workspace">Workspace</SelectItem>
            <SelectItem value="space">Space</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="task">Task</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadEvents} disabled={loading} className="ml-auto">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Events Table */}
      <div className="relative rounded-xl p-0 md:p-6 shadow-lg border workspace-border overflow-x-auto">
        {loading && <LoadingOverlay />}
        <table className="min-w-full text-sm">
          <thead>
            <tr className="workspace-sidebar-text">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("user")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  User {getSortIcon("user")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("description")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Description {getSortIcon("description")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("type")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Event Type {getSortIcon("type")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("entity_type")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Entity Type {getSortIcon("entity_type")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("is_read")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Status {getSortIcon("is_read")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Time {getSortIcon("created_at")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">No events found</p>
                    <p className="text-sm">
                      Events will appear here when users perform actions in
                      workspaces.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t workspace-border hover:workspace-hover cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 flex items-center gap-2 min-w-[180px]">
                    <Avatar className="h-8 w-8 group-hover:scale-105 duration-300">
                      <AvatarImage
                        src={event.profiles?.avatar_url || undefined}
                      />
                      <AvatarFallback className="text-xs font-bold bg-emerald-500/10 text-emerald-600 font-bold">
                        {getAvatarInitials(
                          event.profiles?.full_name,
                          event.profiles?.email
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="workspace-sidebar-text group-hover:scale-105 duration-300">
                      <div className="font-medium text-sm">
                        {event.profiles?.full_name || "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.profiles?.email || "No email"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                    <div className="text-xs text-gray-500">
                      {event.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                    <span className="px-2 py-1 rounded-md text-xs bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                    <span className="px-2 py-1 rounded-md text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {event.entity_type.charAt(0).toUpperCase() +
                        event.entity_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 group-hover:scale-105 duration-300">
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        event.is_read
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      }`}
                    >
                      {event.is_read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(event.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 group-hover:scale-105 duration-300">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewEvent(event)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}{" "}
            events
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                const show =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1;
                if (
                  !show &&
                  ((pageNum === 2 && currentPage > 3) ||
                    (pageNum === totalPages - 1 &&
                      currentPage < totalPages - 2))
                ) {
                  return (
                    <PaginationItem key={pageNum + "ellipsis"}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                if (!show) return null;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={isCurrent}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
    </>
  );
}

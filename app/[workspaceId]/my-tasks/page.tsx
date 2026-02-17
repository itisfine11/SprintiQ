"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import {
  Filter,
  Calendar,
  User,
  CheckSquare,
  Plus,
  Loader2,
  Goal,
  CircleUser,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  getAvatarInitials,
  getPriorityColor,
  getStatusTypeBgColor,
  getStatusTypeColor,
  getStatusTypeText,
  getStatusTypeTextColor,
} from "@/lib/utils";
import { stripFormatting } from "@/components/workspace/views/project/utils";
import { tagColorClasses } from "@/components/workspace/views/task-detail-view/utils";
import type {
  Task,
  Workspace,
  Status,
  Tag as TagType,
} from "@/lib/database.types";
import MyTasksLoading from "./loading";
import { ListView as ProjectListView } from "@/components/workspace/views/project/views/ListView";
import { BoardView as ProjectBoardView } from "@/components/workspace/views/project/views/BoardView";
import { TaskCard } from "@/components/workspace/views/project/components/TaskCard";
import { StatusColumn } from "@/components/workspace/views/project/components/StatusColumn";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";

interface MyTasksPageProps {}

interface TaskWithDetails extends Omit<Task, "status"> {
  space: { name: string; space_id: string };
  project?: { name: string; project_id: string };
  sprint?: { name: string; sprint_id: string };
  status?: {
    name: string;
    status_type_id: string | null;
    status_type?: { name: string };
  };
}

interface FilterState {
  search: string;
  status: string[];
  priority: string[];
  assignee: string[];
  createdBy: string[];
  tags: string[];
  dueDate: { from?: Date; to?: Date };
  createdDate: { from?: Date; to?: Date };
}

interface SortState {
  field:
    | "name"
    | "priority"
    | "due_date"
    | "created_at"
    | "status"
    | "assignee";
  direction: "asc" | "desc";
}

const priorityConfig = {
  low: { label: "Low", color: "text-green-500" },
  medium: { label: "Medium", color: "text-blue-500" },
  high: { label: "High", color: "text-yellow-500" },
  critical: { label: "Critical", color: "text-red-500" },
};

export default function MyTasksPage({}: MyTasksPageProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { user } = useAuth();
  const supabase = createClientSupabaseClient();
  const { toast } = useEnhancedToast();
  const router = useRouter();

  // State
  const [assignedTasks, setAssignedTasks] = useState<TaskWithDetails[]>([]);
  const [createdTasks, setCreatedTasks] = useState<TaskWithDetails[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [activeTab, setActiveTab] = useState("assigned");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [showFilters, setShowFilters] = useState(false);

  // Bridge state for reusing Project ListView
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [collapsedStatuses, setCollapsedStatuses] = useState<Set<string>>(
    new Set()
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      "assignee",
      "dueDate",
      "priority",
      "subtasks",
      "createdAt",
      "createdBy",
    ])
  );
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [activeStatus, setActiveStatus] = useState<any | null>(null);

  // DnD sensors for drag & drop on Board view
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Filter and sort state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    priority: [],
    assignee: [],
    createdBy: [],
    tags: [],
    dueDate: {},
    createdDate: {},
  });

  const [sort, setSort] = useState<SortState>({
    field: "due_date",
    direction: "asc",
  });

  // Filter and sort tasks
  const filteredAndSortedAssignedTasks = useMemo(() => {
    let filtered = assignedTasks;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(searchLower) ||
          (task.description &&
            stripFormatting(task.description)
              .toLowerCase()
              .includes(searchLower))
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(
        (task) =>
          task.status?.status_type?.name &&
          filters.status.includes(task.status.status_type.name)
      );
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(
        (task) => task.priority && filters.priority.includes(task.priority)
      );
    }

    // Apply assignee filter
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(
        (task) =>
          task.assignee_id && filters.assignee.includes(task.assignee_id)
      );
    }

    // Apply created by filter
    if (filters.createdBy.length > 0) {
      filtered = filtered.filter(
        (task) => task.created_by && filters.createdBy.includes(task.created_by)
      );
    }

    // Apply due date filter
    if (filters.dueDate.from || filters.dueDate.to) {
      filtered = filtered.filter((task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        if (filters.dueDate.from && taskDate < filters.dueDate.from)
          return false;
        if (filters.dueDate.to && taskDate > filters.dueDate.to) return false;
        return true;
      });
    }

    // Apply created date filter
    if (filters.createdDate.from || filters.createdDate.to) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.created_at);
        if (filters.createdDate.from && taskDate < filters.createdDate.from)
          return false;
        if (filters.createdDate.to && taskDate > filters.createdDate.to)
          return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "priority":
          aValue = a.priority || "";
          bValue = b.priority || "";
          break;
        case "due_date":
          aValue = a.due_date ? new Date(a.due_date).getTime() : 0;
          bValue = b.due_date ? new Date(b.due_date).getTime() : 0;
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "status":
          aValue = a.status?.name || "";
          bValue = b.status?.name || "";
          break;
        case "assignee":
          aValue = a.assignee?.full_name || "";
          bValue = b.assignee?.full_name || "";
          break;
        default:
          return 0;
      }

      if (sort.direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Debug logging
    console.log("Filtered assigned tasks:", {
      original: assignedTasks.length,
      filtered: filtered.length,
      filters: filters,
      sort: sort,
    });

    return filtered;
  }, [assignedTasks, filters, sort]);

  const filteredAndSortedCreatedTasks = useMemo(() => {
    let filtered = createdTasks;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(searchLower) ||
          (task.description &&
            stripFormatting(task.description)
              .toLowerCase()
              .includes(searchLower))
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(
        (task) =>
          task.status?.status_type?.name &&
          filters.status.includes(task.status.status_type.name)
      );
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(
        (task) => task.priority && filters.priority.includes(task.priority)
      );
    }

    // Apply assignee filter
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(
        (task) =>
          task.assignee_id && filters.assignee.includes(task.assignee_id)
      );
    }

    // Apply created by filter
    if (filters.createdBy.length > 0) {
      filtered = filtered.filter(
        (task) => task.created_by && filters.createdBy.includes(task.created_by)
      );
    }

    // Apply due date filter
    if (filters.dueDate.from || filters.dueDate.to) {
      filtered = filtered.filter((task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        if (filters.dueDate.from && taskDate < filters.dueDate.from)
          return false;
        if (filters.dueDate.to && taskDate > filters.dueDate.to) return false;
        return true;
      });
    }

    // Apply created date filter
    if (filters.createdDate.from || filters.createdDate.to) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.created_at);
        if (filters.createdDate.from && taskDate < filters.createdDate.from)
          return false;
        if (filters.createdDate.to && taskDate > filters.createdDate.to)
          return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "priority":
          aValue = a.priority || "";
          bValue = b.priority || "";
          break;
        case "due_date":
          aValue = a.due_date ? new Date(a.due_date).getTime() : 0;
          bValue = b.due_date ? new Date(b.due_date).getTime() : 0;
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "status":
          aValue = a.status?.name || "";
          bValue = b.status?.name || "";
          break;
        case "assignee":
          aValue = a.assignee?.full_name || "";
          bValue = b.assignee?.full_name || "";
          break;
        default:
          return 0;
      }

      if (sort.direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [createdTasks, filters, sort]);

  // Load data
  useEffect(() => {
    if (user && workspaceId) {
      loadData();
    }
  }, [user, workspaceId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load workspace
      const { data: workspaceData } = await supabase
        .from("workspaces")
        .select("*")
        .eq("workspace_id", workspaceId)
        .single();

      if (workspaceData) {
        setWorkspace(workspaceData);
      }

      // Load statuses
      const { data: statusesData } = await supabase
        .from("statuses")
        .select("*")
        .eq("workspace_id", workspaceData?.id)
        .order("position", { ascending: true });

      setStatuses(statusesData || []);

      // Load tags
      const { data: tagsData } = await supabase
        .from("tags")
        .select("*")
        .eq("workspace_id", workspaceData?.id)
        .order("name", { ascending: true });

      setTags(tagsData || []);

      // Load workspace members
      const { data: membersData } = await supabase
        .from("workspace_members")
        .select("id, user_id, email, role")
        .eq("workspace_id", workspaceData?.id)
        .eq("status", "active");

      if (membersData && membersData.length > 0) {
        const userIds = membersData.map((m) => m.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", userIds);

        const formattedMembers = membersData.map((member) => {
          const profile = profilesData?.find((p) => p.id === member.user_id);
          return {
            id: member.user_id,
            full_name: profile?.full_name || "Unknown User",
            email: profile?.email || member.email || "",
            avatar_url: profile?.avatar_url || null,
          };
        });

        setWorkspaceMembers(formattedMembers);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load workspace data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when workspace and user are available
  useEffect(() => {
    if (workspace && user?.id) {
      loadTasks();
    }
  }, [workspace, user?.id]);

  const loadTasks = async () => {
    if (!workspace || !user?.id) {
      return;
    }

    try {
      setLoadingTasks(true);

      // Load assigned tasks with proper joins
      const { data: assignedTasksData, error: assignedError } = await supabase
        .from("tasks")
        .select(
          `
          id,
          task_id,
          name,
          description,
          status_id,
          priority,
          assignee_id,
          assigned_member_id,
          project_id,
          sprint_id,
          space_id,
          workspace_id,
          start_date,
          due_date,
          parent_task_id,
          created_at,
          updated_at,
          created_by,
          embedding,
          status:statuses(name, status_type_id, status_type:status_types(name)),
          assignee:profiles!tasks_assignee_id_fkey(id, full_name, email, avatar_url),
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
          created_by_profile:profiles!tasks_created_by_fkey(id, full_name, email, avatar_url),
          space:spaces(name, space_id),
          project:projects(name, project_id),
          sprint:sprints!tasks_sprint_id_fkey(name, sprint_id)
        `
        )
        .eq("workspace_id", workspace.id)
        .eq("assignee_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      // Load created tasks with proper joins
      const { data: createdTasksData, error: createdError } = await supabase
        .from("tasks")
        .select(
          `
          id,
          task_id,
          name,
          description,
          status_id,
          priority,
          assignee_id,
          assigned_member_id,
          project_id,
          sprint_id,
          space_id,
          workspace_id,
          start_date,
          due_date,
          parent_task_id,
          created_at,
          updated_at,
          created_by,
          embedding,
          status:statuses(name, status_type_id, status_type:status_types(name)),
          assignee:profiles!tasks_assignee_id_fkey(id, full_name, email, avatar_url),
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
          created_by_profile:profiles!tasks_created_by_fkey(id, full_name, email, avatar_url),
          space:spaces(name, space_id),
          project:projects(name, project_id),
          sprint:sprints!tasks_sprint_id_fkey(name, sprint_id)
        `
        )
        .eq("workspace_id", workspace.id)
        .eq("created_by", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      // Transform the data to match TaskWithDetails interface
      const transformTask = (task: any): TaskWithDetails => ({
        ...task,
        space: task.space || { name: "Unknown Space", space_id: task.space_id },
        project: task.project || undefined,
        sprint: task.sprint || undefined,
        task_tags: [], // We'll load tags separately if needed
      });

      const transformedAssigned = (assignedTasksData || []).map(transformTask);
      const transformedCreated = (createdTasksData || []).map(transformTask);

      setAssignedTasks(transformedAssigned);
      setCreatedTasks(transformedCreated);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoadingTasks(false);
    }
  };

  // Helpers required by Project ListView
  const getTaskSubtasks = (_taskId: string) => {
    // My Tasks view does not currently load subtasks; return empty for now
    return [] as any[];
  };

  const handleTaskClick = (task: any) => {
    if (!workspaceId) return;
    router.push(`/${workspaceId}/task/${task.task_id}`);
  };

  const toggleTaskExpansion = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(expandedTasks);
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    setExpandedTasks(next);
  };

  // Minimal task operations used by ListView
  const taskOperations = {
    // Allow ListView to delegate drag end here as well
    handleDragEnd: async (active: any, over: any) => {
      if (!over) return;
      const all =
        activeTab === "assigned"
          ? (filteredAndSortedAssignedTasks as any)
          : (filteredAndSortedCreatedTasks as any);
      const task = all.find((t: any) => t.id === active.id);
      if (!task || task.parent_task_id) return;
      let targetStatusId: string | null = null;
      const overId = over.id.toString();
      const overStatus = statuses.find((s: any) => s.id === overId);
      if (overStatus) {
        targetStatusId = overStatus.id as string;
      } else if (overId.startsWith("status-")) {
        targetStatusId = overId.replace("status-", "");
      } else {
        const overTask = all.find((t: any) => t.id === overId);
        if (overTask) targetStatusId = overTask.status_id as string;
      }

      if (targetStatusId && task.status_id !== targetStatusId) {
        const targetStatus: any = statuses.find(
          (s: any) => s.id === targetStatusId
        );
        await supabase
          .from("tasks")
          .update({
            status_id: targetStatusId,
            project_id: targetStatus?.project_id ?? null,
            space_id: targetStatus?.space_id ?? null,
          })
          .eq("id", task.id);
        await loadTasks();
      }
    },
    handleRenameTask: async (taskId: string, newName: string) => {
      if (!newName?.trim()) return;
      await supabase
        .from("tasks")
        .update({ name: newName.trim() })
        .eq("id", taskId);
      await loadTasks();
    },
    handleAssignTask: async (taskId: string, assigneeId: string | null) => {
      const isTeamMember =
        !!assigneeId && (assigneeId as string).startsWith("team-");
      const actualAssigneeId = isTeamMember
        ? (assigneeId as string).replace("team-", "")
        : assigneeId;
      const updateData: any = {};
      if (isTeamMember) {
        updateData.assigned_member_id = actualAssigneeId;
        updateData.assignee_id = null;
      } else {
        updateData.assignee_id = actualAssigneeId;
        updateData.assigned_member_id = null;
      }
      await supabase.from("tasks").update(updateData).eq("id", taskId);
      await loadTasks();
    },
    handleUpdatePriority: async (taskId: string, priority: string | null) => {
      await supabase.from("tasks").update({ priority }).eq("id", taskId);
      await loadTasks();
    },
    handleUpdateDates: async (
      taskId: string,
      startDate: Date | null,
      dueDate: Date | null
    ) => {
      await supabase
        .from("tasks")
        .update({
          start_date: startDate ? startDate.toISOString() : null,
          due_date: dueDate ? dueDate.toISOString() : null,
        })
        .eq("id", taskId);
      await loadTasks();
    },
    handleRenameStatus: async (statusId: string, newName: string) => {
      if (!workspace) return;
      await supabase
        .from("statuses")
        .update({ name: newName })
        .eq("id", statusId);
      // Refresh statuses
      const { data: statusesData } = await supabase
        .from("statuses")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("position", { ascending: true });
      setStatuses(statusesData || []);
    },
    handleUpdateStatusSettings: async (updatedStatus: any) => {
      await supabase
        .from("statuses")
        .update({
          name: updatedStatus.name,
          status_type_id: updatedStatus.status_type_id,
          color: updatedStatus.color,
          type: updatedStatus.type,
        })
        .eq("id", updatedStatus.id);
      const { data: statusesData } = await supabase
        .from("statuses")
        .select("*")
        .eq("workspace_id", workspace?.id)
        .order("position", { ascending: true });
      setStatuses(statusesData || []);
    },
    handleDeleteTask: async (task: any) => {
      const timestamp = new Date().toISOString();
      await supabase
        .from("tasks")
        .update({ deleted_at: timestamp })
        .eq("id", task.id);
      await loadTasks();
    },
  };

  // Build ListView-compatible state and updater
  const listViewState = {
    isLoading: loadingTasks,
    statuses: statuses,
    statusTypes: [],
    workspace: workspace,
    space: null,
    project: null,
    expandedTasks: expandedTasks,
    collapsedStatuses: collapsedStatuses,
    visibleColumns: visibleColumns,
    workspaceMembers: workspaceMembers,
    teamMembers: [],
    activeTask: activeTask,
    activeStatus: activeStatus,
  } as any;

  const updateListViewState = (updates: any) => {
    if (updates.expandedTasks !== undefined)
      setExpandedTasks(new Set(updates.expandedTasks));
    if (updates.collapsedStatuses !== undefined)
      setCollapsedStatuses(new Set(updates.collapsedStatuses));
    if (updates.visibleColumns !== undefined)
      setVisibleColumns(new Set(updates.visibleColumns));
    if ("activeTask" in updates) setActiveTask(updates.activeTask);
    if ("activeStatus" in updates) setActiveStatus(updates.activeStatus);
  };

  // Drag handlers to mirror project behavior (task drag to change status)
  const handleBoardDragStart = (event: DragStartEvent, currentTasks: any[]) => {
    const { active } = event;
    const draggedTask = currentTasks.find((t) => t.id === active.id);
    const draggedStatus = statuses.find((s: any) => s.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
      setActiveStatus(null);
    } else if (draggedStatus) {
      setActiveStatus(draggedStatus);
      setActiveTask(null);
    }
  };

  const handleBoardDragEnd = async (
    event: DragEndEvent,
    currentTasks: any[]
  ) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      setActiveStatus(null);
      return;
    }

    // Only handle task drags for My Tasks
    const task = currentTasks.find((t) => t.id === active.id);
    if (!task || task.parent_task_id) {
      setActiveTask(null);
      setActiveStatus(null);
      return;
    }

    let targetStatusId: string | null = null;
    const overId = over.id.toString();
    const overStatus = statuses.find((s: any) => s.id === overId);
    if (overStatus) {
      targetStatusId = overStatus.id as string;
    } else if (overId.startsWith("status-")) {
      targetStatusId = overId.replace("status-", "");
    } else {
      const overTask = currentTasks.find((t) => t.id === overId);
      if (overTask) targetStatusId = overTask.status_id as string;
    }

    if (targetStatusId && task.status_id !== targetStatusId) {
      try {
        const targetStatus: any = statuses.find(
          (s: any) => s.id === targetStatusId
        );
        await supabase
          .from("tasks")
          .update({
            status_id: targetStatusId,
            project_id: targetStatus?.project_id ?? null,
            space_id: targetStatus?.space_id ?? null,
          })
          .eq("id", task.id);
        await loadTasks();
      } catch (e) {
        console.error("Error updating task status via drag:", e);
      }
    }

    setActiveTask(null);
    setActiveStatus(null);
  };

  if (loading) {
    return <MyTasksLoading />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b workspace-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="workspace-component-bg w-8 h-8 flex items-center justify-center rounded-md">
              <CheckSquare className="h-4 w-4 workspace-component-active-color" />
            </div>
            <div>
              <h1 className="text-sm workspace-sidebar-text">My Tasks</h1>
              <p className="text-xs workspace-text-muted">
                Manage tasks assigned to you and tasks you've created
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator for tasks */}
      <div>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="py-2 px-3 flex items-center justify-between border-b workspace-border">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1">
              <TabsTrigger
                value="assigned"
                className="flex items-center gap-2 mr-1 text-xs hover:workspace-component-bg data-[state=active]:workspace-component-bg data-[state=active]:workspace-component-active-color rounded-lg"
              >
                <User className="h-4 w-4" />
                <span>Assigned to Me ({assignedTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="created"
                className="flex items-center gap-2 text-xs hover:workspace-component-bg data-[state=active]:workspace-component-bg data-[state=active]:workspace-component-active-color rounded-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Created by Me ({createdTasks.length})</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-xs p-2 h-7 workspace-header-bg border border-transparent ${
                      Object.values(filters).some((filter) =>
                        Array.isArray(filter)
                          ? filter.length > 0
                          : typeof filter === "string"
                          ? filter !== ""
                          : typeof filter === "object"
                          ? Object.keys(filter).length > 0
                          : false
                      )
                        ? "border-workspace-primary text-workspace-primary "
                        : ""
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {Object.values(filters).some((filter) =>
                      Array.isArray(filter)
                        ? filter.length > 0
                        : typeof filter === "string"
                        ? filter !== ""
                        : typeof filter === "object"
                        ? Object.keys(filter).length > 0
                        : false
                    ) && (
                      <div className="ml-2 w-2 h-2 workspace-primary-light rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Filters</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFilters({
                            search: "",
                            status: [],
                            priority: [],
                            assignee: [],
                            createdBy: [],
                            tags: [],
                            dueDate: {},
                            createdDate: {},
                          })
                        }
                      >
                        Clear all
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Search */}
                      <div>
                        <label className="text-xs font-medium mb-2 block">
                          Search
                        </label>
                        <Input
                          placeholder="Search tasks..."
                          value={filters.search}
                          onChange={(e) =>
                            setFilters({ ...filters, search: e.target.value })
                          }
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="text-xs font-medium mb-2 block">
                          Status
                        </label>
                        <Select
                          value={filters.status[0] || "all"}
                          onValueChange={(value) =>
                            setFilters({
                              ...filters,
                              status: value === "all" ? [] : [value],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="not-started">
                              Not Started
                            </SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="text-xs font-medium mb-2 block">
                          Priority
                        </label>
                        <Select
                          value={filters.priority[0] || "all"}
                          onValueChange={(value) =>
                            setFilters({
                              ...filters,
                              priority: value === "all" ? [] : [value],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All priorities" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All priorities</SelectItem>
                            {Object.entries(priorityConfig).map(
                              ([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  {config.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort */}
                      <div>
                        <label className="text-xs font-medium mb-2 block">
                          Sort by
                        </label>
                        <Select
                          value={`${sort.field}-${sort.direction}`}
                          onValueChange={(value) => {
                            const [field, direction] = value.split("-");
                            setSort({
                              field: field as any,
                              direction: direction as any,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="due_date-asc">
                              Due Date (Earliest)
                            </SelectItem>
                            <SelectItem value="due_date-desc">
                              Due Date (Latest)
                            </SelectItem>
                            <SelectItem value="priority-asc">
                              Priority (Low to High)
                            </SelectItem>
                            <SelectItem value="priority-desc">
                              Priority (High to Low)
                            </SelectItem>
                            <SelectItem value="created_at-desc">
                              Created (Newest)
                            </SelectItem>
                            <SelectItem value="created_at-asc">
                              Created (Oldest)
                            </SelectItem>
                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name-desc">
                              Name (Z-A)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "list" ? "board" : "list")
                }
                className="text-xs p-2 h-7 workspace-header-bg border border-transparent"
              >
                {viewMode === "list" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
                {viewMode === "list" ? "Board" : "List"}
              </Button>
            </div>
          </div>
          <TabsContent value="assigned" className="flex-1 p-3">
            {viewMode === "list" ? (
              <ProjectListView
                state={{
                  ...listViewState,
                  // Show only statuses that have tasks in this view
                  statuses: statuses.filter((s) =>
                    (filteredAndSortedAssignedTasks || []).some(
                      (t) => t.status_id === (s as any).id
                    )
                  ),
                }}
                updateState={(updates: any) => {
                  const normalized = { ...updates };
                  if (
                    updates.collapsedStatuses instanceof Set === false &&
                    updates.collapsedStatuses
                  ) {
                    normalized.collapsedStatuses = new Set(
                      updates.collapsedStatuses
                    );
                  }
                  if (
                    updates.expandedTasks instanceof Set === false &&
                    updates.expandedTasks
                  ) {
                    normalized.expandedTasks = new Set(updates.expandedTasks);
                  }
                  if (
                    updates.visibleColumns instanceof Set === false &&
                    updates.visibleColumns
                  ) {
                    normalized.visibleColumns = new Set(updates.visibleColumns);
                  }
                  updateListViewState(normalized);
                }}
                taskOperations={taskOperations}
                getTaskSubtasks={getTaskSubtasks}
                handleTaskClick={handleTaskClick}
                toggleTaskExpansion={toggleTaskExpansion}
                handleCreateSubtask={() => {}}
                handleDeleteTask={taskOperations.handleDeleteTask}
                onCreateStatus={() => {}}
                tasks={filteredAndSortedAssignedTasks as any}
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={(e) =>
                  handleBoardDragStart(e, filteredAndSortedAssignedTasks as any)
                }
                onDragEnd={(e) =>
                  handleBoardDragEnd(e, filteredAndSortedAssignedTasks as any)
                }
              >
                <ProjectBoardView
                  state={{
                    ...listViewState,
                    statuses: statuses.filter((s) =>
                      (filteredAndSortedAssignedTasks || []).some(
                        (t) => t.status_id === (s as any).id
                      )
                    ),
                  }}
                  updateState={(updates: any) => {
                    const normalized = { ...updates };
                    if (
                      updates.collapsedStatuses instanceof Set === false &&
                      updates.collapsedStatuses
                    ) {
                      normalized.collapsedStatuses = new Set(
                        updates.collapsedStatuses
                      );
                    }
                    if (
                      updates.expandedTasks instanceof Set === false &&
                      updates.expandedTasks
                    ) {
                      normalized.expandedTasks = new Set(updates.expandedTasks);
                    }
                    updateListViewState(normalized);
                  }}
                  taskOperations={taskOperations}
                  getTaskSubtasks={getTaskSubtasks}
                  handleTaskClick={handleTaskClick}
                  toggleTaskExpansion={toggleTaskExpansion}
                  handleCreateSubtask={() => {}}
                  handleDeleteTask={taskOperations.handleDeleteTask}
                  tasks={filteredAndSortedAssignedTasks as any}
                />
                <DragOverlay>
                  {activeTask ? (
                    <TaskCard
                      task={activeTask}
                      isDragging
                      subtasks={[]}
                      isExpanded={expandedTasks.has(activeTask.id)}
                      workspaceMembers={workspaceMembers as any}
                      onToggleExpansion={toggleTaskExpansion}
                      onTaskClick={handleTaskClick}
                      onRenameTask={taskOperations.handleRenameTask}
                      onUpdatePriority={taskOperations.handleUpdatePriority}
                      onUpdateDates={taskOperations.handleUpdateDates}
                      onAssignTask={taskOperations.handleAssignTask}
                      onDeleteTask={taskOperations.handleDeleteTask}
                      onCreateSubtask={() => {}}
                      teamMembers={[]}
                    />
                  ) : activeStatus ? (
                    <div className="transform rotate-2 shadow-2xl">
                      <StatusColumn
                        status={activeStatus as any}
                        tasks={(filteredAndSortedAssignedTasks as any).filter(
                          (t: any) =>
                            t.status_id === (activeStatus as any).id &&
                            !t.parent_task_id
                        )}
                        onCreateTask={() => {}}
                        onRenameStatus={taskOperations.handleRenameStatus}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TabsContent>

          <TabsContent value="created" className="flex-1 p-3">
            {viewMode === "list" ? (
              <ProjectListView
                state={{
                  ...listViewState,
                  statuses: statuses.filter((s) =>
                    (filteredAndSortedCreatedTasks || []).some(
                      (t) => t.status_id === (s as any).id
                    )
                  ),
                }}
                updateState={(updates: any) => {
                  const normalized = { ...updates };
                  if (
                    updates.collapsedStatuses instanceof Set === false &&
                    updates.collapsedStatuses
                  ) {
                    normalized.collapsedStatuses = new Set(
                      updates.collapsedStatuses
                    );
                  }
                  if (
                    updates.expandedTasks instanceof Set === false &&
                    updates.expandedTasks
                  ) {
                    normalized.expandedTasks = new Set(updates.expandedTasks);
                  }
                  if (
                    updates.visibleColumns instanceof Set === false &&
                    updates.visibleColumns
                  ) {
                    normalized.visibleColumns = new Set(updates.visibleColumns);
                  }
                  updateListViewState(normalized);
                }}
                taskOperations={taskOperations}
                getTaskSubtasks={getTaskSubtasks}
                handleTaskClick={handleTaskClick}
                toggleTaskExpansion={toggleTaskExpansion}
                handleCreateSubtask={() => {}}
                handleDeleteTask={taskOperations.handleDeleteTask}
                onCreateStatus={() => {}}
                tasks={filteredAndSortedCreatedTasks as any}
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={(e) =>
                  handleBoardDragStart(e, filteredAndSortedCreatedTasks as any)
                }
                onDragEnd={(e) =>
                  handleBoardDragEnd(e, filteredAndSortedCreatedTasks as any)
                }
              >
                <ProjectBoardView
                  state={{
                    ...listViewState,
                    statuses: statuses.filter((s) =>
                      (filteredAndSortedCreatedTasks || []).some(
                        (t) => t.status_id === (s as any).id
                      )
                    ),
                  }}
                  updateState={(updates: any) => {
                    const normalized = { ...updates };
                    if (
                      updates.collapsedStatuses instanceof Set === false &&
                      updates.collapsedStatuses
                    ) {
                      normalized.collapsedStatuses = new Set(
                        updates.collapsedStatuses
                      );
                    }
                    if (
                      updates.expandedTasks instanceof Set === false &&
                      updates.expandedTasks
                    ) {
                      normalized.expandedTasks = new Set(updates.expandedTasks);
                    }
                    updateListViewState(normalized);
                  }}
                  taskOperations={taskOperations}
                  getTaskSubtasks={getTaskSubtasks}
                  handleTaskClick={handleTaskClick}
                  toggleTaskExpansion={toggleTaskExpansion}
                  handleCreateSubtask={() => {}}
                  handleDeleteTask={taskOperations.handleDeleteTask}
                  tasks={filteredAndSortedCreatedTasks as any}
                />
                <DragOverlay>
                  {activeTask ? (
                    <TaskCard
                      task={activeTask}
                      isDragging
                      subtasks={[]}
                      isExpanded={expandedTasks.has(activeTask.id)}
                      workspaceMembers={workspaceMembers as any}
                      onToggleExpansion={toggleTaskExpansion}
                      onTaskClick={handleTaskClick}
                      onRenameTask={taskOperations.handleRenameTask}
                      onUpdatePriority={taskOperations.handleUpdatePriority}
                      onUpdateDates={taskOperations.handleUpdateDates}
                      onAssignTask={taskOperations.handleAssignTask}
                      onDeleteTask={taskOperations.handleDeleteTask}
                      onCreateSubtask={() => {}}
                      teamMembers={[]}
                    />
                  ) : activeStatus ? (
                    <div className="transform rotate-2 shadow-2xl">
                      <StatusColumn
                        status={activeStatus as any}
                        tasks={(filteredAndSortedCreatedTasks as any).filter(
                          (t: any) =>
                            t.status_id === (activeStatus as any).id &&
                            !t.parent_task_id
                        )}
                        onCreateTask={() => {}}
                        onRenameStatus={taskOperations.handleRenameStatus}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Board View Component
function BoardView({ tasks }: { tasks: TaskWithDetails[] }) {
  // Define the 4 main status types in the correct order
  const mainStatusTypes = ["not-started", "active", "done", "closed"];

  // Group tasks by status type name
  const statusGroups = tasks.reduce((groups, task) => {
    const statusTypeName = task.status?.status_type?.name || "not-started";

    // Debug: Log each task's status info
    console.log("Task grouping:", {
      taskName: task.name,
      statusName: task.status?.name,
      statusTypeName: statusTypeName,
    });

    if (!groups[statusTypeName]) {
      groups[statusTypeName] = [];
    }
    groups[statusTypeName].push(task);
    return groups;
  }, {} as Record<string, TaskWithDetails[]>);
  console.log(mainStatusTypes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mainStatusTypes.map((statusType) => {
        const statusTasks = statusGroups[statusType] || [];
        return (
          <div
            key={statusType}
            className={`space-y-2 ${getStatusTypeBgColor(
              statusType
            )} p-2 rounded-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: getStatusTypeColor(statusType),
                  }}
                />
                <h3 className="font-medium text-sm capitalize">
                  {statusType.replace("-", " ")}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {statusTasks.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {statusTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-3 hover:shadow-sm transition-shadow cursor-pointer border-l-3 workspace-secondary-sidebar-bg"
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        {task.name}
                      </h4>

                      {task.description && (
                        <p className="text-xs workspace-sidebar-text mb-3 line-clamp-2">
                          {stripFormatting(task.description)}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {task.priority ? (
                            <div className="h-6 w-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm">
                              <Goal
                                className={`w-4 h-4 ${
                                  priorityConfig[
                                    task.priority as keyof typeof priorityConfig
                                  ]?.color
                                }`}
                              />
                            </div>
                          ) : (
                            <div className="h-6 w-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm">
                              <Goal className="w-4 h-4 " />
                            </div>
                          )}

                          {task.task_tags && task.task_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {task.task_tags.map((taskTag: any) => (
                                <span
                                  key={taskTag.tag.id}
                                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                    tagColorClasses[taskTag.tag.color]
                                  } group relative`}
                                >
                                  {taskTag.tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                          {task.due_date ? (
                            <div className="flex items-center h-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center h-6 w-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm">
                              <Calendar className="h-4 w-4 " />
                            </div>
                          )}
                        </div>
                        {task.assignee ? (
                          <div className="flex items-center text-xs text-gray-500">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={task.assignee.avatar_url ?? undefined}
                                alt={task.assignee.full_name ?? undefined}
                              />
                              <AvatarFallback className="text-xs">
                                {getAvatarInitials(
                                  task.assignee.full_name,
                                  task.assignee.email
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        ) : (
                          <div className="flex items-center h-6 w-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm">
                            <CircleUser className="h-4 w-4 " />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Hash,
  Star,
  Edit,
  Link,
  Trash,
  MoreHorizontal,
  List,
  LayoutGrid,
  Filter,
  Settings,
  Users,
  Brain,
  CheckIcon,
  CircleUserRound,
  RefreshCw,
  Copy,
  ChartGantt,
  Target,
  Folder,
  Save,
} from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getIconColor, getAvatarInitials } from "@/lib/utils";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import CreateTaskModal from "@/components/workspace/modals/create-task-modal";
import CreateStatusModal from "@/components/workspace/modals/create-status-modal";
import CustomizeListModal from "@/components/workspace/modals/customize-list-modal";
import FilterModal from "@/components/workspace/modals/filter-modal";
import StatusSettingsModal from "@/components/workspace/modals/status-settings-modal";

// Import Sprint Assistant components
import SprintAssistant from "@/components/workspace/ai/sprint-assistant";
import type { EnhancedSprint } from "@/lib/sprint-creation-service";
import type { UserStory, TeamMember } from "@/types";
import {
  createSprintFolder,
  createSprints,
} from "@/app/[workspaceId]/ai-actions";

// Import our custom hooks and components
import { useProjectData } from "./project/hooks/useProjectData";
import { useTaskOperations } from "./project/hooks/useTaskOperations";
import { useRealtimeSubscriptions } from "./project/hooks/useRealtimeSubscriptions";
import { TaskCard } from "./project/components/TaskCard";
import { StatusColumn } from "./project/components/StatusColumn";
import { BoardView } from "./project/views/BoardView";
import { ListView } from "./project/views/ListView";
import type { ProjectViewProps, ViewMode } from "./project/types";
import { getSubtasksForTask, filterTasks } from "./project/utils";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProjectView({
  workspace,
  space,
  project,
  tasks: initialTasks,
  statuses: initialStatuses,
  tags: initialTags,
}: ProjectViewProps) {
  const router = useRouter();
  const params = useParams();
  const { toast } = useEnhancedToast();
  const [isSyncing, setIsSyncing] = useState(false);

  // Project management state
  const [projectFavorites, setProjectFavorites] = useState<Set<string>>(
    new Set()
  );
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  // Local project state for immediate UI updates
  const [localProject, setLocalProject] = useState(project);

  // Sprint Assistant state
  const [showSprintAssistant, setShowSprintAssistant] = useState(false);
  const [currentSprint, setCurrentSprint] = useState<EnhancedSprint | null>(
    null
  );

  // Save Sprints Modal state
  const [showSaveSprintsModal, setShowSaveSprintsModal] = useState(false);
  const [sprintsToSave, setSprintsToSave] = useState<any[]>([]);
  const [sprintType, setSprintType] = useState<"ai" | "manual">("ai");
  const [sprintFolderName, setSprintFolderName] = useState("Sprint Plan");

  // Update local project when prop changes
  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  // Load project favorites from localStorage
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem(
      `project_favorites_${workspace.id}`
    );
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setProjectFavorites(new Set(favorites));
      } catch (error) {
        console.error("Error loading project favorites:", error);
      }
    }
  }, [workspace.id]);

  // Custom hooks
  const {
    state,
    updateState,
    supabase,
    refreshTasks,
    refreshStatuses,
    loadAllSubtasks,
    createEventLog,
  } = useProjectData({
    workspace,
    space,
    project: localProject,
    initialTasks,
    initialStatuses,
    initialTags,
  });

  const taskOperations = useTaskOperations({
    state,
    updateState,
    supabase,
    refreshTasks,
    refreshStatuses,
    loadAllSubtasks,
    createEventLog,
    workspace,
    project: localProject,
  });

  // Realtime subscriptions
  useRealtimeSubscriptions({
    supabase,
    workspace,
    project: localProject,
    refreshTasks,
    refreshStatuses,
    loadAllSubtasks,
  });

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Memoized computed values
  const getTaskSubtasks = useCallback(
    (taskId: string) => getSubtasksForTask(taskId, state.allSubtasks),
    [state.allSubtasks]
  );

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return filterTasks(state.tasks, state.filters);
  }, [state.tasks, state.filters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return (
      state.filters.status.length +
      state.filters.tags.length +
      state.filters.priority.length +
      state.filters.assigned.length +
      (state.filters.sprintPoints.min > 0 ||
      state.filters.sprintPoints.max < 100
        ? 1
        : 0) +
      (state.filters.showUnassignedOnly ? 1 : 0)
    );
  }, [state.filters]);

  // Check if this is a Jira project
  const isJiraProject = project.type === "jira";

  // Sync function for Jira projects
  const handleSync = useCallback(async () => {
    if (!isJiraProject) return;

    setIsSyncing(true);
    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/bidirectional-sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: project.id,
            options: {
              pushToJira: true,
              pullFromJira: true,
              resolveConflicts: "manual",
              syncTasks: true,
              syncStatuses: true,
            },
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const { data } = result;
        const changes = [];

        if (data.tasksPushedToJira > 0)
          changes.push(`${data.tasksPushedToJira} tasks pushed to Jira`);
        if (data.tasksPulledFromJira > 0)
          changes.push(`${data.tasksPulledFromJira} tasks pulled from Jira`);
        if (data.statusesPushedToJira > 0)
          changes.push(`${data.statusesPushedToJira} statuses pushed to Jira`);
        if (data.statusesPulledFromJira > 0)
          changes.push(
            `${data.statusesPulledFromJira} statuses pulled from Jira`
          );

        const description =
          changes.length > 0
            ? `Sync completed: ${changes.join(", ")}`
            : "No changes detected during sync";

        toast({
          title: "Bidirectional sync successful",
          description: description,
          browserNotificationTitle: "Bidirectional sync successful",
          browserNotificationBody: description,
        });

        // Show refresh notification
        toast({
          title: "Refreshing page",
          description: "Page will refresh in 1 second to show updated data",
          duration: 1000,
        });

        // Refresh the data
        await Promise.all([
          refreshTasks(),
          refreshStatuses(),
          loadAllSubtasks(),
        ]);

        // Add a small delay to ensure all data is updated
        setTimeout(() => {
          // Force a full page refresh to ensure all data is properly updated
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(result.error || "Failed to sync");
      }
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync failed",
        description: error.message || "Failed to sync with Jira",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [
    isJiraProject,
    params.workspaceId,
    project.id,
    refreshTasks,
    refreshStatuses,
    loadAllSubtasks,
    toast,
  ]);

  // Check sync status
  const [syncStatus, setSyncStatus] = useState<any>(null);

  const checkSyncStatus = useCallback(async () => {
    if (!isJiraProject) return;

    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/bidirectional-sync?projectId=${project.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSyncStatus(result.data);
      }
    } catch (error) {
      console.error("Failed to check sync status:", error);
    }
  }, [isJiraProject, params.workspaceId, project.id]);

  // Check sync status on mount and periodically
  React.useEffect(() => {
    checkSyncStatus();

    if (isJiraProject) {
      const interval = setInterval(checkSyncStatus, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [checkSyncStatus, isJiraProject]);

  // Listen for sprint data refresh events
  React.useEffect(() => {
    const handleProjectDataRefresh = () => {
      console.log("Refreshing project data after sprint creation...");
      refreshTasks();
      refreshStatuses();
      loadAllSubtasks();
    };

    window.addEventListener("projectDataRefresh", handleProjectDataRefresh);
    return () => {
      window.removeEventListener(
        "projectDataRefresh",
        handleProjectDataRefresh
      );
    };
  }, [refreshTasks, refreshStatuses, loadAllSubtasks]);

  const handleTaskClick = useCallback(
    (task: any) => {
      router.push(`/${workspace.workspace_id}/task/${task.task_id}`);
    },
    [router, workspace.workspace_id]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const draggedTask = filteredTasks.find((t) => t.id === active.id);
      const draggedStatus = state.statuses.find((s) => s.id === active.id);

      if (draggedTask) {
        updateState({ activeTask: draggedTask, activeStatus: null });
      } else if (draggedStatus) {
        updateState({ activeStatus: draggedStatus, activeTask: null });
      } else {
      }
    },
    [filteredTasks, state.statuses, updateState]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over) {
        await taskOperations.handleDragEnd(active, over);
      }

      updateState({ activeTask: null, activeStatus: null });
    },
    [taskOperations, updateState, state.activeStatus, state.activeTask]
  );

  const toggleTaskExpansion = useCallback(
    (taskId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newExpandedTasks = new Set(state.expandedTasks);
      if (newExpandedTasks.has(taskId)) {
        newExpandedTasks.delete(taskId);
      } else {
        newExpandedTasks.add(taskId);
      }
      updateState({ expandedTasks: newExpandedTasks });
    },
    [state.expandedTasks, updateState]
  );

  const handleCreateSubtask = useCallback(
    (parentId: string) => {
      updateState({
        subtaskParentId: parentId,
        createTaskModalOpen: true,
      });
    },
    [updateState]
  );

  const handleDeleteTask = useCallback(
    (task: any) => {
      updateState({ taskToDelete: task });
    },
    [updateState]
  );

  const handleOpenStatusSettings = useCallback(
    (status: any) => {
      updateState({ statusSettingsModalOpen: true, statusToEdit: status });
    },
    [updateState]
  );

  // Project management handlers
  const handleAddProjectToFavorites = useCallback(
    async (project: any) => {
      try {
        const newFavorites = new Set(projectFavorites);
        if (projectFavorites.has(project.id)) {
          newFavorites.delete(project.id);
        } else {
          newFavorites.add(project.id);
        }
        setProjectFavorites(newFavorites);

        localStorage.setItem(
          `project_favorites_${workspace.id}`,
          JSON.stringify([...newFavorites])
        );

        // Emit event to update secondary sidebar
        window.dispatchEvent(
          new CustomEvent("projectFavorited", {
            detail: { project, isFavorited: !projectFavorites.has(project.id) },
          })
        );

        toast({
          title: projectFavorites.has(project.id)
            ? "Removed from favorites"
            : "Added to favorites",
          description: `${localProject.name} ${
            projectFavorites.has(project.id) ? "removed from" : "added to"
          } favorites.`,
        });
      } catch (error) {
        console.error("Error updating project favorites:", error);
      }
    },
    [projectFavorites, workspace.id, toast]
  );

  const handleRenameProject = useCallback(
    async (projectId: string, newName: string) => {
      if (!newName.trim()) return;

      try {
        const { error } = await supabase
          .from("projects")
          .update({ name: newName.trim() })
          .eq("project_id", project.project_id);

        if (error) throw error;

        // Update local project state immediately for better UX
        setLocalProject((prev) => ({
          ...prev,
          name: newName.trim(),
        }));

        // Emit event to update secondary sidebar
        window.dispatchEvent(
          new CustomEvent("projectRenamed", {
            detail: { project, newName: newName.trim() },
          })
        );

        toast({
          title: "Project renamed",
          description: `Project renamed to "${newName.trim()}".`,
        });

        setRenameProjectId(null);
        setRenameValue("");
      } catch (error: any) {
        console.error("Error renaming project:", error);
        toast({
          title: "Error renaming project",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    },
    [supabase, toast, project.project_id, project]
  );

  const handleCopyProjectLink = useCallback(
    async (project: any, space: any) => {
      try {
        const url = `${window.location.origin}/${workspace.workspace_id}/space/${space.space_id}/project/${project.project_id}`;
        await navigator.clipboard.writeText(url);

        toast({
          title: "Link copied",
          description: "Project link copied to clipboard.",
        });
      } catch (error) {
        console.error("Error copying link:", error);
        toast({
          title: "Error copying link",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        });
      }
    },
    [workspace.workspace_id, toast]
  );

  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      setIsDeletingProject(true);
      try {
        // 1. Delete all tasks for this project
        const timeStamp = new Date().toISOString();
        const { error: tasksError } = await supabase
          .from("tasks")
          .update({ deleted_at: timeStamp })
          .eq("project_id", project.id);
        if (tasksError) {
          console.error("Error deleting project tasks:", tasksError);
          throw tasksError;
        }
        // 2. Delete all statuses for this project
        const { error: statusesError } = await supabase
          .from("statuses")
          .update({ deleted_at: timeStamp })
          .eq("project_id", project.id);
        if (statusesError) {
          console.error("Error deleting project statuses:", statusesError);
          throw statusesError;
        }
        // 3. Delete the project itself
        const { error: deleteError } = await supabase
          .from("projects")
          .update({ deleted_at: timeStamp })
          .eq("id", project.id);
        if (deleteError) {
          console.error("Error deleting project:", deleteError);
          throw deleteError;
        }

        // Remove from favorites if it was favorited
        setProjectFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(projectId);
          localStorage.setItem(
            `project_favorites_${workspace.id}`,
            JSON.stringify([...newFavorites])
          );
          return newFavorites;
        });

        // Emit event to update secondary sidebar
        window.dispatchEvent(
          new CustomEvent("projectDeleted", {
            detail: { project },
          })
        );

        toast({
          title: "Project deleted",
          description: "Project and all its related data have been deleted.",
        });
        setDeleteProjectId(null);
        // Navigate to home
        router.push(`/${workspace.workspace_id}/home`);
      } catch (error: any) {
        toast({
          title: "Error deleting project",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsDeletingProject(false);
      }
    },
    [supabase, toast, router, workspace.workspace_id, project.id, project]
  );

  // Convert project tasks to UserStory format for Sprint Assistant
  const convertTasksToUserStories = useCallback((tasks: any[]): UserStory[] => {
    // First pass: convert priorities and collect parent-child relationships
    const parentChildMap = new Map<string, string[]>();
    const taskPriorityMap = new Map<string, string>();

    tasks.forEach((task) => {
      // Convert priority to proper capitalized format
      if (task.priority) {
        taskPriorityMap.set(
          task.id,
          (task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1).toLowerCase()) as
            | "Low"
            | "Medium"
            | "High"
            | "Critical"
        );
      }

      // Build parent-child relationship map
      if (task.parent_task_id) {
        if (!parentChildMap.has(task.parent_task_id)) {
          parentChildMap.set(task.parent_task_id, []);
        }
        parentChildMap.get(task.parent_task_id)!.push(task.id);
      }
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.name,
      role: "User", // Default role since tasks don't have this field
      want: task.description || task.name,
      benefit: "Complete the task successfully",
      acceptanceCriteria: task.description ? [task.description] : [task.name],
      storyPoints: task.story_points || 1,
      businessValue: task.business_value || 3,
      userImpact: task.user_impact || 3,
      complexity: task.complexity || 3,
      risk: task.risk || 2,
      dependencies: task.dependencies ? [task.dependencies.toString()] : [],
      priority:
        (taskPriorityMap.get(task.id) as
          | "Low"
          | "Medium"
          | "High"
          | "Critical") || "Medium",
      description: task.description || "",
      tags: task.task_tags?.map((tt: any) => tt.tag.name) || [],
      parentTaskId: task.parent_task_id || undefined,
      childTaskIds: parentChildMap.get(task.id) || [], // Get child task IDs from the map
      suggestedDependencies: [],
      requirements: task.description ? [task.description] : [],
      estimatedTime: task.estimated_time || undefined,
      assignedTeamMember: task.assigned_member
        ? {
            id: task.assigned_member.id,
            name: task.assigned_member.name,
            email: task.assigned_member.email,
            role: task.assigned_member.role?.name || "Developer",
            level: task.assigned_member.level?.name || "Mid",
            skills: [],
            experience: "mid",
            availability: 1,
            avatar_url: task.assigned_member.profile?.avatar_url,
            storyPointsPerSprint: 20,
          }
        : undefined,
      antiPatternWarnings: task.anti_pattern_warnings || [],
      successPattern: task.success_pattern || "",
      completionRate: task.completion_rate || 0,
      velocity: task.velocity || 0,
      priorityScore: 0,
      dependencyScore: 0,
      estimatedHours: task.estimated_time || 0,
      calculatedAt: new Date().toISOString(),
      sprintId: task.sprint_id || undefined,
      goal: "",
    }));
  }, []);

  // Handler for SprintAssistant's Save Sprints button
  const handleSaveSprintsFromAssistant = useCallback(
    (sprints: any[], type: "ai" | "manual") => {
      setSprintsToSave(sprints);
      setSprintType(type);
      setSprintFolderName(`Sprint Plan - ${new Date().toLocaleDateString()}`);
      setShowSaveSprintsModal(true);
    },
    []
  );

  const handleSaveSprintsToDatabase = useCallback(
    async (sprints: any[], type: "ai" | "manual", folderName: string) => {
      try {
        // Validate input data
        if (!sprints || !Array.isArray(sprints) || sprints.length === 0) {
          toast({
            title: "Invalid sprint data",
            description: "No sprints provided to save.",
            variant: "destructive",
          });
          return;
        }

        console.log("Saving sprints to database:", {
          sprintCount: sprints.length,
          type: type,
          folderName: folderName,
          sampleSprint: sprints[0],
        });

        // Create a sprint folder for the planned sprints
        const finalFolderName =
          folderName || `Sprint Plan - ${new Date().toLocaleDateString()}`;
        const {
          success: folderSuccess,
          sprintFolder,
          error: folderError,
        } = await createSprintFolder({
          name: finalFolderName,
          spaceId: space.id,
          durationWeeks: 2, // Default 2-week sprints
        });

        if (!folderSuccess || !sprintFolder) {
          toast({
            title: "Failed to create sprint folder",
            description:
              folderError ||
              "An error occurred while creating the sprint folder.",
            variant: "destructive",
          });
          return;
        }

        // Convert sprints to the format expected by createSprints
        const sprintData = sprints.map((sprint: any) => ({
          name: sprint.name,
          goal: sprint.goal || sprint.description || "",
          startDate: sprint.startDate || sprint.start_date,
          endDate: sprint.endDate || sprint.end_date,
          duration: sprint.duration || 2,
        }));

        // Create the sprints in the folder
        const {
          success: sprintsSuccess,
          createdSprints,
          error: sprintsError,
        } = await createSprints({
          sprints: sprintData,
          sprintFolderId: sprintFolder.id,
          spaceId: space.id,
          workspaceId: workspace.id,
        });

        if (!sprintsSuccess || !createdSprints) {
          toast({
            title: "Failed to create sprints",
            description:
              sprintsError || "An error occurred while creating the sprints.",
            variant: "destructive",
          });
          return;
        }

        // Move tasks from project to their assigned sprints
        let movedTasksCount = 0;
        let totalTasksToMove = 0;

        // Count total tasks to be moved
        for (const sprint of sprints) {
          if (sprint.stories && Array.isArray(sprint.stories)) {
            totalTasksToMove += sprint.stories.length;
          }
        }

        console.log(
          `Moving ${totalTasksToMove} tasks from project to sprints...`
        );

        for (const sprint of sprints) {
          const createdSprint = createdSprints.find(
            (cs: any) => cs.name === sprint.name
          );

          if (!createdSprint) {
            console.warn(`Created sprint not found for sprint: ${sprint.name}`);
            continue;
          }

          // Check if sprint has stories (tasks) assigned
          if (
            !sprint.stories ||
            !Array.isArray(sprint.stories) ||
            sprint.stories.length === 0
          ) {
            console.warn(`Sprint ${sprint.name} has no stories assigned`);
            continue;
          }

          // Get the task IDs that belong to this sprint
          const taskIds = sprint.stories
            .map((story: any) => story.id)
            .filter(Boolean);

          if (taskIds.length === 0) {
            console.warn(`No valid task IDs found for sprint ${sprint.name}`);
            continue;
          }

          try {
            // Update tasks to move them from project to sprint
            const { error: moveError } = await supabase
              .from("tasks")
              .update({
                sprint_id: createdSprint.id,
                project_id: null, // Remove from project
                updated_at: new Date().toISOString(),
              })
              .in("id", taskIds)
              .eq("project_id", project.id); // Only move tasks that are currently in this project

            if (moveError) {
              console.error(
                `Error moving tasks to sprint ${createdSprint.name}:`,
                moveError
              );
              toast({
                title: "Warning",
                description: `Some tasks could not be moved to sprint "${createdSprint.name}".`,
                variant: "destructive",
              });
            } else {
              movedTasksCount += taskIds.length;
              console.log(
                `Moved ${taskIds.length} tasks to sprint ${createdSprint.name}`
              );
            }
          } catch (error) {
            console.error(
              `Error moving tasks to sprint ${createdSprint.name}:`,
              error
            );
            toast({
              title: "Warning",
              description: `Error moving tasks to sprint "${
                createdSprint.name
              }": ${error instanceof Error ? error.message : "Unknown error"}`,
              variant: "destructive",
            });
          }
        }

        // Keep created sprints active (do not archive)

        // Show success message with detailed summary
        const summary = [
          `${sprints.length} sprints planned using ${
            type === "ai" ? "AI" : "manual"
          } analysis`,
          `${movedTasksCount} tasks moved from project to sprints`,
        ].join(", ");

        toast({
          title: "Sprints planned successfully",
          description: summary,
        });

        console.log("Sprint planning completed:", {
          sprintsCreated: createdSprints.length,
          tasksMoved: movedTasksCount,
          totalTasksToMove: totalTasksToMove,
          sprintsActive: createdSprints.length,
          type: type,
          success: true,
        });

        // Close both modals
        setShowSaveSprintsModal(false);
        setShowSprintAssistant(false);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("projectDataRefresh"));
        }

        // Force a full page refresh to ensure all components are updated
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Error saving sprints:", error);
        toast({
          title: "Failed to save sprints",
          description: "An unexpected error occurred while saving the sprints.",
          variant: "destructive",
        });
      }
    },
    [
      toast,
      space.id,
      workspace.id,
      setShowSaveSprintsModal,
      setShowSprintAssistant,
      supabase,
      project.id,
    ]
  );

  const renderCurrentView = () => {
    const commonProps = {
      state,
      updateState,
      taskOperations,
      getTaskSubtasks,
      handleTaskClick,
      toggleTaskExpansion,
      handleCreateSubtask,
      handleDeleteTask,
      tasks: filteredTasks,
      onOpenStatusSettings: handleOpenStatusSettings,
      onDeleteStatus: taskOperations.handleDeleteStatus,
    };

    switch (state.view) {
      case "board":
        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <BoardView {...commonProps} />
            <DragOverlay>
              {state.activeTask ? (
                <TaskCard
                  task={state.activeTask}
                  isDragging
                  subtasks={getTaskSubtasks(state.activeTask.id)}
                  isExpanded={state.expandedTasks.has(state.activeTask.id)}
                  workspaceMembers={state.workspaceMembers}
                  onToggleExpansion={toggleTaskExpansion}
                  onTaskClick={handleTaskClick}
                  onRenameTask={taskOperations.handleRenameTask}
                  onUpdatePriority={taskOperations.handleUpdatePriority}
                  onUpdateDates={taskOperations.handleUpdateDates}
                  onAssignTask={taskOperations.handleAssignTask}
                  onDeleteTask={handleDeleteTask}
                  onCreateSubtask={handleCreateSubtask}
                  teamMembers={state.teamMembers}
                />
              ) : state.activeStatus ? (
                <div className="transform rotate-2 shadow-2xl">
                  <StatusColumn
                    status={state.activeStatus}
                    tasks={filteredTasks.filter(
                      (t) =>
                        t.status_id === state.activeStatus!.id &&
                        !t.parent_task_id
                    )}
                    onCreateTask={() =>
                      updateState({ createTaskModalOpen: true })
                    }
                    onRenameStatus={taskOperations.handleRenameStatus}
                    onDeleteStatus={taskOperations.handleDeleteStatus}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        );
      case "list":
        return (
          <ListView
            {...commonProps}
            onCreateStatus={() => updateState({ createStatusModalOpen: true })}
          />
        );
      default:
        return <BoardView {...commonProps} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="workspace-header-bg border-b workspace-border">
        {/* Top section */}
        <div className="px-3 py-3 border-b workspace-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 workspace-component-bg rounded-md items-center flex justify-center">
                <Hash className="w-4 h-4 workspace-component-active-color" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{localProject.name}</span>
                  <Copy
                    className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(project.project_id);
                        toast({
                          title: "Project ID copied",
                          description:
                            "Project ID has been copied to clipboard",
                        });
                      } catch (error) {
                        console.error("Failed to copy project ID:", error);
                        toast({
                          title: "Failed to copy",
                          description: "Could not copy project ID to clipboard",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                  {isJiraProject && (
                    <Badge variant="secondary" className="text-xs flex gap-1">
                      <div className="w-3 h-3">
                        <JiraSvg />
                      </div>
                      <span>Jira Connected</span>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <span>Public ➙ in ➙</span>
                  <div
                    className={`w-4 h-4 rounded-sm mr-2 flex-shrink-0 flex items-center justify-center ${getIconColor(
                      space.icon
                    )}`}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {space.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{space.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 p-2 text-xs"
                onClick={() => router.push(`/${workspace.workspace_id}/agents`)}
              >
                <Brain className="h-4 w-4" />
              </Button> */}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 p-2 text-xs"
                onClick={() => setShowSprintAssistant(true)}
                disabled={!filteredTasks.length}
              >
                <ChartGantt className="h-4 w-4" />
              </Button>
              {isJiraProject && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-7 p-2 text-xs hover:workspace-hover relative"
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {syncStatus?.hasPendingChanges && !isSyncing && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center bg-orange-500 text-white"
                    >
                      !
                    </Badge>
                  )}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground w-7 h-7 p-2"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem
                    className="text-xs hover:workspace-hover cursor-pointer"
                    onClick={() => {
                      setRenameProjectId(project.id);
                      setRenameValue(localProject.name);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs hover:workspace-hover cursor-pointer"
                    onClick={() => handleCopyProjectLink(project, space)}
                  >
                    <Link className="h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs hover:workspace-hover cursor-pointer"
                    onClick={() => updateState({ createTaskModalOpen: true })}
                  >
                    <Plus className="h-3 w-3" />
                    Create new task
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 text-xs hover:workspace-hover cursor-pointer"
                    onClick={() => setDeleteProjectId(project.id)}
                  >
                    <Trash className="h-3 w-3" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Bottom section - View switcher and controls */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* View switcher */}
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                {state.activeViews.map((viewType) => (
                  <Button
                    key={viewType}
                    variant={state.view === viewType ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => updateState({ view: viewType })}
                    className={`text-xs h-7 ${
                      state.view === viewType
                        ? "workspace-component-bg workspace-component-active-color hover:workspace-component-bg"
                        : "hover:workspace-component-bg"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {viewType === "list" && <List className="h-4 w-4" />}
                      {viewType === "board" && (
                        <LayoutGrid className="h-4 w-4" />
                      )}
                      {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </div>
                  </Button>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      <Plus className="h-4 w-4" />
                      Add View
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {[
                      {
                        type: "list" as const,
                        icon: <List className="h-4 w-4 mr-2" />,
                      },
                      {
                        type: "board" as const,
                        icon: <LayoutGrid className="h-4 w-4 mr-2" />,
                      },
                    ].map(({ type, icon }) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => {
                          if (state.activeViews.includes(type)) {
                            if (state.activeViews.length > 1) {
                              const newActiveViews = state.activeViews.filter(
                                (v) => v !== type
                              );
                              updateState({
                                activeViews: newActiveViews,
                                view:
                                  state.view === type
                                    ? newActiveViews[0]
                                    : state.view,
                              });
                            }
                          } else {
                            updateState({
                              activeViews: [...state.activeViews, type],
                              view: type,
                            });
                          }
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            {icon}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </div>
                          {state.activeViews.includes(type) && (
                            <CheckIcon className="h-4 w-4 ml-2" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {state.view === "list" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateState({ customizeListModalOpen: true })
                    }
                    className="text-muted-foreground text-xs h-7 p-2"
                  >
                    <Settings className="h-4 w-4" />
                    Columns
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateState({ filterModalOpen: true })}
                  className="text-muted-foreground text-xs p-2 h-7 relative"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateState({
                        filters: {
                          status: [],
                          tags: [],
                          priority: [],
                          assigned: [],
                          sprintPoints: { min: 0, max: 100 },
                          showUnassignedOnly: false,
                        },
                      })
                    }
                    className="text-muted-foreground text-xs p-2 h-7"
                  >
                    Clear
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground text-xs p-2 h-7 relative"
                    >
                      <Users className="h-4 w-4" />
                      Assignee
                      {(state.filters.assigned.length > 0 ||
                        state.filters.showUnassignedOnly) && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                        >
                          {state.filters.showUnassignedOnly
                            ? 1
                            : state.filters.assigned.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[200px] max-h-[200px] overflow-y-auto"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        updateState({
                          filters: {
                            ...state.filters,
                            assigned: [],
                            showUnassignedOnly: false,
                          },
                        })
                      }
                      className="text-xs"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      All assignees
                      {state.filters.assigned.length === 0 &&
                        !state.filters.showUnassignedOnly && (
                          <CheckIcon className="ml-auto h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateState({
                          filters: {
                            ...state.filters,
                            assigned: [
                              ...state.workspaceMembers.map((m) => m.id),
                              ...state.teamMembers.map((m) => `team-${m.id}`),
                            ],
                            showUnassignedOnly: false,
                          },
                        })
                      }
                      className="text-xs"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Assigned tasks
                      {state.filters.assigned.length ===
                        state.workspaceMembers.length +
                          state.teamMembers.length &&
                        !state.filters.showUnassignedOnly && (
                          <CheckIcon className="ml-auto h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateState({
                          filters: {
                            ...state.filters,
                            assigned: [],
                            showUnassignedOnly: true,
                          },
                        })
                      }
                      className="text-xs"
                    >
                      <CircleUserRound className="h-4 w-4 mr-2" />
                      Unassigned
                      {state.filters.showUnassignedOnly && (
                        <CheckIcon className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* Workspace Members */}
                    {state.workspaceMembers.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Workspace Members
                        </div>
                        {state.workspaceMembers.map((member) => (
                          <DropdownMenuItem
                            key={member.id}
                            onClick={() => {
                              const isSelected =
                                state.filters.assigned.includes(member.id);
                              updateState({
                                filters: {
                                  ...state.filters,
                                  assigned: isSelected
                                    ? state.filters.assigned.filter(
                                        (id) => id !== member.id
                                      )
                                    : [...state.filters.assigned, member.id],
                                  showUnassignedOnly: false,
                                },
                              });
                            }}
                            className="text-xs flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-4 w-4 mr-2">
                                <AvatarImage
                                  src={member.avatar_url ?? undefined}
                                  alt={member.full_name || "User"}
                                />
                                <AvatarFallback className="text-[8px]">
                                  {getAvatarInitials(
                                    member.full_name,
                                    member.email
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span>{member.full_name}</span>
                            </div>
                            {state.filters.assigned.includes(member.id) && (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}

                    {/* Team Members */}
                    {state.teamMembers.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Team Members
                        </div>
                        {state.teamMembers.map((member) => (
                          <DropdownMenuItem
                            key={`team-${member.id}`}
                            onClick={() => {
                              const teamMemberId = `team-${member.id}`;
                              const isSelected =
                                state.filters.assigned.includes(teamMemberId);
                              updateState({
                                filters: {
                                  ...state.filters,
                                  assigned: isSelected
                                    ? state.filters.assigned.filter(
                                        (id) => id !== teamMemberId
                                      )
                                    : [...state.filters.assigned, teamMemberId],
                                  showUnassignedOnly: false,
                                },
                              });
                            }}
                            className="text-xs flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-4 w-4 mr-2">
                                <AvatarImage
                                  src={member.profile?.avatar_url ?? undefined}
                                  alt={
                                    member.profile?.full_name ||
                                    member.name ||
                                    "User"
                                  }
                                />
                                <AvatarFallback className="text-[8px]">
                                  {getAvatarInitials(
                                    member.profile?.full_name || member.name,
                                    member.profile?.email || member.email
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {member.profile?.full_name || member.name}
                              </span>
                            </div>
                            {state.filters.assigned.includes(
                              `team-${member.id}`
                            ) && <CheckIcon className="h-4 w-4" />}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      {renderCurrentView()}

      {/* Modals */}
      <CreateTaskModal
        open={state.createTaskModalOpen}
        onOpenChange={(open) => {
          updateState({
            createTaskModalOpen: open,
            subtaskParentId: open ? state.subtaskParentId : undefined,
          });
        }}
        onSuccess={taskOperations.handleTaskCreated}
        workspace={workspace}
        space={space}
        project={localProject}
        statuses={state.statuses}
        tags={state.tags}
        parentTaskId={state.subtaskParentId}
      />

      <CreateStatusModal
        open={state.createStatusModalOpen}
        onOpenChange={(open) => updateState({ createStatusModalOpen: open })}
        onSuccess={taskOperations.handleStatusCreated}
        workspace={workspace}
        space={space}
        project={localProject}
        statusTypes={state.statusTypes}
      />

      <StatusSettingsModal
        open={state.statusSettingsModalOpen}
        onOpenChange={(open) => updateState({ statusSettingsModalOpen: open })}
        status={state.statusToEdit}
        onSave={taskOperations.handleUpdateStatusSettings}
        statusTypes={state.statusTypes}
        workspace={workspace}
        space={space}
        project={localProject}
      />

      <FilterModal
        open={state.filterModalOpen}
        onOpenChange={(open) => updateState({ filterModalOpen: open })}
        filters={state.filters}
        onFiltersChange={(filters) => updateState({ filters })}
        statuses={state.statuses}
        tags={state.tags}
        workspaceMembers={state.workspaceMembers}
        teamMembers={state.teamMembers}
      />

      {state.view === "list" && (
        <CustomizeListModal
          open={state.customizeListModalOpen}
          onOpenChange={(open) => updateState({ customizeListModalOpen: open })}
          currentVisibleColumns={state.visibleColumns}
          onSave={(columns) => updateState({ visibleColumns: columns })}
        />
      )}

      <AlertDialog
        open={!!state.taskToDelete}
        onOpenChange={() => updateState({ taskToDelete: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task "
              <span className="font-semibold">{state.taskToDelete?.name}</span>"
              and all its subtasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                state.taskToDelete &&
                taskOperations.handleDeleteTask(state.taskToDelete.id)
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Project Dialog */}
      <AlertDialog
        open={!!renameProjectId}
        onOpenChange={() => setRenameProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Project</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="text"
              variant="workspace"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 workspace-header-bg workspace-border"
              placeholder="Enter project name"
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRenameProjectId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRenameProject(renameProjectId!, renameValue)}
              className="workspace-primary hover:workspace-primary-hover text-white"
            >
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Project Dialog */}
      <AlertDialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project "
              <span className="font-semibold">{localProject.name}</span>" and
              all its tasks, statuses, and related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteProjectId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteProject(deleteProjectId!)}
              disabled={isDeletingProject}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingProject ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sprint Assistant Modal */}
      <Dialog open={showSprintAssistant} onOpenChange={setShowSprintAssistant}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sprint Planning Assistant</DialogTitle>
          </DialogHeader>
          <SprintAssistant
            stories={convertTasksToUserStories(filteredTasks)}
            teamMembers={state.teamMembers}
            onSprintCreated={(sprint) => {
              setCurrentSprint(sprint);
              toast({
                title: "Enhanced Sprint created",
                description: `Enhanced sprint "${sprint.name}" with ${sprint.stories.length} stories created successfully.`,
              });
            }}
            onClose={() => setShowSprintAssistant(false)}
            onSaveSprints={handleSaveSprintsFromAssistant}
          />
        </DialogContent>
      </Dialog>

      {/* Save Sprints Modal */}
      <Dialog
        open={showSaveSprintsModal}
        onOpenChange={setShowSaveSprintsModal}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChartGantt className="h-5 w-5" />
              Save Sprints
            </DialogTitle>
            <DialogDescription>
              You have {sprintsToSave.length} sprints ready to save to your
              workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {/* Sprint Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Sprint Summary
              </h3>
              <div className="grid gap-3">
                {sprintsToSave.map((sprint, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        Sprint {index + 1}: {sprint.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {sprint.duration || 2} weeks
                      </Badge>
                    </div>
                    {sprint.goal && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {sprint.goal}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {sprint.startDate && (
                        <span>
                          Start:{" "}
                          {new Date(sprint.startDate).toLocaleDateString()}
                        </span>
                      )}
                      {sprint.endDate && (
                        <span>
                          End: {new Date(sprint.endDate).toLocaleDateString()}
                        </span>
                      )}
                      {sprint.stories && (
                        <span>{sprint.stories.length} stories</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Folder Configuration */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Folder Configuration
              </h3>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="sprint-folder-name"
                    className="text-sm font-medium"
                  >
                    Sprint Folder Name
                  </Label>
                  <Input
                    id="sprint-folder-name"
                    value={sprintFolderName}
                    onChange={(e) => setSprintFolderName(e.target.value)}
                    placeholder="Enter a descriptive name for your sprint folder"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This folder will contain all your planned sprints and can be
                    found in your space's sprint folders.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveSprintsModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await handleSaveSprintsToDatabase(
                  sprintsToSave,
                  sprintType,
                  sprintFolderName
                );
              }}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Sprints
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

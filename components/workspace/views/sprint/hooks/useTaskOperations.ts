import { useCallback } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type {
  Workspace,
  Space,
  Sprint,
  Task,
  Status,
  Profile,
} from "@/lib/database.types";
import type { SprintViewState } from "../types";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { arrayMove } from "@dnd-kit/sortable";
import { createTaskActivity } from "@/lib/events";
import { useAuth } from "@/contexts/auth-context";

interface UseTaskOperationsProps {
  state: SprintViewState;
  updateState: (updates: Partial<SprintViewState>) => void;
  supabase: ReturnType<typeof createClientSupabaseClient>;
  refreshTasks: () => Promise<void>;
  refreshStatuses: () => Promise<void>;
  loadAllSubtasks: () => Promise<void>;
  createEventLog: (eventData: any) => Promise<void>;
  workspace: Workspace;
  space: Space;
  sprint: Sprint;
}

export function useTaskOperations({
  state,
  updateState,
  supabase,
  refreshTasks,
  refreshStatuses,
  loadAllSubtasks,
  createEventLog,
  workspace,
  space,
  sprint,
}: UseTaskOperationsProps) {
  const { toast } = useEnhancedToast();
  const { user } = useAuth();

  const handleTaskCreated = useCallback(
    async (task: Task) => {
      await refreshTasks();
      await loadAllSubtasks();

      await createEventLog({
        type: "created",
        entityType: "task",
        entityId: task.id,
        entityName: task.name,
        description: `Created task "${task.name}" in sprint "${sprint.name}"`,
      });

      // Dispatch custom event for sidebar synchronization
      window.dispatchEvent(
        new CustomEvent("taskCreated", {
          detail: { task, sprintId: sprint.id },
        })
      );

      toast({
        title: "Task created",
        description: `Task "${task.name}" has been created successfully.`,
      });

      updateState({ createTaskModalOpen: false, subtaskParentId: undefined });
    },
    [
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
      toast,
      updateState,
      sprint.id,
    ]
  );

  const handleStatusCreated = useCallback(async () => {
    await refreshStatuses();

    await createEventLog({
      type: "created",
      entityType: "status",
      entityId: "new-status", // This will be updated with actual status ID
      entityName: "New Status",
      description: `Created new status in sprint "${sprint.name}"`,
    });

    toast({
      title: "Status created",
      description: "New status has been created successfully.",
    });

    updateState({ createStatusModalOpen: false });
  }, [refreshStatuses, createEventLog, sprint.name, toast, updateState]);

  const handleRenameTask = useCallback(
    async (taskId: string, newName: string) => {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ name: newName })
          .eq("id", taskId);

        if (error) throw error;

        // Update local state immediately for better UX
        updateState({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, name: newName } : task
          ),
        });

        await refreshTasks();
        await loadAllSubtasks();

        await createEventLog({
          type: "updated",
          entityType: "task",
          entityId: taskId,
          entityName: newName,
          description: `Renamed task to "${newName}" in sprint "${sprint.name}"`,
        });

        toast({
          title: "Task renamed",
          description: "Task has been renamed successfully.",
        });
      } catch (error) {
        console.error("Error renaming task:", error);
        toast({
          title: "Error",
          description: "Failed to rename task.",
          variant: "destructive",
        });
      }
    },
    [
      supabase,
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
      toast,
      updateState,
      state.tasks,
    ]
  );

  const handleUpdatePriority = useCallback(
    async (taskId: string, priority: string | null) => {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ priority })
          .eq("id", taskId);

        if (error) throw error;

        // Update local state immediately for better UX
        updateState({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, priority: priority || "" } : task
          ),
        });

        await refreshTasks();
        await loadAllSubtasks();

        // Create main event
        await createEventLog({
          type: "updated",
          entityType: "task",
          entityId: taskId,
          entityName: "Task", // Will be updated with actual task name
          description: `Updated priority of task in sprint "${sprint.name}"`,
        });

        // Create detailed activity if user is available
        if (user) {
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            await createTaskActivity({
              type: "priority_changed",
              taskId: taskId,
              taskName: task.name,
              userId: user.id,
              workspaceId: workspace.id,
              spaceId: space.id,
              description: `Changed priority to ${
                priority || "none"
              } in sprint "${sprint.name}"`,
              metadata: {
                oldValue: task.priority,
                newValue: priority,
                sprintName: sprint.name,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error updating task priority:", error);
        toast({
          title: "Error",
          description: "Failed to update task priority.",
          variant: "destructive",
        });
      }
    },
    [
      supabase,
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
      toast,
      user,
      workspace.id,
      space.id,
      state.tasks,
      updateState,
    ]
  );

  const handleUpdateDates = useCallback(
    async (taskId: string, startDate: Date | null, dueDate: Date | null) => {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({
            start_date: startDate?.toISOString() || null,
            due_date: dueDate?.toISOString() || null,
          })
          .eq("id", taskId);

        if (error) throw error;

        // Update local state immediately for better UX
        updateState({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  start_date: startDate?.toISOString() || null,
                  due_date: dueDate?.toISOString() || null,
                }
              : task
          ),
        });

        await refreshTasks();
        await loadAllSubtasks();

        await createEventLog({
          type: "updated",
          entityType: "task",
          entityId: taskId,
          entityName: "Task",
          description: `Updated dates of task in sprint "${sprint.name}"`,
        });

        // Create detailed activity if user is available
        if (user) {
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            await createTaskActivity({
              type: "start_date_changed",
              taskId: taskId,
              taskName: task.name,
              userId: user.id,
              workspaceId: workspace.id,
              spaceId: space.id,
              description: `Updated start date in sprint "${sprint.name}"`,
              metadata: {
                oldValue: task.start_date,
                newValue: startDate?.toISOString() || null,
                sprintName: sprint.name,
              },
            });

            await createTaskActivity({
              type: "due_date_changed",
              taskId: taskId,
              taskName: task.name,
              userId: user.id,
              workspaceId: workspace.id,
              spaceId: space.id,
              description: `Updated due date in sprint "${sprint.name}"`,
              metadata: {
                oldValue: task.due_date,
                newValue: dueDate?.toISOString() || null,
                sprintName: sprint.name,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error updating task dates:", error);
        toast({
          title: "Error",
          description: "Failed to update task dates.",
          variant: "destructive",
        });
      }
    },
    [
      supabase,
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
      toast,
      user,
      workspace.id,
      space.id,
      state.tasks,
      updateState,
    ]
  );

  const handleAssignTask = useCallback(
    async (taskId: string, assigneeId: string | null) => {
      try {
        // Check if this is a team member assignment (starts with "team-")
        const isTeamMember = assigneeId && assigneeId.startsWith("team-");
        const actualAssigneeId = isTeamMember
          ? assigneeId.replace("team-", "")
          : assigneeId;

        // Update the appropriate field based on assignment type
        const updateData: any = {};
        if (isTeamMember) {
          updateData.assigned_member_id = actualAssigneeId;
          updateData.assignee_id = null; // Clear profile assignee
        } else {
          updateData.assignee_id = actualAssigneeId;
          updateData.assigned_member_id = null; // Clear team member assignee
        }

        const { error } = await supabase
          .from("tasks")
          .update(updateData)
          .eq("id", taskId);

        if (error) throw error;

        // Update local state immediately for better UX
        const updatedTask = state.tasks.find((t) => t.id === taskId);
        const newAssignee = isTeamMember
          ? null
          : state.workspaceMembers.find((m) => m.id === actualAssigneeId) ||
            null;
        const newAssignedMember = isTeamMember
          ? state.teamMembers.find((m) => m.id === actualAssigneeId) || null
          : null;

        updateState({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  assignee_id: isTeamMember ? null : actualAssigneeId,
                  assigned_member_id: isTeamMember ? actualAssigneeId : null,
                  assignee: newAssignee,
                  assigned_member: newAssignedMember,
                }
              : task
          ),
        });

        await refreshTasks();
        await loadAllSubtasks();

        await createEventLog({
          type: "updated",
          entityType: "task",
          entityId: taskId,
          entityName: "Task",
          description: `Assigned task in sprint "${sprint.name}"`,
        });

        // Create detailed activity if user is available
        if (user) {
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            await createTaskActivity({
              type: "assignee_changed",
              taskId: taskId,
              taskName: task.name,
              userId: user.id,
              workspaceId: workspace.id,
              spaceId: space.id,
              description: `Changed assignee in sprint "${sprint.name}"`,
              metadata: {
                oldValue: isTeamMember
                  ? task.assigned_member_id
                  : task.assignee_id,
                newValue: actualAssigneeId,
                sprintName: sprint.name,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error assigning task:", error);
        toast({
          title: "Error",
          description: "Failed to assign task.",
          variant: "destructive",
        });
      }
    },
    [
      supabase,
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
      toast,
      user,
      workspace.id,
      space.id,
      state.tasks,
      updateState,
    ]
  );

  const handleDeleteTask = useCallback(
    async (task: Task) => {
      try {
        const timestamp = new Date().toISOString();
        const { error } = await supabase
          .from("tasks")
          .update({ deleted_at: timestamp })
          .eq("id", task.id);

        if (error) throw error;

        // Update local state immediately for better UX
        updateState({
          tasks: state.tasks.filter((t) => t.id !== task.id),
        });

        await refreshTasks();
        await loadAllSubtasks();

        // Dispatch custom event for sidebar synchronization
        window.dispatchEvent(
          new CustomEvent("taskDeleted", {
            detail: { task, sprintId: sprint.id },
          })
        );

        await createEventLog({
          type: "deleted",
          entityType: "task",
          entityId: task.id,
          entityName: task.name,
          description: `Deleted task "${task.name}" from sprint "${sprint.name}"`,
        });

        toast({
          title: "Task deleted",
          description: "Task has been deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        toast({
          title: "Error",
          description: "Failed to delete task.",
          variant: "destructive",
        });
      }
    },
    [
      supabase,
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
      toast,
      updateState,
      state.tasks,
      sprint.id,
    ]
  );

  const handleRenameStatus = useCallback(
    async (statusId: string, newName: string) => {
      try {
        const { error } = await supabase
          .from("statuses")
          .update({ name: newName })
          .eq("id", statusId);

        if (error) throw error;

        await refreshStatuses();
        await createEventLog({
          type: "updated",
          entityType: "status",
          entityId: statusId,
          entityName: newName,
          description: `Renamed status to "${newName}" in sprint "${sprint.name}"`,
        });

        toast({
          title: "Status renamed",
          description: "Status has been renamed successfully.",
        });
      } catch (error) {
        console.error("Error renaming status:", error);
        toast({
          title: "Error",
          description: "Failed to rename status.",
          variant: "destructive",
        });
      }
    },
    [supabase, refreshStatuses, createEventLog, sprint.name, toast]
  );

  const handleUpdateStatusSettings = useCallback(
    async (updatedStatus: any) => {
      try {
        const { error } = await supabase
          .from("statuses")
          .update({
            name: updatedStatus.name,
            status_type_id: updatedStatus.status_type_id,
            color: updatedStatus.color,
            type: updatedStatus.type,
          })
          .eq("id", updatedStatus.id);

        if (error) throw error;

        await refreshStatuses();
        await createEventLog({
          type: "updated",
          entityType: "status",
          entityId: updatedStatus.id,
          entityName: updatedStatus.name,
          description: `Updated status "${updatedStatus.name}" settings in sprint "${sprint.name}"`,
        });

        toast({
          title: "Status updated",
          description: `Status "${updatedStatus.name}" has been updated successfully.`,
        });
      } catch (error) {
        console.error("Error updating status settings:", error);
        toast({
          title: "Error",
          description: "Failed to update status settings.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [supabase, refreshStatuses, createEventLog, sprint.name, toast]
  );

  const handleDragEnd = useCallback(
    async (active: any, over: any) => {
      if (!over) return;

      // Handle status reordering
      if (state.activeStatus) {
        const oldIndex = state.statuses.findIndex((s) => s.id === active.id);
        const newIndex = state.statuses.findIndex((s) => s.id === over.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const newOrderedStatuses = arrayMove(
          state.statuses,
          oldIndex,
          newIndex
        );

        updateState({ statuses: newOrderedStatuses });

        try {
          const updates = newOrderedStatuses.map((status, index) => ({
            id: status.id,
            status_id: status.status_id,
            name: status.name,
            color: status.color,
            position: index,
            workspace_id: status.workspace_id,
            project_id: status.project_id,
            space_id: status.space_id,
            sprint_id: status.sprint_id,
            status_type_id: status.status_type_id,
            type: status.type,
            integration_type: status.integration_type,
            external_id: status.external_id,
            external_data: status.external_data,
            last_synced_at: status.last_synced_at,
            sync_status: status.sync_status,
            pending_sync: status.pending_sync,
          }));

          const { error } = await supabase
            .from("statuses")
            .upsert(updates, { onConflict: "id" });

          if (error) {
            console.error("Error updating status positions:", error);
            await refreshStatuses();
          } else {
            await createEventLog({
              type: "reordered",
              entityType: "status",
              entityId: state.activeStatus.id,
              entityName: state.activeStatus.name,
              description: `Reordered status "${state.activeStatus.name}" in sprint "${sprint.name}"`,
              metadata: {
                oldIndex,
                newIndex,
                oldStatusName: state.activeStatus.name,
                newStatusName: newOrderedStatuses[newIndex].name,
              },
            });
          }
        } catch (error) {
          console.error("Error updating status positions:", error);
          await refreshStatuses();
        }
        return;
      }

      // Handle task dragging
      if (state.activeTask) {
        const taskId = active.id as string;
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task || task.parent_task_id) return;

        let targetStatusId: string | null = null;

        const targetStatus = state.statuses.find((s) => s.id === over.id);
        if (targetStatus) {
          targetStatusId = targetStatus.id;
        } else if (over.id.toString().startsWith("status-")) {
          targetStatusId = over.id.toString().replace("status-", "");
        } else {
          const targetTask = state.tasks.find((t) => t.id === over.id);
          if (targetTask) {
            targetStatusId = targetTask.status_id;
          }
        }

        if (!targetStatusId || task.status_id === targetStatusId) return;

        const oldStatus = state.statuses.find((s) => s.id === task.status_id);
        const newStatus = state.statuses.find((s) => s.id === targetStatusId);

        updateState({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status_id: targetStatusId } : t
          ),
        });

        try {
          const { error } = await supabase
            .from("tasks")
            .update({ status_id: targetStatusId })
            .eq("id", taskId);

          if (error) {
            console.error("Error updating task status:", error);
            await refreshTasks();
          } else {
            await refreshTasks();
            await loadAllSubtasks();

            await createEventLog({
              type: "updated",
              entityType: "task",
              entityId: task.id,
              entityName: task.name,
              description: `Moved task "${task.name}" from "${
                oldStatus?.name || "Unknown"
              }" to "${newStatus?.name || "Unknown"}" in sprint "${
                sprint.name
              }"`,
              metadata: {
                oldStatusId: task.status_id,
                newStatusId: targetStatusId,
                oldStatusName: oldStatus?.name,
                newStatusName: newStatus?.name,
              },
            });
          }
        } catch (error) {
          console.error("Error updating task status:", error);
          await refreshTasks();
        }
      }
    },
    [
      state,
      updateState,
      supabase,
      refreshStatuses,
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
    ]
  );

  const handleDeleteStatus = useCallback(
    async (statusId: string) => {
      try {
        const statusToDelete = state.statuses.find((s) => s.id === statusId);
        if (!statusToDelete) {
          console.error("Status not found:", statusId);
          return;
        }

        const timestamp = new Date().toISOString();

        console.log(
          "Attempting to delete status:",
          statusToDelete.name,
          "with ID:",
          statusId
        );

        // Get tasks that use this status
        const tasksWithStatus = state.tasks.filter(
          (t) => t.status_id === statusId
        );

        console.log("Found", tasksWithStatus.length, "tasks to delete");

        // Delete all tasks that use this status
        if (tasksWithStatus.length > 0) {
          const taskIds = tasksWithStatus.map((t) => t.id);
          console.log("Deleting task IDs:", taskIds);

          // First, delete task_tags that reference these tasks
          console.log("Deleting task_tags for tasks...");
          const { error: taskTagsError } = await supabase
            .from("task_tags")
            .update({ deleted_at: timestamp })
            .in("task_id", taskIds);

          if (taskTagsError) {
            console.error("Error deleting task_tags:", taskTagsError);
            console.error("Error details:", {
              message: taskTagsError.message,
              details: taskTagsError.details,
              hint: taskTagsError.hint,
              code: taskTagsError.code,
            });
            throw taskTagsError;
          }

          // Then delete events that reference these tasks as parent_task_id
          console.log("Deleting events that reference tasks as parent...");
          const { error: eventsError } = await supabase
            .from("events")
            .update({ deleted_at: timestamp })
            .in("parent_task_id", taskIds);

          if (eventsError) {
            console.error("Error deleting events:", eventsError);
            console.error("Error details:", {
              message: eventsError.message,
              details: eventsError.details,
              hint: eventsError.hint,
              code: eventsError.code,
            });
            throw eventsError;
          }

          // Update sprints that reference these tasks (set task_id to null)
          console.log("Updating sprints that reference tasks...");
          const { error: sprintsError } = await supabase
            .from("sprints")
            .update({ task_id: null })
            .in("task_id", taskIds);

          if (sprintsError) {
            console.error("Error updating sprints:", sprintsError);
            console.error("Error details:", {
              message: sprintsError.message,
              details: sprintsError.details,
              hint: sprintsError.hint,
              code: sprintsError.code,
            });
            throw sprintsError;
          }

          // Finally delete the tasks themselves
          console.log("Deleting tasks...");
          const { error: tasksError, data: deletedTasks } = await supabase
            .from("tasks")
            .update({ deleted_at: timestamp })
            .in("id", taskIds)
            .select();

          if (tasksError) {
            console.error("Error deleting tasks:", tasksError);
            console.error("Error details:", {
              message: tasksError.message,
              details: tasksError.details,
              hint: tasksError.hint,
              code: tasksError.code,
            });
            throw tasksError;
          }

          console.log(
            "Successfully deleted",
            deletedTasks?.length || 0,
            "tasks"
          );

          // Create event logs for deleted tasks
          for (const task of tasksWithStatus) {
            await createEventLog({
              type: "deleted",
              entityType: "task",
              entityId: task.id,
              entityName: task.name,
              description: `Task "${task.name}" deleted due to status deletion in sprint "${sprint.name}"`,
              metadata: {
                deletedStatusId: statusId,
                deletedStatusName: statusToDelete.name,
              },
            });
          }
        }

        // Delete the status
        console.log("Deleting status with ID:", statusId);
        const { error: statusError, data: deletedStatus } = await supabase
          .from("statuses")
          .update({ deleted_at: timestamp })
          .eq("id", statusId)
          .select();

        if (statusError) {
          console.error("Error deleting status:", statusError);
          console.error("Error details:", {
            message: statusError.message,
            details: statusError.details,
            hint: statusError.hint,
            code: statusError.code,
          });
          throw statusError;
        }

        console.log("Successfully deleted status:", deletedStatus);

        // Create event log for status deletion
        await createEventLog({
          type: "deleted",
          entityType: "status",
          entityId: statusId,
          entityName: statusToDelete.name,
          description: `Status "${statusToDelete.name}" deleted along with ${tasksWithStatus.length} tasks in sprint "${sprint.name}"`,
          metadata: {
            deletedTaskCount: tasksWithStatus.length,
            deletedTaskIds: tasksWithStatus.map((t) => t.id),
          },
        });

        // Refresh data
        await refreshStatuses();
        await refreshTasks();
        await loadAllSubtasks();

        // Dispatch custom event for sidebar synchronization
        window.dispatchEvent(
          new CustomEvent("statusDeleted", {
            detail: { statusId, sprintId: sprint.id },
          })
        );

        toast({
          title: "Status deleted",
          description: `Status "${statusToDelete.name}" and ${tasksWithStatus.length} tasks have been deleted.`,
        });
      } catch (error) {
        console.error("Error deleting status:", error);
        console.error("Full error object:", JSON.stringify(error, null, 2));

        // Provide more specific error messages based on error type
        let errorMessage = "Failed to delete status. Please try again.";
        if (error && typeof error === "object" && "message" in error) {
          const errorObj = error as any;
          if (errorObj.code === "23503") {
            errorMessage =
              "Cannot delete status because it is still referenced by other data.";
          } else if (errorObj.message) {
            errorMessage = errorObj.message;
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
    },
    [
      state.statuses,
      state.tasks,
      supabase,
      refreshStatuses,
      refreshTasks,
      loadAllSubtasks,
      createEventLog,
      sprint.name,
      sprint.id,
      toast,
    ]
  );

  return {
    handleTaskCreated,
    handleStatusCreated,
    handleRenameTask,
    handleUpdatePriority,
    handleUpdateDates,
    handleAssignTask,
    handleDeleteTask,
    handleRenameStatus,
    handleUpdateStatusSettings,
    handleDeleteStatus,
    handleDragEnd,
  };
}

import { useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task, Status } from "@/lib/database.types";
import type { ProjectViewState } from "../types";

interface UseTaskOperationsProps {
  state: ProjectViewState;
  updateState: (updates: Partial<ProjectViewState>) => void;
  supabase: any;
  refreshTasks: () => Promise<void>;
  refreshStatuses: () => Promise<void>;
  loadAllSubtasks: () => Promise<void>;
  createEventLog: (eventData: any) => Promise<void>;
  workspace: any;
  project: any;
}

export const useTaskOperations = ({
  state,
  updateState,
  supabase,
  refreshTasks,
  refreshStatuses,
  loadAllSubtasks,
  createEventLog,
  workspace,
  project,
}: UseTaskOperationsProps) => {
  const handleTaskCreated = useCallback(
    async (task: Task) => {
      console.log("Task created in project view:", task);
      await refreshTasks();
      await loadAllSubtasks();

      // Dispatch custom event for sidebar synchronization
      window.dispatchEvent(
        new CustomEvent("taskCreated", {
          detail: { task, projectId: project.id },
        })
      );
    },
    [refreshTasks, loadAllSubtasks, project.id]
  );

  const handleStatusCreated = useCallback(async () => {
    await refreshStatuses();
    await refreshTasks();
  }, [refreshStatuses, refreshTasks]);

  const handleRenameTask = useCallback(
    async (taskId: string, newName: string) => {
      if (!newName.trim()) return;
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ name: newName })
          .eq("id", taskId);
        if (error) {
          console.error("Error renaming task:", error);
        } else {
          // Update local state immediately for better UX
          updateState({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, name: newName } : task
            ),
          });

          await refreshTasks();
          const task = state.tasks.find((t) => t.id === taskId);

          // Mark for sync if this is a Jira project (both jira and default type tasks)
          if (
            project.type === "jira" &&
            (task?.type === "jira" ||
              task?.type === "default" ||
              task?.type === "ai-generated")
          ) {
            await supabase
              .from("tasks")
              .update({
                pending_sync: true,
                sync_status: "pending",
              })
              .eq("id", taskId);
          }

          await createEventLog({
            type: "updated",
            entityType: "task",
            entityId: taskId,
            entityName: newName,
            description: `Renamed task from "${
              task?.name || "Unknown"
            }" to "${newName}"`,
            metadata: {
              oldName: task?.name,
              newName: newName,
            },
          });
        }
      } catch (error) {
        console.error("Error renaming task:", error);
      }
    },
    [
      supabase,
      refreshTasks,
      state.tasks,
      createEventLog,
      project.type,
      updateState,
    ]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        const task = state.tasks.find((t) => t.id === taskId);
        const timeStamp = new Date().toISOString();
        if (!task) return;

        const { error } = await supabase
          .from("tasks")
          .update({ deleted_at: timeStamp })
          .eq("id", taskId);
        if (error) {
          console.error("Error deleting task:", error);
        } else {
          // Update local state immediately for better UX
          updateState({
            tasks: state.tasks.filter((t) => t.id !== taskId),
          });

          await refreshTasks();
          await loadAllSubtasks();

          // Dispatch custom event for sidebar synchronization
          window.dispatchEvent(
            new CustomEvent("taskDeleted", {
              detail: { task, projectId: project.id },
            })
          );

          await createEventLog({
            type: "deleted",
            entityType: "task",
            entityId: taskId,
            entityName: task.name,
            description: `Deleted task "${task.name}"`,
            metadata: {
              taskName: task.name,
            },
          });
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        updateState({ taskToDelete: null });
      }
    },
    [
      supabase,
      refreshTasks,
      loadAllSubtasks,
      state.tasks,
      createEventLog,
      updateState,
      project.id,
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

        if (error) {
          console.error("Error assigning task:", error);
        } else {
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
          const task = state.tasks.find((t) => t.id === taskId);

          let assignedUser = null;
          let description = "";

          if (isTeamMember) {
            assignedUser = state.teamMembers.find(
              (member) => member.id === actualAssigneeId
            );
            description = assigneeId
              ? `Assigned task "${task?.name || "Unknown"}" to team member "${
                  assignedUser?.name || "Unknown"
                }"`
              : `Unassigned task "${task?.name || "Unknown"}"`;
          } else {
            assignedUser = state.workspaceMembers.find(
              (member) => member.id === actualAssigneeId
            );
            description = assigneeId
              ? `Assigned task "${task?.name || "Unknown"}" to "${
                  assignedUser?.full_name || "Unknown"
                }"`
              : `Unassigned task "${task?.name || "Unknown"}"`;
          }

          await createEventLog({
            type: "updated",
            entityType: "task",
            entityId: taskId,
            entityName: task?.name || "Unknown",
            description: description,
            metadata: {
              field: "assignee",
              oldAssigneeId: task?.assignee_id,
              newAssigneeId: actualAssigneeId,
              oldAssignedMemberId: task?.assigned_member_id,
              newAssignedMemberId: isTeamMember ? actualAssigneeId : null,
              oldAssigneeName: task?.assignee?.full_name,
              newAssigneeName: assignedUser?.full_name || assignedUser?.name,
              assignmentType: isTeamMember ? "team_member" : "profile_user",
            },
          });
        }
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    },
    [
      supabase,
      refreshTasks,
      state.tasks,
      state.workspaceMembers,
      state.teamMembers,
      createEventLog,
      updateState,
    ]
  );

  const handleUpdatePriority = useCallback(
    async (taskId: string, priority: string | null) => {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ priority })
          .eq("id", taskId);

        if (error) {
          console.error("Error updating task priority:", error);
        } else {
          // Update local state immediately for better UX
          updateState({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, priority: priority || "" } : task
            ),
          });

          await refreshTasks();
          const task = state.tasks.find((t) => t.id === taskId);

          // Mark for sync if this is a Jira project (both jira and default type tasks)
          if (
            project.type === "jira" &&
            (task?.type === "jira" ||
              task?.type === "default" ||
              task?.type === "ai-generated")
          ) {
            await supabase
              .from("tasks")
              .update({
                pending_sync: true,
                sync_status: "pending",
              })
              .eq("id", taskId);
          }

          await createEventLog({
            type: "updated",
            entityType: "task",
            entityId: taskId,
            entityName: task?.name || "Unknown",
            description: `Updated task "${task?.name}" priority to ${
              priority || "none"
            }`,
            metadata: {
              field: "priority",
              oldPriority: task?.priority,
              newPriority: priority,
            },
          });
        }
      } catch (error) {
        console.error("Error updating task priority:", error);
      }
    },
    [
      supabase,
      refreshTasks,
      state.tasks,
      createEventLog,
      project.type,
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

        if (error) {
          console.error("Error updating task dates:", error);
        } else {
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
          const task = state.tasks.find((t) => t.id === taskId);

          // Mark for sync if this is a Jira project (both jira and default type tasks)
          if (
            project.type === "jira" &&
            (task?.type === "jira" ||
              task?.type === "default" ||
              task?.type === "ai-generated")
          ) {
            await supabase
              .from("tasks")
              .update({
                pending_sync: true,
                sync_status: "pending",
              })
              .eq("id", taskId);
          }

          await createEventLog({
            type: "updated",
            entityType: "task",
            entityId: taskId,
            entityName: task?.name || "Unknown",
            description: `Updated task "${task?.name}" dates`,
            metadata: {
              field: "dates",
              oldStartDate: task?.start_date,
              newStartDate: startDate?.toISOString(),
              oldDueDate: task?.due_date,
              newDueDate: dueDate?.toISOString(),
            },
          });
        }
      } catch (error) {
        console.error("Error updating task dates:", error);
      }
    },
    [
      supabase,
      refreshTasks,
      state.tasks,
      createEventLog,
      project.type,
      updateState,
    ]
  );

  const handleRenameStatus = useCallback(
    async (statusId: string, newName: string) => {
      try {
        // Use direct Supabase call instead of API endpoint
        const { data, error } = await supabase
          .from("statuses")
          .update({ name: newName })
          .eq("id", statusId)
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(`Failed to rename status: ${error.message}`);
        }

        updateState({
          statuses: state.statuses.map((status) =>
            status.id === statusId ? { ...status, name: newName } : status
          ),
        });
      } catch (error) {
        console.error("Error renaming status:", error);
      }
    },
    [supabase, state.statuses, updateState]
  );

  const handleUpdateStatusSettings = useCallback(
    async (updatedStatus: any) => {
      try {
        console.log("Updating status settings:", updatedStatus);

        // Use direct Supabase call instead of API endpoint
        const { data, error } = await supabase
          .from("statuses")
          .update({
            name: updatedStatus.name,
            status_type_id: updatedStatus.status_type_id,
            color: updatedStatus.color,
            type: updatedStatus.type,
          })
          .eq("id", updatedStatus.id)
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(`Failed to update status settings: ${error.message}`);
        }

        console.log("Updated status data:", data);

        // Update local state
        updateState({
          statuses: state.statuses.map((status) =>
            status.id === updatedStatus.id
              ? { ...status, ...updatedStatus }
              : status
          ),
        });

        // Create event log
        await createEventLog({
          type: "updated",
          entityType: "status",
          entityId: updatedStatus.id,
          entityName: updatedStatus.name,
          description: `Updated status "${updatedStatus.name}" settings`,
          metadata: {
            oldName: state.statuses.find((s) => s.id === updatedStatus.id)
              ?.name,
            newName: updatedStatus.name,
            oldColor: state.statuses.find((s) => s.id === updatedStatus.id)
              ?.color,
            newColor: updatedStatus.color,
            oldType: state.statuses.find((s) => s.id === updatedStatus.id)
              ?.type,
            newType: updatedStatus.type,
          },
        });
      } catch (error) {
        console.error("Error updating status settings:", error);
        throw error;
      }
    },
    [supabase, state.statuses, updateState, createEventLog]
  );

  const handleDeleteStatus = useCallback(
    async (statusId: string) => {
      try {
        const statusToDelete = state.statuses.find((s) => s.id === statusId);
        const timestamp = new Date().toISOString();
        if (!statusToDelete) {
          console.error("Status not found:", statusId);
          return;
        }

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
              description: `Task "${task.name}" deleted due to status deletion`,
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
          description: `Status "${statusToDelete.name}" deleted along with ${tasksWithStatus.length} tasks`,
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
            detail: { statusId, projectId: project.id },
          })
        );
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
      project.id,
    ]
  );

  const handleDragEnd = useCallback(
    async (active: any, over: any) => {
      console.log("Project taskOperations.handleDragEnd - active:", active);
      console.log("Project taskOperations.handleDragEnd - over:", over);
      console.log(
        "Project taskOperations.handleDragEnd - state.activeStatus:",
        state.activeStatus
      );
      console.log(
        "Project taskOperations.handleDragEnd - state.activeTask:",
        state.activeTask
      );

      if (!over) return;

      // Handle status reordering
      if (state.activeStatus) {
        console.log(
          "Project taskOperations.handleDragEnd - handling status reordering"
        );
        console.log(
          "Project taskOperations.handleDragEnd - over.data:",
          over.data
        );

        const oldIndex = state.statuses.findIndex((s) => s.id === active.id);

        // Handle the case where over.id has a "status-" prefix for droppable areas
        let targetStatusId = over.id;
        if (over.id.toString().startsWith("status-")) {
          targetStatusId = over.id.toString().replace("status-", "");
        }

        const newIndex = state.statuses.findIndex(
          (s) => s.id === targetStatusId
        );

        console.log(
          "Project taskOperations.handleDragEnd - oldIndex:",
          oldIndex
        );
        console.log(
          "Project taskOperations.handleDragEnd - newIndex:",
          newIndex
        );
        console.log(
          "Project taskOperations.handleDragEnd - targetStatusId:",
          targetStatusId
        );

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          console.log(
            "Project taskOperations.handleDragEnd - invalid indices, returning"
          );
          return;
        }

        const newOrderedStatuses = arrayMove(
          state.statuses,
          oldIndex,
          newIndex
        );

        console.log(
          "Project taskOperations.handleDragEnd - newOrderedStatuses:",
          newOrderedStatuses
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
              description: `Reordered status "${state.activeStatus.name}"`,
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
        console.log(
          "Project taskOperations.handleDragEnd - handling task dragging"
        );
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
          const targetStatus = state.statuses.find(
            (s) => s.id === targetStatusId
          );
          const { error } = await supabase
            .from("tasks")
            .update({
              status_id: targetStatusId,
              project_id: targetStatus?.project_id ?? null,
              space_id: targetStatus?.space_id ?? null,
            })
            .eq("id", taskId);

          if (error) {
            console.error("Error updating task status:", error);
            await refreshTasks();
          } else {
            // Mark for sync if this is a Jira task
            if (task.type === "jira" && task.external_id) {
              await supabase
                .from("tasks")
                .update({
                  pending_sync: true,
                  sync_status: "pending",
                })
                .eq("id", taskId);
            }

            await createEventLog({
              type: "updated",
              entityType: "task",
              entityId: task.id,
              entityName: task.name,
              description: `Updated task "${task.name}" status from "${
                oldStatus?.name || "Unknown"
              }" to "${newStatus?.name || "Unknown"}"`,
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
      createEventLog,
    ]
  );

  return {
    handleTaskCreated,
    handleStatusCreated,
    handleRenameTask,
    handleDeleteTask,
    handleAssignTask,
    handleUpdatePriority,
    handleUpdateDates,
    handleRenameStatus,
    handleUpdateStatusSettings,
    handleDeleteStatus,
    handleDragEnd,
  };
};

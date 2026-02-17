import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  MoreHorizontal,
  CalendarIcon,
  CircleUserRound,
  CheckIcon,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Goal,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  XCircle,
  CircleCheck,
  CircleDashed,
  CirclePlay,
  Settings,
  Pencil,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/workspace/components/date-picker";
import { format, parseISO } from "date-fns";
import { getAvatarInitials } from "@/lib/utils";
import { priorityConfig } from "../types";
import { getStatusColor, getStatusBadge, formatDateRange } from "../utils";
import { getStatusTextColor } from "@/components/workspace/views/project/utils";
import { Input } from "@/components/ui/input";

interface ListViewProps {
  state: any;
  updateState: (updates: any) => void;
  taskOperations: any;
  getTaskSubtasks: (taskId: string) => any[];
  handleTaskClick: (task: any) => void;
  toggleTaskExpansion: (taskId: string, e: React.MouseEvent) => void;
  handleCreateSubtask: (parentId: string) => void;
  handleDeleteTask: (task: any) => void;
  onCreateStatus?: () => void;
  filteredTasks?: any[];
  handleRenameStatus?: (status: any) => void;
  handleEditStatus?: (status: any) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  state,
  updateState,
  taskOperations,
  getTaskSubtasks,
  handleTaskClick,
  toggleTaskExpansion,
  handleCreateSubtask,
  handleDeleteTask,
  onCreateStatus,
  filteredTasks,
  handleRenameStatus,
  handleEditStatus,
}) => {
  // Use filteredTasks if provided, otherwise use state.tasks
  const tasksToRender = filteredTasks || state.tasks;

  if (state.isLoading) {
    return (
      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border workspace-border">
              <div className="flex items-center justify-between p-2 border-b workspace-border">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 workspace-secondary-sidebar-bg rounded-full animate-pulse" />
                  <div className="h-4 w-20 workspace-secondary-sidebar-bg rounded animate-pulse" />
                  <div className="h-4 w-6 workspace-secondary-sidebar-bg rounded animate-pulse" />
                </div>
              </div>
              <div className="p-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="flex items-center space-x-2 py-2 border-b workspace-border last:border-b-0"
                  >
                    <div className="w-4 h-4 workspace-secondary-sidebar-bg rounded animate-pulse" />
                    <div className="h-4 w-1/3 workspace-secondary-sidebar-bg rounded animate-pulse" />
                    <div className="w-6 h-6 workspace-secondary-sidebar-bg rounded-full animate-pulse" />
                    <div className="h-4 w-16 workspace-secondary-sidebar-bg rounded animate-pulse" />
                    <div className="w-2 h-2 workspace-secondary-sidebar-bg rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If there are no statuses, show a create status option
  if (state.statuses.length === 0) {
    return (
      <div className="flex-1 overflow-auto p-3">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 workspace-secondary-sidebar-bg rounded-full flex items-center justify-center mx-auto">
              <Plus className="h-8 w-8 workspace-sidebar-text" />
            </div>
            <h3 className="text-lg font-medium workspace-sidebar-text">
              No statuses yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create your first status to start organizing tasks in your sprint.
            </p>
          </div>
          <Button onClick={onCreateStatus} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Status
          </Button>
        </div>
      </div>
    );
  }

  const tasksByStatusForList = tasksToRender
    .filter((task: any) => !task.parent_task_id)
    .reduce((acc: any, task: any) => {
      const statusId =
        task.status_id ||
        (state.statuses.length > 0 ? state.statuses[0].id : "unknown");
      if (!acc[statusId]) acc[statusId] = [];
      acc[statusId].push(task);
      return acc;
    }, {} as Record<string, any[]>);

  const handleCopyLink = (task: any) => {
    const taskUrl = `${window.location.origin}/${task.workspace_id}/task/${task.task_id}`;
    navigator.clipboard.writeText(taskUrl);
  };

  const getStatusIcon = (statusType: string | undefined, statusColor: any) => {
    console.log("statusType", statusType);
    switch (statusType?.toLowerCase()) {
      case "not-started":
        return (
          <CircleDashed
            className={`h-4 w-4 ${getStatusTextColor(statusColor)}`}
          />
        );
      case "active":
        return (
          <CirclePlay
            className={`h-4 w-4 ${getStatusTextColor(statusColor)}`}
          />
        );
      case "done":
        return (
          <CircleCheck
            className={`h-4 w-4 ${getStatusTextColor(statusColor)}`}
          />
        );
      case "closed":
        return (
          <XCircle className={`h-4 w-4 ${getStatusTextColor(statusColor)}`} />
        );
      default:
        return (
          <div
            className={`w-3 h-3 ${getStatusColor(statusColor)} rounded-full`}
          />
        );
    }
  };

  return (
    <div className="flex-1 overflow-auto p-3">
      <div className="space-y-3">
        {state.statuses.map((status: any) => {
          const statusTasks =
            tasksByStatusForList[status.id]?.filter(
              (t: any) => !t.deleted_at
            ) || [];
          const isCollapsed = state.collapsedStatuses.has(status.id);
          const isRenaming = state.renamingStatusId === status.id;
          const [statusNameInput, setStatusNameInput] = React.useState(
            status.name
          );

          React.useEffect(() => {
            if (!isRenaming) setStatusNameInput(status.name);
          }, [isRenaming, status.name]);

          const handleRenameBlur = () => {
            if (
              statusNameInput.trim() &&
              statusNameInput.trim() !== status.name
            ) {
              taskOperations.handleRenameStatus(
                status.id,
                statusNameInput.trim()
              );
            }
            updateState({ renamingStatusId: undefined });
          };

          const handleRenameKeyDown = (
            e: React.KeyboardEvent<HTMLInputElement>
          ) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            } else if (e.key === "Escape") {
              setStatusNameInput(status.name);
              updateState({ renamingStatusId: undefined });
            }
          };

          return (
            <div
              key={status.id}
              className="workspace-secondary-sidebar-bg rounded-lg border workspace-border"
            >
              <div className="flex items-center justify-between p-2 border-b workspace-border">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:workspace-hover"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newCollapsedStatuses = new Set(
                        state.collapsedStatuses
                      );
                      if (newCollapsedStatuses.has(status.id)) {
                        newCollapsedStatuses.delete(status.id);
                      } else {
                        newCollapsedStatuses.add(status.id);
                      }
                      updateState({ collapsedStatuses: newCollapsedStatuses });
                    }}
                  >
                    {state.collapsedStatuses.has(status.id) ? (
                      <ChevronRight className="h-4 w-4 workspace-sidebar-text" />
                    ) : (
                      <ChevronDown className="h-4 w-4 workspace-sidebar-text" />
                    )}
                  </Button>
                  {getStatusIcon(status.status_type?.name, status)}
                  {isRenaming ? (
                    <Input
                      value={statusNameInput}
                      onChange={(e) => setStatusNameInput(e.target.value)}
                      onBlur={handleRenameBlur}
                      onKeyDown={handleRenameKeyDown}
                      autoFocus
                      variant="workspace"
                      className="h-6 text-sm font-medium "
                      style={{ width: 120 }}
                    />
                  ) : (
                    <h3 className="font-medium workspace-sidebar-text">
                      {status.name}
                    </h3>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {statusTasks.length}
                  </Badge>

                  <Badge className={`text-xs ${getStatusColor(status)}`}>
                    {getStatusBadge(status)}
                  </Badge>
                </div>
              </div>
              {!isCollapsed && (
                <Table id={`status-content-${status.id}`}>
                  <TableHeader className="p-2 h-8">
                    <TableRow>
                      <TableHead className="w-7 workspace-sidebar-text text-xs p-2">
                        <Checkbox className="h-4 w-4 workspace-component-active-color border border-workspace-primary data-[state=checked]:workspace-primary data-[state=checked]:text-white" />
                      </TableHead>
                      <TableHead className="workspace-sidebar-text text-xs p-2">
                        Name
                      </TableHead>
                      {state.visibleColumns.has("assignee") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Assignee
                        </TableHead>
                      )}
                      {state.visibleColumns.has("dueDate") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Due date
                        </TableHead>
                      )}
                      {state.visibleColumns.has("priority") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Priority
                        </TableHead>
                      )}
                      {state.visibleColumns.has("subtasks") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Subtasks
                        </TableHead>
                      )}
                      {state.visibleColumns.has("createdAt") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Date created
                        </TableHead>
                      )}
                      {state.visibleColumns.has("sprints") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Sprints
                        </TableHead>
                      )}
                      {state.visibleColumns.has("sprintPoints") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Sprint points
                        </TableHead>
                      )}
                      {state.visibleColumns.has("createdBy") && (
                        <TableHead className="workspace-sidebar-text text-xs p-2">
                          Created by
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusTasks.map((task: any) => {
                      const subtasks = getTaskSubtasks(task.id);
                      const isExpanded = state.expandedTasks.has(task.id);

                      return (
                        <React.Fragment key={task.id}>
                          <TableRow className="cursor-pointer hover:workspace-hover h-8 text-xs">
                            <TableCell className="p-2">
                              <Checkbox className="h-4 w-4 workspace-component-active-color border border-workspace-primary data-[state=checked]:workspace-primary data-[state=checked]:text-white" />
                            </TableCell>
                            <TableCell
                              className="font-medium p-2 cursor-pointer hover:underline"
                              onClick={() => {
                                handleTaskClick(task);
                              }}
                            >
                              {task.name}
                            </TableCell>
                            {state.visibleColumns.has("assignee") && (
                              <TableCell className="p-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {task.assignee ? (
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={
                                              task.assignee?.avatar_url ??
                                              undefined
                                            }
                                            alt={
                                              task.assignee?.full_name || "User"
                                            }
                                          />
                                          <AvatarFallback className="text-xs workspace-component-bg workspace-component-active-color">
                                            {getAvatarInitials(
                                              task.assignee?.full_name,
                                              task.assignee?.email
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : task.assigned_member ? (
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={
                                              task.assigned_member?.profile
                                                ?.avatar_url ?? undefined
                                            }
                                            alt={
                                              task.assigned_member?.profile
                                                ?.full_name ||
                                              task.assigned_member?.name ||
                                              "User"
                                            }
                                          />
                                          <AvatarFallback className="text-xs workspace-component-bg workspace-component-active-color">
                                            {getAvatarInitials(
                                              task.assigned_member?.profile
                                                ?.full_name ||
                                                task.assigned_member?.name,
                                              task.assigned_member?.profile
                                                ?.email ||
                                                task.assigned_member?.email
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : (
                                        <div className="h-6 w-6 border workspace-border flex items-center justify-center rounded-sm">
                                          <CircleUserRound className="h-3 w-3 workspace-sidebar-text" />
                                        </div>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                      <CommandInput placeholder="Search user..." />
                                      <CommandList>
                                        <CommandEmpty>
                                          No users found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          <CommandItem
                                            onSelect={() =>
                                              taskOperations.handleAssignTask(
                                                task.id,
                                                null
                                              )
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center justify-between cursor-pointer text-xs"
                                          >
                                            <span className="text-xs">
                                              Unassign
                                            </span>
                                            {!task.assignee_id &&
                                              !task.assigned_member_id && (
                                                <CheckIcon className="ml-auto h-4 w-4" />
                                              )}
                                          </CommandItem>

                                          {/* Workspace Members */}
                                          {state.workspaceMembers.length >
                                            0 && (
                                            <>
                                              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                                Workspace Members
                                              </div>
                                              {state.workspaceMembers.map(
                                                (member: any) => (
                                                  <CommandItem
                                                    key={`profile-${member.id}`}
                                                    onSelect={() =>
                                                      taskOperations.handleAssignTask(
                                                        task.id,
                                                        member.id
                                                      )
                                                    }
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                    className="flex items-center justify-between text-xs cursor-pointer"
                                                  >
                                                    <div className="flex items-center space-x-2">
                                                      <Avatar className="h-6 w-6">
                                                        <AvatarImage
                                                          src={
                                                            member.avatar_url
                                                          }
                                                          alt={
                                                            member.full_name ||
                                                            "User"
                                                          }
                                                        />
                                                        <AvatarFallback className="text-xs">
                                                          {getAvatarInitials(
                                                            member.full_name,
                                                            member.email
                                                          )}
                                                        </AvatarFallback>
                                                      </Avatar>
                                                      <span className="text-xs">
                                                        {member.full_name}
                                                      </span>
                                                    </div>
                                                    {task.assignee_id ===
                                                      member.id && (
                                                      <CheckIcon className="ml-auto h-4 w-4" />
                                                    )}
                                                  </CommandItem>
                                                )
                                              )}
                                            </>
                                          )}

                                          {/* Team Members */}
                                          {state.teamMembers &&
                                          state.teamMembers.length > 0 ? (
                                            <>
                                              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                                Team Members (
                                                {state.teamMembers.length})
                                              </div>
                                              {state.teamMembers.map(
                                                (member: any) => {
                                                  console.log(
                                                    "ListView rendering team member:",
                                                    member
                                                  );
                                                  return (
                                                    <CommandItem
                                                      key={`team-${member.id}`}
                                                      onSelect={() =>
                                                        taskOperations.handleAssignTask(
                                                          task.id,
                                                          `team-${member.id}`
                                                        )
                                                      }
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                      className="flex items-center justify-between text-xs cursor-pointer"
                                                    >
                                                      <div className="flex items-center space-x-2">
                                                        <Avatar className="h-6 w-6">
                                                          <AvatarImage
                                                            src={
                                                              member.profile
                                                                ?.avatar_url ??
                                                              undefined
                                                            }
                                                            alt={
                                                              member.profile
                                                                ?.full_name ||
                                                              member.name ||
                                                              "User"
                                                            }
                                                          />
                                                          <AvatarFallback className="text-xs">
                                                            {getAvatarInitials(
                                                              member.profile
                                                                ?.full_name ||
                                                                member.name,
                                                              member.profile
                                                                ?.email ||
                                                                member.email
                                                            )}
                                                          </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                          <span className="text-xs">
                                                            {member.profile
                                                              ?.full_name ||
                                                              member.name}
                                                          </span>
                                                        </div>
                                                      </div>
                                                      {task.assigned_member_id ===
                                                        member.id && (
                                                        <CheckIcon className="ml-auto h-4 w-4" />
                                                      )}
                                                    </CommandItem>
                                                  );
                                                }
                                              )}
                                            </>
                                          ) : (
                                            <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                              No team members available
                                              (teamMembers:{" "}
                                              {state.teamMembers?.length || 0})
                                            </div>
                                          )}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </TableCell>
                            )}
                            {state.visibleColumns.has("dueDate") && (
                              <TableCell className="p-2 flex items-center">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-6 w-auto p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm "
                                    >
                                      <div className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 workspace-sidebar-text" />
                                        <span
                                          className={`workspace-sidebar-text ${
                                            task.due_date || task.start_date
                                              ? "ml-1"
                                              : ""
                                          }`}
                                        >
                                          {formatDateRange(
                                            task.start_date || undefined,
                                            task.due_date || undefined
                                          )}
                                        </span>
                                      </div>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="p-3">
                                      <div className="space-y-4">
                                        <DatePicker
                                          startDate={task.start_date}
                                          dueDate={task.due_date}
                                          onDateChange={(startDate, dueDate) =>
                                            taskOperations.handleUpdateDates(
                                              task.id,
                                              startDate,
                                              dueDate
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </TableCell>
                            )}
                            {state.visibleColumns.has("priority") && (
                              <TableCell className="p-2">
                                {task.priority ? (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-6 w-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm"
                                      >
                                        <Goal
                                          className={`w-4 h-4 ${
                                            priorityConfig[
                                              task.priority as keyof typeof priorityConfig
                                            ]?.color
                                          }`}
                                        />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                      <Command>
                                        <CommandInput placeholder="Set priority..." />
                                        <CommandList>
                                          <CommandEmpty>
                                            No priority found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            <CommandItem
                                              onSelect={() =>
                                                taskOperations.handleUpdatePriority(
                                                  task.id,
                                                  null
                                                )
                                              }
                                              className="flex items-center justify-between"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <span>No priority</span>
                                              {!task.priority && (
                                                <CheckIcon className="ml-auto h-4 w-4" />
                                              )}
                                            </CommandItem>
                                            {Object.entries(priorityConfig).map(
                                              ([key, config]) => (
                                                <CommandItem
                                                  key={key}
                                                  onSelect={() =>
                                                    taskOperations.handleUpdatePriority(
                                                      task.id,
                                                      key
                                                    )
                                                  }
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  className="flex items-center justify-between"
                                                >
                                                  <div className="flex items-center">
                                                    <Goal
                                                      className={`h-4 w-4 mr-2 ${config.color}`}
                                                    />
                                                    <span>{config.label}</span>
                                                  </div>
                                                  {task.priority === key && (
                                                    <CheckIcon className="ml-auto h-4 w-4" />
                                                  )}
                                                </CommandItem>
                                              )
                                            )}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm"
                                    onClick={() =>
                                      taskOperations.handleUpdatePriority(
                                        task.id,
                                        "medium"
                                      )
                                    }
                                  >
                                    <Goal className="w-4 h-4 workspace-sidebar-text" />
                                  </Button>
                                )}
                              </TableCell>
                            )}
                            {state.visibleColumns.has("subtasks") && (
                              <TableCell className="p-2">
                                {subtasks.length > 0 && (
                                  <button
                                    className="flex items-center text-xs workspace-sidebar-text"
                                    onClick={(e) =>
                                      toggleTaskExpansion(task.id, e)
                                    }
                                  >
                                    <span>{subtasks.length} subtasks</span>
                                    {isExpanded ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </button>
                                )}
                              </TableCell>
                            )}
                            {state.visibleColumns.has("createdAt") && (
                              <TableCell className="p-2">
                                {task.created_at &&
                                  format(
                                    parseISO(task.created_at),
                                    "MMM d, yyyy"
                                  )}
                              </TableCell>
                            )}
                            {state.visibleColumns.has("sprints") && (
                              <TableCell className="p-2">
                                <Badge variant="outline">Sprint 1</Badge>
                              </TableCell>
                            )}
                            {state.visibleColumns.has("sprintPoints") && (
                              <TableCell className="p-2">
                                <span>5 pts</span>
                              </TableCell>
                            )}
                            {state.visibleColumns.has("createdBy") && (
                              <TableCell className="p-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  {task.created_by_profile ? (
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={
                                          task.created_by_profile?.avatar_url ??
                                          undefined
                                        }
                                        alt={
                                          task.created_by_profile?.full_name ||
                                          "User"
                                        }
                                      />
                                      <AvatarFallback className="text-xs workspace-component-bg workspace-component-active-color">
                                        {getAvatarInitials(
                                          task.created_by_profile?.full_name,
                                          task.created_by_profile?.email
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <div className="h-6 w-6 border workspace-border flex items-center justify-center rounded-sm">
                                      <CircleUserRound className="h-3 w-3 workspace-sidebar-text" />
                                    </div>
                                  )}
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>

                          {isExpanded &&
                            subtasks.map((subtask: any) => (
                              <TableRow
                                key={subtask.id}
                                className="cursor-pointer text-xs workspace-sidebar-text h-8 hover:workspace-hover"
                                onClick={() => handleTaskClick(subtask)}
                              >
                                <TableCell className="p-2"></TableCell>
                                <TableCell className="pl-8 flex items-center text-xs workspace-sidebar-text p-2">
                                  <GitBranch className="h-4 w-4 mr-2" />
                                  {subtask.name}
                                </TableCell>
                                {state.visibleColumns.has("assignee") && (
                                  <TableCell className="p-2">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                        >
                                          {subtask.assignee ? (
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={
                                                  subtask.assignee
                                                    ?.avatar_url ?? undefined
                                                }
                                                alt={
                                                  subtask.assignee?.full_name ||
                                                  "User"
                                                }
                                              />
                                              <AvatarFallback className="text-xs workspace-component-bg workspace-component-active-color">
                                                {getAvatarInitials(
                                                  subtask.assignee?.full_name,
                                                  subtask.assignee?.email
                                                )}
                                              </AvatarFallback>
                                            </Avatar>
                                          ) : subtask.assigned_member ? (
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={
                                                  subtask.assigned_member
                                                    ?.profile?.avatar_url ??
                                                  undefined
                                                }
                                                alt={
                                                  subtask.assigned_member
                                                    ?.profile?.full_name ||
                                                  subtask.assigned_member
                                                    ?.name ||
                                                  "User"
                                                }
                                              />
                                              <AvatarFallback className="text-xs workspace-component-bg workspace-component-active-color">
                                                {getAvatarInitials(
                                                  subtask.assigned_member
                                                    ?.profile?.full_name ||
                                                    subtask.assigned_member
                                                      ?.name,
                                                  subtask.assigned_member
                                                    ?.profile?.email ||
                                                    subtask.assigned_member
                                                      ?.email
                                                )}
                                              </AvatarFallback>
                                            </Avatar>
                                          ) : (
                                            <div className="h-6 w-6 border workspace-border flex items-center justify-center rounded-sm">
                                              <CircleUserRound className="h-3 w-3 workspace-sidebar-text" />
                                            </div>
                                          )}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                          <CommandInput placeholder="Search user..." />
                                          <CommandList>
                                            <CommandEmpty>
                                              No users found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              <CommandItem
                                                onSelect={() =>
                                                  taskOperations.handleAssignTask(
                                                    subtask.id,
                                                    null
                                                  )
                                                }
                                                className="flex items-center justify-between"
                                              >
                                                <span>Unassign</span>
                                                {!subtask.assignee_id &&
                                                  !subtask.assigned_member_id && (
                                                    <CheckIcon className="ml-auto h-4 w-4" />
                                                  )}
                                              </CommandItem>

                                              {/* Workspace Members */}
                                              {state.workspaceMembers.length >
                                                0 && (
                                                <>
                                                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                                    Workspace Members
                                                  </div>
                                                  {state.workspaceMembers.map(
                                                    (member: any) => (
                                                      <CommandItem
                                                        key={`profile-${member.id}`}
                                                        onSelect={() =>
                                                          taskOperations.handleAssignTask(
                                                            subtask.id,
                                                            member.id
                                                          )
                                                        }
                                                        className="flex items-center justify-between"
                                                      >
                                                        <div className="flex items-center space-x-2">
                                                          <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="text-xs">
                                                              {getAvatarInitials(
                                                                member.full_name,
                                                                member.email
                                                              )}
                                                            </AvatarFallback>
                                                          </Avatar>
                                                          <span>
                                                            {member.full_name}
                                                          </span>
                                                        </div>
                                                        {subtask.assignee_id ===
                                                          member.id && (
                                                          <CheckIcon className="ml-auto h-4 w-4" />
                                                        )}
                                                      </CommandItem>
                                                    )
                                                  )}
                                                </>
                                              )}

                                              {/* Team Members */}
                                              {state.teamMembers &&
                                              state.teamMembers.length > 0 ? (
                                                <>
                                                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                                    Team Members (
                                                    {state.teamMembers.length})
                                                  </div>
                                                  {state.teamMembers.map(
                                                    (member: any) => {
                                                      console.log(
                                                        "ListView subtask rendering team member:",
                                                        member
                                                      );
                                                      return (
                                                        <CommandItem
                                                          key={`team-${member.id}`}
                                                          onSelect={() =>
                                                            taskOperations.handleAssignTask(
                                                              subtask.id,
                                                              `team-${member.id}`
                                                            )
                                                          }
                                                          className="flex items-center justify-between"
                                                        >
                                                          <div className="flex items-center space-x-2">
                                                            <Avatar className="h-6 w-6">
                                                              <AvatarImage
                                                                src={
                                                                  member.profile
                                                                    ?.avatar_url ??
                                                                  undefined
                                                                }
                                                                alt={
                                                                  member.profile
                                                                    ?.full_name ||
                                                                  member.name ||
                                                                  "User"
                                                                }
                                                              />
                                                              <AvatarFallback className="text-xs">
                                                                {getAvatarInitials(
                                                                  member.profile
                                                                    ?.full_name ||
                                                                    member.name,
                                                                  member.profile
                                                                    ?.email ||
                                                                    member.email
                                                                )}
                                                              </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                              <span className="text-sm">
                                                                {member.profile
                                                                  ?.full_name ||
                                                                  member.name}
                                                              </span>
                                                              <span className="text-xs text-muted-foreground">
                                                                {
                                                                  member.role
                                                                    ?.name
                                                                }{" "}
                                                                •{" "}
                                                                {
                                                                  member.level
                                                                    ?.name
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>
                                                          {subtask.assigned_member_id ===
                                                            member.id && (
                                                            <CheckIcon className="ml-auto h-4 w-4" />
                                                          )}
                                                        </CommandItem>
                                                      );
                                                    }
                                                  )}
                                                </>
                                              ) : (
                                                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                                  No team members available
                                                  (teamMembers:{" "}
                                                  {state.teamMembers?.length ||
                                                    0}
                                                  )
                                                </div>
                                              )}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                  </TableCell>
                                )}
                                {state.visibleColumns.has("dueDate") && (
                                  <TableCell className="text-xs p-2">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-auto p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm "
                                        >
                                          <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4 workspace-sidebar-text" />
                                            <span className="workspace-sidebar-text">
                                              {formatDateRange(
                                                subtask.start_date || undefined,
                                                subtask.due_date || undefined
                                              )}
                                            </span>
                                          </div>
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <div className="p-3">
                                          <div className="space-y-4">
                                            <DatePicker
                                              startDate={subtask.start_date}
                                              dueDate={subtask.due_date}
                                              onDateChange={(
                                                startDate,
                                                dueDate
                                              ) =>
                                                taskOperations.handleUpdateDates(
                                                  subtask.id,
                                                  startDate,
                                                  dueDate
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </TableCell>
                                )}
                                {state.visibleColumns.has("priority") && (
                                  <TableCell className="p-2">
                                    {subtask.priority ? (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-1 flex items-center justify-center text-xs hover:workspace-hover border workspace-border rounded-sm"
                                          >
                                            <Goal
                                              className={`w-4 h-4 ${
                                                priorityConfig[
                                                  subtask.priority as keyof typeof priorityConfig
                                                ]?.color
                                              }`}
                                            />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                          <Command>
                                            <CommandInput placeholder="Set priority..." />
                                            <CommandList>
                                              <CommandEmpty>
                                                No priority found.
                                              </CommandEmpty>
                                              <CommandGroup>
                                                <CommandItem
                                                  onSelect={() =>
                                                    taskOperations.handleUpdatePriority(
                                                      subtask.id,
                                                      null
                                                    )
                                                  }
                                                  className="flex items-center justify-between"
                                                >
                                                  <span>No priority</span>
                                                  {!subtask.priority && (
                                                    <CheckIcon className="ml-auto h-4 w-4" />
                                                  )}
                                                </CommandItem>
                                                {Object.entries(
                                                  priorityConfig
                                                ).map(([key, config]) => (
                                                  <CommandItem
                                                    key={key}
                                                    onSelect={() =>
                                                      taskOperations.handleUpdatePriority(
                                                        subtask.id,
                                                        key
                                                      )
                                                    }
                                                    className="flex items-center justify-between"
                                                  >
                                                    <div className="flex items-center">
                                                      <Goal
                                                        className={`h-4 w-4 mr-2 ${config.color}`}
                                                      />
                                                      <span>
                                                        {config.label}
                                                      </span>
                                                    </div>
                                                    {subtask.priority ===
                                                      key && (
                                                      <CheckIcon className="ml-auto h-4 w-4" />
                                                    )}
                                                  </CommandItem>
                                                ))}
                                              </CommandGroup>
                                            </CommandList>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-xs hover:workspace-hover"
                                        onClick={() =>
                                          taskOperations.handleUpdatePriority(
                                            subtask.id,
                                            "medium"
                                          )
                                        }
                                      >
                                        <Goal className="w-4 h-4 workspace-sidebar-text" />
                                      </Button>
                                    )}
                                  </TableCell>
                                )}
                                {state.visibleColumns.has("subtasks") && (
                                  <TableCell className="p-2"></TableCell>
                                )}
                                {state.visibleColumns.has("createdAt") && (
                                  <TableCell className="p-2">
                                    {subtask.created_at &&
                                      format(
                                        parseISO(subtask.created_at),
                                        "MMM d, yyyy"
                                      )}
                                  </TableCell>
                                )}
                                {state.visibleColumns.has("sprints") && (
                                  <TableCell className="p-2">
                                    <Badge variant="outline">Sprint 1</Badge>
                                  </TableCell>
                                )}
                                {state.visibleColumns.has("sprintPoints") && (
                                  <TableCell className="p-2">
                                    <span>3 pts</span>
                                  </TableCell>
                                )}
                                {state.visibleColumns.has("createdBy") && (
                                  <TableCell className="p-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      {subtask.created_by_profile ? (
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={
                                              subtask.created_by_profile
                                                ?.avatar_url ?? undefined
                                            }
                                            alt={
                                              subtask.created_by_profile
                                                ?.full_name || "User"
                                            }
                                          />
                                          <AvatarFallback className="text-xs workspace-component-bg workspace-component-active-color">
                                            {getAvatarInitials(
                                              subtask.created_by_profile
                                                ?.full_name,
                                              subtask.created_by_profile?.email
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : (
                                        <div className="h-6 w-6 border workspace-border flex items-center justify-center rounded-sm">
                                          <CircleUserRound className="h-3 w-3 workspace-sidebar-text" />
                                        </div>
                                      )}
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                        </React.Fragment>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={100} className="p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-xs hover:workspace-hover"
                          onClick={() =>
                            updateState({ createTaskModalOpen: true })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

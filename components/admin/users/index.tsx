"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LoadingOverlay } from "@/components/ui/loading-page";
import {
  MoreHorizontal,
  UserCheck,
  UserX,
  Settings,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  created_at: string;
  allowed: boolean;
  avatar_url?: string;
  role: string;
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [pendingAllowed, setPendingAllowed] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(
    new Set()
  );
  const { toast } = useToast();

  const roles = ["admin", "user", "investor"];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filter && filter !== "all") params.append("filter", filter);
    params.append("page", String(page));
    params.append("limit", String(pageSize));
    params.append("sort", sortField);
    params.append("order", sortDirection);
    params.append("_t", String(Date.now())); // Cache busting

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();

    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, filter, page, pageSize, sortField, sortDirection]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1); // Reset to first page when sorting
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

  const handleToggleAllowed = async (id: string, allowed: boolean) => {
    // Add user to processing set
    setProcessingUsers((prev) => new Set(prev).add(id));

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, allowed }),
      });

      if (response.ok) {
        // Show success message
        if (allowed) {
          toast({
            title: "Access Granted",
            description:
              "User access has been granted and approval email sent.",
            variant: "default",
          });
        } else {
          toast({
            title: "Access Revoked",
            description: "User access has been revoked.",
            variant: "default",
          });
        }

        // Refresh the users list
        await fetchUsers();
      } else {
        toast({
          title: "Error",
          description: "Failed to update user access.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user access:", error);
      toast({
        title: "Error",
        description: "Failed to update user access.",
        variant: "destructive",
      });
    } finally {
      // Remove user from processing set
      setProcessingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    // Add user to processing set
    setProcessingUsers((prev) => new Set(prev).add(id));

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });

      if (response.ok) {
        toast({
          title: "Role Updated",
          description: "User role has been updated successfully.",
          variant: "default",
        });

        // Refresh the users list
        await fetchUsers();
      } else {
        toast({
          title: "Error",
          description: "Failed to update user role.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    } finally {
      // Remove user from processing set
      setProcessingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRequestToggleAllowed = (user: User, allowed: boolean) => {
    setPendingUser(user);
    setPendingAllowed(allowed);
    setShowConfirmDialog(true);
  };

  const handleConfirmToggleAllowed = async () => {
    if (pendingUser) {
      await handleToggleAllowed(pendingUser.id, pendingAllowed);
      setPendingUser(null);
      setShowConfirmDialog(false);
    }
  };

  const isProcessing = (userId: string) => processingUsers.has(userId);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground text-sm">SprintiQ users overview</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="allowed">Allowed</SelectItem>
            <SelectItem value="not_allowed">Not Allowed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative rounded-xl p-0 md:p-6 shadow-lg border workspace-border overflow-x-auto">
        {loading && <LoadingOverlay />}
        <table className="min-w-full text-sm">
          <thead>
            <tr className="workspace-sidebar-text">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => {
                    handleSort("name");
                  }}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  User {getSortIcon("name")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => {
                    handleSort("email");
                  }}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Email {getSortIcon("email")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => {
                    handleSort("company");
                  }}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Company {getSortIcon("company")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => {
                    handleSort("role");
                  }}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Role {getSortIcon("role")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => {
                    handleSort("created_at");
                  }}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Created At {getSortIcon("created_at")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => {
                    handleSort("allowed");
                  }}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Allowed {getSortIcon("allowed")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-t workspace-border hover:workspace-hover cursor-pointer transition-colors group ${
                  isProcessing(user.id) ? "opacity-60" : ""
                }`}
              >
                <td className="px-4 py-3 flex items-center gap-3 min-w-[180px]">
                  <Avatar className="group-hover:scale-105 duration-300">
                    {user.avatar_url ? (
                      <AvatarImage src={user.avatar_url} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-bold">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="font-semibold workspace-sidebar-text group-hover:scale-105 duration-300 transition-colors">
                    {user.name}
                  </span>
                </td>
                <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                  {user.email}
                </td>
                <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                  {user.company || "-"}
                </td>
                <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                  <Select
                    value={user.role}
                    onValueChange={(newRole) =>
                      handleUpdateRole(user.id, newRole)
                    }
                    disabled={isProcessing(user.id)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                  {new Date(user.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      user.allowed
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    }`}
                  >
                    {user.allowed ? "Allowed" : "Not Allowed"}
                  </span>
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isProcessing(user.id)}
                      >
                        {isProcessing(user.id) ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          handleRequestToggleAllowed(user, !user.allowed)
                        }
                        disabled={isProcessing(user.id)}
                      >
                        {user.allowed ? (
                          <>
                            <UserX className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              {isProcessing(user.id)
                                ? "Processing..."
                                : "Revoke Access"}
                            </span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">
                              {isProcessing(user.id)
                                ? "Processing..."
                                : "Allow Access"}
                            </span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">User Settings</span>
                      </DropdownMenuItem>
                      {/* Future actions can be added here */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <div className="text-center workspace-sidebar-text py-12">
            No users found.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} results
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {/* Page numbers logic */}
            {Array.from({ length: Math.ceil(total / pageSize) }).map((_, i) => {
              // Show first, last, current, and neighbors; ellipsis for gaps
              const pageNum = i + 1;
              const isCurrent = pageNum === page;
              const show =
                pageNum === 1 ||
                pageNum === Math.ceil(total / pageSize) ||
                Math.abs(pageNum - page) <= 1;
              if (
                !show &&
                ((pageNum === 2 && page > 3) ||
                  (pageNum === Math.ceil(total / pageSize) - 1 &&
                    page < Math.ceil(total / pageSize) - 2))
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
                      setPage(pageNum);
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
                  if (page < Math.ceil(total / pageSize)) setPage(page + 1);
                }}
                className={
                  page === Math.ceil(total / pageSize)
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingUser && pendingUser.allowed
                ? "Revoke Access"
                : "Allow Access"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {pendingUser && pendingUser.allowed ? "revoke" : "allow"} access
              for <span className="font-semibold">{pendingUser?.name}</span>?
              {!pendingUser?.allowed && (
                <span className="block mt-2 text-sm text-emerald-600">
                  An approval email will be sent to the user.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPendingUser(null);
                setShowConfirmDialog(false);
              }}
              disabled={isProcessing(pendingUser?.id || "")}
            >
              Cancel
            </Button>
            <Button
              variant={
                pendingUser && pendingUser.allowed ? "destructive" : "default"
              }
              onClick={handleConfirmToggleAllowed}
              disabled={isProcessing(pendingUser?.id || "")}
            >
              {isProcessing(pendingUser?.id || "") ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

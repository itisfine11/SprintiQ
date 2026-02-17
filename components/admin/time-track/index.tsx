"use client";
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const PAGE_SIZE = 10;

function unique<T>(arr: T[], key: keyof T): string[] {
  return Array.from(new Set(arr.map((item) => String(item[key])))).filter(
    Boolean
  );
}

export default function TimeTrackTable({
  sessions,
  userMap,
}: {
  sessions: Array<Record<string, any>>;
  userMap: Record<
    string,
    { full_name: string | null; avatar_url: string | null }
  >;
}) {
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("all");
  const [method, setMethod] = useState("all");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtering, search, and sorting
  const filtered = useMemo(() => {
    let data = sessions;

    // Apply filters
    if (eventType !== "all")
      data = data.filter((row) => row.event_type === eventType);
    if (method !== "all") data = data.filter((row) => row.method === method);

    // Apply search
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (row) =>
          (row.feature && row.feature.toLowerCase().includes(s)) ||
          (row.event_type && row.event_type.toLowerCase().includes(s)) ||
          (row.method && row.method.toLowerCase().includes(s)) ||
          (row.user_id && row.user_id.toLowerCase().includes(s)) ||
          (row.session_id && row.session_id.toLowerCase().includes(s))
      );
    }

    // Sort data
    data.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "user_id":
          const userA = userMap[a.user_id];
          const userB = userMap[b.user_id];
          aValue = (userA?.full_name || a.user_id || "").toLowerCase();
          bValue = (userB?.full_name || b.user_id || "").toLowerCase();
          break;
        case "event_type":
          aValue = (a.event_type || "").toLowerCase();
          bValue = (b.event_type || "").toLowerCase();
          break;
        case "method":
          aValue = (a.method || "").toLowerCase();
          bValue = (b.method || "").toLowerCase();
          break;
        case "story_count":
          aValue = a.story_count || 0;
          bValue = b.story_count || 0;
          break;
        case "feature":
          aValue = (a.feature || "").toLowerCase();
          bValue = (b.feature || "").toLowerCase();
          break;
        case "complexity":
          aValue = (a.complexity || "").toLowerCase();
          bValue = (b.complexity || "").toLowerCase();
          break;
        case "team_size":
          aValue = a.team_size || 0;
          bValue = b.team_size || 0;
          break;
        case "timestamp":
          aValue = a.timestamp || 0;
          bValue = b.timestamp || 0;
          break;
        case "created_at":
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        default:
          aValue = a[sortField] || "";
          bValue = b[sortField] || "";
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return data;
  }, [sessions, search, eventType, method, sortField, sortDirection, userMap]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Dropdown options
  const eventTypes: string[] = useMemo(
    () => unique(sessions, "event_type"),
    [sessions]
  );
  const methods: string[] = useMemo(
    () => unique(sessions, "method"),
    [sessions]
  );

  // Reset page on filter/search/sort change
  React.useEffect(() => {
    setPage(1);
  }, [search, eventType, method, sortField, sortDirection]);

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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Time Tracking</h1>
        <p className="text-muted-foreground text-sm">
          All tracked story/sprint generation sessions
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search feature, event type, method, user, session..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Event Types</SelectItem>
            {eventTypes.map((et) => (
              <SelectItem key={et as string} value={et as string}>
                {et as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {methods.map((m) => (
              <SelectItem key={m as string} value={m as string}>
                {m as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="relative rounded-xl p-0 md:p-6 shadow-lg border workspace-border overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="workspace-sidebar-text">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("user_id")}
                  className="flex items-center gap-1"
                >
                  User {getSortIcon("user_id")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("event_type")}
                  className="flex items-center gap-1"
                >
                  Event Type {getSortIcon("event_type")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("method")}
                  className="flex items-center gap-1"
                >
                  Method {getSortIcon("method")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("story_count")}
                  className="flex items-center gap-1"
                >
                  Story Count {getSortIcon("story_count")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("feature")}
                  className="flex items-center gap-1"
                >
                  Description {getSortIcon("feature")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("complexity")}
                  className="flex items-center gap-1"
                >
                  Complexity {getSortIcon("complexity")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("team_size")}
                  className="flex items-center gap-1"
                >
                  Team Size {getSortIcon("team_size")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("timestamp")}
                  className="flex items-center gap-1"
                >
                  Timestamp (ms) {getSortIcon("timestamp")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1"
                >
                  Created At {getSortIcon("created_at")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((row, i) => {
                const user = userMap[row.user_id] || null;
                return (
                  <tr
                    key={row.id as string}
                    className={
                      "border-t workspace-border hover:workspace-hover cursor-pointer transition-colors group" +
                      (i % 2 === 0 ? " bg-white" : " bg-gray-50")
                    }
                  >
                    <td className="px-4 py-3 min-w-[180px] flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        {user?.avatar_url ? (
                          <AvatarImage
                            src={user.avatar_url}
                            alt={user.full_name || row.user_id}
                          />
                        ) : (
                          <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-bold">
                            {user?.full_name
                              ? user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : row.user_id.slice(0, 2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-semibold workspace-sidebar-text">
                        {user?.full_name || row.user_id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{row.event_type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          row.method === "manual" ? "destructive" : "default"
                        }
                      >
                        {row.method}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.story_count}
                    </td>
                    <td
                      className="px-4 py-3 max-w-xs truncate"
                      title={row.feature}
                    >
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.complexity}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.team_size}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {row.timestamp}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-3 py-6 text-center workspace-sidebar-text"
                >
                  No time tracking sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {paged.length === 0 && (
          <div className="text-center workspace-sidebar-text py-12">
            No time tracking sessions found.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
          results
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
            {Array.from({ length: totalPages }).map((_, i) => {
              // Show first, last, current, and neighbors; ellipsis for gaps
              const pageNum = i + 1;
              const isCurrent = pageNum === page;
              const show =
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - page) <= 1;
              if (
                !show &&
                ((pageNum === 2 && page > 3) ||
                  (pageNum === totalPages - 1 && page < totalPages - 2))
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
                  if (page < totalPages) setPage(page + 1);
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

"use client";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Mail,
  Calendar,
  Building2,
  User,
  Mails,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  created_at: string;
}

interface AdminEmailsTableProps {
  messages: ContactMessage[];
  error: string | null;
}

const PAGE_SIZE = 20;

export default function AdminEmailsTable({
  messages,
  error,
}: AdminEmailsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const pageSize = PAGE_SIZE;

  // Filtered and sorted messages
  const filtered = useMemo(() => {
    let filtered = messages;

    // Search filter
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.first_name.toLowerCase().includes(s) ||
          msg.last_name.toLowerCase().includes(s) ||
          msg.email.toLowerCase().includes(s) ||
          (msg.company && msg.company.toLowerCase().includes(s)) ||
          msg.subject.toLowerCase().includes(s)
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "company":
          aValue = (a.company || "").toLowerCase();
          bValue = (b.company || "").toLowerCase();
          break;
        case "subject":
          aValue = a.subject.toLowerCase();
          bValue = b.subject.toLowerCase();
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a[sortField as keyof typeof a] || "";
          bValue = b[sortField as keyof typeof b] || "";
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [messages, search, sortField, sortDirection]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset page on search or sort change
  useEffect(() => {
    setPage(1);
  }, [search, sortField, sortDirection]);

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
        <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
        <p className="text-muted-foreground text-sm">
          Contact form messages from users
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search name, email, subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
      </div>
      <div className="relative rounded-xl p-0 md:p-6 shadow-lg border workspace-border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="workspace-sidebar-text">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1"
                >
                  Name {getSortIcon("name")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-1"
                >
                  Email {getSortIcon("email")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("company")}
                  className="flex items-center gap-1"
                >
                  Company {getSortIcon("company")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("subject")}
                  className="flex items-center gap-1"
                >
                  Subject {getSortIcon("subject")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1"
                >
                  Created At {getSortIcon("created_at")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((msg) => (
              <tr
                key={msg.id}
                className="border-t workspace-border hover:workspace-hover cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 min-w-[120px] workspace-sidebar-text group-hover:scale-105 duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-500" />{" "}
                    </div>
                    {msg.first_name} {msg.last_name}
                  </div>
                </td>
                <td className="px-4 py-3 min-w-[160px] workspace-sidebar-text group-hover:scale-105 duration-300">
                  {msg.email}
                </td>
                <td className="px-4 py-3 min-w-[120px] workspace-sidebar-text group-hover:scale-105 duration-300">
                  {msg.company}
                </td>
                <td className="px-4 py-3 min-w-[120px] workspace-sidebar-text group-hover:scale-105 duration-300">
                  {msg.subject}
                </td>
                <td
                  className="px-4 py-3 max-w-xs truncate workspace-sidebar-text group-hover:scale-105 duration-300"
                  title={msg.message}
                >
                  {msg.message}
                </td>
                <td className="px-4 py-3 min-w-[140px] workspace-sidebar-text group-hover:scale-105 duration-300">
                  {new Date(msg.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Dialog
                    open={selected?.id === msg.id}
                    onOpenChange={(open) => setSelected(open ? msg : null)}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg w-full">
                      <DialogHeader>
                        <DialogTitle className="text-base mb-1">
                          Contact Message
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(msg.created_at).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="w-4 h-4 text-muted-foreground" />{" "}
                            Name
                          </div>
                          <div className="font-semibold text-xs">
                            {msg.first_name} {msg.last_name}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 className="w-4 h-4 text-muted-foreground" />{" "}
                            Company
                          </div>
                          <div className="font-medium text-xs">
                            {msg.company}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="w-4 h-4 text-muted-foreground" />{" "}
                            Email
                          </div>
                          <div className=" font-medium text-xs">
                            <span>{msg.email}</span>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Mails className="w-4 h-4 text-muted-foreground" />{" "}
                            Subject
                          </div>
                          <div className="font-semibold text-xs mb-1">
                            {msg.subject}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-xs text-muted-foreground mb-1">
                            Message
                          </div>
                          <div className="rounded-md border bg-muted p-3 max-h-60 overflow-auto whitespace-pre-line break-words text-xs">
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, total)} of {total} results
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => {
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
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
      </div>
    </>
  );
}

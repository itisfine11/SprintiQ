"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  User,
  Clock,
  Tag,
  Link as LinkIcon,
  Image as ImageIcon,
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
import { Switch } from "@/components/ui/switch";
import { Insight } from "@/lib/database.types";
import { ImageUpload } from "@/components/ui/image-upload";
import { TextEditor } from "@/components/ui/text-editor";

interface LinkData {
  type: string;
  url: string;
}

interface InsightFormData {
  title: string;
  description: string;
  post_image: string;
  category: string;
  tags: string[];
  author: string;
  read_time: string;
  featured: boolean;
  published: boolean;
  post_date: string;
  links: LinkData[];
}

const categories = [
  "AI & Automation",
  "Team Management",
  "Estimation",
  "Integrations",
  "Psychology",
  "Remote Work",
  "Agile",
  "Productivity",
  "Leadership",
];

const linkTypes = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
  "Medium",
  "YouTube",
  "GitHub",
  "Website",
  "Blog",
  "Other",
];

export default function AdminInsightsClient() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [formData, setFormData] = useState<InsightFormData>({
    title: "",
    description: "",
    post_image: "",
    category: "",
    tags: [],
    author: "",
    read_time: "",
    featured: false,
    published: true,
    post_date: new Date().toISOString().split("T")[0],
    links: [],
  });

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filter && filter !== "all") params.append("filter", filter);
    params.append("page", String(page));
    params.append("limit", String(pageSize));
    params.append("sort", sortField);
    params.append("order", sortDirection);
    const res = await fetch(`/api/admin/insights?${params.toString()}`);
    const data = await res.json();
    setInsights(data.insights || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, filter, page, sortField, sortDirection, pageSize]);

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line
  }, [fetchInsights]);

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

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowCreateDialog(false);
      resetForm();
      fetchInsights();
    } catch (error) {
      console.error("Error creating insight:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedInsight) return;
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/insights/${selectedInsight.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowEditDialog(false);
      setSelectedInsight(null);
      resetForm();
      fetchInsights();
    } catch (error) {
      console.error("Error updating insight:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedInsight) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/admin/insights/${selectedInsight.id}`, {
        method: "DELETE",
      });
      setShowDeleteDialog(false);
      setSelectedInsight(null);
      fetchInsights();
    } catch (error) {
      console.error("Error deleting insight:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (insight: Insight) => {
    setSelectedInsight(insight);
    setFormData({
      title: insight.title,
      description: insight.description,
      post_image: insight.post_image || "",
      category: insight.category,
      tags: insight.tags || [],
      author: insight.author || "",
      read_time: insight.read_time || "",
      featured: insight.featured,
      published: insight.published,
      post_date: insight.post_date,
      links: (insight as any).links || [],
    });
    setShowEditDialog(true);
  };

  const handleRequestDelete = (insight: Insight) => {
    setSelectedInsight(insight);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      post_image: "",
      category: "",
      tags: [],
      author: "",
      read_time: "",
      featured: false,
      published: true,
      post_date: new Date().toISOString().split("T")[0],
      links: [],
    });
  };

  const handleCreateNew = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { type: "Website", url: "" }],
    }));
  };

  const updateLink = (index: number, field: keyof LinkData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Insights Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage blog posts and insights
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search insights..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleCreateNew} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Insight
        </Button>
      </div>

      <div className="relative rounded-xl p-0 md:p-6 shadow-lg border workspace-border overflow-x-auto">
        {loading && <LoadingOverlay />}
        <table className="min-w-full text-sm">
          <thead>
            <tr className="workspace-sidebar-text">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Title {getSortIcon("title")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Category {getSortIcon("category")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("author")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Author {getSortIcon("author")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Date {getSortIcon("created_at")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("published")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Status {getSortIcon("published")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("featured")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Featured {getSortIcon("featured")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((insight) => (
              <tr
                key={insight.id}
                className="border-t workspace-border hover:workspace-hover cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    {insight.post_image && (
                      <img
                        src={insight.post_image}
                        alt={insight.title}
                        className="w-12 h-8 object-cover rounded group-hover:scale-105 duration-300"
                      />
                    )}
                    <div>
                      <div className="font-semibold workspace-sidebar-text duration-300 line-clamp-1">
                        {insight.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {insight.description.replace(/<[^>]*>/g, "").trim()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                  <Badge variant="secondary" className="text-xs">
                    {insight.category}
                  </Badge>
                </td>
                <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {insight.author || "Unknown"}
                  </div>
                </td>
                <td className="px-4 py-3 workspace-sidebar-text group-hover:scale-105 duration-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(insight.post_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      insight.published
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    }`}
                  >
                    {insight.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300">
                  {insight.featured ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleEdit(insight)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="text-xs">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleRequestDelete(insight)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                        <span className="text-xs text-rose-500">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && insights.length === 0 && (
          <div className="text-center workspace-sidebar-text py-12">
            No insights found.
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
            {Array.from({ length: Math.ceil(total / pageSize) }).map((_, i) => {
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

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Insight</DialogTitle>
            <DialogDescription>
              Add a new blog post or insight to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 h-[70vh]">
            {/* Left Section - All fields except description */}
            <div className="space-y-4 overflow-y-auto pr-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter insight title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      read_time: e.target.value,
                    }))
                  }
                  placeholder="5 min read"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <ImageUpload
                  value={formData.post_image}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      post_image: value,
                    }))
                  }
                  placeholder="Upload an image or enter URL"
                  label="Post Image"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post_date">Post Date</Label>
                <Input
                  id="post_date"
                  type="date"
                  value={formData.post_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      post_date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="AI, Sprint Planning, Productivity"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        addTag(value);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links Section */}
              <div className="space-y-2 col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Links</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLink}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Select
                        value={link.type}
                        onValueChange={(value) =>
                          updateLink(index, "type", value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {linkTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Enter URL"
                        value={link.url}
                        onChange={(e) =>
                          updateLink(index, "url", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLink(index)}
                        className="h-10 w-10 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, featured: checked }))
                    }
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, published: checked }))
                    }
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>
            </div>

            {/* Right Section - Description with TextEditor */}
            <div className="space-y-4 overflow-y-auto pl-4 border-l">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <TextEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  placeholder="Write your insight description here..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Insight"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Insight</DialogTitle>
            <DialogDescription>Update the insight details.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 h-[70vh]">
            {/* Left Section - All fields except description */}
            <div className="space-y-4 overflow-y-auto pr-4">
              <div className="space-y-2">
                <Label htmlFor="edit_category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit_title">Title</Label>
                <Input
                  id="edit_title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter insight title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_author">Author</Label>
                <Input
                  id="edit_author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_read_time">Read Time</Label>
                <Input
                  id="edit_read_time"
                  value={formData.read_time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      read_time: e.target.value,
                    }))
                  }
                  placeholder="5 min read"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <ImageUpload
                  value={formData.post_image}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      post_image: value,
                    }))
                  }
                  placeholder="Upload an image or enter URL"
                  label="Post Image"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_post_date">Post Date</Label>
                <Input
                  id="edit_post_date"
                  type="date"
                  value={formData.post_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      post_date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit_tags">Tags (comma separated)</Label>
                <Input
                  id="edit_tags"
                  placeholder="AI, Sprint Planning, Productivity"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        addTag(value);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links Section */}
              <div className="space-y-2 col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Links</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLink}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Select
                        value={link.type}
                        onValueChange={(value) =>
                          updateLink(index, "type", value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {linkTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Enter URL"
                        value={link.url}
                        onChange={(e) =>
                          updateLink(index, "url", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLink(index)}
                        className="h-10 w-10 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, featured: checked }))
                    }
                  />
                  <Label htmlFor="edit_featured">Featured Post</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, published: checked }))
                    }
                  />
                  <Label htmlFor="edit_published">Published</Label>
                </div>
              </div>
            </div>

            {/* Right Section - Description with TextEditor */}
            <div className="space-y-4 overflow-y-auto pl-4 border-l">
              <div className="space-y-2">
                <Label htmlFor="edit_description">Description</Label>
                <TextEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  placeholder="Write your insight description here..."
                  className="h-[60vh]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Insight"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Insight</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedInsight?.title}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedInsight(null);
                setShowDeleteDialog(false);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

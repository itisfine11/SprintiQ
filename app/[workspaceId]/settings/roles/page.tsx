"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Clock,
  Building,
  Code,
  Target,
  Shield,
  Settings,
  AlertCircle,
  CheckCircle,
  Brain,
  Cloud,
  Database,
  ChartLine,
  TrendingUp,
  Layers,
} from "lucide-react";
import { Role } from "@/lib/database.types";
import { CreateRoleModal } from "@/components/workspace/teams/modals/create-role-modal";
import RolesLoading from "./loading";

export default function RolesPage() {
  const { user } = useAuth();
  const { toast } = useEnhancedToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const supabase = createClientSupabaseClient();

  // Get workspace ID from URL params
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const categories = [
    { value: "all", label: "All Categories", icon: Briefcase },
    { value: "Engineering", label: "Engineering", icon: Code },
    { value: "Product", label: "Product", icon: Target },
    { value: "Design", label: "Design", icon: Users },
    { value: "Business", label: "Business", icon: Building },
    { value: "Marketing", label: "Marketing", icon: TrendingUp },
    { value: "Sales", label: "Sales", icon: Target },
    { value: "Operations", label: "Operations", icon: Settings },
    { value: "General", label: "General", icon: Briefcase },
  ];

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.icon || Briefcase;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-500";
      case "intermediate":
        return "text-yellow-500";
      case "advanced":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const fetchRoles = async () => {
    if (!user || !workspaceId) {
      console.log("Missing user or workspaceId:", {
        user: user?.id,
        workspaceId,
      });
      return;
    }

    try {
      setLoading(true);
      console.log(
        "Fetching roles for user:",
        user.id,
        "workspace:",
        workspaceId
      );

      // First, get the workspace UUID from the short workspace_id
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .single();

      if (workspaceError) {
        console.error("Error fetching workspace:", workspaceError);
        throw new Error(`Workspace not found: ${workspaceError.message}`);
      }

      const workspaceUuid = workspaceData.id;
      console.log("Found workspace UUID:", workspaceUuid);

      // Check if the new columns exist by trying to select them
      const { data: testData, error: testError } = await supabase
        .from("roles")
        .select("id, name, created_by, workspace_id")
        .limit(1);

      console.log("Column test:", { data: testData, error: testError });

      if (
        testError &&
        testError.message.includes("column") &&
        testError.message.includes("does not exist")
      ) {
        console.log("New columns don't exist yet, fetching all roles for now");
        // Fallback: fetch all roles if new columns don't exist
        const { data, error } = await supabase
          .from("roles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRoles(data || []);
        return;
      }

      // If columns exist, filter by user and workspace UUID
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("created_by", user.id)
        .eq("workspace_id", workspaceUuid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast({
        title: "Error",
        description: `Failed to fetch roles: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (data: {
    name: string;
    description: string;
    experience?: string;
    category?: string;
    core_competencies?: any;
    template_data?: any;
  }) => {
    if (!user || !workspaceId) return;

    console.log("handleCreateRole called with data:", data);
    console.log("User:", user?.id);
    console.log("WorkspaceId:", workspaceId);

    try {
      // First, get the workspace UUID from the short workspace_id
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .single();

      if (workspaceError) {
        console.error("Error fetching workspace:", workspaceError);
        throw new Error(`Workspace not found: ${workspaceError.message}`);
      }

      const workspaceUuid = workspaceData.id;

      // Try to insert with new columns first
      let insertData = {
        name: data.name,
        description: data.description,
        experience: data.experience,
        category: data.category,
        core_competencies: data.core_competencies,
        template_data: data.template_data,
        is_template: false,
        created_by: user.id,
        workspace_id: workspaceUuid,
      };

      console.log("Attempting to insert role with data:", insertData);
      const { error } = await supabase.from("roles").insert(insertData);

      if (error) {
        console.log("Insert error:", error);
        // If error is about missing columns, try without them
        if (
          error.message.includes("column") &&
          error.message.includes("does not exist")
        ) {
          console.log("New columns don't exist, creating role without them");
          const fallbackData = {
            name: data.name,
            description: data.description,
            experience: data.experience,
            category: data.category,
            core_competencies: data.core_competencies,
            template_data: data.template_data,
            is_template: false,
          };
          console.log("Fallback insert data:", fallbackData);

          const { error: fallbackError } = await supabase
            .from("roles")
            .insert(fallbackData);

          if (fallbackError) {
            console.log("Fallback insert error:", fallbackError);
            throw fallbackError;
          }
        } else {
          // If it's not a column error, try with just basic fields
          console.log("Non-column error, trying with basic fields only");
          const basicData = {
            name: data.name,
            description: data.description,
          };
          console.log("Basic insert data:", basicData);

          const { error: basicError } = await supabase
            .from("roles")
            .insert(basicData);

          if (basicError) {
            console.log("Basic insert error:", basicError);
            throw basicError;
          }
        }
      }

      toast({
        title: "Success",
        description: "Role created successfully",
      });

      setCreateModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
      toast({
        title: "Error",
        description: `Failed to create role: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (data: {
    name: string;
    description: string;
    experience?: string;
    category?: string;
    core_competencies?: any;
    template_data?: any;
  }) => {
    if (!editingRole) return;

    try {
      const { error } = await supabase
        .from("roles")
        .update({
          name: data.name,
          description: data.description,
          experience: data.experience,
          category: data.category,
          core_competencies: data.core_competencies,
          template_data: data.template_data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingRole.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role updated successfully",
      });

      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!user || !workspaceId) return;

    try {
      setDeleteLoadingId(roleId);

      // First, get the workspace UUID from the short workspace_id
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .single();

      if (workspaceError) {
        console.error("Error fetching workspace:", workspaceError);
        throw new Error(`Workspace not found: ${workspaceError.message}`);
      }

      const workspaceUuid = workspaceData.id;

      const { error } = await supabase
        .from("roles")
        .delete()
        .eq("id", roleId)
        .eq("created_by", user.id)
        .eq("workspace_id", workspaceUuid);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role deleted successfully",
      });

      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    } finally {
      setDeleteLoadingId(null);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [user, workspaceId]);

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedRoles = filteredRoles.reduce((acc, role) => {
    const category = role.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(role);
    return acc;
  }, {} as Record<string, Role[]>);

  if (loading) {
    return <RolesLoading />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold workspace-text">Role Management</h1>
          <p className="text-sm workspace-text-muted mt-1">
            Create and manage roles with detailed competencies and requirements
          </p>
        </div>
        <Button variant="workspace" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <CreateRoleModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateRole}
        editingRole={null}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Search and Filter */}
      <Card className="workspace-surface border workspace-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 workspace-surface border workspace-border"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="workspace-surface-secondary">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger
                      key={category.value}
                      value={category.value}
                      className="data-[state=active]:workspace-component-bg data-[state=active]:workspace-component-active-color"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      {Object.keys(groupedRoles).length === 0 ? (
        <Card className="workspace-surface border workspace-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full workspace-surface-secondary flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 workspace-text-muted" />
            </div>
            <h3 className="text-lg font-semibold workspace-text mb-2">
              No roles found
            </h3>
            <p className="workspace-text-muted text-center mb-6 max-w-md">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria to find roles"
                : "Create your first role to define team member responsibilities and competencies"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Button
                onClick={() => setCreateModalOpen(true)}
                variant="workspace"
                className="px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Role
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedRoles).map(([category, categoryRoles]) => {
            const CategoryIcon = getCategoryIcon(category);
            return (
              <div key={category}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg workspace-surface-secondary flex items-center justify-center">
                    <CategoryIcon className="w-4 h-4 workspace-text" />
                  </div>
                  <h2 className="text-lg font-semibold workspace-text">
                    {category}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="workspace-surface-secondary workspace-text"
                  >
                    {categoryRoles.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryRoles.map((role) => (
                    <Card
                      key={role.id}
                      className="workspace-surface border workspace-border hover:shadow-md transition-all duration-200 hover:border-workspace-primary/20"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base workspace-text">
                              {role.name}
                            </CardTitle>
                            {role.experience && (
                              <div className="flex items-center space-x-1 mt-2">
                                <Clock className="w-3 h-3 workspace-text-muted" />
                                <span className="text-xs workspace-text-muted">
                                  {role.experience}
                                </span>
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:workspace-hover"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="workspace-surface border workspace-border"
                            >
                              <DropdownMenuItem
                                onClick={() => setEditingRole(role)}
                                className="hover:workspace-hover"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteRole(role.id)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                disabled={deleteLoadingId === role.id}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {deleteLoadingId === role.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm line-clamp-3 workspace-text-muted">
                          {role.description}
                        </CardDescription>

                        {role.template_data && (
                          <div className="mt-4 space-y-3">
                            {role.template_data.difficulty && (
                              <Badge
                                variant="outline"
                                className={`text-xs border workspace-border ${getDifficultyColor(
                                  role.template_data.difficulty
                                )}`}
                              >
                                {role.template_data.difficulty}
                              </Badge>
                            )}
                            {role.template_data.tags && (
                              <div className="flex flex-wrap gap-1">
                                {role.template_data.tags
                                  .slice(0, 3)
                                  .map((tag: string) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs workspace-surface-secondary workspace-text"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {role.template_data.tags.length > 3 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border workspace-border"
                                  >
                                    +{role.template_data.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {role.core_competencies && (
                          <div className="mt-4 p-3 rounded-lg workspace-surface-secondary">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-green-600">
                                Core Competencies
                              </span>
                            </div>
                            <div className="text-xs workspace-text-muted">
                              {Object.keys(role.core_competencies).length}{" "}
                              competency areas defined
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <CreateRoleModal
          open={!!editingRole}
          onOpenChange={(open) => !open && setEditingRole(null)}
          onSubmit={handleUpdateRole}
          editingRole={editingRole}
          onClose={() => setEditingRole(null)}
        />
      )}
    </div>
  );
}

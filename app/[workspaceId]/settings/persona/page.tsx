"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  User,
  Edit,
  Trash2,
  Users2,
  Calendar,
  Code,
  Clock,
  Star,
  Building,
  Zap,
  Goal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PersonaSvg } from "@/components/svg/PersonaSvg";
import { CreatePersonaModal } from "@/components/workspace/modals/create-persona-modal";
import { Persona } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/auth-context";
import { nanoid } from "nanoid";
import PersonaLoading from "./loading";

export default function PersonaPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  useEffect(() => {
    if (workspaceId && user) {
      fetchPersonas();
    }
  }, [workspaceId, user]);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get the workspace record to get the correct ID
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .single();

      if (workspaceError) {
        console.error("Error fetching workspace:", workspaceError);
        setError(
          "Failed to load workspace. Please check your workspace access."
        );
        return;
      }

      if (!workspaceData) {
        setError("Workspace not found.");
        return;
      }

      // Now fetch personas using the workspace.id
      const { data, error } = await supabase
        .from("personas")
        .select(
          `
          *,
          created_by_profile:profiles!personas_created_by_fkey(id, full_name, avatar_url, email)
        `
        )
        .eq("workspace_id", workspaceData.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);

        // Check if it's a table doesn't exist error
        if (
          error.message?.includes("relation") &&
          error.message?.includes("does not exist")
        ) {
          setError(
            "Personas table not found. Please run the database migration first."
          );
        } else if (error.message?.includes("permission denied")) {
          setError(
            "You don't have permission to access personas. Please check your workspace membership."
          );
        } else {
          setError(
            `Failed to load personas: ${error.message || "Unknown error"}`
          );
        }
        return;
      }

      setPersonas(data || []);
    } catch (error) {
      console.error("Error fetching personas:", error);
      setError("An unexpected error occurred while loading personas.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePersona = async (personaData: {
    name: string;
    description: string;
    techSavviness?: number;
    usageFrequency?: "daily" | "weekly" | "monthly";
    priorityLevel?: "high" | "medium" | "low";
    role?: string;
    domain?: string;
  }) => {
    try {
      // First, get the workspace record to get the correct ID
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .single();

      if (workspaceError || !workspaceData) {
        setError(
          "Failed to load workspace. Please check your workspace access."
        );
        return;
      }

      const personaId = `per${nanoid(12)}`;

      const { data, error } = await supabase
        .from("personas")
        .insert({
          persona_id: personaId,
          name: personaData.name,
          description: personaData.description,
          tech_savviness: personaData.techSavviness,
          usage_frequency: personaData.usageFrequency,
          priority_level: personaData.priorityLevel,
          role: personaData.role,
          domain: personaData.domain,
          workspace_id: workspaceData.id,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating persona:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        setError(
          `Failed to create persona: ${error.message || "Unknown error"}`
        );
        return;
      }

      // Refresh the personas list to ensure consistency
      await fetchPersonas();
      setIsCreateModalOpen(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error creating persona:", error);
      setError("An unexpected error occurred while creating the persona.");
    }
  };

  const handleDeletePersona = async (personaId: string) => {
    try {
      const { error } = await supabase
        .from("personas")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", personaId);

      if (error) {
        console.error("Error deleting persona:", error);
        setError(
          `Failed to delete persona: ${error.message || "Unknown error"}`
        );
        return;
      }

      setPersonas((prev) => prev.filter((p) => p.id !== personaId));
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error deleting persona:", error);
      setError("An unexpected error occurred while deleting the persona.");
    }
  };

  const filteredPersonas = personas.filter(
    (persona) =>
      (persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !persona.deleted_at
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <PersonaLoading />;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">Personas</h1>
          <Badge variant="secondary">{personas.length} personas</Badge>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="workspace"
          className="text-xs p-2 h-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Persona
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
            {error.includes("migration") && (
              <div className="mt-2">
                <p className="text-sm text-red-700">
                  To fix this, run the migration script:
                </p>
                <code className="block mt-1 p-2 bg-red-100 rounded text-xs">
                  ./scripts/run-personas-migration.sh
                </code>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search personas..."
            variant="workspace"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 workspace-header-bg border workspace-border"
          />
        </div>
      </div>

      {/* Personas Grid */}
      {filteredPersonas.length === 0 ? (
        <div className="text-center py-12">
          <PersonaSvg
            color="currentColor"
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
          />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? "No personas found" : "No personas yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first persona to get started with user story generation"}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="workspace"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Persona
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonas
            .filter((persona) => !persona.deleted_at)
            .map((persona) => (
              <Card
                key={persona.id}
                className="hover:shadow-md transition-shadow workspace-header-bg border workspace-border"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={persona.created_by_profile?.avatar_url || ""}
                        />
                        <AvatarFallback>
                          {persona.created_by_profile?.full_name ? (
                            getInitials(persona.created_by_profile.full_name)
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {persona.name}
                        </CardTitle>
                        <CardDescription>
                          Created by{" "}
                          {persona.created_by_profile?.full_name || "Unknown"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingPersona(persona);
                          setIsCreateModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePersona(persona.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm workspace-text-muted line-clamp-4 mb-4">
                    {persona.description}
                  </p>

                  {/* Enhanced Persona Attributes */}
                  <div className="space-y-3">
                    {/* Tech Savviness */}
                    {persona.tech_savviness && (
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Tech Level:
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {persona.tech_savviness}/5
                        </Badge>
                      </div>
                    )}

                    {/* Usage Frequency */}
                    {persona.usage_frequency && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Usage:
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize border workspace-border"
                        >
                          {persona.usage_frequency}
                        </Badge>
                      </div>
                    )}

                    {/* Priority Level */}
                    {persona.priority_level && (
                      <div className="flex items-center space-x-2">
                        <Goal className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Priority:
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            persona.priority_level === "high"
                              ? "text-rose-600 border-rose-200 bg-rose-50"
                              : persona.priority_level === "medium"
                              ? "text-yellow-600 border-yellow-200 bg-yellow-50"
                              : "text-green-600 border-green-200 bg-green-50"
                          }`}
                        >
                          {persona.priority_level.charAt(0).toUpperCase() +
                            persona.priority_level.slice(1)}
                        </Badge>
                      </div>
                    )}

                    {/* Role and Domain */}
                    {(persona.role || persona.domain) && (
                      <div className="flex flex-wrap gap-2">
                        {persona.role && (
                          <Badge variant="secondary" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {persona.role}
                          </Badge>
                        )}
                        {persona.domain && (
                          <Badge variant="secondary" className="text-xs">
                            <Building className="w-3 h-3 mr-1" />
                            {persona.domain}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      {persona.auto_detected && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto-detected
                        </Badge>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border workspace-border"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(persona.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Create/Edit Persona Modal */}
      <CreatePersonaModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreatePersona}
        editingPersona={editingPersona}
        onClose={() => {
          setEditingPersona(null);
          setIsCreateModalOpen(false);
        }}
        workspaceId={workspaceId}
      />
    </div>
  );
}

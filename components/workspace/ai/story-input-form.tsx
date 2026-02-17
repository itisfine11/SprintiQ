import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Sparkles,
  Users,
  Settings,
  User,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import PriorityScoringConfig, {
  PriorityWeights,
} from "./priority-scoring-config";
import TeamMemberForm from "./team-member-form";
import { DEFAULT_WEIGHTS, type TeamMember } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type { Persona } from "@/lib/database.types";
import { useParams } from "next/navigation";

interface StoryInputFormProps {
  onSubmit: (story: {
    role: string;
    want: string;
    benefit: string;
    numberOfStories: number;
    complexity: "simple" | "moderate" | "complex";
    teamMembers: TeamMember[];
    selectedPersonas: Persona[];
    antiPatternPrevention: boolean;
  }) => void;
  isLoading?: boolean;
  weights: PriorityWeights;
  onWeightsChange: (weights: PriorityWeights) => void;
  onWeightsReset: () => void;
}

export default function StoryInputForm({
  onSubmit,
  isLoading = false,
  weights,
  onWeightsChange,
  onWeightsReset,
}: StoryInputFormProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const supabase = createClientSupabaseClient();

  const [role, setRole] = useState("");
  const [want, setWant] = useState("");
  const [benefit, setBenefit] = useState("");
  const [storyCount, setStoryCount] = useState<string>("3");
  const [customCount, setCustomCount] = useState<number>(1);
  const [complexity, setComplexity] = useState<
    "simple" | "moderate" | "complex"
  >("moderate");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);

  // Persona selection state
  const [availablePersonas, setAvailablePersonas] = useState<Persona[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(false);
  const [antiPatternPrevention, setAntiPatternPrevention] = useState(true);
  const [showPersonaSection, setShowPersonaSection] = useState(false);

  // Load available personas
  useEffect(() => {
    loadPersonas();
  }, [workspaceId]);

  const loadPersonas = async () => {
    setIsLoadingPersonas(true);
    try {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .single();

      if (!workspace) return;

      const { data: personas } = await supabase
        .from("personas")
        .select("*")
        .eq("workspace_id", workspace.id)
        .is("deleted_at", null)
        .order("name");

      setAvailablePersonas(personas || []);
    } catch (error) {
      console.error("Error loading personas:", error);
    } finally {
      setIsLoadingPersonas(false);
    }
  };

  const handlePersonaToggle = (persona: Persona) => {
    setSelectedPersonas((prev) => {
      const isSelected = prev.some((p) => p.id === persona.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== persona.id);
      } else {
        return [...prev, persona];
      }
    });
  };

  const handleSelectAllPersonas = () => {
    setSelectedPersonas(availablePersonas);
  };

  const handleClearPersonas = () => {
    setSelectedPersonas([]);
  };

  const handleGenerateStories = () => {
    onSubmit({
      role,
      want,
      benefit,
      numberOfStories:
        storyCount === "custom" ? customCount : parseInt(storyCount),
      complexity,
      teamMembers,
      selectedPersonas,
      antiPatternPrevention,
    });
  };

  const isValid =
    role.trim() &&
    want.trim() &&
    benefit.trim() &&
    (storyCount !== "custom" || (customCount > 0 && customCount <= 20)) &&
    teamMembers.length > 0;

  const getTechSavvinessLabel = (level: number) => {
    const labels = {
      1: "Beginner",
      2: "Novice",
      3: "Intermediate",
      4: "Advanced",
      5: "Expert",
    };
    return labels[level as keyof typeof labels] || "Unknown";
  };

  const getPriorityColor = (level: string) => {
    const colors = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Story Input Section */}
      <div className="px-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">User Story Input</span>
        </div>
        <hr className="my-3 workspace-border" />
      </div>
      <ScrollArea className="h-[calc(100vh-238px)]">
        <div className="space-y-4  px-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2" id="agent-role-field">
              <Label htmlFor="role">As a...</Label>
              <Textarea
                id="role"
                variant="workspace"
                placeholder="e.g., Product Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="resize-none h-20 text-xs placeholder:text-xs workspace-header-bg border workspace-border"
              />
            </div>
            <div className="space-y-2" id="agent-want-field">
              <Label htmlFor="want">I want...</Label>
              <Textarea
                id="want"
                variant="workspace"
                placeholder="e.g., to generate user stories using AI trained on real successful project patterns"
                value={want}
                onChange={(e) => setWant(e.target.value)}
                className="resize-none h-20 text-xs placeholder:text-xs workspace-header-bg border workspace-border"
              />
            </div>
          </div>
          <div className="space-y-2" id="agent-benefit-field">
            <Label htmlFor="benefit">So that...</Label>
            <Textarea
              id="benefit"
              variant="workspace"
              placeholder="e.g., I can quickly create high-quality backlogs based on proven practices"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              className="resize-none h-20 text-xs placeholder:text-xs workspace-header-bg border workspace-border"
            />
          </div>
        </div>

        <hr className="my-3 workspace-border  mx-3" />

        {/* Persona Selection Section */}
        <div className="px-3">
          <div
            className="flex items-center justify-between mb-4"
            id="agent-personas-section-label"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Target Personas
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPersonaSection(!showPersonaSection)}
              className="workspace-header-bg border workspace-border"
              id="agent-personas-toggle"
            >
              {showPersonaSection ? "Hide" : "Select Personas"}
            </Button>
          </div>

          {showPersonaSection && (
            <div className="space-y-4">
              {/* Anti-pattern Prevention Toggle */}
              <div className="flex items-center space-x-2 p-3 border workspace-border rounded-lg">
                <Checkbox
                  id="antiPatternPrevention"
                  variant="workspace"
                  checked={antiPatternPrevention}
                  onCheckedChange={(checked) =>
                    setAntiPatternPrevention(checked as boolean)
                  }
                />
                <Label
                  htmlFor="antiPatternPrevention"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4 text-workspace-primary" />
                  Enable Anti-Pattern Prevention
                </Label>
                <Badge variant="secondary" className="ml-auto">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Failure Prevention
                </Badge>
              </div>

              {antiPatternPrevention && (
                <div className="p-3 workspace-component-bg border border-workspace-primary rounded-lg">
                  <p className="text-sm text-workspace-primary">
                    <strong>Anti-Pattern Prevention Active:</strong> Stories
                    will be generated with failure prevention intelligence,
                    avoiding known failure patterns and adjusting complexity
                    based on persona tech-savviness.
                  </p>
                </div>
              )}

              {/* Persona Selection Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllPersonas}
                  disabled={isLoadingPersonas}
                  className="workspace-header-bg border workspace-border"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPersonas}
                  disabled={selectedPersonas.length === 0}
                  className="workspace-header-bg border workspace-border"
                >
                  Clear All
                </Button>
              </div>

              {/* Personas List */}
              {isLoadingPersonas ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Loading personas...
                </div>
              ) : availablePersonas.length === 0 ? (
                <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No personas available</p>
                  <p className="text-xs">
                    Create personas in Settings to enable persona-aware story
                    generation.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availablePersonas.map((persona) => {
                    const isSelected = selectedPersonas.some(
                      (p) => p.id === persona.id
                    );
                    return (
                      <div
                        key={persona.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "border-workspace-primary workspace-component-bg"
                            : "workspace-border hover:border-workspace-primary"
                        }`}
                        onClick={() => handlePersonaToggle(persona)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={isSelected}
                            variant="workspace"
                            onChange={() => handlePersonaToggle(persona)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {persona.name}
                              </h4>
                              <div className="flex gap-1">
                                {persona.tech_savviness && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {getTechSavvinessLabel(
                                      persona.tech_savviness
                                    )}
                                  </Badge>
                                )}
                                {persona.priority_level && (
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${getPriorityColor(
                                      persona.priority_level
                                    )}`}
                                  >
                                    {persona.priority_level}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {persona.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              {persona.role && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {persona.role}
                                </span>
                              )}
                              {persona.domain && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                  {persona.domain}
                                </span>
                              )}
                              {persona.usage_frequency && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                  {persona.usage_frequency}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Personas Summary */}
              {selectedPersonas.length > 0 && (
                <div className="p-3 workspace-component-bg border border-workspace-primary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-workspace-primary">
                      Selected Personas ({selectedPersonas.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPersonas.map((persona) => (
                      <Badge
                        key={persona.id}
                        variant="secondary"
                        className="text-xs workspace-header-bg border workspace-border"
                      >
                        {persona.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!showPersonaSection && selectedPersonas.length > 0 && (
            <div className="p-3 border workspace-border rounded-lg">
              <div className="text-sm font-medium mb-2">
                {selectedPersonas.length} persona
                {selectedPersonas.length !== 1 ? "s" : ""} selected
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedPersonas.slice(0, 3).map((persona) => (
                  <Badge
                    key={persona.id}
                    variant="secondary"
                    className="text-xs workspace-header-bg border workspace-border"
                  >
                    {persona.name}
                  </Badge>
                ))}
                {selectedPersonas.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs workspace-header-bg border workspace-border"
                  >
                    +{selectedPersonas.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <hr className="my-3 workspace-border  mx-3" />

        {/* Configuration Section */}
        <div className=" px-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </span>
          </div>

          <div className="space-y-4">
            {/* Number of Stories */}
            <div
              className="flex items-center justify-between"
              id="agent-story-count"
            >
              <Label>Number of Stories</Label>
              <div className="flex gap-2">
                <Select value={storyCount} onValueChange={setStoryCount}>
                  <SelectTrigger className="w-[180px] workspace-header-bg border workspace-border">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent className="workspace-header-bg border workspace-border">
                    <SelectItem
                      value="3"
                      className="hover:workspace-hover cursor-pointer"
                    >
                      3 Stories
                    </SelectItem>
                    <SelectItem
                      value="5"
                      className="hover:workspace-hover cursor-pointer"
                    >
                      5 Stories
                    </SelectItem>
                    <SelectItem
                      value="10"
                      className="hover:workspace-hover cursor-pointer"
                    >
                      10 Stories
                    </SelectItem>
                    <SelectItem
                      value="custom"
                      className="hover:workspace-hover cursor-pointer"
                    >
                      Custom Count
                    </SelectItem>
                  </SelectContent>
                </Select>
                {storyCount === "custom" && (
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={customCount}
                    onChange={(e) => {
                      setCustomCount(
                        Math.min(20, Math.max(1, parseInt(e.target.value) || 1))
                      );
                    }}
                    className="w-24 workspace-header-bg border workspace-border"
                    placeholder="Count"
                  />
                )}
              </div>
            </div>

            {/* Complexity Selection */}
            <div
              className="flex items-center justify-between"
              id="agent-complexity"
            >
              <Label>Complexity</Label>
              <Select
                value={complexity}
                onValueChange={(value: "simple" | "moderate" | "complex") =>
                  setComplexity(value)
                }
              >
                <SelectTrigger className="w-[180px] workspace-header-bg border workspace-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="workspace-header-bg border workspace-border">
                  <SelectItem
                    value="simple"
                    className="hover:workspace-hover cursor-pointer"
                  >
                    Simple
                  </SelectItem>
                  <SelectItem
                    value="moderate"
                    className="hover:workspace-hover cursor-pointer"
                  >
                    Moderate
                  </SelectItem>
                  <SelectItem
                    value="complex"
                    className="hover:workspace-hover cursor-pointer"
                  >
                    Complex
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {storyCount === "custom" && customCount > 10 && (
              <p className="text-sm text-muted-foreground">
                Large numbers of stories may take longer to generate.
              </p>
            )}
          </div>
        </div>

        <hr className="my-3 workspace-border  mx-3" />

        {/* Team Members Section */}
        <div className="px-3">
          <div id="agent-team-members-label">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTeamForm(!showTeamForm)}
                className="workspace-header-bg border workspace-border"
                id="agent-team-members-toggle"
              >
                {showTeamForm ? "Hide" : "Add Team Members"}
              </Button>
            </div>

            {showTeamForm && (
              <TeamMemberForm
                teamMembers={teamMembers}
                onTeamMembersChange={setTeamMembers}
              />
            )}

            {!showTeamForm && teamMembers.length > 0 && (
              <div className="p-3 border workspace-border rounded-lg">
                <div className="text-sm font-medium mb-2">
                  {teamMembers.length} team member
                  {teamMembers.length !== 1 ? "s" : ""} added
                </div>
                <div className="flex flex-wrap gap-1 items-center">
                  {teamMembers.slice(0, 3).map((member) => (
                    <span
                      key={member.id}
                      className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback className="text-xs font-bold text-workspace-primary workspace-component-bg">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          {member.name}
                        </span>
                        <span className="text-[10px] font-medium">
                          {member.role}
                        </span>
                      </div>
                    </span>
                  ))}
                  {teamMembers.length > 3 && (
                    <span className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1 border rounded-full">
                      <Users className="h-3 w-3" />+{teamMembers.length - 3}{" "}
                      more
                    </span>
                  )}
                </div>
              </div>
            )}

            {teamMembers.length === 0 && (
              <div className="p-3 border border-dashed rounded-lg text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No team members added</p>
                <p className="text-xs">
                  Add team members to enable automatic assignment. You can
                  create new members or select from existing teams.
                </p>
              </div>
            )}
          </div>
        </div>

        <hr className="my-3 workspace-border mx-3" />

        {/* Priority Weights */}
        <div className="px-3">
          <div id="agent-priority-label">
            <PriorityScoringConfig
              weights={weights}
              onChange={onWeightsChange}
              onReset={onWeightsReset}
            />

            <Button
              onClick={handleGenerateStories}
              className="w-full mt-3"
              variant="workspace"
              disabled={!isValid || isLoading}
              id="agent-generate-stories"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Stories
                </>
              )}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

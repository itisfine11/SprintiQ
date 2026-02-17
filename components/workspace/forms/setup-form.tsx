"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Check,
  ChevronRight,
  Briefcase,
  Home,
  Globe,
  Smartphone,
  Code,
  Rocket,
  LineChart,
  Headphones,
  HelpCircle,
  Users,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Building2,
  Palette,
  Camera,
  ShoppingCart,
  GraduationCap,
  Heart,
  Sparkles,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import StoryBuilderModal from "@/components/workspace/modals/story-builder-modal";
import { saveUserStoryToDestination } from "@/app/[workspaceId]/ai-actions";
import type { UserStory } from "@/types";
import { ProductManagerSvg } from "@/components/svg/users/ProductManagerSvg";

type WorkspaceFormData = {
  purpose: string;
  type: string;
  category: string;
  name: string;
  invites: { email: string; role: string }[];
};

const initialFormData: WorkspaceFormData = {
  purpose: "",
  type: "",
  category: "",
  name: "",
  invites: [],
};

export default function SetupWorkspaceForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WorkspaceFormData>(initialFormData);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStoryBuilder, setShowStoryBuilder] = useState(false);

  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const updateFormData = (field: keyof WorkspaceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addInvite = () => {
    if (!inviteEmail || !inviteEmail.includes("@")) return;

    // Check if email already exists in invites
    if (formData.invites.some((invite) => invite.email === inviteEmail)) return;

    setFormData((prev) => ({
      ...prev,
      invites: [...prev.invites, { email: inviteEmail, role: "member" }],
    }));
    setInviteEmail("");
  };

  const removeInvite = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      invites: prev.invites.filter((invite) => invite.email !== email),
    }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.purpose) return;
    if (step === 2 && !formData.type) return;
    if (step === 3 && !formData.category) return;
    if (step === 4 && !formData.name) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const createWorkspace = async (stories?: UserStory[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from("workspaces")
        .insert({
          name: formData.name,
          purpose: formData.purpose,
          type: formData.type,
          category: formData.category,
          owner_id: user.id,
        })
        .select()
        .single();

      if (workspaceError || !workspace) {
        throw new Error(
          workspaceError?.message || "Failed to create workspace"
        );
      }

      // Create default space
      const { data: space, error: spaceError } = await supabase
        .from("spaces")
        .insert({
          name: "General",
          workspace_id: workspace.id,
        })
        .select()
        .single();

      if (spaceError || !space) {
        throw new Error(
          spaceError?.message || "Failed to create default space"
        );
      }

      // Create default project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: "Getting Started",
          space_id: space.id,
          workspace_id: workspace.id,
        })
        .select()
        .single();

      if (projectError || !project) {
        throw new Error(
          projectError?.message || "Failed to create default project"
        );
      }

      // Create default statuses for the workspace
      const defaultStatuses = [
        {
          name: "Backlog",
          color: "gray",
          position: 1,
          status_type_id: "19abf1d4-d0a0-4fb5-a19f-2ea514451913",
        },
      ];

      const statusesToInsert = defaultStatuses.map((status) => ({
        name: status.name,
        color: status.color,
        position: status.position,
        workspace_id: workspace.id,
        space_id: space.id,
        type: "space",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { data: createdStatuses, error: statusError } = await supabase
        .from("statuses")
        .insert(statusesToInsert)
        .select();

      if (statusError) {
        console.error("Failed to create default statuses:", statusError);
        console.error(
          "Status error details:",
          JSON.stringify(statusError, null, 2)
        );
        // Don't fail the entire process if status creation fails
      }

      // Get the Backlog status ID for story saving
      const backlogStatus = createdStatuses?.find((s) => s.name === "Backlog");
      console.log("Backlog status found:", backlogStatus);

      // Add invites
      if (formData.invites.length > 0) {
        const invites = formData.invites.map((invite) => ({
          workspace_id: workspace.id,
          email: invite.email,
          role: invite.role,
          status: "pending",
          user_id: "00000000-0000-0000-0000-000000000000",
        }));

        const { error: inviteError } = await supabase
          .from("workspace_members")
          .insert(invites);

        if (inviteError) {
          console.error("Failed to add invites:", inviteError);
        }
      }

      if (stories && stories.length > 0 && backlogStatus) {
        for (const story of stories) {
          try {
            const result = await saveUserStoryToDestination(
              story,
              workspace.workspace_id,
              {
                type: "existing",
                spaceId: space.id,
                projectId: project.id,
                statusId: backlogStatus.id,
              }
            );
          } catch (storyError) {
            console.error("Failed to save story:", storyError);
            console.error(
              "Story error details:",
              JSON.stringify(storyError, null, 2)
            );
            // Don't fail the entire process if one story fails
          }
        }
      } else {
        console.log("NOT saving stories because:", {
          hasStories: !!stories && stories.length > 0,
          hasBacklogStatus: !!backlogStatus,
          storiesCount: stories?.length || 0,
        });
      }

      // Redirect to workspace using short ID
      router.push(`/${workspace.workspace_id}/home`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchWorkspace = async () => {
    await createWorkspace();
  };

  const handleSaveToWorkspace = async (stories: UserStory[]) => {
    await createWorkspace(stories);
  };

  return (
    <div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-7xl relative z-10">
        <Card className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden w-full">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-[400px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 flex flex-col">
              {/* Header */}
              <div className="px-8 pt-8">
                <div className="flex items-center">
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/sprintiq-logo.png"
                    alt="SprintiQ Logo"
                    width={150}
                    height={40}
                    priority // Preload the logo as it's above the fold [^3]
                    className="h-auto"
                  />
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex-1 px-6">
                <ScrollArea className="space-y-6 h-[40vh]">
                  {[
                    {
                      step: 1,
                      label: "Purpose",
                      description: "What's your workspace for?",
                    },
                    {
                      step: 2,
                      label: "Type",
                      description: "What type of projects?",
                    },
                    {
                      step: 3,
                      label: "Category",
                      description: "Industry or focus area",
                    },
                    {
                      step: 4,
                      label: "Name",
                      description: "Name your workspace",
                    },
                    { step: 5, label: "Team", description: "Invite your team" },
                    {
                      step: 6,
                      label: "Ready",
                      description: "Launch your workspace",
                    },
                  ].map(({ step: i, label, description }) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 pb-6 px-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 flex-shrink-0 ${
                          step >= i
                            ? "bg-white text-emerald-600 shadow-lg scale-110"
                            : step === i
                            ? "bg-emerald-500 text-white border-2 border-white"
                            : "bg-emerald-800/50 text-emerald-200 border-2 border-emerald-500/30"
                        }`}
                      >
                        {step > i ? <Check className="h-4 w-4" /> : i}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold transition-colors ${
                            step >= i
                              ? "text-white"
                              : step === i
                              ? "text-emerald-100"
                              : "text-emerald-300/70"
                          }`}
                        >
                          {label}
                        </div>
                        <div
                          className={`text-sm transition-colors ${
                            step >= i
                              ? "text-emerald-100"
                              : step === i
                              ? "text-emerald-200/80"
                              : "text-emerald-400/50"
                          }`}
                        >
                          {description}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>

                {/* Progress Bar */}
                <div className="mt-8 px-2">
                  <div className="h-2 bg-emerald-800/30 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-white rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${(step / 6) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-emerald-100/80 text-sm mt-2 text-center">
                    Step {step} of 6
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 space-y-3 px-8 pb-8">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-200"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}

                {step < 6 && (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !formData.purpose) ||
                      (step === 2 && !formData.type) ||
                      (step === 3 && !formData.category) ||
                      (step === 4 && !formData.name)
                    }
                    className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {step === 5
                      ? formData.invites.length > 0
                        ? "Continue"
                        : "Skip for now"
                      : "Continue"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {step === 6 && (
                  <Button
                    onClick={() => setShowStoryBuilder(true)}
                    disabled={isLoading}
                    className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none py-3"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Story Builder</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
              {error && (
                <Alert
                  variant="destructive"
                  className="mb-8 bg-red-50 border-red-200 rounded-xl"
                >
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {/* Step 1: Purpose */}
              {step === 1 && (
                <div className="h-full flex flex-col justify-center">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      What's your workspace for?
                    </h2>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto">
                      This helps us customize your experience with the right
                      tools and templates.
                    </p>
                  </div>

                  <RadioGroup
                    value={formData.purpose}
                    onValueChange={(value) => updateFormData("purpose", value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value="Work"
                        id="work"
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor="work"
                        className="flex flex-col items-center justify-center bg-slate-800/50 border-2 border-slate-600/50 rounded-3xl p-12 cursor-pointer peer-focus:ring-4 peer-focus:ring-emerald-200/30 peer-checked:border-emerald-400 peer-checked:bg-emerald-900/30 hover:border-emerald-400/50 hover:shadow-lg transition-all duration-300 group relative"
                      >
                        {/* Check icon for selected state */}
                        {formData.purpose === "Work" && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Briefcase className="h-10 w-10 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white mb-3">
                          Work
                        </span>
                        <span className="text-slate-300 text-center leading-relaxed">
                          Professional projects, team collaboration, and
                          business workflows
                        </span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem
                        value="Personal"
                        id="personal"
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor="personal"
                        className="flex flex-col items-center h-full justify-center bg-slate-800/50 border-2 border-slate-600/50 rounded-3xl p-12 cursor-pointer peer-focus:ring-4 peer-focus:ring-emerald-200/30 peer-checked:border-emerald-400 peer-checked:bg-emerald-900/30 hover:border-emerald-400/50 hover:shadow-lg transition-all duration-300 group relative"
                      >
                        {/* Check icon for selected state */}
                        {formData.purpose === "Personal" && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Home className="h-10 w-10 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white mb-3">
                          Personal
                        </span>
                        <span className="text-slate-300 text-center leading-relaxed">
                          Individual projects, personal goals, and creative
                          endeavors
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              {/* Step 2: Type */}
              {step === 2 && (
                <div className="h-full flex flex-col justify-center">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      What type of projects will you work on?
                    </h2>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto">
                      We'll configure the perfect tools and integrations for
                      your workflow.
                    </p>
                  </div>

                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) => updateFormData("type", value)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                  >
                    {[
                      {
                        value: "Web",
                        icon: Globe,
                        description: "Web applications and websites",
                      },
                      {
                        value: "Mobile",
                        icon: Smartphone,
                        description: "iOS and Android applications",
                      },
                      {
                        value: "SaaS",
                        icon: Code,
                        description: "Software as a Service platforms",
                      },
                    ].map(({ value, icon: Icon, description }) => (
                      <div key={value} className="relative">
                        <RadioGroupItem
                          value={value}
                          id={value.toLowerCase()}
                          className="sr-only peer"
                        />
                        <Label
                          htmlFor={value.toLowerCase()}
                          className="flex flex-col items-center justify-center bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl p-8 cursor-pointer peer-focus:ring-4 peer-focus:ring-emerald-200/30 peer-checked:border-emerald-400 peer-checked:bg-emerald-900/30 hover:border-emerald-400/50 hover:shadow-lg transition-all duration-300 group relative"
                        >
                          {/* Check icon for selected state */}
                          {formData.type === value && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <span className="text-xl font-bold text-white mb-2">
                            {value}
                          </span>
                          <span className="text-sm text-slate-300 text-center">
                            {description}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {/* Step 3: Category */}
              {step === 3 && (
                <div className="h-full flex flex-col justify-center">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      What industry or focus area?
                    </h2>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto">
                      We'll set up relevant templates and workflows for your
                      specific needs.
                    </p>
                  </div>

                  <RadioGroup
                    value={formData.category}
                    onValueChange={(value) => updateFormData("category", value)}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
                  >
                    {[
                      { value: "Software Development", icon: Code },
                      { value: "MVP", icon: Rocket },
                      { value: "Startup", icon: Building2 },
                      { value: "Marketing", icon: LineChart },
                      { value: "Design", icon: Palette },
                      { value: "Content", icon: Camera },
                      { value: "E-commerce", icon: ShoppingCart },
                      { value: "Education", icon: GraduationCap },
                      { value: "Healthcare", icon: Heart },
                      { value: "IT", icon: Code },
                      { value: "Support", icon: Headphones },
                      { value: "Other", icon: HelpCircle },
                    ].map(({ value, icon: Icon }) => (
                      <div key={value} className="relative">
                        <RadioGroupItem
                          value={value}
                          id={value.toLowerCase().replace(/\s+/g, "-")}
                          className="sr-only peer"
                        />
                        <Label
                          htmlFor={value.toLowerCase().replace(/\s+/g, "-")}
                          className="flex flex-col h-full items-center justify-center bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl p-6 cursor-pointer peer-focus:ring-4 peer-focus:ring-emerald-200/30 peer-checked:border-emerald-400 peer-checked:bg-emerald-900/30 hover:border-emerald-400/50 hover:shadow-md transition-all duration-300 group min-h-[120px] relative"
                        >
                          {/* Check icon for selected state */}
                          {formData.category === value && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-white text-center leading-tight">
                            {value}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {/* Step 4: Workspace Name */}
              {step === 4 && (
                <div className="h-full flex flex-col justify-center">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Name your workspace
                    </h2>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto">
                      Choose a name that represents your team, project, or
                      organization.
                    </p>
                  </div>

                  <div className="max-w-lg mx-auto">
                    <Label
                      htmlFor="workspace-name"
                      className="text-white font-semibold mb-4 block text-lg"
                    >
                      Workspace Name
                    </Label>
                    <Input
                      id="workspace-name"
                      placeholder="e.g. Acme Corp, My Startup, Creative Projects"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className="h-16 bg-slate-800/50 border-2 border-slate-600/50 text-white placeholder:text-slate-400 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/30 transition-all duration-200 hover:bg-slate-800/70 hover:border-emerald-400/50 text-lg px-6"
                    />
                    <p className="text-sm text-slate-400 mt-3">
                      You can always change this later in your workspace
                      settings.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Invite People*/}
              {step === 5 && (
                <div className="h-full flex flex-col justify-center">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Invite your team
                    </h2>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto">
                      Add team members to collaborate on projects together. You
                      can skip this step and invite people later.
                    </p>
                  </div>

                  <div className="max-w-lg mx-auto space-y-8">
                    <div>
                      <Label
                        htmlFor="invite-email"
                        className="text-white font-semibold mb-4 block text-lg"
                      >
                        Email Address
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="invite-email"
                          type="email"
                          placeholder="colleague@company.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="flex-1 h-14 bg-slate-800/50 border-2 border-slate-600/50 text-white placeholder:text-slate-400 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/30 transition-all duration-200"
                          onKeyPress={(e) => e.key === "Enter" && addInvite()}
                        />
                        <Button
                          onClick={addInvite}
                          disabled={!inviteEmail.includes("@")}
                          className="bg-emerald-600 hover:bg-emerald-700 px-8 h-14 rounded-2xl font-semibold transition-all duration-200"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {formData.invites.length > 0 && (
                      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-600/30">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-emerald-400" />
                          Team Members ({formData.invites.length})
                        </h3>
                        <div className="space-y-3">
                          {formData.invites.map((invite) => (
                            <div
                              key={invite.email}
                              className="flex items-center justify-between bg-slate-800/50 border border-slate-600/50 p-4 rounded-xl"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-semibold text-sm">
                                    {invite.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-white font-medium">
                                    {invite.email}
                                  </span>
                                  <div className="text-sm text-slate-400">
                                    Member
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeInvite(invite.email)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Step 6: Thank You */}
              {step === 6 && (
                <div className="h-full flex flex-col items-center justify-center text-center relative z-20">
                  <div className="mx-auto mb-6 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl bg-emerald-600/20 border border-emerald-400/30 flex items-center justify-center">
                      <Check className="h-10 w-10 text-emerald-300" />
                    </div>
                  </div>

                  <h2 className="text-4xl font-extrabold text-white mb-3">
                    Thank you for joining SprintiQ!
                  </h2>
                  <p className="text-slate-300 text-sm max-w-xl mb-8">
                    Thanks for signing up, answering our baseline questions, and
                    trusting us with your agile product. Turbo is ready to help
                    you build great digital products.
                  </p>

                  <div className="mx-auto mb-8 flex items-center justify-center">
                    <div className="w-48">
                      <ProductManagerSvg color="white" />
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowStoryBuilder(true)}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="h-5 w-5" />
                    Let’s Create Some Intelligent Stories!
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Story Builder Modal */}
      <StoryBuilderModal
        isOpen={showStoryBuilder}
        onClose={() => setShowStoryBuilder(false)}
        onLaunchWorkspace={handleLaunchWorkspace}
        onSaveToWorkspace={handleSaveToWorkspace}
        workspaceData={{
          name: formData.name,
          purpose: formData.purpose,
          type: formData.type,
          category: formData.category,
        }}
      />
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  Check,
  CircleCheckBig,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  HomeIcon,
  Globe,
  Smartphone,
  Code,
  Rocket,
  LineChart,
  HelpCircle,
  Users,
  Settings,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CreateWorkspaceModal({
  isCreateModalOpen,
  setIsCreateModalOpen,
}: {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    purpose: "",
    type: "",
    category: "",
  });
  const supabase = createClientSupabaseClient();

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return newWorkspace.purpose !== "";
      case 2:
        return newWorkspace.type !== "";
      case 3:
        return newWorkspace.category !== "";
      case 4:
        return newWorkspace.name.trim() !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setCreateError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCreateError(null);
    }
  };

  const resetModal = () => {
    setCurrentStep(1);
    setNewWorkspace({ name: "", purpose: "", type: "", category: "" });
    setCreateError(null);
  };

  const handleModalClose = (open: boolean) => {
    setIsCreateModalOpen(open);
    if (!open) {
      resetModal();
    }
  };

  const createWorkspace = async () => {
    if (
      !newWorkspace.name ||
      !newWorkspace.purpose ||
      !newWorkspace.type ||
      !newWorkspace.category
    ) {
      setCreateError("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create workspace
      const { data: createdWorkspace, error: workspaceError } = await supabase
        .from("workspaces")
        .insert({
          name: newWorkspace.name,
          purpose: newWorkspace.purpose,
          type: newWorkspace.type,
          category: newWorkspace.category,
          owner_id: user.id,
        })
        .select()
        .single();

      if (workspaceError || !createdWorkspace) {
        throw new Error(
          workspaceError?.message || "Failed to create workspace"
        );
      }

      // Create workspace member entry for the owner (use upsert to avoid duplicates)
      const { error: memberError } = await supabase
        .from("workspace_members")
        .upsert(
          {
            workspace_id: createdWorkspace.id, // Use the new workspace's UUID
            user_id: user.id,
            email: user.email,
            role: "owner",
            status: "active",
            joined_at: new Date().toISOString(),
          },
          {
            onConflict: "workspace_id,user_id",
          }
        );

      if (memberError) {
        console.error("❌ Failed to create workspace member:", memberError);
        throw new Error("Failed to add user to workspace");
      }

      // Create default space with the NEW workspace ID
      const { data: space, error: spaceError } = await supabase
        .from("spaces")
        .insert({
          name: "General",
          description: "Default space for general projects",
          icon: "hash",
          is_private: false,
          workspace_id: createdWorkspace.id, // <Check className="w-4 h-4" /> Using NEW workspace ID
        })
        .select()
        .single();

      if (spaceError || !space) {
        console.error("❌ Failed to create space:", spaceError);
        throw new Error(
          spaceError?.message || "Failed to create default space"
        );
      }

      // Create space member entry (use upsert to avoid duplicates)
      const { error: spaceMemberError } = await supabase
        .from("space_members")
        .upsert(
          {
            space_id: space.id,
            user_id: user.id,
            role: "admin",
          },
          {
            onConflict: "space_id,user_id",
          }
        );

      if (spaceMemberError) {
        console.error("❌ Failed to create space member:", spaceMemberError);
      }

      // Create default project with the NEW workspace ID
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: "Getting Started",
          space_id: space.id,
          workspace_id: createdWorkspace.id, // <Check className="w-4 h-4" /> Using NEW workspace ID
        })
        .select()
        .single();

      if (projectError || !project) {
        console.error("❌ Failed to create project:", projectError);
        throw new Error(
          projectError?.message || "Failed to create default project"
        );
      }

      // Create default statuses for the NEW workspace's default space
      const defaultStatuses = [
        { name: "To Do", color: "gray", position: 0, type: "space" },
        { name: "In Progress", color: "blue", position: 1, type: "space" },
        { name: "Done", color: "green", position: 2, type: "space" },
      ];

      const { error: statusError } = await supabase.from("statuses").insert(
        defaultStatuses.map((status) => ({
          ...status,
          workspace_id: createdWorkspace.id, // <Check className="w-4 h-4" /> Using NEW workspace ID
          space_id: space.id, // Associate with the default space
        }))
      );

      const {
        data: { profile },
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (
        profile?.email_notifications === "All" ||
        (profile?.email_notifications === "Default" &&
          ["workspace"].includes("workspace") &&
          ["created", "updated", "deleted"].includes("created"))
      ) {
        try {
          const response = await fetch("/api/send-email-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              eventType: "created",
              entityType: "workspace",
              entityName: newWorkspace.name,
              description: `Created workspace "${newWorkspace.name}"`,
              workspaceId: createdWorkspace.id,
            }),
          });

          const result = await response.json();

          if (result.success) {
            console.log("Test email sent successfully");
          } else {
            console.error("Failed to send test email");
          }
        } catch (error) {
          console.error("Failed to send test email");
        }
      }

      // Reset form and close modal
      resetModal();
      setIsCreateModalOpen(false);

      window.location.href = `/${createdWorkspace.workspace_id}/home`;
    } catch (err: any) {
      console.error("💥 Error creating workspace:", err);
      setCreateError(err.message || "An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              What's the purpose of your workspace?
            </h3>
            <p className="text-sm text-gray-500">
              This helps us customize your experience
            </p>
          </div>
        </div>
      </div>

      <RadioGroup
        value={newWorkspace.purpose}
        onValueChange={(value) =>
          setNewWorkspace((prev) => ({ ...prev, purpose: value }))
        }
        className="space-y-3"
      >
        <div className="group relative">
          <RadioGroupItem
            value="work"
            id="work-step"
            className="sr-only peer"
          />
          <Label
            htmlFor="work-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center peer-checked:bg-blue-200 peer-checked:scale-110 transition-transform duration-200">
                <Briefcase className="h-5 w-5 text-blue-600 peer-checked:text-blue-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-blue-900">
                  Work
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-blue-700">
                  For professional projects and teams
                </p>
              </div>
            </div>
            {newWorkspace.purpose === "work" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-blue-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>

        <div className="group relative">
          <RadioGroupItem
            value="personal"
            id="personal-step"
            className="sr-only peer"
          />
          <Label
            htmlFor="personal-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center peer-checked:bg-green-200 peer-checked:scale-110 transition-transform duration-200">
                <HomeIcon className="h-5 w-5 text-green-600 peer-checked:text-green-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-green-900">
                  Personal
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-green-700">
                  For personal projects and goals
                </p>
              </div>
            </div>
            {newWorkspace.purpose === "personal" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-green-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Code className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              What type of project are you working on?
            </h3>
            <p className="text-sm text-gray-500">
              Choose the category that best fits your project
            </p>
          </div>
        </div>
      </div>

      <RadioGroup
        value={newWorkspace.type}
        onValueChange={(value) =>
          setNewWorkspace((prev) => ({ ...prev, type: value }))
        }
        className="space-y-3"
      >
        <div className="group relative">
          <RadioGroupItem value="web" id="web-step" className="sr-only peer" />
          <Label
            htmlFor="web-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-purple-600 peer-checked:bg-purple-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center peer-checked:bg-purple-200 peer-checked:scale-110 transition-transform duration-200">
                <Globe className="h-5 w-5 text-purple-600 peer-checked:text-purple-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-purple-900">
                  Web Application
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-purple-700">
                  Websites, web apps, and online platforms
                </p>
              </div>
            </div>
            {newWorkspace.type === "web" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-purple-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>

        <div className="group relative">
          <RadioGroupItem
            value="mobile"
            id="mobile-step"
            className="sr-only peer"
          />
          <Label
            htmlFor="mobile-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center peer-checked:bg-indigo-200 peer-checked:scale-110 transition-transform duration-200">
                <Smartphone className="h-5 w-5 text-indigo-600 peer-checked:text-indigo-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-indigo-900">
                  Mobile Application
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-indigo-700">
                  iOS, Android, and cross-platform apps
                </p>
              </div>
            </div>
            {newWorkspace.type === "mobile" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-indigo-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>

        <div className="group relative">
          <RadioGroupItem
            value="saas"
            id="saas-step"
            className="sr-only peer"
          />
          <Label
            htmlFor="saas-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-orange-600 peer-checked:bg-orange-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center peer-checked:bg-orange-200 peer-checked:scale-110 transition-transform duration-200">
                <Code className="h-5 w-5 text-orange-600 peer-checked:text-orange-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-orange-900">
                  SaaS Product
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-orange-700">
                  Software as a Service platforms
                </p>
              </div>
            </div>
            {newWorkspace.type === "saas" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-orange-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              What category best describes your project?
            </h3>
            <p className="text-sm text-gray-500">
              This helps us provide relevant templates and features
            </p>
          </div>
        </div>
      </div>

      <RadioGroup
        value={newWorkspace.category}
        onValueChange={(value) =>
          setNewWorkspace((prev) => ({ ...prev, category: value }))
        }
        className="space-y-3"
      >
        <div className="group relative">
          <RadioGroupItem
            value="software development"
            id="software-step"
            className="sr-only peer"
          />
          <Label
            htmlFor="software-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-emerald-600 peer-checked:bg-emerald-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center peer-checked:bg-emerald-200 peer-checked:scale-110 transition-transform duration-200">
                <Code className="h-5 w-5 text-emerald-600 peer-checked:text-emerald-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-emerald-900">
                  Software Development
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-emerald-700">
                  Building applications and software products
                </p>
              </div>
            </div>
            {newWorkspace.category === "software development" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-emerald-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>

        <div className="group relative">
          <RadioGroupItem value="mvp" id="mvp-step" className="sr-only peer" />
          <Label
            htmlFor="mvp-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-yellow-600 peer-checked:bg-yellow-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center peer-checked:bg-yellow-200 peer-checked:scale-110 transition-transform duration-200">
                <Rocket className="h-5 w-5 text-yellow-600 peer-checked:text-yellow-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-yellow-900">
                  MVP Development
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-yellow-700">
                  Minimum viable product and startup projects
                </p>
              </div>
            </div>
            {newWorkspace.category === "mvp" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-yellow-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>

        <div className="group relative">
          <RadioGroupItem
            value="marketing"
            id="marketing-step"
            className="sr-only peer"
          />
          <Label
            htmlFor="marketing-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center peer-checked:bg-pink-200 peer-checked:scale-110 transition-transform duration-200">
                <LineChart className="h-5 w-5 text-pink-600 peer-checked:text-pink-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-pink-900">
                  Marketing Campaign
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-pink-700">
                  Marketing projects and campaigns
                </p>
              </div>
            </div>
            {newWorkspace.category === "marketing" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-pink-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>

        <div className="group relative">
          <RadioGroupItem
            value="other"
            id="other-step"
            className="sr-only peer"
          />
          <Label
            htmlFor="other-step"
            className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 cursor-pointer peer-checked:border-gray-600 peer-checked:bg-gray-50 peer-checked:shadow-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center peer-checked:bg-gray-200 peer-checked:scale-110 transition-transform duration-200">
                <HelpCircle className="h-5 w-5 text-gray-600 peer-checked:text-gray-700" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 peer-checked:text-gray-900">
                  Other
                </span>
                <p className="text-sm text-gray-500 peer-checked:text-gray-700">
                  Something else not listed above
                </p>
              </div>
            </div>
            {newWorkspace.category === "other" && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 scale-125">
                <span className="text-gray-500 text-xs">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              </div>
            )}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              What's the name of your workspace?
            </h3>
            <p className="text-sm text-gray-500">
              Choose a name that represents your project or team
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="workspace-name-step"
            className="text-sm font-medium text-gray-700"
          >
            Workspace Name
          </Label>
          <Input
            id="workspace-name-step"
            placeholder="e.g. My Awesome Project"
            value={newWorkspace.name}
            onChange={(e) =>
              setNewWorkspace((prev) => ({ ...prev, name: e.target.value }))
            }
            className="h-11"
          />
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                What you'll get:
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• A default "General" space for your projects</li>
                <li>• A "Getting Started" project to begin with</li>
                <li>• Pre-configured statuses (To Do, In Progress, Done)</li>
                <li>• Team collaboration features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const steps = [
    { number: 1, title: "Purpose", icon: Sparkles },
    { number: 2, title: "Type", icon: Code },
    { number: 3, title: "Category", icon: Settings },
    { number: 4, title: "Name", icon: Users },
  ];

  const stepDescriptions = {
    1: "Choose purpose",
    2: "Select type",
    3: "Pick category",
    4: "Set name",
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            Create New Workspace
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Set up your workspace with step-by-step configuration
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center w-full">
          {/* Progress Steps */}
          <div className="w-full">
            <div className="w-full">
              <div className="grid grid-cols-4 items-center w-full">
                {steps.map((step, idx) => {
                  const isActive = currentStep === step.number;
                  return (
                    <div
                      key={step.number}
                      className={`pb-2 border-b-2 ${
                        currentStep >= step.number
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <span
                        className={`text-xs flex-1 select-none transition-colors duration-200 flex items-center gap-2 ${
                          currentStep >= step.number
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentStep >= step.number
                              ? "bg-blue-100"
                              : "bg-gray-200"
                          }`}
                        >
                          {currentStep > step.number ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <step.icon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">
                            {step.title}
                          </span>
                          <span className="text-[10px]">
                            {
                              stepDescriptions[
                                step.number as keyof typeof stepDescriptions
                              ]
                            }
                          </span>
                        </div>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
          {createError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{createError}</AlertDescription>
            </Alert>
          )}

          {renderCurrentStep()}
        </div>

        <Separator className="mt-2" />

        {/* Footer */}
        <DialogFooter className="pt-4 gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isCreating}
              className="h-10 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNextStep() || isCreating}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={createWorkspace}
              disabled={!canProceedToNextStep() || isCreating}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => handleModalClose(false)}
            disabled={isCreating}
            className="h-10 px-4"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

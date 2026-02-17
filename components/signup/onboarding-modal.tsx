"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Target, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useOnboardingCheck } from "@/hooks/use-onboarding-check";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { nanoid } from "nanoid";
import { Badge } from "@/components/ui/badge";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  signupMethod: "email" | "google";
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  acceptTerms?: boolean;
  onGoogleSignup?: (onboardingData: any, company: string) => Promise<void>;
}

export default function OnboardingModal({
  open,
  onClose,
  signupMethod,
  firstName,
  lastName,
  email,
  password,
  acceptTerms,
  onGoogleSignup,
}: OnboardingModalProps) {
  const {
    onboardingData,
    company,
    setCompany,
    updateOnboardingData,
    validateOnboardingData,
    handleOnboardingComplete,
    resetOnboarding,
  } = useOnboardingCheck();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 4;

  const steps = [
    {
      id: 1,
      title: "Company & Team",
      description: "Basic company and team information",
      fields: ["company", "teamSize", "experienceLevel"],
    },
    {
      id: 2,
      title: "Current Workflow",
      description: "How you currently work with agile",
      fields: [
        "currentMethod",
        "storyCreationTime",
        "backlogGroomingTime",
        "planningTime",
        "storiesPerSession",
        "weeklyStoryTime",
        "weeklyGroomingTime",
        "weeklyPlanningTime",
      ],
    },
    {
      id: 3,
      title: "Tools & Challenges",
      description: "Your current tools and pain points",
      fields: ["agileTools", "biggestFrustration"],
    },
    {
      id: 4,
      title: "Discovery",
      description: "How you found SprintiQ",
      fields: ["heardAboutSprintiq", "heardAboutSprintiqOther"],
    },
  ];

  const canProceedToNextStep = () => {
    const currentStepData = steps[currentStep - 1];
    return currentStepData.fields.every((field) => {
      if (field === "company") return company.trim() !== "";
      if (field === "teamSize") return onboardingData.teamSize > 0;
      if (field === "experienceLevel")
        return onboardingData.experienceLevel !== undefined;
      if (field === "currentMethod")
        return onboardingData.currentMethod !== undefined;
      if (field === "storyCreationTime")
        return onboardingData.storyCreationTime > 0;
      if (field === "backlogGroomingTime")
        return onboardingData.backlogGroomingTime > 0;
      if (field === "planningTime") return onboardingData.planningTime > 0;
      if (field === "storiesPerSession")
        return onboardingData.storiesPerSession > 0;
      if (field === "agileTools") return onboardingData.agileTools.length > 0;
      if (field === "biggestFrustration")
        return onboardingData.biggestFrustration.trim() !== "";
      if (field === "heardAboutSprintiq")
        return onboardingData.heardAboutSprintiq !== undefined;
      if (field === "heardAboutSprintiqOther")
        return (
          onboardingData.heardAboutSprintiq !== "other" ||
          onboardingData.heardAboutSprintiqOther.trim() !== ""
        );
      return true;
    });
  };

  const canGoToPreviousStep = () => {
    return currentStep > 1;
  };

  const nextStep = () => {
    if (canProceedToNextStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (canGoToPreviousStep()) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOnboardingData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (signupMethod === "google") {
        const onboardingDataKey = `onboarding`;
        localStorage.setItem(
          onboardingDataKey,
          JSON.stringify({
            ...onboardingData,
            company,
            timestamp: Date.now(),
          })
        );

        localStorage.setItem("pendingOnboardingKey", onboardingDataKey);

        handleOnboardingComplete();

        onClose();

        // For Google signup, trigger the OAuth flow using the prop function
        if (onGoogleSignup) {
          try {
            // Pass onboarding data to the OAuth flow
            await onGoogleSignup(onboardingData, company);
          } catch (error) {
            console.error("Failed to trigger Google OAuth:", error);
          }
        } else {
          console.error("onGoogleSignup function not provided");
        }
        return;
      }

      // Email signup flow - check if we have the required signup data
      if (!firstName || !lastName || !email || !password || !acceptTerms) {
        console.error("Missing required signup data");
        return;
      }

      // First, create the user account
      const fullName = `${firstName} ${lastName}`.trim();

      // Type guard to ensure required fields are defined
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const supabase = createClientSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            company: company,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw new Error(error.message || "Failed to create account");
      }

      if (!data?.user) {
        throw new Error("No user data returned from signup");
      }

      // Check if email confirmation is required
      if (data.user.email_confirmed_at === null) {
        console.log("Email confirmation required");
      }

      // Check if user already exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected for new users
        console.error("Error checking existing user:", checkError);
        throw new Error(`Failed to check existing user: ${checkError.message}`);
      }

      if (existingUser) {
        console.log("User already exists in users table, skipping creation");
      } else {
        // Create user record in users table with upsert to handle potential duplicates
        const { error: userError } = await supabase.from("users").upsert(
          {
            id: data.user.id,
            name: fullName,
            email,
            role: "user",
            allowed: false,
            company,
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          }
        );

        if (userError) {
          console.error("Failed to create user record:", userError);
          console.error("User data being inserted:", {
            id: data.user.id,
            name: fullName,
            email,
            role: "user",
            allowed: false,
            company,
          });
          throw new Error(`Failed to create user record: ${userError.message}`);
        }
      }

      // Create registration event
      const { error: eventError } = await supabase.from("events").insert({
        event_id: "evt_" + nanoid(8),
        type: "registered",
        entity_type: "auth",
        entity_id: data.user.id,
        entity_name: fullName || email,
        user_id: data.user.id,
        description: `New user registration: ${fullName || email}`,
        metadata: {
          company: company,
          email: email,
          full_name: fullName,
        },
        is_read: false,
      });

      if (eventError) {
        console.error("Failed to create registration event:", eventError);
      }

      // Now save the onboarding data directly to user_baselines table
      const { error: baselineError } = await supabase
        .from("user_baselines")
        .insert({
          user_id: data.user.id,
          baseline_story_time_ms:
            onboardingData.storyCreationTime * 60 * 60 * 1000,
          baseline_grooming_time_ms:
            onboardingData.backlogGroomingTime * 60 * 60 * 1000,
          baseline_planning_time_ms:
            onboardingData.planningTime * 60 * 60 * 1000,
          baseline_stories_per_session: onboardingData.storiesPerSession,
          baseline_method: onboardingData.currentMethod,
          team_size: onboardingData.teamSize,
          role: onboardingData.role,
          experience_level: onboardingData.experienceLevel,
          agile_tools: onboardingData.agileTools,
          agile_tools_other: onboardingData.agileToolsOther,
          biggest_frustration: onboardingData.biggestFrustration,
          heard_about_sprintiq: onboardingData.heardAboutSprintiq,
          heard_about_sprintiq_other: onboardingData.heardAboutSprintiqOther,
          measurement_date: new Date().toISOString(),
        });

      if (baselineError) {
        console.error("Failed to save onboarding data:", baselineError);
        throw new Error(
          `Failed to save onboarding data: ${baselineError.message}`
        );
      }

      // Send signup confirmation email to user
      try {
        await fetch("/api/send-signup-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.user.id,
            userName: fullName,
            userEmail: email,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send signup confirmation email:", emailError);
      }

      try {
        await fetch("/api/send-support-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.user.id,
            userName: fullName,
            userEmail: email,
            userCompany: company,
          }),
        });
      } catch (supportEmailError) {
        console.error(
          "Failed to send support team notification:",
          supportEmailError
        );
      }

      sessionStorage.removeItem("pendingOnboardingData");

      handleOnboardingComplete();

      onClose();

      window.location.href = "/access-denied";
    } catch (error: any) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetOnboarding();
    setCurrentStep(1);
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-emerald-200">
          Step {currentStep} {steps[currentStep - 1].title} of {totalSteps}
        </h3>
        <span className="text-sm text-emerald-100/70">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>

      {/* Step Progress Bar */}
      <div className="w-full bg-emerald-950/50 rounded-full h-2 mb-4">
        <div
          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Current Step Info */}
      <div className="text-center mt-4">
        <h4 className="text-lg font-semibold text-white mb-2">
          {steps[currentStep - 1].title}
        </h4>
        <p className="text-emerald-100/80 text-sm">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                Company name *
              </label>
              <Input
                type="text"
                placeholder="Your Company"
                className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white ring-offset-transparent placeholder:text-emerald-300/50 focus:ring-white transition-all duration-200 text-sm sm:text-base rounded-xl"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Your role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                  What is your role? *
                </label>
                <Select
                  value={onboardingData.role}
                  onValueChange={(value) => updateOnboardingData("role", value)}
                >
                  <SelectTrigger className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-emerald-950 border-emerald-500 text-white">
                    <SelectItem value="Scrum Master">Scrum Master</SelectItem>
                    <SelectItem value="Product Owner">Product Owner</SelectItem>
                    <SelectItem value="Agile Coach">Agile Coach</SelectItem>
                    <SelectItem value="CTO">CTO</SelectItem>
                    <SelectItem value="Consultant">Consultant</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Size */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                  Team size *
                </label>
                <Select
                  value={onboardingData.teamSize.toString()}
                  onValueChange={(value) =>
                    updateOnboardingData("teamSize", parseInt(value))
                  }
                >
                  <SelectTrigger className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent className="bg-emerald-950 border-emerald-500 text-white">
                    <SelectItem value="1">Just me</SelectItem>
                    <SelectItem value="2">2-3 people</SelectItem>
                    <SelectItem value="4">4-6 people</SelectItem>
                    <SelectItem value="7">7-12 people</SelectItem>
                    <SelectItem value="13">13+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                Agile experience level *
              </label>
              <Select
                value={onboardingData.experienceLevel}
                onValueChange={(value) =>
                  updateOnboardingData("experienceLevel", value)
                }
              >
                <SelectTrigger className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="bg-emerald-950 border-emerald-500 text-white">
                  <SelectItem value="Beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="Intermediate">
                    Intermediate (2-5 years)
                  </SelectItem>
                  <SelectItem value="Expert">Expert (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Current Method */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                How do you currently create user stories? *
              </label>
              <Select
                value={onboardingData.currentMethod}
                onValueChange={(value) =>
                  updateOnboardingData("currentMethod", value)
                }
              >
                <SelectTrigger className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20">
                  <SelectValue placeholder="Select current method" />
                </SelectTrigger>
                <SelectContent className="bg-emerald-950 border-emerald-500 text-white">
                  <SelectItem value="Manual">
                    Manually typing each story
                  </SelectItem>
                  <SelectItem value="Templates">Using templates</SelectItem>
                  <SelectItem value="Other Tools">
                    Other tools (Jira, Linear, etc.)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Estimates - Per Story */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-emerald-200 mb-4">
                Time Estimates per week
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                    Story creation time <br /> (hours) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="15"
                    className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white ring-offset-transparent placeholder:text-emerald-300/50 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20"
                    value={onboardingData.storyCreationTime || ""}
                    onChange={(e) =>
                      updateOnboardingData(
                        "storyCreationTime",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                    Backlog grooming time <br /> (hours) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="30"
                    className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white ring-offset-transparent placeholder:text-emerald-300/50 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20"
                    value={onboardingData.backlogGroomingTime || ""}
                    onChange={(e) =>
                      updateOnboardingData(
                        "backlogGroomingTime",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                    Planning time <br /> (hours) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="60"
                    className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white ring-offset-transparent placeholder:text-emerald-300/50 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20"
                    value={onboardingData.planningTime || ""}
                    onChange={(e) =>
                      updateOnboardingData(
                        "planningTime",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Stories per session */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                How many stories do you typically create per week? *
              </label>
              <Input
                type="number"
                min="0"
                placeholder="5"
                className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white ring-offset-transparent placeholder:text-emerald-300/50 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20"
                value={onboardingData.storiesPerSession || ""}
                onChange={(e) =>
                  updateOnboardingData(
                    "storiesPerSession",
                    parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Agile Tools - Multi-select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                What agile tools do you currently use? * (Select all that apply)
              </label>

              {/* Selected Tools Display */}
              {onboardingData.agileTools.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {onboardingData.agileTools.map((tool, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-emerald-600/20 text-emerald-200 border-emerald-500/30 hover:bg-emerald-600/30"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedTools = onboardingData.agileTools.filter(
                            (_, i) => i !== index
                          );
                          updateOnboardingData("agileTools", updatedTools);
                        }}
                        className="ml-2 hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tool Selection */}
              <Select
                onValueChange={(value) => {
                  if (value && !onboardingData.agileTools.includes(value)) {
                    const updatedTools = [...onboardingData.agileTools, value];
                    updateOnboardingData("agileTools", updatedTools);
                  }
                }}
                value=""
              >
                <SelectTrigger className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl">
                  <SelectValue placeholder="Add a tool..." />
                </SelectTrigger>
                <SelectContent className="bg-emerald-950 border-emerald-500 text-white">
                  {[
                    "Jira",
                    "Linear",
                    "Monday.com",
                    "Asana",
                    "Trello",
                    "Azure DevOps",
                    "ClickUp",
                    "Notion",
                    "GitHub Projects",
                    "TeamGantt",
                    "Wrike",
                    "Smartsheet",
                    "None - we don't use tools yet",
                  ].map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      disabled={onboardingData.agileTools.includes(option)}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-sm text-emerald-200/70">
                Selected {onboardingData.agileTools.length} tool
                {onboardingData.agileTools.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Biggest Frustration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                What's your biggest frustration with current agile processes? *
              </label>
              <Select
                value={onboardingData.biggestFrustration}
                onValueChange={(value) =>
                  updateOnboardingData("biggestFrustration", value)
                }
                required
              >
                <SelectTrigger className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20">
                  <SelectValue placeholder="Select your biggest frustration..." />
                </SelectTrigger>
                <SelectContent className="bg-emerald-950 border-emerald-500 text-white">
                  {[
                    {
                      value: "Takes too much time",
                    },
                    {
                      value: "Inconsistent quality across team",
                    },
                    {
                      value: "Poor acceptance criteria",
                    },
                    {
                      value: "Difficulty prioritizing by value",
                    },
                    {
                      value: "Too many alignment meetings",
                    },
                    {
                      value: "Stories lack technical detail",
                    },
                  ].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* How did you hear about SprintiQ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-200 uppercase tracking-wide">
                How did you hear about SprintiQ? *
              </label>
              <Select
                value={onboardingData.heardAboutSprintiq}
                onValueChange={(value) =>
                  updateOnboardingData("heardAboutSprintiq", value)
                }
              >
                <SelectTrigger className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-emerald-950 border-emerald-500 text-white">
                  <SelectItem value="Google Search">Google Search</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Youtube">Youtube</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {onboardingData.heardAboutSprintiq === "other" && (
                <Input
                  type="text"
                  placeholder="Please specify..."
                  className="h-11 sm:h-12 bg-slate-800/50 border-emerald-500/30 text-white placeholder:text-emerald-300/50 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20"
                  value={onboardingData.heardAboutSprintiqOther}
                  onChange={(e) =>
                    updateOnboardingData(
                      "heardAboutSprintiqOther",
                      e.target.value
                    )
                  }
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-emerald-900/95 to-slate-900 text-white border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-emerald-950/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-500/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-emerald-400/60">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>

        <div className="relative z-10">
          {/* Dialog Title for accessibility */}
          <DialogTitle className="sr-only">
            Complete Your Onboarding
          </DialogTitle>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              Complete Your Onboarding
            </h2>
            <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed">
              Help us personalize your SprintiQ experience with this quick
              survey. Your responses will help us tailor the platform to your
              team's specific needs.
            </p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              onClick={prevStep}
              disabled={!canGoToPreviousStep()}
              variant="outline"
              className="border-emerald-500/30 text-emerald-300 bg-transparent hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-white h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNextStep()}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !validateOnboardingData() ||
                    !onboardingData.heardAboutSprintiq
                  }
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Completing...
                    </div>
                  ) : (
                    "Complete & Continue"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

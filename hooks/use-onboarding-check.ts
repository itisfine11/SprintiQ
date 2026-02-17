import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

interface OnboardingData {
  storyCreationTime: number;
  backlogGroomingTime: number;
  planningTime: number;
  storiesPerSession: number;
  currentMethod: string;
  teamSize: number;
  experienceLevel: string;
  agileTools: string[];
  agileToolsOther: string;
  biggestFrustration: string;
  heardAboutSprintiq: string;
  heardAboutSprintiqOther: string;
  role: string;
}

const initialOnboardingData: OnboardingData = {
  storyCreationTime: 0,
  backlogGroomingTime: 0,
  planningTime: 0,
  storiesPerSession: 0,
  currentMethod: "",
  teamSize: 1,
  experienceLevel: "",
  agileTools: [],
  agileToolsOther: "",
  biggestFrustration: "",
  heardAboutSprintiq: "",
  heardAboutSprintiqOther: "",
  role: "",
};

export const useOnboardingCheck = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(
    initialOnboardingData
  );
  const [company, setCompany] = useState("");
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { signInWithGoogle } = useAuth();

  const updateOnboardingData = (field: keyof OnboardingData, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

  const validateOnboardingData = (): boolean => {
    return (
      company.trim() !== "" &&
      onboardingData.teamSize > 0 &&
      onboardingData.experienceLevel !== undefined &&
      onboardingData.currentMethod !== undefined &&
      onboardingData.storyCreationTime > 0 &&
      onboardingData.backlogGroomingTime > 0 &&
      onboardingData.planningTime > 0 &&
      onboardingData.storiesPerSession > 0 &&
      onboardingData.agileTools.length > 0 &&
      onboardingData.biggestFrustration.trim() !== "" &&
      onboardingData.heardAboutSprintiq !== undefined &&
      onboardingData.role !== undefined
    );
  };

  const handleOnboardingComplete = () => {
    if (validateOnboardingData()) {
      setIsOnboardingComplete(true);
      sessionStorage.setItem(
        "pendingOnboardingData",
        JSON.stringify({
          ...onboardingData,
          company,
        })
      );
    }
  };

  const handleGoogleSignup = async () => {
    if (!isOnboardingComplete) {
      setShowOnboarding(true);
      return;
    }

    try {
      // Store onboarding data for the OAuth callback to use
      sessionStorage.setItem(
        "pendingOnboardingData",
        JSON.stringify({
          ...onboardingData,
          company,
        })
      );

      // Proceed with Google OAuth
      await signInWithGoogle();
    } catch (error) {
      console.error("Google signup failed:", error);
      throw error;
    }
  };

  const triggerGoogleOAuth = async (
    onboardingData?: OnboardingData,
    company?: string
  ) => {
    try {
      await signInWithGoogle(undefined, undefined, onboardingData, company);
    } catch (error) {
      console.error("Google OAuth failed:", error);
      throw error;
    }
  };

  const resetOnboarding = () => {
    setOnboardingData(initialOnboardingData);
    setCompany("");
    setIsOnboardingComplete(false);
    setShowOnboarding(false);
    sessionStorage.removeItem("pendingOnboardingData");
  };

  return {
    onboardingData,
    setOnboardingData,
    company,
    setCompany,
    isOnboardingComplete,
    showOnboarding,
    setShowOnboarding,
    updateOnboardingData,
    validateOnboardingData,
    handleOnboardingComplete,
    handleGoogleSignup,
    triggerGoogleOAuth,
    resetOnboarding,
  };
};

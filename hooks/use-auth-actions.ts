"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { 
  signInAction, 
  signUpAction, 
  signOutAction, 
  getSessionAction, 
  getUserAction 
} from "@/lib/auth-actions";

export function useAuthActions() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useEnhancedToast();

  const signIn = async (email: string, password: string) => {
    startTransition(async () => {
      try {
        const result = await signInAction(email, password);
        
        if (result && result.error) {
          toast({
            title: "Sign in failed",
            description: result.error,
            variant: "destructive",
          });
        } else if (result && result.success) {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "Sign in failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    });
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { full_name?: string; company?: string }
  ) => {
    startTransition(async () => {
      try {
        const result = await signUpAction(email, password, metadata);
        
        if (result && result.error) {
          toast({
            title: "Sign up failed",
            description: result.error,
            variant: "destructive",
          });
        } else if (result && result.success) {
          toast({
            title: "Account created successfully",
            description: "Please check your email to verify your account",
          });
          router.push("/signin");
        }
      } catch (error) {
        toast({
          title: "Sign up failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    });
  };

  const signOut = async () => {
    startTransition(async () => {
      try {
        const result = await signOutAction();
        
        if (result && result.error) {
          toast({
            title: "Sign out failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signed out successfully",
            description: "Come back soon!",
          });
          router.push("/signin");
        }
      } catch (error) {
        toast({
          title: "Sign out failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    });
  };

  const getSession = async () => {
    try {
      return await getSessionAction();
    } catch (error) {
      console.error("Get session error:", error);
      return { error: "Failed to get session" };
    }
  };

  const getUser = async () => {
    try {
      return await getUserAction();
    } catch (error) {
      console.error("Get user error:", error);
      return { error: "Failed to get user" };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    getSession,
    getUser,
    isPending,
  };
} 
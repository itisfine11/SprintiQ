"use client";

import type React from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { Database } from "@/lib/database.types";
import type { User, Session } from "@supabase/supabase-js";
import { signInAction, signUpAction, signOutAction } from "@/lib/auth-actions";
import { nanoid } from "nanoid";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
    mcpToken?: string,
    redirectUrl?: string
  ) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string; company?: string }
  ) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signInWithGoogle: (
    mcpToken?: string,
    redirectUrl?: string,
    onboardingData?: any,
    company?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (
    email: string,
    password: string,
    mcpToken?: string,
    redirectUrl?: string
  ) => {
    // Check if user is allowed before attempting sign in
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("allowed")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();
    if (userError || !userRecord || userRecord.allowed === false) {
      router.push("/access-denied");
      return {
        error: { message: "Access denied. Your account is not yet allowed." },
        data: null,
      };
    }

    // Use server action instead of direct auth call
    const result = await signInAction(email, password);

    if (result && !result.error && result.user) {
      // If MCP token is provided, redirect to MCP callback
      if (mcpToken && redirectUrl) {
        const mcpCallbackUrl = new URL(redirectUrl);
        mcpCallbackUrl.searchParams.set("mcp_token", mcpToken);
        mcpCallbackUrl.searchParams.set("email", email);
        window.location.href = mcpCallbackUrl.toString();
      } else {
        router.push("/dashboard");
      }
    }

    // Convert server action result to expected format
    if (result) {
      if (result.error) {
        return { error: result.error, data: null };
      } else if (result.user) {
        return { error: null, data: result.user };
      }
    }
    return { error: "An unexpected error occurred", data: null };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string; company?: string }
  ) => {
    // Use server action instead of direct auth call
    const result = await signUpAction(email, password, metadata);

    if (result && !result.error && result.user) {
      // Insert into profiles and users table
      if (metadata) {
        await supabase.from("profiles").insert({
          id: result.user.id,
          email,
          full_name: metadata.full_name,
          company: metadata.company,
        });

        await supabase.from("users").insert({
          id: result.user.id,
          name: metadata.full_name,
          email,
          role: "user",
          allowed: false,
          company: metadata.company,
        });

        // Create registration event
        await supabase.from("events").insert({
          event_id: "evt_" + nanoid(8),
          type: "registered",
          entity_type: "auth",
          entity_id: result.user.id,
          entity_name: metadata.full_name || email,
          user_id: result.user.id,
          description: `New user registration: ${metadata.full_name || email}`,
          metadata: {
            company: metadata.company,
            email: email,
            full_name: metadata.full_name,
          },
          is_read: false,
        });
      }

      // Send signup confirmation email to user
      try {
        await fetch("/api/send-signup-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: result.user.id,
            userName: metadata?.full_name || "",
            userEmail: email,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send signup confirmation email:", emailError);
        // Don't fail the registration if email fails
      }

      // Send notification to support team
      try {
        await fetch("/api/send-support-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: result.user.id,
            userName: metadata?.full_name || "",
            userEmail: email,
            userCompany: metadata?.company || "",
          }),
        });
      } catch (supportEmailError) {
        console.error(
          "Failed to send support team notification:",
          supportEmailError
        );
        // Don't fail the registration if email fails
      }

      // Always redirect to access denied after signup
      router.push("/access-denied");
    }

    // Convert server action result to expected format
    if (result) {
      if (result.error) {
        return { error: result.error, data: null };
      } else if (result.user) {
        return { error: null, data: result.user };
      }
    }
    return { error: "An unexpected error occurred", data: null };
  };

  const signInWithGoogle = async (
    mcpToken?: string,
    redirectUrl?: string,
    onboardingData?: any,
    company?: string
  ) => {
    try {
      // Build the callback URL with MCP parameters if provided
      let callbackUrl = `${window.location.origin}/auth/callback`;

      if (mcpToken && redirectUrl) {
        const params = new URLSearchParams();
        params.set("mcp_token", mcpToken);
        params.set("redirect", redirectUrl);
        callbackUrl += `?${params.toString()}`;
      }

      // Add onboarding data to callback URL if provided
      if (onboardingData && company) {
        const separator = callbackUrl.includes("?") ? "&" : "?";
        const onboardingParams = new URLSearchParams();
        onboardingParams.set("onboarding_data", JSON.stringify(onboardingData));
        onboardingParams.set("company", company);
        callbackUrl += `${separator}${onboardingParams.toString()}`;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Google OAuth error:", error);
      throw new Error(
        "Google sign-in is not available. Please contact support or use email sign-in."
      );
    }
  };

  const signOut = async () => {
    // Use server action instead of direct auth call
    await signOutAction();
    router.push("/");
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

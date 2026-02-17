import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  sendSignupConfirmationEmail,
  sendSupportTeamNotification,
} from "@/lib/email-service-server";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const mcpToken = requestUrl.searchParams.get("mcp_token");
  const redirectUrl = requestUrl.searchParams.get("redirect");
  const onboardingDataParam = requestUrl.searchParams.get("onboarding_data");
  const company = requestUrl.searchParams.get("company");
  const origin = requestUrl.origin;

  console.log(`[Auth Callback] Received request with params:`, {
    code: !!code,
    mcpToken,
    redirectUrl,
    hasOnboardingData: !!onboardingDataParam,
    company,
    origin,
  });

  if (code) {
    const supabase = await createServerSupabaseClient();

    console.log(`[Auth Callback] Exchanging code for session...`);
    const { data: sessionData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);

      // If this is an MCP flow, redirect to MCP callback with error
      if (mcpToken && redirectUrl) {
        console.log(
          `[Auth Callback] MCP flow detected, redirecting to MCP callback with error`
        );
        const mcpCallbackUrl = new URL(redirectUrl);
        mcpCallbackUrl.searchParams.set("mcp_token", mcpToken);
        mcpCallbackUrl.searchParams.set("error", "auth_failed");
        mcpCallbackUrl.searchParams.set("error_description", error.message);
        return NextResponse.redirect(mcpCallbackUrl.toString());
      }

      return NextResponse.redirect(new URL("/signin?error=auth_error", origin));
    }

    console.log(`[Auth Callback] Session exchange successful`);

    // After successful authentication, check if user's email is authorized
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log(`[Auth Callback] User authenticated:`, user.email);

      // Check if user row exists
      const { data: userRow } = await supabase
        .from("users")
        .select("id, allowed")
        .eq("id", user.id)
        .maybeSingle();

      if (!userRow) {
        console.log(
          `[Auth Callback] Creating new user record for:`,
          user.email
        );
        await supabase.from("users").insert({
          id: user.id,
          name: user.user_metadata?.full_name || "",
          email: user.email,
          allowed: false,
          role: "user",
          company: company || user.user_metadata?.company || "",
        });

        // Create registration event for Google OAuth users
        await supabase.from("events").insert({
          event_id: "evt_" + nanoid(8),
          type: "registered",
          entity_type: "auth",
          entity_id: user.id,
          entity_name: user.user_metadata?.full_name || user.email || "",
          user_id: user.id,
          description: `New user registration via Google OAuth: ${
            user.user_metadata?.full_name || user.email
          }`,
          metadata: {
            company: company || user.user_metadata?.company || "",
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            auth_method: "google_oauth",
          },
          is_read: false,
        });

        const onboardingData = JSON.parse(onboardingDataParam || "{}");

        // Only insert user_baselines if we have valid onboarding data
        if (onboardingDataParam && onboardingData.storyCreationTime) {
          await supabase.from("user_baselines").insert({
            user_id: user.id,
            baseline_story_time_ms:
              onboardingData.storyCreationTime * 60 * 60 * 1000,
            baseline_grooming_time_ms:
              onboardingData.backlogGroomingTime * 60 * 60 * 1000,
            baseline_planning_time_ms:
              onboardingData.planningTime * 60 * 60 * 1000,
            role: onboardingData.role,
            baseline_stories_per_session: onboardingData.storiesPerSession,
            baseline_method: onboardingData.currentMethod,
            team_size: onboardingData.teamSize,
            experience_level: onboardingData.experienceLevel,
            agile_tools: onboardingData.agileTools,
            agile_tools_other: onboardingData.agileToolsOther,
            biggest_frustration: onboardingData.biggestFrustration,
            heard_about_sprintiq: onboardingData.heardAboutSprintiq,
            heard_about_sprintiq_other: onboardingData.heardAboutSprintiqOther,
            measurement_date: new Date().toISOString(),
          });
        }

        // Send signup confirmation email for new Google OAuth users
        try {
          await sendSignupConfirmationEmail(
            user.id,
            user.user_metadata?.full_name || "",
            user.email || ""
          );
        } catch (emailError) {
          console.error(
            "Failed to send signup confirmation email:",
            emailError
          );
          // Don't fail the authentication if email fails
        }

        // Send notification to support team for new Google OAuth users
        try {
          await sendSupportTeamNotification(
            user.id,
            user.user_metadata?.full_name || "",
            user.email || "",
            company || user.user_metadata?.company || ""
          );
        } catch (supportEmailError) {
          console.error(
            "Failed to send support team notification:",
            supportEmailError
          );
          // Don't fail the authentication if email fails
        }
      }

      // If MCP token is provided, redirect to MCP callback
      if (mcpToken && redirectUrl && user.email) {
        console.log(
          `[Auth Callback] MCP flow detected, redirecting to MCP callback`
        );
        const mcpCallbackUrl = new URL(redirectUrl);
        mcpCallbackUrl.searchParams.set("mcp_token", mcpToken);
        mcpCallbackUrl.searchParams.set("email", user.email);
        // Don't pass the code since it was already exchanged

        return NextResponse.redirect(mcpCallbackUrl.toString());
      }

      // For regular sign-in, check if user is allowed
      if (userRow && userRow.allowed === false) {
        console.log(
          `[Auth Callback] User not allowed, redirecting to access-denied`
        );
        return NextResponse.redirect(new URL("/access-denied", origin));
      }
    }
  }

  // URL to redirect to after sign in process completes
  console.log(`[Auth Callback] Redirecting to dashboard`);
  return NextResponse.redirect(new URL("/dashboard", origin));
}

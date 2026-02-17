import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  sendSignupConfirmationEmail,
  sendSupportTeamNotification,
} from "@/lib/email-service-server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name, email, company, role, onboardingData } = body;

  const supabase = await createServerSupabaseClient();

  // Insert user info with allowed: false
  const { error: userError } = await supabase.from("users").insert({
    id,
    name,
    email,
    company,
    role,
    allowed: false,
  });

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // Save onboarding survey data to user_baselines table
  if (onboardingData) {
    const { error: baselineError } = await supabase
      .from("user_baselines")
      .insert({
        user_id: id,
        baseline_story_time_ms: onboardingData.storyCreationTime * 60 * 1000,
        baseline_grooming_time_ms:
          onboardingData.backlogGroomingTime * 60 * 1000,
        baseline_planning_time_ms: onboardingData.planningTime * 60 * 1000,
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

    if (baselineError) {
      console.error("Failed to save onboarding data:", baselineError);
      // Don't fail the registration if onboarding data fails to save
    }
  }

  // Send signup confirmation email to user
  try {
    await sendSignupConfirmationEmail(id, name, email);
  } catch (emailError) {
    console.error("Failed to send signup confirmation email:", emailError);
    // Don't fail the registration if email fails
  }

  // Send notification email to support team
  try {
    await sendSupportTeamNotification(id, name, email, company || "");
  } catch (supportEmailError) {
    console.error(
      "Failed to send support team notification:",
      supportEmailError
    );
    // Don't fail the registration if email fails
  }

  return NextResponse.json({ success: true });
}

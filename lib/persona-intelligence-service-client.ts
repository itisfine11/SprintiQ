import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface PersonaAttributes {
  techSavviness: number;
  role: string;
  domain: string;
  usageFrequency: "daily" | "weekly" | "monthly";
  priorityLevel: "high" | "medium" | "low";
  confidence: number;
}

export interface TAWOSPersonaPattern {
  domain: string;
  averageTechSavviness: number;
  commonRoles: string[];
  successPatterns: string[];
  completionRate: number;
  sampleSize: number;
}

/**
 * Detect persona attributes from description using pattern matching
 * Client-side version that doesn't use server components
 */
export async function detectPersonaAttributesClient(
  description: string,
  workspaceId: string
): Promise<PersonaAttributes> {
  try {
    const supabase = createClientComponentClient();

    // Pattern matching for tech savviness
    const techSavviness = detectTechSavviness(description);

    // Pattern matching for role
    const role = detectRole(description);

    // Pattern matching for domain
    const domain = detectDomain(description);

    // Pattern matching for usage frequency
    const usageFrequency = detectUsageFrequency(description);

    // Pattern matching for priority level
    const priorityLevel = detectPriorityLevel(description);

    // Calculate confidence based on pattern matches
    const confidence = calculateConfidence(description, {
      techSavviness,
      role,
      domain,
      usageFrequency,
      priorityLevel,
    });

    return {
      techSavviness,
      role,
      domain,
      usageFrequency,
      priorityLevel,
      confidence,
    };
  } catch (error) {
    console.error("Error detecting persona attributes:", error);
    // Return default values on error
    return {
      techSavviness: 3,
      role: "",
      domain: "",
      usageFrequency: "weekly",
      priorityLevel: "medium",
      confidence: 0,
    };
  }
}

/**
 * Get subscription limits for user (client-side)
 */
export async function getUserPersonaLimitsClient(userId: string): Promise<{
  current: number;
  limit: number;
  tier: string;
  canCreate: boolean;
}> {
  try {
    const supabase = createClientComponentClient();

    // Get user subscription info
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_limits")
      .eq("id", userId)
      .single();

    const tier = profile?.subscription_tier || "free";

    // Get current persona count across all user's workspaces
    const { count: current } = await supabase
      .from("personas")
      .select("*", { count: "exact", head: true })
      .eq("created_by", userId);

    // Define limits based on tier
    const limits = {
      free: 3,
      starter: 5,
      professional: 999999, // Effectively unlimited
      enterprise: 999999,
    };

    const limit = limits[tier as keyof typeof limits] || 3;

    return {
      current: current || 0,
      limit,
      tier,
      canCreate: (current || 0) < limit,
    };
  } catch (error) {
    console.error("Error getting user limits:", error);
    return { current: 0, limit: 3, tier: "free", canCreate: true };
  }
}

// Helper functions for pattern detection
function detectTechSavviness(description: string): number {
  const text = description.toLowerCase();

  // Expert patterns
  if (
    /expert|advanced|senior|architect|lead|principal|staff/i.test(text) ||
    /python|java|javascript|typescript|react|node|docker|kubernetes|aws|azure|gcp/i.test(
      text
    )
  ) {
    return 5;
  }

  // Advanced patterns
  if (
    /developer|engineer|programmer|coder|technical|professional/i.test(text) ||
    /api|database|backend|frontend|fullstack|devops/i.test(text)
  ) {
    return 4;
  }

  // Intermediate patterns
  if (
    /intermediate|moderate|comfortable|familiar|experienced/i.test(text) ||
    /analyst|manager|coordinator|specialist/i.test(text)
  ) {
    return 3;
  }

  // Novice patterns
  if (
    /novice|beginner|basic|entry|junior|assistant/i.test(text) ||
    /user|customer|client|business|non-technical/i.test(text)
  ) {
    return 2;
  }

  // Beginner patterns
  if (/beginner|basic|simple|easy|user-friendly|intuitive/i.test(text)) {
    return 1;
  }

  return 3; // Default to intermediate
}

function detectRole(description: string): string {
  const text = description.toLowerCase();

  // Technical roles
  if (/data scientist|ml engineer|machine learning/i.test(text))
    return "Data Scientist";
  if (/software developer|programmer|coder|engineer/i.test(text))
    return "Software Developer";
  if (/devops|infrastructure|system admin/i.test(text))
    return "DevOps Engineer";
  if (/frontend|ui|ux|designer/i.test(text)) return "Frontend Developer";
  if (/backend|api|server/i.test(text)) return "Backend Developer";
  if (/fullstack|full stack/i.test(text)) return "Full Stack Developer";

  // Business roles
  if (/product manager|pm/i.test(text)) return "Product Manager";
  if (/business analyst|ba/i.test(text)) return "Business Analyst";
  if (/project manager|proj mgr/i.test(text)) return "Project Manager";
  if (/founder|ceo|executive|director/i.test(text)) return "Executive";
  if (/startup|entrepreneur/i.test(text)) return "Startup Founder";

  // Industry-specific roles
  if (/healthcare|medical|clinical/i.test(text))
    return "Healthcare Professional";
  if (/finance|banking|fintech/i.test(text)) return "Financial Professional";
  if (/education|teacher|professor/i.test(text)) return "Educator";
  if (/retail|ecommerce|commerce/i.test(text)) return "E-commerce Manager";

  return "";
}

function detectDomain(description: string): string {
  const text = description.toLowerCase();

  if (/fintech|finance|banking|trading|payment/i.test(text)) return "Fintech";
  if (/healthcare|medical|clinical|hospital|pharma/i.test(text))
    return "Healthcare";
  if (/ecommerce|retail|commerce|shopping/i.test(text)) return "E-commerce";
  if (/education|edtech|learning|school|university/i.test(text))
    return "Education";
  if (/enterprise|corporate|large|fortune/i.test(text)) return "Enterprise";
  if (/startup|small|early-stage|seed/i.test(text)) return "Startup";
  if (/manufacturing|iot|industrial/i.test(text)) return "Manufacturing";
  if (/saas|software|tech|technology/i.test(text)) return "Technology";

  return "";
}

function detectUsageFrequency(
  description: string
): "daily" | "weekly" | "monthly" {
  const text = description.toLowerCase();

  if (/daily|every day|day-to-day|routine|regular/i.test(text)) return "daily";
  if (/weekly|every week|week-to-week|periodic/i.test(text)) return "weekly";
  if (/monthly|every month|quarterly|occasional/i.test(text)) return "monthly";

  // Default based on role patterns
  if (/developer|engineer|scientist|analyst/i.test(text)) return "daily";
  if (/manager|director|executive/i.test(text)) return "weekly";

  return "weekly"; // Default
}

function detectPriorityLevel(description: string): "high" | "medium" | "low" {
  const text = description.toLowerCase();

  if (/critical|urgent|high priority|important|essential/i.test(text))
    return "high";
  if (/low priority|optional|nice to have|future/i.test(text)) return "low";

  // Default based on role patterns
  if (/executive|director|ceo|founder/i.test(text)) return "high";
  if (/assistant|junior|entry/i.test(text)) return "low";

  return "medium"; // Default
}

function calculateConfidence(
  description: string,
  attributes: {
    techSavviness: number;
    role: string;
    domain: string;
    usageFrequency: "daily" | "weekly" | "monthly";
    priorityLevel: "high" | "medium" | "low";
  }
): number {
  let confidence = 0;
  let totalChecks = 0;

  // Check description length
  if (description.length > 50) confidence += 0.2;
  if (description.length > 100) confidence += 0.1;
  totalChecks += 1;

  // Check if role was detected
  if (attributes.role) confidence += 0.3;
  totalChecks += 1;

  // Check if domain was detected
  if (attributes.domain) confidence += 0.2;
  totalChecks += 1;

  // Check for technical keywords
  const technicalKeywords =
    /developer|engineer|scientist|analyst|manager|director|executive|founder/i;
  if (technicalKeywords.test(description)) confidence += 0.2;
  totalChecks += 1;

  // Check for industry keywords
  const industryKeywords =
    /tech|healthcare|finance|education|retail|manufacturing|startup|enterprise/i;
  if (industryKeywords.test(description)) confidence += 0.1;
  totalChecks += 1;

  return Math.min(confidence, 1.0); // Cap at 100%
}

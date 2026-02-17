import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/layout";
import UserSurveyClient from "@/components/admin/user-survey";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Survey - SprintiQ",
  description: "SprintiQ User Survey page",
};

export default async function UserSurveyPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch user baseline data
  const { data: userBaselines, error } = await supabase
    .from("user_baselines")
    .select("*")
    .order("measurement_date", { ascending: false });

  // Fetch user data from profiles table
  let userData: any = {};
  if (userBaselines && userBaselines.length > 0) {
    const userIds = [...new Set(userBaselines.map((b) => b.user_id))];

    // Fetch profiles data using user_ids
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url")
      .in("id", userIds);

    if (!profilesError && profiles) {
      userData = profiles.reduce((acc, profile) => {
        acc[profile.id] = {
          id: profile.id,
          email: profile.email,
          avatar_url: profile.avatar_url,
          user_metadata: {
            full_name: profile.full_name,
            name: profile.full_name,
          },
        };
        return acc;
      }, {} as any);
    } else {
      console.error("Error fetching profiles:", profilesError);
    }
  }

  if (error) {
    console.error("Error fetching user baselines:", error);
  }

  return (
    <AdminLayout>
      <UserSurveyClient
        userBaselines={userBaselines || []}
        userData={userData}
        error={error?.message}
      />
    </AdminLayout>
  );
}

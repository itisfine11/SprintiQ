import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/layout";
import AdminEventsComponent from "@/components/admin/events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - SprintiQ",
  description: "SprintiQ Events page",
};

export default async function AdminEventsPage() {
  const supabase = await createServerSupabaseClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/signin");
  }

  // Fetch events data on the server
  let events = [];
  let error = null;
  let totalCount = 0;
  let workspaces: any[] = [];
  let users: any[] = [];

  try {
    // Get total count of registration events
    const { count } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("type", "registered")
      .eq("entity_type", "auth");

    totalCount = count || 0;

    // Get registration events with pagination
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("type", "registered")
      .eq("entity_type", "auth")
      .order("created_at", { ascending: false })
      .limit(20);

    if (eventsError) {
      error = "Failed to load events";
      console.error("Events error:", eventsError);
    } else {
      events = eventsData || [];
    }

    // Get workspaces for filters
    const { data: workspacesData } = await supabase
      .from("workspaces")
      .select("id, name, workspace_id")
      .order("name");

    workspaces = workspacesData || [];

    // Get users for filters
    const { data: usersData } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .order("full_name");

    users = usersData || [];
  } catch (err) {
    error = "Failed to load data";
    console.error("Server error:", err);
  }

  return (
    <AdminLayout>
      <AdminEventsComponent
        initialEvents={events}
        initialTotalCount={totalCount}
        initialWorkspaces={workspaces}
        initialUsers={users}
        error={error}
      />
    </AdminLayout>
  );
}

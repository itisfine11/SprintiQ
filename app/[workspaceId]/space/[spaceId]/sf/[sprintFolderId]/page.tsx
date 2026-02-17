import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import SprintFolderView from "@/components/workspace/views/sprint-folder-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sprint Folder - SprintiQ",
  description: "SprintiQ Sprint folder page",
};

interface SprintFolderPageProps {
  params: {
    workspaceId: string;
    spaceId: string;
    sprintFolderId: string;
  };
}

export default async function SprintFolderPage({
  params,
}: SprintFolderPageProps) {
  const supabase = await createServerSupabaseClient();
  const resolvedParams = await params;

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/signin");
  }

  // Fetch the workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("workspace_id", resolvedParams.workspaceId)
    .is("deleted_at", null)
    .single();

  if (!workspace) {
    notFound();
  }

  // Check if user is a member of the workspace (use workspace.id, not workspace_id)
  const { data: workspaceMember } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!workspaceMember) {
    redirect("/auth/signin");
  }

  // Fetch the space
  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("space_id", resolvedParams.spaceId)
    .eq("workspace_id", workspace.id)
    .is("deleted_at", null)
    .single();

  if (!space) {
    notFound();
  }

  // Fetch the sprint folder with sprints
  const { data: sprintFolder } = await supabase
    .from("sprint_folders")
    .select(
      `
      *,
      days!sprint_folders_sprint_start_day_id_fkey (*),
      sprints (*)
    `
    )
    .eq("sprint_folder_id", resolvedParams.sprintFolderId)
    .eq("space_id", space.id)
    .is("deleted_at", null)
    .single();

  if (!sprintFolder) {
    notFound();
  }

  // Fetch tasks for each sprint separately to avoid complex joins
  const sprintsWithTasks = await Promise.all(
    sprintFolder.sprints
      .filter((sprint: any) => !sprint.deleted_at)
      .map(async (sprint: any) => {
        const { data: tasks } = await supabase
          .from("tasks")
          .select(
            `
          *,
          status:statuses (*),
          assignee:profiles!tasks_assignee_id_fkey (
            id,
            full_name,
            avatar_url,
            email
          )
        `
          )
          .eq("sprint_id", sprint.id)
          .is("deleted_at", null);

        return {
          ...sprint,
          tasks: tasks || [],
        };
      })
  );

  const sprintFolderWithTasks = {
    ...sprintFolder,
    sprints: sprintsWithTasks,
  };

  // Fetch all statuses for the workspace to calculate progress
  const { data: statuses } = await supabase
    .from("statuses")
    .select(
      `
      *,
      status_type:status_types (*)
    `
    )
    .eq("workspace_id", workspace.id)
    .is("deleted_at", null)
    .order("position", { ascending: true });

  // Fetch all status types for reference
  const { data: statusTypes } = await supabase
    .from("status_types")
    .select("*")
    .order("name", { ascending: true });

  // Fetch all spaces for the workspace (needed for sidebar)
  const { data: spaces } = await supabase
    .from("spaces")
    .select(
      `
      *,
      projects (*),
      sprint_folders (
        *,
        sprints (*)
      )
    `
    )
    .eq("workspace_id", workspace.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (!spaces) {
    notFound();
  }

  // Filter out soft-deleted projects, sprint folders, and sprints from spaces data
  const filteredSpaces = spaces.map((space: any) => ({
    ...space,
    projects: (space.projects || []).filter(
      (project: any) => !project.deleted_at
    ),
    sprint_folders: (space.sprint_folders || [])
      .map((sf: any) => ({
        ...sf,
        sprints: (sf.sprints || []).filter((sprint: any) => !sprint.deleted_at),
      }))
      .filter((sf: any) => !sf.deleted_at),
  }));

  return (
    <SprintFolderView
      workspace={workspace}
      space={space}
      sprintFolder={sprintFolderWithTasks}
      spaces={filteredSpaces}
      statuses={statuses || []}
      statusTypes={statusTypes || []}
    />
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

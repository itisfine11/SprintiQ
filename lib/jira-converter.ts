import type {
  Project,
  Task,
  Status,
  Workspace,
  Space,
  JiraIntegration,
  JiraProject as JiraProjectType,
  SprintFolder,
  Sprint,
} from "@/lib/database.types";
import type { JiraIssue, JiraStatus as JiraStatusType } from "@/lib/jira-api";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { mapJiraStatusColor, convertJiraDescription } from "@/lib/utils";
import { mapJiraPriorityToLocal } from "@/lib/jira-utils";

export interface JiraConversionResult {
  projects: Project[];
  tasks: Task[];
  statuses: Status[];
  sprintFolders: SprintFolder[];
  sprints: Sprint[];
}

type StatusInsert = Database["public"]["Tables"]["statuses"]["Insert"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
type SprintFolderInsert =
  Database["public"]["Tables"]["sprint_folders"]["Insert"];
type SprintInsert = Database["public"]["Tables"]["sprints"]["Insert"];

export class JiraConverter {
  private supabase: SupabaseClient;
  private workspace: Workspace;
  private space: Space;
  private integration: JiraIntegration;

  constructor(
    supabase: SupabaseClient,
    workspace: Workspace,
    space: Space,
    integration: JiraIntegration
  ) {
    this.supabase = supabase;
    this.workspace = workspace;
    this.space = space;
    this.integration = integration;
  }

  async convertJiraProjectToProject(
    jiraProject: JiraProjectType
  ): Promise<ProjectInsert> {
    const project: ProjectInsert = {
      name: jiraProject.jira_project_name,
      space_id: this.space.id,
      workspace_id: this.workspace.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: "jira",
      external_id: jiraProject.jira_project_id,
      external_data: {
        jira_project_key: jiraProject.jira_project_key,
        jira_project_description: jiraProject.jira_project_description,
        jira_project_lead: jiraProject.jira_project_lead,
        jira_project_url: jiraProject.jira_project_url,
      },
    };

    return project;
  }

  async convertJiraStatusToStatus(
    jiraStatus: JiraStatusType,
    projectId?: string,
    sprintId?: string
  ): Promise<StatusInsert> {
    const status: StatusInsert = {
      name: jiraStatus.name,
      color: mapJiraStatusColor(jiraStatus.statusCategory.colorName),
      position: 0, // Will be set based on status category
      workspace_id: this.workspace.id,
      type: "space", // Always set to project since these are Jira project statuses
      status_type_id: null,
      project_id: projectId || null,
      space_id: this.space.id,
      sprint_id: sprintId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      integration_type: "jira",
      external_id: jiraStatus.id,
      external_data: {
        status_category: jiraStatus.statusCategory.key,
        color_name: jiraStatus.statusCategory.colorName,
      },
    };

    return status;
  }

  async convertJiraIssueToTask(
    jiraIssue: JiraIssue,
    projectId: string | null,
    statusId: string,
    parentTaskId?: string,
    sprintId?: string
  ): Promise<TaskInsert> {
    // Extract story points from custom fields
    const storyPoints = this.extractStoryPoints(jiraIssue);

    // Extract assignee information
    const assigneeInfo = await this.extractAssigneeInfo(jiraIssue);

    const task: TaskInsert = {
      name: jiraIssue.fields.summary,
      description: convertJiraDescription(jiraIssue.fields.description),
      status_id: statusId,
      priority: this.mapJiraPriority(jiraIssue.fields.priority?.name),
      assignee_id: assigneeInfo.assigneeId,
      assigned_member_id: assigneeInfo.assignedMemberId,
      project_id: projectId || null, // Allow null for sprint-only tasks
      sprint_id: sprintId || null,
      space_id: this.space.id,
      workspace_id: this.workspace.id,
      start_date: null,
      due_date: jiraIssue.fields.duedate || null,
      story_points: storyPoints,
      parent_task_id: parentTaskId || null,
      created_at: jiraIssue.fields.created,
      updated_at: jiraIssue.fields.updated,
      created_by: null,
      embedding: null,
      type: "jira",
      external_id: jiraIssue.id,
      external_data: {
        jira_key: jiraIssue.key,
        jira_priority: jiraIssue.fields.priority?.name,
        jira_assignee: jiraIssue.fields.assignee,
        jira_story_points: storyPoints,
        jira_issue_type: "story", // Default to story, can be enhanced
      },
    };

    return task;
  }

  /**
   * Extract story points from Jira issue custom fields
   */
  private extractStoryPoints(jiraIssue: JiraIssue): number | null {
    // Common story points field names
    const storyPointsFields = [
      "customfield_10016", // Common story points field
      "customfield_10036", // Another common story points field
      "storypoints",
      "story_points",
      "points",
    ];

    for (const fieldName of storyPointsFields) {
      const fieldValue = (jiraIssue.fields as any)[fieldName];
      if (fieldValue !== undefined && fieldValue !== null) {
        if (typeof fieldValue === "number") {
          return fieldValue;
        }
        if (typeof fieldValue === "string") {
          const points = parseFloat(fieldValue);
          return isNaN(points) ? null : points;
        }
        // Handle object format like { value: 5 }
        if (typeof fieldValue === "object" && fieldValue.value !== undefined) {
          const points = parseFloat(fieldValue.value);
          return isNaN(points) ? null : points;
        }
      }
    }

    return null;
  }

  /**
   * Extract assignee information from Jira issue
   */
  private async extractAssigneeInfo(
    jiraIssue: JiraIssue
  ): Promise<{ assigneeId: string | null; assignedMemberId: string | null }> {
    const assignee = jiraIssue.fields.assignee;
    if (!assignee) {
      return { assigneeId: null, assignedMemberId: null };
    }

    // Try to find the assignee in our database
    let assigneeId = null;
    let assignedMemberId = null;

    // First, try to find by email in profiles
    if (assignee.emailAddress) {
      const { data: profile } = await this.supabase
        .from("profiles")
        .select("id")
        .eq("email", assignee.emailAddress)
        .eq("workspace_id", this.workspace.id)
        .single();

      if (profile) {
        assigneeId = profile.id;
      }
    }

    // If not found in profiles, try to find in team members
    if (!assigneeId && assignee.emailAddress) {
      const { data: teamMember } = await this.supabase
        .from("team_members")
        .select("id")
        .eq("email", assignee.emailAddress)
        .eq("workspace_id", this.workspace.id)
        .single();

      if (teamMember) {
        assignedMemberId = teamMember.id;
      }
    }

    return { assigneeId, assignedMemberId };
  }

  private mapJiraPriority(jiraPriority?: string): string {
    return mapJiraPriorityToLocal(jiraPriority);
  }

  async convertAndSave(
    jiraProjects: JiraProjectType[],
    jiraIssues: JiraIssue[],
    jiraStatuses: JiraStatusType[]
  ): Promise<JiraConversionResult> {
    const result: JiraConversionResult = {
      projects: [],
      tasks: [],
      statuses: [],
      sprintFolders: [],
      sprints: [],
    };

    try {
      // Check for existing projects to avoid duplicates
      const existingProjects = await this.supabase
        .from("projects")
        .select("external_id")
        .eq("workspace_id", this.workspace.id)
        .eq("space_id", this.space.id)
        .eq("type", "jira");

      const existingProjectIds = new Set(
        existingProjects.data?.map((p) => p.external_id) || []
      );

      // Filter out projects that already exist
      const newProjects = jiraProjects.filter(
        (project) => !existingProjectIds.has(project.jira_project_id)
      );

      // Convert and save only new projects
      const projects = await Promise.all(
        newProjects.map((project) => this.convertJiraProjectToProject(project))
      );

      let savedProjects: any[] = [];
      if (projects.length > 0) {
        const { data: insertedProjects, error: projectError } =
          await this.supabase.from("projects").insert(projects).select();

        if (projectError) {
          throw new Error(`Failed to save projects: ${projectError.message}`);
        }

        savedProjects = insertedProjects || [];
      }

      // Get all projects (existing + new) for the result
      const allProjects = await this.supabase
        .from("projects")
        .select("*")
        .eq("workspace_id", this.workspace.id)
        .eq("space_id", this.space.id)
        .eq("type", "jira");

      result.projects = allProjects.data || [];

      // Check for existing Jira projects to avoid duplicates
      const existingJiraProjects = await this.supabase
        .from("jira_projects")
        .select("jira_project_id")
        .eq("jira_integration_id", this.integration.id);

      const existingJiraProjectIds = new Set(
        existingJiraProjects.data?.map((p) => p.jira_project_id) || []
      );

      // Filter out projects that already exist in jira_projects table
      const newJiraProjects = jiraProjects.filter(
        (project) => !existingJiraProjectIds.has(project.jira_project_id)
      );

      // Create jira_projects table entries only for new projects
      if (newJiraProjects.length > 0) {
        const jiraProjectEntries = newJiraProjects.map(
          (jiraProject, index) => ({
            jira_integration_id: this.integration.id,
            jira_project_id: jiraProject.jira_project_id,
            jira_project_key: jiraProject.jira_project_key,
            jira_project_name: jiraProject.jira_project_name,
            jira_project_description: jiraProject.jira_project_description,
            jira_project_lead: jiraProject.jira_project_lead,
            jira_project_url: jiraProject.jira_project_url,
            space_id: this.space.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        );

        const { error: jiraProjectError } = await this.supabase
          .from("jira_projects")
          .insert(jiraProjectEntries);

        if (jiraProjectError) {
          throw new Error(
            `Failed to save jira projects: ${jiraProjectError.message}`
          );
        }
      }

      // Convert and save statuses with project associations
      const statuses = await Promise.all(
        jiraStatuses.map(async (status) => {
          // Find the project this status belongs to by checking which project has this status
          // For now, we'll associate all statuses with the first project, but this could be enhanced
          const projectId =
            result.projects.length > 0 ? result.projects[0].id : undefined;
          return this.convertJiraStatusToStatus(status, projectId);
        })
      );

      // Save statuses to database
      const { data: savedStatuses, error: statusError } = await this.supabase
        .from("statuses")
        .insert(statuses)
        .select();

      if (statusError) {
        throw new Error(`Failed to save statuses: ${statusError.message}`);
      }

      result.statuses = savedStatuses || [];

      // Create a map of Jira status IDs to our status IDs
      const statusMap = new Map<string, string>();
      result.statuses.forEach((status) => {
        if (status.external_id) {
          statusMap.set(status.external_id, status.id);
        }
      });

      // Create a map of project external IDs to our project IDs
      const projectMap = new Map<string, string>();
      result.projects.forEach((project) => {
        if (project.external_id) {
          projectMap.set(project.external_id, project.id);
        }
      });

      // Process sprint information from issues
      const sprintIssuesMap = new Map<string, JiraIssue[]>();
      const nonSprintIssues: JiraIssue[] = [];

      console.log(
        `Processing ${jiraIssues.length} issues for sprint detection`
      );

      // Group issues by sprint
      for (const issue of jiraIssues) {
        // Extract sprint information from the issue
        const sprintInfo = this.extractSprintFromIssue(issue);

        if (sprintInfo && sprintInfo.sprintId) {
          const sprintKey = `${sprintInfo.sprintId}_${sprintInfo.sprintName}`;
          if (!sprintIssuesMap.has(sprintKey)) {
            sprintIssuesMap.set(sprintKey, []);
          }
          sprintIssuesMap.get(sprintKey)!.push(issue);
          console.log(
            `Issue ${issue.key} assigned to sprint: ${sprintInfo.sprintName} (${sprintInfo.sprintId})`
          );
        } else {
          nonSprintIssues.push(issue);
          console.log(`Issue ${issue.key} has no sprint`);
        }
      }

      console.log(
        `Found ${sprintIssuesMap.size} unique sprints and ${nonSprintIssues.length} non-sprint issues`
      );

      // Create sprint folders and sprints for issues that belong to sprints
      const sprintFolderMap = new Map<string, string>(); // sprintKey -> sprintFolderId
      const sprintMap = new Map<string, string>(); // sprintKey -> sprintId

      if (sprintIssuesMap.size > 0) {
        console.log("Creating sprint folder and sprints...");

        // Create a default sprint folder for Jira sprints
        const { data: sprintFolder, error: sprintFolderError } =
          await this.supabase
            .from("sprint_folders")
            .insert({
              name: "Jira Sprints",
              space_id: this.space.id,
              sprint_start_day_id: null,
              duration_week: 2, // Default 2-week sprints
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (sprintFolderError) {
          throw new Error(
            `Failed to create sprint folder: ${sprintFolderError.message}`
          );
        }

        console.log(`Created sprint folder: ${sprintFolder.id}`);

        result.sprintFolders = [sprintFolder];

        // Create sprints for each unique sprint from Jira
        for (const [sprintKey, issues] of sprintIssuesMap) {
          const [sprintId, sprintName] = sprintKey.split("_", 2);

          console.log(
            `Creating sprint: ${sprintName} (${sprintId}) with ${issues.length} issues`
          );

          const { data: sprint, error: sprintError } = await this.supabase
            .from("sprints")
            .insert({
              name: sprintName || `Sprint ${sprintId}`,
              goal: `Imported from Jira Sprint ${sprintId}`,
              sprint_folder_id: sprintFolder.id,
              space_id: this.space.id,
              start_date: null,
              end_date: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (sprintError) {
            throw new Error(`Failed to create sprint: ${sprintError.message}`);
          }

          console.log(`Created sprint: ${sprint.id} - ${sprint.name}`);

          result.sprints.push(sprint);
          sprintMap.set(sprintKey, sprint.id);
        }
      } else {
        console.log("No sprints found, skipping sprint folder creation");
      }

      // Convert and save tasks
      const parentIssues: JiraIssue[] = [];
      const subtaskIssues: JiraIssue[] = [];

      // Separate parent issues and subtasks
      jiraIssues.forEach((issue) => {
        if (issue.fields.parent) {
          subtaskIssues.push(issue);
        } else {
          parentIssues.push(issue);
        }
      });

      // Convert and save parent issues first
      const parentTasks: TaskInsert[] = [];
      for (const issue of parentIssues) {
        // Find the project by matching the issue key prefix with project key
        const projectKey = issue.key.split("-")[0];
        const project = result.projects.find(
          (p) => (p.external_data as any)?.jira_project_key === projectKey
        );
        let projectId = project?.id;
        const statusId = statusMap.get(issue.fields.status.id);

        // Determine sprint ID for this issue
        let sprintId: string | undefined;
        const sprintInfo = this.extractSprintFromIssue(issue);
        if (sprintInfo && sprintInfo.sprintId) {
          const sprintKey = `${sprintInfo.sprintId}_${sprintInfo.sprintName}`;
          sprintId = sprintMap.get(sprintKey);
          // For sprint issues, don't assign to project
          projectId = undefined;
        } else {
          // If no sprint, assign to the actual Jira project
          projectId = project?.id;
        }

        if ((projectId || sprintId) && statusId) {
          const task = await this.convertJiraIssueToTask(
            issue,
            projectId || null, // Use null if no project
            statusId,
            undefined,
            sprintId
          );
          parentTasks.push(task);
        }
      }

      // Save parent tasks to database first
      const { data: savedParentTasks, error: parentTaskError } =
        await this.supabase.from("tasks").insert(parentTasks).select();

      if (parentTaskError) {
        throw new Error(
          `Failed to save parent tasks: ${parentTaskError.message}`
        );
      }

      // Create a map of Jira issue IDs to our task IDs for parent-child relationships
      const jiraIssueToTaskIdMap = new Map<string, string>();
      savedParentTasks?.forEach((task) => {
        if (task.external_id) {
          jiraIssueToTaskIdMap.set(task.external_id, task.id);
        }
      });

      // Convert and save subtasks with proper parent references
      const subtasks: TaskInsert[] = [];
      for (const issue of subtaskIssues) {
        // Find the project by matching the issue key prefix with project key
        const projectKey = issue.key.split("-")[0];
        const project = result.projects.find(
          (p) => (p.external_data as any)?.jira_project_key === projectKey
        );
        let projectId = project?.id;
        const statusId = statusMap.get(issue.fields.status.id);

        // Find parent task ID from the map
        const parentTaskId = jiraIssueToTaskIdMap.get(
          issue.fields.parent?.id || ""
        );

        // Determine sprint ID for this issue
        let sprintId: string | undefined;
        const sprintInfo = this.extractSprintFromIssue(issue);
        if (sprintInfo && sprintInfo.sprintId) {
          const sprintKey = `${sprintInfo.sprintId}_${sprintInfo.sprintName}`;
          sprintId = sprintMap.get(sprintKey);
          // For sprint issues, don't assign to project
          projectId = undefined;
        } else {
          // If no sprint, assign to the actual Jira project
          projectId = project?.id;
        }

        if ((projectId || sprintId) && statusId && parentTaskId) {
          const task = await this.convertJiraIssueToTask(
            issue,
            projectId || null, // Use null if no project
            statusId,
            parentTaskId,
            sprintId
          );
          subtasks.push(task);
        }
      }

      // Save subtasks to database
      let savedSubtasks: any[] = [];
      if (subtasks.length > 0) {
        const { data: insertedSubtasks, error: subtaskError } =
          await this.supabase.from("tasks").insert(subtasks).select();

        if (subtaskError) {
          throw new Error(`Failed to save subtasks: ${subtaskError.message}`);
        }

        savedSubtasks = insertedSubtasks || [];
      }

      // Combine all tasks for the result
      result.tasks = [...(savedParentTasks || []), ...savedSubtasks];

      return result;
    } catch (error) {
      console.error("Error converting Jira data:", error);
      throw error;
    }
  }

  /**
   * Extract sprint information from Jira issue
   */
  private extractSprintFromIssue(
    jiraIssue: JiraIssue
  ): { sprintId?: string; sprintName?: string } | null {
    // Common sprint field names in Jira
    const sprintFields = [
      "customfield_10020", // Common sprint field
      "customfield_10007", // Another common sprint field
      "customfield_10016", // Another common sprint field
      "customfield_10008", // Another common sprint field
      "customfield_10001", // Another common sprint field
      "sprint",
      "sprints",
      "rapidViewId", // Sometimes used
    ];

    console.log("Extracting sprint from issue:", jiraIssue.key);
    console.log("Issue fields:", Object.keys(jiraIssue.fields));

    for (const fieldName of sprintFields) {
      const fieldValue = (jiraIssue.fields as any)[fieldName];
      console.log(`Checking field ${fieldName}:`, fieldValue);

      if (fieldValue !== undefined && fieldValue !== null) {
        // Handle array format (most common)
        if (Array.isArray(fieldValue)) {
          console.log(`Field ${fieldName} is array:`, fieldValue);
          const sprint = fieldValue[0]; // Get the first sprint
          if (sprint && typeof sprint === "object") {
            console.log(`Found sprint in array:`, sprint);
            return {
              sprintId: sprint.id?.toString(),
              sprintName: sprint.name,
            };
          }
        }
        // Handle string format
        if (typeof fieldValue === "string") {
          console.log(`Field ${fieldName} is string:`, fieldValue);
          // Try to parse sprint information from string
          const sprintMatch = fieldValue.match(
            /com\.atlassian\.greenhopper\.service\.sprint\.Sprint@(\w+)\[rapidViewId=(\d+),state=(\w+),name=([^,]+)/
          );
          if (sprintMatch) {
            console.log(`Found sprint in string format:`, sprintMatch);
            return {
              sprintId: sprintMatch[1],
              sprintName: sprintMatch[4],
            };
          }
          // Try another common format
          const sprintMatch2 = fieldValue.match(
            /id=(\d+),rapidViewId=(\d+),state=(\w+),name=([^,]+)/
          );
          if (sprintMatch2) {
            console.log(`Found sprint in string format 2:`, sprintMatch2);
            return {
              sprintId: sprintMatch2[1],
              sprintName: sprintMatch2[4],
            };
          }
          // Try simpler format
          const sprintMatch3 = fieldValue.match(/name=([^,]+),id=(\d+)/);
          if (sprintMatch3) {
            console.log(`Found sprint in string format 3:`, sprintMatch3);
            return {
              sprintId: sprintMatch3[2],
              sprintName: sprintMatch3[1],
            };
          }
        }
        // Handle object format
        if (typeof fieldValue === "object" && fieldValue.id) {
          console.log(`Found sprint in object format:`, fieldValue);
          return {
            sprintId: fieldValue.id.toString(),
            sprintName: fieldValue.name,
          };
        }
        // Handle number format (sometimes sprint ID is just a number)
        if (typeof fieldValue === "number") {
          console.log(`Found sprint ID as number:`, fieldValue);
          return {
            sprintId: fieldValue.toString(),
            sprintName: `Sprint ${fieldValue}`,
          };
        }
      }
    }

    // If no sprint found, let's log all custom fields to help debug
    console.log("No sprint found, all custom fields:");
    Object.keys(jiraIssue.fields).forEach((key) => {
      if (key.startsWith("customfield_")) {
        console.log(`${key}:`, (jiraIssue.fields as any)[key]);
      }
    });

    // Also check for any field that contains "sprint" in the name
    Object.keys(jiraIssue.fields).forEach((key) => {
      if (key.toLowerCase().includes("sprint")) {
        console.log(
          `Found field with 'sprint' in name: ${key}`,
          (jiraIssue.fields as any)[key]
        );
      }
    });

    return null;
  }
}

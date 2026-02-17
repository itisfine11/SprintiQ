export interface JiraCredentials {
  domain: string;
  email: string;
  apiToken: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  lead?: {
    displayName: string;
    emailAddress: string;
  };
  url: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      id: string;
      name: string;
      statusCategory: {
        key: string;
        colorName: string;
      };
    };
    priority: {
      id: string;
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
      accountId?: string;
    };
    created: string;
    updated: string;
    duedate?: string;
    parent?: {
      id: string;
      key: string;
    };
    subtasks?: Array<{
      id: string;
      key: string;
    }>;
    // Custom fields - these will be populated dynamically
    [key: string]: any;
  };
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    key: string;
    colorName: string;
  };
}

class JiraAPI {
  private credentials: JiraCredentials;

  constructor(credentials: JiraCredentials) {
    this.credentials = credentials;
  }

  private getAuthHeader(): string {
    const auth = Buffer.from(
      `${this.credentials.email}:${this.credentials.apiToken}`
    ).toString("base64");
    return `Basic ${auth}`;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `https://${this.credentials.domain}/rest/api/3${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: this.getAuthHeader(),
          Accept: "application/json",
          "Content-Type": "application/json",
          ...options.headers,
        },
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Jira API error response:", errorText);
        throw new Error(
          `Jira API error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      // For PUT requests (like updateIssue), the response is often empty
      // and we shouldn't try to parse it as JSON
      if (options.method === "PUT" && response.status === 204) {
        return null; // Success with no content
      }

      // For other requests, try to parse JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      } else {
        // For non-JSON responses, return the text
        const text = await response.text();
        return text;
      }
    } catch (error: any) {
      console.error("Jira API request failed:", error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest("/myself");
      return true;
    } catch (error: any) {
      console.error("Jira connection test failed:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        credentials: {
          domain: this.credentials.domain,
          email: this.credentials.email,
          hasToken: !!this.credentials.apiToken,
        },
      });
      return false;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.makeRequest("/myself");
      return response;
    } catch (error: any) {
      console.error("Failed to get current user:", error);
      throw error;
    }
  }

  async getProjects(): Promise<JiraProject[]> {
    try {
      const response = await this.makeRequest("/project");

      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }

      if (response && Array.isArray(response.values)) {
        return response.values;
      }

      if (response && response.projects && Array.isArray(response.projects)) {
        return response.projects;
      }

      console.error("Unexpected Jira projects response format:", response);
      return [];
    } catch (error) {
      console.error("Failed to fetch Jira projects:", error);
      throw error;
    }
  }

  async getProjectIssues(
    projectKey: string,
    maxResults: number = 100
  ): Promise<JiraIssue[]> {
    try {
      const jql = `project = ${projectKey} ORDER BY created DESC`;
      const response = await this.makeRequest(
        `/search?jql=${encodeURIComponent(
          jql
        )}&maxResults=${maxResults}&expand=names,schema`
      );
      return response.issues || [];
    } catch (error) {
      console.error(`Failed to fetch issues for project ${projectKey}:`, error);
      throw error;
    }
  }

  async getIssue(issueIdOrKey: string): Promise<JiraIssue> {
    try {
      const response = await this.makeRequest(`/issue/${issueIdOrKey}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch issue ${issueIdOrKey}:`, error);
      throw error;
    }
  }

  async getIssueByKey(issueKey: string): Promise<JiraIssue> {
    try {
      const response = await this.makeRequest(`/issue/${issueKey}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch issue by key ${issueKey}:`, error);
      throw error;
    }
  }

  async getProjectStatuses(projectKey: string): Promise<JiraStatus[]> {
    try {
      const response = await this.makeRequest(
        `/project/${projectKey}/statuses`
      );
      const statuses: JiraStatus[] = [];

      // Flatten all statuses from different issue types
      response.forEach((issueType: any) => {
        if (issueType.statuses) {
          statuses.push(...issueType.statuses);
        }
      });

      // Remove duplicates based on status ID
      const uniqueStatuses = statuses.filter(
        (status, index, self) =>
          index === self.findIndex((s) => s.id === status.id)
      );

      return uniqueStatuses;
    } catch (error) {
      console.error(
        `Failed to fetch statuses for project ${projectKey}:`,
        error
      );
      throw error;
    }
  }

  async getProjectIssueTypes(projectKey: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/project/${projectKey}`);
      return response.issueTypes || [];
    } catch (error) {
      console.error(
        `Failed to fetch issue types for project ${projectKey}:`,
        error
      );
      throw error;
    }
  }

  async getPriorities(): Promise<any[]> {
    try {
      const response = await this.makeRequest("/priority");
      return response || [];
    } catch (error) {
      console.error("Failed to fetch priorities:", error);
      throw error;
    }
  }

  async getGlobalIssueTypes(): Promise<any[]> {
    try {
      const response = await this.makeRequest("/issuetype");
      return response || [];
    } catch (error) {
      console.error("Failed to fetch global issue types:", error);
      throw error;
    }
  }

  async getProjectDetails(projectKey: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/project/${projectKey}`);
      return response;
    } catch (error) {
      console.error(
        `Failed to fetch project details for ${projectKey}:`,
        error
      );
      throw error;
    }
  }

  async updateProjectIssueTypes(
    projectKey: string,
    issueTypeIds: string[]
  ): Promise<any> {
    try {
      // Try to add issue types to the project's issue type scheme
      // This is a more direct approach that should work
      const response = await this.makeRequest(
        `/project/${projectKey}/issueTypeScheme`,
        {
          method: "PUT",
          body: JSON.stringify({
            issueTypeIds: issueTypeIds,
          }),
        }
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to update issue types for project ${projectKey}:`,
        error
      );
      throw error;
    }
  }

  async getStoryPointsFieldName(
    projectKey: string,
    issueTypeName?: string
  ): Promise<string | null> {
    try {
      // Get the create metadata for the project to find story points field
      const response = await this.makeRequest(
        `/issue/createmeta/${projectKey}/issuetypes`
      );

      // Look for story points field in the metadata
      for (const issueType of response.values || []) {
        // If issueTypeName is provided, only check that specific issue type
        if (issueTypeName && issueType.name !== issueTypeName) {
          continue;
        }

        if (issueType.fields) {
          // First, try to find exact "Story Points" field
          for (const [fieldKey, fieldData] of Object.entries(
            issueType.fields
          )) {
            const field = fieldData as any;
            if (
              field.name &&
              field.name.toLowerCase().trim() === "story points"
            ) {
              console.log(
                `Found exact "Story Points" field: ${fieldKey} (${field.name}) for issue type: ${issueType.name}`
              );
              return fieldKey;
            }
          }

          // If no exact match, look for partial matches
          for (const [fieldKey, fieldData] of Object.entries(
            issueType.fields
          )) {
            const field = fieldData as any;
            if (
              field.name &&
              (field.name.toLowerCase().includes("story point") ||
                field.name.toLowerCase().includes("storypoint") ||
                field.name.toLowerCase().includes("points") ||
                fieldKey.toLowerCase().includes("story"))
            ) {
              console.log(
                `Found story points field (partial match): ${fieldKey} (${field.name}) for issue type: ${issueType.name}`
              );
              return fieldKey;
            }
          }
        }
      }

      console.log(
        `No story points field found in create metadata for project: ${projectKey}${
          issueTypeName ? ` and issue type: ${issueTypeName}` : ""
        }`
      );
      return null;
    } catch (error) {
      console.log(
        "Failed to get story points field name for project:",
        projectKey,
        error
      );
      return null;
    }
  }

  async findStoryPointsField(projectKey: string): Promise<string | null> {
    try {
      // Method 1: Try using create metadata
      const storyPointsField = await this.getStoryPointsFieldName(projectKey);
      if (storyPointsField) {
        return storyPointsField;
      }

      // Method 2: Try using all fields API
      try {
        const allFields = await this.makeRequest("/field");
        const storyPointsField = allFields.find((field: any) => {
          const fieldName = field.name?.toLowerCase() || "";
          const fieldKey = field.id?.toLowerCase() || "";
          return (
            fieldName.includes("story point") ||
            fieldName.includes("storypoint") ||
            fieldName.includes("points") ||
            fieldKey.includes("story")
          );
        });

        if (storyPointsField) {
          console.log(
            `Found story points field via all fields: ${storyPointsField.id} (${storyPointsField.name})`
          );
          return storyPointsField.id;
        }
      } catch (error) {
        console.log("Failed to get all fields:", error);
      }

      return null;
    } catch (error) {
      console.log("Failed to find story points field:", error);
      return null;
    }
  }

  async isFieldAvailableForIssue(
    issueKey: string,
    fieldKey: string
  ): Promise<boolean> {
    try {
      // Get the issue's edit metadata to see what fields are available for editing
      const response = await this.makeRequest(`/issue/${issueKey}/editmeta`);

      if (response.fields && response.fields[fieldKey]) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(
        `Failed to check if field ${fieldKey} is available for issue ${issueKey}:`,
        error
      );
      return false;
    }
  }

  async createProject(projectData: {
    key: string;
    name: string;
    description?: string;
    projectTypeKey?: string;
    leadAccountId?: string;
  }): Promise<JiraProject> {
    try {
      const payload = {
        key: projectData.key,
        name: projectData.name,
        description: projectData.description || "",
        projectTypeKey: projectData.projectTypeKey || "software",
        leadAccountId: projectData.leadAccountId,
      };

      const response = await this.makeRequest("/project", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      console.log("Failed to create Jira project:", error);
      throw error;
    }
  }

  async createIssue(
    projectKey: string,
    issueData: {
      summary: string;
      description?: string;
      issueType: string;
      priority?: string;
      assignee?: string | { accountId: string };
    }
  ): Promise<JiraIssue> {
    try {
      const payload = {
        fields: {
          project: {
            key: projectKey,
          },
          summary: issueData.summary,
          description: issueData.description
            ? {
                type: "doc",
                version: 1,
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: issueData.description,
                      },
                    ],
                  },
                ],
              }
            : undefined,
          issuetype: {
            name: issueData.issueType,
          },
          priority: issueData.priority
            ? {
                name: issueData.priority,
              }
            : undefined,
          assignee: issueData.assignee
            ? typeof issueData.assignee === "string"
              ? {
                  emailAddress: issueData.assignee,
                }
              : {
                  accountId: issueData.assignee.accountId,
                }
            : undefined,
        },
      };

      const response = await this.makeRequest("/issue", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      console.log("Failed to create Jira issue:", error);
      throw error;
    }
  }

  async updateIssue(
    issueKey: string,
    updates: {
      summary?: string;
      description?: string;
      priority?: string;
      assignee?: string | { accountId: string };
      status?: string;
      fields?: any; // Allow custom fields
    }
  ): Promise<void> {
    try {
      const payload: any = {
        fields: {
          summary: updates.summary,
          description: updates.description
            ? {
                type: "doc",
                version: 1,
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: updates.description,
                      },
                    ],
                  },
                ],
              }
            : undefined,
          priority: updates.priority
            ? {
                name: updates.priority,
              }
            : undefined,
          assignee: updates.assignee
            ? typeof updates.assignee === "string"
              ? {
                  name: updates.assignee,
                }
              : {
                  accountId: updates.assignee.accountId,
                }
            : undefined,
        },
      };

      // Add custom fields if provided
      if (updates.fields) {
        payload.fields = { ...payload.fields, ...updates.fields };
      }

      await this.makeRequest(`/issue/${issueKey}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      // Update status if provided
      if (updates.status) {
        await this.makeRequest(`/issue/${issueKey}/transitions`, {
          method: "POST",
          body: JSON.stringify({
            transition: {
              id: updates.status,
            },
          }),
        });
      }
    } catch (error) {
      console.error(`Failed to update Jira issue ${issueKey}:`, error);
      throw error;
    }
  }

  async getIssueTransitions(issueKey: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/issue/${issueKey}/transitions`);
      return response.transitions || [];
    } catch (error) {
      console.error(
        `Failed to fetch transitions for issue ${issueKey}:`,
        error
      );
      throw error;
    }
  }

  async getAllFields(): Promise<any[]> {
    try {
      const response = await this.makeRequest("/field");
      return response || [];
    } catch (error) {
      console.error("Failed to fetch all fields:", error);
      throw error;
    }
  }

  async getCreateMetadata(projectKey: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(
        `/issue/createmeta/${projectKey}/issuetypes`
      );
      return response.values || [];
    } catch (error) {
      console.error(
        `Failed to fetch create metadata for ${projectKey}:`,
        error
      );
      throw error;
    }
  }

  async getFieldStructure(
    projectKey: string,
    fieldKey: string
  ): Promise<{
    requiresValueStructure: boolean;
    fieldType: string;
    schema: any;
  }> {
    try {
      const createMetadata = await this.getCreateMetadata(projectKey);

      for (const issueType of createMetadata) {
        if (issueType.fields && issueType.fields[fieldKey]) {
          const field = issueType.fields[fieldKey];
          const schema = field.schema;

          // Determine if field requires value structure based on schema
          // For Story Points (number fields), we should use direct assignment
          // Value structure is only needed for select/option fields
          const requiresValueStructure =
            schema &&
            (schema.type === "option" ||
              schema.type === "array" ||
              schema.custom?.includes("select") ||
              schema.custom?.includes("multiselect"));

          return {
            requiresValueStructure,
            fieldType: schema?.type || "unknown",
            schema,
          };
        }
      }

      // For custom fields, default to direct assignment (not value structure)
      return {
        requiresValueStructure: false, // Most custom fields use direct assignment
        fieldType: "custom",
        schema: null,
      };
    } catch (error) {
      console.error(`Failed to get field structure for ${fieldKey}:`, error);
      return {
        requiresValueStructure: false, // Default to direct assignment
        fieldType: "unknown",
        schema: null,
      };
    }
  }

  async getProjectUsers(projectKey: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(
        `/user/assignable/search?project=${projectKey}&maxResults=1000`
      );

      if (!response || !Array.isArray(response)) {
        console.warn(`No users found for project ${projectKey}`);
        return [];
      }

      // Filter out inactive users and format the response
      const activeUsers = response
        .filter((user: any) => user.active)
        .map((user: any) => ({
          accountId: user.accountId,
          displayName: user.displayName,
          emailAddress: user.emailAddress,
          active: user.active,
          timeZone: user.timeZone,
          avatarUrls: user.avatarUrls,
        }));

      console.log(
        `Found ${activeUsers.length} active users for project ${projectKey}`
      );
      return activeUsers;
    } catch (error) {
      console.error(`Failed to fetch users for project ${projectKey}:`, error);
      throw error;
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/user/search?maxResults=1000`);

      if (!response || !Array.isArray(response)) {
        console.warn("No users found");
        return [];
      }

      // Filter out inactive users and format the response
      const activeUsers = response
        .filter((user: any) => user.active)
        .map((user: any) => ({
          accountId: user.accountId,
          displayName: user.displayName,
          emailAddress: user.emailAddress,
          active: user.active,
          timeZone: user.timeZone,
          avatarUrls: user.avatarUrls,
        }));

      console.log(`Found ${activeUsers.length} active users`);
      return activeUsers;
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      throw error;
    }
  }

  async assignIssue(issueKey: string, accountId: string): Promise<void> {
    try {
      const response = await this.makeRequest(`/issue/${issueKey}/assignee`, {
        method: "PUT",
        body: JSON.stringify({
          accountId: accountId,
        }),
      });
      return response;
    } catch (error) {
      console.error(
        `Failed to assign issue ${issueKey} to ${accountId}:`,
        error
      );
      throw error;
    }
  }

  async transitionIssueToStatus(
    issueKey: string,
    targetStatusId: string
  ): Promise<boolean> {
    try {
      const transitions = await this.getIssueTransitions(issueKey);
      const transition = transitions.find(
        (t: any) => t.to.id === targetStatusId
      );

      if (!transition) {
        console.log(`No transition found to status ${targetStatusId}`);
        return false;
      }

      await this.makeRequest(`/issue/${issueKey}/transitions`, {
        method: "POST",
        body: JSON.stringify({
          transition: { id: transition.id },
        }),
      });

      return true;
    } catch (error) {
      console.error("Error transitioning issue:", error);
      return false;
    }
  }

  // New methods for sprint folder export workflow

  /**
   * Get all filters for the current user
   */
  async getMyFilters(): Promise<any[]> {
    try {
      const response = await this.makeRequest("/filter/my");
      return response.values || [];
    } catch (error) {
      console.error("Error fetching filters:", error);
      return [];
    }
  }

  /**
   * Create a new filter
   */
  async createFilter(filterData: {
    name: string;
    description?: string;
    jql: string;
  }): Promise<any> {
    try {
      const response = await this.makeRequest("/filter", {
        method: "POST",
        body: JSON.stringify({
          name: filterData.name,
          description: filterData.description || "",
          jql: filterData.jql,
        }),
      });
      return response;
    } catch (error) {
      console.error("Error creating filter:", error);
      throw error;
    }
  }

  /**
   * Create a new board
   */
  async createBoard(boardData: {
    name: string;
    filterId: number;
    projectKeyOrId: string;
    type: "scrum" | "kanban";
  }): Promise<any> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/agile/1.0/board`,
        {
          method: "POST",
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: boardData.name,
            filterId: boardData.filterId,
            location: {
              projectKeyOrId: boardData.projectKeyOrId,
              type: "project",
            },
            type: boardData.type,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Board creation failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating board:", error);
      throw error;
    }
  }

  /**
   * Create a new sprint
   */
  async createSprint(sprintData: {
    name: string;
    goal?: string;
    startDate?: string;
    endDate?: string;
    originBoardId: number;
  }): Promise<any> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/agile/1.0/sprint`,
        {
          method: "POST",
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: sprintData.name,
            goal: sprintData.goal || "",
            startDate: sprintData.startDate,
            endDate: sprintData.endDate,
            originBoardId: sprintData.originBoardId,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Sprint creation failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating sprint:", error);
      throw error;
    }
  }

  /**
   * Move issues to a sprint
   */
  async moveIssuesToSprint(
    sprintId: number,
    issueKeys: string[]
  ): Promise<void> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/agile/1.0/sprint/${sprintId}/issue`,
        {
          method: "POST",
          headers: {
            Authorization: this.getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issues: issueKeys,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Move issues to sprint failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error moving issues to sprint:", error);
      throw error;
    }
  }

  /**
   * Get sprints for a board
   */
  async getBoardSprints(boardId: number): Promise<any[]> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/agile/1.0/board/${boardId}/sprint`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Get board sprints failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error("Error getting board sprints:", error);
      return [];
    }
  }

  /**
   * Get project issues with expanded sprint fields
   */
  async getProjectIssuesWithSprints(
    projectKey: string,
    maxResults: number = 100
  ): Promise<JiraIssue[]> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/api/3/search?jql=project=${projectKey}&maxResults=${maxResults}&expand=names,schema`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Get project issues failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.issues || [];
    } catch (error) {
      console.error("Error getting project issues with sprints:", error);
      return [];
    }
  }

  /**
   * Get sprint field name for a project
   */
  async getSprintFieldName(projectKey: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/api/3/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Get sprint field name failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();

      // Look for sprint fields in the metadata
      if (data.projects && data.projects[0] && data.projects[0].issuetypes) {
        for (const issueType of data.projects[0].issuetypes) {
          if (issueType.fields) {
            for (const [fieldKey, fieldData] of Object.entries(
              issueType.fields
            )) {
              const field = fieldData as any;
              if (
                field.schema &&
                field.schema.custom &&
                field.schema.custom.includes("sprint")
              ) {
                console.log(`Found sprint field: ${fieldKey}`);
                return fieldKey;
              }
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting sprint field name:", error);
      return null;
    }
  }

  /**
   * Get boards for a project
   */
  async getProjectBoards(projectKey: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/agile/1.0/board?projectKeyOrId=${projectKey}`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Get project boards failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error("Error getting project boards:", error);
      return [];
    }
  }

  /**
   * Get all boards
   */
  async getAllBoards(): Promise<any[]> {
    try {
      const response = await fetch(
        `https://${this.credentials.domain}/rest/agile/1.0/board`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Get all boards failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error("Error getting all boards:", error);
      return [];
    }
  }

  /**
   * Extract sprint information from Jira issue
   */
  extractSprintFromIssue(
    jiraIssue: JiraIssue
  ): { sprintId?: string; sprintName?: string } | null {
    // Common sprint field names in Jira
    const sprintFields = [
      "customfield_10020", // Common sprint field
      "customfield_10007", // Another common sprint field
      "customfield_10016", // Another common sprint field
      "customfield_10008", // Another common sprint field
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

    return null;
  }
}

export default JiraAPI;

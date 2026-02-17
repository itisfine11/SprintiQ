import type { DriveStep } from "driver.js";

// Route-aware step registry. Each page contributes selectors and labels.
// Note: selectors should target stable ids/data-attributes we control.

function projectsSteps(workspaceId: string): DriveStep[] {
  return [
    {
      element: "#sidebar-home-link",
      popover: { title: "Home", description: "Navigate to Home from here." },
    },
    {
      element: "#home-dashboard",
      popover: {
        title: "Home Dashboard",
        description: "View your home dashboard to see your projects and tasks.",
      },
    },
    {
      element: "#home-inbox",
      popover: {
        title: "Inbox",
        description: "View your inbox to see your tasks and sprints.",
      },
    },
    {
      element: "#home-my-tasks",
      popover: {
        title: "My Tasks",
        description: "View your tasks to see your tasks and sprints.",
      },
    },
    {
      element: "#home-create-space",
      popover: {
        title: "Create Space",
        description: "Create a new space to organize your projects.",
      },
    },
    {
      element: "#home-create-project",
      popover: {
        title: "Create Project",
        description: "Create a new project to organize your tasks and sprints.",
      },
    } as any,
  ];
}

function teamsSteps(workspaceId: string): DriveStep[] {
  return [
    {
      element: "#sidebar-teams-link",
      popover: {
        title: "Teams",
        description: "Open Teams to manage your workspace members.",
      },
    },
    {
      element: "#sidebar-teams-dashboard",
      popover: {
        title: "Teams Dashboard",
        description: "View your team's progress and performance.",
      },
    },
    {
      element: "#sidebar-teams-create",
      popover: {
        title: "Create Team",
        description:
          "Create a new team to collaborate with your workspace members.",
      },
    },
    {
      element: "#teams-add-member-button",
      popover: {
        title: "Add members",
        description: "Invite teammates to collaborate in this workspace.",
      },
      route: `/${workspaceId}/teams`,
    } as any,
  ];
}

function agentsSteps(workspaceId: string): DriveStep[] {
  return [
    {
      element: "#sidebar-agents-link",
      popover: {
        title: "Agents",
        description: "Go to Agents to generate AI-assisted user stories.",
      },
    },
    {
      element: "#agent-role-field",
      popover: {
        title: "As a...",
        description: "Describe the user or persona role for the story.",
      },
    },
    {
      element: "#agent-want-field",
      popover: {
        title: "I want...",
        description: "State the capability or action the user wants.",
      },
    },
    {
      element: "#agent-benefit-field",
      popover: {
        title: "So that...",
        description: "Explain the outcome or business value.",
      },
    },
    {
      element: "#agent-personas-section-label",
      popover: {
        title: "Target Personas",
        description: "Optionally select personas to tailor story language.",
      },
    },
    {
      element: "#agent-story-count",
      popover: {
        title: "Number of stories",
        description: "Choose how many stories to generate.",
      },
    },
    {
      element: "#agent-complexity",
      popover: {
        title: "Complexity",
        description: "Pick simple, moderate, or complex for story depth.",
      },
    },
    {
      element: "#agent-team-members-label",
      popover: {
        title: "Team members",
        description:
          "Add teammates to enable assignment and better suggestions.",
      },
    },
    {
      element: "#agent-priority-label",
      popover: {
        title: "Priority Scoring",
        description:
          "Pick business, user impact, complexity, and other factors to score stories.",
      },
    },
    {
      element: "#agent-generate-stories",
      popover: {
        title: "Generate stories",
        description:
          "Use the agent to draft stories and refine them to your needs.",
      },
    },
    {
      element: "#agent-train-data",
      popover: {
        title: "Train Data",
        description:
          "Train the agent on your project data to improve story generation.",
      },
    },
    {
      element: "#agent-sprint-assistant",
      popover: {
        title: "Sprint Assistant",
        description: "Use the Sprint Assistant to generate sprints and tasks.",
      },
    },
    {
      element: "#agent-analyze-dependencies",
      popover: {
        title: "Analyze Dependencies",
        description:
          "Add dependencies to stories to ensure they are created in the correct order.",
      },
    },
    {
      element: "#agent-visualize-stories",
      popover: {
        title: "Visualize Stories",
        description:
          "Visualize stories in a graph to see their dependencies and relationships.",
      },
    },
    {
      element: "#agent-priority-analysis",
      popover: {
        title: "Priority Analysis",
        description:
          "Analyze stories by priority to see what's most important.",
      },
    } as any,
  ];
}

export function getStepsForPath(path: string): DriveStep[] {
  // Expect paths like /{workspaceId}/{path}
  const parts = path.split("/").filter(Boolean);
  const workspaceId = parts[0] || "_";

  // Home of workspace: show an overview leading to projects first
  if (parts.length === 1) {
    return [
      ...projectsSteps(workspaceId),
      ...teamsSteps(workspaceId),
      ...agentsSteps(workspaceId),
    ];
  }

  // Per-section pages may refine their own steps later
  if (parts[1] === "home") return projectsSteps(workspaceId);
  if (parts[1] === "teams") return teamsSteps(workspaceId);
  if (parts[1] === "agents") return agentsSteps(workspaceId);

  return [];
}

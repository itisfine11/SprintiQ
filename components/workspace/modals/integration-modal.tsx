"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import {
  Loader2,
  ExternalLink,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Zap,
  Trello,
  Check,
  Settings,
  Globe,
  Shield,
  Key,
  Link,
  FileText,
  Upload,
  Sparkles,
} from "lucide-react";
import type {
  Workspace,
  Space,
  JiraIntegration,
  JiraProject,
} from "@/lib/database.types";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import AzureSvg from "@/components/svg/apps/AzureSvg";
import AsanaSvg from "@/components/svg/apps/AsanaSvg";

interface IntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (integration: JiraIntegration) => void;
  workspace: Workspace;
  spaces: Space[];
  existingIntegration?: JiraIntegration;
  newlyCreatedSpace?: Space;
}

interface IntegrationPlatform {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  available: boolean;
}

const INTEGRATION_PLATFORMS: IntegrationPlatform[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Connect to Jira Cloud or Server",
    icon: JiraSvg,
    color: "bg-blue-500/10",
    available: true,
  },
  {
    id: "azure-devops",
    name: "Azure DevOps",
    description: "Connect to Microsoft Azure DevOps",
    icon: AzureSvg,
    color: "bg-blue-500/10",
    available: false, // Not implemented yet
  },
  {
    id: "asana",
    name: "Asana",
    description: "Connect to Asana workspace",
    icon: AsanaSvg,
    color: "bg-orange-500/10",
    available: false, // Not implemented yet
  },
];

interface JiraProjectOption {
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

interface JiraIssue {
  id: string;
  key: string;
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
}

interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    key: string;
    colorName: string;
  };
}

type Step = 1 | 2 | 3 | 4;

export default function IntegrationModal({
  open,
  onOpenChange,
  onSuccess,
  workspace,
  spaces,
  existingIntegration,
  newlyCreatedSpace,
}: IntegrationModalProps) {
  const params = useParams();
  const { toast } = useEnhancedToast();
  const supabase = createClientSupabaseClient();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [jiraDomain, setJiraDomain] = useState("");
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraApiToken, setJiraApiToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [hasSuccessfulConnection, setHasSuccessfulConnection] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<
    JiraProjectOption[]
  >([]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [projectIssues, setProjectIssues] = useState<
    Record<string, JiraIssue[]>
  >({});
  const [projectStatuses, setProjectStatuses] = useState<
    Record<string, JiraStatus[]>
  >({});
  const [isImporting, setIsImporting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (existingIntegration) {
        setSelectedPlatform("jira");
        setJiraDomain(existingIntegration.jira_domain);
        setJiraEmail(existingIntegration.jira_email);
        setJiraApiToken(existingIntegration.jira_api_token);
        setConnectionTested(true);
        setConnectionSuccess(true);
        setHasSuccessfulConnection(true);
        setCurrentStep(2);
      } else {
        if (
          !hasSuccessfulConnection &&
          !jiraDomain &&
          !jiraEmail &&
          !jiraApiToken
        ) {
          setSelectedPlatform("");
          setJiraDomain("");
          setJiraEmail("");
          setJiraApiToken("");
          setConnectionTested(false);
          setConnectionSuccess(false);
          setCurrentStep(1);
        } else if (hasSuccessfulConnection) {
          setConnectionTested(true);
          setConnectionSuccess(true);
          setCurrentStep(2);
        }
      }
      setSelectedProjects(new Set());

      // If there's a newly created space, use it as the default space
      if (newlyCreatedSpace) {
        setSelectedSpaceId(newlyCreatedSpace.id);
      } else {
        // Set the default space to the newly created space (last in the list)
        setSelectedSpaceId(
          spaces.length > 0 ? spaces[spaces.length - 1].id : ""
        );
      }

      if (availableProjects.length === 0) {
        setAvailableProjects([]);
      }
    }
  }, [
    open,
    existingIntegration,
    spaces,
    hasSuccessfulConnection,
    newlyCreatedSpace,
  ]);

  const testConnection = async () => {
    if (!jiraDomain || !jiraEmail || !jiraApiToken) {
      toast({
        title: "Missing information",
        description: "Please fill in all Jira connection details.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionTested(false);

    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/test-connection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setConnectionSuccess(true);
        setConnectionTested(true);
        setHasSuccessfulConnection(true);
        toast({
          title: "Connection successful",
          description: "Successfully connected to Jira!",
        });

        await fetchProjects();
      } else {
        setConnectionSuccess(false);
        setConnectionTested(true);
        setHasSuccessfulConnection(false);
        toast({
          title: "Connection failed",
          description:
            result.error ||
            "Could not connect to Jira. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Jira connection test error:", error);
      setConnectionSuccess(false);
      setConnectionTested(true);
      setHasSuccessfulConnection(false);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to Jira.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.projects) {
        setAvailableProjects(result.projects);
      } else {
        throw new Error(result.error || "Failed to fetch projects");
      }
    } catch (error: any) {
      console.error("Failed to fetch Jira projects:", error);
      toast({
        title: "Failed to fetch projects",
        description: "Could not retrieve projects from Jira.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const fetchIssuesAndStatuses = async () => {
    if (selectedProjects.size === 0) {
      toast({
        title: "No projects selected",
        description: "Please select at least one project to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingIssues(true);
    const issues: Record<string, JiraIssue[]> = {};
    const statuses: Record<string, JiraStatus[]> = {};

    try {
      for (const projectKey of selectedProjects) {
        const response = await fetch(
          `/api/workspace/${params.workspaceId}/jira/issues`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jira_domain: jiraDomain,
              jira_email: jiraEmail,
              jira_api_token: jiraApiToken,
              project_key: projectKey,
            }),
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          issues[projectKey] = result.issues;
          statuses[projectKey] = result.statuses;
        } else {
          console.error(
            `Failed to fetch data for project ${projectKey}:`,
            result.error
          );
        }
      }

      setProjectIssues(issues);
      setProjectStatuses(statuses);
      setCurrentStep(4);
    } catch (error: any) {
      console.error("Failed to fetch issues and statuses:", error);
      toast({
        title: "Failed to fetch data",
        description: "Could not retrieve issues and statuses from Jira.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingIssues(false);
    }
  };

  const importData = async () => {
    if (selectedProjects.size === 0) {
      toast({
        title: "No projects selected",
        description: "Please select at least one project to import.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
            space_id: selectedSpaceId,
            selected_projects: Array.from(selectedProjects),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const message = result.warning
          ? `${result.message} ${result.warning}`
          : `Successfully imported ${result.data.projects} projects, ${result.data.tasks} tasks, and ${result.data.statuses} statuses.`;

        toast({
          title: "Import successful",
          description: message,
          sendBrowserNotification: true,
          browserNotificationTitle: "Jira Import Complete",
          browserNotificationBody: `Successfully imported ${result.data.tasks} tasks from Jira.`,
        });

        // Reset form
        setSelectedPlatform("");
        setJiraDomain("");
        setJiraEmail("");
        setJiraApiToken("");
        setConnectionTested(false);
        setConnectionSuccess(false);
        setHasSuccessfulConnection(false);
        setSelectedProjects(new Set());
        setAvailableProjects([]);
        setProjectIssues({});
        setProjectStatuses({});
        setCurrentStep(1);

        // Dispatch refresh event to update secondary sidebar
        // Add a small delay to ensure database operations are complete
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("refreshSidebar"));
        }, 500);

        // Close modal
        onOpenChange(false);

        // Callback with the integration
        if (onSuccess) {
          const integration = {
            id: "", // Will be set by the import process
            workspace_id: workspace.id,
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          onSuccess(integration as JiraIntegration);
        }
      } else {
        throw new Error(result.error || "Failed to import data");
      }
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error.message || "Failed to import data from Jira.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const toggleProjectSelection = (projectKey: string) => {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectKey)) {
      newSelection.delete(projectKey);
    } else {
      newSelection.add(projectKey);
    }
    setSelectedProjects(newSelection);
  };

  const clearForm = () => {
    setSelectedPlatform("");
    setJiraDomain("");
    setJiraEmail("");
    setJiraApiToken("");
    setConnectionTested(false);
    setConnectionSuccess(false);
    setHasSuccessfulConnection(false);
    setSelectedProjects(new Set());
    setAvailableProjects([]);
    setProjectIssues({});
    setProjectStatuses({});
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedPlatform) {
      setCurrentStep(2);
    } else if (currentStep === 2 && connectionSuccess) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      fetchIssuesAndStatuses();
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Integration Platform
            </h3>
            <p className="text-sm text-gray-500">
              Choose the project management platform you want to connect to
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {INTEGRATION_PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedPlatform === platform.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            } ${!platform.available ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (platform.available) {
                setSelectedPlatform(platform.id);
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center p-2 ${platform.color} text-white`}
              >
                <platform.icon className="h-3 w-3" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{platform.name}</h3>
                <p className="text-sm text-gray-500">{platform.description}</p>
              </div>
              {selectedPlatform === platform.id && (
                <CheckCircle className="h-5 w-5 text-blue-500" />
              )}
              {!platform.available && (
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Connect to Jira
            </h3>
            <p className="text-sm text-gray-500">
              Enter your Jira credentials to establish connection
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Jira Domain
          </Label>
          <div className="px-1">
            <Input
              value={jiraDomain}
              onChange={(e) => setJiraDomain(e.target.value)}
              placeholder="your-domain.atlassian.net"
              className="h-11"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Your Jira Cloud domain URL</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Email Address
          </Label>
          <div className="px-1">
            <Input
              type="email"
              value={jiraEmail}
              onChange={(e) => setJiraEmail(e.target.value)}
              placeholder="your-email@company.com"
              className="h-11"
              required
            />
          </div>
          <p className="text-xs text-gray-500">
            The email associated with your Jira account
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Token
          </Label>
          <div className="px-1">
            <Input
              type="password"
              value={jiraApiToken}
              onChange={(e) => setJiraApiToken(e.target.value)}
              placeholder="Enter your Jira API token"
              className="h-11"
              required
            />
          </div>
          <p className="text-xs text-gray-500">
            <a
              href="https://id.atlassian.com/manage-profile/security/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Get your API token here
            </a>
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={testConnection}
          disabled={
            isTestingConnection || !jiraDomain || !jiraEmail || !jiraApiToken
          }
          className="w-full h-11"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>

        {connectionTested && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg ${
              connectionSuccess
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {connectionSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p
                className={`text-sm font-medium ${
                  connectionSuccess ? "text-green-800" : "text-red-800"
                }`}
              >
                {connectionSuccess
                  ? "Connection successful!"
                  : "Connection failed"}
              </p>
              <p
                className={`text-xs ${
                  connectionSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {connectionSuccess
                  ? "You're ready to proceed to the next step"
                  : "Please check your credentials and try again"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Projects to Import
            </h3>
            <p className="text-sm text-gray-500">
              Choose which Jira projects you want to import into this workspace
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Target Space
          </Label>
          <Select value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a space" />
            </SelectTrigger>
            <SelectContent>
              {spaces.map((space) => (
                <SelectItem key={space.id} value={space.id}>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-sm mr-2 ${
                        space.icon === "blue"
                          ? "bg-blue-500"
                          : space.icon === "green"
                          ? "bg-green-500"
                          : space.icon === "red"
                          ? "bg-red-500"
                          : space.icon === "purple"
                          ? "bg-purple-500"
                          : space.icon === "yellow"
                          ? "bg-yellow-500"
                          : space.icon === "pink"
                          ? "bg-pink-500"
                          : "bg-blue-500"
                      }`}
                    />
                    {space.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Available Projects
            </Label>
            <ScrollArea className="h-48 border rounded-lg p-3">
              <div className="space-y-2">
                {availableProjects.map((project) => (
                  <div
                    key={project.key}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={`project-${project.key}`}
                      checked={selectedProjects.has(project.key)}
                      onCheckedChange={() =>
                        toggleProjectSelection(project.key)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={`project-${project.key}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {project.name} ({project.key})
                      </Label>
                      {project.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Data for Import
            </h3>
            <p className="text-sm text-gray-500">
              Review the issues and statuses that will be imported from the
              selected projects
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from(selectedProjects).map((projectKey) => {
          const issues = projectIssues[projectKey] || [];
          const statuses = projectStatuses[projectKey] || [];
          const project = availableProjects.find((p) => p.key === projectKey);

          return (
            <div
              key={projectKey}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <h4 className="font-semibold text-gray-900 mb-3">
                {project?.name} ({projectKey})
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Statuses ({statuses.length})
                  </h5>
                  <div className="space-y-1">
                    {statuses.slice(0, 5).map((status) => (
                      <div key={status.id} className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status.statusCategory.colorName === "green"
                              ? "bg-green-500"
                              : status.statusCategory.colorName === "yellow"
                              ? "bg-yellow-500"
                              : status.statusCategory.colorName === "red"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="text-xs">{status.name}</span>
                      </div>
                    ))}
                    {statuses.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{statuses.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Issues ({issues.length})
                  </h5>
                  <div className="space-y-1">
                    {issues.slice(0, 5).map((issue) => (
                      <div key={issue.id} className="text-xs">
                        <div className="font-medium">{issue.key}</div>
                        <div className="text-gray-500 truncate">
                          {issue.summary}
                        </div>
                      </div>
                    ))}
                    {issues.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{issues.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const steps = [
    { number: 1, title: "Platform", icon: Sparkles },
    { number: 2, title: "Connect", icon: Settings },
    { number: 3, title: "Projects", icon: FileText },
    { number: 4, title: "Import", icon: Upload },
  ];

  const stepDescriptions = {
    1: "Choose platform",
    2: "Enter credentials",
    3: "Select projects",
    4: "Review & import",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-blue-600" />
            </div>
            {existingIntegration ? "Update Integration" : "Connect Integration"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {existingIntegration
              ? "Update your integration settings and project connections."
              : "Connect your workspace to an external project management platform."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center w-full">
          {/* Progress Steps */}
          <div className="w-full">
            <div className="w-full">
              <div className="grid grid-cols-4 items-center w-full">
                {steps.map((step, idx) => {
                  const isActive = currentStep === step.number;
                  return (
                    <div
                      key={step.number}
                      className={`pb-2 border-b-2 ${
                        currentStep >= step.number
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <span
                        className={`text-xs flex-1 select-none transition-colors duration-200 flex items-center gap-2 ${
                          currentStep >= step.number
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentStep >= step.number
                              ? "bg-blue-100"
                              : "bg-gray-200"
                          }`}
                        >
                          {currentStep > step.number ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <step.icon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">
                            {step.title}
                          </span>
                          <span className="text-[10px]">
                            {
                              stepDescriptions[
                                step.number as keyof typeof stepDescriptions
                              ]
                            }
                          </span>
                        </div>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
          {renderCurrentStep()}
        </div>

        <Separator className="mt-2" />

        {/* Footer */}
        <DialogFooter className="pt-4 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            disabled={isLoading || isImporting}
            className="h-10 px-4"
          >
            Clear Form
          </Button>

          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isLoading || isImporting}
              className="h-10 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}

          {currentStep < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !selectedPlatform) ||
                (currentStep === 2 && !connectionSuccess) ||
                (currentStep === 3 && selectedProjects.size === 0) ||
                isLoading ||
                isImporting ||
                isLoadingIssues
              }
              className="h-10 px-6"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {currentStep === 4 && (
            <Button
              type="button"
              onClick={importData}
              disabled={isImporting || selectedProjects.size === 0}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import Data"
              )}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

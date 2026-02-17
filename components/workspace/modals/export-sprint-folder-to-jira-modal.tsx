"use client";

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
import { Progress } from "@/components/ui/progress";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Settings,
  Info,
  ChevronRight,
  Globe,
  Shield,
  Key,
  Link,
  FolderKanban,
} from "lucide-react";
import type {
  Workspace,
  Space,
  SprintFolder,
  Status,
} from "@/lib/database.types";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { colorThemes } from "@/types";
import dynamic from "next/dynamic";
import LOAD_LOTTIE from "@/public/images/lottie/load.json";
import SprintiQSvg from "@/components/svg/apps/SprintiQSvg";

interface ExportSprintFolderToJiraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  workspace: Workspace;
  spaces: Space[];
  selectedSprintFolder?: SprintFolder;
  selectedSpace?: Space;
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function ExportSprintFolderToJiraModal({
  open,
  onOpenChange,
  onSuccess,
  workspace,
  spaces,
  selectedSprintFolder,
  selectedSpace,
}: ExportSprintFolderToJiraModalProps) {
  const params = useParams();
  const { toast } = useEnhancedToast();
  const supabase = createClientSupabaseClient();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [jiraDomain, setJiraDomain] = useState("");
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraApiToken, setJiraApiToken] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [selectedJiraProject, setSelectedJiraProject] = useState("");
  const [createNewProject, setCreateNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectKey, setNewProjectKey] = useState("");
  const [jiraStatuses, setJiraStatuses] = useState<any[]>([]);
  const [localStatuses, setLocalStatuses] = useState<Status[]>([]);
  const [statusMappings, setStatusMappings] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({
    current: 0,
    total: 0,
    percentage: 0,
  });
  const [exportCompleted, setExportCompleted] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(false);
  const [isCheckingFields, setIsCheckingFields] = useState(false);
  const [isFetchingStatuses, setIsFetchingStatuses] = useState(false);
  const [fieldsCheckResult, setFieldsCheckResult] = useState<any>(null);
  const [sprintFolderData, setSprintFolderData] = useState<any>(null);

  const DynamicLottie = dynamic(() => import("lottie-react"), {
    ssr: false,
    loading: () => (
      <div className="w-64 h-64 bg-transparent/50 rounded-full animate-pulse"></div>
    ),
  });

  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setJiraDomain("");
      setJiraEmail("");
      setJiraApiToken("");
      setConnectionSuccess(false);
      setSelectedJiraProject("");
      setCreateNewProject(false);
      setNewProjectName("");
      setNewProjectKey("");
      setStatusMappings([]);
      setExportProgress({ current: 0, total: 0, percentage: 0 });
      setExportCompleted(false);
      fetchSprintFolderData();
    }
  }, [open, selectedSprintFolder]);

  // Generate project key from project name
  useEffect(() => {
    if (newProjectName && createNewProject) {
      const key = newProjectName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 10);
      setNewProjectKey(key);
    }
  }, [newProjectName, createNewProject]);

  useEffect(() => {
    if (!isFetchingProjects && availableProjects.length === 0) {
      setCreateNewProject(true);
    }
  }, [isFetchingProjects, availableProjects]);

  const fetchSprintFolderData = async () => {
    if (!selectedSprintFolder) {
      console.log("No selectedSprintFolder provided");
      return;
    }

    console.log("Fetching sprint folder data for:", selectedSprintFolder.id);

    try {
      // Get sprint folder data
      const { data: sprintFolder, error: sprintFolderError } = await supabase
        .from("sprint_folders")
        .select(
          `
          *,
          space:spaces(*)
        `
        )
        .eq("id", selectedSprintFolder.id)
        .single();

      if (sprintFolderError) {
        console.error("Error fetching sprint folder:", sprintFolderError);
        return;
      }

      // Get sprints for this sprint folder
      const { data: sprints, error: sprintsError } = await supabase
        .from("sprints")
        .select(
          `
          *
        `
        )
        .eq("sprint_folder_id", selectedSprintFolder.id);

      if (sprintsError) {
        console.error("Error fetching sprints:", sprintsError);
        return;
      }

      // Get tasks for all sprints
      const sprintIds = sprints?.map((sprint) => sprint.id) || [];
      let tasksData: any[] = [];

      if (sprintIds.length > 0) {
        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select(
            `
            *,
            status:statuses(*)
          `
          )
          .in("sprint_id", sprintIds);

        if (tasksError) {
          console.error("Error fetching tasks:", tasksError);
          return;
        }

        tasksData = tasks || [];
      }

      // Combine sprint folder with sprints and tasks
      const sprintFolderWithData = {
        ...sprintFolder,
        sprints:
          sprints?.map((sprint: any) => ({
            ...sprint,
            tasks: tasksData.filter((task) => task.sprint_id === sprint.id),
          })) || [],
      };

      console.log(
        "Sprint folder data fetched successfully:",
        sprintFolderWithData
      );
      setSprintFolderData(sprintFolderWithData);
    } catch (error) {
      console.error("Error fetching sprint folder data:", error);
    }
  };

  const testConnection = async () => {
    if (!jiraDomain || !jiraEmail || !jiraApiToken) {
      toast({
        title: "Missing credentials",
        description:
          "Please fill in all Jira credentials before testing connection.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/test-connection`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
          }),
        }
      );
      const result = await response.json();
      setConnectionSuccess(result.success);
      if (result.success) {
        toast({
          title: "Connection successful",
          description: "Connected to Jira!",
        });
      } else {
        toast({
          title: "Connection failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionSuccess(false);
      toast({
        title: "Connection failed",
        description: "Failed to connect",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const fetchProjects = async () => {
    setIsFetchingProjects(true);
    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/projects`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
          }),
        }
      );
      const result = await response.json();
      setAvailableProjects(result.projects || []);
    } catch (error) {
      toast({
        title: "Failed to fetch projects",
        description: "Error loading Jira projects",
        variant: "destructive",
      });
    } finally {
      setIsFetchingProjects(false);
    }
  };

  const checkFields = async (projectKey: string) => {
    setIsCheckingFields(true);
    setFieldsCheckResult(null);

    try {
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/check-fields`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jiraCredentials: {
              jira_domain: jiraDomain,
              jira_email: jiraEmail,
              jira_api_token: jiraApiToken,
            },
            projectKey,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setFieldsCheckResult(result);
        console.log("Fields check completed:", result);
      } else {
        throw new Error(result.error || "Failed to check fields");
      }
    } catch (error: any) {
      console.log("Failed to check fields:", error);
    } finally {
      setIsCheckingFields(false);
    }
  };

  const fetchStatuses = async () => {
    setIsFetchingStatuses(true);
    try {
      const projectKey = createNewProject ? newProjectKey : selectedJiraProject;
      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/statuses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
            projectKey,
          }),
        }
      );
      const result = await response.json();
      setJiraStatuses(result.statuses || []);

      // Load local statuses for the workspace
      const { data: statuses } = await supabase
        .from("statuses")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("position", { ascending: true });
      setLocalStatuses(statuses || []);

      // Auto-map statuses with intelligent matching
      const mappings = (statuses || []).map((localStatus: Status) => {
        // Check if this status is already integrated with Jira
        if (
          localStatus.integration_type === "jira" &&
          localStatus.external_id
        ) {
          const existingJiraStatus = result.statuses?.find(
            (jiraStatus: any) => jiraStatus.id === localStatus.external_id
          );

          if (existingJiraStatus) {
            return {
              localStatusId: localStatus.id,
              localStatusName: localStatus.name,
              jiraStatusId: existingJiraStatus.id,
              jiraStatusName: existingJiraStatus.name,
              isExistingIntegration: true,
            };
          }
        }

        // Try to find a matching Jira status based on name similarity
        let bestMatch = result.statuses?.[0];

        if (result.statuses && result.statuses.length > 0) {
          const localStatusName = localStatus.name.toLowerCase();

          // First try exact name match
          let exactMatch = result.statuses.find(
            (jiraStatus: any) =>
              jiraStatus.name.toLowerCase() === localStatusName
          );

          if (exactMatch) {
            bestMatch = exactMatch;
          } else {
            // Try partial name match
            let partialMatch = result.statuses.find(
              (jiraStatus: any) =>
                jiraStatus.name.toLowerCase().includes(localStatusName) ||
                localStatusName.includes(jiraStatus.name.toLowerCase())
            );

            if (partialMatch) {
              bestMatch = partialMatch;
            } else {
              // Try to match by status category/type
              const statusTypeKeywords = {
                "not-started": ["to do", "open", "new", "backlog"],
                active: ["in progress", "active", "doing", "started"],
                done: ["done", "complete", "finished", "resolved"],
                closed: ["closed", "cancelled", "rejected"],
              };

              let statusType = "active";
              if (localStatus.status_type) {
                if (Array.isArray(localStatus.status_type)) {
                  statusType = localStatus.status_type[0]?.name || "active";
                } else if (typeof localStatus.status_type === "object") {
                  statusType = localStatus.status_type.name || "active";
                }
              }

              const keywords =
                statusTypeKeywords[
                  statusType as keyof typeof statusTypeKeywords
                ] || [];

              let keywordMatch = result.statuses.find((jiraStatus: any) =>
                keywords.some((keyword) =>
                  jiraStatus.name.toLowerCase().includes(keyword)
                )
              );

              if (keywordMatch) {
                bestMatch = keywordMatch;
              }
            }
          }
        }

        return {
          localStatusId: localStatus.id,
          localStatusName: localStatus.name,
          jiraStatusId: bestMatch?.id || "",
          jiraStatusName: bestMatch?.name || "",
          isExistingIntegration: false,
        };
      });
      setStatusMappings(mappings);
    } catch (error) {
      toast({
        title: "Failed to fetch statuses",
        description: "Error loading statuses",
        variant: "destructive",
      });
    } finally {
      setIsFetchingStatuses(false);
    }
  };

  const startExport = async () => {
    setIsExporting(true);
    setCurrentStep(4);

    try {
      const projectKey = createNewProject ? newProjectKey : selectedJiraProject;
      const projectName = createNewProject
        ? newProjectName
        : availableProjects.find((p) => p.key === selectedJiraProject)?.name ||
          "";

      const response = await fetch(
        `/api/workspace/${params.workspaceId}/jira/export-sprint-folder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jiraCredentials: {
              jira_domain: jiraDomain,
              jira_email: jiraEmail,
              jira_api_token: jiraApiToken,
            },
            projectKey,
            projectName,
            createNewProject,
            statusMappings,
            sprintFolderId: selectedSprintFolder?.id,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setExportCompleted(true);
        setCurrentStep(5);
        toast({
          title: "Export completed",
          description: `Exported ${result.data.tasksExported} tasks and created ${result.data.sprintsCreated} sprints!`,
          sendBrowserNotification: true,
          browserNotificationTitle: "Sprint Folder Export Complete",
          browserNotificationBody: `Successfully exported sprint folder to Jira with ${result.data.tasksExported} tasks and ${result.data.sprintsCreated} sprints.`,
        });

        if (onSuccess) onSuccess();

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
      setCurrentStep(3);
    } finally {
      setIsExporting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && connectionSuccess) {
      setCurrentStep(2);
      fetchProjects();
    } else if (currentStep === 2 && (selectedJiraProject || createNewProject)) {
      setCurrentStep(3);
      fetchStatuses();
    } else if (currentStep === 3 && statusMappings.length > 0) {
      startExport();
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && currentStep < 5) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2 p-1">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Jira Domain
        </Label>
        <Input
          placeholder="your-domain.atlassian.net"
          value={jiraDomain}
          variant="workspace"
          onChange={(e) => setJiraDomain(e.target.value)}
          className="h-11"
        />
        <p className="text-xs text-gray-500">Your Jira Cloud domain URL</p>
      </div>

      <div className="space-y-2 p-1">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Email Address
        </Label>
        <Input
          type="email"
          placeholder="your-email@company.com"
          value={jiraEmail}
          onChange={(e) => setJiraEmail(e.target.value)}
          className="h-11"
          variant="workspace"
        />
        <p className="text-xs text-gray-500">
          The email associated with your Jira account
        </p>
      </div>

      <div className="space-y-2 p-1">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Key className="w-4 h-4" />
          API Token
        </Label>
        <Input
          type="password"
          placeholder="Enter your Jira API token"
          value={jiraApiToken}
          onChange={(e) => setJiraApiToken(e.target.value)}
          className="h-11"
          variant="workspace"
        />
        <p className="text-xs text-gray-500">
          <a
            href="https://id.atlassian.com/manage-profile/security/api-tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-workspace-primary hover:text-workspace-primary-light underline"
          >
            Get your API token here
          </a>
        </p>
      </div>

      <Button
        onClick={testConnection}
        disabled={
          isTestingConnection || !jiraDomain || !jiraEmail || !jiraApiToken
        }
        variant="workspace"
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

      {connectionSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Connection successful!
            </p>
            <p className="text-xs text-green-600">
              You're ready to proceed to the next step
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col items-center w-full">
      <Tabs
        defaultValue={createNewProject ? "new" : "existing"}
        value={createNewProject ? "new" : "existing"}
        onValueChange={(val) => setCreateNewProject(val === "new")}
        className="w-full flex flex-col items-center"
      >
        <TabsList className="w-full flex justify-center">
          <TabsTrigger value="existing" className="w-full">
            Existing Project
          </TabsTrigger>
          <TabsTrigger value="new" className="w-full">
            Create New Project
          </TabsTrigger>
        </TabsList>
        <TabsContent value="existing" className="w-full h-[30vh]">
          <div className="space-y-2 h-full">
            <Label className="text-xs">Select Existing Project</Label>
            {isFetchingProjects ? (
              <div className="space-y-4 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
                  >
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : availableProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(30vh-35px)] p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  No Projects Found
                </h3>
                <p className="text-xs text-gray-500 text-center max-w-xs">
                  No existing projects were found in your Jira instance. Please
                  create a new project to continue.
                </p>
              </div>
            ) : (
              <RadioGroup
                value={selectedJiraProject}
                onValueChange={(value) => {
                  setSelectedJiraProject(value);
                  if (value) {
                    checkFields(value);
                  }
                }}
                className="space-y-3 mt-4"
              >
                {availableProjects.map((project) => (
                  <div
                    key={project.key}
                    className="group relative flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:slider-workspace-primary hover:workspace-component-bg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                      <RadioGroupItem
                        value={project.key}
                        id={project.key}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={project.key}
                        className="cursor-pointer w-full"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-900 group-hover:text-workspace-primary transition-colors">
                            {project.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-workspace-primary-100 group-hover:text-workspace-primary transition-colors">
                              {project.key}
                            </span>
                            {project.projectTypeKey && (
                              <span className="text-xs text-gray-500 capitalize">
                                {project.projectTypeKey}
                              </span>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 rounded-full workspace-primary"></div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </TabsContent>
        <TabsContent value="new" className="w-full">
          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <Label className="text-xs">Project Name</Label>
              <Input
                placeholder="My New Project"
                variant="workspace"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="h-11 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Project Key</Label>
              <Input
                placeholder="MNP"
                variant="workspace"
                value={newProjectKey}
                onChange={(e) => setNewProjectKey(e.target.value.toUpperCase())}
                maxLength={10}
                className="h-11 text-sm"
              />
              <div className="text-xs text-gray-500 space-y-1">
                <p>Short identifier for your project (max 10 characters)</p>
                <p>• Use only letters and numbers (A-Z, 0-9)</p>
                <p>• Must be unique across your Jira instance</p>
                {newProjectKey && (
                  <p
                    className={`font-bold ${
                      newProjectKey.length < 2
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {newProjectKey.length < 2
                      ? "Project key must be at least 2 characters"
                      : `Project key: ${newProjectKey}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-700 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Your Statuses
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Jira Statuses
          </div>
        </div>

        {isFetchingStatuses ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">Loading statuses...</p>
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : localStatuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No local statuses found</p>
          </div>
        ) : (
          <ScrollArea className="space-y-3 max-h-64">
            {localStatuses.map((localStatus) => {
              const mapping = statusMappings.find(
                (m) => m.localStatusId === localStatus.id
              );
              return (
                <div
                  key={localStatus.id}
                  className={`flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors rounded-lg border ${
                    mapping?.isExistingIntegration
                      ? "border-green-200 bg-green-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                          colorThemes.find(
                            (theme) => theme.value === localStatus.color
                          )?.color
                        }`}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {localStatus.name}
                        </span>
                        {mapping?.isExistingIntegration && (
                          <Badge
                            variant="default"
                            className="text-xs px-1 py-0"
                          >
                            <Link className="w-3 h-3 mr-1" />
                            Integrated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <Select
                      value={mapping?.jiraStatusId || ""}
                      onValueChange={(value) => {
                        setStatusMappings((prev) =>
                          prev.map((m) =>
                            m.localStatusId === localStatus.id
                              ? { ...m, jiraStatusId: value }
                              : m
                          )
                        );
                      }}
                      disabled={isFetchingStatuses}
                    >
                      <SelectTrigger
                        className={`h-9 ${
                          !mapping?.jiraStatusId
                            ? "border-orange-300 bg-orange-50"
                            : mapping?.isExistingIntegration
                            ? "border-green-300 bg-green-50"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Jira status" />
                      </SelectTrigger>
                      <SelectContent>
                        {jiraStatuses.map((jiraStatus) => (
                          <SelectItem key={jiraStatus.id} value={jiraStatus.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                              <span>{jiraStatus.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Exporting Sprint Folder to Jira
            </h3>
            <p className="text-sm text-gray-500">
              Creating board, sprints, and exporting tasks
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="flex items-center justify-center">
          <div className="w-[100px] h-[100px]">
            <SprintiQSvg />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <DynamicLottie
            animationData={LOAD_LOTTIE}
            loop={true}
            className="w-[100px] h-[100px]"
          />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-[100px] h-[100px] bg-blue-50 rounded-lg p-4">
            <JiraSvg />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Exporting to Jira</p>
          <p className="text-xs text-gray-400">
            This may take a few minutes depending on the amount of data
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                What's happening?
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Creating Jira project (if new)</li>
                <li>• Creating filter for the project</li>
                <li>• Creating scrum board</li>
                <li>• Creating sprints</li>
                <li>• Exporting tasks as issues</li>
                <li>• Moving issues to sprints</li>
              </ul>
            </div>
          </div>
        </div>

        {sprintFolderData && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FolderKanban className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Sprint Folder: {sprintFolderData.name}
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• {sprintFolderData.sprints?.length || 0} sprints</p>
              <p>
                •{" "}
                {sprintFolderData.sprints?.reduce(
                  (total: number, sprint: any) =>
                    total + (sprint.tasks?.length || 0),
                  0
                ) || 0}{" "}
                total tasks
              </p>
            </div>
          </div>
        )}

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Tip:</strong> Don't close this window during the export
            process. You'll be notified when it's complete!
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Export Completed!
            </h3>
            <p className="text-sm text-gray-500">
              Your sprint folder has been successfully exported to Jira
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          What's Next?
        </h4>
        <ul className="text-sm text-green-700 space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>A new Jira project has been created (if needed)</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>A scrum board has been created for your sprint folder</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>All sprints have been created in Jira</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>
              All tasks have been exported as issues and moved to their
              respective sprints
            </span>
          </li>
        </ul>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Need Help?</p>
            <p className="text-xs text-blue-700">
              Check out our documentation for detailed guides on managing your
              Jira integration.
            </p>
          </div>
        </div>
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
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  const steps = [
    { number: 1, title: "Connect", icon: Link },
    { number: 2, title: "Project", icon: FileText },
    { number: 3, title: "Map", icon: Settings },
    { number: 4, title: "Export", icon: Upload },
    { number: 5, title: "Complete", icon: CheckCircle },
  ];

  const stepDescriptions = {
    1: "Connect to Jira",
    2: "Select a project",
    3: "Map statuses",
    4: "Export data",
    5: "Export completed",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <JiraSvg />
            </div>
            Export Sprint Folder to Jira
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Export your sprint folder with all sprints and tasks to Jira
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center w-full">
          <div className="w-full">
            <div className="grid grid-cols-5 items-center w-full">
              {steps.map((step, idx) => {
                const isActive = currentStep === step.number;
                return (
                  <div
                    key={step.number}
                    className={`pb-2 border-b-2 ${
                      currentStep >= step.number
                        ? "border-workspace-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-xs flex-1 select-none transition-colors duration-200 flex items-center gap-2 ${
                        currentStep >= step.number
                          ? "text-workspace-primary"
                          : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentStep >= step.number
                            ? "workspace-component-bg"
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
                        <span className="text-xs font-bold">{step.title}</span>
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

        <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
          {renderCurrentStep()}
        </div>

        <Separator className="mt-2" />

        <DialogFooter className="pt-4 gap-3">
          {currentStep > 1 && currentStep < 5 && (
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isExporting}
              className="h-10 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}

          {currentStep < 4 && (
            <Button
              onClick={nextStep}
              variant="workspace"
              disabled={
                (currentStep === 1 && !connectionSuccess) ||
                (currentStep === 2 &&
                  !selectedJiraProject &&
                  !createNewProject) ||
                (currentStep === 2 &&
                  createNewProject &&
                  (!newProjectName ||
                    !newProjectKey ||
                    newProjectKey.length < 2)) ||
                (currentStep === 3 &&
                  (statusMappings.length === 0 ||
                    statusMappings.some((mapping) => !mapping.jiraStatusId))) ||
                isExporting ||
                isFetchingStatuses
              }
              className="h-10 px-6"
            >
              {isFetchingStatuses ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Statuses...
                </>
              ) : currentStep === 3 ? (
                "Start Export"
              ) : (
                "Next"
              )}
              {!isFetchingStatuses && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          )}

          {currentStep === 5 && (
            <Button
              onClick={() => onOpenChange(false)}
              variant="workspace"
              className="h-10 px-6"
            >
              Done
            </Button>
          )}

          {currentStep < 5 && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
              className="h-10 px-4"
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

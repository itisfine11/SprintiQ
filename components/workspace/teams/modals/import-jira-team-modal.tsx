"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  ArrowRight,
  ArrowLeft,
  Globe,
  Shield,
  Key,
  UserPlus,
  Settings,
  FileText,
} from "lucide-react";
import { getAvatarInitials } from "@/lib/utils";
import type { Role, Level } from "@/lib/database.types";
import JiraSvg from "@/components/svg/apps/JiraSvg";

interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
  timeZone: string;
  avatarUrls: {
    "48x48": string;
  };
}

interface ImportJiraTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  levels: Level[];
  workspaceId: string;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3;

export default function ImportJiraTeamModal({
  open,
  onOpenChange,
  roles,
  levels,
  workspaceId,
  onSuccess,
}: ImportJiraTeamModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Jira Connection
  const [jiraDomain, setJiraDomain] = useState("");
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraApiToken, setJiraApiToken] = useState("");
  const [connectionTested, setConnectionTested] = useState(false);

  // Step 2: User Selection
  const [jiraUsers, setJiraUsers] = useState<JiraUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState<any[]>([]);

  // Step 3: Team Creation
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [userLevels, setUserLevels] = useState<Record<string, string>>({});

  const resetModal = () => {
    setCurrentStep(1);
    setIsLoading(false);
    setError(null);
    setJiraDomain("");
    setJiraEmail("");
    setJiraApiToken("");
    setConnectionTested(false);
    setJiraUsers([]);
    setSelectedUsers(new Set());
    setSelectedProject("");
    setProjects([]);
    setTeamName("");
    setTeamDescription("");
    setUserRoles({});
    setUserLevels({});
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetModal();
    }
    onOpenChange(open);
  };

  const testConnection = async () => {
    if (!jiraDomain || !jiraEmail || !jiraApiToken) {
      setError("Please fill in all Jira credentials");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/workspace/${workspaceId}/jira/test-connection`,
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

      const data = await response.json();

      if (data.success) {
        setConnectionTested(true);
        await fetchProjects();
      } else {
        setError(data.error || "Failed to connect to Jira");
      }
    } catch (error) {
      setError("Failed to test connection");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `/api/workspace/${workspaceId}/jira/projects`,
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

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects || []);
      } else {
        setError(data.error || "Failed to fetch projects");
      }
    } catch (error) {
      setError("Failed to fetch projects");
    }
  };

  const fetchUsers = async () => {
    if (!selectedProject) {
      setError("Please select a project");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workspace/${workspaceId}/jira/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jira_domain: jiraDomain,
          jira_email: jiraEmail,
          jira_api_token: jiraApiToken,
          project_key: selectedProject,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJiraUsers(data.users || []);
        // Auto-select all users initially
        setSelectedUsers(
          new Set(data.users.map((user: JiraUser) => user.accountId))
        );
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async () => {
    if (!teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    if (selectedUsers.size === 0) {
      setError("Please select at least one user");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const selectedUsersArray = Array.from(selectedUsers);
      const teamMembers = selectedUsersArray.map((accountId) => {
        const user = jiraUsers.find((u) => u.accountId === accountId);
        return {
          accountId,
          email: user?.emailAddress || "",
          displayName: user?.displayName || "",
          roleId: userRoles[accountId] || roles[0]?.id,
          levelId: userLevels[accountId] || levels[0]?.id,
        };
      });

      const response = await fetch(
        `/api/workspace/${workspaceId}/jira/import-team`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jira_domain: jiraDomain,
            jira_email: jiraEmail,
            jira_api_token: jiraApiToken,
            team_name: teamName,
            team_description: teamDescription,
            team_members: teamMembers,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        onSuccess();
        handleOpenChange(false);
      } else {
        setError(data.error || "Failed to create team");
      }
    } catch (error) {
      setError("Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserToggle = (accountId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId);
    } else {
      newSelected.add(accountId);
    }
    setSelectedUsers(newSelected);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!connectionTested) {
        setError("Please test the connection first");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedUsers.size === 0) {
        setError("Please select at least one user");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  useEffect(() => {
    if (currentStep === 2 && selectedProject) {
      fetchUsers();
    }
  }, [selectedProject]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <JiraSvg />
            </div>
            Import Team from Jira
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Connect to Jira and import users to create a new team with
            step-by-step configuration
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex flex-col items-center w-full">
          <div className="w-full">
            <div className="w-full">
              <div className="grid grid-cols-3 items-center w-full">
                {[
                  {
                    number: 1,
                    title: "Connect",
                    icon: Globe,
                    description: "Connect to Jira",
                  },
                  {
                    number: 2,
                    title: "Select",
                    icon: Users,
                    description: "Select users",
                  },
                  {
                    number: 3,
                    title: "Create",
                    icon: UserPlus,
                    description: "Create team",
                  },
                ].map((step, idx) => {
                  const isActive = currentStep >= step.number;
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
                          <span className="text-xs font-bold">
                            {step.title}
                          </span>
                          <span className="text-[10px]">
                            {step.description}
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

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
          {/* Step 1: Connect to Jira */}
          {currentStep === 1 && (
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
                <p className="text-xs text-gray-500">
                  Your Jira Cloud domain URL
                </p>
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
                  isLoading || !jiraDomain || !jiraEmail || !jiraApiToken
                }
                variant="workspace"
                className="w-full h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>

              {connectionTested && (
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
          )}

          {/* Step 2: Select Users */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2 p-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Select Project
                </Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.key} value={project.key}>
                        {project.name} ({project.key})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select a project to fetch its users
                </p>
              </div>

              {jiraUsers.length > 0 && (
                <div className="space-y-2 p-1">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Select Users ({selectedUsers.size} selected)
                  </Label>
                  <ScrollArea className="h-[300px] border rounded-md p-2">
                    <div className="space-y-2">
                      {jiraUsers.map((user) => (
                        <div
                          key={user.accountId}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <Checkbox
                            checked={selectedUsers.has(user.accountId)}
                            onCheckedChange={() =>
                              handleUserToggle(user.accountId)
                            }
                          />
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatarUrls["48x48"]} />
                            <AvatarFallback className="text-sm">
                              {getAvatarInitials(
                                user.displayName,
                                user.emailAddress
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.displayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.emailAddress || "No email"}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {user.timeZone}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Create Team */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2 p-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Team Name
                </Label>
                <Input
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="h-11"
                  variant="workspace"
                />
                <p className="text-xs text-gray-500">
                  Choose a name for your new team
                </p>
              </div>

              <div className="space-y-2 p-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Description (Optional)
                </Label>
                <Input
                  placeholder="Enter team description"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className="h-11"
                  variant="workspace"
                />
                <p className="text-xs text-gray-500">
                  Add a description to help identify the team
                </p>
              </div>

              <div className="space-y-2 p-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members ({selectedUsers.size} users)
                </Label>
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  <div className="space-y-3">
                    {Array.from(selectedUsers).map((accountId) => {
                      const user = jiraUsers.find(
                        (u) => u.accountId === accountId
                      );
                      if (!user) return null;

                      return (
                        <div
                          key={accountId}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatarUrls["48x48"]} />
                            <AvatarFallback className="text-sm">
                              {getAvatarInitials(
                                user.displayName,
                                user.emailAddress
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.displayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.emailAddress || "No email"}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Select
                              value={userRoles[accountId] || roles[0]?.id}
                              onValueChange={(value) =>
                                setUserRoles({
                                  ...userRoles,
                                  [accountId]: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={userLevels[accountId] || levels[0]?.id}
                              onValueChange={(value) =>
                                setUserLevels({
                                  ...userLevels,
                                  [accountId]: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {levels.map((level) => (
                                  <SelectItem key={level.id} value={level.id}>
                                    {level.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        <Separator className="mt-2" />

        {/* Footer */}
        <DialogFooter className="pt-4 gap-3">
          {currentStep > 1 && currentStep < 4 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
              className="h-10 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}

          {currentStep < 3 && (
            <Button
              onClick={handleNext}
              variant="workspace"
              disabled={
                (currentStep === 1 && !connectionTested) ||
                (currentStep === 2 && selectedUsers.size === 0) ||
                isLoading
              }
              className="h-10 px-6"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {currentStep === 3 && (
            <Button
              onClick={createTeam}
              variant="workspace"
              disabled={isLoading}
              className="h-10 px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Team...
                </>
              ) : (
                "Create Team"
              )}
            </Button>
          )}

          {currentStep < 4 && (
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
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

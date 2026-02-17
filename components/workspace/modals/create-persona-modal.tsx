"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import {
  Lightbulb,
  Users,
  Briefcase,
  Building,
  Search,
  Sparkles,
  Copy,
  ArrowRight,
  Code,
  Target,
  Shield,
  Settings,
  AlertCircle,
  Zap,
  Clock,
  Star,
  User,
  CheckCircle,
  Goal,
} from "lucide-react";
import { Persona } from "@/lib/database.types";
import {
  detectPersonaAttributesClient,
  getUserPersonaLimitsClient,
} from "@/lib/persona-intelligence-service-client";
import { useAuth } from "@/contexts/auth-context";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";

interface CreatePersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description: string;
    techSavviness?: number;
    usageFrequency?: "daily" | "weekly" | "monthly";
    priorityLevel?: "high" | "medium" | "low";
    role?: string;
    domain?: string;
  }) => void;
  editingPersona?: Persona | null;
  onClose: () => void;
  workspaceId: string;
}

interface GuidedPrompt {
  question: string;
  placeholder: string;
  value: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
}

interface DetectedAttributes {
  techSavviness: number;
  role: string;
  domain: string;
  usageFrequency: "daily" | "weekly" | "monthly";
  priorityLevel: "high" | "medium" | "low";
  confidence: number;
}

const quickTemplates: Template[] = [
  // Software Development Teams
  {
    id: "software-dev-teams",
    name: "Software Development Teams",
    category: "Software Development",
    description: "Developers and DevOps engineers at mid-size tech companies",
    content:
      "Software developers and DevOps engineers at mid-size tech companies who work with microservices, CI/CD pipelines, and need tools that integrate with their existing workflow (Jira, GitHub, Slack)",
  },
  {
    id: "data-science-teams",
    name: "Data Science Teams",
    category: "Software Development",
    description: "Data scientists and ML engineers at enterprise companies",
    content:
      "Data scientists and ML engineers at enterprise companies who use Python/R daily, work with large datasets, and need to collaborate with business stakeholders to translate requirements into technical solutions",
  },
  {
    id: "frontend-mobile-dev",
    name: "Frontend/Mobile Developers",
    category: "Software Development",
    description: "Frontend developers and UX engineers at digital agencies",
    content:
      "Frontend developers and UX engineers at digital agencies who build responsive web applications and mobile apps for clients across various industries, requiring rapid prototyping and client communication tools",
  },

  // Business/Product-Focused
  {
    id: "product-management-teams",
    name: "Product Management Teams",
    category: "Business/Product",
    description: "Product managers and business analysts at SaaS companies",
    content:
      "Product managers and business analysts at SaaS companies who manage complex product roadmaps, coordinate with engineering teams, and need to clearly communicate requirements to both technical and non-technical stakeholders",
  },
  {
    id: "startup-founders",
    name: "Startup Founders & Small Teams",
    category: "Business/Product",
    description:
      "Non-technical founders and small product teams at early-stage startups",
    content:
      "Non-technical founders and small product teams (2-10 people) at early-stage startups who need to quickly validate ideas, create MVPs, and communicate product vision to investors and early customers",
  },
  {
    id: "digital-transformation",
    name: "Digital Transformation Teams",
    category: "Business/Product",
    description:
      "Business process managers and digital transformation leads at traditional enterprises",
    content:
      "Business process managers and digital transformation leads at traditional enterprises who are modernizing legacy systems and need to bridge the gap between business requirements and technical implementation",
  },

  // Industry-Specific
  {
    id: "healthcare-technology",
    name: "Healthcare Technology",
    category: "Industry-Specific",
    description:
      "Healthcare IT professionals and clinical workflow specialists",
    content:
      "Healthcare IT professionals and clinical workflow specialists at hospitals and medical device companies who must ensure HIPAA compliance, integrate with existing medical systems, and serve both technical staff and healthcare providers",
  },
  {
    id: "financial-services",
    name: "Financial Services & FinTech",
    category: "Industry-Specific",
    description: "Product teams at financial institutions and fintech startups",
    content:
      "Product teams at financial institutions and fintech startups who build trading platforms, payment systems, and financial analytics tools for both institutional clients and retail customers with varying technical sophistication",
  },
  {
    id: "ecommerce-retail",
    name: "E-commerce & Retail",
    category: "Industry-Specific",
    description: "E-commerce product managers and digital marketing teams",
    content:
      "E-commerce product managers and digital marketing teams at retail companies who create customer-facing web platforms, mobile shopping apps, and internal inventory management systems for both B2C and B2B audiences",
  },

  // Enterprise & Specialized
  {
    id: "enterprise-saas",
    name: "Enterprise SaaS for Business Users",
    category: "Enterprise & Specialized",
    description:
      "Business operations teams and department managers at large corporations",
    content:
      "Business operations teams and department managers at large corporations who use enterprise software for CRM, ERP, and workflow automation but have limited technical background and require intuitive, user-friendly interfaces",
  },
  {
    id: "educational-technology",
    name: "Educational Technology",
    category: "Enterprise & Specialized",
    description: "EdTech product teams building learning management systems",
    content:
      "EdTech product teams building learning management systems and educational apps for teachers, students, and administrators across K-12 and higher education institutions with diverse technical skills and accessibility needs",
  },
  {
    id: "iot-manufacturing",
    name: "IoT & Manufacturing",
    category: "Enterprise & Specialized",
    description:
      "Industrial engineers and plant managers at manufacturing companies",
    content:
      "Industrial engineers and plant managers at manufacturing companies who monitor equipment, optimize production processes, and need dashboards that work on both desktop computers and mobile devices in factory environments",
  },

  // Specialized Use Cases
  {
    id: "api-developer-tools",
    name: "API & Developer Tools",
    category: "Specialized Use Cases",
    description:
      "Backend developers and system architects at technology companies",
    content:
      "Backend developers and system architects at technology companies who build and maintain APIs, developer tools, and infrastructure services for other engineering teams, requiring comprehensive documentation and integration guides",
  },
  {
    id: "compliance-regulatory",
    name: "Compliance & Regulatory",
    category: "Specialized Use Cases",
    description:
      "Compliance officers and risk management teams at regulated industries",
    content:
      "Compliance officers and risk management teams at regulated industries (banking, healthcare, aerospace) who need audit trails, reporting capabilities, and systems that meet strict regulatory requirements like SOX, GDPR, or FDA validation",
  },
  {
    id: "customer-support-success",
    name: "Customer Support & Success",
    category: "Specialized Use Cases",
    description:
      "Customer success managers and support representatives at B2B SaaS companies",
    content:
      "Customer success managers and support representatives at B2B SaaS companies who help enterprise clients implement and optimize software solutions, requiring both technical knowledge and strong communication skills",
  },
  {
    id: "government-public-sector",
    name: "Government Agencies & Public Sector",
    category: "Specialized Use Cases",
    description:
      "Government employees and public administrators at federal, state, and local agencies",
    content:
      "Government employees and public administrators at federal, state, and local agencies who manage citizen services, regulatory compliance, and public data while adhering to strict security protocols and accessibility standards",
  },
  {
    id: "non-profit-organizations",
    name: "Non-Profit Organizations",
    category: "Specialized Use Cases",
    description: "Non-profit program managers and development coordinators",
    content:
      "Non-profit program managers and development coordinators who track donations, manage volunteer programs, and report outcomes to stakeholders with limited technical resources and tight budgets",
  },
  {
    id: "legal-law-firms",
    name: "Legal & Law Firms",
    category: "Specialized Use Cases",
    description: "Attorneys, paralegals, and legal assistants at law firms",
    content:
      "Attorneys, paralegals, and legal assistants at law firms who manage case files, track billable hours, coordinate with clients and courts, and need secure document management with audit trails and confidentiality protections",
  },
];

const autoCompleteSuggestions = [
  "Software developers and DevOps engineers at...",
  "Data scientists and ML engineers who...",
  "Product managers and business analysts at...",
  "Startup founders and small teams who...",
  "Healthcare IT professionals who...",
  "Financial services teams building...",
  "E-commerce product managers creating...",
  "Enterprise business users who...",
  "EdTech teams building...",
  "IoT and manufacturing teams who...",
];

const techSavvinessLabels = {
  1: "Beginner - Basic computer skills",
  2: "Novice - Some technical experience",
  3: "Intermediate - Comfortable with technology",
  4: "Advanced - Technical professional",
  5: "Expert - Deep technical expertise",
};

const usageFrequencyOptions = [
  { value: "daily", label: "Daily", icon: Clock },
  { value: "weekly", label: "Weekly", icon: Clock },
  { value: "monthly", label: "Monthly", icon: Clock },
];

const priorityLevelOptions = [
  { value: "high", label: "High Priority", icon: Goal, color: "text-red-500" },
  {
    value: "medium",
    label: "Medium Priority",
    icon: Goal,
    color: "text-yellow-500",
  },
  { value: "low", label: "Low Priority", icon: Goal, color: "text-green-500" },
];

export function CreatePersonaModal({
  open,
  onOpenChange,
  onSubmit,
  editingPersona,
  onClose,
  workspaceId,
}: CreatePersonaModalProps) {
  const { user } = useAuth();
  const { toast } = useEnhancedToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("main");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );

  // New fields for Story 2.3
  const [techSavviness, setTechSavviness] = useState<number>(3);
  const [usageFrequency, setUsageFrequency] = useState<
    "daily" | "weekly" | "monthly"
  >("weekly");
  const [priorityLevel, setPriorityLevel] = useState<"high" | "medium" | "low">(
    "medium"
  );
  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("");

  // Auto-detection state
  const [detectedAttributes, setDetectedAttributes] =
    useState<DetectedAttributes | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);

  const [guidedPrompts, setGuidedPrompts] = useState<GuidedPrompt[]>([
    {
      question: "Who are your primary users?",
      placeholder: "e.g., Data scientists, Product managers",
      value: "",
    },
    {
      question: "What is their technical skill level?",
      placeholder: "e.g., Beginner, Intermediate, Expert",
      value: "",
    },
    {
      question: "Where do they work?",
      placeholder: "e.g., Healthcare, Finance, Tech startups",
      value: "",
    },
    {
      question: "How do they currently solve this problem?",
      placeholder: "e.g., Using spreadsheets, Manual processes",
      value: "",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  // Check subscription limits on mount
  useEffect(() => {
    if (open && user) {
      checkSubscriptionLimits();
    }
  }, [open, user]);

  const checkSubscriptionLimits = async () => {
    try {
      const limits = await getUserPersonaLimitsClient(user!.id);
      if (!limits.canCreate) {
        setSubscriptionError(
          `You've reached your persona limit (${limits.current}/${limits.limit}) for your ${limits.tier} plan. ` +
            `Upgrade your subscription to create more personas.`
        );
      } else {
        setSubscriptionError(null);
      }
    } catch (error) {
      console.error("Error checking subscription limits:", error);
    }
  };

  // Auto-detect attributes when description changes
  useEffect(() => {
    if (description.trim().length > 20 && !editingPersona) {
      const detectAttributes = async () => {
        setIsDetecting(true);
        try {
          const detected = await detectPersonaAttributesClient(
            description,
            workspaceId
          );
          setDetectedAttributes(detected);

          // Auto-apply detected values if confidence is high enough
          if (detected.confidence > 0.6) {
            setTechSavviness(detected.techSavviness);
            setUsageFrequency(detected.usageFrequency);
            setPriorityLevel(detected.priorityLevel);
            setRole(detected.role);
            setDomain(detected.domain);
            setAutoDetected(true);
          }
        } catch (error) {
          console.error("Error detecting attributes:", error);
        } finally {
          setIsDetecting(false);
        }
      };

      // Debounce the detection
      const timeoutId = setTimeout(detectAttributes, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [description, workspaceId, editingPersona]);

  // Validation function for persona description
  const validatePersonaDescription = (text: string): string | null => {
    if (text.trim().length < 20) {
      return "Please provide more detail about your target audience (at least 20 characters)";
    }

    // Check for key elements
    const hasRole =
      /developer|analyst|manager|user|customer|engineer|designer|admin|specialist|consultant|lead|director|executive|founder|owner/i.test(
        text
      );
    const hasContext =
      /company|team|organization|business|startup|enterprise|agency|institution|department|division|unit|group/i.test(
        text
      );
    const hasIndustry =
      /tech|healthcare|finance|education|retail|manufacturing|consulting|government|nonprofit|saas|fintech|edtech|healthtech/i.test(
        text
      );

    if (!hasRole && !hasContext && !hasIndustry) {
      return "Consider including user roles, organizational context, or industry information";
    }

    return null; // Valid
  };

  useEffect(() => {
    if (editingPersona) {
      setName(editingPersona.name);
      setDescription(editingPersona.description);
      setTechSavviness(editingPersona.tech_savviness || 3);
      setUsageFrequency(
        (editingPersona.usage_frequency as "daily" | "weekly" | "monthly") ||
          "weekly"
      );
      setPriorityLevel(
        (editingPersona.priority_level as "high" | "medium" | "low") || "medium"
      );
      setRole(editingPersona.role || "");
      setDomain(editingPersona.domain || "");
      setAutoDetected(editingPersona.auto_detected || false);
    } else {
      setName("");
      setDescription("");
      setTechSavviness(3);
      setUsageFrequency("weekly");
      setPriorityLevel("medium");
      setRole("");
      setDomain("");
      setAutoDetected(false);
      setDetectedAttributes(null);
      setGuidedPrompts([
        {
          question: "Who are your primary users?",
          placeholder: "e.g., Data scientists, Product managers",
          value: "",
        },
        {
          question: "What is their technical skill level?",
          placeholder: "e.g., Beginner, Intermediate, Expert",
          value: "",
        },
        {
          question: "Where do they work?",
          placeholder: "e.g., Healthcare, Finance, Tech startups",
          value: "",
        },
        {
          question: "How do they currently solve this problem?",
          placeholder: "e.g., Using spreadsheets, Manual processes",
          value: "",
        },
      ]);
    }
  }, [editingPersona, open]);

  const handleGuidedPromptChange = (index: number, value: string) => {
    const updatedPrompts = [...guidedPrompts];
    updatedPrompts[index].value = value;
    setGuidedPrompts(updatedPrompts);

    // Auto-generate description from guided prompts with proper grammar
    const filledPrompts = updatedPrompts.filter((p) => p.value.trim());
    if (filledPrompts.length > 0) {
      let generatedDescription = "";

      // Get the values in order
      const role = updatedPrompts[0].value.trim();
      const skillLevel = updatedPrompts[1].value.trim();
      const industry = updatedPrompts[2].value.trim();
      const currentSolution = updatedPrompts[3].value.trim();

      // Build the sentence with proper grammar
      if (role) {
        generatedDescription = role;

        if (skillLevel) {
          // Add skill level with appropriate connector
          if (skillLevel.toLowerCase().includes("beginner")) {
            generatedDescription += ` with ${skillLevel.toLowerCase()} technical skills`;
          } else if (skillLevel.toLowerCase().includes("expert")) {
            generatedDescription += ` with ${skillLevel.toLowerCase()} technical expertise`;
          } else {
            generatedDescription += ` with ${skillLevel.toLowerCase()} technical skills`;
          }
        }

        if (industry) {
          // Add industry context
          if (
            industry.toLowerCase().includes("startup") ||
            industry.toLowerCase().includes("small")
          ) {
            generatedDescription += ` at ${industry.toLowerCase()} companies`;
          } else if (
            industry.toLowerCase().includes("enterprise") ||
            industry.toLowerCase().includes("large")
          ) {
            generatedDescription += ` at ${industry.toLowerCase()} organizations`;
          } else {
            generatedDescription += ` in the ${industry.toLowerCase()} industry`;
          }
        }

        if (currentSolution) {
          // Add current solution/workflow
          if (
            currentSolution.toLowerCase().includes("spreadsheet") ||
            currentSolution.toLowerCase().includes("manual")
          ) {
            generatedDescription += ` who currently use ${currentSolution.toLowerCase()} processes`;
          } else if (
            currentSolution.toLowerCase().includes("tool") ||
            currentSolution.toLowerCase().includes("software")
          ) {
            generatedDescription += ` who currently use ${currentSolution.toLowerCase()}`;
          } else {
            generatedDescription += ` who currently ${currentSolution.toLowerCase()}`;
          }
        }

        // Add a common need that most personas have
        if (
          role.toLowerCase().includes("developer") ||
          role.toLowerCase().includes("engineer")
        ) {
          generatedDescription +=
            " and need tools that integrate with their existing workflow";
        } else if (
          role.toLowerCase().includes("manager") ||
          role.toLowerCase().includes("analyst")
        ) {
          generatedDescription +=
            " and need to clearly communicate requirements to both technical and non-technical stakeholders";
        } else if (
          role.toLowerCase().includes("founder") ||
          role.toLowerCase().includes("startup")
        ) {
          generatedDescription +=
            " and need to quickly validate ideas and communicate product vision";
        } else {
          generatedDescription +=
            " and need efficient tools to streamline their work processes";
        }
      }

      setDescription(generatedDescription);
    } else {
      setDescription("");
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setDescription(template.content);
    setName(template.name);
  };

  const handleAutoCompleteSelect = (suggestion: string) => {
    setDescription(suggestion);
  };

  const handleSubmit = () => {
    // Clear previous validation errors
    setValidationError(null);

    // Check subscription limits
    if (subscriptionError) {
      toast({
        title: "Subscription Limit Reached",
        description: subscriptionError,
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!name.trim()) {
      setValidationError("Please enter a persona name");
      return;
    }

    if (!description.trim()) {
      setValidationError("Please enter a persona description");
      return;
    }

    // Validate description content
    const validationError = validatePersonaDescription(description.trim());
    if (validationError) {
      setValidationError(validationError);
      return;
    }

    // If validation passes, submit with all fields
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      techSavviness,
      usageFrequency,
      priorityLevel,
      role: role.trim(),
      domain: domain.trim(),
    });
    onClose();
  };

  const filteredTemplates = quickTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>
              {editingPersona ? "Edit Persona" : "Create New Persona"}
            </span>
          </DialogTitle>
          <DialogDescription>
            Define a user persona to help generate more targeted and relevant
            user stories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Persona Name */}
          <div className="space-y-2">
            <Label htmlFor="persona-name">Persona Name</Label>
            <Input
              id="persona-name"
              variant="workspace"
              placeholder="e.g., Data Scientist Sarah, Product Manager Mike"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Creation Methods Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="main" className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Main Input</span>
              </TabsTrigger>
              <TabsTrigger
                value="guided"
                className="flex items-center space-x-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Guided</span>
              </TabsTrigger>
              <TabsTrigger
                value="autocomplete"
                className="flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Auto-Complete</span>
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Templates</span>
              </TabsTrigger>
            </TabsList>

            {/* Main Input Tab */}
            <TabsContent value="main" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="main-description">Persona Description</Label>
                <Textarea
                  id="main-description"
                  variant="workspace"
                  placeholder="e.g., Data scientists at biotech companies who use Python daily and need to analyze clinical trial data"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
                {isDetecting && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Detecting attributes from description...</span>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Guided Prompts Tab */}
            <TabsContent value="guided" className="space-y-4">
              <div className="space-y-4">
                {guidedPrompts.map((prompt, index) => (
                  <div key={index} className="space-y-2">
                    <Label>{prompt.question}</Label>
                    <Input
                      variant="workspace"
                      placeholder={prompt.placeholder}
                      value={prompt.value}
                      onChange={(e) =>
                        handleGuidedPromptChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <Label className="text-sm font-medium">
                    Generated Description
                  </Label>
                  <div className="space-y-2">
                    <Textarea
                      variant="workspace"
                      placeholder="Fill in the prompts above to generate a description, then edit as needed..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      The description is auto-generated from your inputs above.
                      Feel free to edit it to better match your specific needs.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Auto-Complete Tab */}
            <TabsContent value="autocomplete" className="space-y-4">
              <div className="space-y-2">
                <Label>Smart Suggestions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {autoCompleteSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3"
                      onClick={() => handleAutoCompleteSelect(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="autocomplete-description">
                  Persona Description
                </Label>
                <Textarea
                  id="autocomplete-description"
                  variant="workspace"
                  placeholder="Select a suggestion above or type your own description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-2">
                <Label>Search Templates</Label>
                <Input
                  variant="workspace"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                {Object.entries(groupedTemplates).map(
                  ([category, templates]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="flex space-x-2">
                        <div className="flex gap-2  items-center">
                          {category === "Software Development" && (
                            <Code className="w-4 h-4" />
                          )}
                          {category === "Business/Product" && (
                            <Target className="w-4 h-4" />
                          )}
                          {category === "Industry-Specific" && (
                            <Building className="w-4 h-4" />
                          )}
                          {category === "Enterprise & Specialized" && (
                            <Shield className="w-4 h-4" />
                          )}
                          {category === "Specialized Use Cases" && (
                            <Settings className="w-4 h-4" />
                          )}
                          <span>{category}</span>
                          <Badge
                            variant="secondary"
                            className="workspace-component-bg workspace-component-active-color"
                          >
                            {templates.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {templates.map((template) => (
                            <div
                              key={template.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedTemplate?.id === template.id
                                  ? "slider-workspace-primary workspace-component-bg workspace-component-active-color"
                                  : "border-border hover:slider-workspace-primary hover:workspace-component-active-color"
                              }`}
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    {template.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {template.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                    {template.content}
                                  </p>
                                </div>
                                {selectedTemplate?.id === template.id && (
                                  <ArrowRight className="w-4 h-4 text-workspace-primary" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>

              {selectedTemplate && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Selected Template: {selectedTemplate.name}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(null);
                        setDescription("");
                      }}
                    >
                      Clear Template
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">
                      Edit Template Content
                    </Label>
                    <Textarea
                      id="template-description"
                      variant="workspace"
                      placeholder="Modify the template content as needed..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Feel free to customize this template to better match your
                      specific use case.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Enhanced Persona Attributes Section */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Persona Attributes</h3>
              {autoDetected && (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Auto-detected</span>
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tech Savviness */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Tech Savviness Level</span>
                  {detectedAttributes && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(detectedAttributes.confidence * 100)}%
                      confidence
                    </Badge>
                  )}
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={[techSavviness]}
                    onValueChange={(value) => setTechSavviness(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                  <p className="text-sm font-medium">
                    {
                      techSavvinessLabels[
                        techSavviness as keyof typeof techSavvinessLabels
                      ]
                    }
                  </p>
                </div>
              </div>

              {/* Usage Frequency */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Usage Frequency</span>
                </Label>
                <Select
                  value={usageFrequency}
                  onValueChange={(value: "daily" | "weekly" | "monthly") =>
                    setUsageFrequency(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {usageFrequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Level */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Goal className="w-4 h-4" />
                  <span>Priority Level</span>
                </Label>
                <Select
                  value={priorityLevel}
                  onValueChange={(value: "high" | "medium" | "low") =>
                    setPriorityLevel(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className={`w-4 h-4 ${option.color}`} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Role</span>
                </Label>
                <Input
                  variant="workspace"
                  placeholder="e.g., Data Scientist, Product Manager, Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              {/* Domain */}
              <div className="space-y-3 md:col-span-2">
                <Label className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Domain/Industry</span>
                </Label>
                <Input
                  variant="workspace"
                  placeholder="e.g., Fintech, Healthcare, E-commerce, Enterprise"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
            </div>

            {/* Auto-detection Results */}
            {detectedAttributes && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Auto-detected Attributes
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(detectedAttributes.confidence * 100)}%
                    confidence
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Role:</span>
                    <p className="font-medium">{detectedAttributes.role}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Domain:</span>
                    <p className="font-medium">{detectedAttributes.domain}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tech Level:</span>
                    <p className="font-medium">
                      {detectedAttributes.techSavviness}/5
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage:</span>
                    <p className="font-medium capitalize">
                      {detectedAttributes.usageFrequency}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error Display */}
        {validationError && (
          <Alert className="border-rose-200 bg-rose-50">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <AlertDescription className="text-rose-800">
              {validationError}
            </AlertDescription>
          </Alert>
        )}

        {/* Subscription Error Display */}
        {subscriptionError && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {subscriptionError}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="workspace"
            disabled={!!subscriptionError}
          >
            {editingPersona ? "Update Persona" : "Create Persona"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

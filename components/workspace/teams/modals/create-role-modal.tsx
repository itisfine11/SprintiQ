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
  Brain,
  Cloud,
  Database,
  ChartLine,
  TrendingUp,
  Layers,
  Plus,
  Trash2,
  Edit,
  X,
  Save,
} from "lucide-react";
import { Role } from "@/lib/database.types";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import {
  roleTemplates,
  roleCategories,
  difficultyLevels,
  RoleTemplate,
} from "@/lib/role-templates";

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description: string;
    experience?: string;
    category?: string;
    core_competencies?: any;
    template_data?: any;
  }) => void;
  editingRole?: Role | null;
  onClose: () => void;
}

interface GuidedPrompt {
  question: string;
  placeholder: string;
  value: string;
}

const autoCompleteSuggestions = [
  "Software developers who work with...",
  "Data scientists and ML engineers who...",
  "Product managers and business analysts at...",
  "UX designers and researchers who...",
  "DevOps engineers and cloud architects...",
  "Security engineers and compliance specialists...",
  "Platform engineers and infrastructure teams...",
  "Business analysts and process managers...",
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Engineering":
      return Code;
    case "Product":
      return Target;
    case "Design":
      return Users;
    case "Business":
      return Building;
    case "Marketing":
      return TrendingUp;
    case "Sales":
      return Star;
    case "Operations":
      return Settings;
    default:
      return Briefcase;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "text-green-500";
    case "intermediate":
      return "text-yellow-500";
    case "advanced":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export function CreateRoleModal({
  open,
  onOpenChange,
  onSubmit,
  editingRole,
  onClose,
}: CreateRoleModalProps) {
  const { toast } = useEnhancedToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("main");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Enhanced role fields
  const [experience, setExperience] = useState("");
  const [category, setCategory] = useState("");
  const [coreCompetencies, setCoreCompetencies] = useState<any>({});
  const [templateData, setTemplateData] = useState<any>({});

  // Core competencies CRUD state
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingSkill, setEditingSkill] = useState<{
    category: string;
    index: number;
  } | null>(null);
  const [newSkillName, setNewSkillName] = useState("");

  const [guidedPrompts, setGuidedPrompts] = useState<GuidedPrompt[]>([
    {
      question: "What is the primary function of this role?",
      placeholder:
        "e.g., Develops software applications, Manages data pipelines",
      value: "",
    },
    {
      question: "What technical skills are required?",
      placeholder: "e.g., Python, React, AWS, Machine Learning",
      value: "",
    },
    {
      question: "What industry or domain does this role serve?",
      placeholder: "e.g., Fintech, Healthcare, E-commerce, Enterprise",
      value: "",
    },
    {
      question: "What experience level is expected?",
      placeholder: "e.g., 2+ years, 5+ years, Senior level",
      value: "",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<RoleTemplate | null>(
    null
  );

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name);
      setDescription(editingRole.description || "");
      setExperience(editingRole.experience || "");
      setCategory(editingRole.category || "");
      setCoreCompetencies(editingRole.core_competencies || {});
      setTemplateData(editingRole.template_data || {});
    } else {
      setName("");
      setDescription("");
      setExperience("");
      setCategory("");
      setCoreCompetencies({});
      setTemplateData({});
      setGuidedPrompts([
        {
          question: "What is the primary function of this role?",
          placeholder:
            "e.g., Develops software applications, Manages data pipelines",
          value: "",
        },
        {
          question: "What technical skills are required?",
          placeholder: "e.g., Python, React, AWS, Machine Learning",
          value: "",
        },
        {
          question: "What industry or domain does this role serve?",
          placeholder: "e.g., Fintech, Healthcare, E-commerce, Enterprise",
          value: "",
        },
        {
          question: "What experience level is expected?",
          placeholder: "e.g., 2+ years, 5+ years, Senior level",
          value: "",
        },
      ]);
    }
  }, [editingRole, open]);

  const handleGuidedPromptChange = (index: number, value: string) => {
    const updatedPrompts = [...guidedPrompts];
    updatedPrompts[index].value = value;
    setGuidedPrompts(updatedPrompts);

    // Auto-generate description from guided prompts
    const filledPrompts = updatedPrompts.filter((p) => p.value.trim());
    if (filledPrompts.length > 0) {
      let generatedDescription = "";

      // Get the values in order
      const primaryFunction = updatedPrompts[0].value.trim();
      const technicalSkills = updatedPrompts[1].value.trim();
      const industry = updatedPrompts[2].value.trim();
      const experienceLevel = updatedPrompts[3].value.trim();

      // Build the description
      if (primaryFunction) {
        generatedDescription = primaryFunction;

        if (technicalSkills) {
          generatedDescription += ` using ${technicalSkills}`;
        }

        if (industry) {
          generatedDescription += ` in the ${industry} industry`;
        }

        if (experienceLevel) {
          generatedDescription += ` (${experienceLevel} experience)`;
        }
      }

      setDescription(generatedDescription);
    } else {
      setDescription("");
    }
  };

  const handleTemplateSelect = (template: RoleTemplate) => {
    setSelectedTemplate(template);
    setDescription(template.description);
    setName(template.name);
    setExperience(template.experience);
    setCategory(template.category);
    setCoreCompetencies(template.core_competencies);
    setTemplateData(template.template_data);
  };

  const handleAutoCompleteSelect = (suggestion: string) => {
    setDescription(suggestion);
  };

  // Core competencies CRUD functions
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const categoryKey = newCategoryName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      setCoreCompetencies((prev: any) => ({
        ...prev,
        [categoryKey]: [],
      }));
      setNewCategoryName("");
    }
  };

  const removeCategory = (categoryKey: string) => {
    setCoreCompetencies((prev: any) => {
      const updated = { ...prev };
      delete updated[categoryKey];
      return updated;
    });
  };

  const addSkill = (categoryKey: string) => {
    if (newSkillName.trim()) {
      setCoreCompetencies((prev: any) => ({
        ...prev,
        [categoryKey]: [...(prev[categoryKey] || []), newSkillName.trim()],
      }));
      setNewSkillName("");
    }
  };

  const removeSkill = (categoryKey: string, skillIndex: number) => {
    setCoreCompetencies((prev: any) => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter(
        (_: any, index: number) => index !== skillIndex
      ),
    }));
  };

  const updateSkill = (
    categoryKey: string,
    skillIndex: number,
    newSkill: string
  ) => {
    if (newSkill.trim()) {
      setCoreCompetencies((prev: any) => ({
        ...prev,
        [categoryKey]: prev[categoryKey].map((skill: string, index: number) =>
          index === skillIndex ? newSkill.trim() : skill
        ),
      }));
      setEditingSkill(null);
      setNewSkillName("");
    }
  };

  const startEditingSkill = (
    categoryKey: string,
    skillIndex: number,
    currentSkill: string
  ) => {
    setEditingSkill({ category: categoryKey, index: skillIndex });
    setNewSkillName(currentSkill);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditingSkill(null);
    setNewCategoryName("");
    setNewSkillName("");
  };

  // Format skill names from snake_case to Title Case
  const formatSkillName = (skill: string) => {
    return skill
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSubmit = () => {
    // Clear previous validation errors
    setValidationError(null);

    // Basic validation
    if (!name.trim()) {
      setValidationError("Please enter a role name");
      return;
    }

    if (!description.trim()) {
      setValidationError("Please enter a role description");
      return;
    }

    // If validation passes, submit with all fields
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      experience: experience.trim() || undefined,
      category: category.trim() || undefined,
      core_competencies:
        Object.keys(coreCompetencies).length > 0 ? coreCompetencies : undefined,
      template_data:
        Object.keys(templateData).length > 0 ? templateData : undefined,
    });
    onClose();
  };

  const filteredTemplates = roleTemplates.filter(
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
  }, {} as Record<string, RoleTemplate[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>{editingRole ? "Edit Role" : "Create New Role"}</span>
          </DialogTitle>
          <DialogDescription>
            Define a role with detailed competencies and requirements to help
            create more targeted team member profiles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              variant="workspace"
              placeholder="e.g., Senior Frontend Developer, Data Scientist"
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
            <TabsList className="grid w-full grid-cols-5">
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
                value="competencies"
                className="flex items-center space-x-2"
              >
                <Target className="w-4 h-4" />
                <span>Competencies</span>
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
                <Label htmlFor="main-description">Role Description</Label>
                <Textarea
                  id="main-description"
                  variant="workspace"
                  placeholder="e.g., Develops and maintains web applications using React and Node.js, with 3+ years of experience in modern JavaScript frameworks"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
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
                  Role Description
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

            {/* Core Competencies Tab */}
            <TabsContent value="competencies" className="space-y-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-workspace-primary" />
                      Core Competencies
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Define the key skills and competencies required for this
                      role
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCategory("new")}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Category
                    </Button>
                    {Object.keys(coreCompetencies).length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCoreCompetencies({});
                          setEditingCategory(null);
                          setEditingSkill(null);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Add Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Quick Add Skills
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "Python",
                      "JavaScript",
                      "React",
                      "Node.js",
                      "Docker",
                      "Kubernetes",
                      "AWS",
                      "Git",
                      "SQL",
                      "MongoDB",
                      "Redis",
                      "GraphQL",
                    ].map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs hover:bg-blue-100 hover:border-blue-300"
                        onClick={() => {
                          // Add to a default category or create one
                          const defaultCategory = "programming_skills";
                          if (!coreCompetencies[defaultCategory]) {
                            setCoreCompetencies((prev: any) => ({
                              ...prev,
                              [defaultCategory]: [],
                            }));
                          }
                          setCoreCompetencies((prev: any) => ({
                            ...prev,
                            [defaultCategory]: [
                              ...(prev[defaultCategory] || []),
                              skill,
                            ],
                          }));
                        }}
                      >
                        + {formatSkillName(skill)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Add New Category */}
                {editingCategory === "new" && (
                  <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted-foreground/25">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="Category name (e.g., Programming Languages, Frameworks, Tools)"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addCategory()}
                          className="h-10"
                          autoFocus
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addCategory}
                        disabled={!newCategoryName.trim()}
                        className="h-10 px-4"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                        className="h-10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Competency Categories */}
                {Object.keys(coreCompetencies).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Target className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">
                      No competencies defined yet
                    </h4>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Start by adding categories and skills to define what this
                      role requires. You can use the quick add buttons above or
                      create custom categories.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingCategory("new")}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Your First Category
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(coreCompetencies).map(
                      ([categoryKey, skills]) => (
                        <div
                          key={categoryKey}
                          className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Category Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-workspace-primary/10 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-workspace-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {formatSkillName(categoryKey)}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {(skills as string[]).length} skill
                                  {(skills as string[]).length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setNewSkillName("");
                                  setEditingSkill({
                                    category: categoryKey,
                                    index: -1,
                                  });
                                }}
                                className="flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add Skill
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCategory(categoryKey)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Skills Grid */}
                          <div className="space-y-3">
                            {/* Existing Skills */}
                            <div className="flex flex-wrap gap-2">
                              {(skills as string[]).map((skill, skillIndex) => (
                                <div
                                  key={skillIndex}
                                  className="group relative"
                                >
                                  {editingSkill?.category === categoryKey &&
                                  editingSkill?.index === skillIndex ? (
                                    <div className="flex items-center gap-2 bg-white border-2 border-workspace-primary rounded-lg p-2">
                                      <Input
                                        value={newSkillName}
                                        onChange={(e) =>
                                          setNewSkillName(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                          e.key === "Enter" &&
                                          updateSkill(
                                            categoryKey,
                                            skillIndex,
                                            newSkillName
                                          )
                                        }
                                        className="h-8 border-0 focus:ring-0 p-0"
                                        autoFocus
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() =>
                                          updateSkill(
                                            categoryKey,
                                            skillIndex,
                                            newSkillName
                                          )
                                        }
                                        disabled={!newSkillName.trim()}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Save className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={cancelEditing}
                                        className="h-6 w-6 p-0"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 bg-muted rounded-lg px-3 py-2 group-hover:bg-muted/80 transition-colors">
                                      <span className="text-sm font-medium">
                                        {formatSkillName(skill)}
                                      </span>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            startEditingSkill(
                                              categoryKey,
                                              skillIndex,
                                              skill
                                            )
                                          }
                                          className="h-5 w-5 p-0 hover:bg-background"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            removeSkill(categoryKey, skillIndex)
                                          }
                                          className="h-5 w-5 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}

                              {/* Add New Skill Input */}
                              {editingSkill?.category === categoryKey &&
                                editingSkill?.index === -1 && (
                                  <div className="flex items-center gap-2 bg-white border-2 border-dashed border-muted-foreground/25 rounded-lg p-2">
                                    <Input
                                      placeholder="Type skill name..."
                                      value={newSkillName}
                                      onChange={(e) =>
                                        setNewSkillName(e.target.value)
                                      }
                                      onKeyPress={(e) =>
                                        e.key === "Enter" &&
                                        addSkill(categoryKey)
                                      }
                                      className="h-8 border-0 focus:ring-0 p-0"
                                      autoFocus
                                    />
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => addSkill(categoryKey)}
                                      disabled={!newSkillName.trim()}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Save className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={cancelEditing}
                                      className="h-6 w-6 p-0"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
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
                  ([category, templates]) => {
                    const CategoryIcon = getCategoryIcon(category);
                    return (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="flex space-x-2">
                          <div className="flex gap-2 items-center">
                            <CategoryIcon className="w-4 h-4" />
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
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium">
                                        {template.name}
                                      </h4>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${getDifficultyColor(
                                          template.template_data.difficulty
                                        )}`}
                                      >
                                        {template.template_data.difficulty}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {template.experience} •{" "}
                                      {template.category}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {template.description}
                                    </p>
                                    <div className="flex gap-1 mt-2">
                                      {template.template_data.tags
                                        .slice(0, 3)
                                        .map((tag: string) => (
                                          <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {tag}
                                          </Badge>
                                        ))}
                                    </div>
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
                    );
                  }
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
                        setCoreCompetencies({});
                        setTemplateData({});
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

          {/* Enhanced Role Attributes Section */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Role Attributes</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience Level */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Experience Level</span>
                </Label>
                <Input
                  variant="workspace"
                  placeholder="e.g., 2+ years, 5+ years, Senior level"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Category</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleCategories.map((cat) => {
                      const CategoryIcon = getCategoryIcon(cat);
                      return (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-4 h-4" />
                            <span>{cat}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Core Competencies Preview */}
            {Object.keys(coreCompetencies).length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Core Competencies</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(coreCompetencies).map(
                    ([category, skills]) => (
                      <div key={category}>
                        <span className="text-muted-foreground">
                          {formatSkillName(category)}:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(skills as string[])
                            .slice(0, 5)
                            .map((skill: string) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {formatSkillName(skill)}
                              </Badge>
                            ))}
                          {(skills as string[]).length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{(skills as string[]).length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  )}
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="workspace">
            {editingRole ? "Update Role" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

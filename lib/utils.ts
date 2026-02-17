import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PieChartColors, ThemeColors } from "@/types";
import { colorMap } from "@/components/workspace/views/project/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIconColor = (iconValue: string) => {
  const iconMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
  };
  return iconMap[iconValue] || "bg-blue-500";
};

export const getStatusColor = (color: string): string => {
  return colorMap[color as keyof typeof colorMap] || "bg-gray-500";
};

export const getAvatarInitials = (
  fullName?: string | null,
  email?: string | null
): string => {
  if (fullName) {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
  return email ? email[0].toUpperCase() : "U";
};

export const getColorByIndex = (color: string) => {
  return PieChartColors.find((c) => c.name === color)?.hex;
};
export const getColorByLabel = (color: string) => {
  return ThemeColors.find((c) => c.label === color)?.hex;
};

export const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "critical":
      return "bg-red-600/10 text-red-600";
    case "high":
      return "bg-yellow-600/10 text-yellow-600";
    case "medium":
      return "bg-blue-600/10 text-blue-600";
    case "low":
      return "bg-green-600/10 text-green-600";
    default:
      return "bg-gray-600/10 text-gray-600";
  }
};

export const getUtilizationColor = (utilization: number) => {
  if (utilization > 100) return "text-red-600";
  if (utilization > 90) return "text-orange-600";
  if (utilization > 70) return "text-green-600";
  return "text-blue-600";
};

export const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "High":
      return "text-red-600 bg-red-50";
    case "Medium":
      return "text-yellow-600 bg-yellow-50";
    case "Low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const getStatusTypeColor = (statusType: string) => {
  switch (statusType) {
    case "not-started":
      return "#6B7280";
    case "Not Started":
      return "#6B7280";
    case "active":
      return "#3B82F6";
    case "Active":
      return "#3B82F6";
    case "done":
      return "#10B981";
    case "Done":
      return "#10B981";
    case "closed":
      return "#8B5CF6";
    case "Closed":
      return "#8B5CF6";
    default:
      return "#6B7280";
  }
};

export const getStatusTypeBgColor = (statusType: string) => {
  switch (statusType) {
    case "not-started":
      return "bg-gray-500/10";
    case "active":
      return "bg-blue-500/10";
    case "done":
      return "bg-green-500/10";
    case "closed":
      return "bg-purple-500/10";
    default:
      return "bg-gray-500/10";
  }
};

export const getStatusTypeTextColor = (statusType: string) => {
  switch (statusType) {
    case "not-started":
      return "text-gray-500";
    case "active":
      return "text-blue-500";
    case "done":
      return "text-green-500";
    case "closed":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
};

export const getStatusTypeText = (statusType: string) => {
  switch (statusType) {
    case "not-started":
      return "Not Started";
    case "active":
      return "Active";
    case "done":
      return "Done";
    case "closed":
      return "Closed";
    default:
      return "Not Started";
  }
};

export const getStatusTypeChartColor = (statusType: string) => {
  switch (statusType) {
    case "Not Started":
      return "hsl(220, 9%, 46%)";
    case "Active":
      return "hsl(217, 91%, 60%)";
    case "Done":
      return "hsl(141, 71%, 48%)";
    case "Closed":
      return "hsl(276, 80%, 80%)";
    default:
      return "hsl(220, 9%, 46%)";
  }
};

export const mapJiraStatusColor = (jiraColor: string): string => {
  const colorMap: Record<string, string> = {
    "blue-gray": "blue",
    green: "green",
    yellow: "yellow",
    red: "red",
    purple: "purple",
    pink: "pink",
    orange: "orange",
    indigo: "indigo",
    teal: "teal",
  };

  return colorMap[jiraColor] || "gray";
};

/**
 * Convert Jira's document format to readable HTML
 * Jira uses a custom document format similar to ProseMirror
 */
export const convertJiraDescription = (jiraDescription: any): string => {
  if (!jiraDescription || typeof jiraDescription === "string") {
    return jiraDescription || "";
  }

  // If it's already a string, return as is
  if (typeof jiraDescription === "string") {
    return jiraDescription;
  }

  // Handle Jira's document format
  if (jiraDescription.type === "doc" && jiraDescription.content) {
    return processJiraContent(jiraDescription.content);
  }

  // Fallback: try to extract text from any other format
  return JSON.stringify(jiraDescription);
};

/**
 * Process Jira content array recursively
 */
const processJiraContent = (content: any[]): string => {
  if (!Array.isArray(content)) {
    return "";
  }

  let result = "";

  for (const item of content) {
    if (!item || typeof item !== "object") {
      continue;
    }

    switch (item.type) {
      case "paragraph":
        result += processParagraph(item);
        break;
      case "orderedList":
        result += processOrderedList(item);
        break;
      case "bulletList":
        result += processBulletList(item);
        break;
      case "listItem":
        result += processListItem(item);
        break;
      case "heading":
        result += processHeading(item);
        break;
      case "codeBlock":
        result += processCodeBlock(item);
        break;
      case "blockquote":
        result += processBlockquote(item);
        break;
      case "horizontalRule":
        result += "<hr/>";
        break;
      case "hardBreak":
        result += "<br/>";
        break;
      case "text":
        result += processText(item);
        break;
      default:
        // Recursively process unknown content types
        if (item.content) {
          result += processJiraContent(item.content);
        }
    }
  }

  return result;
};

/**
 * Process paragraph content
 */
const processParagraph = (item: any): string => {
  let content = "";
  if (item.content) {
    content = processJiraContent(item.content);
  }
  return `<p>${content}</p>`;
};

/**
 * Process ordered list
 */
const processOrderedList = (item: any): string => {
  let content = "";
  if (item.content) {
    content = processJiraContent(item.content);
  }
  const start = item.attrs?.order || 1;
  return `<ol start="${start}">${content}</ol>`;
};

/**
 * Process bullet list
 */
const processBulletList = (item: any): string => {
  let content = "";
  if (item.content) {
    content = processJiraContent(item.content);
  }
  return `<ul>${content}</ul>`;
};

/**
 * Process list item
 */
const processListItem = (item: any): string => {
  let content = "";
  if (item.content) {
    content = processJiraContent(item.content);
  }
  return `<li>${content}</li>`;
};

/**
 * Process heading
 */
const processHeading = (item: any): string => {
  let content = "";
  if (item.content) {
    content = processJiraContent(item.content);
  }
  const level = item.attrs?.level || 1;
  return `<h${level}>${content}</h${level}>`;
};

/**
 * Process code block
 */
const processCodeBlock = (item: any): string => {
  let content = "";
  if (item.content) {
    content = processJiraContent(item.content);
  }
  const language = item.attrs?.language || "";
  return `<pre><code class="language-${language}">${content}</code></pre>`;
};

/**
 * Process blockquote
 */
const processBlockquote = (item: any): string => {
  let content = "";
  if (item.content) {
    content = processJiraContent(item.content);
  }
  return `<blockquote>${content}</blockquote>`;
};

/**
 * Process text with marks (bold, italic, etc.)
 */
const processText = (item: any): string => {
  let text = item.text || "";

  if (!item.marks || !Array.isArray(item.marks)) {
    return text;
  }

  // Apply marks in order
  for (const mark of item.marks) {
    switch (mark.type) {
      case "strong":
        text = `<strong>${text}</strong>`;
        break;
      case "em":
        text = `<em>${text}</em>`;
        break;
      case "underline":
        text = `<u>${text}</u>`;
        break;
      case "strike":
        text = `<del>${text}</del>`;
        break;
      case "code":
        text = `<code>${text}</code>`;
        break;
      case "link":
        const href = mark.attrs?.href || "#";
        text = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        break;
      case "textColor":
        const color = mark.attrs?.color || "#000000";
        text = `<span style="color: ${color}">${text}</span>`;
        break;
      case "backgroundColor":
        const bgColor = mark.attrs?.backgroundColor || "transparent";
        text = `<span style="background-color: ${bgColor}">${text}</span>`;
        break;
      default:
        // Unknown mark type, keep text as is
        break;
    }
  }

  return text;
};

/**
 * Convert generated story description to Jira format
 * Handles the specific markdown-style format used in AI-generated stories
 */
export const convertGeneratedStoryToJiraFormat = (
  storyContent: string
): string => {
  if (!storyContent) return "";

  let jiraContent = storyContent;

  // Convert markdown headers to Jira headers
  jiraContent = jiraContent.replace(/^## (.*?)$/gm, "h2. $1");
  jiraContent = jiraContent.replace(/^### (.*?)$/gm, "h3. $1");
  jiraContent = jiraContent.replace(/^#### (.*?)$/gm, "h4. $1");

  // Handle any remaining ## headers that might have extra whitespace
  jiraContent = jiraContent.replace(/^[ \t]*##[ \t]+(.*?)$/gm, "h2. $1");

  // Convert bold text (markdown **text** to Jira *text*)
  jiraContent = jiraContent.replace(/\*\*(.*?)\*\*/g, "*$1*");

  // Convert bullet points (markdown - to Jira *)
  jiraContent = jiraContent.replace(/^[ \t]*-[ \t]*(.*?)$/gm, "* $1");

  // Convert numbered lists (markdown 1. to Jira 1.)
  jiraContent = jiraContent.replace(/^[ \t]*(\d+)\.[ \t]*(.*?)$/gm, "$1. $2");

  // Convert code blocks (markdown ``` to Jira {code})
  jiraContent = jiraContent.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    "{code:$1}\n$2\n{code}"
  );

  // Convert inline code (markdown `text` to Jira {{text}})
  jiraContent = jiraContent.replace(/`([^`]+)`/g, "{{$1}}");

  // Convert links (markdown [text](url) to Jira [text|url])
  jiraContent = jiraContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$1|$2]");

  // Convert blockquotes (markdown > to Jira bq.)
  jiraContent = jiraContent.replace(/^>[ \t]*(.*?)$/gm, "bq. $1");

  // Handle special formatting for story details (convert **text**: to *text*:)
  jiraContent = jiraContent.replace(/\*\*(.*?)\*\*: /g, "*$1*: ");

  // Handle anti-pattern warnings with warning icons
  jiraContent = jiraContent.replace(/⚠️ /g, "(!) ");

  // Clean up extra whitespace and newlines
  jiraContent = jiraContent
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive newlines
    .replace(/^\s+|\s+$/g, ""); // Trim whitespace

  return jiraContent;
};

/**
 * Test function to demonstrate the conversion of generated story to Jira format
 */
export const testGeneratedStoryConversion = () => {
  const exampleStory = `## User Story
      As a **Frontend Developer**, I want **to implement a comprehensive booking dashboard with real-time analytics and filtering capabilities**, so that **business users can monitor booking trends, identify bottlenecks, and make data-driven decisions**.

      ## Acceptance Criteria
      - Dashboard displays booking metrics with less than 2-second load time for up to 10,000 records
- Users can filter bookings by date range, status, department, and custom fields with instant results
- Real-time updates occur within 5 seconds of booking changes without page refresh
- Export functionality generates CSV/Excel reports with all filtered data
- Dashboard maintains responsive design across desktop and tablet devices

      ## Story Details
      - **Story Points**: 8
      - **Business Value Weight**: 30%
      - **User Impact Weight**: 25%
      - **Complexity Weight**: 20%
      - **Risk Weight**: 15%
      - **Dependencies**: None specified
      - **Priority**: High
      - **Estimated Time**: 32 hours
      - **Success Pattern**: Standard development process
      - **Completion Rate**: 90%
      - **Velocity**: Not specified

      ## Requirements
      - Integration with enterprise SSO for authentication
- WebSocket implementation for real-time updates
- Data visualization library (D3.js or Chart.js) for analytics
- API endpoints for booking data retrieval with pagination
- Caching strategy for performance optimization

      ## Anti-Pattern Warnings
      - ⚠️ Avoid overloading dashboard with too many metrics - focus on key business KPIs
- ⚠️ Prevent scope creep by defining specific analytics requirements upfront
- ⚠️ Ensure clear communication with stakeholders on which metrics are most valuable
`;

  return {
    original: exampleStory,
    converted: convertGeneratedStoryToJiraFormat(exampleStory),
  };
};

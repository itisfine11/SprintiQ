/**
 * Jira utility functions for priority mapping and other Jira-related operations
 */

/**
 * Map local priority to Jira priority
 * Local priorities: critical, high, medium, low, lowest
 * Jira priorities: Highest, High, Medium, Low, Lowest
 */
export const mapLocalPriorityToJira = (localPriority: string): string => {
  const priorityMap: Record<string, string> = {
    critical: "Highest",
    high: "High",
    medium: "Medium",
    low: "Low",
    lowest: "Low",
  };
  return priorityMap[localPriority] || "Medium";
};

/**
 * Map Jira priority to local priority
 * Jira priorities: Highest, High, Medium, Low, Lowest
 * Local priorities: critical, high, medium, low
 */
export const mapJiraPriorityToLocal = (jiraPriority?: string): string => {
  if (!jiraPriority) return "medium";

  const priorityMap: Record<string, string> = {
    Highest: "critical",
    High: "high",
    Medium: "medium",
    Low: "low",
    Lowest: "low",
  };
  return priorityMap[jiraPriority] || "medium";
};

/**
 * Validate and format Jira project key
 * Jira requirements: Must start with uppercase letter, followed by uppercase alphanumeric characters
 */
export const validateAndFormatProjectKey = (projectKey: string): string => {
  if (!projectKey) {
    throw new Error("Project key is required");
  }

  // Remove any non-alphanumeric characters and convert to uppercase
  let formattedKey = projectKey.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // Ensure it starts with a letter
  if (!/^[A-Z]/.test(formattedKey)) {
    // If it doesn't start with a letter, add 'P' prefix
    formattedKey = "P" + formattedKey;
  }

  // Ensure it's at least 2 characters long
  if (formattedKey.length < 2) {
    formattedKey = formattedKey + "1";
  }

  // Limit to 10 characters (Jira's typical limit)
  if (formattedKey.length > 10) {
    formattedKey = formattedKey.substring(0, 10);
  }

  // Validate final format
  if (!/^[A-Z][A-Z0-9]*$/.test(formattedKey)) {
    throw new Error(
      `Invalid project key format: ${formattedKey}. Must start with uppercase letter followed by uppercase alphanumeric characters.`
    );
  }

  return formattedKey;
};

/**
 * Generate a valid Jira project key from project name
 */
export const generateProjectKeyFromName = (projectName: string): string => {
  if (!projectName) {
    throw new Error("Project name is required");
  }

  // Extract meaningful words and convert to uppercase
  const words = projectName
    .split(/[\s\-_]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return "PROJECT1";
  }

  // Create key from first few words
  let key = words[0];

  // Add subsequent words if space allows
  for (let i = 1; i < words.length && key.length < 8; i++) {
    const word = words[i];
    if (key.length + word.length <= 10) {
      key += word;
    } else {
      // Add first letter of remaining words
      key += word.charAt(0);
    }
  }

  // Ensure it starts with a letter
  if (!/^[A-Z]/.test(key)) {
    key = "P" + key;
  }

  // Ensure it's at least 2 characters
  if (key.length < 2) {
    key = key + "1";
  }

  // Limit to 10 characters
  if (key.length > 10) {
    key = key.substring(0, 10);
  }

  return key;
};

/**
 * Get priority mapping information for documentation
 */
export const getPriorityMappingInfo = () => {
  return {
    localToJira: {
      critical: "Highest",
      high: "High",
      medium: "Medium",
      low: "Low",
      lowest: "Low",
    },
    jiraToLocal: {
      Highest: "critical",
      High: "high",
      Medium: "medium",
      Low: "low",
      Lowest: "low",
    },
    description: "Priority mapping between local system and Jira",
  };
};

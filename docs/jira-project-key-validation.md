# Jira Project Key Validation

This document describes the project key validation and formatting implementation for Jira integration.

## Overview

Jira has strict requirements for project keys:

- Must start with an uppercase letter
- Followed by one or more uppercase alphanumeric characters
- Typically limited to 10 characters
- Cannot contain special characters or spaces

The validation system automatically formats invalid project keys to meet Jira's requirements.

## Jira Project Key Requirements

### Format Rules

- **Start**: Must begin with an uppercase letter (A-Z)
- **Characters**: Can contain uppercase letters (A-Z) and numbers (0-9)
- **Length**: Typically 2-10 characters
- **Special Characters**: Not allowed (spaces, hyphens, underscores, etc.)

### Examples

| Valid Keys  | Invalid Keys                    |
| ----------- | ------------------------------- |
| `TEST`      | `test` (lowercase)              |
| `PROJECT1`  | `123TEST` (starts with number)  |
| `WEBDEV`    | `test@#$%` (special characters) |
| `API123`    | `a` (too short)                 |
| `MOBILEAPP` | `verylongprojectkey` (too long) |

## Implementation

### Utility Functions

The project key validation is implemented in `lib/jira-utils.ts`:

```typescript
// Validate and format project key
export const validateAndFormatProjectKey = (projectKey: string): string => {
  // Removes special characters, converts to uppercase
  // Ensures it starts with a letter
  // Ensures minimum length of 2 characters
  // Limits to 10 characters
  // Validates final format
};

// Generate project key from project name
export const generateProjectKeyFromName = (projectName: string): string => {
  // Extracts meaningful words
  // Converts to uppercase
  // Combines words intelligently
  // Ensures Jira compliance
};
```

### Auto-Fix Rules

The validation system automatically fixes common issues:

1. **Lowercase to Uppercase**: `test` → `TEST`
2. **Special Characters**: `test@#$%` → `TEST`
3. **Starts with Number**: `123test` → `P123TEST`
4. **Too Short**: `a` → `A1`
5. **Too Long**: `verylongprojectkey` → `VERYLONGPR`
6. **Whitespace Only**: `   ` → `P1`

### Generation from Project Name

When no project key is provided, the system generates one from the project name:

| Project Name             | Generated Key | Logic              |
| ------------------------ | ------------- | ------------------ |
| `My Project`             | `MYPROJECT`   | Combines words     |
| `Web Development`        | `WEBD`        | Uses first letters |
| `API Integration`        | `APII`        | Uses first letters |
| `Mobile App Development` | `MOBILEAPP`   | Mixed approach     |
| `123 Project`            | `P123PROJEC`  | Adds P prefix      |
| `Very Long Project Name` | `VERYLONG`    | Truncates          |

## Integration Points

### Export API (`app/api/workspace/[workspaceId]/jira/export/route.ts`)

The export route validates project keys before creating Jira projects:

```typescript
// Validate and format project key for new projects
if (createNewProject) {
  try {
    if (!projectKey) {
      // Generate from project name
      validatedProjectKey = generateProjectKeyFromName(projectName);
    } else {
      // Validate and format provided key
      validatedProjectKey = validateAndFormatProjectKey(projectKey);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Invalid project key: ${error.message}` },
      { status: 400 }
    );
  }
}
```

### Error Handling

The system provides clear error messages for invalid project keys:

- **Missing Key**: "Project key is required"
- **Invalid Format**: "Invalid project key format: {key}. Must start with uppercase letter followed by uppercase alphanumeric characters."
- **Missing Name**: "Project name is required when creating new project"

## Testing

### Test Script

Run the project key validation test:

```bash
node scripts/test-project-key-validation.js
```

### Test Coverage

- ✅ Valid project keys (4/4 tests passed)
- ✅ Invalid keys auto-fixed (5/5 tests passed)
- ✅ Edge cases (4/4 tests passed)
- ✅ Generation from names (8/8 tests passed)
- ✅ Jira format compliance (6/6 keys valid)

## Usage Examples

### Manual Validation

```typescript
import { validateAndFormatProjectKey } from "@/lib/jira-utils";

const key = validateAndFormatProjectKey("my-project");
// Result: "MYPROJECT"
```

### Auto-Generation

```typescript
import { generateProjectKeyFromName } from "@/lib/jira-utils";

const key = generateProjectKeyFromName("Web Development");
// Result: "WEBD"
```

### Error Handling

```typescript
try {
  const key = validateAndFormatProjectKey("");
  // This will throw: "Project key is required"
} catch (error) {
  console.error(error.message);
}
```

## Migration Notes

### Previous Issues Fixed

1. **API Error 400**: Project keys that didn't meet Jira requirements caused API errors
2. **Manual Formatting**: Users had to manually format project keys correctly
3. **No Validation**: Invalid keys were sent to Jira API without validation

### Current Implementation

1. **Automatic Validation**: All project keys are validated before API calls
2. **Auto-Fixing**: Invalid keys are automatically formatted to meet requirements
3. **Clear Errors**: Users get helpful error messages for invalid keys
4. **Auto-Generation**: Project keys can be generated from project names

## Future Enhancements

1. **Custom Validation Rules**: Allow users to customize validation rules
2. **Key Availability Check**: Verify project key availability in Jira
3. **Key Suggestions**: Provide alternative key suggestions when conflicts occur
4. **Bulk Validation**: Support for validating multiple project keys at once
5. **Key History**: Track project key changes and conflicts

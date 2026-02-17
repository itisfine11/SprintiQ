# Jira Fields Check Feature

## Overview

The Jira Fields Check feature allows users to get all fields (both System and Custom) from a Jira project using the Jira REST API. This feature is specifically designed to check for the existence of "Story Points" fields and provide comprehensive field information for export operations.

## Features

### 1. Comprehensive Field Detection

- **System Fields**: All built-in Jira fields (summary, description, priority, etc.)
- **Custom Fields**: User-defined custom fields
- **Story Points Detection**: Specific detection of Story Points fields with multiple naming variations
- **Field Categorization**: Automatic categorization of fields by type

### 2. API Endpoint

- **URL**: `/api/workspace/[workspaceId]/jira/check-fields`
- **Method**: POST
- **Authentication**: Required (user must be authenticated)
- **Parameters**:
  - `jiraCredentials`: Object containing Jira connection details
  - `projectKey`: String representing the Jira project key

### 3. Logging System

- **Log Files**: Detailed logs saved to `logs/` directory
- **Timestamped Entries**: Each log entry includes timestamp
- **Step-by-Step Progress**: Detailed progress through each step
- **Error Handling**: Comprehensive error logging and recovery

## Implementation Details

### Backend Components

#### 1. New API Endpoint

```typescript
// app/api/workspace/[workspaceId]/jira/check-fields/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
);
```

#### 2. Enhanced JiraAPI Class

```typescript
// lib/jira-api.ts
async getAllFields(): Promise<any[]>
async getProjectFields(projectKey: string): Promise<any[]>
async getCreateMetadata(projectKey: string): Promise<any[]>
```

#### 3. Export Route Integration

```typescript
// app/api/workspace/[workspaceId]/jira/export/route.ts
// Step 1.5: Check fields for the project (both new and existing)
```

### Frontend Components

#### 1. Export Modal Integration

```typescript
// components/workspace/modals/export-to-jira-modal.tsx
const checkFields = async (projectKey: string)
```

#### 2. UI Features

- **Check Fields Button**: Available in new project creation
- **Automatic Checking**: Triggered when existing project is selected
- **Visual Indicators**: Badges showing Story Points field availability
- **Detailed Statistics**: Display of field counts and categories

## Usage

### 1. Export to Jira Modal

1. Open the export-to-jira modal
2. Enter Jira credentials and test connection
3. Select an existing project or create a new one
4. Click "Check Fields" button (for new projects) or select existing project
5. View field check results and statistics

### 2. API Usage

```javascript
const response = await fetch("/api/workspace/[workspaceId]/jira/check-fields", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jiraCredentials: {
      jira_domain: "your-domain.atlassian.net",
      jira_email: "your-email@example.com",
      jira_api_token: "your-api-token",
    },
    projectKey: "PROJECT",
  }),
});
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "projectKey": "PROJECT",
    "projectName": "Project Name",
    "totalFields": 150,
    "systemFields": 45,
    "customFields": 105,
    "storyPointsFields": 1,
    "hasStoryPointsField": true,
    "storyPointsFieldName": "customfield_10016",
    "logFile": "jira-fields-check-1234567890.txt"
  },
  "fields": {
    "system": [...],
    "custom": [...],
    "storyPoints": [...],
    "project": [...]
  }
}
```

### Error Response

```json
{
  "error": "Failed to check Jira fields: Connection failed"
}
```

## Log File Format

Log files are saved in the `logs/` directory with the format:

```
[2024-01-01T12:00:00.000Z] === JIRA FIELDS CHECK START ===
[2024-01-01T12:00:00.001Z] Workspace: My Workspace (uuid)
[2024-01-01T12:00:00.002Z] Project Key: PROJECT
[2024-01-01T12:00:00.003Z] Jira Domain: your-domain.atlassian.net
[2024-01-01T12:00:00.004Z] Jira Email: your-email@example.com
[2024-01-01T12:00:00.005Z] Step 1: Testing Jira connection...
[2024-01-01T12:00:00.006Z] Connection test result: SUCCESS
[2024-01-01T12:00:00.007Z] Step 2: Getting project details...
[2024-01-01T12:00:00.008Z] Project found: Project Name (PROJECT)
[2024-01-01T12:00:00.009Z] Project ID: 12345
[2024-01-01T12:00:00.010Z] Project Type: software
[2024-01-01T12:00:00.011Z] Step 3: Getting all fields from Jira...
[2024-01-01T12:00:00.012Z] Total fields found: 150
[2024-01-01T12:00:00.013Z] Step 4: Categorizing fields...
[2024-01-01T12:00:00.014Z] Found potential Story Points field: Story Points (customfield_10016)
[2024-01-01T12:00:00.015Z]   - Field ID: customfield_10016
[2024-01-01T12:00:00.016Z]   - Is Custom: Yes
[2024-01-01T12:00:00.017Z]   - Schema: {"type":"number","system":"com.atlassian.jira.plugin.system.customfieldtypes:float"}
[2024-01-01T12:00:00.018Z] System fields: 45
[2024-01-01T12:00:00.019Z] Custom fields: 105
[2024-01-01T12:00:00.020Z] Story Points fields: 1
[2024-01-01T12:00:00.021Z] Step 6: Checking Story Points field specifically...
[2024-01-01T12:00:00.022Z] Story Points field name: customfield_10016
[2024-01-01T12:00:00.023Z] Story Points field detected successfully!
[2024-01-01T12:00:00.024Z]   - Field Key: customfield_10016
[2024-01-01T12:00:00.025Z]   - Field Name: Story Points
[2024-01-01T12:00:00.026Z]   - Field ID: customfield_10016
[2024-01-01T12:00:00.027Z]   - Is Custom: Yes
[2024-01-01T12:00:00.028Z]   - Schema Type: number
[2024-01-01T12:00:00.029Z]   - Schema System: com.atlassian.jira.plugin.system.customfieldtypes:float
[2024-01-01T12:00:00.030Z] === STORY POINTS FIELDS ===
[2024-01-01T12:00:00.031Z] 1. Story Points Field Details:
[2024-01-01T12:00:00.032Z]    - Field ID: customfield_10016
[2024-01-01T12:00:00.033Z]    - Field Name: Story Points
[2024-01-01T12:00:00.034Z]    - Field Key: customfield_10016
[2024-01-01T12:00:00.035Z]    - Is Custom: Yes
[2024-01-01T12:00:00.036Z]    - Schema Type: number
[2024-01-01T12:00:00.037Z]    - Schema System: com.atlassian.jira.plugin.system.customfieldtypes:float
[2024-01-01T12:00:00.038Z]    - Full Field Data: {
[2024-01-01T12:00:00.039Z]      "id": "customfield_10016",
[2024-01-01T12:00:00.040Z]      "name": "Story Points",
[2024-01-01T12:00:00.041Z]      "key": "customfield_10016",
[2024-01-01T12:00:00.042Z]      "schema": {
[2024-01-01T12:00:00.043Z]        "type": "number",
[2024-01-01T12:00:00.044Z]        "system": "com.atlassian.jira.plugin.system.customfieldtypes:float"
[2024-01-01T12:00:00.045Z]      },
[2024-01-01T12:00:00.046Z]      "isCustom": true
[2024-01-01T12:00:00.047Z]    }
[2024-01-01T12:00:00.048Z] === JIRA FIELDS CHECK COMPLETE ===
```

## Story Points Field Detection

The system checks for Story Points fields using multiple criteria with priority order:

### Priority 1: Exact "Story Points" Field

- **Exact Match**: `field.name.toLowerCase().trim() === "story points"`
- **Priority**: Highest - This is the preferred field to use
- **Example**: `customfield_10036` with name "Story Points"

### Priority 2: Partial Matches

- **Field Name Matching**:

  - "story point" (case insensitive)
  - "storypoint" (case insensitive)
  - "points" (case insensitive)

- **Field Key Matching**:

  - Field keys containing "story"

- **Common Field Names**:
  - "Story Point"
  - "Points"

### Field Selection Logic

1. **First**: Look for exact "Story Points" field name
2. **Second**: Use fallback detection for partial matches
3. **Third**: Use common field IDs as last resort

### Example Priority Order

1. `customfield_10036` - "Story Points" ✅ **Preferred**
2. `customfield_10016` - "Story point estimate" ⚠️ **Fallback**

### Jira Custom Field Assignment

For Story Points fields, the correct JSON structure is:

```json
{
  "customfield_10036": 5
}
```

**NOT**:

```json
{
  "customfield_10036": {
    "value": 5
  }
}
```

The `value` structure is only used for select/option fields, not number fields like Story Points.

## Error Handling

### Connection Errors

- Invalid credentials
- Network connectivity issues
- Jira API rate limiting

### Project Errors

- Project not found
- Insufficient permissions
- Project access denied

### Field Errors

- API endpoint unavailable
- Malformed response data
- Timeout errors

## Testing

### Manual Testing

1. Run the test script: `node scripts/test-jira-fields-check.js`
2. Use the export modal with real Jira credentials
3. Verify log files are created in `logs/` directory
4. Check field detection accuracy

### Automated Testing

- API endpoint tests
- Field categorization tests
- Story Points detection tests
- Error handling tests

## Future Enhancements

1. **Field Mapping**: Allow users to map custom fields
2. **Field Validation**: Validate field types and formats
3. **Bulk Operations**: Check fields for multiple projects
4. **Caching**: Cache field information for performance
5. **Advanced Filtering**: Filter fields by type, category, or usage

## Dependencies

- Next.js API routes
- Jira REST API v3
- File system for logging
- Supabase for authentication
- React for frontend components

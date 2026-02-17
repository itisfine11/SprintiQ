# Jira Import with Sprint Support

## Overview

The enhanced Jira import functionality now supports importing stories from Jira with proper sprint handling. When importing from Jira, the system will:

1. **For stories that belong to Jira sprints**: Create sprint folders and sprints in your system, then move those stories into the appropriate sprints (NOT included in projects)
2. **For stories that don't belong to any sprint**: Assign them to their actual Jira project

## How It Works

### Sprint Detection

The system detects sprint information from Jira issues by looking for common sprint field names:

- `customfield_10020` (Common sprint field)
- `customfield_10007` (Another common sprint field)
- `customfield_10016` (Another common sprint field)
- `customfield_10008` (Another common sprint field)
- `customfield_10001` (Another common sprint field)
- `sprint`
- `sprints`
- `rapidViewId` (Sometimes used)

The system handles multiple formats:

- **Array format**: `[{id: "123", name: "Sprint 1"}]`
- **String format**: `com.atlassian.greenhopper.service.sprint.Sprint@123[rapidViewId=456,state=ACTIVE,name=Sprint 1]`
- **Object format**: `{id: "123", name: "Sprint 1"}`
- **Number format**: `123` (sprint ID as number)

### Import Process

1. **Fetch Data**: The system fetches all issues and statuses from selected Jira projects
2. **Analyze Sprints**: Each issue is analyzed to extract sprint information
3. **Group Issues**: Issues are grouped by sprint (if they belong to one) or marked as non-sprint
4. **Create Sprint Structure**:
   - Creates a "Jira Sprints" sprint folder
   - Creates individual sprints for each unique Jira sprint
   - Assigns sprint issues to the appropriate sprints
   - **Creates statuses for each sprint** (same statuses as projects)
5. **Assign Non-Sprint Issues**: Assigns non-sprint issues to their actual Jira projects
6. **Import Tasks**: Converts and saves all tasks with proper sprint/project assignments

### Database Structure

#### Sprint Folders

- **Name**: "Jira Sprints"
- **Space**: Assigned to the selected space
- **Duration**: Default 2-week sprints

#### Sprints

- **Name**: Uses the Jira sprint name or generates one
- **Goal**: "Imported from Jira Sprint {sprintId}"
- **Sprint Folder**: Assigned to the "Jira Sprints" folder
- **Start/End Dates**: Not set (can be updated manually)
- **Statuses**: Same statuses as projects are created for each sprint

#### Projects

- **Jira Projects**: Created for each imported Jira project
- **Non-Sprint Issues**: Assigned to their actual Jira projects

#### Tasks

- **Sprint Tasks**: Assigned to the appropriate sprint with `sprint_id` set, `project_id` is NULL
- **Non-Sprint Tasks**: Assigned to their actual Jira project with `project_id` set
- **Sprint ID**: Set to the created sprint ID for sprint tasks
- **Project ID**: Set to the appropriate project ID (NULL for sprint tasks)

## API Response

The import API now returns enhanced information:

```json
{
  "success": true,
  "message": "Jira data imported successfully",
  "data": {
    "projects": 3,
    "tasks": 25,
    "statuses": 8,
    "sprintFolders": 1,
    "sprints": 4,
    "sprintIssues": 18,
    "nonSprintIssues": 7
  }
}
```

## Usage

The import process works the same as before, but now automatically handles sprint information:

1. Select Jira projects to import
2. The system will automatically:
   - Create sprint folders and sprints for sprint issues
   - Assign non-sprint issues to their actual Jira projects
   - Assign tasks to the appropriate sprints or projects
   - **Sprint stories are NOT included in projects** - they only exist in sprints
   - **Statuses are created for both projects and sprints**

## Benefits

- **Organized Import**: Sprint issues are properly organized into sprints
- **Clean Separation**: Sprint stories are not duplicated in projects
- **Logical Assignment**: Non-sprint issues stay in their original Jira projects
- **Preserved Structure**: Maintains the sprint structure from Jira
- **Status Support**: Both sprints and projects have the same status options
- **Flexible Assignment**: Tasks can be moved between sprints and projects after import

## Limitations

- Sprint dates are not imported (can be set manually)
- Sprint goals are generic (can be updated manually)
- Only the first sprint is used if an issue belongs to multiple sprints
- Sprint folder name is fixed as "Jira Sprints"

## Future Enhancements

- Import sprint start/end dates from Jira
- Import sprint goals from Jira
- Support for multiple sprint assignments per issue
- Customizable sprint folder naming
- Sprint status mapping (Active, Closed, etc.)

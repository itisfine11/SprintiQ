# Jira Description Conversion

This document describes the conversion functionality that transforms AI-generated story descriptions into Jira-compatible format.

## Overview

The Jira export feature now includes intelligent conversion of AI-generated story descriptions to Jira's markup format. This ensures that stories created with our AI system are properly formatted when exported to Jira.

## Conversion Rules

### Headers

- `## Header` → `h2. Header`
- `### Header` → `h3. Header`
- `#### Header` → `h4. Header`

### Text Formatting

- `**bold text**` → `*bold text*` (Jira bold)
- `*italic text*` → `_italic text_` (Jira italic)

### Lists

- `- item` → `* item` (Jira bullet list)
- `1. item` → `1. item` (Jira numbered list)

### Special Formatting

- `**Field**: value` → `*Field*: value` (Story details)
- `⚠️ warning` → `(!) warning` (Warning icons)
- `⚠️ LOW SKILL MATCH: message` → `*(!) LOW SKILL MATCH*: message` (Skill match warnings)

### Code and Links

- `` `code` `` → `{{code}}` (Inline code)
- `[text](url)` → `[text|url]` (Links)
- `> quote` → `bq. quote` (Blockquotes)

## Example Conversion

### Input (AI-Generated Story)

```markdown
## User Story

As a **Frontend Developer**, I want **to implement a comprehensive booking dashboard**, so that **business users can monitor trends**.

## Acceptance Criteria

- Dashboard displays metrics with 2-second load time
- Users can filter by date range and status
- Real-time updates within 5 seconds

## Story Details

- **Story Points**: 8
- **Priority**: High
- **Estimated Time**: 32 hours

## Anti-Pattern Warnings

- ⚠️ Avoid overloading dashboard with too many metrics
- ⚠️ LOW SKILL MATCH: Mike has only 0% skill match
```

### Output (Jira Format)

```jira
h2. User Story
As a *Frontend Developer*, I want *to implement a comprehensive booking dashboard*, so that *business users can monitor trends*.

h2. Acceptance Criteria
* Dashboard displays metrics with 2-second load time
* Users can filter by date range and status
* Real-time updates within 5 seconds

h2. Story Details
* *Story Points*: 8
* *Priority*: High
* *Estimated Time*: 32 hours

h2. Anti-Pattern Warnings
* (!) Avoid overloading dashboard with too many metrics
* (!) *(!) LOW SKILL MATCH*: Mike has only 0% skill match
```

## Implementation

### Core Conversion Function

```typescript
export const convertGeneratedStoryToJiraFormat = (
  storyContent: string
): string => {
  // Converts markdown-style AI-generated stories to Jira format
};
```

### Integration Points

1. **JiraSyncService**: Automatically detects and converts generated story format
2. **Export API**: Uses conversion when pushing tasks to Jira
3. **Test API**: Available at `/api/test-jira-conversion` for testing

## Testing

### Test Script

Run the test script to verify conversion:

```bash
node scripts/test-jira-conversion.js
```

### API Testing

Test the conversion via API:

```bash
# GET test case
curl http://localhost:3000/api/test-jira-conversion

# POST custom story
curl -X POST http://localhost:3000/api/test-jira-conversion \
  -H "Content-Type: application/json" \
  -d '{"storyContent": "## User Story\nAs a **Developer**..."}'
```

## Missing Fields in Jira Export

The current Jira export is missing some key fields that should be added:

1. **Task Priority Levels** - Map local priority to Jira priority
2. **Story Point Estimates** - Include story points in Jira custom fields
3. **Team Member Assignments** - Map local assignees to Jira assignees
4. **Acceptance Criteria** - Already handled in description conversion

### Recommended Enhancements

1. **Priority Mapping**: Implement proper priority field mapping
2. **Story Points**: Add custom field support for story points
3. **Assignee Mapping**: Create user mapping between local and Jira users
4. **Custom Fields**: Support for additional Jira custom fields

## Usage

The conversion is automatically applied when:

- Exporting tasks to Jira
- Syncing tasks bidirectionally with Jira
- Creating new Jira issues from local tasks

The system detects AI-generated story format by checking for:

- `## User Story` headers
- `## Acceptance Criteria` sections
- `## Story Details` sections
- `## Anti-Pattern Warnings` sections

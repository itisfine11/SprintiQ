# Jira Priority Mapping

This document describes the priority mapping implementation between the local system and Jira.

## Overview

The priority mapping ensures that task priorities are correctly converted when syncing between the local system and Jira. The mapping handles the different priority levels used by each system.

## Priority Mapping Rules

### Local to Jira (Export)

| Local Priority | Jira Priority | Description                                           |
| -------------- | ------------- | ----------------------------------------------------- |
| `critical`     | `Highest`     | Critical tasks map to Jira's highest priority         |
| `high`         | `High`        | High priority tasks map to Jira's high priority       |
| `medium`       | `Medium`      | Medium priority tasks map to Jira's medium priority   |
| `low`          | `Low`         | Low priority tasks map to Jira's low priority         |
| `lowest`       | `Low`         | Lowest priority tasks also map to Jira's low priority |

### Jira to Local (Import)

| Jira Priority | Local Priority | Description                              |
| ------------- | -------------- | ---------------------------------------- |
| `Highest`     | `critical`     | Jira's highest priority maps to critical |
| `High`        | `high`         | Jira's high priority maps to high        |
| `Medium`      | `medium`       | Jira's medium priority maps to medium    |
| `Low`         | `low`          | Jira's low priority maps to low          |
| `Lowest`      | `low`          | Jira's lowest priority also maps to low  |

## Implementation

### Centralized Utility Functions

The priority mapping is implemented in `lib/jira-utils.ts`:

```typescript
// Map local priority to Jira priority
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

// Map Jira priority to local priority
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
```

### Integration Points

The priority mapping is used in the following components:

1. **JiraSyncService** (`lib/jira-sync-service.ts`)

   - `mapPriorityToJira()` - Maps local priorities when pushing to Jira
   - `mapJiraPriority()` - Maps Jira priorities when pulling from Jira

2. **JiraConverter** (`lib/jira-converter.ts`)

   - `mapJiraPriority()` - Maps Jira priorities during import

3. **Export API** (`app/api/workspace/[workspaceId]/jira/export/route.ts`)

   - Maps local priorities when exporting tasks to Jira

4. **Sync API** (`app/api/workspace/[workspaceId]/jira/sync/route.ts`)
   - Maps Jira priorities when syncing from Jira

## Key Features

### 1. Bidirectional Mapping

- **Local → Jira**: Maps local priorities to Jira priorities during export
- **Jira → Local**: Maps Jira priorities to local priorities during import

### 2. Fallback Handling

- Unknown priorities default to "Medium" for Jira and "medium" for local
- Null/undefined values are handled gracefully

### 3. Consistent Mapping

- Both "low" and "lowest" local priorities map to "Low" in Jira
- Both "Low" and "Lowest" Jira priorities map to "low" in local system

### 4. Centralized Logic

- All priority mapping logic is centralized in `lib/jira-utils.ts`
- Consistent behavior across all sync operations

## Testing

### Test Script

Run the priority mapping test:

```bash
node scripts/test-priority-mapping.js
```

### Test Coverage

- ✅ Local to Jira mapping (6/6 tests passed)
- ✅ Jira to Local mapping (8/8 tests passed)
- ✅ Bidirectional mapping (5/5 tests passed)

## Usage Examples

### Export to Jira

```typescript
import { mapLocalPriorityToJira } from "@/lib/jira-utils";

const localPriority = "critical";
const jiraPriority = mapLocalPriorityToJira(localPriority);
// Result: "Highest"
```

### Import from Jira

```typescript
import { mapJiraPriorityToLocal } from "@/lib/jira-utils";

const jiraPriority = "Highest";
const localPriority = mapJiraPriorityToLocal(jiraPriority);
// Result: "critical"
```

## Migration Notes

### Previous Issues Fixed

1. **Missing Critical Mapping**: The `mapPriorityToJira` function was missing the mapping for "critical" to "Highest"
2. **Inconsistent Export**: The export route was using default "Medium" instead of actual task priorities
3. **Scattered Logic**: Priority mapping was duplicated across multiple files

### Current Implementation

1. **Centralized**: All priority mapping logic is in `lib/jira-utils.ts`
2. **Consistent**: Same mapping rules applied across all sync operations
3. **Tested**: Comprehensive test coverage ensures reliability

## Future Enhancements

1. **Custom Priority Mapping**: Allow users to customize priority mappings
2. **Priority Validation**: Validate that Jira project supports the mapped priorities
3. **Priority History**: Track priority changes during sync operations
4. **Bulk Priority Updates**: Support for bulk priority updates during sync

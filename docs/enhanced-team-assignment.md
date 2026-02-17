# Enhanced Team Assignment Logic

## Overview

The enhanced team assignment system addresses four critical cases for optimal story distribution:

1. **Skill Matching** (40% weight)
2. **Level-based Priority Assignment** (30% weight)
3. **Workload Balancing** (20% weight)
4. **Distribution Bonus** (10% weight) - **NEW**

## Case 1: Skill Matching (40% weight)

### Direct Skill Matches

- Exact matches between story tags and team member skills
- Example: Story tagged with "React" matches member with "React" skill

### Partial Skill Matches

- Partial matches with 70% weight
- Example: "React Native" story matches member with "React" skill
- Example: "API" story matches member with "REST API" skill

### Role-based Skill Matching

- Automatic skill matching based on team member roles
- Frontend Developer: React, Vue, Angular, JavaScript, TypeScript, CSS, HTML, UI, frontend
- Backend Developer: Java, Spring, Node.js, Python, C#, Database, API, backend, server
- Full Stack Developer: React, Node.js, Java, Spring, Database, API, fullstack
- DevOps Engineer: Docker, Kubernetes, AWS, CI/CD, infrastructure, monitoring, devops
- QA Engineer: Testing, automation, Selenium, Jest, quality, qa
- UI/UX Designer: Figma, design, UI, UX, prototyping, user research
- Product Manager: Product, strategy, agile, stakeholder, user research
- Data Scientist: Python, machine learning, statistics, data analysis, SQL

## Case 2: Level-based Priority Assignment (30% weight) - **IMPROVED**

### Enhanced Complexity Matching

| Level  | Simple | Moderate | Complex |
| ------ | ------ | -------- | ------- |
| Junior | 0.9    | 0.6      | 0.3     |
| Mid    | 0.8    | 0.9      | 0.7     |
| Senior | 0.7    | 0.8      | 0.9     |
| Lead   | 0.6    | 0.7      | 0.8     |

### Enhanced Priority Matching - **MORE AGGRESSIVE**

| Level  | Low | Medium | High | Critical |
| ------ | --- | ------ | ---- | -------- |
| Junior | 0.9 | 0.7    | 0.4  | 0.2      |
| Mid    | 0.7 | 0.9    | 0.8  | 0.5      |
| Senior | 0.5 | 0.7    | 0.9  | 0.8      |
| Lead   | 0.3 | 0.5    | 0.8  | 0.95     |

### Key Principles

- **Critical priority stories** are primarily assigned to **Lead/Senior** members
- **High priority stories** are assigned to **Senior/Lead** members
- **Medium priority stories** are assigned to **Mid/Senior** members
- **Low priority stories** are assigned to **Junior/Mid** members
- **Simple stories** can be assigned to **Junior** members for learning
- **Complex stories** require **Senior/Lead** expertise

## Case 3: Workload Balancing (20% weight) - **REDUCED**

### Workload Calculation

- **Current Workload**: Sum of estimated hours from active tasks
- **Max Workload**: 80% of member's availability
- **Workload Score**: Inverted ratio (lower workload = higher score)

### Workload Bonuses

- **Low Workload Bonus**: +0.1 for members with <30% workload
- **Overload Protection**: 0.1 score for members at/above capacity

### Level-based Workload Expectations

- **Junior**: 40% of availability typically assigned
- **Mid**: 50% of availability typically assigned
- **Senior**: 60% of availability typically assigned
- **Lead**: 70% of availability typically assigned (includes meetings, mentoring)

## Case 4: Distribution Bonus (10% weight) - **NEW**

### Distribution Logic

- **Assignment Limits**: Maximum stories per member (default: 3)
- **Distribution Score**: Encourages spreading stories across team members
- **Available Capacity**: Higher score for members with fewer current assignments

### Distribution Benefits

- **Prevents Overloading**: No single member gets too many stories
- **Balanced Workload**: Stories distributed evenly across team
- **Skill Utilization**: Better use of all team member skills
- **Learning Opportunities**: Junior members get appropriate stories

## Scoring Algorithm - **UPDATED**

```typescript
const totalScore =
  skillMatch * 0.4 +
  levelPriorityMatch * 0.3 +
  workloadScore * 0.2 +
  distributionScore * 0.1 +
  performanceBonus;
```

### Performance Bonus

- Historical success rate from Supabase performance data
- Reduced to 5% additional score for high-performing members

## Assignment Limits and Distribution

### Maximum Stories Per Member

- **Default**: 3 stories per member
- **Configurable**: Based on team size and story count
- **Formula**: `Math.max(2, Math.ceil(stories.length / teamMembers.length))`

### Distribution Strategy

1. **Track Current Assignments**: Monitor stories assigned to each member
2. **Filter Available Members**: Exclude members at assignment limit
3. **Score Remaining Members**: Apply all scoring factors
4. **Select Best Available**: Choose highest-scoring available member

## Confidence Calculation - **UPDATED**

```typescript
const confidence =
  skillMatch * 0.4 +
  levelPriorityMatch * 0.3 +
  workloadScore * 0.2 +
  distributionScore * 0.1;
```

## Assignment Reasons - **ENHANCED**

The system generates human-readable reasons for assignments:

- **Excellent skill match** (>70% skill match)
- **Good skill match** (>50% skill match)
- **Optimal level for priority** (>80% level match)
- **Appropriate level** (>60% level match)
- **Available capacity** (>80% workload score)
- **Reasonable workload** (>60% workload score)
- **Available for more stories** (>80% distribution score)
- **Reasonable distribution** (>60% distribution score)
- **High success rate** (if performance data available)

## Warnings and Alerts

The system provides warnings for potential issues:

- **Overload Warning**: When assigned member is at capacity
- **Low Skill Match Warning**: When skill match is below 30%
- **Assignment Limit Warning**: When all members reach assignment limit
- **Workload Distribution**: Encourages balanced workload distribution

## Database Integration

### Real Workload Tracking

- Queries active tasks from database
- Calculates actual workload from `estimated_time` and `story_points`
- Filters out completed/closed tasks
- Falls back to estimation if database unavailable

### Performance Data

- Historical success rates from Supabase
- Average velocity per team member
- Completion rates for different story types

## Testing

### Test Endpoint

```
GET /api/test-team-assignment
```

### Improved Test Function

```typescript
await testImprovedTeamAssignment();
```

### Sample Test Scenarios

1. **Critical System Architecture** (Critical priority, complex) → Lead Developer
2. **High Priority API Implementation** (High priority, moderate) → Senior Developer
3. **Medium Priority UI Component** (Medium priority, moderate) → Mid-Level Developer
4. **Low Priority Bug Fix** (Low priority, simple) → Junior Developer
5. **High Priority Security Feature** (High priority, complex) → Senior/Lead Developer
6. **Medium Priority Testing** (Medium priority, simple) → Mid-Level Developer

### Team Assignment Stats

```
POST /api/test-team-assignment
{
  "teamMembers": [...]
}
```

Returns:

- Total members
- Average workload
- Overloaded members count
- Available members count
- Skill distribution
- Assignment distribution

## Usage Examples

### Basic Assignment

```typescript
const result = await getOptimalTeamAssignment(story, teamMembers);
console.log(`Assigned to: ${result.assignedMember.name}`);
console.log(`Reason: ${result.reason}`);
console.log(`Confidence: ${result.confidence}`);
```

### Assignment with Distribution

```typescript
const currentAssignments = new Map<string, number>();
const result = await getOptimalTeamAssignment(story, teamMembers, {
  forceDistribution: true,
  maxStoriesPerMember: 3,
  currentAssignments,
});
```

### Team Statistics

```typescript
const stats = await getTeamAssignmentStats(teamMembers);
console.log(`Overloaded members: ${stats.overloadedMembers}`);
console.log(`Available members: ${stats.availableMembers}`);
```

## Benefits

1. **Prevents Burnout**: Workload balancing prevents overloading team members
2. **Skill Optimization**: Matches stories to team members with relevant skills
3. **Level Appropriateness**: Ensures stories are assigned to appropriate experience levels
4. **Priority Handling**: High-priority stories go to experienced team members
5. **Better Distribution**: Stories are spread across multiple team members
6. **Learning Opportunities**: Junior members get appropriate stories for growth
7. **Team Balance**: Prevents single members from being overloaded

## Migration from Previous Version

### Key Changes

1. **Added Distribution Logic**: New 10% weight for distribution scoring
2. **Reduced Workload Weight**: From 30% to 20% to make room for distribution
3. **Enhanced Priority Matching**: More aggressive level-based priority assignment
4. **Assignment Limits**: Maximum stories per member to prevent overloading
5. **Improved Fallback**: Better distribution in fallback scenarios

### Backward Compatibility

- All existing function signatures remain compatible
- New options are optional with sensible defaults
- Fallback logic maintains existing behavior
- Performance data integration unchanged

## Future Enhancements

1. **Dynamic Assignment Limits**: Adjust limits based on story complexity
2. **Team Velocity Tracking**: Consider historical velocity in assignments
3. **Skill Development**: Track skill growth and adjust assignments accordingly
4. **Pair Programming**: Suggest pair assignments for complex stories
5. **Cross-training**: Encourage skill development through strategic assignments

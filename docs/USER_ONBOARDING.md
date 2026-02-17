# User Onboarding Process

## Overview

SprintiQ now includes a comprehensive onboarding process that collects user information and team preferences before account creation. This helps us personalize the user experience and gather valuable insights about our user base.

## Onboarding Flow

### Step 1: Basic Information

Users provide their basic account information:

- First and last name
- Work email
- Company name
- Password
- Terms acceptance

### Step 2: Team Survey

Users complete a quick survey about their team and agile practices:

- Team size
- Agile experience level
- Current story creation method
- Time estimates for various activities
- Agile tools currently used
- Pain points and frustrations
- How they heard about SprintiQ

## Data Collection

### User Information

- Stored in the `users` table
- `allowed` field set to `false` initially
- Requires admin approval for access

### Onboarding Survey Data

- Stored in the `user_baselines` table
- Includes all survey responses
- Used for personalization and analytics
- One baseline record per user

## Database Schema

### users Table

```sql
- id: UUID (primary key)
- name: TEXT
- email: TEXT
- company: TEXT
- role: TEXT
- allowed: BOOLEAN (default: false)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### user_baselines Table

```sql
- id: UUID (primary key)
- user_id: UUID (references profiles.id)
- baseline_story_time_ms: BIGINT
- baseline_grooming_time_ms: BIGINT
- baseline_planning_time_ms: BIGINT
- baseline_stories_per_session: INTEGER
- baseline_method: TEXT
- team_size: INTEGER
- experience_level: TEXT
- agile_tools: TEXT
- agile_tools_other: TEXT
- biggest_frustration: TEXT
- heard_about_sprintiq: TEXT
- heard_about_sprintiq_other: TEXT
- measurement_date: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Implementation Details

### Frontend Components

- Multi-step form with progress indicator
- Form validation at each step
- Responsive design for all devices
- Step navigation (back/forward)

### API Endpoints

- `POST /api/register-user` - Handles user registration and onboarding data

  - Saves user info to `users` table
  - Saves survey data to `user_baselines` table
  - Sends confirmation emails
  - Sets `allowed: false` for admin approval

- `GET /auth/callback` - Handles OAuth callbacks and onboarding redirects

  - Processes Google OAuth authentication
  - Creates user accounts for new OAuth users
  - Redirects to onboarding completion if needed
  - Checks user approval status

- `GET /complete-onboarding` - Onboarding completion page
  - Collects missing onboarding data
  - Updates user metadata
  - Saves survey responses to database
  - Handles final user routing

### User Approval Process

1. User completes onboarding and account creation
2. User data saved with `allowed: false`
3. User redirected to `/access-denied` page
4. Admin reviews and approves user in admin panel
5. Admin sets `allowed: true` in database
6. User can now access the application

### Google OAuth Handling

**For New Google OAuth Users:**

1. User authenticates with Google
2. Account created automatically in `users` table
3. Redirected to `/complete-onboarding` page
4. User completes onboarding survey
5. Onboarding data saved to `user_baselines` table
6. User status checked (`allowed` field)
7. Redirected based on approval status

**For Existing Google OAuth Users:**

1. User signs in with Google
2. System checks if onboarding is complete
3. If incomplete: redirected to `/complete-onboarding`
4. If complete: redirected to dashboard or appropriate page

## Benefits

### For Users

- Personalized experience based on team size and experience
- Better onboarding tailored to their needs
- Clear understanding of what SprintiQ offers

### For SprintiQ

- Valuable insights into user base
- Better product-market fit understanding
- Improved user experience and retention
- Data-driven feature development

### For Admins

- Control over user access
- Insights into user demographics
- Better understanding of user needs

## Migration

To set up the onboarding system:

1. Run the migration script:

   ```bash
   ./scripts/run-user-baselines-migration.sh
   ```

2. Ensure the `users` table has an `allowed` field:

   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS allowed BOOLEAN DEFAULT false;
   ```

3. Update environment variables if needed

## Future Enhancements

- A/B testing different onboarding flows
- Dynamic survey questions based on user responses
- Integration with analytics platforms
- Automated user approval based on criteria
- Onboarding completion tracking
- Personalized welcome messages and tutorials

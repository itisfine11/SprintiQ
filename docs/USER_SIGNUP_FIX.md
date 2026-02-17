# User Signup Issue Fix

## Problem Description

The user signup process was failing with the error:

```
Error: Failed to create user record: duplicate key value violates unique constraint "users_pkey"
```

## Root Cause

The issue was caused by a database schema mismatch:

1. **Database Schema**: The `users` table was created with `id SERIAL PRIMARY KEY` (auto-incrementing integer)
2. **Application Code**: The signup flow was trying to insert with `id: data.user.id` where `data.user.id` is a UUID from Supabase Auth
3. **Constraint Violation**: This caused a primary key constraint violation

## Additional Issues

1. **Duplicate Table Insertions**: The code was trying to insert into both `users` and `profiles` tables with the same ID
2. **Race Conditions**: Multiple signup attempts could cause conflicts
3. **Poor Error Handling**: Limited debugging information when errors occurred

## Solution

### 1. Database Schema Fix

Run the migration script to fix the users table:

```bash
# Make the script executable
chmod +x scripts/run-users-table-fix.sh

# Run the migration
./scripts/run-users-table-fix.sh
```

Or manually run the SQL in `scripts/fix-users-table-uuid.sql`:

```sql
-- Fix users table to use UUID primary key instead of SERIAL
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  allowed BOOLEAN DEFAULT FALSE,
  company VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Code Improvements

The onboarding modal has been updated with:

- **Duplicate Prevention**: Check if user already exists before insertion
- **Better Error Handling**: More detailed error logging
- **Removed Redundancy**: Eliminated duplicate `profiles` table insertion
- **Upsert Support**: Added upsert functionality for conflict resolution

### 3. Key Changes Made

1. **User Existence Check**: Added check to prevent duplicate user creation
2. **Improved Error Logging**: Better debugging information for database errors
3. **Simplified Schema**: Removed redundant `profiles` table dependency
4. **Conflict Resolution**: Added upsert support for handling edge cases

## Testing

After applying the fix:

1. **Test User Registration**: Try creating a new user account
2. **Check Database**: Verify the user record is created in the `users` table
3. **Monitor Logs**: Check console for any remaining errors

## Prevention

To prevent similar issues in the future:

1. **Schema Validation**: Ensure database schema matches application expectations
2. **Migration Scripts**: Use proper database migration scripts for schema changes
3. **Error Handling**: Implement comprehensive error handling and logging
4. **Testing**: Test signup flow after any database schema changes

## Files Modified

- `components/signup/onboarding-modal.tsx` - Updated signup logic
- `scripts/fix-users-table-uuid.sql` - Database migration script
- `scripts/run-users-table-fix.sh` - Migration execution script
- `docs/USER_SIGNUP_FIX.md` - This documentation

## Next Steps

1. Run the database migration script
2. Test user registration
3. Monitor for any remaining issues
4. Consider implementing automated schema validation in CI/CD

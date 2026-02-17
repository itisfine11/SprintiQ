-- Add Jira integration fields to teams and team_members tables
-- This migration adds support for importing teams from Jira

-- Add type field to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'sprintiq';

-- Add account_id and type fields to team_members table
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS account_id VARCHAR(255);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'sprintiq';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_type ON teams(type);
CREATE INDEX IF NOT EXISTS idx_team_members_type ON team_members(type);
CREATE INDEX IF NOT EXISTS idx_team_members_account_id ON team_members(account_id);

-- Add comments for documentation
COMMENT ON COLUMN teams.type IS 'Team type: sprintiq, jira, etc.';
COMMENT ON COLUMN team_members.account_id IS 'External account ID (e.g., Jira accountId)';
COMMENT ON COLUMN team_members.type IS 'Member type: sprintiq, jira, etc.';

-- Update existing teams to have type 'sprintiq'
UPDATE teams SET type = 'sprintiq' WHERE type IS NULL;

-- Update existing team members to have type 'sprintiq'
UPDATE team_members SET type = 'sprintiq' WHERE type IS NULL; 
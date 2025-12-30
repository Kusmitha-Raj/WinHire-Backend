-- Add new columns for Interview and Feedback Management System
-- SQLite doesn't support IF NOT EXISTS in ALTER TABLE, so we need to check first

-- Add Round to Interviews table
PRAGMA table_info(Interviews);
-- If Round column doesn't exist, add it:
ALTER TABLE Interviews ADD COLUMN Round INTEGER NOT NULL DEFAULT 1;

-- Add PanelistIds to Interviews table
ALTER TABLE Interviews ADD COLUMN PanelistIds TEXT;

-- Add CurrentRound to Applications table
ALTER TABLE Applications ADD COLUMN CurrentRound INTEGER;

-- Add Round to Feedbacks table
ALTER TABLE Feedbacks ADD COLUMN Round INTEGER;

-- Verify the changes
SELECT 'Interviews columns:' as info;
PRAGMA table_info(Interviews);

SELECT 'Applications columns:' as info;
PRAGMA table_info(Applications);

SELECT 'Feedbacks columns:' as info;
PRAGMA table_info(Feedbacks);

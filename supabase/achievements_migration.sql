-- Achievement System Migration for Math Hero
-- Run this in Supabase SQL Editor

-- Create achievements table to store unlocked achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 100,
  
  -- Ensure a user can only unlock each achievement once
  UNIQUE(user_id, achievement_id)
);

-- Add columns to users table for tracking stats
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS days_played JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_games INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policy for achievements
CREATE POLICY "Allow all operations on user_achievements" ON user_achievements
  FOR ALL USING (true) WITH CHECK (true);

-- Comments
COMMENT ON TABLE user_achievements IS 'Stores unlocked achievements for each user';
COMMENT ON COLUMN user_achievements.progress IS 'Progress percentage (0-100) for achievements with partial progress';
COMMENT ON COLUMN users.days_played IS 'Array of ISO date strings when user played';
COMMENT ON COLUMN users.best_streak IS 'Best streak of consecutive correct answers';
COMMENT ON COLUMN users.total_games IS 'Total number of games played';

-- Function to update total_games automatically
CREATE OR REPLACE FUNCTION update_user_total_games()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET total_games = (
    SELECT COUNT(*) FROM game_scores WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update total_games
DROP TRIGGER IF EXISTS trigger_update_total_games ON game_scores;
CREATE TRIGGER trigger_update_total_games
  AFTER INSERT ON game_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_user_total_games();

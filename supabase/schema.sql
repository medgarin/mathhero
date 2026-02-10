-- EasyMaths Database Schema for Supabase

-- Users table: stores only user ID, name, and avatar
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'astronaut',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game scores table: stores detailed game session data
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 6),
  score INTEGER NOT NULL DEFAULT 0,
  accuracy INTEGER NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  lives_remaining INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 10,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  failed_questions JSONB DEFAULT '[]'::jsonb,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for better query performance
  CONSTRAINT game_scores_user_id_idx FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_played_at ON game_scores(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_level ON game_scores(level);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all operations for now (since we're not using auth)
-- In production with proper auth, these should be more restrictive
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on game_scores" ON game_scores
  FOR ALL USING (true) WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user information - only name is collected for privacy';
COMMENT ON TABLE game_scores IS 'Stores detailed game session data including failed questions for learning insights';
COMMENT ON COLUMN game_scores.failed_questions IS 'JSONB array of failed questions with format: [{question: "2x3", userAnswer: 5, correctAnswer: 6}]';

-- Leaderboard Function
CREATE OR REPLACE FUNCTION get_leaderboard(p_level INTEGER DEFAULT NULL)
RETURNS TABLE (
    user_id UUID,
    name TEXT,
    avatar TEXT,
    total_games BIGINT,
    total_score BIGINT,
    best_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.avatar,
        COUNT(gs.id) as total_games,
        SUM(gs.score)::BIGINT as total_score,
        MAX(gs.score) as best_score
    FROM users u
    JOIN game_scores gs ON u.id = gs.user_id
    WHERE (p_level IS NULL OR gs.level = p_level)
    GROUP BY u.id, u.name, u.avatar
    ORDER BY total_score DESC;
END;
$$ LANGUAGE plpgsql;

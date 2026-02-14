import { createClient } from '@supabase/supabase-js';
import type { User, GameScore, FailedQuestion } from './types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a new user with their name and avatar via API
 */
export async function createUser(name: string, avatar: string = 'astronaut'): Promise<User | null> {
    try {
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, avatar }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error creating user via API:', error);
            return null;
        }

        return await response.json() as User;
    } catch (error) {
        console.error('Exception creating user:', error);
        return null;
    }
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }

        return data as User;
    } catch (error) {
        console.error('Exception fetching user:', error);
        return null;
    }
}

/**
 * Save a game score to the database via API
 */
export async function saveGameScore(
    userId: string,
    level: number,
    score: number,
    accuracy: number,
    livesRemaining: number,
    totalQuestions: number,
    correctAnswers: number,
    failedQuestions: FailedQuestion[]
): Promise<GameScore | null> {
    try {
        const response = await fetch('/api/save-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                level,
                score,
                accuracy,
                livesRemaining,
                totalQuestions,
                correctAnswers,
                failedQuestions,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error saving game score via API:', error);
            return null;
        }

        return await response.json() as GameScore;
    } catch (error) {
        console.error('Exception saving game score:', error);
        return null;
    }
}

/**
 * Get all game scores for a user, ordered by most recent first
 */
export async function getUserGameScores(
    userId: string,
    limit?: number
): Promise<GameScore[]> {
    try {
        let query = supabase
            .from('game_scores')
            .select('*')
            .eq('user_id', userId)
            .order('played_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching game scores:', error);
            return [];
        }

        return data as GameScore[];
    } catch (error) {
        console.error('Exception fetching game scores:', error);
        return [];
    }
}

/**
 * Get game scores filtered by level
 */
export async function getUserGameScoresByLevel(
    userId: string,
    level: number
): Promise<GameScore[]> {
    try {
        const { data, error } = await supabase
            .from('game_scores')
            .select('*')
            .eq('user_id', userId)
            .eq('level', level)
            .order('played_at', { ascending: false });

        if (error) {
            console.error('Error fetching game scores by level:', error);
            return [];
        }

        return data as GameScore[];
    } catch (error) {
        console.error('Exception fetching game scores by level:', error);
        return [];
    }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
    try {
        const scores = await getUserGameScores(userId);

        if (scores.length === 0) {
            return {
                totalGames: 0,
                averageScore: 0,
                averageAccuracy: 0,
                bestScore: 0,
                totalScore: 0,
                totalCorrectAnswers: 0,
            };
        }

        const totalGames = scores.length;
        const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
        const totalAccuracy = scores.reduce((sum, score) => sum + score.accuracy, 0);
        const bestScore = Math.max(...scores.map((s) => s.score));
        const totalCorrectAnswers = scores.reduce(
            (sum, score) => sum + score.correct_answers,
            0
        );

        return {
            totalGames,
            totalScore,
            averageScore: Math.round(totalScore / totalGames),
            averageAccuracy: Math.round(totalAccuracy / totalGames),
            bestScore,
            totalCorrectAnswers,
        };
    } catch (error) {
        console.error('Exception calculating user stats:', error);
        return {
            totalGames: 0,
            totalScore: 0,
            averageScore: 0,
            averageAccuracy: 0,
            bestScore: 0,
            totalCorrectAnswers: 0,
        };
    }
}

/**
 * Local storage helpers for user session
 */
export const USER_ID_KEY = 'easymaths_user_id';

export function saveUserIdToLocalStorage(userId: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_ID_KEY, userId);
    }
}

export function getUserIdFromLocalStorage(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(USER_ID_KEY);
    }
    return null;
}

export function clearUserIdFromLocalStorage(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_ID_KEY);
    }
}

/**
 * Achievement System Functions
 */

/**
 * Save unlocked achievements to the database via API
 */
export async function saveAchievements(
    userId: string,
    achievementIds: string[]
): Promise<boolean> {
    try {
        const response = await fetch('/api/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                type: 'achievements',
                data: { achievementIds },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error saving achievements via API:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Exception saving achievements:', error);
        return false;
    }
}

/**
 * Get all unlocked achievements for a user
 */
export async function getUserAchievements(userId: string): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching achievements:', error);
            return [];
        }

        return data.map(a => a.achievement_id);
    } catch (error) {
        console.error('Exception fetching achievements:', error);
        return [];
    }
}

/**
 * Update user's days played via API
 */
export async function updateUserDaysPlayed(
    userId: string,
    daysPlayed: string[]
): Promise<boolean> {
    try {
        const response = await fetch('/api/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                type: 'daysPlayed',
                data: { daysPlayed },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error updating days played via API:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Exception updating days played:', error);
        return false;
    }
}

/**
 * Update user's best streak via API
 */
export async function updateUserBestStreak(
    userId: string,
    streak: number
): Promise<boolean> {
    try {
        // We still do a quick check to see if update is needed (optional, could be done in API too)
        const { data: user } = await supabase
            .from('users')
            .select('best_streak')
            .eq('id', userId)
            .single();

        if (!user || streak <= (user.best_streak || 0)) {
            return true; // No update needed
        }

        const response = await fetch('/api/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                type: 'bestStreak',
                data: { streak },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error updating best streak via API:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Exception updating best streak:', error);
        return false;
    }
}

/**
 * Get user with achievement stats
 */
export async function getUserWithStats(userId: string) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user with stats:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception fetching user with stats:', error);
        return null;
    }
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard(level?: number): Promise<import('./types').LeaderboardEntry[]> {
    try {
        const { data, error } = await supabase.rpc('get_leaderboard', {
            p_level: level || null
        });

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        return (data || []).map((entry: any, index: number) => ({
            ...entry,
            rank: index + 1
        }));
    } catch (error) {
        console.error('Exception fetching leaderboard:', error);
        return [];
    }
}

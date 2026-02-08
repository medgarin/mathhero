import { createClient } from '@supabase/supabase-js';
import type { User, GameScore, FailedQuestion } from './types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a new user with their name and avatar
 */
export async function createUser(name: string, avatar: string = 'astronaut'): Promise<User | null> {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, avatar }])
            .select()
            .single();

        if (error) {
            console.error('Error creating user:', error);
            return null;
        }

        return data as User;
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
 * Save a game score to the database
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
        const { data, error } = await supabase
            .from('game_scores')
            .insert([
                {
                    user_id: userId,
                    level,
                    score,
                    accuracy,
                    lives_remaining: livesRemaining,
                    total_questions: totalQuestions,
                    correct_answers: correctAnswers,
                    failed_questions: failedQuestions,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error saving game score:', error);
            return null;
        }

        return data as GameScore;
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
            averageScore: Math.round(totalScore / totalGames),
            averageAccuracy: Math.round(totalAccuracy / totalGames),
            bestScore,
            totalCorrectAnswers,
        };
    } catch (error) {
        console.error('Exception calculating user stats:', error);
        return {
            totalGames: 0,
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

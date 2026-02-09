import type { Achievement, GameStats, UserStats, QuestionHistory, GameScore } from '../types';
import { achievements } from './definitions';

/**
 * Achievement Engine - Evaluates which achievements should be unlocked
 */

/**
 * Evaluate all achievements for a completed game
 * Returns newly unlocked achievements
 */
export function evaluateAchievements(
    gameStats: GameStats,
    userStats: UserStats
): Achievement[] {
    return achievements.filter(achievement => {
        // Skip if already unlocked
        if (userStats.achievementsUnlocked.includes(achievement.id)) {
            return false;
        }

        // Evaluate condition
        try {
            return achievement.condition(gameStats, userStats);
        } catch (error) {
            console.error(`Error evaluating achievement ${achievement.id}:`, error);
            return false;
        }
    });
}

/**
 * Convert game result data to GameStats format
 */
export function createGameStats(
    score: number,
    level: number,
    accuracy: number,
    questions: QuestionHistory[]
): GameStats {
    const correct = questions.filter(q => q.isCorrect).length;
    const total = questions.length;

    // Calculate streak (max consecutive correct answers)
    let maxStreak = 0;
    let currentStreak = 0;

    for (const q of questions) {
        if (q.isCorrect) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }

    // Calculate average time
    const totalTime = questions.reduce((sum, q) => sum + q.timeSpent, 0);
    const avgTime = total > 0 ? totalTime / total : 0;

    return {
        correct,
        total,
        streak: maxStreak,
        avgTime,
        score,
        accuracy,
        level,
        playedAt: new Date(),
        questions,
    };
}

/**
 * Create UserStats from database data
 */
export function createUserStats(
    userId: string,
    gamesHistory: GameScore[],
    achievementsUnlocked: string[],
    daysPlayed: string[]
): UserStats {
    const bestScore = gamesHistory.length > 0
        ? Math.max(...gamesHistory.map(g => g.score))
        : 0;

    // Calculate best streak from all games
    let bestStreak = 0;
    for (const game of gamesHistory) {
        // We don't have streak stored, so we estimate from accuracy
        // This is a simplification - ideally we'd store streak in DB
        const estimatedStreak = Math.floor(game.correct_answers * (game.accuracy / 100));
        bestStreak = Math.max(bestStreak, estimatedStreak);
    }

    return {
        userId,
        bestScore,
        bestStreak,
        totalGames: gamesHistory.length,
        daysPlayed,
        achievementsUnlocked,
        gamesHistory,
    };
}

/**
 * Get progress for achievements that support it
 */
export function getAchievementProgress(
    achievement: Achievement,
    gameStats: GameStats,
    userStats: UserStats
): { current: number; target: number } | null {
    if (!achievement.progress) return null;

    try {
        return achievement.progress(gameStats, userStats);
    } catch (error) {
        console.error(`Error getting progress for achievement ${achievement.id}:`, error);
        return null;
    }
}

/**
 * Get all achievements with their unlock status and progress
 */
export function getAchievementsWithStatus(userStats: UserStats, currentGame?: GameStats) {
    return achievements.map(achievement => {
        const isUnlocked = userStats.achievementsUnlocked.includes(achievement.id);
        const progress = currentGame
            ? getAchievementProgress(achievement, currentGame, userStats)
            : null;

        return {
            ...achievement,
            isUnlocked,
            progress,
        };
    });
}

/**
 * Add today's date to days played if not already present
 */
export function updateDaysPlayed(daysPlayed: string[]): string[] {
    const today = new Date().toISOString().split('T')[0];

    if (!daysPlayed.includes(today)) {
        return [...daysPlayed, today];
    }

    return daysPlayed;
}

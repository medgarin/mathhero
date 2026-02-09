import type { Achievement, GameStats, UserStats, AchievementCategory } from '../types';

/**
 * All achievement definitions for Math Hero
 * Organized by category: Streaks, Precision, Speed, Score, Persistence, Mastery
 */

export const achievements: Achievement[] = [
    // 🔥 STREAKS - Consecutive correct answers
    {
        id: 'streak_3',
        title: 'Calentando',
        description: '3 respuestas correctas seguidas',
        icon: 'local_fire_department',
        category: 'streak',
        condition: (game) => game.streak >= 3,
    },
    {
        id: 'streak_5',
        title: 'Imparable',
        description: '5 respuestas correctas seguidas',
        icon: 'whatshot',
        category: 'streak',
        condition: (game) => game.streak >= 5,
    },
    {
        id: 'streak_10',
        title: 'Maestro de Rachas',
        description: '10 respuestas correctas seguidas',
        icon: 'bolt',
        category: 'streak',
        condition: (game) => game.streak >= 10,
    },
    {
        id: 'daily_3',
        title: 'Constante',
        description: 'Juega 3 días seguidos',
        icon: 'event_repeat',
        category: 'streak',
        condition: (_, user) => {
            const consecutive = getConsecutiveDays(user.daysPlayed);
            return consecutive >= 3;
        },
        progress: (_, user) => ({
            current: getConsecutiveDays(user.daysPlayed),
            target: 3,
        }),
    },
    {
        id: 'daily_7',
        title: 'Dedicado',
        description: 'Juega 7 días seguidos',
        icon: 'calendar_month',
        category: 'streak',
        condition: (_, user) => {
            const consecutive = getConsecutiveDays(user.daysPlayed);
            return consecutive >= 7;
        },
        progress: (_, user) => ({
            current: getConsecutiveDays(user.daysPlayed),
            target: 7,
        }),
    },
    {
        id: 'daily_30',
        title: 'Leyenda',
        description: 'Juega 30 días seguidos',
        icon: 'emoji_events',
        category: 'streak',
        condition: (_, user) => {
            const consecutive = getConsecutiveDays(user.daysPlayed);
            return consecutive >= 30;
        },
        progress: (_, user) => ({
            current: getConsecutiveDays(user.daysPlayed),
            target: 30,
        }),
    },

    // 🎯 PRECISION - Accuracy achievements
    {
        id: 'perfect',
        title: 'Perfecto',
        description: '100% de aciertos en una ronda',
        icon: 'stars',
        category: 'precision',
        condition: (game) => game.accuracy === 100 && game.total >= 10,
    },
    {
        id: 'accuracy_90',
        title: 'Casi Perfecto',
        description: '90% o más de aciertos',
        icon: 'grade',
        category: 'precision',
        condition: (game) => game.accuracy >= 90 && game.total >= 10,
    },
    {
        id: 'no_mistakes_5',
        title: 'Sin Errores',
        description: '5 rondas perfectas',
        icon: 'verified',
        category: 'precision',
        condition: (_, user) => {
            const perfectGames = user.gamesHistory.filter(g => g.accuracy === 100).length;
            return perfectGames >= 5;
        },
        progress: (_, user) => ({
            current: user.gamesHistory.filter(g => g.accuracy === 100).length,
            target: 5,
        }),
    },

    // ⚡ SPEED - Time-based achievements
    {
        id: 'speed_3s',
        title: 'Rápido',
        description: 'Promedio menor a 3 segundos',
        icon: 'speed',
        category: 'speed',
        condition: (game) => game.avgTime < 3 && game.total >= 10,
    },
    {
        id: 'speed_2s',
        title: 'Relámpago',
        description: 'Promedio menor a 2 segundos',
        icon: 'flash_on',
        category: 'speed',
        condition: (game) => game.avgTime < 2 && game.total >= 10,
    },
    {
        id: 'speed_1s',
        title: 'Flash',
        description: 'Promedio menor a 1 segundo',
        icon: 'electric_bolt',
        category: 'speed',
        condition: (game) => game.avgTime < 1 && game.total >= 10,
    },

    // 🏆 SCORE - Point-based achievements
    {
        id: 'score_500',
        title: 'Principiante',
        description: 'Alcanza 500 puntos',
        icon: 'military_tech',
        category: 'score',
        condition: (game) => game.score >= 100,
    },
    {
        id: 'score_1000',
        title: 'Experto',
        description: 'Alcanza 1000 puntos',
        icon: 'workspace_premium',
        category: 'score',
        condition: (game) => game.score >= 135,
    },
    {
        id: 'score_2000',
        title: 'Maestro',
        description: 'Alcanza 2000 puntos',
        icon: 'diamond',
        category: 'score',
        condition: (game) => game.score >= 150,
    },
    {
        id: 'personal_record',
        title: 'Nuevo Récord',
        description: 'Supera tu mejor puntuación',
        icon: 'trending_up',
        category: 'score',
        condition: (game, user) => game.score > user.bestScore,
    },

    // ❤️ PERSISTENCE - Consistency achievements
    {
        id: 'first_game',
        title: 'Primera Partida',
        description: 'Completa tu primer juego',
        icon: 'celebration',
        category: 'persistence',
        condition: (_, user) => user.totalGames === 1,
    },
    {
        id: 'comeback',
        title: 'Regreso Triunfal',
        description: 'Vuelve después de perder',
        icon: 'restart_alt',
        category: 'persistence',
        condition: (game, user) => {
            if (user.gamesHistory.length < 2) return false;
            const lastGame = user.gamesHistory[0];
            return lastGame.lives_remaining === 0 && game.score > 0;
        },
    },
    {
        id: 'games_10',
        title: 'Practicando',
        description: 'Juega 10 partidas',
        icon: 'sports_esports',
        category: 'persistence',
        condition: (_, user) => user.totalGames >= 10,
        progress: (_, user) => ({
            current: user.totalGames,
            target: 10,
        }),
    },
    {
        id: 'games_50',
        title: 'Dedicación Total',
        description: 'Juega 50 partidas',
        icon: 'emoji_events',
        category: 'persistence',
        condition: (_, user) => user.totalGames >= 50,
        progress: (_, user) => ({
            current: user.totalGames,
            target: 50,
        }),
    },
    {
        id: 'games_100',
        title: 'Centenario',
        description: 'Juega 100 partidas',
        icon: 'military_tech',
        category: 'persistence',
        condition: (_, user) => user.totalGames >= 100,
        progress: (_, user) => ({
            current: user.totalGames,
            target: 100,
        }),
    },

    // 🧠 MASTERY - Table-specific achievements
    {
        id: 'master_5',
        title: 'Maestro del 5',
        description: '10 preguntas del 5 sin fallar',
        icon: 'school',
        category: 'mastery',
        condition: (game) => {
            const table5Questions = game.questions.filter(q => q.a === 5 || q.b === 5);
            return table5Questions.length >= 10 && table5Questions.every(q => q.isCorrect);
        },
    },
    {
        id: 'master_7',
        title: 'Maestro del 7',
        description: '10 preguntas del 7 sin fallar',
        icon: 'psychology',
        category: 'mastery',
        condition: (game) => {
            const table7Questions = game.questions.filter(q => q.a === 7 || q.b === 7);
            return table7Questions.length >= 10 && table7Questions.every(q => q.isCorrect);
        },
    },
    {
        id: 'master_9',
        title: 'Maestro del 9',
        description: '10 preguntas del 9 sin fallar',
        icon: 'auto_awesome',
        category: 'mastery',
        condition: (game) => {
            const table9Questions = game.questions.filter(q => q.a === 9 || q.b === 9);
            return table9Questions.length >= 10 && table9Questions.every(q => q.isCorrect);
        },
    },
    {
        id: 'all_levels',
        title: 'Explorador',
        description: 'Completa todos los niveles',
        icon: 'explore',
        category: 'mastery',
        condition: (_, user) => {
            const levels = new Set(user.gamesHistory.map(g => g.level));
            return levels.size >= 4;
        },
    },
];

/**
 * Helper function to calculate consecutive days played
 */
function getConsecutiveDays(daysPlayed: string[]): number {
    if (daysPlayed.length === 0) return 0;

    // Sort dates in descending order
    const sortedDates = [...daysPlayed].sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    let consecutive = 1;
    const today = new Date().toISOString().split('T')[0];

    // Check if played today or yesterday
    const lastPlayed = sortedDates[0];
    const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(lastPlayed).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 1) return 0; // Streak broken

    // Count consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
        const diff = Math.floor(
            (new Date(sortedDates[i - 1]).getTime() - new Date(sortedDates[i]).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diff === 1) {
            consecutive++;
        } else {
            break;
        }
    }

    return consecutive;
}

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
    return achievements.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return achievements.filter(a => a.category === category);
}

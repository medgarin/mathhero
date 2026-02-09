// Type definitions for EasyMaths application

export interface User {
    id: string;
    name: string;
    avatar: string;
    created_at: string;
}

export interface FailedQuestion {
    question: string; // e.g., "2x3"
    userAnswer: number;
    correctAnswer: number;
}

export interface GameScore {
    id: string;
    user_id: string;
    level: number;
    score: number;
    accuracy: number;
    lives_remaining: number;
    total_questions: number;
    correct_answers: number;
    failed_questions: FailedQuestion[];
    played_at: string;
}

export interface QuestionHistory {
    question: string;
    a: number;
    b: number;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
}

// Achievement System Types

export type AchievementCategory = 'streak' | 'precision' | 'speed' | 'score' | 'persistence' | 'mastery';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Material Symbols icon name
    category: AchievementCategory;
    condition: (game: GameStats, user: UserStats) => boolean;
    progress?: (game: GameStats, user: UserStats) => { current: number; target: number };
}

export interface GameStats {
    correct: number;
    total: number;
    streak: number;
    avgTime: number;
    score: number;
    accuracy: number;
    level: number;
    playedAt: Date;
    questions: QuestionHistory[];
}

export interface UserStats {
    userId: string;
    bestScore: number;
    bestStreak: number;
    totalGames: number;
    daysPlayed: string[]; // ISO date strings
    achievementsUnlocked: string[]; // achievement IDs
    gamesHistory: GameScore[];
}

export interface UnlockedAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    unlocked_at: string;
    progress: number;
}

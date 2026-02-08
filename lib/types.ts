// Type definitions for EasyMaths application

export interface User {
    id: string;
    name: string;
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

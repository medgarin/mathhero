'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, Level, generateQuestion, getTimeLimit, calculatePoints } from '../math-logic';
import type { QuestionHistory } from '../types';

export const useGameState = (level: Level) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isGameOver, setIsGameOver] = useState(false);
    const [failedQuestions, setFailedQuestions] = useState<string[]>([]);
    const [history, setHistory] = useState<QuestionHistory[]>([]);
    const [questionStartTime, setQuestionStartTime] = useState(0);

    const nextQuestion = useCallback(() => {
        if (lives <= 0 || questionIndex >= 10) {
            setIsGameOver(true);
            return;
        }

        const newQuestion = generateQuestion(level, failedQuestions);
        setCurrentQuestion(newQuestion);
        setQuestionIndex(prev => prev + 1);
        const timeLimit = getTimeLimit(level, questionIndex);
        setTimeLeft(timeLimit);
        setQuestionStartTime(timeLimit);
    }, [level, lives, questionIndex, failedQuestions]);

    const handleAnswer = (selected: number) => {
        if (!currentQuestion || isGameOver) return;

        const isCorrect = selected === currentQuestion.correct;
        const points = calculatePoints(isCorrect, timeLeft);
        const timeSpent = questionStartTime - timeLeft;

        // Play sound feedback
        if (typeof window !== 'undefined') {
            // Dynamically import to avoid SSR issues
            import('../audio').then(({ playSuccessSound, playErrorSound }) => {
                if (isCorrect) {
                    playSuccessSound();
                } else {
                    playErrorSound();
                }
            });
        }

        setScore(prev => prev + points);

        // Track detailed history
        const questionHistory: QuestionHistory = {
            question: `${currentQuestion.a}x${currentQuestion.b}`,
            a: currentQuestion.a,
            b: currentQuestion.b,
            userAnswer: selected,
            correctAnswer: currentQuestion.correct,
            isCorrect,
            timeSpent
        };

        setHistory(prev => [...prev, questionHistory]);

        if (!isCorrect) {
            setLives(prev => prev - 1);
            setFailedQuestions(prev => [...prev, `${currentQuestion.a}x${currentQuestion.b}`]);
        }

        if (lives - (isCorrect ? 0 : 1) <= 0) {
            setIsGameOver(true);
        } else {
            nextQuestion();
        }
    };

    useEffect(() => {
        nextQuestion();
    }, [level]); // Initialize on level change

    useEffect(() => {
        if (isGameOver || !currentQuestion) return;

        if (timeLeft <= 0) {
            handleAnswer(-1); // Auto-fail if time runs out
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isGameOver, currentQuestion]);

    return {
        currentQuestion,
        questionIndex,
        score,
        lives,
        timeLeft,
        isGameOver,
        handleAnswer,
        history
    };
};

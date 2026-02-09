'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState, useRef } from 'react';
import {
    saveGameScore,
    getUserIdFromLocalStorage,
    getUserGameScores,
    getUserAchievements,
    getUserWithStats,
    saveAchievements,
    updateUserDaysPlayed,
    updateUserBestStreak
} from '../../lib/supabase';
import type { QuestionHistory, FailedQuestion } from '../../lib/types';
import { evaluateAchievements, createGameStats, createUserStats, updateDaysPlayed } from '../../lib/achievements/engine';
import AchievementToast from '../../components/AchievementToast';

function ResultsContent() {
    const searchParams = useSearchParams();
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);
    const [newAchievements, setNewAchievements] = useState<string[]>([]);
    const [showAchievementToast, setShowAchievementToast] = useState(false);
    const hasSaved = useRef(false); // Track if we've already saved

    const score = Number(searchParams.get('score') || '0');
    const level = Number(searchParams.get('level') || '1');
    const livesString = searchParams.get('lives') || '3';
    const lives = Number(livesString);
    const historyString = searchParams.get('history') || '[]';
    const history = JSON.parse(historyString) as QuestionHistory[];

    const totalQuestions = history.length;
    const correctAnswers = history.filter(h => h.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Star logic: 3 stars if high accuracy and lives left, 2 if medium, 1 if survived
    let stars = 0;
    if (accuracy >= 90 && lives === 3) stars = 3;
    else if (accuracy >= 70 && lives > 0) stars = 2;
    else if (lives > 0) stars = 1;

    // Save game score and evaluate achievements
    useEffect(() => {
        const saveScore = async () => {
            // Check if already saved using ref
            if (hasSaved.current || isSaving || savedSuccessfully) return;

            // Mark as saved immediately to prevent race conditions
            hasSaved.current = true;

            const userId = getUserIdFromLocalStorage();
            if (!userId) {
                console.error('No user ID found');
                return;
            }

            setIsSaving(true);

            // Extract failed questions
            const failedQuestions: FailedQuestion[] = history
                .filter(h => !h.isCorrect)
                .map(h => ({
                    question: h.question,
                    userAnswer: h.userAnswer,
                    correctAnswer: h.correctAnswer
                }));

            // Save game score
            const result = await saveGameScore(
                userId,
                level,
                score,
                accuracy,
                lives,
                totalQuestions,
                correctAnswers,
                failedQuestions
            );

            if (result) {
                setSavedSuccessfully(true);

                // Evaluate achievements
                try {
                    // Get user data for achievement evaluation
                    const [gamesHistory, achievementsUnlocked, userWithStats] = await Promise.all([
                        getUserGameScores(userId),
                        getUserAchievements(userId),
                        getUserWithStats(userId)
                    ]);

                    // Create game stats
                    const gameStats = createGameStats(score, level, accuracy, history);

                    // Update days played
                    const daysPlayed = userWithStats?.days_played || [];
                    const updatedDaysPlayed = updateDaysPlayed(daysPlayed);
                    if (updatedDaysPlayed.length > daysPlayed.length) {
                        await updateUserDaysPlayed(userId, updatedDaysPlayed);
                    }

                    // Update best streak
                    await updateUserBestStreak(userId, gameStats.streak);

                    // Create user stats
                    const userStats = createUserStats(
                        userId,
                        gamesHistory,
                        achievementsUnlocked,
                        updatedDaysPlayed
                    );

                    // Evaluate achievements
                    const unlockedAchievements = evaluateAchievements(gameStats, userStats);

                    if (unlockedAchievements.length > 0) {
                        const achievementIds = unlockedAchievements.map(a => a.id);

                        // Save achievements to database
                        await saveAchievements(userId, achievementIds);

                        // Show toast
                        setNewAchievements(achievementIds);
                        setShowAchievementToast(true);
                    }
                } catch (error) {
                    console.error('Error evaluating achievements:', error);
                }
            } else {
                console.error('Failed to save game score');
                hasSaved.current = false; // Reset on error to allow retry
            }

            setIsSaving(false);
        };

        saveScore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    return (
        <>
            {/* Achievement Toast */}
            {showAchievementToast && newAchievements.length > 0 && (
                <AchievementToast
                    achievementIds={newAchievements}
                    onClose={() => setShowAchievementToast(false)}
                />
            )}

            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-custom-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-12 text-center">
                    <header className="mb-8">
                        <div className="flex justify-center gap-4 mb-6">
                            {[...Array(3)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`material-symbols-outlined text-6xl ${i < stars ? 'text-yellow-400 fill-1' : 'text-zinc-200 dark:text-zinc-800'}`}
                                    style={{ fontVariationSettings: i < stars ? "'FILL' 1" : "" }}
                                >
                                    star
                                </span>
                            ))}
                        </div>
                        <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">
                            {lives > 0 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm">Resumen de la ronda</p>
                        {savedSuccessfully && (
                            <p className="mt-2 text-primary text-sm font-bold flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Puntuación guardada
                            </p>
                        )}
                    </header>

                    <div className="grid grid-cols-3 gap-4 mb-12">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-custom-lg">
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Puntaje</span>
                            <span className="text-3xl font-black text-zinc-900 dark:text-white">{score}</span>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-custom-lg">
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Precisión</span>
                            <span className="text-3xl font-black text-zinc-900 dark:text-white">{accuracy}%</span>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-custom-lg">
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Vidas</span>
                            <span className="text-3xl font-black text-red-500 flex items-center justify-center gap-1">
                                {lives} <span className="material-symbols-outlined text-sm">favorite</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`/game?level=${level}`}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background-dark font-black rounded-custom-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-lg"
                        >
                            <span className="material-symbols-outlined font-bold">refresh</span>
                            Reintentar
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black rounded-custom-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-lg"
                        >
                            <span className="material-symbols-outlined font-bold">home</span>
                            Menú Principal
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Calculando resultados...</div>}>
            <ResultsContent />
        </Suspense>
    );
}

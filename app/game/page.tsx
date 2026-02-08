'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useGameState } from '../../lib/hooks/useGameState';
import { Level, getTimeLimit } from '../../lib/math-logic';
import GameHeader from '../../components/GameHeader';
import QuestionCard from '../../components/QuestionCard';
import AnswerButtons from '../../components/AnswerButtons';
import { useEffect, Suspense } from 'react';

function GameContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const level = Number(searchParams.get('level') || '1') as Level;

    const {
        currentQuestion,
        questionIndex,
        score,
        lives,
        timeLeft,
        isGameOver,
        handleAnswer,
        history
    } = useGameState(level);

    useEffect(() => {
        if (isGameOver) {
            const timeout = setTimeout(() => {
                const query = new URLSearchParams({
                    score: score.toString(),
                    level: level.toString(),
                    lives: lives.toString(),
                    history: JSON.stringify(history)
                }).toString();
                router.push(`/results?${query}`);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [isGameOver, score, level, lives, history, router]);

    if (!currentQuestion) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <GameHeader
                lives={lives}
                score={score}
                questionIndex={questionIndex}
                totalQuestions={10}
            />

            <main className="flex-grow flex flex-col items-center justify-center p-6 gap-12">
                <QuestionCard
                    a={currentQuestion.a}
                    b={currentQuestion.b}
                    timeLeft={timeLeft}
                    totalTime={getTimeLimit(level, questionIndex)}
                />

                <AnswerButtons
                    options={currentQuestion.options}
                    onAnswer={handleAnswer}
                />
            </main>

            {/* Footer Stats (Mini) */}
            <footer className="w-full bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 py-4 px-6">
                <div className="max-w-5xl mx-auto flex justify-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
                    Pregunta {questionIndex} de 10
                </div>
            </footer>
        </div>
    );
}

export default function GamePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando desafío...</div>}>
            <GameContent />
        </Suspense>
    );
}

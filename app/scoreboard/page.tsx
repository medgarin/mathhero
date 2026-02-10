'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserIdFromLocalStorage, getUser, getUserGameScores, getUserStats } from '../../lib/supabase';
import type { User, GameScore } from '../../lib/types';

export default function ScoreboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [gameScores, setGameScores] = useState<GameScore[]>([]);
    const [stats, setStats] = useState({
        totalGames: 0,
        averageScore: 0,
        averageAccuracy: 0,
        bestScore: 0,
        totalScore: 0,
        totalCorrectAnswers: 0,
    });
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const levelNames = ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6'];
    const levelColors = ['bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

    useEffect(() => {
        const loadData = async () => {
            const userId = getUserIdFromLocalStorage();

            if (!userId) {
                router.push('/welcome');
                return;
            }

            const userData = await getUser(userId);
            if (!userData) {
                router.push('/welcome');
                return;
            }

            setUser(userData);

            // Load game scores and stats
            const scores = await getUserGameScores(userId);
            setGameScores(scores);

            const userStats = await getUserStats(userId);
            setStats(userStats);

            setIsLoading(false);
        };

        loadData();
    }, [router]);

    const filteredScores = selectedLevel
        ? gameScores.filter(score => score.level === selectedLevel)
        : gameScores;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-primary animate-spin">refresh</span>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-bold">Cargando marcador...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors mb-4 font-bold"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Volver al inicio
                    </Link>
                    <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">
                        Mi Marcador
                    </h1>
                    {user && (
                        <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm">
                            Jugador: {user.name}
                        </p>
                    )}
                </header>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-custom-lg border border-zinc-100 dark:border-zinc-800">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Juegos
                        </span>
                        <span className="text-3xl font-black text-zinc-900 dark:text-white">
                            {stats.totalGames}
                        </span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-custom-lg border border-zinc-100 dark:border-zinc-800">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Mejor
                        </span>
                        <span className="text-3xl font-black text-primary">
                            {stats.bestScore}
                        </span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-custom-lg border border-zinc-100 dark:border-zinc-800">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Total Puntos
                        </span>
                        <span className="text-3xl font-black text-yellow-500">
                            {stats.totalScore}
                        </span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-custom-lg border border-zinc-100 dark:border-zinc-800">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Promedio
                        </span>
                        <span className="text-3xl font-black text-zinc-900 dark:text-white">
                            {stats.averageScore}
                        </span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-custom-lg border border-zinc-100 dark:border-zinc-800">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Precisión
                        </span>
                        <span className="text-3xl font-black text-zinc-900 dark:text-white">
                            {stats.averageAccuracy}%
                        </span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-custom-lg border border-zinc-100 dark:border-zinc-800">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Correctas
                        </span>
                        <span className="text-3xl font-black text-green-500">
                            {stats.totalCorrectAnswers}
                        </span>
                    </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedLevel(null)}
                        className={`px-4 py-2 rounded-custom-lg font-black text-sm transition-all ${selectedLevel === null
                            ? 'bg-primary text-background-dark'
                            : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                            }`}
                    >
                        Todos los niveles
                    </button>
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-4 py-2 rounded-custom-lg font-black text-sm transition-all ${selectedLevel === level
                                ? 'bg-primary text-background-dark'
                                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                                }`}
                        >
                            Nivel {level}
                        </button>
                    ))}
                </div>

                {/* Game History */}
                <div className="bg-white dark:bg-zinc-900 rounded-custom-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                            Historial de Juegos
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-widest">
                            {filteredScores.length} {filteredScores.length === 1 ? 'juego' : 'juegos'}
                        </p>
                    </div>

                    {filteredScores.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700 mb-4">
                                sports_esports
                            </span>
                            <p className="text-zinc-500 dark:text-zinc-400 font-bold">
                                {selectedLevel ? 'No hay juegos en este nivel' : 'Aún no has jugado ningún juego'}
                            </p>
                            <Link
                                href={selectedLevel ? `/game?level=${selectedLevel}` : "/"}
                                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-background-dark font-black rounded-custom-lg hover:scale-105 transition-all"
                            >
                                <span className="material-symbols-outlined">play_arrow</span>
                                {selectedLevel ? `¡Jugar Nivel ${selectedLevel}!` : '¡Jugar ahora!'}
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredScores.map((score) => (
                                <div
                                    key={score.id}
                                    className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`${levelColors[score.level - 1]} p-3 rounded-custom text-white`}>
                                                <span className="material-symbols-outlined text-2xl">
                                                    {score.level === 1 ? 'looks_one' :
                                                        score.level === 2 ? 'looks_two' :
                                                            score.level === 3 ? 'looks_3' :
                                                                score.level === 4 ? 'star_half' :
                                                                    score.level === 5 ? 'star' : 'timer'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-1">
                                                    {levelNames[score.level - 1]}
                                                </h3>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold">
                                                    {formatDate(score.played_at)}
                                                </p>
                                                {score.failed_questions.length > 0 && (
                                                    <details className="mt-3">
                                                        <summary className="text-xs font-bold text-red-500 cursor-pointer hover:text-red-600">
                                                            {score.failed_questions.length} {score.failed_questions.length === 1 ? 'pregunta fallada' : 'preguntas falladas'}
                                                        </summary>
                                                        <div className="mt-2 space-y-1">
                                                            {score.failed_questions.map((failed, idx) => (
                                                                <div key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                                                                    <span className="font-bold">{failed.question}</span> = {failed.correctAnswer}
                                                                    <span className="text-red-500 ml-2">({failed.userAnswer === -1 ? "No respondiste" : "respondiste: " + failed.userAnswer})</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-primary mb-1">
                                                {score.score} <span className="text-lg">puntos</span>
                                            </div>
                                            <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                                                {score.accuracy}% precisión
                                            </div>
                                            <div className="text-xs font-bold text-zinc-400 flex items-center justify-end gap-1 mt-1">
                                                <span className="material-symbols-outlined text-sm text-red-500">favorite</span>
                                                {score.lives_remaining}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

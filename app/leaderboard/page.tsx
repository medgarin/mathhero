'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLeaderboard } from '../../lib/supabase';
import type { LeaderboardEntry } from '../../lib/types';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const levelNames = ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6'];

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            const data = await getLeaderboard(selectedLevel || undefined);
            setLeaderboard(data);
            setIsLoading(false);
        };

        fetchLeaderboard();
    }, [selectedLevel]);

    if (isLoading && leaderboard.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-primary animate-spin">refresh</span>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-bold">Cargando clasificación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors mb-4 font-bold"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Volver al inicio
                    </Link>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-primary/20 p-3 rounded-custom shadow-lg shadow-primary/10">
                            <span className="material-symbols-outlined text-4xl text-primary">leaderboard</span>
                        </div>
                        <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                            Clasificación
                        </h1>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm ml-1">
                        Mira cómo van tus amigos
                    </p>
                </header>

                {/* Level Filter */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedLevel(null)}
                        className={`px-6 py-3 rounded-custom-lg font-black text-sm transition-all shadow-sm ${selectedLevel === null
                            ? 'bg-primary text-background-dark scale-105'
                            : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                            }`}
                    >
                        General
                    </button>
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-4 py-3 rounded-custom-lg font-black text-sm transition-all shadow-sm ${selectedLevel === level
                                ? 'bg-primary text-background-dark scale-105'
                                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                                }`}
                        >
                            {levelNames[level - 1]}
                        </button>
                    ))}
                </div>

                {/* Leaderboard List */}
                <div className="bg-white dark:bg-zinc-900 rounded-custom-xl border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 font-black text-[10px] text-zinc-400 uppercase tracking-[0.2em]">
                        <div className="col-span-1 text-center">Rango</div>
                        <div className="col-span-6 sm:col-span-5">Jugador</div>
                        <div className="col-span-2 text-center hidden sm:block">Partidas</div>
                        <div className="col-span-2 text-center">Mejor</div>
                        <div className="col-span-2 text-end pr-2">Total</div>
                    </div>

                    {leaderboard.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700 mb-4">
                                group
                            </span>
                            <p className="text-zinc-500 dark:text-zinc-400 font-bold">
                                Aún no hay registros en esta categoría
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {leaderboard.map((entry, index) => (
                                <div
                                    key={entry.user_id}
                                    className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors ${index < 3 ? 'bg-primary/5 dark:bg-primary/5' : ''}`}
                                >
                                    <div className="col-span-1 flex justify-center">
                                        {index === 0 ? (
                                            <span className="text-2xl">🥇</span>
                                        ) : index === 1 ? (
                                            <span className="text-2xl">🥈</span>
                                        ) : index === 2 ? (
                                            <span className="text-2xl">🥉</span>
                                        ) : (
                                            <span className="font-black text-zinc-400">#{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="col-span-6 sm:col-span-5 flex items-center gap-4">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-custom overflow-hidden border-2 ${index < 3 ? 'border-primary' : 'border-zinc-200 dark:border-zinc-700'}`}>
                                                <Image
                                                    src={`/avatars/${entry.avatar}.png`}
                                                    alt={entry.name}
                                                    width={48}
                                                    height={48}
                                                    className="bg-zinc-100 dark:bg-zinc-800"
                                                />
                                            </div>
                                            {index < 3 && (
                                                <div className="absolute -top-2 -right-2 bg-primary text-background-dark text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-900">
                                                    {index + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-zinc-900 dark:text-white truncate max-w-[100px] sm:max-w-none">
                                                {entry.name}
                                            </h3>
                                            <span className="sm:hidden text-[10px] font-bold text-zinc-400 uppercase">
                                                {entry.total_games} partidas
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center font-bold text-zinc-500 dark:text-zinc-400 hidden sm:block">
                                        {entry.total_games}
                                    </div>
                                    <div className="col-span-2 text-center font-bold text-zinc-700 dark:text-zinc-300">
                                        {entry.best_score}
                                    </div>
                                    <div className="col-span-2 text-end pr-2">
                                        <span className="text-xl font-black text-primary">
                                            {entry.total_score}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-custom-lg border-l-4 border-primary">
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <div>
                            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                El puntaje total es la suma de todos tus puntos conseguidos.
                                ¡Sigue practicando para subir en la tabla!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

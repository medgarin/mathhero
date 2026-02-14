'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserId, getUserAchievements, getUserGameScores, getUserWithStats } from '../../lib/supabase';
import { achievements } from '../../lib/achievements/definitions';
import { createUserStats } from '../../lib/achievements/engine';
import type { AchievementCategory } from '../../lib/types';

const categoryInfo: Record<AchievementCategory, { name: string; icon: string; color: string }> = {
    streak: { name: 'Rachas', icon: 'local_fire_department', color: 'bg-orange-500' },
    precision: { name: 'Precisión', icon: 'target', color: 'bg-blue-500' },
    speed: { name: 'Velocidad', icon: 'speed', color: 'bg-purple-500' },
    score: { name: 'Puntaje', icon: 'emoji_events', color: 'bg-yellow-500' },
    persistence: { name: 'Persistencia', icon: 'favorite', color: 'bg-pink-500' },
    mastery: { name: 'Maestría', icon: 'school', color: 'bg-green-500' },
};

export default function AchievementsPage() {
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
    const router = useRouter();

    useEffect(() => {
        const loadAchievements = async () => {
            const userId = await getUserId();
            if (!userId) {
                router.push('/welcome');
                return;
            }

            const unlocked = await getUserAchievements(userId);
            setUnlockedIds(unlocked);
            setIsLoading(false);
        };

        loadAchievements();
    }, [router]);

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory);

    const unlockedCount = unlockedIds.length;
    const totalCount = achievements.length;
    const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-primary animate-spin">refresh</span>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-bold">Cargando logros...</p>
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
                        className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary font-bold mb-4 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Volver al inicio
                    </Link>

                    <div className="bg-white dark:bg-zinc-900 rounded-custom-xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-400 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-white">emoji_events</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
                                    Mis Logros
                                </h1>
                                <p className="text-zinc-500 dark:text-zinc-400 font-bold">
                                    {unlockedCount} de {totalCount} desbloqueados
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-yellow-400 transition-all duration-500 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <p className="text-right text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-2">
                            {progressPercentage}% completado
                        </p>
                    </div>
                </header>

                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-custom-lg font-bold transition-all ${selectedCategory === 'all'
                            ? 'bg-primary text-background-dark'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                    >
                        Todos
                    </button>
                    {Object.entries(categoryInfo).map(([key, info]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key as AchievementCategory)}
                            className={`px-4 py-2 rounded-custom-lg font-bold transition-all flex items-center gap-2 ${selectedCategory === key
                                ? `${info.color} text-white`
                                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{info.icon}</span>
                            {info.name}
                        </button>
                    ))}
                </div>

                {/* Achievements grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAchievements.map(achievement => {
                        const isUnlocked = unlockedIds.includes(achievement.id);
                        const categoryData = categoryInfo[achievement.category];

                        return (
                            <div
                                key={achievement.id}
                                className={`bg-white dark:bg-zinc-900 rounded-custom-lg border-2 p-6 transition-all ${isUnlocked
                                    ? 'border-primary shadow-lg shadow-primary/20 hover:scale-105'
                                    : 'border-zinc-200 dark:border-zinc-800 opacity-60'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isUnlocked
                                    ? `${categoryData.color} shadow-lg`
                                    : 'bg-zinc-100 dark:bg-zinc-800'
                                    }`}>
                                    <span className={`material-symbols-outlined text-3xl ${isUnlocked ? 'text-white' : 'text-zinc-400'
                                        }`}>
                                        {achievement.icon}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className={`text-xl font-black mb-2 ${isUnlocked
                                    ? 'text-zinc-900 dark:text-white'
                                    : 'text-zinc-400 dark:text-zinc-600'
                                    }`}>
                                    {achievement.title}
                                </h3>
                                <p className={`text-sm font-medium mb-3 ${isUnlocked
                                    ? 'text-zinc-600 dark:text-zinc-400'
                                    : 'text-zinc-400 dark:text-zinc-600'
                                    }`}>
                                    {achievement.description}
                                </p>

                                {/* Status badge */}
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${isUnlocked
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm">
                                        {isUnlocked ? 'check_circle' : 'lock'}
                                    </span>
                                    {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {filteredAchievements.length === 0 && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700 mb-4">
                            emoji_events
                        </span>
                        <p className="text-zinc-500 dark:text-zinc-400 font-bold">
                            No hay logros en esta categoría
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import Link from "next/link";

type GameHeaderProps = {
    lives: number;
    score: number;
    questionIndex: number;
    totalQuestions: number;
};

export default function GameHeader({ lives, score, questionIndex, totalQuestions }: GameHeaderProps) {
    const progress = (questionIndex / totalQuestions) * 100;

    return (
        <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Link href="/">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-200 p-2 rounded-lg text-background-dark">
                            <span className="material-symbols-outlined block text-2xl font-bold">calculate</span>
                        </div>
                        <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight hidden sm:block">Math Hero</h1>
                    </div>
                </Link>

                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-100 dark:border-zinc-700">
                    {[...Array(3)].map((_, i) => (
                        <span
                            key={i}
                            className={`material-symbols-outlined ${i < lives ? 'text-red-500 fill-1' : 'text-zinc-300 dark:text-zinc-600'}`}
                            style={{ fontVariationSettings: i < lives ? "'FILL' 1" : "" }}
                        >
                            favorite
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-primary/20 dark:bg-primary/10 px-5 py-2 rounded-full border border-primary/30">
                        <span className="text-zinc-800 dark:text-primary font-bold text-xs tracking-wide uppercase">Score: <span className="text-sm">{score.toLocaleString()}</span></span>
                    </div>
                </div>
            </div>

            {/* Progress Bar overlay at bottom of header */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </header>
    );
}

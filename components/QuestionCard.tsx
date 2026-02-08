'use client';

type QuestionCardProps = {
    a: number;
    b: number;
    timeLeft: number;
    totalTime: number;
};

export default function QuestionCard({ a, b, timeLeft, totalTime }: QuestionCardProps) {
    const timePercentage = (timeLeft / totalTime) * 100;

    return (
        <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-custom-xl shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 p-12 flex flex-col items-center text-center">
            {/* Timer Indicator */}
            <div className={`absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${timeLeft <= 3
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 animate-pulse'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400'
                }`}>
                <span className="material-symbols-outlined text-xl">timer</span>
                <span className="font-bold tabular-nums">{timeLeft.toString().padStart(2, '0')}s</span>
            </div>

            <div className="space-y-4">
                <p className="text-zinc-400 dark:text-zinc-500 font-medium text-lg uppercase tracking-[0.2em]">Calcula el resultado</p>
                <h2 className="text-8xl font-black text-zinc-900 dark:text-white tracking-tighter">
                    {a} <span className="text-primary">×</span> {b} = ?
                </h2>
            </div>

            {/* Visual Timer Bar */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-zinc-50 dark:bg-zinc-800/50 overflow-hidden rounded-b-custom-xl">
                <div
                    className={`h-full transition-all duration-1000 linear ${timeLeft <= 3 ? 'bg-red-500' : 'bg-yellow-400'
                        }`}
                    style={{ width: `${timePercentage}%` }}
                />
            </div>
        </div>
    );
}

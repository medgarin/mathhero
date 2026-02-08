'use client';

import { playClickSound } from '../lib/audio';

type AnswerButtonsProps = {
    options: number[];
    onAnswer: (value: number) => void;
};

export default function AnswerButtons({ options, onAnswer }: AnswerButtonsProps) {
    const colors = [
        'hover:bg-blue-500 dark:hover:bg-blue-600 hover:border-blue-700',
        'hover:bg-primary dark:hover:bg-primary/80 hover:border-primary/60 text-zinc-900',
        'hover:bg-purple-500 dark:hover:bg-purple-600 hover:border-purple-700',
        'hover:bg-orange-500 dark:hover:bg-orange-600 hover:border-orange-700',
    ];

    const labels = ['A', 'B', 'C', 'D'];

    const handleClick = (option: number) => {
        playClickSound();
        onAnswer(option);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(option)}
                    className={`group relative bg-white dark:bg-zinc-900 border-b-4 border-zinc-200 dark:border-zinc-800 transition-all duration-200 p-8 rounded-custom-lg flex flex-col items-center gap-2 active:translate-y-1 active:border-b-0 ${colors[index % colors.length]}`}
                >
                    <span className="text-4xl font-black text-zinc-800 dark:text-white group-hover:text-white transition-colors">
                        {option}
                    </span>
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:bg-white/20 group-hover:text-white">
                        {labels[index]}
                    </div>
                </button>
            ))}
        </div>
    );
}

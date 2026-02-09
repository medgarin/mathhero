'use client';

import { useEffect, useState } from 'react';
import type { Achievement } from '../lib/types';
import { getAchievementById } from '../lib/achievements/definitions';
import { playSuccessSound } from '../lib/audio';

type AchievementToastProps = {
    achievementIds: string[];
    onClose: () => void;
};

export default function AchievementToast({ achievementIds, onClose }: AchievementToastProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const currentAchievement = achievementIds[currentIndex]
        ? getAchievementById(achievementIds[currentIndex])
        : null;

    useEffect(() => {
        if (!currentAchievement) return;

        // Show toast
        setIsVisible(true);
        playSuccessSound();

        // Hide after 3 seconds
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        // Move to next achievement or close
        const nextTimer = setTimeout(() => {
            if (currentIndex < achievementIds.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                onClose();
            }
        }, 3500);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(nextTimer);
        };
    }, [currentIndex, achievementIds.length, currentAchievement, onClose]);

    if (!currentAchievement) return null;

    return (
        <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
        >
            <div className="bg-gradient-to-r from-primary/90 to-yellow-400/90 backdrop-blur-sm rounded-custom-xl shadow-2xl shadow-primary/50 p-6 flex items-center gap-4 min-w-[320px] border-2 border-white/20">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                    <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg">
                        {currentAchievement.icon}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-white/90 font-bold text-xs uppercase tracking-widest mb-1">
                        ¡Nuevo Logro!
                    </p>
                    <h3 className="text-white font-black text-xl tracking-tight mb-1">
                        {currentAchievement.title}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                        {currentAchievement.description}
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <span className="material-symbols-outlined text-white text-xl">close</span>
                </button>
            </div>

            {/* Progress indicator if multiple achievements */}
            {achievementIds.length > 1 && (
                <div className="flex justify-center gap-1 mt-2">
                    {achievementIds.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full transition-all ${index === currentIndex
                                    ? 'w-6 bg-white'
                                    : index < currentIndex
                                        ? 'w-2 bg-white/50'
                                        : 'w-2 bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

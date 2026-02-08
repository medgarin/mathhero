'use client';

import { useState, useEffect } from 'react';
import { toggleSound, isSoundEnabled } from '../lib/audio';

export default function SoundToggle() {
    const [enabled, setEnabled] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setEnabled(isSoundEnabled());
    }, []);

    const handleToggle = () => {
        const newState = toggleSound();
        setEnabled(newState);
    };

    if (!mounted) return null;

    return (
        <button
            onClick={handleToggle}
            className="fixed bottom-6 right-6 z-50 p-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
            title={enabled ? 'Desactivar sonidos' : 'Activar sonidos'}
        >
            <span className="material-symbols-outlined text-2xl text-zinc-700 dark:text-zinc-300">
                {enabled ? 'volume_up' : 'volume_off'}
            </span>
        </button>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createUser, saveUserIdToCookies, getUserId } from '../../lib/supabase';
import AvatarSelector from '../../components/AvatarSelector';

export default function WelcomePage() {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('astronaut');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // If user already exists, redirect to home
        const checkExisting = async () => {
            const existingUserId = await getUserId();
            if (existingUserId) {
                router.push('/');
            }
        };
        checkExisting();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Por favor ingresa tu nombre');
            return;
        }

        if (name.trim().length < 2) {
            setError('El nombre debe tener al menos 2 caracteres');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const user = await createUser(name.trim(), selectedAvatar);

            if (user) {
                // Set the secure httpOnly cookie via API
                const sessionRes = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id }),
                });

                if (sessionRes.ok) {
                    router.push('/');
                } else {
                    setError('Hubo un error al iniciar tu sesión. Por favor intenta de nuevo.');
                }
            } else {
                setError('Hubo un error al crear tu perfil. Por favor intenta de nuevo.');
            }
        } catch (err) {
            console.error('Error creating user:', err);
            setError('Hubo un error. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-custom-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-8">
                <header className="mb-6 text-center">
                    <div className="inline-block bg-green-200 rounded-custom-lg text-background-dark mb-4 shadow-xl shadow-primary/20">
                        <Image src="/logo.png" alt="Logo" width={120} height={120} />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">
                        ¡Bienvenido a Math Hero!
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">
                        Crea tu perfil
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Selection */}
                    <AvatarSelector
                        selected={selectedAvatar}
                        onSelect={setSelectedAvatar}
                    />

                    {/* Name Input */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-widest"
                        >
                            Tu nombre (Puede ser un alias)
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Escribe tu nombre aquí"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-custom-lg text-zinc-900 dark:text-white font-bold text-lg focus:outline-none focus:border-primary transition-colors"
                            disabled={isLoading}
                            maxLength={50}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-red-500 text-sm font-bold">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !name.trim()}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background-dark font-black rounded-custom-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                Creando perfil...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">rocket_launch</span>
                                ¡Comenzar a jugar!
                            </>
                        )}
                    </button>
                </form>

                <footer className="mt-6 text-center text-zinc-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest">
                    El nombre es solo para identificarlo en el ranking
                </footer>
            </div>
        </div>
    );
}

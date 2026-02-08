'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createUser, saveUserIdToLocalStorage, getUserIdFromLocalStorage } from '../../lib/supabase';

export default function WelcomePage() {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // If user already exists, redirect to home
        const existingUserId = getUserIdFromLocalStorage();
        if (existingUserId) {
            router.push('/');
        }
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
            const user = await createUser(name.trim());

            if (user) {
                saveUserIdToLocalStorage(user.id);
                router.push('/');
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
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-custom-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-12">
                <header className="mb-8 text-center">
                    <div className="inline-block bg-green-200 rounded-custom-lg text-background-dark mb-6 shadow-xl shadow-primary/20">
                        <Image src="/logo.png" alt="Logo" width={150} height={150} />
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">
                        ¡Bienvenido a Math Hero!
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm">
                        ¿Cómo te llamas?
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-widest"
                        >
                            Tu nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Escribe tu nombre aquí"
                            className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-custom-lg text-zinc-900 dark:text-white font-bold text-lg focus:outline-none focus:border-primary transition-colors"
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

                <footer className="mt-8 text-center text-zinc-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest">
                    Solo necesitamos tu nombre para empezar
                </footer>
            </div>
        </div>
    );
}

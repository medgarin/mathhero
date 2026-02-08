'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { getUserIdFromLocalStorage, getUser } from '../lib/supabase';
import type { User } from '../lib/types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const levels = [
    { id: 1, title: "Nivel 1", range: "Tablas 1 - 5", icon: "school", color: "bg-blue-500" },
    { id: 2, title: "Nivel 2", range: "Tablas 6 - 9", icon: "star", color: "bg-purple-500" },
    { id: 3, title: "Nivel 3", range: "Mezclado", icon: "psychology", color: "bg-orange-500" },
    { id: 4, title: "Nivel 4", range: "Contrarreloj", icon: "timer", color: "bg-red-500" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const userId = getUserIdFromLocalStorage();

      if (!userId) {
        router.push('/welcome');
        return;
      }

      // Fetch user data from Supabase
      const userData = await getUser(userId);
      if (userData) {
        setUser(userData);
      } else {
        // User ID exists but user not found in DB, redirect to welcome
        router.push('/welcome');
      }

      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary animate-spin">refresh</span>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-bold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">Math Hero</h1>

        <Image src={`/avatars/${user?.avatar}.png`} alt="Logo" width={100} height={100} className='inline-block bg-green-200 rounded-custom-lg text-background-dark mb-4 shadow-xl shadow-primary/20' />

        {user && (
          <p className="text-primary font-black text-xl mb-2">¡Hola, {user.name}! 👋</p>
        )}
        <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm">Escoge tu desafío</p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {levels.map((level) => (
          <Link
            key={level.id}
            href={`/game?level=${level.id}`}
            className="group relative bg-white dark:bg-zinc-900 border-b-8 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 active:border-b-2 active:translate-y-1 p-8 rounded-custom-lg transition-all"
          >
            <div className="flex items-center gap-6">
              <div className={`${level.color} p-4 rounded-custom text-white`}>
                <span className="material-symbols-outlined text-4xl">{level.icon}</span>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{level.title}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase text-xs tracking-widest">{level.range}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-zinc-300">arrow_forward</span>
            </div>
          </Link>
        ))}
      </main>

      {/* Scoreboard Link */}
      <div className="mt-8">
        <Link
          href="/scoreboard"
          className="flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black rounded-custom-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
        >
          <span className="material-symbols-outlined">leaderboard</span>
          Ver mi marcador
        </Link>
      </div>

      <footer className="mt-16 text-zinc-400 dark:text-zinc-600 font-bold text-sm uppercase tracking-widest">
        Hecho con ❤️ para aprender jugando
      </footer>
    </div>
  );
}

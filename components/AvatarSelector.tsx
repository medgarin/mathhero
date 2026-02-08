'use client';

import Image from 'next/image';

const AVATARS = [
    { id: 'astronaut', name: 'Astronauta', image: '/avatars/astronaut.png' },
    { id: 'dama', name: 'Dama', image: '/avatars/dama.png' },
    { id: 'detective', name: 'Detective', image: '/avatars/detective.png' },
    { id: 'france', name: 'Francia', image: '/avatars/france.png' },
    { id: 'layer', name: 'Capa', image: '/avatars/layer.png' },
    { id: 'witch', name: 'Bruja', image: '/avatars/witch.png' },
];

type AvatarSelectorProps = {
    selected: string;
    onSelect: (avatarId: string) => void;
};

export default function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-widest text-center">
                Elige tu avatar
            </label>
            <div className="grid grid-cols-3 gap-3">
                {AVATARS.map((avatar) => (
                    <button
                        key={avatar.id}
                        type="button"
                        onClick={() => onSelect(avatar.id)}
                        className={`relative aspect-square rounded-custom-lg overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${selected === avatar.id
                                ? 'border-primary shadow-lg shadow-primary/30'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                            }`}
                    >
                        <Image
                            src={avatar.image}
                            alt={avatar.name}
                            fill
                            className="object-cover"
                        />
                        {selected === avatar.id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-primary drop-shadow-lg">
                                    check_circle
                                </span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export { AVATARS };

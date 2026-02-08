// Audio utility for game sounds
// Uses Web Audio API for better performance and control

class AudioManager {
    private context: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    private enabled: boolean = true;

    constructor() {
        if (typeof window !== 'undefined') {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    // Generate success sound (pleasant chime)
    private generateSuccessSound(): AudioBuffer {
        if (!this.context) throw new Error('AudioContext not available');

        const sampleRate = this.context.sampleRate;
        const duration = 0.3;
        const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a pleasant chime with multiple harmonics
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            // Main tone (C major chord: C5, E5, G5)
            const c5 = Math.sin(2 * Math.PI * 523.25 * t); // C5
            const e5 = Math.sin(2 * Math.PI * 659.25 * t); // E5
            const g5 = Math.sin(2 * Math.PI * 783.99 * t); // G5

            // Envelope (fade out)
            const envelope = Math.exp(-3 * t);

            data[i] = (c5 + e5 * 0.7 + g5 * 0.5) * envelope * 0.3;
        }

        return buffer;
    }

    // Generate error sound (gentle negative feedback)
    private generateErrorSound(): AudioBuffer {
        if (!this.context) throw new Error('AudioContext not available');

        const sampleRate = this.context.sampleRate;
        const duration = 0.4;
        const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a descending tone (not too harsh)
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            // Descending frequency from 300Hz to 150Hz
            const freq = 300 - (150 * t / duration);
            const tone = Math.sin(2 * Math.PI * freq * t);

            // Envelope
            const envelope = Math.exp(-2 * t);

            data[i] = tone * envelope * 0.2;
        }

        return buffer;
    }

    // Generate click sound for button presses
    private generateClickSound(): AudioBuffer {
        if (!this.context) throw new Error('AudioContext not available');

        const sampleRate = this.context.sampleRate;
        const duration = 0.05;
        const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const tone = Math.sin(2 * Math.PI * 800 * t);
            const envelope = Math.exp(-50 * t);
            data[i] = tone * envelope * 0.1;
        }

        return buffer;
    }

    // Initialize sounds
    init() {
        if (!this.context) return;

        try {
            this.sounds.set('success', this.generateSuccessSound());
            this.sounds.set('error', this.generateErrorSound());
            this.sounds.set('click', this.generateClickSound());
        } catch (error) {
            console.error('Error initializing sounds:', error);
        }
    }

    // Play a sound
    play(soundName: 'success' | 'error' | 'click', volume: number = 1.0) {
        if (!this.enabled || !this.context) return;

        const buffer = this.sounds.get(soundName);
        if (!buffer) {
            console.warn(`Sound "${soundName}" not found`);
            return;
        }

        try {
            const source = this.context.createBufferSource();
            const gainNode = this.context.createGain();

            source.buffer = buffer;
            gainNode.gain.value = Math.max(0, Math.min(1, volume));

            source.connect(gainNode);
            gainNode.connect(this.context.destination);

            source.start(0);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Set enabled state
    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    // Check if sounds are enabled
    isEnabled() {
        return this.enabled;
    }
}

// Create singleton instance
let audioManager: AudioManager | null = null;

export function getAudioManager(): AudioManager {
    if (!audioManager) {
        audioManager = new AudioManager();
        audioManager.init();
    }
    return audioManager;
}

// Convenience functions
export function playSuccessSound() {
    getAudioManager().play('success');
}

export function playErrorSound() {
    getAudioManager().play('error');
}

export function playClickSound() {
    getAudioManager().play('click', 0.5);
}

export function toggleSound(): boolean {
    return getAudioManager().toggle();
}

export function setSoundEnabled(enabled: boolean) {
    getAudioManager().setEnabled(enabled);
}

export function isSoundEnabled(): boolean {
    return getAudioManager().isEnabled();
}

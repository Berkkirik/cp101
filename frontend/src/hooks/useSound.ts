/**
 * useSound Hook - Sound effect management with Web Audio API
 *
 * Generates playful sound effects for game interactions
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type SoundType = 'hover' | 'click' | 'battle' | 'win' | 'lose' | 'draw' | 'stat';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

// Sound configurations for different game events
const SOUND_CONFIGS: Record<SoundType, SoundConfig | SoundConfig[]> = {
  hover: {
    frequency: 800,
    duration: 0.05,
    type: 'sine',
    volume: 0.1,
  },
  click: [
    { frequency: 400, duration: 0.05, type: 'square', volume: 0.15 },
    { frequency: 600, duration: 0.08, type: 'sine', volume: 0.12 },
  ],
  battle: [
    { frequency: 200, duration: 0.1, type: 'sawtooth', volume: 0.2 },
    { frequency: 150, duration: 0.15, type: 'square', volume: 0.15 },
    { frequency: 100, duration: 0.2, type: 'triangle', volume: 0.1 },
  ],
  win: [
    { frequency: 523, duration: 0.15, type: 'sine', volume: 0.15 }, // C
    { frequency: 659, duration: 0.15, type: 'sine', volume: 0.15 }, // E
    { frequency: 784, duration: 0.3, type: 'sine', volume: 0.2 }, // G
  ],
  lose: [
    { frequency: 392, duration: 0.2, type: 'triangle', volume: 0.15 }, // G
    { frequency: 349, duration: 0.2, type: 'triangle', volume: 0.15 }, // F
    { frequency: 294, duration: 0.4, type: 'triangle', volume: 0.2 }, // D
  ],
  draw: [
    { frequency: 440, duration: 0.15, type: 'sine', volume: 0.12 }, // A
    { frequency: 440, duration: 0.15, type: 'sine', volume: 0.12 }, // A
    { frequency: 440, duration: 0.2, type: 'sine', volume: 0.15 }, // A
  ],
  stat: {
    frequency: 1000,
    duration: 0.08,
    type: 'sine',
    volume: 0.08,
  },
};

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    // Create AudioContext on user interaction to comply with browser policies
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
    };

    // Initialize on first user interaction
    document.addEventListener('click', initAudio, { once: true });

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback(
    (soundType: SoundType, delay = 0) => {
      if (isMuted || !audioContextRef.current) return;

      const configs = Array.isArray(SOUND_CONFIGS[soundType])
        ? (SOUND_CONFIGS[soundType] as SoundConfig[])
        : [SOUND_CONFIGS[soundType] as SoundConfig];

      const context = audioContextRef.current;
      const currentTime = context.currentTime + delay;

      configs.forEach((config, index) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, currentTime);

        // Create envelope for smoother sound
        const volume = config.volume || 0.1;
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume,
          currentTime + config.duration * 0.1
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          currentTime + config.duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        const noteDelay = index * 0.15; // Sequential delay for multi-note sounds
        oscillator.start(currentTime + noteDelay);
        oscillator.stop(currentTime + noteDelay + config.duration);
      });
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    playSound,
    isMuted,
    toggleMute,
  };
}

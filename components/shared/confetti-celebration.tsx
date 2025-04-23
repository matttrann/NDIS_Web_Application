"use client";

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  duration?: number;
}

export function ConfettiCelebration({ duration = 3000 }: ConfettiCelebrationProps) {
  useEffect(() => {
    // Create multiple confetti bursts
    const end = Date.now() + duration;

    // Realistic confetti animation function
    (function frame() {
      // Launch confetti from the left
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#4169E1', '#32CD32'],
      });

      // Launch confetti from the right
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#4169E1', '#32CD32'],
      });

      // Keep launching until duration is over
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Cleanup function
    return () => {
      confetti.reset();
    };
  }, [duration]);

  return null;
} 
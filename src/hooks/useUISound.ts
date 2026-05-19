"use client";

import { useCallback, useRef, useEffect } from "react";

export function useUISound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Inisialisasi AudioContext hanya di client side
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playHover = useCallback(() => {
    if (!audioCtxRef.current) return;
    try {
      if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtxRef.current.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.02, audioCtxRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.05);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      
      oscillator.start();
      oscillator.stop(audioCtxRef.current.currentTime + 0.05);
    } catch (e) {}
  }, []);

  const playClick = useCallback(() => {
    if (!audioCtxRef.current) return;
    try {
      if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(1000, audioCtxRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioCtxRef.current.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      
      oscillator.start();
      oscillator.stop(audioCtxRef.current.currentTime + 0.1);
    } catch (e) {}
  }, []);

  return { playHover, playClick };
}

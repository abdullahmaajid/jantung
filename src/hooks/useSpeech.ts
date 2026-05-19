"use client";

import { useCallback, useRef, useEffect } from "react";

export function useSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    
    // Hentikan suara yang sedang berjalan
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID"; // Gunakan bahasa Indonesia
    utterance.rate = 0.9;     // Sedikit lebih lambat agar jelas
    utterance.pitch = 1.0;
    
    // Opsional: Cari suara berbahasa Indonesia (Google Bahasa Indonesia jika ada)
    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.lang === "id-ID" || v.lang === "id_ID");
    if (idVoice) {
      utterance.voice = idVoice;
    }
    
    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  return { speak, stop };
}

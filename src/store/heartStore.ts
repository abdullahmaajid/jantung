// =============================================================
// src/store/heartStore.ts
//
// ZUSTAND - State Management Global
//
// BEST PRACTICE TYPESCRIPT DI SINI:
// Definisikan "interface" untuk state store Anda.
// Ini memastikan setiap komponen tahu data apa yang tersedia.
// =============================================================

import { create } from "zustand";
import { HeartPhase, LayerVisibility, AnatomyPart } from "@/core/types";

// ─────────────────────────────────────────────
// Interface state + actions digabung dalam 1 tipe
// Ini adalah pattern standar Zustand + TypeScript
// ─────────────────────────────────────────────
interface HeartStore {
  // ── STATE (data yang disimpan) ──
  phase: HeartPhase;                    // Fase jantung saat ini
  layerVisibility: LayerVisibility;     // Layer anatomi yang ditampilkan
  selectedPart: AnatomyPart | null;     // Bagian anatomi yang diklik (null = belum ada)
  conductionStep: number;               // Step animasi konduksi (0-5)
  isPlaying: boolean;                   // Apakah animasi sedang berjalan?
  scrubPercent: number | null;          // Scrubbing slider (0-100), null = auto play
  showHemodynamicIndicators: boolean;   // Toggle teks indikator melayang
  volume: number;                       // Volume audio (0-1)
  isSidebarVisible: boolean;            // Apakah sidebar sedang ditampilkan?
  theme: "dark" | "light";              // Tema aplikasi
  
  // ── ACTIONS (fungsi untuk mengubah state) ──
  // "void" artinya fungsi tidak mengembalikan nilai apapun
  setPhase: (phase: HeartPhase) => void;
  setLayerVisibility: (layer: LayerVisibility) => void;
  setSelectedPart: (part: AnatomyPart | null) => void;
  setConductionStep: (step: number) => void;
  setScrubPercent: (percent: number | null) => void;
  toggleHemodynamicIndicators: () => void;
  togglePlayback: () => void;
  setVolume: (vol: number) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  resetAll: () => void;
}

// Nilai awal state (initial state)
const initialState = {
  phase: HeartPhase.Diastolic,
  layerVisibility: "all" as LayerVisibility,
  selectedPart: null,
  conductionStep: 0,
  isPlaying: true, // Default true agar model GLB autoplay
  scrubPercent: null,
  showHemodynamicIndicators: true,
  volume: 0.5,
  isSidebarVisible: true,
  theme: "dark" as "dark" | "light",
};

// Membuat store dengan Zustand
// "create<HeartStore>" memberi tahu TypeScript bentuk store kita
const useHeartStore = create<HeartStore>((set) => ({
  // Spread initial state
  ...initialState,

  // Definisi actions
  // "set" adalah fungsi Zustand untuk mengubah state
  setPhase: (phase) => set({ phase }),
  
  setLayerVisibility: (layerVisibility) => set({ layerVisibility }),
  
  setSelectedPart: (selectedPart) => set({ selectedPart }),
  
  setConductionStep: (conductionStep) => set({ conductionStep }),
  
  setScrubPercent: (scrubPercent) => set({ scrubPercent }),
  
  toggleHemodynamicIndicators: () => set((state) => ({ showHemodynamicIndicators: !state.showHemodynamicIndicators })),
  
  // Contoh action yang membaca state sebelumnya (prev)
  togglePlayback: () => set((prev) => ({ isPlaying: !prev.isPlaying })),
  
  setVolume: (volume) => set({ volume }),
  
  toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") {
      if (newTheme === "light") {
        document.body.classList.add("theme-light");
      } else {
        document.body.classList.remove("theme-light");
      }
    }
    return { theme: newTheme };
  }),
  
  resetAll: () => set(initialState),
}));

export default useHeartStore;

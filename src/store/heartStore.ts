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
  volume: number;                       // Volume audio (0-1)
  isSidebarVisible: boolean;            // Apakah sidebar sedang ditampilkan?
  
  // ── ACTIONS (fungsi untuk mengubah state) ──
  // "void" artinya fungsi tidak mengembalikan nilai apapun
  setPhase: (phase: HeartPhase) => void;
  setLayerVisibility: (layer: LayerVisibility) => void;
  setSelectedPart: (part: AnatomyPart | null) => void;
  setConductionStep: (step: number) => void;
  togglePlayback: () => void;
  setVolume: (vol: number) => void;
  toggleSidebar: () => void;
  resetAll: () => void;
}

// Nilai awal state (initial state)
const initialState = {
  phase: HeartPhase.Diastolic,
  layerVisibility: "all" as LayerVisibility,
  selectedPart: null,
  conductionStep: 0,
  isPlaying: false,
  volume: 0.5,
  isSidebarVisible: true,
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
  
  // Contoh action yang membaca state sebelumnya (prev)
  togglePlayback: () => set((prev) => ({ isPlaying: !prev.isPlaying })),
  
  setVolume: (volume) => set({ volume }),
  
  toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
  
  resetAll: () => set(initialState),
}));

export default useHeartStore;

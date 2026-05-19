"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Heart } from "lucide-react";
import { AnatomyPart } from "@/core/types";
import useHeartStore from "@/store/heartStore";
import { useUISound } from "@/hooks/useUISound";

// ─── Trigger GLB preload IMMEDIATELY when this module loads ──────────────────
// This ensures the browser starts fetching heart.glb the moment /anatomy JS
// chunk is parsed — even before AnatomyCanvas (dynamic) is resolved.
import { useGLTF } from "@react-three/drei";
useGLTF.preload("/models/heart.glb");

const AnatomyCanvas = dynamic(
  () => import("@/components/3d/AnatomyCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-main)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--color-accent-secondary)] border-t-transparent animate-spin" />
          <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest uppercase">Memuat Model 3D...</p>
        </div>
      </div>
    ),
  }
);

const HEART_POSITION: [number, number, number] = [0, 0, 0];
const HEART_SCALE = 5;

export default function AnatomyClient({ anatomyParts }: { anatomyParts: AnatomyPart[] }) {
  const [selectedPart, setSelectedPart] = useState<AnatomyPart | null>(null);
  // canvasKey: incrementing this value forces the Canvas to fully remount,
  // recovering from a blank/failed WebGL context on re-navigation.
  const [canvasKey, setCanvasKey] = useState(0);
  const { layerVisibility, setLayerVisibility, isSidebarVisible, toggleSidebar } = useHeartStore();
  const { playHover, playClick } = useUISound();

  // If the canvas has been mounted for 3s and is still blank (GLB stuck),
  // force a single remount to recover.
  useEffect(() => {
    const timer = setTimeout(() => setCanvasKey((k) => k + 1), 3000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] overflow-hidden">
      {/* Top Header Consistent with other modules */}
      <header className="flex items-center justify-between px-8 py-4 bg-[var(--bg-main)] border-b border-[var(--border-light)] flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest">Modul 01</p>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">Anatomi Struktural</h1>
          </div>
          
          <div className="h-8 w-px bg-[var(--border-light)] mx-2" />
          
          <button 
            onClick={toggleSidebar}
            className="flex items-center space-x-2 bg-[var(--bg-panel)] px-3 py-1.5 rounded-full border border-[var(--border-light)] hover:bg-[var(--bg-hover)] transition-all"
          >
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tight">
              {isSidebarVisible ? "Hide Menu" : "Show Menu"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] text-[10px] font-bold uppercase rounded-full border border-[var(--color-accent-secondary)]/30">
              Eksplorasi 3D Interaktif
            </span>
        </div>
      </header>

      <main className="flex-1 grid-neo-swiss p-6">

        {/* SISI KIRI (3 KOLOM): DAFTAR ANATOMI */}
        <div className="grid-col-ui flex flex-col glass-ui-dark rounded-none overflow-hidden border border-[var(--border-light)]">

          {/* Daftar Istilah */}
          <div className="p-6 border-b border-[var(--border-light)]">
            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Daftar Istilah</h3>
            <ul className="space-y-1">
              {anatomyParts.map((part) => (
                <li key={part.id}>
                  <button
                    onClick={() => { playClick(); setSelectedPart(part); }}
                    onMouseEnter={playHover}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none transition-all text-left text-sm ${
                      selectedPart?.id === part.id
                        ? "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] font-semibold"
                        : "hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className={`w-2 h-2 ${selectedPart?.id === part.id ? "bg-[var(--color-accent-secondary)]" : "bg-[var(--border-strong)]"}`} />
                    {part.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedPart ? (
                <motion.div
                  key={selectedPart.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[9px] font-bold text-[var(--color-accent-primary-light)] uppercase tracking-widest">Detail Bagian</span>
                    <h2 className="text-xl font-bold text-[var(--color-accent-secondary)] mt-1">{selectedPart.label}</h2>
                  </div>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed font-light">
                    {selectedPart.description}
                  </p>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <Heart size={48} strokeWidth={1} className="text-[var(--text-secondary)] mb-4" />
                  <p className="text-xs text-[var(--text-secondary)]">Pilih anatomi dari daftar di atas<br/>atau klik langsung pada model 3D.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SISI KANAN (9 KOLOM): KANVAS 3D */}
        <div className="grid-col-3d relative rounded-none overflow-hidden glass-ui-dark border border-[var(--border-light)]">

          <AnatomyCanvas
            key={canvasKey}
            anatomyParts={anatomyParts}
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            heartPosition={HEART_POSITION}
            heartScale={HEART_SCALE}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-6 flex gap-3 z-10">
            <button
              onClick={() => setLayerVisibility(layerVisibility === "all" ? "vessels" : "all")}
              className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-widest font-bold transition-all border ${
                layerVisibility === "all"
                  ? "bg-[var(--color-accent-primary-light)] text-[#FFFFFF] border-[var(--color-accent-primary-light)]"
                  : "bg-[var(--bg-panel)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {layerVisibility === "all" ? "Layer: Lengkap" : "Layer: Pembuluh"}
            </button>
            <button
              onClick={() => setSelectedPart(null)}
              className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-secondary)] border border-[var(--border-strong)] rounded-none text-[10px] uppercase tracking-widest font-bold hover:text-[var(--text-primary)] transition-all"
            >
              Reset View
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

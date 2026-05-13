"use client";

// =============================================================
// app/(modules)/anatomy/page.tsx
//
// MODUL 1: Anatomi Struktural
// Canvas 3D di-handle sepenuhnya oleh AnatomyCanvas (ssr:false)
// sehingga model tidak hilang saat refresh.
// =============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ANATOMY_PARTS } from "@/lib/mock-data";
import { AnatomyPart } from "@/core/types";
import useHeartStore from "@/store/heartStore";

// ✅ Satu dynamic import untuk seluruh Canvas + Model + Annotations
// ssr:false memastikan TIDAK ADA Three.js yang berjalan di server
const AnatomyCanvas = dynamic(
  () => import("@/components/3d/AnatomyCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Memuat Model 3D...</p>
        </div>
      </div>
    ),
  }
);

// ================================================================
// ✏️  EDIT POSISI & UKURAN JANTUNG DI SINI
// heartPosition: [x, y, z]
//   x → kiri (-) / kanan (+)     contoh: 0.5 = geser kanan
//   y → bawah (-) / atas (+)     contoh: -0.2 = geser bawah
//   z → belakang (-) / depan (+)
// heartScale: ukuran model (default 5)
// ================================================================
const HEART_POSITION: [number, number, number] = [0.5, 0, 0]; // ← UBAH DI SINI
const HEART_SCALE = 5; // ← UBAH DI SINI

export default function AnatomyPage() {
  const [selectedPart, setSelectedPart] = useState<AnatomyPart | null>(null);
  const { layerVisibility, setLayerVisibility, isSidebarVisible, toggleSidebar } = useHeartStore();

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      <main className="flex-1 flex overflow-hidden">

        {/* LEFT: 3D Canvas */}
        <div className="flex-[7] relative bg-white border-r border-slate-100">
          {/* Header Floating */}
          <div className="absolute top-8 left-8 z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                Modul 01 • Anatomi
              </span>
              
              {/* Global Sidebar Toggle Button */}
              <button 
                onClick={toggleSidebar}
                className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition-all shadow-sm pointer-events-auto"
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  {isSidebarVisible ? "Hide Menu" : "Show Menu"}
                </span>
                <div className="w-4 h-4 bg-slate-800 rounded-full flex flex-col items-center justify-center space-y-0.5">
                  <div className={`w-2 h-0.5 bg-white transition-transform ${isSidebarVisible ? "rotate-45 translate-y-[1.5px]" : ""}`} />
                  {!isSidebarVisible && <div className="w-2 h-0.5 bg-white" />}
                  <div className={`w-2 h-0.5 bg-white transition-transform ${isSidebarVisible ? "-rotate-45 -translate-y-[1.5px]" : ""}`} />
                </div>
              </button>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Struktur Jantung
            </h1>
          </div>

          {/* 3D Canvas — full area */}
          <AnatomyCanvas
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            heartPosition={HEART_POSITION}
            heartScale={HEART_SCALE}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-8 left-8 flex gap-3 z-10">
            <button
              onClick={() => setLayerVisibility(layerVisibility === "all" ? "vessels" : "all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                layerVisibility === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {layerVisibility === "all" ? "Layer: Lengkap" : "Layer: Pembuluh"}
            </button>
            <button
              onClick={() => setSelectedPart(null)}
              className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* RIGHT: Info Panel */}
        <div className="flex-[3] w-[400px] flex flex-col bg-slate-50/50">
          {/* Daftar Istilah */}
          <div className="p-8 border-b border-slate-200 bg-white">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Daftar Istilah</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {ANATOMY_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left border ${
                    selectedPart?.id === part.id
                      ? "bg-white border-blue-200 shadow-md translate-x-1"
                      : "bg-transparent border-transparent hover:bg-white/60 text-slate-600"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: part.color }} />
                  <span className={`font-semibold text-sm ${selectedPart?.id === part.id ? "text-blue-600" : "text-slate-700"}`}>
                    {part.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Bagian */}
          <div className="flex-1 p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedPart ? (
                <motion.div
                  key={selectedPart.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Detail Bagian</span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedPart.label}</h2>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <p className="text-slate-600 text-sm leading-relaxed">{selectedPart.description}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Karakteristik</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase">Oksigenasi</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase">Struktural</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase">Klinis</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl mb-4">🫀</div>
                  <p className="text-sm font-medium text-slate-500">Pilih salah satu bagian jantung <br /> untuk melihat detail anatomi.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>
    </div>
  );
}

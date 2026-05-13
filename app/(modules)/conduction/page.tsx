"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import EKGCanvas from "@/components/ekg/EKGCanvas";
import useHeartStore from "@/store/heartStore";
import { CONDUCTION_NODES } from "@/lib/mock-data";
import { HeartPhase } from "@/core/types";

const HeartCanvas = dynamic(() => import("@/components/3d/HeartCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-50 animate-pulse" />,
});

const NODE_DESCRIPTIONS: Record<string, string> = {
  "sa-node": "SA Node adalah pacemaker alami jantung di dinding atrium kanan. Menghasilkan impuls listrik 60–100x/menit secara spontan (automatisitas).",
  "av-node": "AV Node memperlambat konduksi ±100ms untuk memberi waktu atrium memompa penuh sebelum ventrikel berkontraksi.",
  "bundle-of-his": "Bundle of His adalah satu-satunya jalur konduksi dari atrium ke ventrikel, melewati jaringan ikat yang tidak menghantarkan listrik.",
  "left-bundle": "Left Bundle Branch mendepolarisasi ventrikel kiri yang lebih tebal dan kuat secara efisien.",
  "right-bundle": "Right Bundle Branch mendepolarisasi ventrikel kanan secara bersamaan dengan cabang kiri.",
  "purkinje": "Serabut Purkinje menyebarkan impuls ke seluruh miokardium ventrikel, menyebabkan kontraksi simultan dan efisien.",
};

// ✏️ MASUKKAN URL YOUTUBE SISTEM KONDUKSI DI SINI
const YOUTUBE_URL = "https://www.youtube.com/embed/XPOi7LREm3Y"; 


export default function ConductionPage() {
  const { 
    conductionStep, 
    setConductionStep, 
    isSidebarVisible, 
    toggleSidebar, 
    isPlaying, 
    togglePlayback, 
    setPhase 
  } = useHeartStore();
  
  const currentNode = CONDUCTION_NODES[conductionStep] ?? null;

  useEffect(() => {
    if (!isPlaying) return;
    const delays = [0, 600, 300, 200, 200, 400];
    const timeout = setTimeout(() => {
      const next = (conductionStep + 1) % CONDUCTION_NODES.length;
      setConductionStep(next);
      if (next >= 3) setPhase(HeartPhase.Systolic);
      else setPhase(HeartPhase.Diastolic);
    }, delays[conductionStep] ?? 500);
    return () => clearTimeout(timeout);
  }, [isPlaying, conductionStep, setConductionStep, setPhase]);

  const handleStepClick = useCallback((index: number) => {
    setConductionStep(index);
    if (isPlaying) togglePlayback();
  }, [setConductionStep, isPlaying, togglePlayback]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Modul 03</p>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Sistem Konduksi</h1>
          </div>
          
          <div className="h-8 w-px bg-slate-200 mx-2" />
          
          {/* Global Sidebar Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-all shadow-sm"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {isSidebarVisible ? "Hide Menu" : "Show Menu"}
            </span>
            <div className="w-5 h-5 bg-slate-800 rounded-full flex flex-col items-center justify-center space-y-0.5">
              <div className={`w-2.5 h-0.5 bg-white transition-transform ${isSidebarVisible ? "rotate-45 translate-y-[2px]" : ""}`} />
              {!isSidebarVisible && <div className="w-2.5 h-0.5 bg-white" />}
              <div className={`w-2.5 h-0.5 bg-white transition-transform ${isSidebarVisible ? "-rotate-45 -translate-y-[2px]" : ""}`} />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Tombol Kontrol DIHAPUS sesuai permintaan */}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas Area */}
        <div className="flex-1 relative bg-white flex flex-col">
          <div className="flex-1 relative">
            <HeartCanvas height="100%" showOrbitControls showStars={false} interactive={false} />
            
            {/* Phase Label Floating DIHAPUS agar konsisten dengan Hemodinamik */}
          </div>

          {/* 📽️ VIDEO EDUKASI DI TENGAH BAWAH */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xs shadow-lg shadow-amber-200">⚡</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Video Insight</p>
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Kelistrikan Jantung & SA Node</h3>
                  </div>
                </div>
                <div className="px-3 py-1 bg-amber-100 rounded-full text-[9px] font-bold text-amber-600 uppercase">Electrical</div>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner">
                <iframe
                  width="100%"
                  height="100%"
                  src={YOUTUBE_URL}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel */}
        <aside className="w-80 flex flex-col border-l border-slate-100 bg-slate-50/60 overflow-y-auto flex-shrink-0">
          {/* Bagian Rangkuman Video DIHAPUS sesuai permintaan */}

          <div className="p-5 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Jalur Konduksi Listrik</p>
            <div className="relative">
              <div className="absolute left-[22px] top-5 bottom-5 w-px bg-slate-200" />
              <div className="space-y-2">
                {CONDUCTION_NODES.map((node, index) => {
                  const isPast = index < conductionStep;
                  const isCurrent = index === conductionStep;
                  const isFuture = index > conductionStep;
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleStepClick(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                        isCurrent
                          ? "bg-white border-slate-200 shadow-sm translate-x-1"
                          : "bg-transparent border-transparent hover:bg-white/60"
                      }`}
                      style={{ opacity: isFuture ? 0.4 : 1 }}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold z-10"
                        style={{
                          background: isCurrent ? node.color : isPast ? node.color + "22" : "#f1f5f9",
                          color: isCurrent ? "#fff" : isFuture ? "#94a3b8" : node.color,
                        }}
                      >
                        {isPast ? "✓" : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${isCurrent ? "text-slate-900" : "text-slate-600"}`}>
                          {node.name}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">+{node.delay}ms</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-slate-200 my-5" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Detail Node</p>
            <AnimatePresence mode="wait">
              {currentNode && (
                <motion.div
                  key={currentNode.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xs leading-relaxed text-slate-600 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentNode.color }} />
                    <span className="font-bold text-slate-800">{currentNode.name}</span>
                  </div>
                  {NODE_DESCRIPTIONS[currentNode.id]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-5 border-t border-slate-100 bg-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Monitor EKG Aktif</p>
            <EKGCanvas height={60} />
          </div>
        </aside>
      </div>
    </div>
  );
}


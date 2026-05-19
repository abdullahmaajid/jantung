"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Zap } from "lucide-react";
import EKGCanvas from "@/components/ekg/EKGCanvas";
import useHeartStore from "@/store/heartStore";
import { HeartPhase, ConductionNode } from "@/core/types";


const HeartCanvas = dynamic(() => import("@/components/3d/HeartCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--bg-main)] animate-pulse" />,
});

const HeartModel = dynamic(() => import("@/components/3d/HeartModel"), {
  ssr: false
});

const NODE_DESCRIPTIONS: Record<string, string> = {
  "sa-node": "SA Node adalah pacemaker alami jantung di dinding atrium kanan. Menghasilkan impuls listrik 60–100x/menit secara spontan (automatisitas).",
  "av-node": "AV Node memperlambat konduksi ±100ms untuk memberi waktu atrium memompa penuh sebelum ventrikel berkontraksi.",
  "bundle-of-his": "Bundle of His adalah satu-satunya jalur konduksi dari atrium ke ventrikel, melewati jaringan ikat yang tidak menghantarkan listrik.",
  "left-bundle": "Left Bundle Branch mendepolarisasi ventrikel kiri yang lebih tebal dan kuat secara efisien.",
  "right-bundle": "Right Bundle Branch mendepolarisasi ventrikel kanan secara bersamaan dengan cabang kiri.",
  "purkinje": "Serabut Purkinje menyebarkan impuls ke seluruh miokardium ventrikel, menyebabkan kontraksi simultan dan efisien.",
};

const YOUTUBE_URL = "https://www.youtube.com/embed/XPOi7LREm3Y"; 

export default function ConductionClient({ conductionNodes }: { conductionNodes: ConductionNode[] }) {
  const { 
    conductionStep, 
    setConductionStep, 
    isSidebarVisible, 
    toggleSidebar, 
    isPlaying, 
    togglePlayback, 
    setPhase 
  } = useHeartStore();
  const currentNode = conductionNodes[conductionStep] ?? null;

  // Hentikan autoplay saat pertama kali masuk ke modul ini
  useEffect(() => {
    if (isPlaying) {
      togglePlayback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    // Diperlambat ekstrim (4 detik per node) agar berfungsi seperti
    // mode presentasi/baca, bukan simulasi real-time yang terlalu cepat.
    const delays = [4000, 4000, 4000, 4000, 4000, 4000];
    const timeout = setTimeout(() => {
      const next = (conductionStep + 1) % conductionNodes.length;
      setConductionStep(next);
      if (next >= 3) setPhase(HeartPhase.Systolic);
      else setPhase(HeartPhase.Diastolic);
    }, delays[conductionStep] ?? 500);
    return () => clearTimeout(timeout);
  }, [isPlaying, conductionStep, setConductionStep, setPhase, conductionNodes.length]);

  const [activeTab, setActiveTab] = useState<"3d" | "video">("3d");

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] overflow-hidden">
      <header className="flex items-center justify-between px-8 py-4 bg-[var(--bg-main)] border-b border-[var(--border-light)] flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest">Modul 03</p>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">Sistem Konduksi</h1>
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
      </header>

      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        <div className="flex-1 relative glass-ui-dark border border-[var(--border-light)] flex flex-col overflow-hidden">
          
          {/* TAB TOGGLE */}
          <div className="absolute top-6 left-6 z-30 flex bg-[var(--bg-panel)] border border-[var(--border-light)] rounded-none overflow-hidden">
            <button 
              onClick={() => setActiveTab("3d")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "3d" ? "bg-[var(--color-accent-secondary)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
            >
              Simulasi 3D
            </button>
            <button 
              onClick={() => setActiveTab("video")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "video" ? "bg-[var(--color-accent-secondary)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
            >
              <Zap size={12} fill={activeTab === "video" ? "currentColor" : "none"} />
              Video Insight
            </button>
          </div>

          <div className="flex-1 relative bg-[var(--bg-main)]">
            {activeTab === "3d" ? (
              <HeartCanvas height="100%" showOrbitControls showStars={false} interactive={false}>
                <HeartModel scale={1} />
              </HeartCanvas>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full p-6 pt-20 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-accent-secondary)] flex items-center justify-center text-[var(--text-primary)]">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-none">Video Insight</p>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Kelistrikan Jantung & SA Node</h3>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-[var(--color-accent-secondary)]/10 border border-[var(--color-accent-secondary)]/30 rounded-full text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase">Electrical</div>
                </div>
                <div className="flex-1 w-full bg-black border border-[var(--border-light)] relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={YOUTUBE_URL}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <aside className="w-80 flex flex-col glass-ui-dark border border-[var(--border-light)] overflow-y-auto flex-shrink-0">
          <div className="p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Jalur Konduksi Listrik</p>
              <button
                onClick={togglePlayback}
                className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1"
                style={{
                  borderColor: isPlaying ? "var(--border-strong)" : "var(--color-accent-secondary)",
                  color: isPlaying ? "var(--text-secondary)" : "var(--color-accent-secondary)",
                  backgroundColor: isPlaying ? "transparent" : "var(--bg-card)"
                }}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>
            <div className="relative">
              <div className="space-y-2 relative z-10">
                {conductionNodes.map((node, index) => {
                  const isPast = index < conductionStep;
                  const isCurrent = index === conductionStep;
                  const isFuture = index > conductionStep;
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleStepClick(index)}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-all border ${
                        isCurrent
                          ? "bg-[var(--bg-card)] border-[var(--border-light)]"
                          : "bg-transparent border-transparent hover:bg-[var(--bg-card)]"
                      }`}
                      style={{ opacity: isFuture ? 0.4 : 1 }}
                    >
                      {/* Box Number / Icon */}
                      <div
                        className="w-11 h-11 flex items-center justify-center flex-shrink-0 text-xs font-bold z-10 relative"
                        style={{
                          backgroundColor: isCurrent ? node.color : isPast ? "var(--bg-panel)" : "var(--bg-main)",
                          color: isCurrent ? "#FFFFFF" : isFuture ? "var(--text-secondary)" : node.color,
                          border: `1px solid ${isCurrent ? node.color : isPast ? node.color : 'var(--border-strong)'}`,
                        }}
                      >
                        {isPast ? "✓" : index + 1}
                      </div>
                      <div className="flex-1 min-w-0 z-10">
                        <p className={`text-sm font-bold truncate ${isCurrent ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                          {node.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)]/60 uppercase font-bold">+{node.delay}ms</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-[var(--border-light)] my-5" />
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Detail Node</p>
            <AnimatePresence mode="wait">
              {currentNode && (
                <motion.div
                  key={currentNode.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xs leading-relaxed text-[var(--text-secondary)] p-4 bg-[var(--bg-card)] border border-[var(--border-light)]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentNode.color }} />
                    <span className="font-bold text-[var(--text-primary)]">{currentNode.name}</span>
                  </div>
                  {NODE_DESCRIPTIONS[currentNode.id]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-5 border-t border-[var(--border-light)]">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Monitor EKG Aktif</p>
            <EKGCanvas height={60} />
          </div>
        </aside>
      </div>
    </div>
  );
}

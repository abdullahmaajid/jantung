"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Play, Pause, Eye, EyeOff } from "lucide-react";
import EKGCanvas from "@/components/ekg/EKGCanvas";
import useHeartStore from "@/store/heartStore";
import { HeartPhase } from "@/core/types";

const HeartCanvas = dynamic(() => import("@/components/3d/HeartCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--bg-main)] animate-pulse" />,
});

const HeartModel = dynamic(() => import("@/components/3d/HeartModel"), {
  ssr: false
});

const PHASE_INFO = {
  [HeartPhase.Systolic]: {
    title: "Fase Sistolik",
    subtitle: "Kontraksi Ventrikel",
    color: "var(--color-accent-primary-light)",
    description: "Ventrikel berkontraksi memompa darah keluar. Tekanan intraventrikel meningkat drastis, membuka katup aorta dan pulmonal, sementara katup mitral dan trikuspid tertutup rapat.",
    facts: [
      "Tekanan aorta: 120 mmHg",
      "Durasi: ±300ms",
      "Volume dipompa: ±70ml",
      "Katup Aorta & Pulmonal: TERBUKA",
    ],
  },
  [HeartPhase.Diastolic]: {
    title: "Fase Diastolik",
    subtitle: "Relaksasi & Pengisian",
    color: "var(--color-accent-secondary)",
    description: "Ventrikel rileks dan terisi kembali dari atrium. Katup aorta dan pulmonal menutup (bunyi S2), sementara katup mitral dan trikuspid terbuka untuk pengisian.",
    facts: [
      "Tekanan aorta: 80 mmHg",
      "Durasi: ±500ms",
      "Volume pengisian: ±130ml",
      "Katup Mitral & Trikuspid: TERBUKA",
    ],
  },
};

// ✏️ MASUKKAN URL YOUTUBE ANDA DI SINI
const YOUTUBE_URL = "https://www.youtube.com/embed/zvth4OQG3Hk"; 

export default function HemodynamicPage() {
  const { 
    phase, 
    setPhase, 
    isSidebarVisible, 
    toggleSidebar, 
    scrubPercent, 
    setScrubPercent,
    showHemodynamicIndicators,
    toggleHemodynamicIndicators,
    isPlaying,
    togglePlayback
  } = useHeartStore();
  const info = PHASE_INFO[phase];

  // Pastikan animasi berjalan (isPlaying = true) di modul Hemodinamik
  // dan kembalikan scrubPercent ke null saat unmount
  useEffect(() => {
    if (!isPlaying) {
      togglePlayback();
    }
    return () => setScrubPercent(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[var(--bg-main)] border-b border-[var(--border-light)] flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest">Modul 02</p>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">Hemodinamik</h1>
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
          <div className="flex rounded-lg overflow-hidden border border-[var(--border-light)]">
            {[HeartPhase.Systolic, HeartPhase.Diastolic].map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: phase === p ? PHASE_INFO[p].color : "transparent",
                  color: phase === p ? "#FFFFFF" : "var(--text-secondary)",
                }}
              >
                {p === HeartPhase.Systolic ? "Sistolik" : "Diastolik"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* 3D Canvas Area */}
        <div className="flex-1 relative glass-ui-dark border border-[var(--border-light)] flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            <HeartCanvas height="100%" showOrbitControls showStars={false} interactive={false}>
              <HeartModel scale={1} />
            </HeartCanvas>

            {/* TOGGLE OVERLAY TEXT (Neo-Swiss Style Button) */}
            <button 
              onClick={toggleHemodynamicIndicators}
              className="absolute bottom-6 right-6 flex items-center space-x-2 bg-[var(--bg-main)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--border-strong)] hover:bg-[var(--bg-hover)] transition-all z-30"
            >
              {showHemodynamicIndicators ? <Eye size={12} className="text-[var(--color-accent-secondary)]" /> : <EyeOff size={12} className="text-[var(--text-secondary)]" />}
              <span className={`text-[10px] font-bold tracking-widest uppercase ${showHemodynamicIndicators ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                {showHemodynamicIndicators ? "Teks: Aktif" : "Teks: Mati"}
              </span>
            </button>
          </div>

          {/* 📽️ TIMELINE SCRUBBING */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-20 flex flex-col gap-4">
            
            {/* Timeline Scrubbing Control */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-ui-dark p-4 w-full flex items-center gap-4 border border-[var(--border-light)]"
            >
              {/* Scrub Mode Toggle: Manual (locked) vs Auto-play */}
              <button 
                onClick={() => setScrubPercent(scrubPercent === null ? 50 : null)}
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-light)] text-[var(--text-primary)] transition-all flex-shrink-0 bg-[var(--bg-panel)] hover:bg-[var(--bg-hover)]"
                title={scrubPercent === null ? "Aktifkan mode scrub manual" : "Kembali ke auto-play"}
              >
                {scrubPercent === null ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </button>
              
              <div className="flex-1 flex flex-col gap-2">
                {/* Label buttons: hanya switch phase, TIDAK membekukan animasi */}
                <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  <button 
                    onClick={() => { setPhase(HeartPhase.Systolic); setScrubPercent(null); }}
                    className={`transition-colors ${
                      phase === HeartPhase.Systolic
                        ? "text-[var(--color-accent-primary-light)]"
                        : "hover:text-[var(--color-accent-primary-light)]"
                    }`}
                  >
                    ▶ Sistolik (Kontraksi)
                  </button>
                  <button 
                    onClick={() => { setPhase(HeartPhase.Diastolic); setScrubPercent(null); }}
                    className={`transition-colors ${
                      phase === HeartPhase.Diastolic
                        ? "text-[var(--color-accent-secondary)]"
                        : "hover:text-[var(--color-accent-secondary)]"
                    }`}
                  >
                    ▶ Diastolik (Relaksasi)
                  </button>
                </div>
                {/* Slider hanya aktif saat scrub mode ON */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={scrubPercent === null ? 0 : scrubPercent}
                  onChange={(e) => setScrubPercent(parseFloat(e.target.value))}
                  disabled={scrubPercent === null}
                  className={`w-full h-1.5 bg-[var(--border-light)] appearance-none cursor-pointer accent-white ${
                    scrubPercent === null ? "opacity-30 cursor-not-allowed" : "opacity-100"
                  }`}
                />
                {scrubPercent !== null && (
                  <p className="text-[9px] text-[var(--text-secondary)] text-center font-bold uppercase tracking-widest">
                    Mode Manual — Geser slider untuk scrub siklus jantung
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>



        {/* Right Panel */}
        <aside className="w-80 flex flex-col glass-ui-dark border border-[var(--border-light)] overflow-y-auto flex-shrink-0">
          <div className="p-5 border-b border-[var(--border-light)]">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Monitor EKG</p>
            <EKGCanvas height={70} />
          </div>

          <div className="p-5 flex-1">
            <motion.div key={phase} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                <h3 className="text-base font-bold" style={{ color: info.color }}>{info.title}</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">{info.description}</p>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Parameter Hemodinamik</p>
              <div className="space-y-2">
                {info.facts.map((fact) => (
                  <div key={fact} className="flex items-start gap-2 px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] text-[11px] text-[var(--text-secondary)]">
                    <span style={{ color: info.color }}>▸</span>
                    {fact}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="p-5 border-t border-[var(--border-light)]">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Legenda Partikel</p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2.5 text-[11px] text-[var(--text-secondary)]">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-primary-light)]" />
                Darah kaya O₂ (Sistolik)
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-[var(--text-secondary)]">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-secondary)]" />
                Darah miskin O₂ (Diastolik)
              </div>
            </div>

            {/* Video Edukasi dipindah ke Side Panel */}
            <div className="w-full bg-[var(--bg-panel)] p-3 border border-[var(--border-light)] mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Play size={12} className="text-[var(--color-accent-secondary)]" fill="currentColor" />
                <h3 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest">Video Insight</h3>
              </div>
              <div className="aspect-video w-full overflow-hidden bg-[var(--bg-main)] border border-[var(--border-light)]">
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
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

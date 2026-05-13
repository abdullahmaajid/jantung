"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import EKGCanvas from "@/components/ekg/EKGCanvas";
import useHeartStore from "@/store/heartStore";
import { HeartPhase } from "@/core/types";

const HeartCanvas = dynamic(() => import("@/components/3d/HeartCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-50 animate-pulse" />,
});

const PHASE_INFO = {
  [HeartPhase.Systolic]: {
    title: "Fase Sistolik",
    subtitle: "Kontraksi Ventrikel",
    color: "#e53e3e",
    bg: "rgba(229, 62, 62, 0.06)",
    border: "rgba(229, 62, 62, 0.2)",
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
    color: "#3182ce",
    bg: "rgba(49, 130, 206, 0.06)",
    border: "rgba(49, 130, 206, 0.2)",
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
// Gunakan format "https://www.youtube.com/embed/VIDEO_ID"
const YOUTUBE_URL = "https://www.youtube.com/embed/zvth4OQG3Hk"; 

export default function HemodynamicPage() {
  const { phase, setPhase, isSidebarVisible, toggleSidebar } = useHeartStore();
  const info = PHASE_INFO[phase];

  // Hapus logika auto-transition agar transisi hanya terjadi saat tombol Sistolik/Diastolik ditekan manual
  
  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Modul 02</p>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Hemodinamik</h1>
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
          <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            {[HeartPhase.Systolic, HeartPhase.Diastolic].map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: phase === p ? PHASE_INFO[p].color : "transparent",
                  color: phase === p ? "#fff" : "#64748b",
                }}
              >
                {p === HeartPhase.Systolic ? "Sistolik" : "Diastolik"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas Area */}
        <div className="flex-1 relative bg-white flex flex-col">
          <div className="flex-1 relative">
            <HeartCanvas height="100%" showOrbitControls showStars={false} interactive={false} />
            
            {/* Phase Label Floating DIHAPUS sesuai permintaan */}
          </div>

          {/* 📽️ VIDEO EDUKASI DI TENGAH BAWAH */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center text-white text-xs shadow-lg shadow-red-200">▶</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Video Insight</p>
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Sistolik vs Diastolik Jantung</h3>
                  </div>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-bold text-slate-400 uppercase">Educational</div>
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
          <div className="p-5 border-b border-slate-100 bg-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Monitor EKG</p>
            <EKGCanvas height={70} />
          </div>

          <div className="p-5 flex-1">
            <motion.div key={phase} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                <h3 className="text-base font-bold" style={{ color: info.color }}>{info.title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-5">{info.description}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Parameter Hemodinamik</p>
              <div className="space-y-2">
                {info.facts.map((fact) => (
                  <div key={fact} className="flex items-start gap-2 px-3 py-2.5 bg-white rounded-lg border border-slate-100 text-[11px] text-slate-700">
                    <span style={{ color: info.color }}>▸</span>
                    {fact}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>



          <div className="p-5 border-t border-slate-100 bg-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Legenda Partikel</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[11px] text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Darah kaya O₂ (Sistolik)
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Darah miskin O₂ (Diastolik)
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHeartStore from "@/store/heartStore";
import type { ClinicalCase } from "@/core/types";

interface CasesClientProps {
  initialCases: ClinicalCase[];
}

function AudioPlayer({ audioUrl, label }: { audioUrl: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        import("sweetalert2").then(({ default: Swal }) => {
          Swal.fire({
            title: "Audio Belum Tersedia",
            text: "File audio murmur akan tersedia setelah aset diunduh dari Freesound.org",
            icon: "info",
            confirmButtonText: "Mengerti",
          });
        });
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
      <button
        onClick={toggleAudio}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-all"
        aria-label={isPlaying ? "Pause audio" : "Play audio murmur"}
      >
        <span className="text-base">{isPlaying ? "⏸" : "🔊"}</span>
      </button>
      <div>
        <p className="text-xs font-bold text-slate-700">Audio Auskultasi</p>
        <p className="text-[10px] text-slate-400">{isPlaying ? "Mendengarkan murmur..." : "Klik untuk dengarkan"}</p>
      </div>
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-blue-400"
              animate={{ height: ["3px", `${6 + Math.random() * 12}px`, "3px"] }}
              transition={{ duration: 0.3 + i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({ caseData, index }: { caseData: ClinicalCase; index: number }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!selectedAnswer) {
      const { default: Swal } = await import("sweetalert2");
      Swal.fire({ title: "Pilih Jawaban Dulu!", icon: "warning", confirmButtonText: "Ok" });
      return;
    }
    const isCorrect = selectedAnswer === caseData.correctAnsw;
    setSubmitted(true);
    const { default: Swal } = await import("sweetalert2");
    await Swal.fire({
      title: isCorrect ? "Diagnosis Tepat! 🎉" : "Kurang Tepat 🔍",
      html: isCorrect
        ? `<p>Benar! Diagnosis: <strong>${caseData.correctAnsw}</strong></p>`
        : `<p>Jawaban Anda: <strong style="color:#e53e3e">${selectedAnswer}</strong><br>Benar: <strong style="color:#38a169">${caseData.correctAnsw}</strong></p>`,
      icon: isCorrect ? "success" : "error",
      confirmButtonText: isCorrect ? "Lanjut Kasus Berikut" : "Coba Lagi",
    });
    if (!isCorrect) setSubmitted(false);
  }, [selectedAnswer, caseData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Kasus Klinis</p>
            <h3 className="text-base font-bold text-slate-900">{caseData.title}</h3>
          </div>
        </div>
        {submitted && (
          <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded border border-green-200">
            Selesai
          </span>
        )}
      </div>

      {/* Deskripsi kasus */}
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-4 text-xs text-slate-600 leading-relaxed">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Presentasi Klinis</p>
        {caseData.description}
      </div>

      {/* Audio */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-4">
        <AudioPlayer audioUrl={caseData.audioUrl} label={caseData.title} />
      </div>

      {/* Opsi jawaban */}
      {caseData.options && !submitted && (
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pilih Diagnosis</p>
          {caseData.options.map((option, i) => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              className="w-full text-left px-4 py-3 rounded-lg text-sm border transition-all"
              style={{
                background: selectedAnswer === option ? "rgba(49, 130, 206, 0.06)" : "transparent",
                borderColor: selectedAnswer === option ? "#3182ce" : "#e2e8f0",
                color: selectedAnswer === option ? "#3182ce" : "#475569",
                fontWeight: selectedAnswer === option ? 600 : 400,
              }}
            >
              <span className="text-slate-400 mr-2">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          ))}
        </div>
      )}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-all"
        >
          🩺 Submit Diagnosis
        </button>
      ) : (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center text-sm font-bold text-green-700">
          ✓ Diagnosis: {caseData.correctAnsw}
        </div>
      )}
    </motion.div>
  );
}

export default function CasesClient({ initialCases }: CasesClientProps) {
  const { isSidebarVisible, toggleSidebar } = useHeartStore();

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Modul 04</p>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Simulasi Kasus</h1>
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

        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full border border-blue-100">
          {initialCases.length} Kasus Tersedia
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-slate-400 mb-8">
            Dengarkan audio auskultasi, baca presentasi klinis, dan tentukan diagnosis yang paling tepat.
          </p>
          <div className="space-y-5">
            {initialCases.map((caseData, index) => (
              <CaseCard key={caseData.id} caseData={caseData} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

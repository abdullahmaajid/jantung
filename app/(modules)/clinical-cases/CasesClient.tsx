"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Stethoscope, Check } from "lucide-react";
import useHeartStore from "@/store/heartStore";
import type { ClinicalCase } from "@/core/types";
import dynamic from "next/dynamic";
import { useUISound } from "@/hooks/useUISound";

const HeartCanvas = dynamic(() => import("@/components/3d/HeartCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--bg-main)] animate-pulse" />,
});

const HeartModel = dynamic(() => import("@/components/3d/HeartModel"), {
  ssr: false
});

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
            background: "#151515",
            color: "var(--text-primary)",
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
        className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-light)] bg-[var(--bg-panel)] hover:bg-[var(--bg-hover)] transition-all"
        aria-label={isPlaying ? "Pause audio" : "Play audio murmur"}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" className="text-[var(--text-primary)]" /> : <Volume2 size={18} className="text-[var(--text-primary)]" />}
      </button>
      <div>
        <p className="text-xs font-bold text-[var(--text-primary)]">Audio Auskultasi</p>
        <p className="text-[10px] text-[var(--text-secondary)]">{isPlaying ? "Mendengarkan murmur..." : "Klik untuk dengarkan"}</p>
      </div>
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-[var(--color-accent-secondary)]"
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
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const { playHover, playClick } = useUISound();

  const handleSelectOption = (option: string) => {
    if (submitted) return; // already solved
    if (wrongAnswers.has(option)) return; // already tried and wrong

    setSelectedAnswer(option);

    const isCorrect = option === caseData.correctAnsw;
    if (isCorrect) {
      setSubmitted(true);
    } else {
      setWrongAnswers(prev => new Set(prev).add(option));
      // Shake animation is triggered by adding it to wrongAnswers
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-ui-dark p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-primary-light)]/20 border border-[var(--color-accent-primary-light)]/30 flex items-center justify-center text-sm font-bold text-[var(--color-accent-primary-light)]">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest">Kasus Klinis</p>
            <h3 className="text-base font-bold text-[var(--text-primary)]">{caseData.title}</h3>
          </div>
        </div>
        {submitted && (
          <span className="px-2 py-1 bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] text-[10px] font-bold uppercase rounded border border-[var(--color-accent-secondary)]/30">
            Selesai
          </span>
        )}
      </div>

      {/* Deskripsi kasus */}
      <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl mb-4 text-xs text-[var(--text-secondary)] leading-relaxed">
        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Presentasi Klinis</p>
        {caseData.description}
      </div>

      {/* Audio */}
      <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-light)] mb-4">
        <AudioPlayer audioUrl={caseData.audioUrl} label={caseData.title} />
      </div>

      {/* Opsi jawaban */}
      {caseData.options && (
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Pilih Diagnosis</p>
          {caseData.options.map((option, i) => {
            const isCorrect = submitted && option === caseData.correctAnsw;
            const isWrong = wrongAnswers.has(option);
            return (
              <button
                key={option}
                onClick={() => { playClick(); handleSelectOption(option); }}
                onMouseEnter={playHover}
                disabled={submitted || isWrong}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-all ${
                  isCorrect
                    ? "bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)] font-bold"
                    : isWrong
                    ? "animate-shake bg-[var(--bg-card)] border-[var(--border-strong)]/30 text-[var(--text-secondary)]/50 cursor-not-allowed"
                    : "bg-transparent border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
                }`}
              >
                <span className={`${isCorrect ? "text-[var(--bg-main)]" : "text-[var(--text-secondary)]"} mr-2`}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>
      )}

      {/* Penjelasan jika benar */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-[var(--bg-card)] border border-[var(--border-light)] overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[var(--color-accent-secondary)]" />
              <h4 className="text-[var(--text-primary)] font-bold text-sm">Rasionalisasi Klinis</h4>
            </div>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
              Tepat sekali. {caseData.correctAnsw} teridentifikasi dari tanda dan gejala tersebut, sesuai dengan manifestasi murmur yang terdengar pada auskultasi.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CasesClient({ initialCases }: CasesClientProps) {
  const { isSidebarVisible, toggleSidebar } = useHeartStore();
  // Simpan active case id untuk ganti irama/fase jantung sesuai kelainan jika dibutuhkan
  const [activeCase, setActiveCase] = useState<string | null>(initialCases[0]?.id || null);

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[var(--bg-main)] border-b border-[var(--border-light)] flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest">Modul 04</p>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">Simulasi Kasus</h1>
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

        <span className="px-3 py-1.5 bg-[var(--color-accent-primary-light)]/20 text-[var(--color-accent-primary-light)] text-[10px] font-bold uppercase rounded-full border border-[var(--color-accent-primary-light)]/30">
          {initialCases.length} Kasus Tersedia
        </span>
      </header>

      {/* Content dengan Neo-Swiss Grid */}
      <div className="flex-1 p-6 grid-neo-swiss overflow-hidden">
        {/* Sisi Kiri (4 Kolom): Panel Kuis */}
        <div className="grid-col-ui-wide flex flex-col gap-5 overflow-y-auto pr-2 pb-10">
          <p className="text-sm text-[var(--text-secondary)] mb-2 px-1">
            Dengarkan audio auskultasi, baca presentasi klinis, dan tentukan diagnosis yang paling tepat.
          </p>
          {initialCases.map((caseData, index) => (
            <div key={caseData.id} onClick={() => setActiveCase(caseData.id)} className="cursor-pointer">
              <CaseCard caseData={caseData} index={index} />
            </div>
          ))}
        </div>

        {/* Sisi Kanan (8 Kolom): Visual 3D */}
        <div className="grid-col-3d-narrow relative glass-ui-dark border border-[var(--border-light)] overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            <HeartCanvas height="100%" showOrbitControls interactive={false}>
              <HeartModel scale={1} activeCase={activeCase} />
            </HeartCanvas>
          </div>
          <div className="absolute top-6 left-6 z-10">
            <span className="inline-block px-4 py-1.5 border border-[var(--color-accent-primary-light)]/30 bg-[var(--color-accent-primary-light)]/10 text-[var(--color-accent-primary-light)] text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
              Visualisasi Jantung: {initialCases.find((c) => c.id === activeCase)?.title || "Kasus"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

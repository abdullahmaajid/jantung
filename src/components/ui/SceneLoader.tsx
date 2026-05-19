"use client";

import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SceneLoader() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Tunggu sedikit setelah loading selesai agar transisi smooth
    if (!active && progress >= 100) {
      const timer = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  // Safety timer: maksimal 2.5 detik loader pasti hilang agar tidak menghalangi halaman utama (terutama saat reload/cached)
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setShow(false);
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-main)]"
        >
          {/* Pulsating heart icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mb-8 flex items-center justify-center"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent-primary-light)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              {/* EKG line inside heart */}
              <path
                d="M3.22 12H7l1.5-3 2 6 1.5-3h4.78"
                stroke="var(--color-accent-secondary)"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>

          {/* Text */}
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-6">
            Memuat Aset Medis
          </p>

          {/* Progress bar container */}
          <div className="w-64 h-px bg-[var(--border-light)] relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[var(--color-accent-secondary)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Percentage */}
          <p className="mt-3 text-[10px] font-bold text-[var(--color-accent-secondary)] tracking-widest">
            {Math.round(progress)}%
          </p>

          {/* Bottom branding */}
          <div className="absolute bottom-8 flex flex-col items-center">
            <p className="text-[9px] text-[var(--text-secondary)]/40 uppercase tracking-[0.4em]">
              CardioLearn — Interactive Cardiology Platform
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

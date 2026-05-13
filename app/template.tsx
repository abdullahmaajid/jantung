"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Template.tsx - Memberikan efek transisi SPECTACULAR antar halaman.
 * Berbeda dengan layout.tsx, template akan re-mount setiap navigasi.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Efek Sapuan Layer (Luxury Wipe) */}
        <motion.div
          variants={{
            initial: { scaleY: 0 },
            animate: { scaleY: 0 },
            exit: { scaleY: 1 },
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 bg-blue-600 z-[9999] origin-bottom pointer-events-none"
        />
        
        <motion.div
          variants={{
            initial: { scaleY: 1 },
            animate: { scaleY: 0 },
            exit: { scaleY: 0 },
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 bg-blue-600 z-[9999] origin-top pointer-events-none"
        />

        {/* Konten Halaman dengan Efek Slide Up & Fade In */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 30, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2, // Tunggu sapuan selesai sedikit
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/mock-data";

interface NavigationSidebarProps {
  isVisible: boolean;
}

export default function NavigationSidebar({ isVisible }: NavigationSidebarProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center py-6 px-3 glass-ui rounded-full border border-slate-200/50 shadow-2xl space-y-4"
        >
          {/* Brand Logo - Minimalist */}
          <Link href="/" className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white shadow-lg shadow-blue-200 mb-2 hover:scale-110 transition-transform">
            🫀
          </Link>

          <div className="flex flex-col space-y-3">
            {MODULES.map((mod) => {
              const isActive = pathname === mod.href;
              return (
                <Link 
                  key={mod.id} 
                  href={mod.href} 
                  className={`relative group w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-50 text-blue-600 shadow-inner" 
                      : "text-slate-400 hover:bg-slate-50 hover:text-blue-500"
                  }`}
                  title={mod.title}
                >
                  <div className="text-xl relative z-10">{mod.icon}</div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute left-16 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {mod.title}
                  </div>

                  {isActive && (
                    <motion.div 
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-blue-100/50 rounded-full border border-blue-200/50"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

        </motion.nav>
      )}
    </AnimatePresence>
  );
}



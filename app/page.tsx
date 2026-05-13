"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import useHeartStore from "@/store/heartStore";
import { MODULES } from "@/lib/mock-data";

// Komponen Internal untuk Loading Model GLB agar lebih eksplisit
function HeartModelDirect({ scale = 5 }) {
  // Memanggil langsung file heart.glb dari folder public/models/
  const { scene } = useGLTF("/models/heart.glb");
  
  return (
    <primitive 
      object={scene} 
      scale={scale}
      position={[-0.1, -4.9, 0]} 
    />
  );
}

// Preload model
useGLTF.preload("/models/heart.glb");

export default function PulseSyncDashboard() {
  const router = useRouter();
  const { isSidebarVisible, toggleSidebar } = useHeartStore();
  const [isNavigating, setIsNavigating] = useState(false);

  // 🖱️ FITUR: Scroll down to navigate to next page
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Jika user men-scroll ke bawah lebih dari threshold dan tidak sedang beranimasi pindah
      if (e.deltaY > 50 && !isNavigating) {
        setIsNavigating(true);
        router.push("/anatomy");
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [router, isNavigating]);

  return (
    <div className="relative h-screen w-screen font-sans text-slate-800 overflow-hidden flex">
      {/* Background Gradient */}
      <div className="pulse-sync-bg" />



      <main className="relative flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVIGATION BAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6 pointer-events-none">
          <div className="flex items-center space-x-4 pointer-events-auto">
            {/* Dynamic Module Links */}
            {MODULES.slice(0, 2).map((mod, i) => (
              <Link key={mod.id} href={mod.href} className="nav-pill flex items-center space-x-2">
                <span>{mod.title}</span>
                {i === 0 && <span className="text-[10px] opacity-50">+</span>}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          </div>

          <div className="text-xl font-bold tracking-[0.3em] text-slate-800 pointer-events-auto opacity-0 invisible">
            PULSE SYNC
          </div>

          <div className="flex items-center space-x-6 pointer-events-auto">
            <button 
              onClick={toggleSidebar}
              className="flex items-center space-x-2 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 hover:bg-slate-200 transition-all pointer-events-auto"
            >
              <span className="text-sm font-medium">{isSidebarVisible ? "Hide Menu" : "Show Menu"}</span>
              <div className="w-6 h-6 bg-slate-800 rounded-full flex flex-col items-center justify-center space-y-0.5">
                <div className={`w-3 h-0.5 bg-white transition-transform ${isSidebarVisible ? "rotate-45 translate-y-[3px]" : ""}`} />
                {!isSidebarVisible && <div className="w-3 h-0.5 bg-white" />}
                <div className={`w-3 h-0.5 bg-white transition-transform ${isSidebarVisible ? "-rotate-45 -translate-y-[3px]" : ""}`} />
              </div>
            </button>
            <div className="h-6 w-[1px] bg-slate-300" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mb-1">Status</span>
              <span className="text-xs font-bold text-slate-900">Interactive Cardiology Platform</span>
            </div>
          </div>
        </nav>

        <div className="absolute inset-0 flex items-start justify-center pt-32 pointer-events-none select-none z-0">
          <h1 className="text-[9vw] font-bold text-slate-900/[0.03] tracking-tighter leading-none mt-[-10vh] uppercase">
            Anatomi Jantung
          </h1>
        </div>

        {/* 3D HEART MODEL LAYER - Menggunakan Canvas Langsung */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full max-w-7xl aspect-square pointer-events-auto">
            <Canvas
              camera={{ position: [0, 0, 1.4], fov: 35 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.5} />
              <pointLight position={[10, 10, 10]} intensity={2} />
              <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
              
              <Suspense fallback={<Html center className="text-slate-400 animate-pulse font-bold tracking-widest">LOADING HEART GLB...</Html>}>
                <HeartModelDirect scale={3.5} />
              </Suspense>

              <OrbitControls 
                enablePan={false} 
                enableZoom={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </div>
        </div>

        {/* HERO CONTENT - OVERLAY */}
        <div className="relative z-20 container mx-auto px-12 pt-32 h-screen flex flex-col justify-between pb-12 pointer-events-none">
          
          <div className="flex justify-between items-start pt-20">
            {/* Left Space */}
            <div className="w-48" />

            {/* Right Hero Text */}
            <div className="max-w-[300px] text-right pointer-events-auto">
              <motion.p 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-sm leading-relaxed"
              >
                Eksplorasi anatomi jantung . menampilkan jantung dengan visual 3D  untuk membantu orang umum memahami struktur serta cara kerja jantung secara lebih mendalam dan interaktif.
              </motion.p>
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className="flex justify-between items-end pb-8">
            {/* Bottom Left Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card-light p-6 rounded-3xl w-72 pointer-events-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-slate-800 font-bold">Visualisasi 3D</h3>
                  <p className="text-slate-500 text-xs mt-1">Pelajari setiap detail jantung dengan 3D model. Membantu Anda mengenali anatomi dan potensi kelainan klinis dengan jauh lebih mudah.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-6">
              </div>
            </motion.div>

            {/* Bottom Right Card (Doctor) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card-light p-5 rounded-3xl w-80 pointer-events-auto flex items-center space-x-4"
            >
              <div className="flex-1">
                <div className="text-2xl font-bold text-slate-800">92%</div>
                <p className="text-slate-500 text-[10px] mt-1 mb-4">Pengalaman Belajar yang Lebih Menyeluruh</p>
                <div className="space-y-0.5">
                  <h4 className="text-slate-800 font-bold text-sm">Dr. Nafisa Tasnim, Sp.JP</h4>
                  <p className="text-slate-400 text-[9px]">"Visualisasi yang tepat adalah kunci untuk memahami cara kerja jantung yang kompleks secara lebih sederhana."</p>
                </div>
              </div>
              <div className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-200 relative">
                 <img src="/models/DOKTER.jpg" alt="Doctor" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

        </div>

        {/* Interaction Hint & Scroll Hint */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30">
          {/* Animated Mouse Icon */}
          <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center p-1">
             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="w-1 h-2 bg-slate-400 rounded-full" 
             />
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            Scroll down to explore
          </span>
        </div>
      </main>
    </div>
  );
}



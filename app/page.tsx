"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import useHeartStore from "@/store/heartStore";
import { MODULES } from "@/lib/mock-data";
import SceneLoader from "@/components/ui/SceneLoader";

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

// ─── Hero Page: Theme-Aware Lighting ─────────────────────────────────
function HeroThemeLights() {
  const theme = useHeartStore((s) => s.theme);
  const isDark = theme === "dark";
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const keyRef = useRef<THREE.SpotLight>(null!);
  const rimGoldRef = useRef<THREE.SpotLight>(null!);
  const rimRedRef = useRef<THREE.SpotLight>(null!);
  const fillRef = useRef<THREE.PointLight>(null!);

  const t = isDark
    ? {
      ambient: 0.1, key: 4, gold: 5, red: 4, fill: 0.3,
      keyColor: new THREE.Color("#ffffff"),
      goldColor: new THREE.Color("#D4AF37"),
      redColor: new THREE.Color("#9B111E")
    }
    : {
      ambient: 2.0, key: 6, gold: 1.5, red: 1.0, fill: 2.0,
      keyColor: new THREE.Color("#f0f4ff"),
      goldColor: new THREE.Color("#e8c87a"),
      redColor: new THREE.Color("#c0392b")
    };

  useFrame(() => {
    const l = THREE.MathUtils.lerp;
    if (ambientRef.current) ambientRef.current.intensity = l(ambientRef.current.intensity, t.ambient, 0.08);
    if (keyRef.current) { keyRef.current.intensity = l(keyRef.current.intensity, t.key, 0.08); keyRef.current.color.lerp(t.keyColor, 0.08); }
    if (rimGoldRef.current) { rimGoldRef.current.intensity = l(rimGoldRef.current.intensity, t.gold, 0.08); rimGoldRef.current.color.lerp(t.goldColor, 0.08); }
    if (rimRedRef.current) { rimRedRef.current.intensity = l(rimRedRef.current.intensity, t.red, 0.08); rimRedRef.current.color.lerp(t.redColor, 0.08); }
    if (fillRef.current) fillRef.current.intensity = l(fillRef.current.intensity, t.fill, 0.08);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={t.ambient} />
      <spotLight ref={keyRef} position={[-10, 10, 10]} angle={0.4} penumbra={1} intensity={t.key} color={t.keyColor} castShadow />
      <spotLight ref={rimGoldRef} position={[12, 5, -10]} angle={0.3} penumbra={0.5} intensity={t.gold} color={t.goldColor} />
      <spotLight ref={rimRedRef} position={[-10, -8, -5]} angle={0.5} penumbra={1} intensity={t.red} color={t.redColor} />
      <pointLight ref={fillRef} position={[0, -2, 5]} intensity={t.fill} color="#ffffff" />
    </>
  );
}

export default function PulseSyncDashboard() {
  const router = useRouter();
  const { isSidebarVisible, toggleSidebar } = useHeartStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <div className="relative h-screen w-screen font-sans text-[var(--text-primary)] overflow-hidden flex bg-[var(--bg-main)]">
      <SceneLoader />
      <main className="relative flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVIGATION BAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 md:py-6 pointer-events-none">
          <div className="hidden md:flex items-center space-x-4 pointer-events-auto">
            {/* Dynamic Module Links */}
            {MODULES.slice(0, 2).map((mod, i) => (
              <Link key={mod.id} href={mod.href} className="px-4 py-1.5 border border-[var(--border-light)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--color-accent-secondary)] transition-all duration-300 flex items-center space-x-2">
                <span>{mod.title}</span>
                {i === 0 && <span className="text-[10px] opacity-50">+</span>}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-[var(--border-strong)]" />
              <div className="w-1.5 h-1.5 bg-[var(--border-strong)]" />
            </div>
          </div>

          <div className="text-lg md:text-xl font-bold tracking-[0.3em] text-[var(--text-primary)] pointer-events-auto opacity-0 invisible">
            PULSE SYNC
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 pointer-events-auto">
            <button
              onClick={toggleSidebar}
              className="flex items-center space-x-2 bg-[var(--bg-panel)] px-3 md:px-4 py-1.5 rounded-none border border-[var(--border-light)] hover:bg-[var(--bg-hover)] transition-all pointer-events-auto"
            >
              <span className="text-xs md:text-sm font-medium text-[var(--text-primary)] hidden sm:block">{isSidebarVisible ? "Hide Menu" : "Menu"}</span>
              <div className="w-5 md:w-6 h-5 md:h-6 bg-[var(--text-primary)] flex flex-col items-center justify-center space-y-0.5">
                <div className={`w-3 h-0.5 bg-[var(--bg-main)] transition-transform ${isSidebarVisible ? "rotate-45 translate-y-[3px]" : ""}`} />
                {!isSidebarVisible && <div className="w-3 h-0.5 bg-[var(--bg-main)]" />}
                <div className={`w-3 h-0.5 bg-[var(--bg-main)] transition-transform ${isSidebarVisible ? "-rotate-45 -translate-y-[3px]" : ""}`} />
              </div>
            </button>
            <div className="hidden sm:block h-6 w-[1px] bg-[var(--border-strong)]" />
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] md:text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest leading-none mb-1">Status</span>
              <span className="text-[10px] md:text-xs font-bold text-[var(--text-primary)]">Interactive Cardiology Platform</span>
            </div>
          </div>
        </nav>

        {/* BACKGROUND TEXT (Only visible on MD and up) */}
        <div className="hidden md:flex absolute inset-0 items-start justify-center pt-32 lg:pt-36 pointer-events-none select-none z-0">
          <h1 className="text-[17vw] xl:text-[10vw] font-bold text-[var(--text-primary)]/10 tracking-tighter leading-none mt-[-5vh] lg:mt-[-3vh] uppercase text-center flex-col xl:flex-row gap-0 xl:gap-8 items-center px-4 md:px-0">
            <span>Anatomi</span>
            <span>Jantung</span>
          </h1>
        </div>

        {/* 3D HEART MODEL LAYER */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full max-w-7xl aspect-square pointer-events-auto">
            {mounted && (
              <Canvas
                camera={{ position: [0, 0, 1.4], fov: 35 }}
                gl={{ antialias: true, alpha: true }}
              >
                <HeroThemeLights />

                <Suspense fallback={<Html center className="text-[var(--text-secondary)] animate-pulse font-bold tracking-widest">LOADING HEART GLB...</Html>}>
                  <HeartModelDirect scale={3.5} />
                </Suspense>

                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  minPolarAngle={Math.PI / 2.2}
                  maxPolarAngle={Math.PI / 1.8}
                />
              </Canvas>
            )}
          </div>
        </div>

        {/* HERO CONTENT - OVERLAY */}
        <div className="relative z-20 container mx-auto px-4 md:px-12 pt-20 md:pt-32 h-screen flex flex-col justify-between pb-16 md:pb-12 pointer-events-none overflow-hidden">

          <div className="flex flex-col md:flex-row justify-between items-center md:items-start pt-10 md:pt-20 w-full">
            {/* Left Space */}
            <div className="hidden md:block w-48" />

            {/* Right Hero Text */}
            <div className="w-full md:max-w-[300px] text-center md:text-right pointer-events-auto z-10 mt-6 md:mt-0 flex flex-col items-center md:items-end">
              <h2 className="md:hidden text-3xl font-bold tracking-[0.2em] text-[var(--text-primary)] mb-3 drop-shadow-lg">ANATOMI</h2>
              <h2 className="md:hidden text-xl font-bold tracking-widest text-[var(--color-accent-secondary)] mb-6 drop-shadow-md">JANTUNG MANUSIA</h2>
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed bg-[var(--bg-main)]/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-5 md:p-0 rounded-xl md:rounded-none border md:border-none border-[var(--border-light)] w-full max-w-[90%] md:max-w-full"
              >
                Eksplorasi anatomi jantung . menampilkan jantung dengan visual 3D  untuk membantu orang umum memahami struktur serta cara kerja jantung secara lebih mendalam dan interaktif.
              </motion.p>
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end pb-8 gap-4 md:gap-0 mt-auto md:mt-0 z-10 w-full">
            {/* Bottom Left Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-ui-dark p-4 md:p-6 rounded-none border border-[var(--border-light)] w-full max-w-[90%] md:max-w-sm md:w-72 pointer-events-auto"
            >
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <div>
                  <h3 className="text-[var(--text-primary)] font-bold text-sm md:text-base">Visualisasi 3D</h3>
                  <p className="text-[var(--text-secondary)] text-[10px] md:text-xs mt-1">Pelajari setiap detail jantung dengan 3D model. Membantu Anda mengenali anatomi dan potensi kelainan klinis dengan jauh lebih mudah.</p>
                </div>
              </div>
            </motion.div>

            {/* Bottom Right Card (Doctor) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-ui-dark p-4 md:p-5 rounded-none w-full max-w-[90%] md:max-w-sm md:w-80 pointer-events-auto flex items-center space-x-4 md:space-x-4"
            >
              <div className="flex-1">
                <div className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">92%</div>
                <p className="text-[var(--text-secondary)] text-[9px] md:text-[10px] mt-1 mb-2 md:mb-4">Pengalaman Belajar yang Lebih Menyeluruh</p>
                <div className="space-y-0.5">
                  <h4 className="text-[var(--text-primary)] font-bold text-xs md:text-sm">Dr. Nafisa Tasnim, Sp.JP</h4>
                  <p className="text-[var(--text-secondary)] text-[8px] md:text-[9px]">"Visualisasi yang tepat adalah kunci untuk memahami cara kerja jantung yang kompleks secara lebih sederhana."</p>
                </div>
              </div>
              <div className="w-20 md:w-24 h-28 md:h-32 rounded-none overflow-hidden bg-[var(--bg-panel)] relative flex-shrink-0">
                <img src="/models/DOKTER.jpg" alt="Doctor" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
              </div>
            </motion.div>
          </div>

        </div>

        {/* Interaction Hint & Scroll Hint */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30">
          {/* Animated Mouse Icon */}
          <div className="w-5 h-8 border-2 border-[var(--border-strong)] rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-[var(--color-accent-secondary)] rounded-full"
            />
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
            Scroll down to explore
          </span>
        </div>
      </main>
    </div>
  );
}



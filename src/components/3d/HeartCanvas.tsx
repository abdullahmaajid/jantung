"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useHeartStore from "@/store/heartStore";

interface HeartCanvasProps {
  height?: string;
  interactive?: boolean;
  showOrbitControls?: boolean;
  showStars?: boolean;
  children?: React.ReactNode;
}

// ─── Theme-Aware Lighting Rig ─────────────────────────────────────────────────
// Reads the Zustand theme and smoothly interpolates between two lighting presets:
// Dark Mode  → Cinematic/moody: deep shadows, warm gold/red accents
// Light Mode → Studio/bright:  high ambient + cool key light + soft fills
function ThemeAwareLights() {
  const theme = useHeartStore((s) => s.theme);
  const isDark = theme === "dark";

  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const keyLightRef = useRef<THREE.SpotLight>(null!);
  const rimRedRef = useRef<THREE.SpotLight>(null!);
  const rimGoldRef = useRef<THREE.PointLight>(null!);
  const fillRef = useRef<THREE.DirectionalLight>(null!);

  // Target values for each theme
  const targets = isDark
    ? {
        ambient: 0.15,
        key: { intensity: 3.0, color: new THREE.Color("#ffffff") },
        rimRed: { intensity: 4.0, color: new THREE.Color("#9B111E") },
        rimGold: { intensity: 2.0, color: new THREE.Color("#D4AF37") },
        fill: { intensity: 0.4, color: new THREE.Color("#ffffff") },
      }
    : {
        // Light mode: studio / overcast-bright preset
        ambient: 1.8,
        key: { intensity: 5.0, color: new THREE.Color("#f0f4ff") }, // Cool north-sky key
        rimRed: { intensity: 1.5, color: new THREE.Color("#c0392b") }, // Subtle warm rim
        rimGold: { intensity: 1.0, color: new THREE.Color("#e8c87a") }, // Warm fill
        fill: { intensity: 2.5, color: new THREE.Color("#e8eef5") }, // Bright soft fill
      };

  // Smoothly interpolate every frame
  useFrame(() => {
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targets.ambient,
        0.08
      );
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(keyLightRef.current.intensity, targets.key.intensity, 0.08);
      keyLightRef.current.color.lerp(targets.key.color, 0.08);
    }
    if (rimRedRef.current) {
      rimRedRef.current.intensity = THREE.MathUtils.lerp(rimRedRef.current.intensity, targets.rimRed.intensity, 0.08);
      rimRedRef.current.color.lerp(targets.rimRed.color, 0.08);
    }
    if (rimGoldRef.current) {
      rimGoldRef.current.intensity = THREE.MathUtils.lerp(rimGoldRef.current.intensity, targets.rimGold.intensity, 0.08);
      rimGoldRef.current.color.lerp(targets.rimGold.color, 0.08);
    }
    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(fillRef.current.intensity, targets.fill.intensity, 0.08);
      fillRef.current.color.lerp(targets.fill.color, 0.08);
    }
  });

  return (
    <>
      {/* Ambient — base fill */}
      <ambientLight ref={ambientRef} intensity={targets.ambient} />

      {/* Key Light — top-left front, cool white */}
      <spotLight
        ref={keyLightRef}
        position={[-8, 12, 10]}
        angle={0.35}
        penumbra={1}
        intensity={targets.key.intensity}
        color={targets.key.color}
        castShadow
      />

      {/* Rim Light 1 — Swiss Red, right-back */}
      <spotLight
        ref={rimRedRef}
        position={[12, 4, -10]}
        angle={0.4}
        penumbra={1}
        intensity={targets.rimRed.intensity}
        color={targets.rimRed.color}
      />

      {/* Rim Light 2 — Metallic Gold, left-bottom-back */}
      <pointLight
        ref={rimGoldRef}
        position={[-10, -6, -8]}
        intensity={targets.rimGold.intensity}
        color={targets.rimGold.color}
      />

      {/* Front Fill — soft frontal fill, reduces harsh shadows */}
      <directionalLight
        ref={fillRef}
        position={[0, 3, 6]}
        intensity={targets.fill.intensity}
        color={targets.fill.color}
      />
    </>
  );
}

export default function HeartCanvas({ 
  height = "100%", 
  interactive = true,
  showOrbitControls = true,
  showStars = false,
  children
}: HeartCanvasProps) {
  return (
    <div style={{ width: "100%", height }} className="canvas-container relative">
      <Canvas
        shadows
        camera={{
          position: [0, 0, 4],
          fov: 35,
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
        dpr={[1, 2]}
      >
        <ThemeAwareLights />
        
        <Suspense fallback={<Html center className="text-[var(--text-secondary)] tracking-widest animate-pulse text-sm">LOADING...</Html>}>
          {children}
        </Suspense>

        {showOrbitControls && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={interactive} 
            minDistance={2} 
            maxDistance={8} 
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            makeDefault
          />
        )}
      </Canvas>
    </div>
  );
}

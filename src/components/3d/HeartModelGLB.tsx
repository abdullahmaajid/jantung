"use client";

import { useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useHeartStore from "@/store/heartStore";
import { HeartPhase } from "@/core/types";

/* =============================================================
   CARA IMPORT MODEL DARI SKETCHFAB:
   1. Download model format GLB/GLTF dari Sketchfab.
   2. Taruh file .glb di folder /public/models/heart.glb
   3. Gunakan npx gltfjsx public/models/heart.glb untuk auto-generate component
      atau gunakan useGLTF secara manual seperti di bawah.
   ============================================================= */

export default function HeartModelGLB({ 
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
}: { 
  scale?: number;
  position?: [number, number, number];
}) {
  const { scene } = useGLTF("/models/heart.glb", true);

  // ✅ PENTING: clone scene agar setiap instance punya salinan sendiri.
  // Tanpa ini, saat halaman di-refresh atau component unmount,
  // Three.js bisa men-dispose objek yang di-share sehingga model hilang.
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  
  const groupRef = useRef<THREE.Group>(null);
  const phase = useHeartStore((state) => state.phase);

  // Animasi detak jantung menggunakan scale pada seluruh model
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Kecepatan detak berdasarkan fase
    const beatSpeed = phase === HeartPhase.Systolic ? 4 : 2;
    const beatIntensity = phase === HeartPhase.Systolic ? 0.05 : 0.02;
    
    const baseScale = scale;
    const pulseScale = baseScale * (1 + Math.sin(time * beatSpeed) * beatIntensity);
    groupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive 
        object={clonedScene} 
        onPointerDown={(e: any) => {
          e.stopPropagation();
          console.log("KORDINAT KLIK (x, y, z):", 
            e.point.x.toFixed(2), 
            e.point.y.toFixed(2), 
            e.point.z.toFixed(2)
          );
          console.log("Salin angka ini ke 'position' di mock-data.ts untuk menempatkan titik label.");
        }}
      />
      
      {/* Cahaya internal agar model terlihat "hidup" */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={phase === HeartPhase.Systolic ? 2 : 0.5} 
        color={phase === HeartPhase.Systolic ? "#ff0000" : "#4488ff"} 
      />
    </group>
  );
}

// Preload agar loading lebih cepat
useGLTF.preload("/models/heart.glb");

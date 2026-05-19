"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnatomyPart } from "@/core/types";
import useHeartStore from "@/store/heartStore";

useGLTF.preload("/models/heart.glb");

// ─── Theme-Aware Lighting Rig (identical logic to HeartCanvas) ────────────────
function ThemeAwareLights() {
  const theme = useHeartStore((s) => s.theme);
  const isDark = theme === "dark";

  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const keyLightRef = useRef<THREE.SpotLight>(null!);
  const rimRedRef = useRef<THREE.SpotLight>(null!);
  const rimGoldRef = useRef<THREE.PointLight>(null!);
  const fillRef = useRef<THREE.DirectionalLight>(null!);

  const targets = isDark
    ? {
        ambient: 0.15,
        key: { intensity: 3.0, color: new THREE.Color("#ffffff") },
        rimRed: { intensity: 4.0, color: new THREE.Color("#9B111E") },
        rimGold: { intensity: 2.0, color: new THREE.Color("#D4AF37") },
        fill: { intensity: 0.4, color: new THREE.Color("#ffffff") },
      }
    : {
        ambient: 1.8,
        key: { intensity: 5.0, color: new THREE.Color("#f0f4ff") },
        rimRed: { intensity: 1.5, color: new THREE.Color("#c0392b") },
        rimGold: { intensity: 1.0, color: new THREE.Color("#e8c87a") },
        fill: { intensity: 2.5, color: new THREE.Color("#e8eef5") },
      };

  useFrame(() => {
    const lerp = THREE.MathUtils.lerp;
    if (ambientRef.current) ambientRef.current.intensity = lerp(ambientRef.current.intensity, targets.ambient, 0.08);
    if (keyLightRef.current) { keyLightRef.current.intensity = lerp(keyLightRef.current.intensity, targets.key.intensity, 0.08); keyLightRef.current.color.lerp(targets.key.color, 0.08); }
    if (rimRedRef.current) { rimRedRef.current.intensity = lerp(rimRedRef.current.intensity, targets.rimRed.intensity, 0.08); rimRedRef.current.color.lerp(targets.rimRed.color, 0.08); }
    if (rimGoldRef.current) { rimGoldRef.current.intensity = lerp(rimGoldRef.current.intensity, targets.rimGold.intensity, 0.08); rimGoldRef.current.color.lerp(targets.rimGold.color, 0.08); }
    if (fillRef.current) { fillRef.current.intensity = lerp(fillRef.current.intensity, targets.fill.intensity, 0.08); fillRef.current.color.lerp(targets.fill.color, 0.08); }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={targets.ambient} />
      <spotLight ref={keyLightRef} position={[-8, 12, 10]} angle={0.35} penumbra={1} intensity={targets.key.intensity} color={targets.key.color} castShadow />
      <spotLight ref={rimRedRef} position={[12, 4, -10]} angle={0.4} penumbra={1} intensity={targets.rimRed.intensity} color={targets.rimRed.color} />
      <pointLight ref={rimGoldRef} position={[-10, -6, -8]} intensity={targets.rimGold.intensity} color={targets.rimGold.color} />
      <directionalLight ref={fillRef} position={[0, 3, 6]} intensity={targets.fill.intensity} color={targets.fill.color} />
    </>
  );
}

// ─── Model Jantung ────────────────────────────────────────────
function HeartModel({
  scale = 5,
  position = [0, 0, 0] as [number, number, number],
}: {
  scale?: number;
  position?: [number, number, number];
}) {
  const { scene } = useGLTF("/models/heart.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const layerVisibility = useHeartStore((state) => state.layerVisibility);

  // Implementasi Toggle Overlay (Sembunyikan lapisan otot / X-Ray Mode)
  useEffect(() => {
    cloned.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Clone material to avoid mutating cached GLTF
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material.clone();
        }
        
        if (layerVisibility === "vessels") {
          // Mode X-Ray / Sembunyikan otot
          const mat = child.userData.originalMaterial.clone();
          mat.transparent = true;
          mat.opacity = 0.3;
          mat.wireframe = true;
          child.material = mat;
        } else {
          // Mode Normal
          child.material = child.userData.originalMaterial;
        }
      }
    });
  }, [cloned, layerVisibility]);

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onPointerDown={(e: any) => {
        e.stopPropagation();
      }}
    >
      <primitive object={cloned} />
    </group>
  );
}

// ─── Titik Annotasi (Neo-Swiss Style) ───────────────────────────────────────────
function Annotation({
  part,
  isSelected,
  onSelect,
}: {
  part: AnatomyPart;
  isSelected: boolean;
  onSelect: (p: AnatomyPart) => void;
}) {
  // Enforce char limit 100-146
  let desc = part.description;
  if (desc.length > 146) {
    desc = desc.substring(0, 143) + "...";
  }

  return (
    <Html 
      position={part.position} 
      distanceFactor={8} 
      zIndexRange={isSelected ? [1000, 900] : [100, 0]}
    >
      <div className="relative flex flex-col items-center group">
        <button
          onClick={() => onSelect(part)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            isSelected
              ? "bg-[var(--color-accent-secondary)] scale-150 shadow-[0_0_15px_rgba(184,151,66,0.6)]"
              : "bg-[var(--color-accent-secondary)]/40 hover:bg-[var(--color-accent-secondary)]/90 shadow-[0_0_6px_rgba(212,175,55,0.3)]"
          }`}
        />
        
        {/* Tooltip garis tipis (Neo-Swiss) */}
        <div
          className={`absolute top-8 left-1/2 -translate-x-1/2 w-56 p-4 bg-[var(--bg-main)]/95 backdrop-blur-xl border border-[var(--border-strong)] transition-all duration-500 pointer-events-none ${
            isSelected ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
          style={{ zIndex: isSelected ? 9999 : 1 }}
        >
          {/* Garis penghubung */}
          <div className={`w-px h-8 bg-[var(--color-accent-secondary)]/50 absolute -top-8 left-1/2 -translate-x-1/2 transition-all duration-500 delay-100 ${isSelected ? "h-8" : "h-0"}`} />
          
          <h4 className="text-[var(--color-accent-secondary)] text-[10px] font-bold uppercase tracking-widest mb-2">
            {part.label}
          </h4>
          <p className="text-[var(--text-secondary)] text-[10px] leading-relaxed font-light relative z-10">
            {desc}
          </p>
        </div>
      </div>
    </Html>
  );
}

// ─── Camera Zoom & Fly-To Controller ─────────────────────────
function CameraFlyController({
  pivotPoint,
  controlsRef
}: {
  pivotPoint: THREE.Vector3;
  controlsRef: any;
}) {
  useFrame(() => {
    if (!controlsRef.current) return;
    // 1. Lerp OrbitControls target for smooth panning
    controlsRef.current.target.lerp(pivotPoint, 0.05);
    controlsRef.current.update();
  });

  return null;
}

// ─── Scene Utama ──────────────────────────────────────────────
function AnatomyScene({
  anatomyParts,
  selectedPart,
  onSelectPart,
  heartPosition,
  heartScale,
}: {
  anatomyParts: AnatomyPart[];
  selectedPart: AnatomyPart | null;
  onSelectPart: (p: AnatomyPart) => void;
  heartPosition: [number, number, number];
  heartScale: number;
}) {
  const controlsRef = useRef<any>(null);

  const pivotPoint = useMemo(() => {
    if (selectedPart) {
      return new THREE.Vector3(...selectedPart.position);
    }
    return new THREE.Vector3(...heartPosition);
  }, [heartPosition, selectedPart]);

  return (
    <>
      <CameraFlyController pivotPoint={pivotPoint} controlsRef={controlsRef} />

      <Suspense fallback={
        <Html center>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px", height: "32px",
              border: "2px solid #D4AF37",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <p style={{ color: "#9CA3AF", fontSize: "10px", fontWeight: "bold", letterSpacing: "0.15em", textTransform: "uppercase" }}>Memuat Model 3D...</p>
          </div>
        </Html>
      }>
        <HeartModel scale={heartScale} position={heartPosition} />
        {anatomyParts.map((part) => (
          <Annotation
            key={part.id}
            part={part}
            isSelected={selectedPart?.id === part.id}
            onSelect={onSelectPart}
          />
        ))}
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        target={heartPosition}
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={12.0}
        enableDamping
        dampingFactor={0.06}
        makeDefault
      />
    </>
  );
}

// ─── Export Utama ─────────────────────────────────────────────
export interface AnatomyCanvasProps {
  anatomyParts: AnatomyPart[];
  selectedPart: AnatomyPart | null;
  onSelectPart: (p: AnatomyPart) => void;
  heartPosition?: [number, number, number];
  heartScale?: number;
}

export default function AnatomyCanvas({
  anatomyParts,
  selectedPart,
  onSelectPart,
  heartPosition = [0, 0, 0], // Center it for the 9-col layout
  heartScale = 5,
}: AnatomyCanvasProps) {
  return (
    <div style={{ width: "100%", height: "100%" }} className="relative bg-[var(--bg-main)]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          // Ensure context doesn't get lost on re-navigation
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ThemeAwareLights />

        <AnatomyScene
          anatomyParts={anatomyParts}
          selectedPart={selectedPart}
          onSelectPart={onSelectPart}
          heartPosition={heartPosition}
          heartScale={heartScale}
        />
      </Canvas>
    </div>
  );
}

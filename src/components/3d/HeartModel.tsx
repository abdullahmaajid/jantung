"use client";

// =============================================================
// src/components/3d/HeartModel.tsx
//
// Model 3D jantung menggunakan primitif standar Three.js
// PENTING: Hanya gunakan geometri yang ADA di THREE namespace
// (sphere, box, cylinder, torus, cone - bukan ellipsoid custom)
// =============================================================

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { HeartPhase } from "@/core/types";
import useHeartStore from "@/store/heartStore";

// ─────────────────────────────────────────────
// Satu "bilik" jantung - direpresentasikan dengan sphere yang di-scale
// ─────────────────────────────────────────────
function HeartChamber({
  position,
  color,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
  pulseDelay = 0,
  phase,
}: {
  position: [number, number, number];
  color: string;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
  pulseDelay?: number;
  phase: HeartPhase;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    // Efek detak: skala naik turun
    const beatFactor =
      phase === HeartPhase.Systolic
        ? 1 + Math.sin(time * 4 + pulseDelay) * 0.08
        : 1 + Math.sin(time * 2 + pulseDelay) * 0.03;

    meshRef.current.scale.set(
      scaleX * beatFactor,
      scaleY * beatFactor,
      scaleZ * beatFactor
    );
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Gunakan sphereGeometry standar, bukan ellipsoidGeometry */}
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.08}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Partikel darah yang berubah warna
// ─────────────────────────────────────────────
function BloodParticles({ phase }: { phase: HeartPhase }) {
  const count = 300;
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.5 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={phase === HeartPhase.Systolic ? "#ff3333" : "#3366ff"}
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ─────────────────────────────────────────────
// Pembuluh darah (silinder yang dirotasi)
// ─────────────────────────────────────────────
function BloodVessel({
  start,
  end,
  color,
  radius = 0.06,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  radius?: number;
}) {
  const { midpoint, length, quaternion } = useMemo(() => {
    const startV = new THREE.Vector3(...start);
    const endV = new THREE.Vector3(...end);
    const midpoint = startV.clone().lerp(endV, 0.5);
    const length = startV.distanceTo(endV);

    // Hitung rotasi untuk silinder yang menghubungkan dua titik
    const direction = endV.clone().sub(startV).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return { midpoint, length, quaternion };
  }, [start, end]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Komponen Utama Heart Model
// ─────────────────────────────────────────────
interface HeartModelProps {
  scale?: number;
  interactive?: boolean;
  onPartClick?: (partId: string) => void;
}

export default function HeartModel({ scale = 1 }: HeartModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useHeartStore((state) => state.phase);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Ventrikel Kiri - lebih besar, skala asimetris */}
      <HeartChamber
        position={[-0.28, -0.18, 0]}
        color="#8b1a1a"
        scaleX={0.9}
        scaleY={1.1}
        scaleZ={0.8}
        pulseDelay={0}
        phase={phase}
      />

      {/* Ventrikel Kanan */}
      <HeartChamber
        position={[0.28, -0.12, 0]}
        color="#1a3a8b"
        scaleX={0.7}
        scaleY={0.9}
        scaleZ={0.7}
        pulseDelay={0.1}
        phase={phase}
      />

      {/* Atrium Kiri */}
      <HeartChamber
        position={[-0.22, 0.45, -0.1]}
        color="#6b1414"
        scaleX={0.6}
        scaleY={0.5}
        scaleZ={0.6}
        pulseDelay={-0.3}
        phase={phase}
      />

      {/* Atrium Kanan */}
      <HeartChamber
        position={[0.28, 0.45, -0.1]}
        color="#142a6b"
        scaleX={0.56}
        scaleY={0.46}
        scaleZ={0.56}
        pulseDelay={-0.4}
        phase={phase}
      />

      {/* Aorta */}
      <BloodVessel
        start={[-0.1, 0.35, 0]}
        end={[0.15, 1.05, 0]}
        color="#c0392b"
        radius={0.09}
      />

      {/* Arteri Pulmonalis */}
      <BloodVessel
        start={[0.1, 0.5, 0.1]}
        end={[-0.28, 0.88, 0.3]}
        color="#2980b9"
        radius={0.07}
      />

      {/* Vena Cava Superior */}
      <BloodVessel
        start={[0.28, 0.65, -0.1]}
        end={[0.28, 1.15, -0.1]}
        color="#1a5a9b"
        radius={0.065}
      />

      {/* Apex jantung (ujung bawah) */}
      <mesh position={[0, -0.72, 0]}>
        <coneGeometry args={[0.18, 0.3, 16]} />
        <meshStandardMaterial color="#6b1414" roughness={0.4} transparent opacity={0.85} />
      </mesh>

      {/* Partikel darah */}
      <BloodParticles phase={phase} />

      {/* Dynamic point light - berubah warna sesuai fase */}
      <pointLight
        position={[0, 0, 1.5]}
        intensity={phase === HeartPhase.Systolic ? 1.2 : 0.6}
        color={phase === HeartPhase.Systolic ? "#ff4444" : "#4488ff"}
        distance={4}
      />
    </group>
  );
}

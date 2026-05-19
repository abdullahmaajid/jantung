"use client";

// =============================================================
// src/components/3d/HeartModel.tsx
// =============================================================

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { HeartPhase } from "@/core/types";
import useHeartStore from "@/store/heartStore";
import { CONDUCTION_NODES } from "@/lib/mock-data";

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
  chamberType = "ventricle", // "ventricle" | "atrium"
}: {
  position: [number, number, number];
  color: string;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
  pulseDelay?: number;
  phase: HeartPhase;
  chamberType?: "ventricle" | "atrium";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrubPercent = useHeartStore((state) => state.scrubPercent);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = scrubPercent !== null ? (scrubPercent / 100) * 1.0 : state.clock.elapsedTime;
    const cycle = (time + pulseDelay) % 1.0;

    let beatFactor = 1.0;

    // SISTOLIC: Ventrikel berkontraksi kuat (mengecil, memompa)
    //           Atrium rileks (sedikit mengembang karena menerima darah balik)
    // DIASTOLIK: Ventrikel relaksasi (mengembang, terisi dari atrium)
    //            Atrium berkontraksi (mendorong darah ke ventrikel)

    if (phase === HeartPhase.Systolic) {
      if (chamberType === "ventricle") {
        // Ventrikel: kontraksi KUAT → mengecil drastis lalu balik
        if (cycle < 0.15) beatFactor = 1.0 - Math.sin((cycle / 0.15) * Math.PI) * 0.22;
        else if (cycle > 0.25 && cycle < 0.5) beatFactor = 1.0 + Math.sin(((cycle - 0.25) / 0.25) * Math.PI) * 0.10;
      } else {
        // Atrium: rileks → sedikit mengembang
        if (cycle < 0.3) beatFactor = 1.0 + Math.sin((cycle / 0.3) * Math.PI) * 0.06;
      }
    } else {
      // DIASTOLIK
      if (chamberType === "ventricle") {
        // Ventrikel: relaksasi → mengembang perlahan
        if (cycle < 0.5) beatFactor = 1.0 + Math.sin((cycle / 0.5) * Math.PI) * 0.18;
        else beatFactor = 1.0 + Math.sin(((cycle - 0.5) / 0.5) * Math.PI) * 0.06;
      } else {
        // Atrium: berkontraksi → mengecil mendorong darah ke ventrikel
        if (cycle < 0.2) beatFactor = 1.0 - Math.sin((cycle / 0.2) * Math.PI) * 0.15;
        else if (cycle > 0.2 && cycle < 0.5) beatFactor = 1.0 - Math.sin(((cycle - 0.2) / 0.3) * Math.PI) * 0.08;
      }
    }

    meshRef.current.scale.set(
      scaleX * beatFactor,
      scaleY * beatFactor,
      scaleZ * beatFactor
    );
  });

  return (
    <mesh ref={meshRef} position={position}>
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
// Partikel darah yang berubah warna
// ─────────────────────────────────────────────
function BloodParticles({ phase }: { phase: HeartPhase }) {
  const count = 350;
  const pointsRef = useRef<THREE.Points>(null);
  const scrubPercent = useHeartStore((state) => state.scrubPercent);

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

  // Sistolik: partikel berputar CEPAT (darah dipompa kencang)
  // Diastolik: partikel berputar LAMBAT (darah mengisi perlahan)
  const speedFactor = phase === HeartPhase.Systolic ? 0.45 : 0.08;
  const opacityValue = phase === HeartPhase.Systolic ? 0.75 : 0.4;

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = scrubPercent !== null ? (scrubPercent / 100) * 10 : state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * speedFactor;
    pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.12;
    // Fade material opacity in/out to reinforce phase feel
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacityValue, 0.05);
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
        color={phase === HeartPhase.Systolic ? "#E83030" : "#3A6BFF"}
        size={phase === HeartPhase.Systolic ? 0.055 : 0.038}
        transparent
        opacity={opacityValue}
        sizeAttenuation
      />
    </points>
  );
}

// ─────────────────────────────────────────────
// Saraf Konduksi Kelistrikan (Glowing Nodes)
// ─────────────────────────────────────────────
function ConductionSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const scrubPercent = useHeartStore((state) => state.scrubPercent);
  const isPlaying = useHeartStore((state) => state.isPlaying);
  const conductionStep = useHeartStore((state) => state.conductionStep);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Tentukan waktu berdasarkan scrub manual atau auto clock
    const time = scrubPercent !== null ? (scrubPercent / 100) * 1.0 : state.clock.elapsedTime;
    const cycle = time % 1.0; 

    groupRef.current.children.forEach((child, index) => {
      const activationTime = index * 0.1; 
      
      // Jika auto play, nyala bergantian sesuai waktu. Jika paused (isolate), nyala sesuai node terpilih.
      let isActive = false;
      if (isPlaying && scrubPercent === null) {
          isActive = cycle >= activationTime && cycle < activationTime + 0.15;
      } else if (!isPlaying) {
          isActive = index === conductionStep;
      } else if (scrubPercent !== null) {
          isActive = cycle >= activationTime && cycle < activationTime + 0.15;
      }

      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).color.set(isActive ? "#FFFFFF" : CONDUCTION_NODES[index].color);
        (mesh.material as THREE.MeshBasicMaterial).opacity = isActive ? 1 : 0.2;
        mesh.scale.setScalar(isActive ? 2.5 : 1.0);
      }
      
      const light = mesh.children[0] as THREE.PointLight;
      if (light) {
        light.intensity = isActive ? 3 : 0;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {CONDUCTION_NODES.map((node) => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial 
            color={node.color} 
            transparent 
            opacity={0.2} 
          />
          <pointLight color={node.color} intensity={0} distance={2} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// Indikator Hemodinamik Melayang (Toggle Overlay)
// ─────────────────────────────────────────────
function HemodynamicIndicators() {
  const show = useHeartStore((state) => state.showHemodynamicIndicators);
  const phase = useHeartStore((state) => state.phase);

  if (!show) return null;

  return (
    <>
      <Html position={[0.1, 0.4, 0.1]} center zIndexRange={[100, 0]}>
        <div className="px-2 py-1 bg-[var(--bg-main)]/80 border border-[var(--border-strong)] backdrop-blur-sm rounded-md whitespace-nowrap text-[8px] font-bold tracking-widest uppercase text-[var(--text-primary)] shadow-lg pointer-events-none transition-all">
          Katup Aorta: <span className={phase === HeartPhase.Systolic ? "text-[var(--color-accent-secondary)]" : "text-red-500"}>
            {phase === HeartPhase.Systolic ? "TERBUKA" : "TERTUTUP"}
          </span>
        </div>
      </Html>
      <Html position={[-0.2, 0.2, -0.1]} center zIndexRange={[100, 0]}>
        <div className="px-2 py-1 bg-[var(--bg-main)]/80 border border-[var(--border-strong)] backdrop-blur-sm rounded-md whitespace-nowrap text-[8px] font-bold tracking-widest uppercase text-[var(--text-primary)] shadow-lg pointer-events-none transition-all">
          Katup Mitral: <span className={phase === HeartPhase.Diastolic ? "text-[var(--color-accent-secondary)]" : "text-red-500"}>
            {phase === HeartPhase.Diastolic ? "TERBUKA" : "TERTUTUP"}
          </span>
        </div>
      </Html>
    </>
  );
}

// ─────────────────────────────────────────────
// Komponen Utama Heart Model
// ─────────────────────────────────────────────
interface HeartModelProps {
  scale?: number;
  interactive?: boolean;
  onPartClick?: (partId: string) => void;
  activeCase?: string | null;
}

export default function HeartModel({ scale = 1, activeCase = null }: HeartModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useHeartStore((state) => state.phase);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Rotation and float always run from real clock — never frozen by scrubPercent
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Ventrikel Kiri */}
      <HeartChamber
        position={[-0.28, -0.18, 0]}
        color="#8b1a1a"
        scaleX={activeCase === "case-002" ? 1.2 : 0.9}
        scaleY={activeCase === "case-002" ? 1.3 : 1.1}
        scaleZ={activeCase === "case-002" ? 1.1 : 0.8}
        pulseDelay={0}
        phase={phase}
        chamberType="ventricle"
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
        chamberType="ventricle"
      />

      {/* Atrium Kiri */}
      <HeartChamber
        position={[-0.22, 0.45, -0.1]}
        color="#6b1414"
        scaleX={activeCase === "case-001" ? 0.9 : 0.6}
        scaleY={activeCase === "case-001" ? 0.8 : 0.5}
        scaleZ={activeCase === "case-001" ? 0.9 : 0.6}
        pulseDelay={-0.3}
        phase={phase}
        chamberType="atrium"
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
        chamberType="atrium"
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

      {/* Saraf Konduksi Kelistrikan Overlay */}
      <ConductionSystem />

      {/* Indikator Melayang (aktif saat toggle dinyalakan di halaman Hemodinamik) */}
      <HemodynamicIndicators />

      <pointLight
        position={[0, 0, 1.5]}
        intensity={phase === HeartPhase.Systolic ? 2.5 : 0.4}
        color={phase === HeartPhase.Systolic ? "#E83030" : "#3A6BFF"}
        distance={5}
      />
      {/* Extra fill for diastolic to show chamber expansion */}
      <pointLight
        position={[0, 0, -1.5]}
        intensity={phase === HeartPhase.Diastolic ? 1.5 : 0.1}
        color="#3A6BFF"
        distance={4}
      />
    </group>
  );
}

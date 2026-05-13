"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ANATOMY_PARTS } from "@/lib/mock-data";
import { AnatomyPart } from "@/core/types";

useGLTF.preload("/models/heart.glb");

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

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onPointerDown={(e: any) => {
        e.stopPropagation();
        console.log(
          "📍 Koordinat klik [x, y, z]:",
          e.point.x.toFixed(3),
          e.point.y.toFixed(3),
          e.point.z.toFixed(3)
        );
      }}
    >
      <primitive object={cloned} />
    </group>
  );
}

// ─── Titik Annotasi ───────────────────────────────────────────
function Annotation({
  part,
  isSelected,
  onSelect,
}: {
  part: AnatomyPart;
  isSelected: boolean;
  onSelect: (p: AnatomyPart) => void;
}) {
  return (
    <Html position={part.position} distanceFactor={8} zIndexRange={[100, 0]}>
      <div className="relative flex flex-col items-center group">
        <button
          onClick={() => onSelect(part)}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            isSelected
              ? "bg-blue-500 border-white scale-125 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
              : "bg-white/70 border-blue-400 hover:bg-blue-200"
          }`}
          title={part.label}
        />
        <div
          className={`mt-2 px-2 py-1 rounded bg-white/95 border border-blue-100 shadow-sm transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-tighter">
            {part.label}
          </span>
        </div>
      </div>
    </Html>
  );
}

// ─── Camera Zoom Controller ───────────────────────────────────
// Menggerakkan kamera mendekati/menjauhi pivotPoint secara smooth
function CameraZoomController({
  targetZ,
  pivotPoint,
}: {
  targetZ: number;
  pivotPoint: THREE.Vector3;
}) {
  const { camera } = useThree();

  useFrame(() => {
    // Hitung arah dari pivot ke kamera
    const dir = camera.position.clone().sub(pivotPoint).normalize();
    // Hitung jarak saat ini
    const currentDist = camera.position.distanceTo(pivotPoint);
    // Lerp jarak menuju targetZ
    const newDist = currentDist + (targetZ - currentDist) * 0.1;
    // Update posisi kamera sepanjang arah yang sama (tidak mengubah sudut orbit)
    camera.position.copy(pivotPoint).addScaledVector(dir, newDist);
    camera.updateProjectionMatrix();
  });

  return null;
}

// ─── Scene Utama ──────────────────────────────────────────────
function AnatomyScene({
  selectedPart,
  onSelectPart,
  heartPosition,
  heartScale,
  cameraZ,
}: {
  selectedPart: AnatomyPart | null;
  onSelectPart: (p: AnatomyPart) => void;
  heartPosition: [number, number, number];
  heartScale: number;
  cameraZ: number;
}) {
  const controlsRef = useRef<any>(null);

  // ✅ Kunci pivot OrbitControls TEPAT di titik pusat jantung.
  // Target tidak pernah berubah sehingga model tidak drift
  // saat zoom in/out atau saat rotasi.
  const pivotPoint = useMemo(
    () => new THREE.Vector3(...heartPosition),
    [heartPosition]
  );

  useFrame(() => {
    if (!controlsRef.current) return;
    // Paksa target selalu kembali ke pivot — tidak bergerak kemana-mana
    controlsRef.current.target.copy(pivotPoint);
    controlsRef.current.update();
  });

  return (
    <>
      <CameraZoomController targetZ={cameraZ} pivotPoint={pivotPoint} />

      <Suspense fallback={null}>
        <HeartModel scale={heartScale} position={heartPosition} />
        {ANATOMY_PARTS.map((part) => (
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
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        makeDefault
      />
    </>
  );
}

// ─── Export Utama ─────────────────────────────────────────────
export interface AnatomyCanvasProps {
  selectedPart: AnatomyPart | null;
  onSelectPart: (p: AnatomyPart) => void;
  heartPosition?: [number, number, number];
  heartScale?: number;
}

// Batas zoom: semakin kecil = makin dekat (zoom in), semakin besar = makin jauh (zoom out)
const ZOOM_MIN = 1.5;   // 100% zoom
const ZOOM_MAX = 8.0;   // 0% zoom
const ZOOM_DEFAULT_INDEX = 0; // Default 0% zoom (farthest)

export default function AnatomyCanvas({
  selectedPart,
  onSelectPart,
  heartPosition = [0.5, 0, 0],
  heartScale = 5,
}: AnatomyCanvasProps) {
  // Gunakan index 0-10 untuk mewakili 0%, 10%, ..., 100%
  const [zoomIndex, setZoomIndex] = useState(ZOOM_DEFAULT_INDEX);

  const zoomIn  = () => setZoomIndex((prev) => Math.min(10, prev + 1));
  const zoomOut = () => setZoomIndex((prev) => Math.max(0, prev - 1));
  const resetZoom = () => setZoomIndex(ZOOM_DEFAULT_INDEX);

  // Hitung cameraZ berdasarkan zoomIndex (interpolasi linear antara MAX dan MIN)
  // 0% (index 0) = ZOOM_MAX
  // 100% (index 10) = ZOOM_MIN
  const cameraZ = ZOOM_MAX - (zoomIndex / 10) * (ZOOM_MAX - ZOOM_MIN);
  const zoomPercent = zoomIndex * 10;

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <Canvas
        camera={{ position: [0, 0, ZOOM_MAX - (ZOOM_DEFAULT_INDEX / 10) * (ZOOM_MAX - ZOOM_MIN)], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.8} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={3} castShadow />
        <pointLight position={[-10, -5, -10]} intensity={2} color="#e0f2fe" />
        <directionalLight position={[0, 5, 5]} intensity={1} />

        <AnatomyScene
          selectedPart={selectedPart}
          onSelectPart={onSelectPart}
          heartPosition={heartPosition}
          heartScale={heartScale}
          cameraZ={cameraZ}
        />
      </Canvas>

      {/* ── Tombol Zoom (overlay di atas canvas) ── */}
      <div className="absolute bottom-6 right-6 flex flex-col items-center gap-1 z-20">
        {/* Zoom In */}
        <button
          onClick={zoomIn}
          disabled={zoomIndex >= 10}
          className="w-9 h-9 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-slate-700 font-bold text-lg hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          +
        </button>

        {/* Indikator zoom */}
        <div className="flex flex-col items-center gap-1 py-2">
          <div className="w-px h-16 bg-slate-200 relative rounded-full overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-full transition-all duration-300"
              style={{ height: `${zoomPercent}%` }}
            />
          </div>
          <span className="text-[9px] font-bold text-slate-400 tracking-widest">
            {zoomPercent}%
          </span>
        </div>

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          disabled={zoomIndex <= 0}
          className="w-9 h-9 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-slate-700 font-bold text-lg hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          −
        </button>

        {/* Reset zoom */}
        <button
          onClick={resetZoom}
          className="mt-1 w-9 h-9 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-slate-400 text-xs hover:bg-slate-50 active:scale-95 transition-all"
          title="Reset Zoom"
        >
          ⊙
        </button>
      </div>
    </div>
  );
}

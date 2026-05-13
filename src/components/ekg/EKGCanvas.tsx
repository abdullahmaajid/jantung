"use client";

// =============================================================
// src/components/ekg/EKGCanvas.tsx
//
// Komponen EKG interaktif berbasis SVG
// Mensimulasikan gelombang P-QRS-T sesuai fase jantung
// =============================================================

import { useEffect, useRef } from "react";
import { HeartPhase } from "@/core/types";
import useHeartStore from "@/store/heartStore";

// Tipe untuk satu titik dalam path EKG
type EKGPoint = { x: number; y: number };

// Fungsi murni (pure function) untuk generate path EKG
// BEST PRACTICE: Logika dipisah dari rendering UI
function generateEKGPath(width: number, height: number, offset: number): string {
  const mid = height / 2;
  const points: EKGPoint[] = [];
  const cycleWidth = 200; // Lebar satu siklus jantung dalam pixel

  // Satu siklus EKG: baseline → P wave → QRS complex → T wave → baseline
  const cycle = [
    { x: 0, y: 0 },           // Baseline
    { x: 20, y: 0 },
    { x: 30, y: -8 },         // P wave (atrial depolarisasi)
    { x: 40, y: 0 },
    { x: 50, y: 0 },
    { x: 60, y: 5 },          // Q wave
    { x: 65, y: -50 },        // R wave (puncak QRS)
    { x: 70, y: 10 },         // S wave
    { x: 80, y: 0 },
    { x: 100, y: 0 },
    { x: 115, y: -15 },       // T wave (ventricular repolarisasi)
    { x: 135, y: 0 },
    { x: cycleWidth, y: 0 },  // Kembali ke baseline
  ];

  // Generate titik-titik untuk seluruh lebar canvas
  for (let cycleX = -offset % cycleWidth; cycleX < width + cycleWidth; cycleX += cycleWidth) {
    cycle.forEach((point) => {
      points.push({
        x: cycleX + point.x,
        y: mid + point.y,
      });
    });
  }

  // Konversi array points ke SVG path string
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

interface EKGCanvasProps {
  height?: number;
  className?: string;
}

export default function EKGCanvas({ height = 80, className = "" }: EKGCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const animFrameRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  
  const phase = useHeartStore((state) => state.phase);
  const isPlaying = useHeartStore((state) => state.isPlaying);

  // Kecepatan scroll EKG berdasarkan fase
  const speed = phase === HeartPhase.Systolic ? 2.5 : 1.5;

  useEffect(() => {
    if (!svgRef.current || !pathRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth || 600;

    const animate = () => {
      if (!pathRef.current) return;
      
      offsetRef.current += speed;
      pathRef.current.setAttribute("d", generateEKGPath(width, height, offsetRef.current));
      
      animFrameRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(animate);
    }

    // Cleanup: PENTING untuk mencegah memory leak!
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, speed, height]);

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="swiss-label">Monitor EKG</span>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: isPlaying ? "#00ff88" : "#888",
            }}
          />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {isPlaying ? "LIVE" : "PAUSED"}
          </span>
        </div>
      </div>
      
      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{
          background: "rgba(0, 10, 5, 0.8)",
          border: "1px solid rgba(0, 255, 100, 0.15)",
          borderRadius: "4px",
        }}
      >
        {/* Grid horizontal */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={(height / 4) * i}
            x2="100%"
            y2={(height / 4) * i}
            stroke="rgba(0, 255, 100, 0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Garis tengah (baseline) */}
        <line
          x1="0"
          y1={height / 2}
          x2="100%"
          y2={height / 2}
          stroke="rgba(0, 255, 100, 0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Gelombang EKG utama */}
        <path
          ref={pathRef}
          d={generateEKGPath(600, height, 0)}
          fill="none"
          stroke={phase === HeartPhase.Systolic ? "#ff4444" : "#00ff88"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Glow effect pada gelombang */}
        <path
          d={generateEKGPath(600, height, 0)}
          fill="none"
          stroke={phase === HeartPhase.Systolic ? "#ff444440" : "#00ff8840"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "blur(3px)" }}
        />
      </svg>
      
      {/* BPM indicator */}
      <div className="flex justify-end mt-1 px-1">
        <span
          className="text-xs font-mono font-bold"
          style={{ color: phase === HeartPhase.Systolic ? "#ff4444" : "#00ff88" }}
        >
          {phase === HeartPhase.Systolic ? "72" : "60"} BPM
        </span>
      </div>
    </div>
  );
}

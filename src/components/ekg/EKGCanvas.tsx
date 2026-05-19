"use client";

// =============================================================
// src/components/ekg/EKGCanvas.tsx
//
// Komponen EKG interaktif berbasis SVG — Theme-Aware
// Dark Mode  → Retro medical phosphor green CRT monitor
// Light Mode → Clean clinical navy on white
// =============================================================

import { useEffect, useRef } from "react";
import { HeartPhase } from "@/core/types";
import useHeartStore from "@/store/heartStore";

type EKGPoint = { x: number; y: number };

function generateEKGPath(width: number, height: number, offset: number): string {
  const mid = height / 2;
  const points: EKGPoint[] = [];
  const cycleWidth = 200;

  const cycle = [
    { x: 0,   y: 0  },
    { x: 20,  y: 0  },
    { x: 30,  y: -8  },   // P wave
    { x: 40,  y: 0  },
    { x: 50,  y: 0  },
    { x: 60,  y: 5  },    // Q wave
    { x: 65,  y: -50 },   // R wave
    { x: 70,  y: 10  },   // S wave
    { x: 80,  y: 0  },
    { x: 100, y: 0  },
    { x: 115, y: -15 },   // T wave
    { x: 135, y: 0  },
    { x: cycleWidth, y: 0 },
  ];

  for (let cycleX = -offset % cycleWidth; cycleX < width + cycleWidth; cycleX += cycleWidth) {
    cycle.forEach((point) => {
      points.push({ x: cycleX + point.x, y: mid + point.y });
    });
  }

  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

interface EKGCanvasProps {
  height?: number;
  className?: string;
}

export default function EKGCanvas({ height = 80, className = "" }: EKGCanvasProps) {
  const svgRef      = useRef<SVGSVGElement>(null);
  const pathRef     = useRef<SVGPathElement>(null);
  const glowRef     = useRef<SVGPathElement>(null);
  const animFrameRef = useRef<number>(0);
  const offsetRef   = useRef<number>(0);

  const phase    = useHeartStore((s) => s.phase);
  const isPlaying = useHeartStore((s) => s.isPlaying);
  const theme    = useHeartStore((s) => s.theme);
  const isDark   = theme === "dark";

  // ─── Color Presets ─────────────────────────────────────────
  const colors = isDark
    ? {
        bg:        "rgba(0, 10, 5, 0.88)",
        border:    "rgba(0, 255, 100, 0.15)",
        grid:      "rgba(0, 255, 100, 0.05)",
        baseline:  "rgba(0, 255, 100, 0.12)",
        wave:      phase === HeartPhase.Systolic ? "#ff4444" : "#00ff88",
        glow:      phase === HeartPhase.Systolic ? "#ff444440" : "#00ff8840",
        live:      isPlaying ? "#00ff88" : "#444",
        bpm:       phase === HeartPhase.Systolic ? "#ff4444" : "#00ff88",
        label:     "rgba(0,255,100,0.5)",
      }
    : {
        bg:        "rgba(241, 245, 249, 0.95)",
        border:    "rgba(15, 23, 130, 0.18)",
        grid:      "rgba(15, 23, 130, 0.04)",
        baseline:  "rgba(15, 23, 130, 0.10)",
        wave:      phase === HeartPhase.Systolic ? "#c0392b" : "#1a56db",
        glow:      phase === HeartPhase.Systolic ? "#c0392b28" : "#1a56db25",
        live:      isPlaying ? "#1a56db" : "#aaa",
        bpm:       phase === HeartPhase.Systolic ? "#c0392b" : "#1a56db",
        label:     "rgba(15,23,130,0.5)",
      };

  const speed = phase === HeartPhase.Systolic ? 2.5 : 1.5;

  useEffect(() => {
    if (!svgRef.current || !pathRef.current) return;
    const svg   = svgRef.current;
    const width = svg.clientWidth || 600;

    const animate = () => {
      if (!pathRef.current) return;
      offsetRef.current += speed;
      const d = generateEKGPath(width, height, offsetRef.current);
      pathRef.current.setAttribute("d", d);
      if (glowRef.current) glowRef.current.setAttribute("d", d);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isPlaying, speed, height]);

  return (
    <div className={`relative ${className}`}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: colors.label }}>
          Monitor EKG
        </span>
        <div className="flex items-center gap-2">
          <div
            className={isPlaying ? "animate-live-blink w-2 h-2" : "w-2 h-2"}
            style={{ backgroundColor: colors.live }}
          />
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: colors.label }}>
            {isPlaying ? "LIVE" : "PAUSED"}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
      >
        {/* Grid */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1="0" y1={(height / 4) * i} x2="100%" y2={(height / 4) * i}
            stroke={colors.grid} strokeWidth="1" />
        ))}

        {/* Baseline */}
        <line x1="0" y1={height / 2} x2="100%" y2={height / 2}
          stroke={colors.baseline} strokeWidth="1" strokeDasharray="4 4" />

        {/* Glow trace */}
        <path ref={glowRef} d={generateEKGPath(600, height, 0)} fill="none"
          stroke={colors.glow} strokeWidth="7" strokeLinecap="round"
          style={{ filter: "blur(4px)" }} />

        {/* Main EKG trace */}
        <path ref={pathRef} d={generateEKGPath(600, height, 0)} fill="none"
          stroke={colors.wave} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* BPM */}
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: colors.label }}>
          {isDark ? "II" : "Lead II"}
        </span>
        <span className="text-[10px] font-mono font-bold" style={{ color: colors.bpm }}>
          {phase === HeartPhase.Systolic ? "72" : "60"} BPM
        </span>
      </div>
    </div>
  );
}


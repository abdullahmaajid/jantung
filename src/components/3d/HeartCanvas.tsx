"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

interface HeartCanvasProps {
  height?: string;
  interactive?: boolean;
  showOrbitControls?: boolean;
  showStars?: boolean;
  children?: React.ReactNode;
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
        {/* Bright Clinical Studio Lighting */}
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={3} 
          castShadow 
        />
        <pointLight position={[-10, -5, -10]} intensity={2} color="#e0f2fe" />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        
        <Suspense fallback={<Html center className="text-blue-500 font-premium tracking-widest animate-pulse">PULSE_SYNC_LOADING...</Html>}>
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
      
      {/* Subtle Clinical Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-blue-50/20 to-transparent" />

    </div>
  );
}

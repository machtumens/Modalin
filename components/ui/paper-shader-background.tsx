"use client";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ShaderPlane = dynamic(
  () => import("@/components/background-paper-shaders").then((m) => m.ShaderPlane),
  { ssr: false }
);

export function PaperShaderBackground({
  intensity = 0.6,
  className,
}: {
  intensity?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Soft cream paper base */}
      <div className="absolute inset-0 bg-[#fafaf7]" />
      {/* Grain texture via CSS */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>\")",
        }}
      />
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          camera={{ position: [0, 0, 1.5], fov: 60 }}
          style={{ position: "absolute", inset: 0, opacity: intensity }}
        >
          <ambientLight intensity={0.8} />
          {/* Two large slow planes — emerald + warm gold whisper */}
          <ShaderPlane position={[-0.6, 0.3, 0]} color1="#0f766e" color2="#fafaf7" />
          <ShaderPlane position={[0.5, -0.2, 0.1]} color1="#f59e0b" color2="#fafaf7" />
          <ShaderPlane position={[0, 0, 0.2]} color1="#71717a" color2="#fafaf7" />
        </Canvas>
      </Suspense>
      {/* Top fade for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fafaf7]" />
    </div>
  );
}

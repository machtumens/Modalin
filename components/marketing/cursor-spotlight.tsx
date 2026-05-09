"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorSpotlight() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 80, damping: 18, mass: 0.6 });
  const [enabled, setEnabled] = useState(true);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnabled(false);
      return;
    }
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  useEffect(() => {
    if (!enabled) return;
    const unsubX = sx.on("change", (v) => {
      glowRef.current?.style.setProperty("--mx", `${v}px`);
    });
    const unsubY = sy.on("change", (v) => {
      glowRef.current?.style.setProperty("--my", `${v}px`);
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [enabled, sx, sy]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx, -1000px) var(--my, -1000px), rgba(45,212,191,0.10), transparent 55%)",
        }}
      />
      <motion.div
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed -left-1.5 -top-1.5 z-[60] hidden h-3 w-3 rounded-full bg-brand-300 mix-blend-difference md:block"
      />
    </>
  );
}

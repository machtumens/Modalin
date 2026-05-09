"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed left-0 right-0 top-0 z-[70] h-[2px] bg-linear-to-r from-brand-400 via-gold-400 to-brand-400 shadow-[0_0_12px_rgba(45,212,191,0.7)]"
    />
  );
}

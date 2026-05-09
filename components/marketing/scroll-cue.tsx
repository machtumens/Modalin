"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollCue() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useMotionValueEvent(scrollY, "change", (v) => {
    setHidden(v > 320);
  });

  if (hidden) return null;

  const onClick = () => {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
  };

  return (
    <motion.button
      style={{ opacity }}
      onClick={onClick}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="group fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-full border border-gold-400/30 bg-zinc-950/70 px-4 py-2 backdrop-blur-md hover:border-gold-400/60 md:flex"
      aria-label="Scroll untuk lihat lebih banyak"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-300">
          Lebih banyak di bawah
        </span>
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-zinc-950 shadow-[0_0_16px_rgba(251,191,36,0.6)]"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </div>
    </motion.button>
  );
}

export function ScrollHintInline() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY < 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-12 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-500"
    >
      <span className="text-zinc-400">9 sections menanti</span>
      <span className="hairline w-12 opacity-70" />
      <motion.span
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
        className="text-gold-300"
      >
        ↓
      </motion.span>
    </motion.div>
  );
}

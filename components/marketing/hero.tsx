"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "./magnetic";
import { ScrambleText } from "./scramble-text";
import { FeatureDeck } from "./feature-deck";
import { ScrollHintInline } from "./scroll-cue";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const titleRotY = useTransform(sx, [-0.5, 0.5], [-3, 3]);
  const titleRotX = useTransform(sy, [-0.5, 0.5], [2, -2]);
  const blob1X = useTransform(sx, [-0.5, 0.5], [-40, 40]);
  const blob1Y = useTransform(sy, [-0.5, 0.5], [-40, 40]);
  const blob2X = useTransform(sx, [-0.5, 0.5], [50, -50]);
  const blob2Y = useTransform(sy, [-0.5, 0.5], [25, -25]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  const stagger = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: reduce ? 0 : 0.04, duration: 0.25 } },
  };
  const child = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <section
      ref={ref}
      className="relative scene-3d flex min-h-[100vh] items-center overflow-hidden bg-zinc-950"
      aria-label="Modalin hero"
    >
      <ParticleField />
      <WireframeIcosahedron sx={sx} sy={sy} reduce={reduce} />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="aurora-blob"
          style={{
            x: blob1X,
            y: blob1Y,
            top: "-15%",
            left: "-10%",
            width: 800,
            height: 800,
            background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)",
          }}
        />
        <motion.div
          className="aurora-blob"
          style={{
            x: blob2X,
            y: blob2Y,
            top: "5%",
            right: "-15%",
            width: 700,
            height: 700,
            background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            bottom: "-25%",
            left: "30%",
            width: 900,
            height: 900,
            background: "radial-gradient(circle, #0f766e 0%, transparent 65%)",
          }}
        />
        <div className="perspective-floor" />
        <div className="perspective-floor top" />
        <div className="absolute inset-0 noise-layer" />
      </div>

      <motion.div
        style={{ y: y1, opacity }}
        className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-28"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={child}>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-300 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                </span>
                <ScrambleText text="100% Bagi Hasil · Sharia · Live demo" />
              </div>
            </motion.div>

            <motion.h1
              variants={child}
              style={{ rotateX: titleRotX, rotateY: titleRotY, transformStyle: "preserve-3d" }}
              className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Modal untuk{" "}
              <span className="relative inline-block">
                <span className="serif-italic gold-foil">UMKM bertumbuh</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: "circOut" }}
                  style={{ transformOrigin: "left" }}
                  className="absolute -bottom-1 left-0 h-[2px] w-full bg-linear-to-r from-gold-400 via-gold-200 to-transparent"
                />
              </span>
              ,
              <br />
              akses untuk <span className="serif-italic platinum-foil">investor baru</span>.
            </motion.h1>

            <motion.p variants={child} className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Platform equity crowdfunding pertama Indonesia yang terintegrasi dengan rekening bank UMKM.
              Investasi mulai{" "}
              <span className="font-semibold text-white">Rp100.000</span>, transparansi real-time, 100% bagi hasil ekuitas.
            </motion.p>

            <motion.div variants={child} className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Button asChild size="lg" className="group relative overflow-hidden bg-brand-500 text-zinc-950 shadow-[0_0_50px_-8px_rgba(45,212,191,0.7)] hover:bg-brand-400">
                  <Link href="/marketplace">
                    <span className="relative z-10 flex items-center gap-2">
                      Mulai Investasi Rp100rb
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Button asChild size="lg" variant="outline" className="border-zinc-700 bg-zinc-900/40 text-white backdrop-blur hover:border-brand-400 hover:bg-zinc-900/60 hover:text-brand-300">
                  <Link href="/untuk-umkm">Daftarkan UMKM Anda</Link>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div variants={child} className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
              <MicroStat label="Min ticket" value="Rp100rb" />
              <MicroStat label="Mitra BPR" value="8 kota" />
              <MicroStat label="Bagi hasil" value="100%" />
            </motion.div>

            <motion.div variants={child}>
              <ScrollHintInline />
            </motion.div>
          </motion.div>

          {/* Right — interactive feature deck */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
            <FeatureDeck />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function MicroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 font-display text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 14,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-brand-300"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -60, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function WireframeIcosahedron({
  sx,
  sy,
  reduce,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean | null;
}) {
  const rx = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const ry = useTransform(sx, [-0.5, 0.5], [-15, 15]);
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className="pointer-events-none absolute right-1/2 top-1/2 hidden h-96 w-96 -translate-y-1/2 translate-x-1/2 opacity-15 lg:block"
    >
      <motion.svg
        viewBox="-100 -100 200 200"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        className="absolute inset-0 h-full w-full"
      >
        <g stroke="#fbbf24" strokeWidth="0.4" fill="none">
          <polygon points="0,-80 76,-25 47,65 -47,65 -76,-25" />
          <polygon points="0,80 -76,25 -47,-65 47,-65 76,25" />
          <circle r="80" />
          <circle r="60" />
          <circle r="40" />
          <line x1="-80" y1="0" x2="80" y2="0" />
          <line x1="0" y1="-80" x2="0" y2="80" />
        </g>
      </motion.svg>
    </motion.div>
  );
}

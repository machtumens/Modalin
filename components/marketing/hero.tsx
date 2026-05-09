"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  animate,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Wallet, Zap, Banknote, Activity, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "./magnetic";
import { ScrambleText } from "./scramble-text";

const orbitItems = [
  { icon: Wallet, label: "BPR Account", angle: 0, radius: 200, z: 60 },
  { icon: Banknote, label: "Bagi Hasil", angle: 60, radius: 240, z: -40 },
  { icon: TrendingUp, label: "Live Tx", angle: 120, radius: 220, z: 80 },
  { icon: Sparkles, label: "AI Score", angle: 180, radius: 250, z: -60 },
  { icon: Zap, label: "Reimburse", angle: 240, radius: 210, z: 40 },
  { icon: Activity, label: "Open Banking", angle: 300, radius: 230, z: 20 },
];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const sceneRotX = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const sceneZ = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const stackRotX = useTransform(sy, [-0.5, 0.5], [15, -15]);
  const stackRotY = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const titleRotY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const titleRotX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const blob1X = useTransform(sx, [-0.5, 0.5], [-50, 50]);
  const blob1Y = useTransform(sy, [-0.5, 0.5], [-50, 50]);
  const blob2X = useTransform(sx, [-0.5, 0.5], [60, -60]);
  const blob2Y = useTransform(sy, [-0.5, 0.5], [30, -30]);
  const orbitRotY = useTransform(sx, [-0.5, 0.5], [-25, 25]);
  const orbitRotX = useTransform(sy, [-0.5, 0.5], [25, -25]);

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
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: reduce ? 0 : 0.09 } },
  };
  const child = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0 },
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
        style={{ y: y1, opacity, rotateX: sceneRotX, z: sceneZ, transformStyle: "preserve-3d" }}
        className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8 lg:pt-32"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial="hidden" animate="show" variants={stagger} className="preserve-3d">
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
              className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              <SpatialWord text="Modal" z={20} />{" "}
              <SpatialWord text="untuk" z={-15} />{" "}
              <span className="relative inline-block" style={{ transform: "translateZ(40px)" }}>
                <span className="shimmer-text">UMKM bertumbuh</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "circOut" }}
                  style={{ transformOrigin: "left" }}
                  className="absolute -bottom-1 left-0 h-[3px] w-full bg-linear-to-r from-brand-400 via-gold-400 to-transparent"
                />
              </span>
              ,
              <br />
              <SpatialWord text="akses" z={10} />{" "}
              <SpatialWord text="untuk" z={-20} />{" "}
              <span style={{ transform: "translateZ(30px)" }}>
                <span className="shimmer-text">investor baru</span>.
              </span>
            </motion.h1>

            <motion.p
              variants={child}
              style={{ transform: "translateZ(15px)" }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
            >
              Platform equity crowdfunding pertama Indonesia yang terintegrasi dengan rekening bank UMKM.
              Investasi mulai{" "}
              <span className="font-semibold text-white">Rp100.000</span>, transparansi real-time, 100% bagi hasil ekuitas.
            </motion.p>

            <motion.div
              variants={child}
              style={{ transform: "translateZ(50px)" }}
              className="mt-10 flex flex-wrap gap-3"
            >
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

            <motion.div
              variants={child}
              style={{ transform: "translateZ(25px)" }}
              className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-zinc-800 pt-6"
            >
              <MicroStat label="Min ticket" value="Rp100rb" />
              <MicroStat label="Mitra BPR" value="8 kota" />
              <MicroStat label="Bagi hasil" value="100%" />
            </motion.div>
          </motion.div>

          {/* Right — 3D layered panel stack */}
          <motion.div style={{ rotateX: orbitRotX, rotateY: orbitRotY, transformStyle: "preserve-3d", perspective: 1600 }} className="relative h-[560px]">
            <Orbits3D items={orbitItems} reduce={reduce} />
            <PanelStack rotX={stackRotX} rotY={stackRotY} />
            <div className="pointer-events-none absolute -inset-x-10 -bottom-10 h-40 rounded-full bg-brand-500/40 blur-3xl" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500 md:flex"
        >
          Scroll
          <span className="h-12 w-px animate-[float-slow_2s_ease-in-out_infinite] bg-linear-to-b from-brand-400 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function SpatialWord({ text, z }: { text: string; z: number }) {
  return (
    <motion.span
      whileHover={{ z: z + 30, scale: 1.05 }}
      style={{ display: "inline-block", transform: `translateZ(${z}px)` }}
      className="text-white"
    >
      {text}
    </motion.span>
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

function PanelStack({
  rotX,
  rotY,
}: {
  rotX: MotionValue<number>;
  rotY: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* back panel */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        style={{ transform: "translateZ(-80px) translateX(-50px) translateY(-40px) rotate(-6deg)" }}
        className="absolute h-44 w-72 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur"
      >
        <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">layer.back</div>
        <div className="mt-3 space-y-2">
          <MiniLine label="UMKM kumulatif" v="528" />
          <MiniLine label="Investor" v="26.4rb" />
          <MiniLine label="AUM Y3" v="40,68 M" />
        </div>
      </motion.div>

      {/* mid panel */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
        style={{ transform: "translateZ(0px) translateX(40px) translateY(20px) rotate(4deg)" }}
        className="absolute h-52 w-80 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur shadow-[0_30px_80px_-30px_rgba(45,212,191,0.4)]"
      >
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500">
          <span>layer.mid</span>
          <span className="font-mono">EBITDA</span>
        </div>
        <div className="mt-3">
          <MiniSparkline />
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-white">+Rp 417 jt</span>
            <span className="rounded bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-300 ring-1 ring-inset ring-brand-400/30">+11%</span>
          </div>
        </div>
      </motion.div>

      {/* front panel — main */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
        style={{ transform: "translateZ(80px)" }}
        className="card-dark glow-ring relative h-72 w-80 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-[pulse-glow_2s_ease-in-out_infinite]" />
            Live activity
          </div>
          <span className="text-xs font-mono text-zinc-500">DEMO</span>
        </div>
        <div className="mt-4 space-y-2.5">
          <StatRow icon={Wallet} label="Funding gap" value="Rp1.605 T" />
          <StatRow icon={TrendingUp} label="Investor ritel" value="14,8 jt" />
          <StatRow icon={Sparkles} label="Min ticket" value="Rp100.000" highlight />
        </div>
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            tx.live
          </div>
          <TickerLine />
        </div>
        <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-xl border border-brand-400/40 bg-zinc-950 text-brand-300 shadow-[0_0_30px_-5px_rgba(45,212,191,0.6)]" style={{ transform: "translateZ(40px)" }}>
          <Layers className="h-5 w-5" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function MiniLine({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-zinc-500">{label}</span>
      <span className="font-mono font-semibold text-white">{v}</span>
    </div>
  );
}

function MiniSparkline() {
  return (
    <svg viewBox="0 0 200 60" className="h-12 w-full">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        d="M 0 50 L 30 45 L 60 48 L 90 38 L 120 30 L 150 22 L 180 12 L 200 8"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="2"
      />
      <path d="M 0 50 L 30 45 L 60 48 L 90 38 L 120 30 L 150 22 L 180 12 L 200 8 L 200 60 L 0 60 Z" fill="url(#spark)" />
    </svg>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-2 last:border-0 last:pb-0">
      <div className="flex items-center gap-2.5">
        <div className={`flex h-7 w-7 items-center justify-center rounded-md ${highlight ? "bg-gold-500/15 text-gold-400" : "bg-brand-400/10 text-brand-300"}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs text-zinc-400">{label}</span>
      </div>
      <span className={`font-display text-sm font-semibold ${highlight ? "text-gold-400" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

function TickerLine() {
  const v = useMotionValue(0);
  const [n, setN] = useState(2_450_000);
  useEffect(() => {
    const c = animate(v, 8_320_000, { duration: 4, ease: "easeOut", repeat: Infinity, repeatType: "reverse" });
    const u = v.on("change", (x) => setN(Math.round(x)));
    return () => {
      c.stop();
      u();
    };
  }, [v]);
  return (
    <div className="mt-1.5 flex items-baseline justify-between font-mono text-xs">
      <span className="text-zinc-400">+ masuk</span>
      <span className="text-brand-300 tabular-nums">Rp {n.toLocaleString("id-ID")}</span>
    </div>
  );
}

function Orbits3D({ items, reduce }: { items: typeof orbitItems; reduce: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" style={{ transformStyle: "preserve-3d" }}>
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          className="absolute left-1/2 top-1/2"
          animate={reduce ? {} : { rotate: 360 }}
          transition={{ duration: 28 + i * 4, ease: "linear", repeat: Infinity }}
          style={{ width: 0, height: 0, transformStyle: "preserve-3d" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.7 }}
            style={{
              transform: `rotate(${it.angle}deg) translateX(${it.radius}px) translateZ(${it.z}px) rotate(-${it.angle}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="absolute"
          >
            <motion.div
              animate={reduce ? {} : { rotate: -360 }}
              transition={{ duration: 28 + i * 4, ease: "linear", repeat: Infinity }}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 backdrop-blur shadow-[0_0_24px_rgba(45,212,191,0.2)]"
            >
              <it.icon className="h-3.5 w-3.5 text-brand-300" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-300">
                {it.label}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
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
      className="pointer-events-none absolute right-1/2 top-1/2 hidden h-96 w-96 -translate-y-1/2 translate-x-1/2 opacity-20 lg:block"
    >
      <motion.svg
        viewBox="-100 -100 200 200"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        className="absolute inset-0 h-full w-full"
      >
        <g stroke="#2dd4bf" strokeWidth="0.4" fill="none">
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

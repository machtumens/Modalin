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
} from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Wallet, Zap, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "./magnetic";
import { ScrambleText } from "./scramble-text";

const orbitItems = [
  { icon: Wallet, label: "BPR Account", angle: 0, radius: 180 },
  { icon: Banknote, label: "Bagi Hasil", angle: 60, radius: 220 },
  { icon: TrendingUp, label: "Live Tx", angle: 120, radius: 200 },
  { icon: Sparkles, label: "AI Score", angle: 180, radius: 230 },
  { icon: Zap, label: "Reimburse", angle: 240, radius: 190 },
];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const cardRotX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const cardRotY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
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
      className="relative overflow-hidden flex min-h-[100vh] items-center bg-zinc-950"
      aria-label="Modalin hero"
    >
      <ParticleField />

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
        <div className="absolute inset-0 grid-floor" />
        <div className="absolute inset-0 noise-layer" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-zinc-950 to-transparent" />
      </div>

      <motion.div
        style={{ y: y1, opacity, scale }}
        className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8 lg:pt-32"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
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
              className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Modal untuk{" "}
              <span className="relative inline-block">
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
              akses untuk{" "}
              <span className="shimmer-text">investor baru</span>.
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
          </motion.div>

          {/* Right — orbital card */}
          <motion.div style={{ y: y2, perspective: 1400 }} className="relative">
            <Orbits items={orbitItems} reduce={reduce} />
            <motion.div
              style={{ rotateX: cardRotX, rotateY: cardRotY, transformStyle: "preserve-3d" }}
              className="card-dark glow-ring relative rounded-2xl p-8"
            >
              <div className="mb-6 flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                  Live activity
                </div>
                <span className="text-xs font-mono text-zinc-500">DEMO</span>
              </div>
              <div className="space-y-3" style={{ transform: "translateZ(20px)" }}>
                <StatRow icon={Wallet} label="Funding gap UMKM" value="Rp1.605 T" sub="/tahun" />
                <StatRow icon={TrendingUp} label="Investor ritel aktif" value="14,8 jt" />
                <StatRow icon={Sparkles} label="Min ticket Modalin" value="Rp100.000" highlight />
                <StatRow icon={Zap} label="Skema" value="Bagi Hasil 100%" />
              </div>
              <div
                className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4"
                style={{ transform: "translateZ(60px)" }}
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  modalin_bank_account.tx
                </div>
                <TickerLine />
              </div>
            </motion.div>
            <div className="pointer-events-none absolute -inset-x-10 -bottom-10 h-40 rounded-full bg-brand-500/30 blur-3xl" />
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

function MicroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 font-display text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${highlight ? "bg-gold-500/15 text-gold-400" : "bg-brand-400/10 text-brand-300"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-display font-semibold ${highlight ? "text-gold-400" : "text-white"}`}>
          {value}
        </span>
        {sub && <span className="text-xs text-zinc-500">{sub}</span>}
      </div>
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
    <div className="mt-2 flex items-baseline justify-between font-mono text-sm">
      <span className="text-zinc-400">+ Pembayaran masuk</span>
      <span className="text-brand-300 tabular-nums">Rp {n.toLocaleString("id-ID")}</span>
    </div>
  );
}

function Orbits({ items, reduce }: { items: typeof orbitItems; reduce: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          className="absolute left-1/2 top-1/2"
          animate={
            reduce
              ? {}
              : {
                  rotate: 360,
                }
          }
          transition={{ duration: 30 + i * 4, ease: "linear", repeat: Infinity }}
          style={{ width: 0, height: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.6 }}
            style={{
              transform: `rotate(${it.angle}deg) translateX(${it.radius}px) rotate(-${it.angle}deg)`,
            }}
            className="absolute"
          >
            <motion.div
              animate={reduce ? {} : { rotate: -360 }}
              transition={{ duration: 30 + i * 4, ease: "linear", repeat: Infinity }}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 backdrop-blur shadow-[0_0_20px_rgba(45,212,191,0.15)]"
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
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 12,
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
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

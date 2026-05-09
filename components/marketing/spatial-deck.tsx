"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Coins, BarChart3, Wallet } from "lucide-react";

const cards = [
  {
    icon: Coins,
    title: "Investor",
    sub: "Min Rp100.000",
    body: "Pilih UMKM, beli ekuitas, lacak transaksi real-time.",
    accent: "from-brand-400/40 to-brand-600/20",
    z: 60,
    x: -300,
    y: 20,
    rot: -6,
  },
  {
    icon: Wallet,
    title: "UMKM",
    sub: "Bagi hasil 100%",
    body: "Modalin Bank Account, AI score, reimbursement on-demand.",
    accent: "from-gold-400/40 to-gold-600/20",
    z: 120,
    x: 0,
    y: 60,
    rot: 0,
  },
  {
    icon: BarChart3,
    title: "Platform",
    sub: "Open banking",
    body: "Transaksi UMKM mengalir lewat BPR, ter-pull live ke dashboard.",
    accent: "from-brand-300/40 to-gold-400/20",
    z: 60,
    x: 300,
    y: 20,
    rot: 6,
  },
];

export function SpatialDeck() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollRotX = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const scrollRotY = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  const dragRotX = useMotionValue(0);
  const dragRotY = useMotionValue(0);
  const sRotX = useSpring(dragRotX, { stiffness: 120, damping: 18 });
  const sRotY = useSpring(dragRotY, { stiffness: 120, damping: 18 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const sceneRotX = useTransform([scrollRotX, sRotX] as never, ([a, b]: number[]) => a + b);
  const sceneRotY = useTransform([scrollRotY, sRotY] as never, ([a, b]: number[]) => a + b);

  const onDown = (e: React.PointerEvent) => {
    setDragging(true);
    drag.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging || !drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    dragRotY.set(dragRotY.get() + dx * 0.25);
    dragRotX.set(dragRotX.get() - dy * 0.25);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => {
    setDragging(false);
    drag.current = null;
  };

  return (
    <section ref={ref} className="relative scene-3d overflow-hidden bg-zinc-950 py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-floor opacity-30" />
        <div className="aurora-blob" style={{ top: "20%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)" }} />
        <div className="aurora-blob" style={{ bottom: "10%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gold-300">
            Tiga aktor · satu sistem
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Sebuah{" "}
            <span className="serif-italic gold-foil">jaringan tertutup</span>{" "}
            yang mengalirkan modal dari investor ke UMKM.
          </h2>
        </div>

        <div
          ref={stage}
          onPointerDown={reduce ? undefined : onDown}
          onPointerMove={reduce ? undefined : onMove}
          onPointerUp={reduce ? undefined : onUp}
          onPointerCancel={reduce ? undefined : onUp}
          className={`relative h-[440px] touch-none select-none sm:h-[480px] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <motion.div
            style={{
              rotateX: reduce ? 0 : sceneRotX,
              rotateY: reduce ? 0 : sceneRotY,
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-0"
          >
            <ConnectingLines />
            {cards.map((c, i) => (
              <FloatingCard key={c.title} card={c} index={i} />
            ))}
          </motion.div>
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold-400/30 bg-zinc-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-gold-300 backdrop-blur">
            ↻ drag untuk putar
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ card, index }: { card: typeof cards[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.35, ease: "easeOut" }}
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translate3d(${card.x}px, ${card.y}px, ${card.z}px) rotate(${card.rot}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="card-dark glow-ring absolute h-64 w-64 rounded-3xl p-5 backdrop-blur"
    >
      <div className={`pointer-events-none absolute -inset-px rounded-3xl bg-linear-to-br ${card.accent} opacity-30`} />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-400/40 bg-zinc-950 text-brand-300 shadow-[0_0_20px_-5px_rgba(45,212,191,0.5)]">
            <card.icon className="h-4 w-4" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            node / 0{index + 1}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-400">
            {card.sub}
          </div>
          <h3 className="mt-1 font-display text-2xl font-bold text-white">{card.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">{card.body}</p>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          <span className="h-1 w-1 rounded-full bg-brand-400 animate-[pulse-glow_2s_ease-in-out_infinite]" />
          Connected
        </div>
      </div>
    </motion.div>
  );
}

function ConnectingLines() {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[1000px] -translate-x-1/2 -translate-y-1/2"
      viewBox="-500 -240 1000 480"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M -300 20 Q -150 -120 0 60"
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      />
      <motion.path
        d="M 0 60 Q 150 -120 300 20"
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      />
      <motion.path
        d="M -300 20 Q 0 220 300 20"
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}

"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Coins, BarChart3, Wallet } from "lucide-react";

const cards = [
  {
    icon: Coins,
    title: "Investor",
    sub: "Min Rp100.000",
    body: "Pilih UMKM, beli ekuitas, lacak transaksi real-time.",
    accent: "from-brand-400/40 to-brand-600/20",
    z: 80,
    x: -260,
    y: -40,
    rot: -8,
  },
  {
    icon: Wallet,
    title: "UMKM",
    sub: "Bagi hasil 100%",
    body: "Modalin Bank Account, AI score, reimbursement on-demand.",
    accent: "from-gold-400/40 to-gold-600/20",
    z: 160,
    x: 0,
    y: 30,
    rot: 0,
  },
  {
    icon: BarChart3,
    title: "Platform",
    sub: "Open banking",
    body: "Transaksi UMKM mengalir lewat BPR, ter-pull live ke dashboard investor.",
    accent: "from-brand-300/40 to-gold-400/20",
    z: 80,
    x: 260,
    y: -40,
    rot: 8,
  },
];

export function SpatialDeck() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const sceneRotX = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const sceneRotY = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 15]);
  const sceneZ = useTransform(scrollYProgress, [0, 0.5, 1], [-300, 0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section ref={ref} className="relative scene-3d min-h-[180vh] overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-floor opacity-40" />
        <div className="absolute inset-0 noise-layer" />
        <div className="aurora-blob" style={{ top: "20%", left: "-10%", width: 600, height: 600, background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)" }} />
        <div className="aurora-blob" style={{ bottom: "10%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)" }} />
      </div>

      <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
        <motion.div style={{ y: titleY, opacity }} className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
            Tiga aktor · satu sistem
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Sebuah{" "}
            <span className="shimmer-text">jaringan tertutup</span>{" "}
            yang mengalirkan modal dari investor ke UMKM.
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Setiap transaksi terverifikasi. Setiap rupiah terlihat. Setiap UMKM tersambung ke BPR mitra.
          </p>
        </motion.div>

        <motion.div
          style={{
            rotateX: reduce ? 0 : sceneRotX,
            rotateY: reduce ? 0 : sceneRotY,
            z: reduce ? 0 : sceneZ,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {cards.map((c, i) => (
            <FloatingCard key={c.title} card={c} index={i} />
          ))}
          {/* connecting lines between cards */}
          <ConnectingLines />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCard({
  card,
  index,
}: {
  card: typeof cards[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
      style={{
        transform: `translate3d(${card.x}px, ${card.y}px, ${card.z}px) rotate(${card.rot}deg)`,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.04 }}
      className="card-dark glow-ring absolute h-72 w-72 rounded-3xl p-6 backdrop-blur"
    >
      <div className={`pointer-events-none absolute -inset-px rounded-3xl bg-linear-to-br ${card.accent} opacity-30`} />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-400/40 bg-zinc-950 text-brand-300 shadow-[0_0_30px_-5px_rgba(45,212,191,0.6)]">
            <card.icon className="h-5 w-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            node / 0{index + 1}
          </span>
        </div>
        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-400">
            {card.sub}
          </div>
          <h3 className="mt-1 font-display text-3xl font-bold text-white">{card.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.body}</p>
        </div>
        <div className="mt-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-[pulse-glow_2s_ease-in-out_infinite]" />
          Connected
        </div>
      </div>
    </motion.div>
  );
}

function ConnectingLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ transformStyle: "preserve-3d" }}
      viewBox="-500 -300 1000 600"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M -260 -40 Q -130 -100 0 30"
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <motion.path
        d="M 0 30 Q 130 -100 260 -40"
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
      />
      <motion.path
        d="M -260 -40 Q 0 200 260 -40"
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

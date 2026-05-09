"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Store, Wallet, BarChart3, ArrowUpRight } from "lucide-react";
import { Section } from "./section";

const items = [
  {
    icon: Store,
    title: "ECF Marketplace",
    body: "Pendanaan ekuitas Rp50–500 jt untuk UMKM early-growth dengan AI scoring berbasis data alternatif. Investor mulai dari Rp100.000 — terendah di industri.",
    accent: "from-brand-400/30 via-brand-500/10 to-transparent",
    glow: "rgba(45,212,191,0.55)",
    chip: "01",
  },
  {
    icon: Wallet,
    title: "Modalin Bank Account",
    body: "Rekening bisnis digital terintegrasi BPR mitra di bawah POJK 22/2024. Seluruh transaksi UMKM ter-pull otomatis ke dashboard investor via open banking.",
    accent: "from-gold-400/30 via-gold-500/10 to-transparent",
    glow: "rgba(251,191,36,0.55)",
    chip: "02",
  },
  {
    icon: BarChart3,
    title: "Investor Dashboard",
    body: "Modalin Community (≥5% kepemilikan), Index Fund auto-diversifikasi 10–20 UMKM, dan reimbursement on-demand divalidasi AI terhadap harga pasar real-time.",
    accent: "from-brand-300/30 via-brand-500/10 to-transparent",
    glow: "rgba(94,234,212,0.55)",
    chip: "03",
  },
];

export function SolutionTriad() {
  return (
    <Section>
      <div className="mb-12 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
          Tiga modul terintegrasi
        </div>
        <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          Bukan platform brokerage —{" "}
          <span className="shimmer-text">operating system</span>{" "}
          pertumbuhan UMKM.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <DepthCard key={it.title} {...it} index={i} />
        ))}
      </div>
    </Section>
  );
}

function DepthCard({
  icon: Icon,
  title,
  body,
  accent,
  glow,
  chip,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  accent: string;
  glow: string;
  chip: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });
  const rotX = useTransform(sy, [0, 1], [10, -10]);
  const rotY = useTransform(sx, [0, 1], [-10, 10]);
  const bgGlow = useTransform(
    [sx, sy] as never,
    ([x, y]: number[]) => `radial-gradient(450px circle at ${x * 100}% ${y * 100}%, ${glow}, transparent 50%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02 }}
        className="group relative h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 backdrop-blur transition-colors hover:border-zinc-700"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: bgGlow }}
        />
        <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

        <div className="relative" style={{ transform: "translateZ(40px)" }}>
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-brand-400 transition-all duration-300 group-hover:border-brand-400/60 group-hover:text-brand-300 group-hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.6)]">
              <Icon className="h-5 w-5" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-600 transition-colors group-hover:text-brand-400">
              / {chip}
            </span>
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold text-white" style={{ transform: "translateZ(20px)" }}>
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>

          <motion.div
            className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-400"
            initial={{ opacity: 0, x: -8 }}
            whileHover={{ opacity: 1, x: 0 }}
            animate={{ opacity: 0.6 }}
          >
            <span>Eksplorasi modul</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </motion.div>
        </div>

        {/* corner glyphs */}
        <div className="pointer-events-none absolute right-3 bottom-3 font-mono text-[120px] font-bold leading-none text-zinc-800/40 transition-colors group-hover:text-zinc-700/50">
          {chip}
        </div>
      </motion.div>
    </motion.div>
  );
}

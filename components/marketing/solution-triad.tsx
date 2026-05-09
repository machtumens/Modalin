"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Store, Wallet, BarChart3, Plus, Check } from "lucide-react";
import { Section } from "./section";

const items = [
  {
    icon: Store,
    title: "ECF Marketplace",
    body: "Pendanaan ekuitas Rp50–500 jt untuk UMKM early-growth dengan AI scoring berbasis data alternatif.",
    bullets: [
      "Min ticket investor Rp100.000 — terendah di industri",
      "Filter sektor: F&B, Retail, Agri, Jasa",
      "Cap funding 30 hari per kampanye",
      "Bagi hasil ekuitas 100% — zero riba",
    ],
    accent: "from-brand-400/30 via-brand-500/10 to-transparent",
    glow: "rgba(45,212,191,0.55)",
    chip: "01",
    luxe: false,
  },
  {
    icon: Wallet,
    title: "Modalin Bank Account",
    body: "Rekening bisnis digital terintegrasi BPR mitra di bawah POJK 22/2024.",
    bullets: [
      "8 BPR mitra di kota-kota pertumbuhan UMKM",
      "Pull transaksi otomatis lewat open banking",
      "Tanpa biaya admin untuk merchant onboard",
      "QRIS, transfer, dan reimbursement built-in",
    ],
    accent: "from-gold-400/40 via-gold-500/15 to-transparent",
    glow: "rgba(251,191,36,0.7)",
    chip: "02",
    luxe: true,
  },
  {
    icon: BarChart3,
    title: "Investor Dashboard",
    body: "Modalin Community, Index Fund auto-diversifikasi, dan reimbursement on-demand.",
    bullets: [
      "Community room ≥5% kepemilikan UMKM",
      "Index Fund: Conservative / Balanced / Growth",
      "AI validasi harga supplier vs harga pasar",
      "Live activity feed dari open banking",
    ],
    accent: "from-brand-300/30 via-brand-500/10 to-transparent",
    glow: "rgba(94,234,212,0.55)",
    chip: "03",
    luxe: false,
  },
];

export function SolutionTriad() {
  return (
    <Section>
      <div className="mb-12 max-w-2xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gold-300">
          Tiga modul terintegrasi
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
          Bukan platform brokerage —{" "}
          <span className="serif-italic gold-foil">operating system</span>{" "}
          pertumbuhan UMKM.
        </h2>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Tap kartu untuk lihat detail
        </p>
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
  bullets,
  accent,
  glow,
  chip,
  luxe,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  bullets: string[];
  accent: string;
  glow: string;
  chip: string;
  luxe: boolean;
  index: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });
  const rotX = useTransform(sy, [0, 1], [8, -8]);
  const rotY = useTransform(sx, [0, 1], [-8, 8]);
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
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => setOpen((v) => !v)}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        layout
        className={`group relative h-full cursor-pointer overflow-hidden rounded-2xl p-7 backdrop-blur transition-colors ${
          luxe
            ? "bevel-card gold-ring"
            : "border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
        }`}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: bgGlow }}
        />
        <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

        <div className="relative" style={{ transform: "translateZ(40px)" }}>
          <div className="flex items-start justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-zinc-950 transition-all duration-300 ${
              luxe
                ? "border-gold-400/50 text-gold-300 shadow-[0_0_24px_-5px_rgba(251,191,36,0.55)]"
                : "border-zinc-700 text-brand-400 group-hover:border-brand-400/60 group-hover:text-brand-300 group-hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.6)]"
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.25 }}
              className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                luxe
                  ? "border-gold-400/50 bg-gold-400/10 text-gold-300"
                  : "border-zinc-700 bg-zinc-900 text-brand-300"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
            </motion.span>
          </div>
          <h3
            className={`mt-5 font-display text-xl font-semibold ${luxe ? "gold-foil" : "text-white"}`}
            style={{ transform: "translateZ(20px)" }}
          >
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>

          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 space-y-2 overflow-hidden border-t border-zinc-800 pt-4"
              >
                {bullets.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300"
                  >
                    <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${luxe ? "text-gold-300" : "text-brand-400"}`} />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {!open && (
            <div className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              tap untuk lihat fitur
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute right-3 bottom-3 font-mono text-[120px] font-bold leading-none text-zinc-800/40 transition-colors group-hover:text-zinc-700/50">
          {chip}
        </div>
      </motion.div>
    </motion.div>
  );
}

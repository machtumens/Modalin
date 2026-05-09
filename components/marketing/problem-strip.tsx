"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "./section";

const stats = [
  {
    value: 65,
    suffix: " jt",
    label: "UMKM di Indonesia",
    note: "61% PDB · 97% tenaga kerja",
    tone: "platinum",
  },
  {
    value: 1605,
    prefix: "Rp ",
    suffix: " T",
    label: "Funding gap per tahun",
    note: "Bank menuntut agunan, P2P 18–30% bunga",
    tone: "gold",
  },
  {
    value: 14.8,
    suffix: " jt",
    label: "Investor ritel aktif",
    note: "Gen Z & milenial cari instrumen alternatif",
    tone: "champagne",
    decimals: 1,
  },
] as const;

export function ProblemStrip() {
  return (
    <Section className="py-20 lg:py-28">
      <div className="mb-12 max-w-2xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gold-300">
          Pasar yang menunggu
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
          Tiga angka yang menjelaskan{" "}
          <span className="serif-italic gold-foil">kenapa Modalin ada</span>.
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>
    </Section>
  );
}

function StatCard({
  value,
  prefix,
  suffix,
  label,
  note,
  tone,
  decimals = 0,
  index,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
  tone: "platinum" | "gold" | "champagne";
  decimals?: number;
  index: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  const isHero = tone === "gold";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-2xl p-8 backdrop-blur transition-all duration-500 ${
        isHero
          ? "bevel-card gold-ring"
          : "border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
    >
      {isHero && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold-400/30 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gold-500/20 blur-3xl" />
        </div>
      )}
      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-300">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="hairline w-12 opacity-60" />
        </div>
        <div
          className={`font-display text-6xl font-bold tracking-tight sm:text-7xl ${
            tone === "gold" ? "gold-foil" : tone === "champagne" ? "platinum-foil" : "text-white"
          }`}
        >
          {prefix}
          {n.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
          {suffix}
        </div>
        <div className="mt-6 font-display text-base font-semibold text-white">{label}</div>
        <div className="mt-1.5 text-xs leading-relaxed text-zinc-400">{note}</div>
      </div>
    </motion.div>
  );
}

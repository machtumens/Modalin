"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "./section";

const stats = [
  { value: 65, suffix: " jt", label: "UMKM di Indonesia", note: "61% PDB · 97% tenaga kerja", color: "from-brand-400 to-brand-600" },
  { value: 1605, prefix: "Rp", suffix: " T", label: "Funding gap per tahun", note: "Bank menuntut agunan, P2P 18–30% bunga", color: "from-gold-400 to-gold-600" },
  { value: 14.8, suffix: " jt", label: "Investor ritel aktif", note: "Gen Z & milenial cari instrumen alternatif", color: "from-brand-300 to-gold-400", decimals: 1 },
];

export function ProblemStrip() {
  return (
    <Section className="py-16 lg:py-20">
      <div className="mb-10 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
          Pasar yang menunggu
        </div>
        <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          Tiga angka yang menjelaskan kenapa Modalin ada.
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
  color,
  decimals = 0,
  index,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
  color: string;
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
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 backdrop-blur transition-colors hover:border-zinc-700"
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${color} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`} />
      <div className={`font-display text-5xl font-bold tracking-tight bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
        {prefix}
        {n.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </div>
      <div className="mt-3 text-sm font-medium text-white">{label}</div>
      <div className="mt-1 text-xs text-zinc-500">{note}</div>
    </motion.div>
  );
}

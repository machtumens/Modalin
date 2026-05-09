"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Section } from "./section";

const stats = [
  {
    value: 65,
    suffix: " jt",
    label: "UMKM di Indonesia",
    note: "61% PDB · 97% tenaga kerja",
    tone: "platinum" as const,
    breakdown: [
      { k: "Mikro", v: "63,9 jt (98%)" },
      { k: "Kecil", v: "0,79 jt (1.2%)" },
      { k: "Menengah", v: "0,06 jt (0.1%)" },
    ],
    source: "BPS · KemenkopUKM 2024",
  },
  {
    value: 1605,
    prefix: "Rp ",
    suffix: " T",
    label: "Funding gap per tahun",
    note: "Bank menuntut agunan, P2P 18–30% bunga",
    tone: "gold" as const,
    breakdown: [
      { k: "Bank konvensional", v: "Tolak 70% UMKM tanpa agunan" },
      { k: "P2P lending", v: "Bunga 18–30% p.a." },
      { k: "ECF eksisting", v: "Min ticket Rp1–5 jt" },
    ],
    source: "Bank Indonesia · Asia Development Bank",
  },
  {
    value: 14.8,
    suffix: " jt",
    label: "Investor ritel aktif",
    note: "Gen Z & milenial cari instrumen alternatif",
    tone: "champagne" as const,
    decimals: 1,
    breakdown: [
      { k: "Saham", v: "12,2 jt SID" },
      { k: "Reksadana", v: "11,8 jt" },
      { k: "ECF (kumulatif)", v: "0,18 jt" },
    ],
    source: "KSEI · OJK Q4 2024",
  },
];

export function ProblemStrip() {
  return (
    <Section>
      <div className="mb-12 max-w-2xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gold-300">
          Pasar yang menunggu
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
          Tiga angka yang menjelaskan{" "}
          <span className="serif-italic gold-foil">kenapa Modalin ada</span>.
        </h2>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Tap kartu untuk lihat breakdown
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s, i) => (
          <FlipStat key={s.label} {...s} index={i} />
        ))}
      </div>
    </Section>
  );
}

function FlipStat({
  value,
  prefix,
  suffix,
  label,
  note,
  tone,
  decimals = 0,
  breakdown,
  source,
  index,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
  tone: "platinum" | "gold" | "champagne";
  decimals?: number;
  breakdown: { k: string; v: string }[];
  source: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  const isHero = tone === "gold";
  const cardCls = isHero
    ? "bevel-card gold-ring"
    : "border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1400 }}
      className="relative h-[340px] cursor-pointer sm:h-[360px]"
      onClick={() => setFlipped((v) => !v)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={`absolute inset-0 overflow-hidden rounded-2xl p-8 backdrop-blur transition-all duration-300 sm:p-9 ${cardCls}`}
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
              className={`whitespace-nowrap font-display text-5xl font-bold tracking-tight sm:text-6xl ${
                tone === "gold" ? "gold-foil" : tone === "champagne" ? "platinum-foil" : "text-white"
              }`}
            >
              {prefix}
              {n.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
              {suffix}
            </div>
            <div className="mt-6 font-display text-base font-semibold text-white">{label}</div>
            <div className="mt-1.5 text-xs leading-relaxed text-zinc-400">{note}</div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/60 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              tap untuk breakdown →
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={`absolute inset-0 overflow-hidden rounded-2xl p-8 sm:p-9 ${cardCls}`}
        >
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-300">
              Breakdown · 0{index + 1}
            </div>
            <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <ul className="mt-5 space-y-3">
            {breakdown.map((b) => (
              <li key={b.k} className="flex items-center justify-between border-b border-zinc-800/60 pb-2 last:border-0">
                <span className="text-xs uppercase tracking-widest text-zinc-400">{b.k}</span>
                <span className="font-mono text-sm font-semibold text-white">{b.v}</span>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-5 left-7 right-7 border-t border-zinc-800 pt-3 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            Sumber · {source}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { Section } from "./section";

type ScoreData = { score: number; components: Record<string, number> };

export function AIScoreTeaser() {
  const [data, setData] = useState<ScoreData | null>(null);
  const reduce = useReducedMotion();
  const score = useMotionValue(0);
  const rounded = useTransform(score, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setData({ score: 78, components: { slik: 82, ecommerce: 71, behavior: 80 } });
  }, []);

  useEffect(() => {
    if (!data) return;
    const controls = animate(score, data.score, { duration: reduce ? 0 : 1.6, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [data, reduce, score, rounded]);

  const pct = data ? data.score : 0;
  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">AI Scoring</div>
          <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Skor kredit alternatif untuk UMKM yang{" "}
            <span className="shimmer-text">ditolak bank konvensional</span>.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Modalin menggabungkan SLIK OJK, transaksi e-commerce, perilaku digital, dan outlook sektor
            menjadi satu skor 0–100 yang transparan untuk investor dan UMKM.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { k: "SLIK OJK", v: "Riwayat kredit formal" },
              { k: "E-commerce", v: "Velocity GMV 90 hari" },
              { k: "Digital behavior", v: "Pola transaksi & log-in" },
              { k: "Sektor", v: "Outlook industri makro" },
            ].map((x) => (
              <div key={x.k} className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2.5">
                <div className="text-xs font-medium text-brand-400">{x.k}</div>
                <div className="text-xs text-zinc-500">{x.v}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="card-dark glow-ring relative rounded-2xl p-8"
        >
          <div className="flex items-center gap-7">
            <div className="relative h-36 w-36">
              <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-2xl" />
              <svg viewBox="0 0 128 128" className="relative h-full w-full -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgb(39 39 42)" strokeWidth="10" fill="none" />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#scoreGrad)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset: dashOffset }}
                  viewport={{ once: true }}
                  transition={{ duration: reduce ? 0 : 1.6, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-white tabular-nums">{display}</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">AI Score</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <ScoreBar label="SLIK OJK" value={data?.components.slik ?? 0} />
              <ScoreBar label="E-commerce velocity" value={data?.components.ecommerce ?? 0} />
              <ScoreBar label="Digital behavior" value={data?.components.behavior ?? 0} />
            </div>
          </div>
          <p className="mt-6 text-xs text-zinc-500">
            Demo. Skor sebenarnya per UMKM tersedia setelah login dan masuk ke marketplace.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono font-medium text-white tabular-nums">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-gold-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

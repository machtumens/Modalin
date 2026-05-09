"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { Section } from "./section";

type ScoreData = { score: number; components: Record<string, number> };

export function AIScoreTeaser() {
  const [data, setData] = useState<ScoreData | null>(null);
  const reduce = useReducedMotion();
  const score = useMotionValue(0);
  const rounded = useTransform(score, (v) => Math.round(v));
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Static mock data — no API call.
    setData({ score: 78, components: { slik: 82, ecommerce: 71, behavior: 80 } });
  }, []);

  useEffect(() => {
    if (!data) return;
    const controls = animate(score, data.score, {
      duration: reduce ? 0 : 1.4,
      ease: "easeOut",
    });
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
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">AI Scoring</div>
          <h2 className="mt-2 font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
            Skor kredit alternatif untuk UMKM yang ditolak bank konvensional.
          </h2>
          <p className="mt-4 text-zinc-600">
            Modalin menggabungkan SLIK OJK, transaksi e-commerce, perilaku digital, dan outlook sektor menjadi satu skor 0–100 yang transparan untuk investor dan UMKM.
          </p>
        </div>
        <div ref={ref} className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgb(244 244 245)" strokeWidth="12" fill="none" />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgb(15 118 110)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: reduce ? 0 : 1.4, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold text-zinc-900">{display}</span>
                <span className="text-[10px] uppercase tracking-wide text-zinc-500">AI Score</span>
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
        </div>
      </div>
    </Section>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-zinc-600">{label}</span>
        <span className="font-medium text-zinc-900">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-gold-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

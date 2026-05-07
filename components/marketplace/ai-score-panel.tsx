"use client";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";

export function AIScorePanel({
  score,
  components,
  override,
}: {
  score: number;
  components: Record<string, number>;
  override?: boolean;
}) {
  const reduce = useReducedMotion();
  const v = useMotionValue(0);
  const rounded = useTransform(v, (x) => Math.round(x));
  const [display, setDisplay] = useState(0);
  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference * (1 - score / 100);

  useEffect(() => {
    const c = animate(v, score, { duration: reduce ? 0 : 1.2, ease: "easeOut" });
    const u = rounded.on("change", (x) => setDisplay(x));
    return () => { c.stop(); u(); };
  }, [score, reduce, v, rounded]);

  const tooltips: Record<string, string> = {
    slik: "Skor SLIK OJK — riwayat kredit terverifikasi. Bobot 30%.",
    ecommerce: "Velocity transaksi e-commerce 12 bulan. Bobot 25%.",
    behavior: "Skor perilaku digital — konsistensi, frekuensi, channel mix. Bobot 20%.",
    revenueAge: "Normalisasi omzet dan usia bisnis. Bobot 15%.",
    sectorOutlook: "Outlook sektor 36 bulan. Bobot 10%.",
  };
  const labels: Record<string, string> = {
    slik: "SLIK OJK",
    ecommerce: "E-commerce velocity",
    behavior: "Digital behavior",
    revenueAge: "Omzet × Usia",
    sectorOutlook: "Outlook Sektor",
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900">AI Score</div>
          <div className="text-xs text-zinc-500">Skor 0–100. {override ? "Skor manual diberlakukan oleh admin." : "Skor real-time dari model Modalin."}</div>
        </div>
        {override && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Override</span>}
      </div>
      <div className="mt-4 flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
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
              transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold">{display}</span>
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">AI Score</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {Object.entries(components).map(([k, val]) => (
            <div key={k}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-zinc-700" title={tooltips[k]}>{labels[k] ?? k}</span>
                <span className="font-medium text-zinc-900">{val}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-gold-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

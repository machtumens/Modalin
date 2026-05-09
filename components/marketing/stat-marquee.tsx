"use client";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Banknote, Zap, Wallet, Activity } from "lucide-react";

const items = [
  { icon: Sparkles, k: "Min ticket", v: "Rp 100.000" },
  { icon: TrendingUp, k: "AUM Y3", v: "Rp 40,68 M" },
  { icon: Banknote, k: "Funding gap", v: "Rp 1.605 T" },
  { icon: Zap, k: "BEP", v: "Q3 Y3" },
  { icon: Wallet, k: "LTV/CAC", v: "5,0x" },
  { icon: Activity, k: "Mitra BPR", v: "8 kota" },
  { icon: Sparkles, k: "Target UMKM Y3", v: "528" },
  { icon: TrendingUp, k: "Investor Y3", v: "26.400" },
];

export function StatMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-zinc-800/60 bg-zinc-950/60 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-zinc-950 to-transparent" />
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-brand-400/30 bg-brand-400/10 text-brand-300">
              <it.icon className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{it.k}</span>
              <span className="font-display text-base font-bold text-white">{it.v}</span>
            </div>
            <span className="text-zinc-700">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

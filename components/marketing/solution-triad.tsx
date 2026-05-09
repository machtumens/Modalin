"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Store, Wallet, BarChart3 } from "lucide-react";
import { Section } from "./section";

const items = [
  {
    icon: Store,
    title: "ECF Marketplace",
    body: "Pendanaan ekuitas Rp50–500 jt untuk UMKM early-growth dengan AI scoring berbasis data alternatif. Investor mulai dari Rp100.000 — terendah di industri.",
    accent: "from-brand-400/30 via-brand-500/10 to-transparent",
    ring: "rgba(45,212,191,0.5)",
  },
  {
    icon: Wallet,
    title: "Modalin Bank Account",
    body: "Rekening bisnis digital terintegrasi BPR mitra di bawah POJK 22/2024. Seluruh transaksi UMKM ter-pull otomatis ke dashboard investor via open banking.",
    accent: "from-gold-400/30 via-gold-500/10 to-transparent",
    ring: "rgba(251,191,36,0.5)",
  },
  {
    icon: BarChart3,
    title: "Investor Dashboard",
    body: "Modalin Community (≥5% kepemilikan), Index Fund auto-diversifikasi 10–20 UMKM, dan reimbursement on-demand divalidasi AI terhadap harga pasar real-time.",
    accent: "from-brand-300/30 via-brand-500/10 to-transparent",
    ring: "rgba(94,234,212,0.5)",
  },
];

export function SolutionTriad() {
  const reduce = useReducedMotion();
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
          <motion.div
            key={it.title}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 backdrop-blur transition-all duration-300 hover:border-zinc-700"
            style={{
              boxShadow: `0 0 0 0 ${it.ring}`,
            }}
          >
            <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${it.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-brand-400 transition-all duration-300 group-hover:border-brand-400/60 group-hover:text-brand-300 group-hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.6)]">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{it.body}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Eksplorasi
                <span className="h-px w-6 bg-brand-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

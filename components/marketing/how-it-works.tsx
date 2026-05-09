"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Sparkles, Banknote, Activity } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Daftar",
    body: "UMKM submit pitch 6 langkah. NIB, NPWP, laporan keuangan.",
    code: "POST /umkm/pitch",
  },
  {
    icon: Sparkles,
    title: "AI Score",
    body: "SLIK + e-commerce velocity + perilaku digital + outlook sektor.",
    code: "score = w·{slik, gmv, behavior}",
  },
  {
    icon: Banknote,
    title: "Funding",
    body: "Investor ritel berinvestasi mulai Rp100rb. Dana masuk Modalin Bank Account.",
    code: "tx → BPR://account",
  },
  {
    icon: Activity,
    title: "Live Tracking",
    body: "Setiap transaksi muncul di dashboard via open banking. Real-time.",
    code: "stream open_banking",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <section className="relative border-y border-zinc-800/60 bg-zinc-950/60">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gold-300">
            Cara kerja
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Empat langkah dari pitch ke{" "}
            <span className="serif-italic gold-foil">pertumbuhan terverifikasi</span>.
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur transition-colors hover:border-brand-400/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-400/40 bg-zinc-950 text-brand-300 shadow-[0_0_20px_-5px_rgba(45,212,191,0.5)]">
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-600 transition-colors group-hover:text-brand-400">
                  / {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{s.body}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1 font-mono text-[10px] text-brand-300">
                <span className="h-1 w-1 rounded-full bg-brand-400" />
                {s.code}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

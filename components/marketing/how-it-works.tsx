"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ClipboardList, Sparkles, Banknote, Activity } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Daftar", body: "UMKM submit pitch 6 langkah. Dokumen NIB, NPWP, laporan keuangan." },
  { icon: Sparkles, title: "AI Score", body: "Model menilai SLIK, e-commerce velocity, perilaku digital, outlook sektor." },
  { icon: Banknote, title: "Funding", body: "Investor ritel berinvestasi mulai Rp100.000. Dana masuk Modalin Bank Account." },
  { icon: Activity, title: "Live Tracking", body: "Setiap transaksi muncul di dashboard investor via open banking. Real-time." },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative border-y border-zinc-800/60 bg-zinc-950/60">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-50" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
            Cara kerja
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Empat langkah dari pitch ke{" "}
            <span className="shimmer-text">pertumbuhan terverifikasi</span>.
          </h2>
        </div>

        <div className="relative">
          {/* progress rail */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-zinc-800 md:block" />
          <motion.div
            style={{ height: lineH }}
            className="absolute left-6 top-0 hidden w-px bg-gradient-to-b from-brand-400 via-gold-400 to-brand-400 shadow-[0_0_20px_rgba(45,212,191,0.6)] md:block"
          />

          <ol className="space-y-6 md:space-y-10">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-8 md:pl-20"
              >
                <div className="absolute left-0 top-0 hidden h-12 w-12 items-center justify-center rounded-full border border-brand-400/40 bg-zinc-950 text-brand-300 shadow-[0_0_30px_-5px_rgba(45,212,191,0.5)] md:flex">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-colors hover:border-brand-400/40">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-mono text-xs font-medium uppercase tracking-widest text-brand-400">
                      step {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-zinc-800" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

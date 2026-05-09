"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ClipboardList, Sparkles, Banknote, Activity } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Daftar",
    body: "UMKM submit pitch 6 langkah. Dokumen NIB, NPWP, laporan keuangan.",
    code: "POST /api/umkm/pitch",
    accent: "from-brand-400 to-brand-600",
  },
  {
    icon: Sparkles,
    title: "AI Score",
    body: "Model menilai SLIK, e-commerce velocity, perilaku digital, outlook sektor.",
    code: "score = w·{slik, gmv, behavior, sector}",
    accent: "from-gold-400 to-gold-600",
  },
  {
    icon: Banknote,
    title: "Funding",
    body: "Investor ritel berinvestasi mulai Rp100.000. Dana masuk Modalin Bank Account.",
    code: "tx → BPR://modalin/account",
    accent: "from-brand-300 to-gold-400",
  },
  {
    icon: Activity,
    title: "Live Tracking",
    body: "Setiap transaksi muncul di dashboard investor via open banking. Real-time.",
    code: "stream open_banking.events",
    accent: "from-brand-500 to-brand-700",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduce) {
    return <SimpleVertical />;
  }

  return (
    <section ref={ref} className="relative h-[400vh] bg-zinc-950">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="absolute inset-0 grid-floor opacity-40" />
        <div className="absolute inset-0 noise-layer" />
        <div className="aurora-blob" style={{ top: "10%", left: "-20%", width: 600, height: 600, background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)" }} />
        <div className="aurora-blob" style={{ bottom: "10%", right: "-20%", width: 600, height: 600, background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)" }} />

        <div className="relative mx-auto flex w-full max-w-7xl items-end justify-between px-4 pb-6 pt-12 sm:px-6 lg:px-8 lg:pt-20">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
              Cara kerja · scroll horizontal
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
              Empat langkah dari pitch ke{" "}
              <span className="shimmer-text">pertumbuhan terverifikasi</span>.
            </h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">progress</div>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                style={{ width: progressW }}
                className="h-full bg-linear-to-r from-brand-400 via-gold-400 to-brand-400 shadow-[0_0_12px_rgba(45,212,191,0.7)]"
              />
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.ol style={{ x }} className="flex gap-6 px-4 sm:px-6 lg:px-8">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="card-dark relative flex h-[60vh] w-[80vw] shrink-0 flex-col rounded-3xl p-10 sm:w-[60vw] lg:w-[55vw]"
              >
                <div className={`pointer-events-none absolute -inset-px rounded-3xl bg-linear-to-br ${s.accent} opacity-15`} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-400/40 bg-zinc-950 text-brand-300 shadow-[0_0_30px_-5px_rgba(45,212,191,0.5)]">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <span className={`font-mono text-[180px] font-bold leading-none bg-linear-to-br ${s.accent} bg-clip-text text-transparent opacity-40`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="font-mono text-xs uppercase tracking-widest text-brand-400">
                      step {String(i + 1).padStart(2, "0")} / 04
                    </div>
                    <h3 className="mt-2 font-display text-5xl font-bold text-white sm:text-6xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-400">{s.body}</p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 font-mono text-xs text-brand-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                      {s.code}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

function SimpleVertical() {
  return (
    <section className="relative border-y border-zinc-800/60 bg-zinc-950/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold text-white">Cara kerja</h2>
        <ol className="mt-10 space-y-6">
          {steps.map((s) => (
            <li key={s.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="font-display text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Sparkles, Banknote, Activity } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Daftar", body: "UMKM submit pitch 6 langkah. Dokumen NIB, NPWP, laporan keuangan." },
  { icon: Sparkles, title: "AI Score", body: "Model menilai SLIK, e-commerce velocity, perilaku digital, outlook sektor." },
  { icon: Banknote, title: "Funding", body: "Investor ritel berinvestasi mulai Rp100.000. Dana masuk Modalin Bank Account." },
  { icon: Activity, title: "Live Tracking", body: "Setiap transaksi muncul di dashboard investor via open banking. Real-time." },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Cara kerja</div>
          <h2 className="mt-2 font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
            Empat langkah dari pitch ke pertumbuhan terverifikasi.
          </h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative rounded-xl border border-zinc-200 bg-white p-6"
            >
              <div className="absolute -top-3 left-6 rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">
                {i + 1}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-gold-600">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-zinc-900">{s.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 leading-relaxed">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

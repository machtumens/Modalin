"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaperShaderBackground } from "@/components/ui/paper-shader-background";

export function Hero() {
  const reduce = useReducedMotion();
  const stagger = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };
  const child = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      <PaperShaderBackground intensity={0.55} />
      <div className="relative mx-auto max-w-7xl w-full px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={child}>
              <Badge variant="success" className="mb-4">100% Bagi Hasil · Sharia-Friendly</Badge>
            </motion.div>
            <motion.h1
              variants={child}
              className="font-display text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl"
            >
              Modal untuk UMKM Bertumbuh, Akses untuk Investor Generasi Baru.
            </motion.h1>
            <motion.p variants={child} className="mt-6 text-lg text-zinc-600 max-w-xl">
              Platform equity crowdfunding pertama Indonesia yang terintegrasi dengan rekening bank UMKM. Investasi mulai Rp100.000, transparansi real-time, 100% bagi hasil ekuitas.
            </motion.p>
            <motion.div variants={child} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/marketplace">Mulai Investasi Rp100rb</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/untuk-umkm">Daftarkan UMKM Anda</Link>
              </Button>
            </motion.div>
            <motion.div variants={child} className="mt-8 flex flex-wrap gap-2 text-xs text-zinc-500">
              <Badge variant="muted">Demo Prototype</Badge>
              <Badge variant="muted">8 Mitra BPR</Badge>
              <Badge variant="muted">Min Investasi Rp100.000</Badge>
            </motion.div>
          </motion.div>
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-lg backdrop-blur"
          >
            <div className="flex flex-col gap-3 text-sm">
              <Stat label="Funding gap UMKM" value="Rp1.605 T/tahun" />
              <Stat label="Investor ritel aktif" value="14,8 jt" />
              <Stat label="Min ticket Modalin" value="Rp100.000" highlight />
              <Stat label="Skema" value="100% Bagi Hasil Ekuitas" />
            </div>
            <div className="mt-6 rounded-md bg-zinc-900 p-4 text-xs leading-relaxed text-zinc-100">
              Setiap transaksi UMKM mengalir lewat Modalin Bank Account dan tampil real-time di dashboard investor.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 pb-2 last:border-0">
      <span className="text-zinc-500">{label}</span>
      <span className={`font-semibold ${highlight ? "text-brand-700" : "text-zinc-900"}`}>{value}</span>
    </div>
  );
}

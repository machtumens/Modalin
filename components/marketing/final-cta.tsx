"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "./section";
import { Button } from "@/components/ui/button";
import { Magnetic } from "./magnetic";

export function FinalCTA() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] border border-brand-400/30 bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-10 sm:p-16"
      >
        <div className="aurora-blob" style={{ top: "-30%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)" }} />
        <div className="aurora-blob" style={{ bottom: "-30%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-floor opacity-50" />
        <div className="absolute inset-0 noise-layer" />

        {/* radiating rings */}
        <RadiatingRings />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-300 backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Demo prototype · Investasi nyata segera
          </div>

          <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Modal tumbuh, akses terbuka.{" "}
            <span className="shimmer-text">Bergabunglah hari ini.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base text-zinc-400">
            Daftar gratis. Investor mulai dari Rp100.000. UMKM dapat AI scoring dalam hitungan menit.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic strength={0.4}>
              <Button asChild size="lg" className="group bg-brand-500 text-zinc-950 shadow-[0_0_60px_-8px_rgba(45,212,191,0.8)] hover:bg-brand-400">
                <Link href="/marketplace">
                  <span className="flex items-center gap-2">
                    Mulai Investasi
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Button asChild size="lg" variant="outline" className="border-zinc-700 bg-transparent text-white hover:border-brand-400 hover:bg-zinc-900/40 hover:text-brand-300">
                <Link href="/untuk-umkm">Daftarkan UMKM</Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

function RadiatingRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 4, delay: i * 0.8, repeat: Infinity, ease: "easeOut" }}
          className="absolute h-64 w-64 rounded-full border border-brand-400/30"
        />
      ))}
    </div>
  );
}

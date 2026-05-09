"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "./section";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-brand-400/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-10 sm:p-16"
      >
        {/* aurora */}
        <div className="aurora-blob b1" style={{ top: "-30%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)" }} />
        <div className="aurora-blob b2" style={{ bottom: "-30%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-floor opacity-50" />
        <div className="absolute inset-0 noise-layer" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-300 backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Demo prototype · Investasi nyata segera
          </div>

          <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Modal tumbuh, akses terbuka.{" "}
            <span className="shimmer-text">Bergabunglah hari ini.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base text-zinc-400">
            Daftar gratis. Investor mulai dari Rp100.000. UMKM dapat AI scoring dalam hitungan menit.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group bg-brand-500 text-zinc-950 shadow-[0_0_40px_-8px_rgba(45,212,191,0.7)] hover:bg-brand-400">
              <Link href="/marketplace">
                <span className="flex items-center gap-2">
                  Mulai Investasi
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-zinc-700 bg-transparent text-white hover:border-brand-400 hover:bg-zinc-900/40 hover:text-brand-300">
              <Link href="/untuk-umkm">Daftarkan UMKM</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

"use client";
import { motion } from "framer-motion";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden section-champagne py-28 lg:py-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-blob" style={{ top: "20%", left: "20%", width: 700, height: 700, background: "radial-gradient(circle, #fbbf24 0%, transparent 60%)", opacity: 0.18 }} />
        <div className="aurora-blob" style={{ bottom: "10%", right: "15%", width: 500, height: 500, background: "radial-gradient(circle, #f5e6c4 0%, transparent 60%)", opacity: 0.14 }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ transformOrigin: "center" }}
          className="hairline mx-auto w-40"
        />
        <div className="mt-8 text-center text-[10px] font-medium uppercase tracking-[0.6em] text-gold-300">
          Manifesto · M ⋅ MMXXVI
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mx-auto mt-12 max-w-4xl text-center"
        >
          <span aria-hidden className="block font-serif text-7xl leading-none text-gold-400/40 sm:text-8xl">“</span>
          <p className="serif-italic mt-2 text-3xl leading-[1.25] text-zinc-100 sm:text-4xl lg:text-5xl xl:text-6xl">
            Modal seharusnya{" "}
            <span className="gold-foil">tidak lagi mewah</span>{" "}
            untuk yang berani bertumbuh — dan investasi seharusnya{" "}
            <span className="gold-foil">tidak lagi tertutup</span>{" "}
            untuk yang baru memulai.
          </p>
          <footer className="mt-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.4em] text-zinc-400">
            <span className="hairline w-24" />
            Tim NextGen Preneur · 2026
          </footer>
        </motion.blockquote>

        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-zinc-800 pt-10 text-center">
          <Pillar n="01" k="Inklusif" v="Mulai Rp100rb" />
          <Pillar n="02" k="Transparan" v="Open banking real-time" />
          <Pillar n="03" k="Sharia" v="100% bagi hasil" />
        </div>
      </div>
    </section>
  );
}

function Pillar({ n, k, v }: { n: string; k: string; v: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-300">{n}</div>
      <div className="serif-italic mt-2 text-2xl text-white sm:text-3xl">{k}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-zinc-500">{v}</div>
    </motion.div>
  );
}

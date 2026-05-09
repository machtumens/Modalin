"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Section } from "./section";

const MapClient = dynamic(() => import("./bpr-map-client").then((m) => m.BPRMapClient), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-500">
      Memuat peta...
    </div>
  ),
});

export const BPRPartners = [
  { city: "Jakarta", name: "BPR Mitra Jaya", lat: -6.2, lng: 106.816, umkm: 32 },
  { city: "Surabaya", name: "BPR Sentra Nusantara", lat: -7.250, lng: 112.768, umkm: 24 },
  { city: "Bandung", name: "BPR Karya Mandiri", lat: -6.9, lng: 107.61, umkm: 18 },
  { city: "Medan", name: "BPR Daerah Sejahtera", lat: 3.595, lng: 98.672, umkm: 14 },
  { city: "Makassar", name: "BPR Mitra Sulawesi", lat: -5.135, lng: 119.412, umkm: 12 },
  { city: "Yogyakarta", name: "BPR Sentra Jogja", lat: -7.795, lng: 110.369, umkm: 9 },
  { city: "Denpasar", name: "BPR Bali Sejahtera", lat: -8.65, lng: 115.216, umkm: 7 },
  { city: "Palembang", name: "BPR Sumsel Mitra", lat: -2.99, lng: 104.756, umkm: 6 },
];

export function BPRMap() {
  return (
    <Section>
      <div className="mb-10 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Jaringan BPR</div>
        <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          8 mitra BPR di kota-kota{" "}
          <span className="shimmer-text">pertumbuhan UMKM</span>.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Modalin Bank Account dijalankan di atas infrastruktur BPR mitra,
          membuka akses formal banking ke segmen yang selama ini ditolak bank umum.
        </p>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-brand-500/10 blur-2xl" />
        <div className="relative">
          <MapClient partners={BPRPartners} />
        </div>
      </div>
      <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {BPRPartners.map((p, i) => (
          <motion.li
            key={p.city}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 backdrop-blur transition-colors hover:border-brand-400/40"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              <span className="font-medium text-white">{p.name}</span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">{p.city} · {p.umkm} UMKM dilayani</div>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

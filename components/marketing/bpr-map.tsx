"use client";
import dynamic from "next/dynamic";
import { Section } from "./section";

const MapClient = dynamic(() => import("./bpr-map-client").then((m) => m.BPRMapClient), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-500">
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
        <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Jaringan BPR</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
          8 mitra BPR di kota-kota pertumbuhan UMKM.
        </h2>
        <p className="mt-3 text-zinc-600">
          Modalin Bank Account dijalankan di atas infrastruktur BPR mitra, membuka akses formal banking ke segmen yang selama ini ditolak bank umum.
        </p>
      </div>
      <MapClient partners={BPRPartners} />
      <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {BPRPartners.map((p) => (
          <li key={p.city} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
            <div className="font-medium text-zinc-900">{p.name}</div>
            <div className="text-xs text-zinc-500">{p.city} · {p.umkm} UMKM dilayani</div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

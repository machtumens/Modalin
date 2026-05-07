"use client";
import { AreaChart } from "@tremor/react";
import { Section } from "./section";

const data = [
  { tahun: "Tahun 1", "UMKM Terdanai": 72, "Funding (Rp M)": 3_600 },
  { tahun: "Tahun 2", "UMKM Terdanai": 168, "Funding (Rp M)": 11_700 },
  { tahun: "Tahun 3", "UMKM Terdanai": 288, "Funding (Rp M)": 24_480 },
];

export function ProjectionChart() {
  return (
    <Section>
      <div className="mb-10 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Proyeksi base case</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
          Dari 72 UMKM ke 288 UMKM dalam 36 bulan.
        </h2>
        <p className="mt-3 text-zinc-600">
          AUM kumulatif Rp40,68 miliar di akhir Tahun 3, EBITDA break-even Q3 Tahun 3 (+11% margin).
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <AreaChart
          className="h-72"
          data={data}
          index="tahun"
          categories={["UMKM Terdanai", "Funding (Rp M)"]}
          colors={["teal", "amber"]}
          showLegend
          showGridLines
          showAnimation
          valueFormatter={(n) => n.toLocaleString("id-ID")}
        />
      </div>
    </Section>
  );
}

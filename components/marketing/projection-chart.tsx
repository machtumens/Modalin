"use client";
import { AreaChart } from "@tremor/react";
import { motion } from "framer-motion";
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
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Proyeksi base case</div>
        <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          Dari 72 UMKM ke{" "}
          <span className="shimmer-text">288 UMKM</span>{" "}
          dalam 36 bulan.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          AUM kumulatif Rp40,68 miliar di akhir Tahun 3, EBITDA break-even Q3 Tahun 3 (+11% margin).
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="card-dark relative rounded-2xl p-6"
      >
        <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="relative dark-tremor">
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
        <div className="mt-6 grid gap-4 border-t border-zinc-800 pt-6 sm:grid-cols-3">
          <Kpi label="AUM Tahun 3" value="Rp 40,68 M" />
          <Kpi label="Break-even" value="Q3 Tahun 3" />
          <Kpi label="EBITDA margin" value="+11%" />
        </div>
      </motion.div>
    </Section>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-white">{value}</div>
    </div>
  );
}

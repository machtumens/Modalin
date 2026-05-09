"use client";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { Section } from "./section";

type Cell = "yes" | "no" | "partial" | string;

const rows: { label: string; modalin: Cell; bank: Cell; p2p: Cell; ecfLama: Cell }[] = [
  { label: "Bunga / riba", modalin: "0% (bagi hasil)", bank: "8–12% p.a.", p2p: "18–30% p.a.", ecfLama: "0% (bagi hasil)" },
  { label: "Min ticket investor", modalin: "Rp100rb", bank: "—", p2p: "Rp100rb", ecfLama: "Rp1–5 jt" },
  { label: "Akses early-growth UMKM (1–3 thn)", modalin: "yes", bank: "no", p2p: "partial", ecfLama: "no" },
  { label: "Transparansi real-time bank account", modalin: "yes", bank: "no", p2p: "no", ecfLama: "no" },
  { label: "Skema syariah-compliant", modalin: "yes", bank: "partial", p2p: "no", ecfLama: "partial" },
];

function CellRender({ value }: { value: Cell }) {
  if (value === "yes") return <Check className="h-4 w-4 text-brand-400" />;
  if (value === "no") return <X className="h-4 w-4 text-red-400" />;
  if (value === "partial") return <Minus className="h-4 w-4 text-gold-400" />;
  return <span className="text-xs text-zinc-300">{value}</span>;
}

export function ComparisonTable() {
  return (
    <Section>
      <div className="mb-10 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Posisi pasar</div>
        <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          Kenapa Modalin, bukan opsi yang{" "}
          <span className="shimmer-text">sudah ada</span>?
        </h2>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left">
              <th className="p-4 font-medium text-zinc-500"></th>
              <th className="relative p-4 font-semibold text-brand-300">
                <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-400 to-transparent" />
                Modalin
              </th>
              <th className="p-4 font-medium text-zinc-400">Bank Konvensional</th>
              <th className="p-4 font-medium text-zinc-400">P2P Lending</th>
              <th className="p-4 font-medium text-zinc-400">ECF Eksisting</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border-b border-zinc-800/60 transition-colors last:border-0 hover:bg-zinc-900/60"
              >
                <td className="p-4 text-zinc-300">{r.label}</td>
                <td className="bg-brand-500/5 p-4 ring-1 ring-inset ring-brand-400/10">
                  <CellRender value={r.modalin} />
                </td>
                <td className="p-4"><CellRender value={r.bank} /></td>
                <td className="p-4"><CellRender value={r.p2p} /></td>
                <td className="p-4"><CellRender value={r.ecfLama} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </Section>
  );
}

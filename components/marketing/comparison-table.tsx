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
  if (value === "yes") return <Check className="h-4 w-4 text-emerald-600" />;
  if (value === "no") return <X className="h-4 w-4 text-red-500" />;
  if (value === "partial") return <Minus className="h-4 w-4 text-amber-600" />;
  return <span className="text-xs text-zinc-700">{value}</span>;
}

export function ComparisonTable() {
  return (
    <Section>
      <div className="mb-10 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Posisi pasar</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
          Kenapa Modalin, bukan opsi yang sudah ada?
        </h2>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left">
              <th className="p-4 font-medium text-zinc-500"></th>
              <th className="p-4 font-semibold text-brand-700 bg-brand-50">Modalin</th>
              <th className="p-4 font-medium text-zinc-700">Bank Konvensional</th>
              <th className="p-4 font-medium text-zinc-700">P2P Lending</th>
              <th className="p-4 font-medium text-zinc-700">ECF Eksisting</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-zinc-100 last:border-0">
                <td className="p-4 text-zinc-700">{r.label}</td>
                <td className="p-4 bg-brand-50/40"><CellRender value={r.modalin} /></td>
                <td className="p-4"><CellRender value={r.bank} /></td>
                <td className="p-4"><CellRender value={r.p2p} /></td>
                <td className="p-4"><CellRender value={r.ecfLama} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

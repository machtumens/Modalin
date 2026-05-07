import { Section } from "./section";

const stats = [
  { value: "65 jt", label: "UMKM di Indonesia", note: "61% PDB · 97% tenaga kerja" },
  { value: "Rp1.605 T", label: "Funding gap per tahun", note: "Bank menuntut agunan, P2P 18–30% bunga" },
  { value: "14,8 jt", label: "Investor ritel aktif", note: "Gen Z & milenial cari instrumen alternatif" },
];

export function ProblemStrip() {
  return (
    <Section className="py-12 lg:py-16">
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="font-display text-3xl font-bold text-brand-700">{s.value}</div>
            <div className="mt-1 text-sm font-medium text-zinc-900">{s.label}</div>
            <div className="mt-1 text-xs text-zinc-500">{s.note}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

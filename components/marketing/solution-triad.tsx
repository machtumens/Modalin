import { Store, Wallet, BarChart3 } from "lucide-react";
import { Section } from "./section";

const items = [
  {
    icon: Store,
    title: "ECF Marketplace",
    body: "Pendanaan ekuitas Rp50–500 jt untuk UMKM early-growth dengan AI scoring berbasis data alternatif. Investor mulai dari Rp100.000 — terendah di industri.",
  },
  {
    icon: Wallet,
    title: "Modalin Bank Account",
    body: "Rekening bisnis digital terintegrasi BPR mitra di bawah POJK 22/2024. Seluruh transaksi UMKM ter-pull otomatis ke dashboard investor via open banking.",
  },
  {
    icon: BarChart3,
    title: "Investor Dashboard",
    body: "Modalin Community (≥5% kepemilikan), Index Fund auto-diversifikasi 10–20 UMKM, dan reimbursement on-demand divalidasi AI terhadap harga pasar real-time.",
  },
];

export function SolutionTriad() {
  return (
    <Section>
      <div className="mb-10 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Tiga modul terintegrasi</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
          Bukan platform brokerage — operating system pertumbuhan UMKM.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold text-zinc-900">{it.title}</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

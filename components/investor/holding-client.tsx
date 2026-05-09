"use client";
import { useDemoStore } from "@/lib/store";
import { formatIDR } from "@/lib/money";

export function HoldingClient({
  umkmId,
  seedAmount,
  seedEquity,
  seedCount,
}: {
  umkmId: string;
  seedAmount: number;
  seedEquity: number;
  seedCount: number;
}) {
  const client = useDemoStore((s) => s.investments.filter((i) => i.umkmId === umkmId));
  const totalAmount = seedAmount + client.reduce((s, i) => s + i.amountIDR, 0);
  const totalEquity = seedEquity + client.reduce((s, i) => s + i.equityPct, 0);
  const totalCount = seedCount + client.length;
  const access = totalEquity >= 5;

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPI label="Investasi Anda" value={formatIDR(totalAmount)} />
      <KPI label="Kepemilikan" value={`${totalEquity.toFixed(3)}%`} />
      <KPI label="Transaksi" value={`${totalCount}×`} />
      <KPI label="Status" value={access ? "Komunitas Aktif" : "Standar"} />
    </section>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-zinc-900">{value}</div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/role";
import { getUMKM, getBankAccount, getTransactionsByUMKM, aggregateHoldings } from "@/lib/data";
import { TxnKind } from "@/lib/enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";
import { HoldingClient } from "@/components/investor/holding-client";

export const dynamic = "force-dynamic";

export default async function HoldingDetail({ params }: { params: Promise<{ umkmId: string }> }) {
  const { demoUserId } = await requireRole("INVESTOR");
  const { umkmId } = await params;

  const u = getUMKM(umkmId);
  if (!u) notFound();
  const ba = getBankAccount(umkmId);
  const txns = getTransactionsByUMKM(umkmId, 100);
  const seed = aggregateHoldings(demoUserId).find((h) => h.umkmId === umkmId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/investor/portfolio" className="text-sm text-brand-700 hover:underline">← Portofolio</Link>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={aiBadgeVariant(u.aiScoreOverride ?? u.aiScore)}>AI {u.aiScoreOverride ?? u.aiScore}</Badge>
            <Badge variant="muted">{sectorLabel[u.sector] ?? u.sector}</Badge>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold">{u.name}</h1>
          <div className="text-sm text-zinc-500">{u.location}, {u.province}</div>
        </div>
        <Link href={`/marketplace/${u.id}`} className="text-sm text-brand-700 hover:underline">Halaman publik →</Link>
      </header>

      <HoldingClient
        umkmId={u.id}
        seedAmount={seed?.amountIDR ?? 0}
        seedEquity={seed?.equityPct ?? 0}
        seedCount={seed?.count ?? 0}
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Live Bank Account — Modalin Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
            <span>{ba?.providerBPR} · ****{ba?.accountNumber.slice(-4)}</span>
            <span>Saldo: <span className="font-semibold text-zinc-900">{formatIDRCompact(ba?.balanceIDR ?? 0)}</span></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                  <th className="pb-2">Waktu</th>
                  <th className="pb-2">Counterparty</th>
                  <th className="pb-2">Channel</th>
                  <th className="pb-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-100 last:border-0">
                    <td className="py-2 text-zinc-600">{new Date(t.ts).toLocaleString("id-ID")}</td>
                    <td className="py-2">{t.counterparty}</td>
                    <td className="py-2 text-zinc-600">{t.channel}</td>
                    <td className={`py-2 text-right font-medium ${t.kind === TxnKind.INFLOW ? "text-emerald-700" : "text-red-600"}`}>
                      {t.kind === TxnKind.INFLOW ? "+" : "-"}{formatIDRCompact(t.amountIDR)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
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

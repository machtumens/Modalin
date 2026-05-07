import { notFound } from "next/navigation";
import Link from "next/link";
import { TxnKind } from "@prisma/client";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { anonymizeCounterparty } from "@/lib/anonymize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function HoldingDetail({ params }: { params: Promise<{ umkmId: string }> }) {
  const session = await requireRole("INVESTOR");
  const { umkmId } = await params;

  const holding = await prisma.investment.aggregate({
    where: { investorId: session.user.id, umkmId },
    _sum: { amountIDR: true, equityPct: true },
    _count: { _all: true },
  });
  if (!holding._count._all) notFound();

  const u = await prisma.uMKM.findUnique({
    where: { id: umkmId },
    include: { bankAccount: { include: { transactions: { orderBy: { ts: "desc" }, take: 100 } } } },
  });
  if (!u) notFound();

  const access = (holding._sum.equityPct ?? 0) >= 5;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/investor/portfolio" className="text-sm text-brand-700 hover:underline">← Portofolio</Link>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={aiBadgeVariant(u.aiScoreOverride ?? u.aiScore)}>AI {u.aiScoreOverride ?? u.aiScore}</Badge>
            <Badge variant="muted">{sectorLabel[u.sector] ?? u.sector}</Badge>
            {access && <Badge variant="warning">Akses Komunitas</Badge>}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold">{u.name}</h1>
          <div className="text-sm text-zinc-500">{u.location}, {u.province}</div>
        </div>
        <Link href={`/marketplace/${u.id}`} className="text-sm text-brand-700 hover:underline">Halaman publik UMKM →</Link>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Investasi Anda" value={formatIDR(Number(holding._sum.amountIDR ?? 0))} />
        <KPI label="Kepemilikan" value={`${(holding._sum.equityPct ?? 0).toFixed(3)}%`} />
        <KPI label="Transaksi" value={`${holding._count._all}×`} />
        <KPI label="Status" value={access ? "Komunitas Aktif" : "Standar"} />
      </section>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Live Bank Account — Modalin Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
            <span>{u.bankAccount?.providerBPR} · ****{u.bankAccount?.accountNumber.slice(-4)}</span>
            <span>Saldo: <span className="font-semibold text-zinc-900">{formatIDRCompact(Number(u.bankAccount?.balanceIDR ?? 0))}</span></span>
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
                {u.bankAccount?.transactions.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-100 last:border-0">
                    <td className="py-2 text-zinc-600">{t.ts.toLocaleString("id-ID")}</td>
                    <td className="py-2">{access ? t.counterparty : anonymizeCounterparty(t.counterparty)}</td>
                    <td className="py-2 text-zinc-600">{t.channel}</td>
                    <td className={`py-2 text-right font-medium ${t.kind === TxnKind.INFLOW ? "text-emerald-700" : "text-red-600"}`}>
                      {t.kind === TxnKind.INFLOW ? "+" : "-"}{formatIDRCompact(Number(t.amountIDR))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!access && (
            <div className="mt-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
              Tingkatkan kepemilikan ke ≥5% untuk membuka counterparty asli + ekspor CSV.
            </div>
          )}
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

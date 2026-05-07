import Link from "next/link";
import { TxnKind } from "@prisma/client";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { anonymizeCounterparty } from "@/lib/anonymize";
import { LiveActivityFeed } from "@/components/investor/live-activity-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { aiBadgeVariant, sectorLabel } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function InvestorDashboard() {
  const session = await requireRole("INVESTOR");
  const userId = session.user.id;

  const [holdings, allCount] = await Promise.all([
    prisma.investment.groupBy({
      by: ["umkmId"],
      where: { investorId: userId },
      _sum: { amountIDR: true, equityPct: true },
    }),
    prisma.uMKM.count({ where: { pitch: { is: { status: "APPROVED" } } } }),
  ]);

  const umkmIds = holdings.map((h) => h.umkmId);
  const umkms = umkmIds.length
    ? await prisma.uMKM.findMany({ where: { id: { in: umkmIds } } })
    : [];
  const umkmMap = new Map(umkms.map((u) => [u.id, u]));

  const totalInvested = holdings.reduce((s, h) => s + Number(h._sum.amountIDR ?? 0), 0);
  const activeUMKM = holdings.length;
  const avgAi = umkms.length
    ? Math.round(umkms.reduce((s, u) => s + (u.aiScoreOverride ?? u.aiScore), 0) / umkms.length)
    : 0;
  const communityAccess = holdings.filter((h) => (h._sum.equityPct ?? 0) >= 5).length;
  const communityIds = new Set(
    holdings.filter((h) => (h._sum.equityPct ?? 0) >= 5).map((h) => h.umkmId)
  );

  const initialFeed = umkmIds.length
    ? await prisma.transaction.findMany({
        where: { bankAccount: { umkmId: { in: umkmIds } } },
        orderBy: { ts: "desc" },
        take: 30,
        include: { bankAccount: { select: { umkmId: true, umkm: { select: { name: true } } } } },
      })
    : [];

  const feedItems = initialFeed.map((t) => ({
    id: t.id,
    ts: t.ts.toISOString(),
    amountIDR: Number(t.amountIDR),
    kind: t.kind === TxnKind.INFLOW ? ("INFLOW" as const) : ("OUTFLOW" as const),
    channel: t.channel,
    counterparty: communityIds.has(t.bankAccount.umkmId)
      ? t.counterparty
      : anonymizeCounterparty(t.counterparty),
    umkmId: t.bankAccount.umkmId,
    umkmName: t.bankAccount.umkm.name,
  }));

  const suggestions = await prisma.uMKM.findMany({
    where: { id: { notIn: umkmIds }, pitch: { is: { status: "APPROVED" } } },
    orderBy: { aiScore: "desc" },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Halo, {session.user.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Dashboard portofolio Anda dengan transparansi real-time dari Modalin Bank Account.
          </p>
        </div>
        <Link href="/marketplace" className="text-sm font-medium text-brand-700 hover:underline">
          Cari UMKM baru →
        </Link>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Total Investasi" value={formatIDR(totalInvested)} />
        <KPI label="UMKM Aktif" value={`${activeUMKM} / ${allCount}`} />
        <KPI label="Avg AI Score" value={`${avgAi}`} />
        <KPI label="Akses Komunitas" value={`${communityAccess}`} />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold">Live Activity</h2>
          <LiveActivityFeed initial={feedItems} />
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold">Saran UMKM</h2>
          <div className="space-y-3">
            {suggestions.map((u) => (
              <Link
                key={u.id}
                href={`/marketplace/${u.id}`}
                className="block rounded-md border border-zinc-200 bg-white p-3 hover:border-brand-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-900">{u.name}</span>
                  <Badge variant={aiBadgeVariant(u.aiScoreOverride ?? u.aiScore)}>
                    AI {u.aiScoreOverride ?? u.aiScore}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {sectorLabel[u.sector] ?? u.sector} · {u.location} · target {formatIDRCompact(Number(u.fundingTargetIDR))}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/investor/index-fund" className="block rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white">
              <div className="text-xs uppercase tracking-wide opacity-80">Modalin Index Fund</div>
              <div className="mt-1 font-semibold">Diversifikasi otomatis ke 15 UMKM terkurasi</div>
              <div className="mt-2 text-xs opacity-80">Konservatif · Balanced · Growth →</div>
            </Link>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-xl font-semibold">Holdings</h2>
        {holdings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-zinc-500">
              Belum ada investasi. <Link href="/marketplace" className="text-brand-700 underline">Mulai dari Marketplace</Link>.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Top 5 holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                    <th className="pb-2">UMKM</th>
                    <th className="pb-2">Sektor</th>
                    <th className="pb-2 text-right">Investasi</th>
                    <th className="pb-2 text-right">Equity</th>
                    <th className="pb-2 text-right">AI Score</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings
                    .sort((a, b) => Number(b._sum.amountIDR ?? 0) - Number(a._sum.amountIDR ?? 0))
                    .slice(0, 5)
                    .map((h) => {
                      const u = umkmMap.get(h.umkmId)!;
                      const access = (h._sum.equityPct ?? 0) >= 5;
                      return (
                        <tr key={h.umkmId} className="border-b border-zinc-100 last:border-0">
                          <td className="py-3">
                            <Link href={`/investor/portfolio/${u.id}`} className="font-medium text-zinc-900 hover:text-brand-700">
                              {u.name}
                            </Link>
                            {access && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800">Komunitas</span>}
                          </td>
                          <td className="py-3 text-zinc-600">{sectorLabel[u.sector] ?? u.sector}</td>
                          <td className="py-3 text-right font-medium">{formatIDRCompact(Number(h._sum.amountIDR ?? 0))}</td>
                          <td className="py-3 text-right">{(h._sum.equityPct ?? 0).toFixed(2)}%</td>
                          <td className="py-3 text-right">{u.aiScoreOverride ?? u.aiScore}</td>
                          <td className="py-3 text-right">
                            <Link href={`/investor/portfolio/${u.id}`} className="text-xs text-brand-700 hover:underline">Detail →</Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {holdings.length > 5 && (
                <Link href="/investor/portfolio" className="mt-4 block text-center text-sm text-brand-700 hover:underline">
                  Lihat semua holdings ({holdings.length}) →
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
        <div className="mt-1 font-display text-2xl font-bold text-zinc-900">{value}</div>
      </CardContent>
    </Card>
  );
}

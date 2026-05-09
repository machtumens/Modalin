import Link from "next/link";
import { requireRole } from "@/lib/role";
import { aggregateHoldings, getRecentTransactions, suggestUMKM, umkms as allUMKMs } from "@/lib/data";
import { LiveActivityFeed } from "@/components/investor/live-activity-feed";
import { InvestorDashboardClient } from "@/components/investor/dashboard-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiBadgeVariant, sectorLabel } from "@/lib/labels";
import { formatIDRCompact } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function InvestorDashboard() {
  const { demoUserId } = await requireRole("INVESTOR");
  const seedHoldings = aggregateHoldings(demoUserId);
  const seedUmkmIds = seedHoldings.map((h) => h.umkmId);
  const initialFeed = getRecentTransactions(seedUmkmIds, 30).map((t) => {
    const u = allUMKMs.find((x) => x.id === t.umkmId);
    return {
      id: t.id,
      ts: t.ts,
      amountIDR: t.amountIDR,
      kind: t.kind,
      channel: t.channel,
      counterparty: t.counterparty,
      umkmId: t.umkmId,
      umkmName: u?.name ?? "—",
    };
  });
  const suggestions = suggestUMKM(seedUmkmIds, 3);
  const allCount = allUMKMs.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Dashboard Investor</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Portofolio Anda + transparansi real-time dari Modalin Bank Account.
          </p>
        </div>
        <Link href="/marketplace" className="text-sm font-medium text-brand-400 hover:text-brand-300">
          Cari UMKM baru →
        </Link>
      </header>

      <InvestorDashboardClient
        seedHoldings={seedHoldings.map((h) => {
          const u = allUMKMs.find((x) => x.id === h.umkmId)!;
          return {
            umkmId: h.umkmId,
            umkmName: u.name,
            sector: u.sector,
            aiScore: u.aiScoreOverride ?? u.aiScore,
            amountIDR: h.amountIDR,
            equityPct: h.equityPct,
            count: h.count,
          };
        })}
        allCount={allCount}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-white">Live Activity</h2>
          <LiveActivityFeed initial={initialFeed} />
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-white">Saran UMKM</h2>
          <div className="space-y-3">
            {suggestions.map((u) => (
              <Link
                key={u.id}
                href={`/marketplace/${u.id}`}
                className="block rounded-md border border-zinc-800 bg-zinc-900/50 p-3 backdrop-blur transition-colors hover:border-brand-400/60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{u.name}</span>
                  <Badge variant={aiBadgeVariant(u.aiScoreOverride ?? u.aiScore)}>
                    AI {u.aiScoreOverride ?? u.aiScore}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  {sectorLabel[u.sector] ?? u.sector} · {u.location} · target {formatIDRCompact(u.fundingTargetIDR)}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/investor/index-fund" className="block rounded-xl border border-brand-400/30 bg-gradient-to-br from-brand-600/40 to-brand-900/40 p-5 text-white backdrop-blur transition-colors hover:border-brand-400/60">
              <div className="text-xs uppercase tracking-wide text-brand-300">Modalin Index Fund</div>
              <div className="mt-1 font-semibold">Diversifikasi otomatis ke 15 UMKM</div>
              <div className="mt-2 text-xs text-zinc-300">Konservatif · Balanced · Growth →</div>
            </Link>
          </div>
        </section>
      </div>

      {seedHoldings.length === 0 && (
        <Card className="mt-10">
          <CardContent className="py-8 text-center text-sm text-zinc-400">
            Belum ada investasi. <Link href="/marketplace" className="text-brand-400 underline">Mulai dari Marketplace</Link>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

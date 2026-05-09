"use client";
import Link from "next/link";
import { useDemoStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel } from "@/lib/labels";

type SeedHolding = {
  umkmId: string;
  umkmName: string;
  sector: string;
  aiScore: number;
  amountIDR: number;
  equityPct: number;
  count: number;
};

export function InvestorDashboardClient({
  seedHoldings,
  allCount,
}: {
  seedHoldings: SeedHolding[];
  allCount: number;
}) {
  const clientInvestments = useDemoStore((s) => s.investments);

  // Merge seed + client investments by umkmId
  const map = new Map<string, SeedHolding>();
  for (const h of seedHoldings) map.set(h.umkmId, { ...h });
  for (const ci of clientInvestments) {
    const ex = map.get(ci.umkmId);
    if (ex) {
      ex.amountIDR += ci.amountIDR;
      ex.equityPct += ci.equityPct;
      ex.count += 1;
    } else {
      map.set(ci.umkmId, {
        umkmId: ci.umkmId,
        umkmName: ci.umkmName,
        sector: "—",
        aiScore: 0,
        amountIDR: ci.amountIDR,
        equityPct: ci.equityPct,
        count: 1,
      });
    }
  }

  const merged = [...map.values()].sort((a, b) => b.amountIDR - a.amountIDR);
  const totalInvested = merged.reduce((s, h) => s + h.amountIDR, 0);
  const activeUMKM = merged.length;
  const avgAi = merged.length
    ? Math.round(merged.reduce((s, h) => s + h.aiScore, 0) / merged.length)
    : 0;
  const communityAccess = merged.filter((h) => h.equityPct >= 5).length;

  return (
    <>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Total Investasi" value={formatIDR(totalInvested)} />
        <KPI label="UMKM Aktif" value={`${activeUMKM} / ${allCount}`} />
        <KPI label="Avg AI Score" value={`${avgAi}`} />
        <KPI label="Akses Komunitas" value={`${communityAccess}`} />
      </section>

      {merged.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-semibold text-white">Top Holdings</h2>
          <Card>
            <CardHeader>
              <CardTitle>Portofolio Anda</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/60 text-left text-xs text-zinc-400">
                    <th className="pb-2">UMKM</th>
                    <th className="pb-2">Sektor</th>
                    <th className="pb-2 text-right">Investasi</th>
                    <th className="pb-2 text-right">Equity</th>
                    <th className="pb-2 text-right">AI Score</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {merged.slice(0, 5).map((h) => {
                    const access = h.equityPct >= 5;
                    return (
                      <tr key={h.umkmId} className="border-b border-zinc-800/60 last:border-0">
                        <td className="py-3">
                          <Link href={`/investor/portfolio/${h.umkmId}`} className="font-medium text-white hover:text-brand-400">
                            {h.umkmName}
                          </Link>
                          {access && <span className="ml-2 rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] text-gold-300 ring-1 ring-inset ring-gold-400/30">Komunitas</span>}
                        </td>
                        <td className="py-3 text-zinc-400">{sectorLabel[h.sector] ?? h.sector}</td>
                        <td className="py-3 text-right font-medium text-zinc-200">{formatIDRCompact(h.amountIDR)}</td>
                        <td className="py-3 text-right text-zinc-200">{h.equityPct.toFixed(2)}%</td>
                        <td className="py-3 text-right text-zinc-200">{h.aiScore || "—"}</td>
                        <td className="py-3 text-right">
                          <Link href={`/investor/portfolio/${h.umkmId}`} className="text-xs text-brand-400 hover:text-brand-300">Detail →</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
        <div className="mt-1 font-display text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}

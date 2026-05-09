"use client";
import Link from "next/link";
import { useDemoStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel } from "@/lib/labels";

type Seed = {
  umkmId: string;
  umkmName: string;
  sector: string;
  aiScore: number;
  amountIDR: number;
  equityPct: number;
  count: number;
};

export function PortfolioTable({ seedHoldings }: { seedHoldings: Seed[] }) {
  const client = useDemoStore((s) => s.investments);

  const map = new Map<string, Seed>();
  for (const h of seedHoldings) map.set(h.umkmId, { ...h });
  for (const ci of client) {
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
  const total = merged.reduce((s, h) => s + h.amountIDR, 0);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{merged.length} UMKM aktif</CardTitle>
      </CardHeader>
      <CardContent>
        {merged.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500">
            Belum ada investasi. <Link href="/marketplace" className="text-brand-700 underline">Mulai dari Marketplace</Link>.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                <th className="pb-2">UMKM</th>
                <th className="pb-2">Sektor</th>
                <th className="pb-2 text-right">Total Investasi</th>
                <th className="pb-2 text-right">Equity</th>
                <th className="pb-2 text-right">Transaksi</th>
                <th className="pb-2 text-right">AI Score</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {merged.map((h) => {
                const access = h.equityPct >= 5;
                return (
                  <tr key={h.umkmId} className="border-b border-zinc-100 last:border-0">
                    <td className="py-3 font-medium">
                      {h.umkmName}
                      {access && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800">Komunitas</span>}
                    </td>
                    <td className="py-3 text-zinc-600">{sectorLabel[h.sector] ?? h.sector}</td>
                    <td className="py-3 text-right">{formatIDR(h.amountIDR)}</td>
                    <td className="py-3 text-right">{h.equityPct.toFixed(2)}%</td>
                    <td className="py-3 text-right text-zinc-600">{h.count}×</td>
                    <td className="py-3 text-right">{h.aiScore || "—"}</td>
                    <td className="py-3 text-right">
                      <Link href={`/investor/portfolio/${h.umkmId}`} className="text-xs text-brand-700 hover:underline">Detail →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className="mt-6 flex justify-end gap-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
          <span>Total invested: <span className="font-semibold text-zinc-900">{formatIDRCompact(total)}</span></span>
        </div>
      </CardContent>
    </Card>
  );
}

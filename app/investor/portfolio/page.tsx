import Link from "next/link";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const session = await requireRole("INVESTOR");
  const holdings = await prisma.investment.groupBy({
    by: ["umkmId"],
    where: { investorId: session.user.id },
    _sum: { amountIDR: true, equityPct: true },
    _count: { _all: true },
  });
  const umkms = holdings.length
    ? await prisma.uMKM.findMany({ where: { id: { in: holdings.map((h) => h.umkmId) } } })
    : [];
  const umkmMap = new Map(umkms.map((u) => [u.id, u]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Portofolio</h1>
      <p className="mt-1 text-sm text-zinc-500">{holdings.length} UMKM aktif.</p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Semua holdings</CardTitle>
        </CardHeader>
        <CardContent>
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
              {holdings.map((h) => {
                const u = umkmMap.get(h.umkmId)!;
                const access = (h._sum.equityPct ?? 0) >= 5;
                return (
                  <tr key={h.umkmId} className="border-b border-zinc-100 last:border-0">
                    <td className="py-3 font-medium">
                      {u.name}
                      {access && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800">Komunitas</span>}
                    </td>
                    <td className="py-3 text-zinc-600">{sectorLabel[u.sector] ?? u.sector}</td>
                    <td className="py-3 text-right">{formatIDR(Number(h._sum.amountIDR ?? 0))}</td>
                    <td className="py-3 text-right">{(h._sum.equityPct ?? 0).toFixed(2)}%</td>
                    <td className="py-3 text-right text-zinc-600">{h._count._all}×</td>
                    <td className="py-3 text-right">{u.aiScoreOverride ?? u.aiScore}</td>
                    <td className="py-3 text-right">
                      <Link href={`/investor/portfolio/${u.id}`} className="text-xs text-brand-700 hover:underline">Detail →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {holdings.length === 0 && (
            <div className="py-12 text-center text-sm text-zinc-500">Belum ada investasi.</div>
          )}
          <div className="mt-6 flex justify-end gap-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
            <span>Total invested: <span className="font-semibold text-zinc-900">{formatIDRCompact(holdings.reduce((s, h) => s + Number(h._sum.amountIDR ?? 0), 0))}</span></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

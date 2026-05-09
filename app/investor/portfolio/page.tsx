import { requireRole } from "@/lib/role";
import { aggregateHoldings, umkms as allUMKMs } from "@/lib/data";
import { PortfolioTable } from "@/components/investor/portfolio-table";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const { demoUserId } = await requireRole("INVESTOR");
  const seed = aggregateHoldings(demoUserId).map((h) => {
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
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Portofolio</h1>
      <p className="mt-1 text-sm text-zinc-500">Holdings Anda lengkap.</p>
      <PortfolioTable seedHoldings={seed} />
    </div>
  );
}

import Link from "next/link";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function CommunityListPage() {
  const session = await requireRole("INVESTOR");
  const holdings = await prisma.investment.groupBy({
    by: ["umkmId"],
    where: { investorId: session.user.id },
    _sum: { equityPct: true },
  });
  const eligibleIds = holdings.filter((h) => (h._sum.equityPct ?? 0) >= 5).map((h) => h.umkmId);
  const umkms = eligibleIds.length
    ? await prisma.uMKM.findMany({ where: { id: { in: eligibleIds } } })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Modalin Community</h1>
      <p className="mt-2 text-zinc-600">
        Kepemilikan ≥5% memberi Anda akses langsung ke pendiri: update eksklusif, metrik internal, dan diskusi privat.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {umkms.map((u) => (
          <Link key={u.id} href={`/investor/community/${u.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{u.name}</span>
                  <Badge variant={aiBadgeVariant(u.aiScoreOverride ?? u.aiScore)}>
                    AI {u.aiScoreOverride ?? u.aiScore}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-zinc-500">{sectorLabel[u.sector] ?? u.sector} · {u.location}</div>
                <div className="mt-3 text-xs text-brand-700">Buka komunitas →</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {umkms.length === 0 && (
        <Card className="mt-8">
          <CardContent className="py-12 text-center text-sm text-zinc-500">
            Belum ada UMKM dengan kepemilikan Anda ≥5%. Tingkatkan kepemilikan dari{" "}
            <Link href="/marketplace" className="text-brand-700 underline">Marketplace</Link>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

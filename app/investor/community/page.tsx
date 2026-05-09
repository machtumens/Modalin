import Link from "next/link";
import { requireRole } from "@/lib/role";
import { aggregateHoldings, umkms as allUMKMs } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";
import { CommunityClientList } from "@/components/investor/community-client-list";

export const dynamic = "force-dynamic";

export default async function CommunityListPage() {
  const { demoUserId } = await requireRole("INVESTOR");
  const seed = aggregateHoldings(demoUserId).filter((h) => h.equityPct >= 5);
  const seedRows = seed.map((h) => {
    const u = allUMKMs.find((x) => x.id === h.umkmId)!;
    return {
      umkmId: u.id,
      name: u.name,
      sector: u.sector,
      location: u.location,
      aiScore: u.aiScoreOverride ?? u.aiScore,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Modalin Community</h1>
      <p className="mt-2 text-zinc-600">
        Kepemilikan ≥5% memberi akses langsung ke pendiri: update eksklusif dan diskusi privat.
      </p>

      {seedRows.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {seedRows.map((u) => (
            <Link key={u.umkmId} href={`/investor/community/${u.umkmId}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{u.name}</span>
                    <Badge variant={aiBadgeVariant(u.aiScore)}>AI {u.aiScore}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{sectorLabel[u.sector] ?? u.sector} · {u.location}</div>
                  <div className="mt-3 text-xs text-brand-700">Buka komunitas →</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CommunityClientList seedUmkmIds={seedRows.map((r) => r.umkmId)} />
    </div>
  );
}

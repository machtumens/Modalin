import Link from "next/link";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiBadgeVariant, sectorLabel } from "@/lib/labels";
import { formatIDRCompact } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminUMKMQueue() {
  await requireRole("ADMIN");
  const pending = await prisma.uMKM.findMany({
    where: { pitch: { is: { status: "PENDING_REVIEW" } } },
    include: { pitch: true, owner: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const all = await prisma.uMKM.findMany({
    where: { pitch: { is: { status: "APPROVED" } } },
    include: { pitch: true },
    orderBy: { aiScore: "desc" },
    take: 30,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Curation</h1>
        <p className="mt-1 text-sm text-zinc-500">{pending.length} pitch menunggu review.</p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Antrian Review</h2>
        {pending.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-sm text-zinc-500">Tidak ada antrian.</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {pending.map((u) => (
              <Link key={u.id} href={`/admin/umkm/${u.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <div className="font-medium text-zinc-900">{u.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {u.owner.name} · {sectorLabel[u.sector] ?? u.sector} · {u.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={aiBadgeVariant(u.aiScoreOverride ?? u.aiScore)}>AI {u.aiScoreOverride ?? u.aiScore}</Badge>
                      <span className="text-sm">{formatIDRCompact(Number(u.fundingTargetIDR))}</span>
                      <span className="text-xs text-brand-700">Review →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">UMKM Approved (top 30)</h2>
        <Card>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                  <th className="pb-2">UMKM</th>
                  <th className="pb-2">Sektor</th>
                  <th className="pb-2 text-right">AI</th>
                  <th className="pb-2 text-right">Target</th>
                  <th className="pb-2 text-right">Raised</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {all.map((u) => (
                  <tr key={u.id} className="border-b border-zinc-100 last:border-0">
                    <td className="py-2 font-medium">{u.name}</td>
                    <td className="py-2 text-zinc-600">{sectorLabel[u.sector] ?? u.sector}</td>
                    <td className="py-2 text-right">{u.aiScoreOverride ?? u.aiScore}</td>
                    <td className="py-2 text-right">{formatIDRCompact(Number(u.fundingTargetIDR))}</td>
                    <td className="py-2 text-right">{formatIDRCompact(Number(u.pitch?.raisedIDR ?? 0))}</td>
                    <td className="py-2 text-right">
                      <Link href={`/admin/umkm/${u.id}`} className="text-xs text-brand-700 hover:underline">Detail →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

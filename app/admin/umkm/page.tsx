import Link from "next/link";
import { requireRole } from "@/lib/role";
import { umkms, getPitch } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { aiBadgeVariant, sectorLabel } from "@/lib/labels";
import { formatIDRCompact } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminUMKMQueue() {
  await requireRole("ADMIN");
  const all = [...umkms].sort((a, b) => (b.aiScoreOverride ?? b.aiScore) - (a.aiScoreOverride ?? a.aiScore)).slice(0, 30);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Curation</h1>
        <p className="mt-1 text-sm text-zinc-500">Demo prototype — semua pitch APPROVED di seed.</p>
      </header>

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
                {all.map((u) => {
                  const p = getPitch(u.id);
                  return (
                    <tr key={u.id} className="border-b border-zinc-100 last:border-0">
                      <td className="py-2 font-medium">{u.name}</td>
                      <td className="py-2 text-zinc-600">{sectorLabel[u.sector] ?? u.sector}</td>
                      <td className="py-2 text-right">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                          aiBadgeVariant(u.aiScoreOverride ?? u.aiScore) === "success" ? "border-transparent bg-emerald-100 text-emerald-800" :
                          aiBadgeVariant(u.aiScoreOverride ?? u.aiScore) === "warning" ? "border-transparent bg-amber-100 text-amber-800" :
                          "border-transparent bg-zinc-100 text-zinc-700"
                        }`}>{u.aiScoreOverride ?? u.aiScore}</span>
                      </td>
                      <td className="py-2 text-right">{formatIDRCompact(u.fundingTargetIDR)}</td>
                      <td className="py-2 text-right">{formatIDRCompact(p?.raisedIDR ?? 0)}</td>
                      <td className="py-2 text-right">
                        <Link href={`/admin/umkm/${u.id}`} className="text-xs text-brand-700 hover:underline">Detail →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

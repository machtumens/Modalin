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
        <h1 className="font-display text-3xl font-bold text-white">Curation</h1>
        <p className="mt-1 text-sm text-zinc-400">Demo prototype — semua pitch APPROVED di seed.</p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-white">UMKM Approved (top 30)</h2>
        <Card>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/60 text-left text-xs text-zinc-400">
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
                  const variant = aiBadgeVariant(u.aiScoreOverride ?? u.aiScore);
                  return (
                    <tr key={u.id} className="border-b border-zinc-800/60 last:border-0">
                      <td className="py-2 font-medium text-white">{u.name}</td>
                      <td className="py-2 text-zinc-400">{sectorLabel[u.sector] ?? u.sector}</td>
                      <td className="py-2 text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          variant === "success" ? "bg-brand-500/15 text-brand-300 ring-brand-400/30" :
                          variant === "warning" ? "bg-gold-500/15 text-gold-300 ring-gold-400/30" :
                          "bg-zinc-800 text-zinc-300 ring-zinc-700"
                        }`}>{u.aiScoreOverride ?? u.aiScore}</span>
                      </td>
                      <td className="py-2 text-right text-zinc-200">{formatIDRCompact(u.fundingTargetIDR)}</td>
                      <td className="py-2 text-right text-zinc-200">{formatIDRCompact(p?.raisedIDR ?? 0)}</td>
                      <td className="py-2 text-right">
                        <Link href={`/admin/umkm/${u.id}`} className="text-xs text-brand-400 hover:text-brand-300">Detail →</Link>
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

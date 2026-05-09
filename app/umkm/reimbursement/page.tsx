import Link from "next/link";
import { requireRole } from "@/lib/role";
import { getOwnedUMKM, getReimbursementsByUMKM } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReimbursementList } from "@/components/umkm/reimbursement-list";

export const dynamic = "force-dynamic";

export default async function ReimbursementListPage() {
  const { demoUserId } = await requireRole("UMKM");
  const u = getOwnedUMKM(demoUserId);
  const seedItems = u
    ? getReimbursementsByUMKM(u.id).map((r) => ({
        id: r.id,
        umkmId: r.umkmId,
        amountIDR: r.amountIDR,
        category: r.category,
        description: r.description,
        supplier: r.supplier ?? undefined,
        refPriceIDR: r.refPriceIDR,
        deltaPct: r.deltaPct,
        verdict: r.verdict,
        status: r.status,
        createdAt: r.createdAt,
      }))
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Reimbursement</h1>
          <p className="mt-1 text-sm text-zinc-500">Riwayat pengajuan pencairan dana operasional.</p>
        </div>
        <Button asChild><Link href="/umkm/reimbursement/new">+ Ajukan Baru</Link></Button>
      </header>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          <ReimbursementList umkmId={u?.id ?? ""} seedItems={seedItems} />
        </CardContent>
      </Card>
    </div>
  );
}

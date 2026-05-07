import Link from "next/link";
import { ReimbursementStatus } from "@prisma/client";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/money";
import { CATEGORY_LABEL, type ReimbursementCategory } from "@/lib/ai/price-validator";

export const dynamic = "force-dynamic";

const statusBadge: Record<ReimbursementStatus, { variant: "success" | "warning" | "muted" | "default"; label: string }> = {
  AUTO_APPROVED: { variant: "success", label: "Auto-approved" },
  DISBURSED: { variant: "success", label: "Cair" },
  PENDING_ADMIN_REVIEW: { variant: "warning", label: "Review admin" },
  BLOCKED_PRICE_CHECK: { variant: "muted", label: "Diblok harga" },
  REJECTED: { variant: "muted", label: "Ditolak" },
};

export default async function ReimbursementListPage() {
  const session = await requireRole("UMKM");
  const u = await prisma.uMKM.findFirst({ where: { ownerId: session.user.id } });
  const items = u
    ? await prisma.reimbursement.findMany({
        where: { umkmId: u.id },
        orderBy: { createdAt: "desc" },
      })
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
          {items.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-500">Belum ada pengajuan.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                  <th className="pb-2">Tanggal</th>
                  <th className="pb-2">Kategori</th>
                  <th className="pb-2 text-right">Jumlah</th>
                  <th className="pb-2 text-right">Δ vs ref</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => {
                  const b = statusBadge[r.status];
                  return (
                    <tr key={r.id} className="border-b border-zinc-100 last:border-0">
                      <td className="py-3 text-zinc-600">{r.createdAt.toLocaleDateString("id-ID")}</td>
                      <td className="py-3">{CATEGORY_LABEL[r.category as ReimbursementCategory] ?? r.category}</td>
                      <td className="py-3 text-right font-medium">{formatIDR(Number(r.amountIDR))}</td>
                      <td className="py-3 text-right text-xs">{r.deltaPct !== null ? `${r.deltaPct >= 0 ? "+" : ""}${r.deltaPct}%` : "—"}</td>
                      <td className="py-3"><Badge variant={b.variant}>{b.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

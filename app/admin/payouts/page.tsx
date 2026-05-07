import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveReimbursement, rejectReimbursement } from "@/actions/admin";
import { formatIDR } from "@/lib/money";
import { CATEGORY_LABEL, type ReimbursementCategory } from "@/lib/ai/price-validator";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  await requireRole("ADMIN");
  const items = await prisma.reimbursement.findMany({
    where: { status: { in: ["PENDING_ADMIN_REVIEW", "BLOCKED_PRICE_CHECK"] } },
    orderBy: { createdAt: "desc" },
    include: { umkm: { select: { name: true, bankAccount: { select: { balanceIDR: true } } } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Payout Approval</h1>
        <p className="mt-1 text-sm text-zinc-500">{items.length} reimbursement menunggu keputusan.</p>
      </header>

      {items.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-zinc-500">Tidak ada antrian payout.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {items.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      {r.umkm.name} · {CATEGORY_LABEL[r.category as ReimbursementCategory] ?? r.category}
                    </CardTitle>
                    <div className="mt-1 text-xs text-zinc-500">
                      Pengajuan {r.createdAt.toLocaleString("id-ID")} · saldo UMKM {formatIDR(Number(r.umkm.bankAccount?.balanceIDR ?? 0))}
                    </div>
                  </div>
                  <Badge variant={r.status === "BLOCKED_PRICE_CHECK" ? "warning" : "muted"}>
                    {r.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <Cell k="Jumlah" v={formatIDR(Number(r.amountIDR))} />
                  <Cell k="Ref harga" v={formatIDR(Number(r.refPriceIDR ?? 0))} />
                  <Cell k="Δ vs ref" v={r.deltaPct !== null ? `${r.deltaPct >= 0 ? "+" : ""}${r.deltaPct}%` : "—"} />
                  <Cell k="AI Verdict" v={r.verdict ?? "—"} />
                </div>
                {r.supplier && <div><span className="text-zinc-500">Supplier:</span> {r.supplier}</div>}
                <div><span className="text-zinc-500">Deskripsi:</span> {r.description}</div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <form
                    action={async () => {
                      "use server";
                      await approveReimbursement(r.id);
                    }}
                  >
                    <Button type="submit" size="sm">Approve & Cair</Button>
                  </form>
                  <form
                    action={async (formData) => {
                      "use server";
                      await rejectReimbursement(r.id, String(formData.get("reason") ?? "Ditolak admin"));
                    }}
                    className="flex flex-1 items-center gap-2"
                  >
                    <input
                      name="reason"
                      placeholder="Alasan reject"
                      className="h-8 flex-1 rounded-md border border-zinc-300 bg-white px-2 text-xs"
                    />
                    <Button type="submit" size="sm" variant="destructive">Reject</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-2">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{k}</div>
      <div className="mt-0.5 font-medium text-zinc-900">{v}</div>
    </div>
  );
}

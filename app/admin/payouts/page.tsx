import { requireRole } from "@/lib/role";
import { getReimbursementsByStatus, getUMKM } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/money";
import { CATEGORY_LABEL, type ReimbursementCategory } from "@/lib/ai/price-validator";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  await requireRole("ADMIN");
  const items = getReimbursementsByStatus(["PENDING_ADMIN_REVIEW", "BLOCKED_PRICE_CHECK"]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-white">Payout Approval</h1>
        <p className="mt-1 text-sm text-zinc-400">{items.length} reimbursement menunggu keputusan (data seed).</p>
      </header>

      {items.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-zinc-400">Tidak ada antrian payout.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {items.map((r) => {
            const u = getUMKM(r.umkmId);
            return (
              <Card key={r.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {u?.name} · {CATEGORY_LABEL[r.category as ReimbursementCategory] ?? r.category}
                      </CardTitle>
                      <div className="mt-1 text-xs text-zinc-400">
                        Pengajuan {new Date(r.createdAt).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <Badge variant={r.status === "BLOCKED_PRICE_CHECK" ? "warning" : "muted"}>
                      {r.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    <Cell k="Jumlah" v={formatIDR(r.amountIDR)} />
                    <Cell k="Ref harga" v={formatIDR(r.refPriceIDR)} />
                    <Cell k="Δ vs ref" v={`${r.deltaPct >= 0 ? "+" : ""}${r.deltaPct}%`} />
                    <Cell k="AI Verdict" v={r.verdict} />
                  </div>
                  {r.supplier && <div className="text-zinc-300"><span className="text-zinc-400">Supplier:</span> {r.supplier}</div>}
                  <div className="text-zinc-300"><span className="text-zinc-400">Deskripsi:</span> {r.description}</div>
                  <p className="pt-2 text-xs text-zinc-400">Demo prototype — aksi approve/reject tidak tersedia di mode statis.</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/60 p-2">
      <div className="text-[10px] uppercase tracking-wide text-zinc-400">{k}</div>
      <div className="mt-0.5 font-medium text-white">{v}</div>
    </div>
  );
}

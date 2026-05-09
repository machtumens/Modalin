import Link from "next/link";
import { requireRole } from "@/lib/role";
import { platformMetrics, reimbursements, umkms } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR, formatIDRCompact } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireRole("ADMIN");
  const m = platformMetrics();
  const pendingPayouts = reimbursements.filter((r) => r.status === "PENDING_ADMIN_REVIEW" || r.status === "BLOCKED_PRICE_CHECK").length;
  const pendingPitch = umkms.length === 0 ? 0 : 0; // all approved in seed; demo

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Admin Console</h1>
      <p className="mt-1 text-sm text-zinc-400">Metrik platform demo (data seed).</p>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total AUM" value={formatIDR(m.totalAum)} />
        <Stat label="UMKM Terdanai" value={`${m.umkmFunded}`} />
        <Stat label="Investor Ritel" value={`${m.investorCount}`} />
        <Stat label="GMV BPR (30 hari)" value={formatIDRCompact(m.gmv30)} />
        <Stat label="Avg AI Score" value={`${m.avgScore}`} />
        <Stat label="Success Fee Akrual" value={formatIDR(m.successFee)} />
      </section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Curation Queue</CardTitle></CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-bold text-white">{pendingPitch}</div>
            <div className="text-xs text-zinc-400">pitch menunggu review</div>
            <Link href="/admin/umkm" className="mt-3 inline-block text-sm text-brand-400 hover:text-brand-300">Buka antrian →</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Payout Queue</CardTitle></CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-bold text-white">{pendingPayouts}</div>
            <div className="text-xs text-zinc-400">reimbursement menunggu approval</div>
            <Link href="/admin/payouts" className="mt-3 inline-block text-sm text-brand-400 hover:text-brand-300">Buka payouts →</Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
        <div className="mt-1 font-display text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}

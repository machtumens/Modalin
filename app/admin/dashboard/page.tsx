import Link from "next/link";
import { TxnKind } from "@prisma/client";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR, formatIDRCompact } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireRole("ADMIN");

  const since30 = new Date(Date.now() - 30 * 86_400_000);

  const [aum, umkmFundedRaw, investors, gmvAgg, avgScoreAgg, pendingPitch, pendingPayouts] = await Promise.all([
    prisma.investment.aggregate({ _sum: { amountIDR: true } }),
    prisma.investment.findMany({ select: { umkmId: true }, distinct: ["umkmId"] }),
    prisma.user.count({ where: { role: "INVESTOR" } }),
    prisma.transaction.aggregate({
      where: { kind: TxnKind.INFLOW, ts: { gte: since30 } },
      _sum: { amountIDR: true },
    }),
    prisma.uMKM.aggregate({ _avg: { aiScore: true } }),
    prisma.pitch.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.reimbursement.count({ where: { status: "PENDING_ADMIN_REVIEW" } }),
  ]);

  const totalAum = Number(aum._sum.amountIDR ?? 0);
  const successFee = Math.round(totalAum * 0.05);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Admin Console</h1>
      <p className="mt-1 text-sm text-zinc-500">Metrik platform real-time.</p>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total AUM" value={formatIDR(totalAum)} />
        <Stat label="UMKM Terdanai" value={`${umkmFundedRaw.length}`} />
        <Stat label="Investor Ritel" value={`${investors}`} />
        <Stat label="GMV BPR (30 hari)" value={formatIDRCompact(Number(gmvAgg._sum.amountIDR ?? 0))} />
        <Stat label="Avg AI Score" value={`${Math.round(avgScoreAgg._avg.aiScore ?? 0)}`} />
        <Stat label="Success Fee Akrual" value={formatIDR(successFee)} />
      </section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Curation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-bold">{pendingPitch}</div>
            <div className="text-xs text-zinc-500">pitch menunggu review</div>
            <Link href="/admin/umkm" className="mt-3 inline-block text-sm text-brand-700 hover:underline">Buka antrian →</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payout Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-bold">{pendingPayouts}</div>
            <div className="text-xs text-zinc-500">reimbursement menunggu approval</div>
            <Link href="/admin/payouts" className="mt-3 inline-block text-sm text-brand-700 hover:underline">Buka payouts →</Link>
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
        <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
        <div className="mt-1 font-display text-2xl font-bold text-zinc-900">{value}</div>
      </CardContent>
    </Card>
  );
}

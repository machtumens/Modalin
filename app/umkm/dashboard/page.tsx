import Link from "next/link";
import { TxnKind } from "@prisma/client";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { scoreUMKM } from "@/lib/ai/scorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function UMKMDashboard() {
  const session = await requireRole("UMKM");

  const u = await prisma.uMKM.findFirst({
    where: { ownerId: session.user.id },
    include: {
      bankAccount: { include: { transactions: { orderBy: { ts: "desc" }, take: 30 } } },
      pitch: true,
      investments: { include: { investor: { select: { name: true } } } },
    },
  });

  if (!u) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="font-display text-2xl font-bold">Profil UMKM belum dibuat</h1>
            <p className="mt-2 text-sm text-zinc-600">Hubungi admin untuk inisialisasi profil bisnis Anda.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const target = Number(u.fundingTargetIDR);
  const raised = Number(u.pitch?.raisedIDR ?? 0);
  const pct = Math.min(100, Math.round((raised / target) * 100));
  const balance = Number(u.bankAccount?.balanceIDR ?? 0);

  const score = scoreUMKM({
    monthlyRevenueIDR: Number(u.monthlyRevenueIDR),
    ageMonths: u.ageMonths,
    sliKScore: u.sliKScore,
    ecomVelocity: u.ecomVelocity,
    digitalBehavior: u.digitalBehavior,
    sector: u.sector,
  });
  const finalScore = u.aiScoreOverride ?? score.total;
  const lowestComp = Object.entries(score.components).sort((a, b) => a[1] - b[1])[0];
  const tipMap: Record<string, string> = {
    slik: "Tingkatkan skor: bayar tagihan tepat waktu, kurangi outstanding.",
    ecommerce: "Tingkatkan skor: tambah volume QRIS, perbanyak channel marketplace.",
    behavior: "Tingkatkan skor: lengkapi profil digital, konsisten dengan kanal.",
    revenueAge: "Tingkatkan skor: dorong pertumbuhan omzet bulanan.",
    sectorOutlook: "Outlook sektor: perluas portofolio produk untuk mengurangi sensitivitas sektor.",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white">
        <div>
          <div className="text-xs uppercase tracking-wide opacity-80">{u.bankAccount?.providerBPR}</div>
          <div className="mt-1 text-sm">****{u.bankAccount?.accountNumber.slice(-4)}</div>
          <div className="mt-4 text-xs uppercase tracking-wide opacity-80">Saldo Modalin Bank Account</div>
          <div className="mt-1 font-display text-4xl font-bold">{formatIDR(balance)}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="accent"><Link href="/umkm/reimbursement/new">Tarik Reimbursement</Link></Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-brand-900">
            <Link href="/umkm/pitch">Edit Pitch</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-zinc-500">{u.pitch?.status}</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-brand-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-medium">{formatIDRCompact(raised)} / {formatIDRCompact(target)}</span>
              <span className="text-zinc-500">{pct}%</span>
            </div>
            <div className="mt-2 text-xs text-zinc-500">Equity ditawarkan {u.equityOfferedPct.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge variant={aiBadgeVariant(finalScore)}>AI {finalScore}</Badge>
              <span className="text-sm text-zinc-600">{sectorLabel[u.sector] ?? u.sector}</span>
            </div>
            {lowestComp && (
              <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                <span className="font-semibold">Sub-skor terendah:</span> {lowestComp[0]} ({lowestComp[1]}). {tipMap[lowestComp[0]]}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Investor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold">{u.investments.length}</div>
            <div className="mt-1 text-xs text-zinc-500">investasi tercatat</div>
            {u.investments.length > 0 && (
              <div className="mt-3 flex -space-x-2">
                {[...new Set(u.investments.map((i) => i.investor.name))].slice(0, 5).map((n) => (
                  <div key={n} title={n} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-[10px] font-semibold text-brand-700">
                    {n.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Transaksi Terbaru</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                  <th className="px-5 py-3">Waktu</th>
                  <th className="px-5 py-3">Counterparty</th>
                  <th className="px-5 py-3">Channel</th>
                  <th className="px-5 py-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {u.bankAccount?.transactions.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-5 py-3 text-zinc-600">{t.ts.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3">{t.counterparty}</td>
                    <td className="px-5 py-3 text-zinc-600">{t.channel}</td>
                    <td className={`px-5 py-3 text-right font-medium ${t.kind === TxnKind.INFLOW ? "text-emerald-700" : "text-red-600"}`}>
                      {t.kind === TxnKind.INFLOW ? "+" : "-"}{formatIDRCompact(Number(t.amountIDR))}
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

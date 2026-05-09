import Link from "next/link";
import { TxnKind } from "@/lib/enums";
import { requireRole } from "@/lib/role";
import { getOwnedUMKM, getPitch, getBankAccount, getTransactionsByUMKM, getInvestmentsByUMKM, getUserById } from "@/lib/data";
import { scoreUMKM } from "@/lib/ai/scorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function UMKMDashboard() {
  const { demoUserId } = await requireRole("UMKM");
  const u = getOwnedUMKM(demoUserId);

  if (!u) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="font-display text-2xl font-bold">Profil UMKM tidak ditemukan</h1>
            <p className="mt-2 text-sm text-zinc-600">Demo persona UMKM default. Silakan kembali ke role picker.</p>
            <Button asChild className="mt-4"><Link href="/signin">Pilih persona ulang</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pitch = getPitch(u.id);
  const ba = getBankAccount(u.id);
  const txns = getTransactionsByUMKM(u.id, 30);
  const investments = getInvestmentsByUMKM(u.id);

  const target = u.fundingTargetIDR;
  const raised = pitch?.raisedIDR ?? 0;
  const pct = Math.min(100, Math.round((raised / target) * 100));
  const balance = ba?.balanceIDR ?? 0;

  const score = scoreUMKM({
    monthlyRevenueIDR: u.monthlyRevenueIDR,
    ageMonths: u.ageMonths,
    sliKScore: u.sliKScore,
    ecomVelocity: u.ecomVelocity,
    digitalBehavior: u.digitalBehavior,
    sector: u.sector,
  });
  const finalScore = u.aiScoreOverride ?? score.total;
  const lowestComp = Object.entries(score.components).sort((a, b) => a[1] - b[1])[0];
  const tipMap: Record<string, string> = {
    slik: "Bayar tagihan tepat waktu, kurangi outstanding.",
    ecommerce: "Tambah volume QRIS, perbanyak channel marketplace.",
    behavior: "Lengkapi profil digital, konsisten dengan kanal.",
    revenueAge: "Dorong pertumbuhan omzet bulanan.",
    sectorOutlook: "Perluas portofolio produk untuk mengurangi sensitivitas sektor.",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white">
        <div>
          <div className="text-xs uppercase tracking-wide opacity-80">{ba?.providerBPR}</div>
          <div className="mt-1 text-sm">****{ba?.accountNumber.slice(-4)}</div>
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
          <CardHeader><CardTitle className="text-base">Funding</CardTitle></CardHeader>
          <CardContent>
            <div className="text-xs text-zinc-500">{pitch?.status}</div>
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
          <CardHeader><CardTitle className="text-base">AI Score</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge variant={aiBadgeVariant(finalScore)}>AI {finalScore}</Badge>
              <span className="text-sm text-zinc-600">{sectorLabel[u.sector] ?? u.sector}</span>
            </div>
            {lowestComp && (
              <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                <span className="font-semibold">Terendah:</span> {lowestComp[0]} ({lowestComp[1]}). {tipMap[lowestComp[0]]}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Investor</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold">{investments.length}</div>
            <div className="mt-1 text-xs text-zinc-500">investasi tercatat</div>
            {investments.length > 0 && (
              <div className="mt-3 flex -space-x-2">
                {[...new Set(investments.map((i) => getUserById(i.investorId)?.name ?? "—"))].slice(0, 5).map((n) => (
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
                {txns.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-5 py-3 text-zinc-600">{new Date(t.ts).toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3">{t.counterparty}</td>
                    <td className="px-5 py-3 text-zinc-600">{t.channel}</td>
                    <td className={`px-5 py-3 text-right font-medium ${t.kind === TxnKind.INFLOW ? "text-emerald-700" : "text-red-600"}`}>
                      {t.kind === TxnKind.INFLOW ? "+" : "-"}{formatIDRCompact(t.amountIDR)}
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

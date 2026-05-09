import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/role";
import { getUMKM, getPitch } from "@/lib/data";
import { scoreUMKM } from "@/lib/ai/scorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/money";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminUMKMReview({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const u = getUMKM(id);
  const pitch = u ? getPitch(u.id) : undefined;
  if (!u) notFound();
  const score = scoreUMKM({
    monthlyRevenueIDR: u.monthlyRevenueIDR,
    ageMonths: u.ageMonths,
    sliKScore: u.sliKScore,
    ecomVelocity: u.ecomVelocity,
    digitalBehavior: u.digitalBehavior,
    sector: u.sector,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <Link href="/admin/umkm" className="text-sm text-brand-700 hover:underline">← Antrian</Link>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={aiBadgeVariant(u.aiScoreOverride ?? u.aiScore)}>
            AI {u.aiScoreOverride ?? u.aiScore}
          </Badge>
          <Badge variant="muted">{sectorLabel[u.sector] ?? u.sector}</Badge>
          <Badge variant="default">Pitch: {pitch?.status}</Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold">{u.name}</h1>
        <div className="text-sm text-zinc-500">{u.ownerName} · {u.location}, {u.province}</div>
      </header>

      <Card>
        <CardHeader><CardTitle>Cerita Bisnis</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-zinc-700">
          {u.story.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Pendanaan</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Target" value={formatIDR(u.fundingTargetIDR)} />
          <Stat label="Equity" value={`${u.equityOfferedPct.toFixed(1)}%`} />
          <Stat label="Valuasi" value={formatIDR(u.valuationIDR)} />
          <Stat label="Omzet/bln" value={formatIDR(u.monthlyRevenueIDR)} />
          <Stat label="Usia" value={`${u.ageMonths} bulan`} />
          <Stat label="Syariah" value={u.syariahCompliant ? "Ya" : "Tidak"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>AI Score Komputasi</CardTitle></CardHeader>
        <CardContent>
          <div className="font-display text-3xl font-bold">{score.total}</div>
          <div className="mt-1 text-xs text-zinc-500">Demo prototype — override aksi tidak persist.</div>
          <ul className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
            {Object.entries(score.components).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-zinc-100 py-1">
                <span className="text-zinc-600">{k}</span>
                <span className="font-medium">{v}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 font-medium text-zinc-900">{value}</div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { scoreUMKM } from "@/lib/ai/scorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approvePitch, rejectPitch, overrideAIScore } from "@/actions/admin";
import { formatIDR } from "@/lib/money";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminUMKMReview({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const u = await prisma.uMKM.findUnique({
    where: { id },
    include: { pitch: true, owner: { select: { name: true, email: true } } },
  });
  if (!u) notFound();
  const score = scoreUMKM({
    monthlyRevenueIDR: Number(u.monthlyRevenueIDR),
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
            AI {u.aiScoreOverride ?? u.aiScore} {u.aiScoreOverride !== null && "(override)"}
          </Badge>
          <Badge variant="muted">{sectorLabel[u.sector] ?? u.sector}</Badge>
          <Badge variant="default">Pitch: {u.pitch?.status}</Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold">{u.name}</h1>
        <div className="text-sm text-zinc-500">
          {u.owner.name} · {u.owner.email} · {u.location}, {u.province}
        </div>
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
          <Stat label="Target" value={formatIDR(Number(u.fundingTargetIDR))} />
          <Stat label="Equity" value={`${u.equityOfferedPct.toFixed(1)}%`} />
          <Stat label="Valuasi" value={formatIDR(Number(u.valuationIDR))} />
          <Stat label="Omzet/bln" value={formatIDR(Number(u.monthlyRevenueIDR))} />
          <Stat label="Usia" value={`${u.ageMonths} bulan`} />
          <Stat label="Syariah" value={u.syariahCompliant ? "Ya" : "Tidak"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>AI Score Komputasi</CardTitle></CardHeader>
        <CardContent>
          <div className="font-display text-3xl font-bold">{score.total}</div>
          <div className="mt-1 text-xs text-zinc-500">Hasil model. Override jika perlu.</div>
          <ul className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
            {Object.entries(score.components).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-zinc-100 py-1">
                <span className="text-zinc-600">{k}</span>
                <span className="font-medium">{v}</span>
              </li>
            ))}
          </ul>
          {u.aiScoreOverride !== null && (
            <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
              <span className="font-semibold">Override aktif:</span> {u.aiScoreOverride}.
              {u.overrideReason && <span> Alasan: {u.overrideReason}</span>}
            </div>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Aksi</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Override AI Score</CardTitle></CardHeader>
            <CardContent>
              <form
                action={async (formData) => {
                  "use server";
                  const raw = String(formData.get("score") ?? "");
                  const reason = String(formData.get("reason") ?? "");
                  await overrideAIScore({
                    umkmId: u.id,
                    score: raw === "" ? null : Number(raw),
                    reason: reason || undefined,
                  });
                }}
                className="space-y-3"
              >
                <input
                  type="number"
                  name="score"
                  min={0}
                  max={100}
                  defaultValue={u.aiScoreOverride ?? ""}
                  placeholder="Kosongkan untuk hapus override"
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                />
                <textarea
                  name="reason"
                  defaultValue={u.overrideReason ?? ""}
                  placeholder="Alasan override"
                  className="h-20 w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                />
                <Button type="submit">Simpan Override</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Pitch</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <form
                action={async () => {
                  "use server";
                  await approvePitch(u.id);
                }}
              >
                <Button type="submit" className="w-full">Approve Pitch</Button>
              </form>
              <form
                action={async (formData) => {
                  "use server";
                  await rejectPitch(u.id, String(formData.get("reason") ?? "Tidak disebutkan"));
                }}
                className="space-y-2"
              >
                <textarea
                  name="reason"
                  placeholder="Alasan reject"
                  className="h-16 w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                />
                <Button type="submit" variant="destructive" className="w-full">Reject Pitch</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
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

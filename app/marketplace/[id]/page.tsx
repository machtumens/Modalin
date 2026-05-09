import { notFound } from "next/navigation";
import { getUMKM, getPitch, getTransactionsByUMKM } from "@/lib/data";
import { scoreUMKM } from "@/lib/ai/scorer";
import { TxnKind } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";
import { AIScorePanel } from "@/components/marketplace/ai-score-panel";
import { InvestWidget } from "@/components/marketplace/invest-widget";
import { TransactionPreview } from "@/components/marketplace/transaction-preview";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel } from "@/lib/labels";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = getUMKM(id);
  return { title: u?.name ?? "UMKM" };
}

export default async function UMKMDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = getUMKM(id);
  const pitch = u ? getPitch(u.id) : undefined;
  if (!u || !pitch) notFound();

  const score = scoreUMKM({
    monthlyRevenueIDR: u.monthlyRevenueIDR,
    ageMonths: u.ageMonths,
    sliKScore: u.sliKScore,
    ecomVelocity: u.ecomVelocity,
    digitalBehavior: u.digitalBehavior,
    sector: u.sector,
  });
  const finalScore = u.aiScoreOverride ?? score.total;

  const target = u.fundingTargetIDR;
  const raised = pitch.raisedIDR;
  const remaining = Math.max(0, target - raised);
  const pct = Math.min(100, Math.round((raised / target) * 100));
  const daysLeft = Math.max(0, Math.ceil((new Date(pitch.deadline).getTime() - Date.now()) / 86_400_000));

  const cutoff = Date.now() - 7 * 86_400_000;
  const last7 = getTransactionsByUMKM(u.id, 200).filter((t) => new Date(t.ts).getTime() >= cutoff);
  const inflowMap = new Map<string, number>();
  const outflowMap = new Map<string, number>();
  for (const t of last7) {
    const m = t.kind === TxnKind.INFLOW ? inflowMap : outflowMap;
    m.set(t.channel, (m.get(t.channel) ?? 0) + t.amountIDR);
  }
  const inflow = [...inflowMap.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const outflow = [...outflowMap.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">{sectorLabel[u.sector] ?? u.sector}</Badge>
              {u.syariahCompliant && <Badge>Syariah</Badge>}
              <Badge variant="muted">Funding aktif</Badge>
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold">{u.name}</h1>
            <div className="mt-2 text-sm text-zinc-500">
              Pendiri {u.ownerName} · {u.location}, {u.province}
            </div>
          </header>

          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <KPI label="Omzet/bln" value={formatIDRCompact(u.monthlyRevenueIDR)} />
            <KPI label="Usia bisnis" value={`${u.ageMonths} bln`} />
            <KPI label="Target" value={formatIDRCompact(target)} />
            <KPI label="Equity" value={`${u.equityOfferedPct.toFixed(1)}%`} />
            <KPI label="Valuasi" value={formatIDRCompact(u.valuationIDR)} />
            <KPI label="Sisa hari" value={`${daysLeft}`} />
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Progress pendanaan</span>
              <span className="text-sm text-zinc-500">{pct}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-brand-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              Terkumpul <span className="font-medium text-zinc-900">{formatIDR(raised)}</span> dari {formatIDR(target)}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Tentang bisnis</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
              {u.story.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">AI Score</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Skor real-time dari model Modalin berdasarkan SLIK OJK, e-commerce velocity, dan perilaku digital.
            </p>
            <div className="mt-4">
              <AIScorePanel score={finalScore} components={score.components} override={u.aiScoreOverride !== null} />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Pratinjau transaksi 7 hari</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Setelah berinvestasi, akses penuh ke transaksi real-time terbuka di dashboard Anda.
            </p>
            <div className="mt-4">
              <TransactionPreview inflow={inflow.slice(0, 5)} outflow={outflow.slice(0, 5)} />
            </div>
          </section>
        </div>

        <aside>
          <InvestWidget
            umkmId={u.id}
            umkmName={u.name}
            remainingIDR={remaining}
            valuationIDR={u.valuationIDR}
          />
        </aside>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

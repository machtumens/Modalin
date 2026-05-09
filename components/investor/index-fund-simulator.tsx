"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DonutChart } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/lib/store";
import { formatIDR, formatIDRCompact } from "@/lib/money";
import { sectorLabel, aiBadgeVariant } from "@/lib/labels";

export type Candidate = {
  id: string;
  name: string;
  sector: string;
  aiScore: number;
};

const strategies = [
  { id: "conservative", label: "Conservative", note: "AI ≥ 80 · sektor matang" },
  { id: "balanced", label: "Balanced", note: "AI ≥ 70 · campuran" },
  { id: "growth", label: "Growth", note: "AI ≥ 60 · early-stage" },
] as const;

export function IndexFundSimulator({ pool }: { pool: Record<string, Candidate[]> }) {
  const [amount, setAmount] = useState(10_000_000);
  const [strategy, setStrategy] = useState<"conservative" | "balanced" | "growth">("balanced");
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  const addInvestment = useDemoStore((s) => s.addInvestment);

  const candidates = pool[strategy] ?? [];
  const totalScore = useMemo(() => candidates.reduce((s, c) => s + c.aiScore, 0), [candidates]);
  const allocation = useMemo(
    () =>
      candidates.map((c) => ({
        name: c.name,
        value: totalScore ? Math.round((amount * c.aiScore) / totalScore) : 0,
        sector: c.sector,
        umkmId: c.id,
        aiScore: c.aiScore,
      })),
    [candidates, amount, totalScore]
  );

  function execute() {
    start(() => {
      for (const a of allocation) {
        if (a.value > 0) {
          addInvestment({
            umkmId: a.umkmId,
            umkmName: a.name,
            amountIDR: a.value,
            equityPct: 0.05, // mock pro-rata equity
          });
        }
      }
      router.push("/investor/dashboard");
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="text-sm font-semibold">Strategi</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {strategies.map((s) => {
              const on = strategy === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id)}
                  className={`rounded-lg border px-4 py-3 text-left transition-all ${on ? "border-brand-700 bg-brand-50" : "border-zinc-200 bg-white hover:border-brand-700"}`}
                >
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className="mt-1 text-xs text-zinc-500">{s.note}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Jumlah investasi</div>
            <div className="font-display text-xl font-bold text-brand-700">{formatIDR(amount)}</div>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={100_000_000}
            step={1_000_000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full accent-brand-700"
          />
          <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
            <span>Rp1 jt</span>
            <span>Rp100 jt</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="mb-4 text-sm font-semibold">Alokasi ke {candidates.length} UMKM</div>
          {candidates.length === 0 ? (
            <div className="rounded-md bg-zinc-50 p-4 text-sm text-zinc-500">
              Tidak ada UMKM yang lulus kriteria strategi ini.
            </div>
          ) : (
            <>
              <DonutChart
                className="mx-auto h-56"
                data={allocation}
                category="value"
                index="name"
                colors={["teal", "amber", "emerald", "yellow", "indigo", "rose", "cyan", "lime", "fuchsia", "blue", "orange", "violet", "pink", "sky", "green"]}
                valueFormatter={(n: number) => formatIDRCompact(n)}
              />
              <div className="mt-6 max-h-72 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                      <th className="pb-2">UMKM</th>
                      <th className="pb-2">Sektor</th>
                      <th className="pb-2 text-right">AI</th>
                      <th className="pb-2 text-right">Alokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocation.map((a) => (
                      <tr key={a.name} className="border-b border-zinc-100 last:border-0">
                        <td className="py-2 font-medium">{a.name}</td>
                        <td className="py-2 text-zinc-600">{sectorLabel[a.sector] ?? a.sector}</td>
                        <td className="py-2 text-right">
                          <Badge variant={aiBadgeVariant(a.aiScore)}>{a.aiScore}</Badge>
                        </td>
                        <td className="py-2 text-right">{formatIDRCompact(a.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <aside className="lg:sticky lg:top-24 self-start rounded-xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold">Ringkasan</div>
        <div className="mt-4 space-y-2 text-sm">
          <Row k="Total investasi" v={formatIDR(amount)} />
          <Row k="Jumlah UMKM" v={`${candidates.length}`} />
          <Row k="Strategi" v={strategies.find((s) => s.id === strategy)?.label ?? ""} />
          <Row k="Bobot per UMKM" v="∝ AI Score" />
        </div>
        <Button onClick={() => setOpen(true)} className="mt-6 w-full" size="lg" disabled={!candidates.length}>
          Investasikan via Index Fund
        </Button>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
          Demo prototype — investasi disimpan di browser localStorage.
        </p>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="font-display text-lg font-semibold">Konfirmasi Index Fund</div>
            <p className="mt-2 text-sm text-zinc-600">
              Investasi <span className="font-semibold text-zinc-900">{formatIDR(amount)}</span> ke {candidates.length} UMKM strategi <span className="font-semibold text-zinc-900">{strategy}</span>.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>Batal</Button>
              <Button onClick={execute} disabled={pending}>
                {pending ? "Memproses..." : "Konfirmasi"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5 last:border-0">
      <span className="text-zinc-500">{k}</span>
      <span className="font-medium text-zinc-900">{v}</span>
    </div>
  );
}

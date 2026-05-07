"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { investAction } from "@/actions/invest";
import { Button } from "@/components/ui/button";
import { formatIDR, formatIDRCompact } from "@/lib/money";

export function InvestWidget({
  umkmId,
  remainingIDR,
  valuationIDR,
}: {
  umkmId: string;
  remainingIDR: number;
  valuationIDR: number;
}) {
  const [amount, setAmount] = useState(100_000);
  const [risk, setRisk] = useState(false);
  const [syariah, setSyariah] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const max = Math.max(100_000, remainingIDR);
  const equity = (amount / valuationIDR) * 100;

  function submit() {
    setError(null);
    start(async () => {
      const r = await investAction({
        umkmId,
        amountIDR: amount,
        riskAcknowledged: risk,
        syariahAcknowledged: syariah,
      });
      if (!r.ok) {
        setError(r.error ?? "Gagal");
        return;
      }
      router.push(`/marketplace/${umkmId}/success?equity=${r.equityPctNow.toFixed(2)}&amount=${amount}`);
    });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-24">
      <div className="text-sm font-semibold text-zinc-900">Investasi sekarang</div>
      <div className="mt-1 text-xs text-zinc-500">Min Rp100.000 · 100% bagi hasil ekuitas</div>
      <div className="mt-4">
        <label className="text-xs text-zinc-500">Jumlah investasi</label>
        <div className="mt-1 rounded-md border border-zinc-300 px-3 py-2 text-lg font-semibold text-brand-700">
          {formatIDR(amount)}
        </div>
        <input
          type="range"
          min={100_000}
          max={max}
          step={100_000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-3 w-full accent-brand-700"
        />
        <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
          <span>Rp100rb</span>
          <span>{formatIDRCompact(max)}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-md bg-zinc-50 p-3 text-xs">
        <div>
          <div className="text-zinc-500">Ekuitas yang Anda dapat</div>
          <div className="font-semibold text-zinc-900">{equity.toFixed(3)}%</div>
        </div>
        <div>
          <div className="text-zinc-500">Sisa pendanaan</div>
          <div className="font-semibold text-zinc-900">{formatIDRCompact(remainingIDR)}</div>
        </div>
      </div>
      <Button onClick={() => setOpen(true)} className="mt-4 w-full" size="lg" disabled={remainingIDR <= 0}>
        {remainingIDR <= 0 ? "Pendanaan penuh" : "Investasi sekarang"}
      </Button>
      <div className="mt-3 text-[11px] leading-relaxed text-zinc-500">
        Investor tidak dikenai biaya. Success fee 5% dibebankan ke UMKM saat pendanaan tercapai.
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/60 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-xl">
            <div className="font-display text-lg font-semibold">Konfirmasi investasi</div>
            <p className="mt-2 text-sm text-zinc-600">
              Anda akan investasi <span className="font-semibold text-zinc-900">{formatIDR(amount)}</span> untuk ekuitas <span className="font-semibold text-zinc-900">{equity.toFixed(3)}%</span>.
            </p>
            <label className="mt-4 flex items-start gap-3 text-sm">
              <input type="checkbox" checked={risk} onChange={(e) => setRisk(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-700" />
              <span className="text-zinc-700">Saya memahami risiko investasi UMKM early-growth termasuk kemungkinan kehilangan modal.</span>
            </label>
            <label className="mt-3 flex items-start gap-3 text-sm">
              <input type="checkbox" checked={syariah} onChange={(e) => setSyariah(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-700" />
              <span className="text-zinc-700">Saya menyetujui akad bagi hasil ekuitas (musyarakah) tanpa unsur riba.</span>
            </label>
            {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>Batal</Button>
              <Button onClick={submit} disabled={pending || !risk || !syariah}>
                {pending ? "Memproses..." : "Konfirmasi"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

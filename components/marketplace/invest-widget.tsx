"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDemoStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatIDR, formatIDRCompact } from "@/lib/money";

export function InvestWidget({
  umkmId,
  umkmName,
  remainingIDR,
  valuationIDR,
}: {
  umkmId: string;
  umkmName: string;
  remainingIDR: number;
  valuationIDR: number;
}) {
  const [amount, setAmount] = useState(100_000);
  const [risk, setRisk] = useState(false);
  const [syariah, setSyariah] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  const addInvestment = useDemoStore((s) => s.addInvestment);
  const max = Math.max(100_000, remainingIDR);
  const equity = (amount / valuationIDR) * 100;

  function submit() {
    start(() => {
      addInvestment({ umkmId, umkmName, amountIDR: amount, equityPct: equity });
      router.push(`/marketplace/${umkmId}/success?equity=${equity.toFixed(2)}&amount=${amount}`);
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur lg:sticky lg:top-24">
      <div className="text-sm font-semibold text-white">Investasi sekarang</div>
      <div className="mt-1 text-xs text-zinc-400">Min Rp100.000 · 100% bagi hasil ekuitas</div>
      <div className="mt-4">
        <label className="text-xs text-zinc-400">Jumlah investasi</label>
        <div className="mt-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-lg font-semibold text-brand-300">
          {formatIDR(amount)}
        </div>
        <input
          type="range"
          min={100_000}
          max={max}
          step={100_000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-3 w-full accent-brand-500"
        />
        <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
          <span>Rp100rb</span>
          <span>{formatIDRCompact(max)}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-zinc-800 bg-zinc-900/60 p-3 text-xs">
        <div>
          <div className="text-zinc-400">Ekuitas Anda</div>
          <div className="font-semibold text-white">{equity.toFixed(3)}%</div>
        </div>
        <div>
          <div className="text-zinc-400">Sisa pendanaan</div>
          <div className="font-semibold text-white">{formatIDRCompact(remainingIDR)}</div>
        </div>
      </div>
      <Button onClick={() => setOpen(true)} className="mt-4 w-full" size="lg" disabled={remainingIDR <= 0}>
        {remainingIDR <= 0 ? "Pendanaan penuh" : "Investasi sekarang"}
      </Button>
      <div className="mt-3 text-[11px] leading-relaxed text-zinc-400">
        Demo prototype — investasi disimpan di browser localStorage. Tidak ada transfer dana sebenarnya.
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/80 backdrop-blur sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl border border-zinc-800 bg-zinc-900 p-6 sm:rounded-xl">
            <div className="font-display text-lg font-semibold text-white">Konfirmasi investasi</div>
            <p className="mt-2 text-sm text-zinc-400">
              Anda akan investasi <span className="font-semibold text-white">{formatIDR(amount)}</span> untuk ekuitas <span className="font-semibold text-white">{equity.toFixed(3)}%</span>.
            </p>
            <label className="mt-4 flex items-start gap-3 text-sm">
              <input type="checkbox" checked={risk} onChange={(e) => setRisk(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-500" />
              <span className="text-zinc-300">Saya memahami risiko investasi UMKM early-growth.</span>
            </label>
            <label className="mt-3 flex items-start gap-3 text-sm">
              <input type="checkbox" checked={syariah} onChange={(e) => setSyariah(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-500" />
              <span className="text-zinc-300">Saya setuju akad bagi hasil ekuitas tanpa riba.</span>
            </label>
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

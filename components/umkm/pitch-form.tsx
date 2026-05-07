"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPitch } from "@/actions/pitch";
import { formatIDR } from "@/lib/money";

export function PitchForm({
  defaults,
}: {
  defaults: {
    story: string;
    fundingTargetIDR: number;
    equityOfferedPct: number;
    deadlineDays: number;
    syariahCompliant: boolean;
  };
}) {
  const [story, setStory] = useState(defaults.story);
  const [target, setTarget] = useState(defaults.fundingTargetIDR);
  const [equity, setEquity] = useState(defaults.equityOfferedPct);
  const [days, setDays] = useState(defaults.deadlineDays);
  const [syariah, setSyariah] = useState(defaults.syariahCompliant);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const valuation = target / (equity / 100);

  function submit() {
    setMsg(null);
    setError(null);
    start(async () => {
      const r = await submitPitch({
        story,
        fundingTargetIDR: target,
        equityOfferedPct: equity,
        deadlineDays: days,
        syariahCompliant: syariah,
      });
      if (!r.ok) {
        setError(r.error ?? "Gagal");
        return;
      }
      setMsg("Pitch berhasil disubmit. Status: PENDING_REVIEW. Admin akan meninjau.");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 space-y-5 rounded-xl border border-zinc-200 bg-white p-6">
      <div>
        <Label htmlFor="story">Cerita bisnis</Label>
        <textarea
          id="story"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          minLength={40}
          maxLength={5000}
          required
          className="mt-1 h-40 w-full resize-y rounded-md border border-zinc-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <div className="mt-1 text-xs text-zinc-500">{story.length} karakter</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target">Target pendanaan (IDR)</Label>
          <Input id="target" type="number" min={50_000_000} max={500_000_000} step={1_000_000} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
          <div className="mt-1 text-xs text-zinc-500">{formatIDR(target)}</div>
        </div>
        <div>
          <Label htmlFor="equity">Equity offered (%)</Label>
          <Input id="equity" type="number" min={1} max={40} step={0.1} value={equity} onChange={(e) => setEquity(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="days">Deadline (hari)</Label>
          <Input id="days" type="number" min={7} max={120} value={days} onChange={(e) => setDays(Number(e.target.value))} />
        </div>
        <div>
          <Label>Valuasi pre-money</Label>
          <div className="mt-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">{formatIDR(Math.round(valuation))}</div>
        </div>
      </div>
      <label className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
        <input type="checkbox" checked={syariah} onChange={(e) => setSyariah(e.target.checked)} className="h-4 w-4 accent-brand-700" />
        <span>Bisnis ini patuh prinsip syariah (no riba, no maysir, no gharar, halal product, transparan).</span>
      </label>
      {msg && <p className="text-sm text-emerald-700">{msg}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button onClick={submit} disabled={pending}>
        {pending ? "Memproses..." : "Submit Pitch ke Review"}
      </Button>
    </div>
  );
}

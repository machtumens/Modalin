"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_LABEL } from "@/lib/ai/price-validator";
import { requestReimbursement } from "@/actions/reimbursement";
import { formatIDR } from "@/lib/money";

const categories = Object.entries(CATEGORY_LABEL) as [keyof typeof CATEGORY_LABEL, string][];

export function ReimbursementForm() {
  const [category, setCategory] = useState<keyof typeof CATEGORY_LABEL>("laptop");
  const [amount, setAmount] = useState(7_500_000);
  const [quantity, setQuantity] = useState(1);
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [pending, start] = useTransition();
  const [result, setResult] = useState<null | { status: string; verdict: string; deltaPct: number; note: string; refPriceIDR: number }>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function submit() {
    setError(null);
    setResult(null);
    start(async () => {
      const r = await requestReimbursement({
        category,
        amountIDR: amount,
        quantity,
        supplier: supplier || undefined,
        description,
      });
      if (!r.ok) {
        setError(r.error ?? "Gagal");
        return;
      }
      setResult({
        status: r.status,
        verdict: r.validation.verdict,
        deltaPct: r.validation.deltaPct,
        note: r.validation.note,
        refPriceIDR: r.validation.refPriceIDR,
      });
      router.refresh();
    });
  }

  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="cat">Kategori</Label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as keyof typeof CATEGORY_LABEL)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
          >
            {categories.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="qty">Kuantitas</Label>
            <Input id="qty" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} />
          </div>
          <div>
            <Label htmlFor="amount">Jumlah (IDR)</Label>
            <Input id="amount" type="number" min={10_000} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <div className="mt-1 text-xs text-zinc-500">{formatIDR(amount)}</div>
          </div>
        </div>
        <div>
          <Label htmlFor="supplier">Supplier (opsional)</Label>
          <Input id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="desc">Deskripsi</Label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={2}
            maxLength={500}
            className="mt-1 h-24 w-full resize-none rounded-md border border-zinc-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
            placeholder="Contoh: Laptop kerja untuk admin keuangan"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {result && (
          <div className={`rounded-md p-4 text-sm ${
            result.verdict === "OK" ? "bg-emerald-50 text-emerald-800" :
            result.verdict === "OVER" ? "bg-red-50 text-red-700" :
            "bg-amber-50 text-amber-800"
          }`}>
            <div className="font-semibold">AI Verdict: {result.verdict} ({result.deltaPct >= 0 ? "+" : ""}{result.deltaPct}% vs harga pasar)</div>
            <div className="mt-1">{result.note}</div>
            <div className="mt-1 text-xs">Status: <span className="font-mono">{result.status}</span></div>
          </div>
        )}
        <Button onClick={submit} disabled={pending || !description}>
          {pending ? "Memproses..." : "Ajukan Reimbursement"}
        </Button>
      </div>
    </div>
  );
}

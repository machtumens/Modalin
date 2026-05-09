"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_LABEL, validateReimbursement, type ReimbursementCategory } from "@/lib/ai/price-validator";
import { useDemoStore } from "@/lib/store";
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
  const router = useRouter();
  const addReimbursement = useDemoStore((s) => s.addReimbursement);

  function submit() {
    setResult(null);
    start(() => {
      const validation = validateReimbursement({
        category: category as ReimbursementCategory,
        amountIDR: amount,
        quantity,
      });
      let status: "AUTO_APPROVED" | "PENDING_ADMIN_REVIEW" | "BLOCKED_PRICE_CHECK" | "DISBURSED";
      if (validation.verdict === "OVER") status = "BLOCKED_PRICE_CHECK";
      else if (validation.verdict === "OK" && amount <= 5_000_000) status = "DISBURSED";
      else status = "PENDING_ADMIN_REVIEW";

      addReimbursement({
        umkmId: "umkm-1",
        amountIDR: amount,
        category: category as string,
        description,
        supplier: supplier || undefined,
        refPriceIDR: validation.refPriceIDR,
        deltaPct: validation.deltaPct,
        verdict: validation.verdict,
        status,
      });

      setResult({
        status,
        verdict: validation.verdict,
        deltaPct: validation.deltaPct,
        note: validation.note,
        refPriceIDR: validation.refPriceIDR,
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
          />
        </div>
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
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Demo prototype — pengajuan disimpan di browser localStorage. Tidak ada dana riil yang berpindah.
        </p>
      </div>
    </div>
  );
}

"use client";
import { useDemoStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/money";
import { CATEGORY_LABEL, type ReimbursementCategory } from "@/lib/ai/price-validator";

type Item = {
  id: string;
  umkmId: string;
  amountIDR: number;
  category: string;
  description: string;
  supplier?: string;
  refPriceIDR: number;
  deltaPct: number;
  verdict: string;
  status: string;
  createdAt: string;
};

const statusBadge: Record<string, { variant: "success" | "warning" | "muted" | "default"; label: string }> = {
  AUTO_APPROVED: { variant: "success", label: "Auto-approved" },
  DISBURSED: { variant: "success", label: "Cair" },
  PENDING_ADMIN_REVIEW: { variant: "warning", label: "Review admin" },
  BLOCKED_PRICE_CHECK: { variant: "muted", label: "Diblok harga" },
  REJECTED: { variant: "muted", label: "Ditolak" },
};

export function ReimbursementList({ umkmId, seedItems }: { umkmId: string; seedItems: Item[] }) {
  const client = useDemoStore((s) => s.reimbursements.filter((r) => r.umkmId === umkmId));
  const merged: Item[] = [...client.map((c) => ({ ...c, supplier: c.supplier ?? undefined })), ...seedItems].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  if (merged.length === 0) {
    return <div className="py-10 text-center text-sm text-zinc-500">Belum ada pengajuan.</div>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
          <th className="pb-2">Tanggal</th>
          <th className="pb-2">Kategori</th>
          <th className="pb-2 text-right">Jumlah</th>
          <th className="pb-2 text-right">Δ vs ref</th>
          <th className="pb-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {merged.map((r) => {
          const b = statusBadge[r.status] ?? statusBadge.PENDING_ADMIN_REVIEW;
          return (
            <tr key={r.id} className="border-b border-zinc-100 last:border-0">
              <td className="py-3 text-zinc-600">{new Date(r.createdAt).toLocaleDateString("id-ID")}</td>
              <td className="py-3">{CATEGORY_LABEL[r.category as ReimbursementCategory] ?? r.category}</td>
              <td className="py-3 text-right font-medium">{formatIDR(r.amountIDR)}</td>
              <td className="py-3 text-right text-xs">{r.deltaPct >= 0 ? "+" : ""}{r.deltaPct}%</td>
              <td className="py-3"><Badge variant={b.variant}>{b.label}</Badge></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

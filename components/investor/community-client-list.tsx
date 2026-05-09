"use client";
import Link from "next/link";
import { useDemoStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

export function CommunityClientList({ seedUmkmIds }: { seedUmkmIds: string[] }) {
  const investments = useDemoStore((s) => s.investments);
  // Aggregate client equity per umkm
  const map = new Map<string, { name: string; equity: number }>();
  for (const i of investments) {
    const ex = map.get(i.umkmId) ?? { name: i.umkmName, equity: 0 };
    ex.equity += i.equityPct;
    map.set(i.umkmId, ex);
  }
  const seedSet = new Set(seedUmkmIds);
  const extra = [...map.entries()]
    .filter(([id, v]) => v.equity >= 5 && !seedSet.has(id))
    .map(([id, v]) => ({ umkmId: id, name: v.name, equity: v.equity }));

  if (extra.length === 0 && seedUmkmIds.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="py-12 text-center text-sm text-zinc-500">
          Belum ada UMKM dengan kepemilikan Anda ≥5%. Tingkatkan kepemilikan dari{" "}
          <Link href="/marketplace" className="text-brand-700 underline">Marketplace</Link>.
        </CardContent>
      </Card>
    );
  }

  if (extra.length === 0) return null;
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {extra.map((u) => (
        <Link key={u.umkmId} href={`/investor/community/${u.umkmId}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium">{u.name}</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800">{u.equity.toFixed(1)}%</span>
              </div>
              <div className="mt-3 text-xs text-brand-700">Buka komunitas →</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

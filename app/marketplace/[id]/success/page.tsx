import Link from "next/link";
import { Confetti } from "@/components/marketplace/confetti";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/money";

export default async function InvestSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ amount?: string; equity?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const amount = Number(sp.amount ?? 0);
  const equity = Number(sp.equity ?? 0);
  const community = equity >= 5;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <Confetti />
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="font-display text-2xl font-bold text-brand-700">Investasi berhasil!</div>
        <p className="mt-2 text-sm text-zinc-600">
          Anda baru saja menginvestasikan <span className="font-semibold text-zinc-900">{formatIDR(amount)}</span> untuk ekuitas <span className="font-semibold text-zinc-900">{equity.toFixed(3)}%</span>.
        </p>
        {community && (
          <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            🎉 Kepemilikan Anda ≥5%. Anda kini berhak akses Modalin Community untuk UMKM ini.
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild><Link href={`/investor/dashboard`}>Ke Dashboard</Link></Button>
          <Button asChild variant="outline"><Link href={`/marketplace/${id}`}>Detail UMKM</Link></Button>
          <Button asChild variant="ghost"><Link href={`/marketplace`}>Marketplace</Link></Button>
        </div>
      </div>
    </div>
  );
}

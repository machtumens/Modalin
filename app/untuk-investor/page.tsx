import Link from "next/link";
import { TrendingUp, ShieldCheck, Activity, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Untuk Investor" };

const benefits = [
  { icon: Coins, title: "Min Investasi Rp100.000", body: "Akses ekuitas UMKM yang tidak tersedia di bank atau ECF eksisting." },
  { icon: Activity, title: "Transparansi Real-time", body: "Setiap transaksi UMKM mengalir lewat Modalin Bank Account langsung ke dashboard." },
  { icon: ShieldCheck, title: "100% Bagi Hasil (Zero Riba)", body: "Struktur ekuitas syariah-friendly. Tidak ada bunga, hanya bagi hasil ekonomi nyata." },
  { icon: TrendingUp, title: "Index Fund Otomatis", body: "Diversifikasi otomatis ke 10–20 UMKM terkurasi dengan strategi Conservative / Balanced / Growth." },
];

export default function ForInvestorPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800/60">
        <div className="aurora-blob b1 absolute -top-1/4 -left-10 h-[500px] w-[500px]" style={{ background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)" }} />
        <div className="aurora-blob b2 absolute -top-10 right-0 h-[400px] w-[400px]" style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-floor opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            Investasi langsung ke UMKM Indonesia, mulai{" "}
            <span className="shimmer-text">Rp100.000</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Modalin memberi investor ritel akses ekuitas ke UMKM early-growth (1–3 tahun, omzet Rp30–300 jt/bulan) — segmen yang ditolak bank dan tidak dilayani ECF eksisting.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg"><Link href="/marketplace">Lihat Marketplace</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/signin">Masuk</Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((b) => (
            <Card key={b.title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-400/10 text-brand-300">
                  <b.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3">{b.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">{b.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

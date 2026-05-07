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
      <section className="bg-gradient-to-br from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            Investasi langsung ke UMKM Indonesia, mulai Rp100.000.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <b.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3">{b.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">{b.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

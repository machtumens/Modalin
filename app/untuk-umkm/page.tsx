import Link from "next/link";
import { Wallet, Users, FileCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Untuk UMKM" };

const benefits = [
  { icon: Wallet, title: "Funding Rp50–500 jt", body: "Tanpa agunan, tanpa bunga. 100% bagi hasil ekuitas." },
  { icon: Zap, title: "Pencairan Reimbursement Instan", body: "Dana cair otomatis setelah AI memvalidasi harga supplier vs harga pasar." },
  { icon: FileCheck, title: "AI Scoring Transparan", body: "SLIK + e-commerce + perilaku digital + outlook sektor. Anda tahu kenapa skor naik atau turun." },
  { icon: Users, title: "Komunitas Investor", body: "Investor ≥5% kepemilikan jadi mitra strategis: feedback, jaringan, distribusi." },
];

export default function ForUMKMPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800/60">
        <div className="aurora-blob b2 absolute -top-1/4 -right-10 h-[500px] w-[500px]" style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 60%)" }} />
        <div className="aurora-blob b3 absolute -top-10 left-0 h-[400px] w-[400px]" style={{ background: "radial-gradient(circle, #0f766e 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-floor opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            Modal tumbuh untuk UMKM yang ditolak bank —{" "}
            <span className="shimmer-text">tanpa agunan, tanpa riba</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Modalin dirancang untuk UMKM early-growth: 1–3 tahun, omzet Rp30–300 jt/bulan, butuh modal Rp50–500 jt. Pitch builder 6 langkah, AI scoring, lalu live di marketplace.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg"><Link href="/signin">Daftar UMKM</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/marketplace">Lihat UMKM Lain</Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((b) => (
            <Card key={b.title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-400/10 text-gold-300">
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

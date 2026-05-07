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
      <section className="bg-gradient-to-br from-amber-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            Modal tumbuh untuk UMKM yang ditolak bank — tanpa agunan, tanpa riba.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-gold-600">
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

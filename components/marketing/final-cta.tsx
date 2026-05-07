import Link from "next/link";
import { Section } from "./section";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <Section>
      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-10 text-white sm:p-14">
        <h2 className="max-w-2xl font-display text-3xl font-bold sm:text-4xl">
          Modal tumbuh, akses terbuka. Bergabunglah hari ini.
        </h2>
        <p className="mt-3 max-w-xl text-brand-100">
          Daftar gratis. Investor mulai dari Rp100.000. UMKM dapat AI scoring dalam hitungan menit.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link href="/marketplace">Mulai Investasi</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-900">
            <Link href="/untuk-umkm">Daftarkan UMKM</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

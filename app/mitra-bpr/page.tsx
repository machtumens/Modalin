import { BPRMap } from "@/components/marketing/bpr-map";

export const metadata = { title: "Mitra BPR" };

export default function MitraBPRPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            Modalin × BPR: kanal akuisisi UMKM digital era POJK 22/2024.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
            BPR mitra menjalankan rekening Modalin Bank Account untuk UMKM yang sebelumnya tidak terakses. Revenue sharing 30% dari fee transaksi, ditambah fee dasar rekening bisnis.
          </p>
        </div>
      </section>
      <BPRMap />
    </div>
  );
}

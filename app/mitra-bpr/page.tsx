import { BPRMap } from "@/components/marketing/bpr-map";

export const metadata = { title: "Mitra BPR" };

export default function MitraBPRPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800/60">
        <div className="aurora-blob b1 absolute -top-1/4 -left-10 h-[500px] w-[500px]" style={{ background: "radial-gradient(circle, #14b8a6 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-floor opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            Modalin × BPR: kanal akuisisi UMKM digital era{" "}
            <span className="shimmer-text">POJK 22/2024</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            BPR mitra menjalankan rekening Modalin Bank Account untuk UMKM yang sebelumnya tidak terakses. Revenue sharing 30% dari fee transaksi, ditambah fee dasar rekening bisnis.
          </p>
        </div>
      </section>
      <BPRMap />
    </div>
  );
}

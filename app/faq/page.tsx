export const metadata = { title: "FAQ" };

const faqs = [
  {
    q: "Apakah Modalin syariah-compliant?",
    a: "Ya. Struktur 100% bagi hasil ekuitas (musyarakah / mudharabah). Tidak ada bunga, tidak ada riba. Setiap UMKM yang masuk Marketplace lulus checklist 5 kriteria fatwa MUI.",
  },
  {
    q: "Berapa minimum investasi?",
    a: "Rp100.000 — terendah di industri ECF Indonesia.",
  },
  {
    q: "Apa beda Modalin dengan Bizhare / Santara / LandX?",
    a: "Mereka melayani PT/CV mature dengan track record minimal 2 tahun. Modalin spesifik untuk early-growth (1–3 tahun, omzet Rp30–300 jt/bulan) dan terintegrasi dengan rekening bank UMKM untuk transparansi real-time.",
  },
  {
    q: "Apa risiko investasi di UMKM early-growth?",
    a: "Risiko utama: bisnis gagal tumbuh atau tutup, ilikuiditas (sulit jual saham di pasar sekunder), valuasi awal tinggi. Lihat halaman Disclaimer Risiko untuk detail lengkap.",
  },
  {
    q: "Apakah Modalin sudah berizin OJK?",
    a: "Sedang dalam proses pengajuan izin LUDBTI sesuai POJK 16/2021 dan POJK 22/2024. Status terbaru ditampilkan di footer.",
  },
  {
    q: "Bagaimana saya tahu uang saya benar dipakai UMKM?",
    a: "Setiap transaksi UMKM mengalir lewat Modalin Bank Account (BPR mitra) dan ter-pull otomatis ke dashboard Anda. Reimbursement on-demand divalidasi AI terhadap harga pasar real-time sebelum dana disalurkan.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h1 className="font-display text-4xl font-bold">Pertanyaan Umum</h1>
      <div className="mt-8 space-y-6">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-zinc-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer list-none text-base font-semibold text-zinc-900 group-open:text-brand-700">
              {f.q}
            </summary>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

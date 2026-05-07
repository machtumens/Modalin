"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./section";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "Sebagai pendiri UMKM kopi, akses modal selalu jadi bottleneck. Modalin memberi kami funding Rp250jt tanpa agunan dan tanpa bunga.",
    name: "Andi Pratama",
    role: "Pendiri Kopi Tani Toraja",
  },
  {
    quote:
      "Investasi di UMKM dulu terasa buram. Sekarang saya lihat setiap transaksi QRIS Kopi Tani Toraja real-time di dashboard.",
    name: "Andi Investor",
    role: "Investor Ritel · Jakarta",
  },
  {
    quote:
      "Modalin Bank Account terintegrasi BPR kami membuat onboarding UMKM 5x lebih cepat. Lebih banyak nasabah aktif, lebih banyak fee transaksi.",
    name: "Direksi BPR Mitra Jaya",
    role: "BPR Partner",
  },
  {
    quote:
      "Pertama kali saya bisa investasi langsung ke UMKM Indonesia mulai Rp100.000. Bagi hasilnya halal, datanya transparan.",
    name: "Siti Investor",
    role: "Investor Ritel · Surabaya",
  },
  {
    quote:
      "Reimbursement on-demand mempercepat operasional. Dana cair instan setelah AI memvalidasi harga supplier.",
    name: "Dewi Anggraini",
    role: "Pendiri Roti Rumah Bunda",
  },
  {
    quote:
      "Sebagai investor syariah, saya cari instrumen tanpa riba. Modalin menjawab itu dengan struktur 100% bagi hasil ekuitas.",
    name: "Rahmat Investor",
    role: "Investor Ritel · Bandung",
  },
];

export function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const next = () => setI((i + 1) % testimonials.length);
  const prev = () => setI((i - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[i];

  return (
    <Section className="bg-zinc-50/0">
      <div className="mb-8 flex items-end justify-between">
        <div className="max-w-xl">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Suara pengguna</div>
          <h2 className="mt-2 font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
            Tiga sisi ekosistem, satu narasi.
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prev} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={next} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative h-56 sm:h-44">
        <AnimatePresence mode="wait">
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 rounded-xl border border-zinc-200 bg-white p-8"
          >
            <blockquote className="font-display text-xl text-zinc-900 leading-snug">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-zinc-600">
              <span className="font-medium text-zinc-900">{t.name}</span> · {t.role}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-center gap-1">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 w-6 rounded-full transition-colors ${idx === i ? "bg-brand-700" : "bg-zinc-300"}`}
          />
        ))}
      </div>
    </Section>
  );
}

export type ReimbursementCategory =
  | "laptop"
  | "kemasan"
  | "sewa-kios"
  | "marketing-digital"
  | "payroll"
  | "mesin"
  | "bahan-baku-fnb"
  | "ongkir"
  | "kasir-qris"
  | "seragam";

export const CATEGORY_LABEL: Record<ReimbursementCategory, string> = {
  laptop: "Laptop kerja",
  kemasan: "Kemasan box karton",
  "sewa-kios": "Sewa kios pasar",
  "marketing-digital": "Marketing digital campaign",
  payroll: "Payroll staf operasional",
  mesin: "Mesin produksi UMKM",
  "bahan-baku-fnb": "Bahan baku F&B",
  ongkir: "Ongkir lokal",
  "kasir-qris": "Peralatan kasir QRIS",
  seragam: "Seragam kerja",
};

const REF: Record<ReimbursementCategory, { unit: string; pricePerUnitIDR: number }> = {
  laptop:              { unit: "unit",          pricePerUnitIDR: 7_500_000 },
  kemasan:             { unit: "pcs",           pricePerUnitIDR: 3_500 },
  "sewa-kios":         { unit: "bulan",         pricePerUnitIDR: 2_500_000 },
  "marketing-digital": { unit: "campaign",      pricePerUnitIDR: 5_000_000 },
  payroll:             { unit: "orang/bulan",   pricePerUnitIDR: 4_000_000 },
  mesin:               { unit: "unit",          pricePerUnitIDR: 15_000_000 },
  "bahan-baku-fnb":    { unit: "kg",            pricePerUnitIDR: 35_000 },
  ongkir:              { unit: "paket",         pricePerUnitIDR: 25_000 },
  "kasir-qris":        { unit: "unit",          pricePerUnitIDR: 1_200_000 },
  seragam:             { unit: "pcs",           pricePerUnitIDR: 250_000 },
};

export type ValidationVerdict = "OK" | "OVER" | "REVIEW";

export function validateReimbursement(input: {
  category: ReimbursementCategory;
  amountIDR: number;
  quantity?: number;
}): {
  verdict: ValidationVerdict;
  refPriceIDR: number;
  deltaPct: number;
  note: string;
  unit: string;
} {
  const ref = REF[input.category];
  if (!ref) {
    return {
      verdict: "REVIEW",
      refPriceIDR: 0,
      deltaPct: 0,
      note: "Kategori tidak dikenali; menunggu review admin.",
      unit: "—",
    };
  }
  const qty = Math.max(1, input.quantity ?? 1);
  const expected = ref.pricePerUnitIDR * qty;
  const delta = (input.amountIDR - expected) / expected;
  const deltaPct = Math.round(delta * 1000) / 10;

  let verdict: ValidationVerdict = "OK";
  let note = `Sesuai harga pasar (Rp${ref.pricePerUnitIDR.toLocaleString("id-ID")} per ${ref.unit}).`;
  if (delta > 0.20) {
    verdict = "OVER";
    note = `Melebihi 20% di atas harga pasar (Rp${ref.pricePerUnitIDR.toLocaleString("id-ID")} per ${ref.unit}).`;
  } else if (delta > 0.05) {
    verdict = "REVIEW";
    note = `Lebih dari 5% di atas harga pasar — perlu review admin.`;
  } else if (delta < -0.30) {
    verdict = "REVIEW";
    note = `Jauh di bawah harga pasar — verifikasi supplier.`;
  }

  return { verdict, refPriceIDR: expected, deltaPct, note, unit: ref.unit };
}

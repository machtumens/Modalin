// Static seed for prototype demo. No DB. Imports cheap, deterministic.
import type { Sector, TxnKind, PitchStatus, ReimbursementStatus } from "@/lib/enums";

export type DemoUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "INVESTOR" | "UMKM";
};

export type DemoUMKM = {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  sector: Sector;
  ageMonths: number;
  monthlyRevenueIDR: number;
  fundingTargetIDR: number;
  valuationIDR: number;
  equityOfferedPct: number;
  story: string;
  location: string;
  province: string;
  syariahCompliant: boolean;
  aiScore: number;
  sliKScore: number;
  ecomVelocity: number;
  digitalBehavior: number;
  aiScoreOverride: number | null;
  overrideReason: string | null;
};

export type DemoPitch = {
  umkmId: string;
  status: PitchStatus;
  raisedIDR: number;
  minTicketIDR: number;
  deadline: string; // ISO
};

export type DemoBankAccount = {
  umkmId: string;
  providerBPR: string;
  accountNumber: string;
  balanceIDR: number;
};

export type DemoTransaction = {
  id: string;
  umkmId: string;
  ts: string; // ISO
  amountIDR: number;
  kind: TxnKind;
  channel: string;
  counterparty: string;
};

export type DemoInvestment = {
  id: string;
  investorId: string;
  umkmId: string;
  amountIDR: number;
  equityPct: number;
  createdAt: string;
};

export type DemoReimbursement = {
  id: string;
  umkmId: string;
  amountIDR: number;
  category: string;
  supplier: string | null;
  description: string;
  refPriceIDR: number;
  deltaPct: number;
  verdict: "OK" | "OVER" | "REVIEW";
  status: ReimbursementStatus;
  createdAt: string;
};

export type DemoCommunityPost = {
  id: string;
  umkmId: string;
  authorId: string;
  authorName: string;
  authorRole: "UMKM" | "INVESTOR";
  body: string;
  createdAt: string;
};

export const users: DemoUser[] = [
  { id: "u-admin", email: "admin@modalin.id", name: "Admin Modalin", role: "ADMIN" },
  { id: "u-andi-inv", email: "andi@inv.id", name: "Andi Investor", role: "INVESTOR" },
  { id: "u-siti-inv", email: "siti@inv.id", name: "Siti Investor", role: "INVESTOR" },
  { id: "u-rahmat-inv", email: "rahmat@inv.id", name: "Rahmat Investor", role: "INVESTOR" },
];

const umkmDefs = [
  { name: "Kopi Tani Toraja", owner: "Andi Pratama", sector: "F_AND_B", loc: "Makassar", prov: "Sulawesi Selatan",
    story: "Kopi Tani Toraja menghubungkan 120 petani kopi Toraja langsung ke konsumen urban via QRIS dan kanal e-commerce.\n\nDalam 18 bulan kami melayani 8.500 pelanggan setia dan tumbuh 14% bulan-ke-bulan.\n\nDana ekspansi akan membiayai mesin roasting baru dan pembukaan dua coffee bar di Makassar dan Manado." },
  { name: "Sari Kemasan Nusantara", owner: "Siti Hartati", sector: "RETAIL", loc: "Surabaya", prov: "Jawa Timur",
    story: "Sari Kemasan Nusantara menyediakan kemasan ramah lingkungan untuk UMKM F&B.\n\nPelanggan B2B kami mencakup 240 brand kuliner di Jabodetabek dan Surabaya, dengan repeat order 78%.\n\nPendanaan akan dipakai untuk lini produksi tambahan agar dapat memenuhi tunggakan order Rp1,2 miliar." },
  { name: "Tani Hidroponik Jaya", owner: "Rahmat Hidayat", sector: "AGRI", loc: "Bandung", prov: "Jawa Barat",
    story: "Tani Hidroponik Jaya mengoperasikan 4 greenhouse seluas 2.400 m² yang memasok sayuran premium ke 18 supermarket dan 36 restoran.\n\nKami punya kontrak off-take dengan dua jaringan ritel modern bernilai Rp4,8 miliar/tahun.\n\nDana akan mengembangkan dua greenhouse baru di Lembang dan otomatisasi nutrisi." },
  { name: "Batik Digital Pekalongan", owner: "Kartika Wulandari", sector: "RETAIL", loc: "Pekalongan", prov: "Jawa Tengah",
    story: "Studio batik tulis kontemporer dengan kolaborator desainer Jakarta dan Bali.\n\nGMV 24 bulan terakhir Rp3,1 miliar dengan AOV Rp780.000.\n\nDana untuk memperluas studio dan rekrut 12 pembatik baru." },
  { name: "Roti Rumah Bunda", owner: "Dewi Anggraini", sector: "F_AND_B", loc: "Yogyakarta", prov: "DI Yogyakarta",
    story: "Bakery rumahan dengan 4 cabang di Jogja menjual 2.800 roti/hari.\n\nMargin kotor 42%, repeat customer 64%.\n\nDana untuk dapur sentral dan armada distribusi roda dua." },
  { name: "Servis Motor Cepat", owner: "Bayu Saputra", sector: "SERVICES", loc: "Tangerang", prov: "Banten",
    story: "Layanan servis motor on-demand dengan aplikasi internal dan 14 mekanik mitra.\n\n9.200 booking dalam 14 bulan.\n\nDana untuk akuisisi pelanggan dan ekspansi ke Bekasi." },
  { name: "Ikan Nusantara Segar", owner: "Iwan Setiawan", sector: "AGRI", loc: "Palembang", prov: "Sumatera Selatan",
    story: "Distributor ikan air tawar dari 32 kolam mitra ke pasar tradisional dan restoran.\n\nVolume 3,2 ton/minggu.\n\nDana untuk cold storage dan armada thermal." },
  { name: "Cuci Sepatu Bersih", owner: "Lina Marlina", sector: "SERVICES", loc: "Bekasi", prov: "Jawa Barat",
    story: "Cuci sepatu premium dengan layanan jemput-antar.\n\n3 outlet aktif, 4.100 pelanggan terdaftar.\n\nDana untuk franchise model dan training pegawai baru." },
  { name: "Madu Hutan Lestari", owner: "Hasan Basri", sector: "AGRI", loc: "Medan", prov: "Sumatera Utara",
    story: "Madu hutan murni dari 60 petani lebah di Sumatera.\n\nBersertifikat halal MUI dan ekspor pilot ke Singapura.\n\nDana untuk packaging dan booth ekspor." },
  { name: "Frozen Food Mama", owner: "Rina Setyawati", sector: "F_AND_B", loc: "Denpasar", prov: "Bali",
    story: "Pabrik mini frozen food rumahan: dimsum, otak-otak, nugget ayam.\n\nDistribusi ke 80 toko dan reseller.\n\nDana untuk freezer kapasitas 2 ton dan branding." },
  { name: "Pakaian Muslim Modern", owner: "Aisyah Permata", sector: "RETAIL", loc: "Bandung", prov: "Jawa Barat",
    story: "Brand fashion modest dengan 22 SKU aktif dan kolaborasi influencer.\n\nGMV bulanan Rp220 jt dan tumbuh 18% MoM.\n\nDana untuk produksi koleksi Lebaran." },
  { name: "Les Privat Genius", owner: "Joko Susilo", sector: "SERVICES", loc: "Jakarta Timur", prov: "DKI Jakarta",
    story: "Layanan les privat untuk SD-SMP dengan 48 pengajar mitra.\n\n720 siswa aktif, retention 87%.\n\nDana untuk platform booking digital dan konten." },
] as const;

const bprPartners = ["BPR Mitra Jaya", "BPR Sentra Nusantara", "BPR Karya Mandiri", "BPR Daerah Sejahtera"];

// Deterministic PRNG so seed re-imports identical
let prngSeed = 1234567;
function rand(min: number, max: number) {
  prngSeed = (prngSeed * 9301 + 49297) % 233280;
  const r = prngSeed / 233280;
  return Math.floor(r * (max - min + 1)) + min;
}
function randPick<T>(arr: readonly T[]): T {
  return arr[rand(0, arr.length - 1)];
}

export const umkms: DemoUMKM[] = umkmDefs.map((d, i) => {
  const monthlyRevenue = rand(30, 300) * 1_000_000;
  const fundingTarget = rand(50, 500) * 1_000_000;
  const valuation = fundingTarget * rand(4, 8);
  const equityPct = Math.round((fundingTarget / valuation) * 1000) / 10;
  return {
    id: `umkm-${i + 1}`,
    ownerId: `u-umkm-${i + 1}`,
    ownerName: d.owner,
    name: d.name,
    sector: d.sector as Sector,
    ageMonths: rand(12, 36),
    monthlyRevenueIDR: monthlyRevenue,
    fundingTargetIDR: fundingTarget,
    valuationIDR: valuation,
    equityOfferedPct: equityPct,
    story: d.story,
    location: d.loc,
    province: d.prov,
    syariahCompliant: rand(0, 9) < 7,
    aiScore: rand(55, 88),
    sliKScore: rand(60, 90),
    ecomVelocity: rand(50, 90),
    digitalBehavior: rand(55, 90),
    aiScoreOverride: null,
    overrideReason: null,
  };
});

// Append UMKM owner users
for (const u of umkms) {
  users.push({
    id: u.ownerId,
    email: `${u.ownerName.toLowerCase().split(" ")[0]}.${u.id}@umkm.id`,
    name: u.ownerName,
    role: "UMKM",
  });
}

export const pitches: DemoPitch[] = umkms.map((u) => ({
  umkmId: u.id,
  status: "APPROVED" as PitchStatus,
  raisedIDR: Math.round(u.fundingTargetIDR * (rand(5, 60) / 100)),
  minTicketIDR: 100_000,
  deadline: new Date(Date.now() + rand(14, 60) * 86_400_000).toISOString(),
}));

export const bankAccounts: DemoBankAccount[] = umkms.map((u) => ({
  umkmId: u.id,
  providerBPR: randPick(bprPartners),
  accountNumber: `${rand(1000, 9999)}-${rand(1000, 9999)}-${rand(1000, 9999)}`,
  balanceIDR: rand(5, 80) * 1_000_000,
}));

const inflowChannels = ["QRIS", "Transfer", "Tarik Tunai Mitra", "QRIS"];
const outflowChannels = ["Supplier", "Payroll", "Utility", "Logistik", "Marketing"];
const inflowParties = [
  "Pelanggan QRIS Jakarta",
  "PT Mitra Niaga",
  "Toko Sumber Rejeki",
  "Kafe Senopati",
  "Reseller Bandung",
  "Marketplace Tokobaru",
];
const outflowParties = [
  "PT Bahan Baku Indo",
  "Payroll - Operasional",
  "PLN Pascabayar",
  "Indihome Bisnis",
  "JNE Express",
  "Iklan Meta Ads",
];

export const transactions: DemoTransaction[] = (() => {
  const out: DemoTransaction[] = [];
  let counter = 0;
  for (const u of umkms) {
    for (let day = 60; day >= 0; day--) {
      const txnsToday = rand(3, 8);
      for (let i = 0; i < txnsToday; i++) {
        const isInflow = rand(0, 9) < 6;
        const ts = new Date(Date.now() - day * 86_400_000 - rand(0, 86_400_000));
        out.push({
          id: `txn-${++counter}`,
          umkmId: u.id,
          ts: ts.toISOString(),
          amountIDR: rand(10, 5000) * 1_000,
          kind: isInflow ? "INFLOW" : "OUTFLOW",
          channel: isInflow ? randPick(inflowChannels) : randPick(outflowChannels),
          counterparty: isInflow ? randPick(inflowParties) : randPick(outflowParties),
        });
      }
    }
  }
  return out.sort((a, b) => b.ts.localeCompare(a.ts));
})();

// Sample portfolio for andi@inv.id
export const investments: DemoInvestment[] = [
  { id: "inv-1", investorId: "u-andi-inv", umkmId: "umkm-1", amountIDR: 250_000, equityPct: 0.083, createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString() },
  { id: "inv-2", investorId: "u-andi-inv", umkmId: "umkm-3", amountIDR: 500_000, equityPct: 0.156, createdAt: new Date(Date.now() - 8 * 86_400_000).toISOString() },
  { id: "inv-3", investorId: "u-andi-inv", umkmId: "umkm-5", amountIDR: 5_000_000, equityPct: 5.21, createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString() },
  { id: "inv-4", investorId: "u-siti-inv", umkmId: "umkm-2", amountIDR: 1_200_000, equityPct: 0.32, createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString() },
];

export const reimbursements: DemoReimbursement[] = [
  { id: "rb-1", umkmId: "umkm-1", amountIDR: 7_500_000, category: "laptop", supplier: "Toko Komputer Jaya", description: "Laptop admin keuangan", refPriceIDR: 7_500_000, deltaPct: 0, verdict: "OK", status: "DISBURSED", createdAt: new Date(Date.now() - 14 * 86_400_000).toISOString() },
  { id: "rb-2", umkmId: "umkm-1", amountIDR: 2_500_000, category: "sewa-kios", supplier: "Pasar Senen", description: "Sewa kios Mei 2026", refPriceIDR: 2_500_000, deltaPct: 0, verdict: "OK", status: "DISBURSED", createdAt: new Date(Date.now() - 25 * 86_400_000).toISOString() },
  { id: "rb-3", umkmId: "umkm-3", amountIDR: 30_000_000, category: "marketing-digital", supplier: "Agensi Digital Bandung", description: "Campaign Lebaran 2026", refPriceIDR: 5_000_000, deltaPct: 500, verdict: "OVER", status: "BLOCKED_PRICE_CHECK", createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString() },
];

export const communityPosts: DemoCommunityPost[] = [
  { id: "p-1", umkmId: "umkm-5", authorId: "u-umkm-5", authorName: "Dewi Anggraini", authorRole: "UMKM", body: "Update Q1: omzet tumbuh 18% MoM, cabang ke-5 Jogja Selatan launch minggu depan. Foto akan di-share di feed.", createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString() },
  { id: "p-2", umkmId: "umkm-5", authorId: "u-andi-inv", authorName: "Andi Investor", authorRole: "INVESTOR", body: "Selamat untuk pertumbuhan. Saran: pertimbangkan reseller di Magelang — pasarnya bagus.", createdAt: new Date(Date.now() - 6 * 86_400_000).toISOString() },
  { id: "p-3", umkmId: "umkm-5", authorId: "u-umkm-5", authorName: "Dewi Anggraini", authorRole: "UMKM", body: "Terima kasih masukannya — sudah masuk roadmap Q3.", createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString() },
];

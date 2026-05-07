import { PrismaClient, Role, Sector, TxnKind, PitchStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "Demo123!";

const sectors: Sector[] = [Sector.F_AND_B, Sector.RETAIL, Sector.AGRI, Sector.SERVICES];

const businesses: {
  name: string;
  ownerName: string;
  ownerEmail: string;
  sector: Sector;
  location: string;
  province: string;
  story: string;
}[] = [
  {
    name: "Kopi Tani Toraja",
    ownerName: "Andi Pratama",
    ownerEmail: "andi.kopitani@umkm.id",
    sector: Sector.F_AND_B,
    location: "Makassar",
    province: "Sulawesi Selatan",
    story:
      "Kopi Tani Toraja menghubungkan 120 petani kopi Toraja langsung ke konsumen urban via QRIS dan kanal e-commerce.\n\nDalam 18 bulan kami melayani 8.500 pelanggan setia dan tumbuh 14% bulan-ke-bulan.\n\nDana ekspansi akan membiayai mesin roasting baru dan pembukaan dua coffee bar di Makassar dan Manado.",
  },
  {
    name: "Sari Kemasan Nusantara",
    ownerName: "Siti Hartati",
    ownerEmail: "siti.sari@umkm.id",
    sector: Sector.RETAIL,
    location: "Surabaya",
    province: "Jawa Timur",
    story:
      "Sari Kemasan Nusantara menyediakan kemasan ramah lingkungan untuk UMKM F&B.\n\nPelanggan B2B kami mencakup 240 brand kuliner di Jabodetabek dan Surabaya, dengan repeat order 78%.\n\nPendanaan akan dipakai untuk lini produksi tambahan agar dapat memenuhi tunggakan order Rp1,2 miliar.",
  },
  {
    name: "Tani Hidroponik Jaya",
    ownerName: "Rahmat Hidayat",
    ownerEmail: "rahmat.tani@umkm.id",
    sector: Sector.AGRI,
    location: "Bandung",
    province: "Jawa Barat",
    story:
      "Tani Hidroponik Jaya mengoperasikan 4 greenhouse seluas 2.400 m² yang memasok sayuran premium ke 18 supermarket dan 36 restoran.\n\nKami punya kontrak off-take dengan dua jaringan ritel modern bernilai Rp4,8 miliar/tahun.\n\nDana akan mengembangkan dua greenhouse baru di Lembang dan otomatisasi nutrisi.",
  },
  {
    name: "Batik Digital Pekalongan",
    ownerName: "Kartika Wulandari",
    ownerEmail: "kartika.batik@umkm.id",
    sector: Sector.RETAIL,
    location: "Pekalongan",
    province: "Jawa Tengah",
    story:
      "Studio batik tulis kontemporer dengan kolaborator desainer Jakarta dan Bali.\n\nGMV 24 bulan terakhir Rp3,1 miliar dengan AOV Rp780.000.\n\nDana untuk memperluas studio dan rekrut 12 pembatik baru.",
  },
  {
    name: "Roti Rumah Bunda",
    ownerName: "Dewi Anggraini",
    ownerEmail: "dewi.roti@umkm.id",
    sector: Sector.F_AND_B,
    location: "Yogyakarta",
    province: "DI Yogyakarta",
    story:
      "Bakery rumahan dengan 4 cabang di Jogja menjual 2.800 roti/hari.\n\nMargin kotor 42%, repeat customer 64%.\n\nDana untuk dapur sentral dan armada distribusi roda dua.",
  },
  {
    name: "Servis Motor Cepat",
    ownerName: "Bayu Saputra",
    ownerEmail: "bayu.servis@umkm.id",
    sector: Sector.SERVICES,
    location: "Tangerang",
    province: "Banten",
    story:
      "Layanan servis motor on-demand dengan aplikasi internal dan 14 mekanik mitra.\n\n9.200 booking dalam 14 bulan.\n\nDana untuk akuisisi pelanggan dan ekspansi ke Bekasi.",
  },
  {
    name: "Ikan Nusantara Segar",
    ownerName: "Iwan Setiawan",
    ownerEmail: "iwan.ikan@umkm.id",
    sector: Sector.AGRI,
    location: "Palembang",
    province: "Sumatera Selatan",
    story:
      "Distributor ikan air tawar dari 32 kolam mitra ke pasar tradisional dan restoran.\n\nVolume 3,2 ton/minggu.\n\nDana untuk cold storage dan armada thermal.",
  },
  {
    name: "Cuci Sepatu Bersih",
    ownerName: "Lina Marlina",
    ownerEmail: "lina.cuci@umkm.id",
    sector: Sector.SERVICES,
    location: "Bekasi",
    province: "Jawa Barat",
    story:
      "Cuci sepatu premium dengan layanan jemput-antar.\n\n3 outlet aktif, 4.100 pelanggan terdaftar.\n\nDana untuk franchise model dan training pegawai baru.",
  },
  {
    name: "Madu Hutan Lestari",
    ownerName: "Hasan Basri",
    ownerEmail: "hasan.madu@umkm.id",
    sector: Sector.AGRI,
    location: "Medan",
    province: "Sumatera Utara",
    story:
      "Madu hutan murni dari 60 petani lebah di Sumatera.\n\nBersertifikat halal MUI dan ekspor pilot ke Singapura.\n\nDana untuk packaging dan booth ekspor.",
  },
  {
    name: "Frozen Food Mama",
    ownerName: "Rina Setyawati",
    ownerEmail: "rina.frozen@umkm.id",
    sector: Sector.F_AND_B,
    location: "Denpasar",
    province: "Bali",
    story:
      "Pabrik mini frozen food rumahan: dimsum, otak-otak, nugget ayam.\n\nDistribusi ke 80 toko dan reseller.\n\nDana untuk freezer kapasitas 2 ton dan branding.",
  },
  {
    name: "Pakaian Muslim Modern",
    ownerName: "Aisyah Permata",
    ownerEmail: "aisyah.pakaian@umkm.id",
    sector: Sector.RETAIL,
    location: "Bandung",
    province: "Jawa Barat",
    story:
      "Brand fashion modest dengan 22 SKU aktif dan kolaborasi influencer.\n\nGMV bulanan Rp220 jt dan tumbuh 18% MoM.\n\nDana untuk produksi koleksi Lebaran.",
  },
  {
    name: "Les Privat Genius",
    ownerName: "Joko Susilo",
    ownerEmail: "joko.les@umkm.id",
    sector: Sector.SERVICES,
    location: "Jakarta Timur",
    province: "DKI Jakarta",
    story:
      "Layanan les privat untuk SD-SMP dengan 48 pengajar mitra.\n\n720 siswa aktif, retention 87%.\n\nDana untuk platform booking digital dan konten.",
  },
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const inflowChannels = ["QRIS", "Transfer", "Tarik Tunai Mitra", "QRIS"];
const outflowChannels = ["Supplier", "Payroll", "Utility", "Logistik", "Marketing"];
const inflowParties = [
  "Pelanggan QRIS Jakarta",
  "PT Mitra Niaga",
  "Toko Sumber Rejeki",
  "Kafe Senopati",
  "Reseller Bandung",
  "Marketplace Tokobaru",
  "Distributor Surabaya",
];
const outflowParties = [
  "PT Bahan Baku Indo",
  "Payroll - Operasional",
  "PLN Pascabayar",
  "Indihome Bisnis",
  "JNE Express",
  "Iklan Meta Ads",
  "Sewa Kios Pasar",
];

async function main() {
  console.log("Cleaning previous seed...");
  await prisma.qAPost.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.indexFundHolding.deleteMany();
  await prisma.reimbursement.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.pitch.deleteMany();
  await prisma.uMKM.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  await prisma.user.create({
    data: {
      email: "admin@modalin.id",
      name: "Admin Modalin",
      role: Role.ADMIN,
      passwordHash,
    },
  });

  const investors = await Promise.all(
    [
      { email: "andi@inv.id", name: "Andi Investor" },
      { email: "siti@inv.id", name: "Siti Investor" },
      { email: "rahmat@inv.id", name: "Rahmat Investor" },
    ].map((u) =>
      prisma.user.create({
        data: { ...u, role: Role.INVESTOR, passwordHash },
      })
    )
  );

  const bprPartners = [
    "BPR Mitra Jaya",
    "BPR Sentra Nusantara",
    "BPR Karya Mandiri",
    "BPR Daerah Sejahtera",
  ];

  for (const b of businesses) {
    const owner = await prisma.user.create({
      data: {
        email: b.ownerEmail,
        name: b.ownerName,
        role: Role.UMKM,
        passwordHash,
      },
    });

    const monthlyRevenue = BigInt(rand(30, 300) * 1_000_000);
    const fundingTarget = BigInt(rand(50, 500) * 1_000_000);
    const valuation = fundingTarget * BigInt(rand(4, 8));
    const equityPct = Math.round((Number(fundingTarget) / Number(valuation)) * 1000) / 10;
    const aiScore = rand(55, 88);

    const umkm = await prisma.uMKM.create({
      data: {
        ownerId: owner.id,
        name: b.name,
        sector: b.sector,
        ageMonths: rand(12, 36),
        monthlyRevenueIDR: monthlyRevenue,
        fundingTargetIDR: fundingTarget,
        valuationIDR: valuation,
        equityOfferedPct: equityPct,
        story: b.story,
        location: b.location,
        province: b.province,
        syariahCompliant: Math.random() < 0.7,
        aiScore,
        sliKScore: rand(60, 90),
        ecomVelocity: rand(50, 90),
        digitalBehavior: rand(55, 90),
      },
    });

    await prisma.pitch.create({
      data: {
        umkmId: umkm.id,
        status: PitchStatus.APPROVED,
        deadline: new Date(Date.now() + rand(14, 60) * 86_400_000),
        raisedIDR: BigInt(0),
      },
    });

    const ba = await prisma.bankAccount.create({
      data: {
        umkmId: umkm.id,
        providerBPR: randPick(bprPartners),
        accountNumber: `${rand(1000, 9999)}-${rand(1000, 9999)}-${rand(1000, 9999)}`,
        balanceIDR: BigInt(rand(5, 80) * 1_000_000),
      },
    });

    const txns = [];
    for (let day = 60; day >= 0; day--) {
      const txnsToday = rand(3, 8);
      for (let i = 0; i < txnsToday; i++) {
        const isInflow = Math.random() < 0.6;
        const ts = new Date(Date.now() - day * 86_400_000 - rand(0, 86_400_000));
        const amount = BigInt(rand(10, 5000) * 1_000);
        txns.push({
          bankAccountId: ba.id,
          ts,
          amountIDR: amount,
          kind: isInflow ? TxnKind.INFLOW : TxnKind.OUTFLOW,
          channel: isInflow ? randPick(inflowChannels) : randPick(outflowChannels),
          counterparty: isInflow ? randPick(inflowParties) : randPick(outflowParties),
        });
      }
    }
    await prisma.transaction.createMany({ data: txns });
  }

  console.log(`Seeded: 1 admin, ${investors.length} investors, ${businesses.length} UMKM with bank + transactions.`);
  console.log(`All passwords: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

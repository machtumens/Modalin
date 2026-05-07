import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { IndexFundSimulator } from "@/components/investor/index-fund-simulator";
import type { Candidate } from "@/components/investor/index-fund-simulator";

export const dynamic = "force-dynamic";

export default async function IndexFundPage() {
  await requireRole("INVESTOR");

  const all = await prisma.uMKM.findMany({
    where: { pitch: { is: { status: "APPROVED" } } },
    orderBy: { aiScore: "desc" },
    take: 60,
  });

  const map: Record<string, Candidate[]> = {
    conservative: [],
    balanced: [],
    growth: [],
  };

  for (const u of all) {
    const score = u.aiScoreOverride ?? u.aiScore;
    const c: Candidate = { id: u.id, name: u.name, sector: u.sector, aiScore: score };
    if (score >= 80) map.conservative.push(c);
    if (score >= 70) map.balanced.push(c);
    if (score >= 60) map.growth.push(c);
  }

  for (const k of Object.keys(map)) {
    map[k] = map[k].slice(0, 15);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold">Modalin Index Fund</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Diversifikasi otomatis ke 10–20 UMKM terkurasi dengan bobot mengikuti AI Score. Pilih strategi sesuai profil risiko Anda.
        </p>
      </header>
      <IndexFundSimulator pool={map} />
    </div>
  );
}

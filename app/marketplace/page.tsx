import { Prisma, Sector } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FilterRail } from "@/components/marketplace/filter-rail";
import { UMKMCard } from "@/components/marketplace/umkm-card";

export const metadata = { title: "Marketplace" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const sectorList = (sp.sector ?? "").split(",").filter(Boolean) as Sector[];
  const minScore = Number(sp.minScore ?? 0);
  const syariah = sp.syariah === "1";
  const sort = sp.sort ?? "score";
  const page = Math.max(1, Number(sp.page ?? 1));

  const where: Prisma.UMKMWhereInput = {
    pitch: { is: { status: "APPROVED" } },
    aiScore: { gte: minScore },
  };
  if (sectorList.length) where.sector = { in: sectorList };
  if (syariah) where.syariahCompliant = true;

  const orderBy: Prisma.UMKMOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "deadline"
        ? { pitch: { deadline: "asc" } }
        : sort === "progress"
          ? { pitch: { raisedIDR: "desc" } }
          : { aiScore: "desc" };

  const [items, total] = await Promise.all([
    prisma.uMKM.findMany({
      where,
      orderBy,
      include: { pitch: true },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.uMKM.count({ where }),
  ]);

  const cards = items.map((u) => {
    const target = Number(u.fundingTargetIDR);
    const raised = u.pitch ? Number(u.pitch.raisedIDR) : 0;
    const daysLeft = u.pitch
      ? Math.max(0, Math.ceil((u.pitch.deadline.getTime() - Date.now()) / 86_400_000))
      : 0;
    return {
      id: u.id,
      name: u.name,
      sector: u.sector,
      location: u.location,
      province: u.province,
      syariahCompliant: u.syariahCompliant,
      aiScore: u.aiScoreOverride ?? u.aiScore,
      fundingTargetIDR: target,
      raisedIDR: raised,
      daysLeft,
    };
  });

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Marketplace UMKM</h1>
        <p className="mt-2 text-zinc-600">{total} UMKM tersedia untuk pendanaan ekuitas.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <FilterRail />
        <div>
          {cards.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">
              Tidak ada UMKM yang cocok dengan filter Anda.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <UMKMCard key={c.id} d={c} />
              ))}
            </div>
          )}
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
                const params = new URLSearchParams(sp as Record<string, string>);
                params.set("page", String(p));
                return (
                  <a
                    key={p}
                    href={`/marketplace?${params.toString()}`}
                    className={`rounded-md border px-3 py-1.5 text-sm ${p === page ? "border-brand-700 bg-brand-700 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"}`}
                  >
                    {p}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

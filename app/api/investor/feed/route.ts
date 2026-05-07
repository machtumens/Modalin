import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { anonymizeCounterparty } from "@/lib/anonymize";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "INVESTOR") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const holdings = await prisma.investment.groupBy({
    by: ["umkmId"],
    where: { investorId: session.user.id },
    _sum: { equityPct: true },
  });
  const umkmIds = holdings.map((h) => h.umkmId);
  if (!umkmIds.length) return NextResponse.json({ items: [] });

  const communityAccess = new Set(holdings.filter((h) => (h._sum.equityPct ?? 0) >= 5).map((h) => h.umkmId));

  const txns = await prisma.transaction.findMany({
    where: { bankAccount: { umkmId: { in: umkmIds } } },
    orderBy: { ts: "desc" },
    take: 50,
    include: { bankAccount: { select: { umkmId: true, umkm: { select: { name: true } } } } },
  });

  const items = txns.map((t) => ({
    id: t.id,
    ts: t.ts.toISOString(),
    amountIDR: Number(t.amountIDR),
    kind: t.kind,
    channel: t.channel,
    counterparty: communityAccess.has(t.bankAccount.umkmId)
      ? t.counterparty
      : anonymizeCounterparty(t.counterparty),
    umkmId: t.bankAccount.umkmId,
    umkmName: t.bankAccount.umkm.name,
  }));

  return NextResponse.json({ items });
}

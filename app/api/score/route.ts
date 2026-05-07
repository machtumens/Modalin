import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreUMKM } from "@/lib/ai/scorer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("demo")) {
    return NextResponse.json({
      score: 78,
      components: { slik: 82, ecommerce: 71, behavior: 80, sector: 74 },
    });
  }
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const u = await prisma.uMKM.findUnique({ where: { id } });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  const result = scoreUMKM({
    monthlyRevenueIDR: Number(u.monthlyRevenueIDR),
    ageMonths: u.ageMonths,
    sliKScore: u.sliKScore,
    ecomVelocity: u.ecomVelocity,
    digitalBehavior: u.digitalBehavior,
    sector: u.sector,
  });
  const total = u.aiScoreOverride ?? result.total;
  return NextResponse.json({ score: total, components: result.components, override: u.aiScoreOverride !== null });
}

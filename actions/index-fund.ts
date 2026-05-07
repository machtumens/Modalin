"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  amountIDR: z.number().int().min(1_000_000),
  strategy: z.enum(["conservative", "balanced", "growth"]),
});

const minScoreByStrategy: Record<string, number> = {
  conservative: 80,
  balanced: 70,
  growth: 60,
};

export async function executeIndexFund(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "INVESTOR") return { ok: false as const, error: "Hanya investor." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Input tidak valid." };
  const { amountIDR, strategy } = parsed.data;
  const minScore = minScoreByStrategy[strategy];

  const candidates = await prisma.uMKM.findMany({
    where: {
      pitch: { is: { status: "APPROVED" } },
      aiScore: { gte: minScore },
    },
    include: { pitch: true },
    orderBy: { aiScore: "desc" },
    take: 15,
  });
  if (candidates.length < 5) return { ok: false as const, error: "UMKM yang lulus kriteria strategi tidak cukup." };

  const totalScore = candidates.reduce((s, u) => s + (u.aiScoreOverride ?? u.aiScore), 0);

  await prisma.$transaction(async (tx) => {
    for (const u of candidates) {
      const score = u.aiScoreOverride ?? u.aiScore;
      const weight = score / totalScore;
      const a = Math.floor(amountIDR * weight);
      if (a < 1) continue;
      const equityPct = (a / Number(u.valuationIDR)) * 100;

      await tx.investment.create({
        data: {
          investorId: session.user.id,
          umkmId: u.id,
          amountIDR: BigInt(a),
          equityPct,
        },
      });
      await tx.pitch.update({
        where: { id: u.pitch!.id },
        data: { raisedIDR: { increment: BigInt(a) } },
      });
      await tx.indexFundHolding.create({
        data: {
          investorId: session.user.id,
          umkmId: u.id,
          weightPct: weight * 100,
          amountIDR: BigInt(a),
        },
      });
    }
  });

  revalidatePath("/investor/dashboard");
  revalidatePath("/investor/portfolio");
  return { ok: true as const, count: candidates.length };
}

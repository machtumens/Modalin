"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PitchStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  story: z.string().min(40).max(5000),
  fundingTargetIDR: z.number().int().min(50_000_000).max(500_000_000),
  equityOfferedPct: z.number().min(1).max(40),
  deadlineDays: z.number().int().min(7).max(120),
  syariahCompliant: z.boolean(),
});

export async function submitPitch(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "UMKM") {
    return { ok: false as const, error: "Hanya UMKM." };
  }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Input tidak valid." };

  const u = await prisma.uMKM.findFirst({ where: { ownerId: session.user.id } });
  if (!u) return { ok: false as const, error: "UMKM tidak ditemukan." };

  const valuationIDR = parsed.data.fundingTargetIDR / (parsed.data.equityOfferedPct / 100);

  await prisma.$transaction(async (tx) => {
    await tx.uMKM.update({
      where: { id: u.id },
      data: {
        story: parsed.data.story,
        fundingTargetIDR: BigInt(parsed.data.fundingTargetIDR),
        equityOfferedPct: parsed.data.equityOfferedPct,
        valuationIDR: BigInt(Math.round(valuationIDR)),
        syariahCompliant: parsed.data.syariahCompliant,
      },
    });
    await tx.pitch.update({
      where: { umkmId: u.id },
      data: {
        status: PitchStatus.PENDING_REVIEW,
        deadline: new Date(Date.now() + parsed.data.deadlineDays * 86_400_000),
      },
    });
  });

  revalidatePath("/umkm/dashboard");
  revalidatePath("/admin/umkm");
  return { ok: true as const };
}

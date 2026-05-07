"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  umkmId: z.string().min(1),
  amountIDR: z.number().int().min(100_000),
  riskAcknowledged: z.boolean(),
  syariahAcknowledged: z.boolean(),
});

export async function investAction(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "INVESTOR") {
    return { ok: false as const, error: "Hanya akun investor yang dapat berinvestasi." };
  }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Input tidak valid." };
  const { umkmId, amountIDR, riskAcknowledged, syariahAcknowledged } = parsed.data;
  if (!riskAcknowledged || !syariahAcknowledged) {
    return { ok: false as const, error: "Anda harus menyetujui disclaimer risiko dan akad syariah." };
  }

  const result = await prisma.$transaction(async (tx) => {
    const umkm = await tx.uMKM.findUniqueOrThrow({
      where: { id: umkmId },
      include: { pitch: true },
    });
    if (!umkm.pitch) throw new Error("Pitch tidak ditemukan.");
    const remaining = Number(umkm.fundingTargetIDR) - Number(umkm.pitch.raisedIDR);
    if (amountIDR > remaining) throw new Error("Jumlah melebihi sisa kebutuhan pendanaan.");

    const equityPct = (amountIDR / Number(umkm.valuationIDR)) * 100;

    await tx.investment.create({
      data: {
        investorId: session.user.id,
        umkmId,
        amountIDR: BigInt(amountIDR),
        equityPct,
      },
    });
    await tx.pitch.update({
      where: { id: umkm.pitch.id },
      data: { raisedIDR: { increment: BigInt(amountIDR) } },
    });

    const totalEquity = await tx.investment.aggregate({
      where: { investorId: session.user.id, umkmId },
      _sum: { equityPct: true },
    });
    return { equityPctNow: totalEquity._sum.equityPct ?? equityPct };
  });

  revalidatePath(`/marketplace/${umkmId}`);
  revalidatePath("/marketplace");
  return { ok: true as const, equityPctNow: result.equityPctNow };
}

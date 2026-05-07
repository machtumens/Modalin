"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TxnKind, ReimbursementStatus, PitchStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function approvePitch(umkmId: string) {
  await ensureAdmin();
  await prisma.pitch.update({
    where: { umkmId },
    data: { status: PitchStatus.APPROVED },
  });
  revalidatePath("/admin/umkm");
  revalidatePath(`/marketplace`);
  return { ok: true as const };
}

export async function rejectPitch(umkmId: string, reason: string) {
  await ensureAdmin();
  await prisma.pitch.update({
    where: { umkmId },
    data: { status: PitchStatus.REJECTED, rejectionReason: reason },
  });
  revalidatePath("/admin/umkm");
  return { ok: true as const };
}

const overrideSchema = z.object({
  umkmId: z.string().min(1),
  score: z.number().int().min(0).max(100).nullable(),
  reason: z.string().max(500).optional(),
});

export async function overrideAIScore(input: z.infer<typeof overrideSchema>) {
  await ensureAdmin();
  const parsed = overrideSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Input tidak valid." };
  await prisma.uMKM.update({
    where: { id: parsed.data.umkmId },
    data: {
      aiScoreOverride: parsed.data.score,
      overrideReason: parsed.data.reason ?? null,
    },
  });
  revalidatePath("/admin/umkm");
  revalidatePath(`/admin/umkm/${parsed.data.umkmId}`);
  return { ok: true as const };
}

export async function approveReimbursement(id: string) {
  await ensureAdmin();
  await prisma.$transaction(async (tx) => {
    const r = await tx.reimbursement.findUniqueOrThrow({
      where: { id },
      include: { umkm: { include: { bankAccount: true } } },
    });
    if (r.status === ReimbursementStatus.DISBURSED) return;
    const ba = r.umkm.bankAccount!;
    await tx.bankAccount.update({
      where: { id: ba.id },
      data: { balanceIDR: { decrement: r.amountIDR } },
    });
    await tx.transaction.create({
      data: {
        bankAccountId: ba.id,
        amountIDR: r.amountIDR,
        kind: TxnKind.OUTFLOW,
        channel: "Reimbursement",
        counterparty: r.supplier ?? "Supplier (Reimbursement)",
        note: `Reimbursement ${r.category} · ${r.description.slice(0, 80)} (admin)`,
      },
    });
    await tx.reimbursement.update({
      where: { id: r.id },
      data: { status: ReimbursementStatus.DISBURSED, resolvedAt: new Date() },
    });
  });
  revalidatePath("/admin/payouts");
  return { ok: true as const };
}

export async function rejectReimbursement(id: string, reason: string) {
  await ensureAdmin();
  await prisma.reimbursement.update({
    where: { id },
    data: { status: ReimbursementStatus.REJECTED, rejectReason: reason, resolvedAt: new Date() },
  });
  revalidatePath("/admin/payouts");
  return { ok: true as const };
}

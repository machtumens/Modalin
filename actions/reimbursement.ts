"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TxnKind, ReimbursementStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateReimbursement, type ReimbursementCategory } from "@/lib/ai/price-validator";

const schema = z.object({
  category: z.enum([
    "laptop",
    "kemasan",
    "sewa-kios",
    "marketing-digital",
    "payroll",
    "mesin",
    "bahan-baku-fnb",
    "ongkir",
    "kasir-qris",
    "seragam",
  ]),
  amountIDR: z.number().int().min(10_000),
  quantity: z.number().int().min(1).optional(),
  supplier: z.string().min(1).max(200).optional(),
  description: z.string().min(2).max(500),
  invoiceFileName: z.string().optional(),
});

export async function requestReimbursement(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "UMKM") {
    return { ok: false as const, error: "Hanya UMKM." };
  }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Input tidak valid." };

  const umkm = await prisma.uMKM.findFirst({
    where: { ownerId: session.user.id },
    include: { bankAccount: true },
  });
  if (!umkm || !umkm.bankAccount) return { ok: false as const, error: "UMKM atau rekening tidak ditemukan." };

  const validation = validateReimbursement({
    category: parsed.data.category as ReimbursementCategory,
    amountIDR: parsed.data.amountIDR,
    quantity: parsed.data.quantity,
  });

  let status: ReimbursementStatus;
  const balance = Number(umkm.bankAccount.balanceIDR);
  const autoApproveCap = 5_000_000;

  if (validation.verdict === "OVER") {
    status = ReimbursementStatus.BLOCKED_PRICE_CHECK;
  } else if (validation.verdict === "OK" && parsed.data.amountIDR <= autoApproveCap && balance >= parsed.data.amountIDR) {
    status = ReimbursementStatus.AUTO_APPROVED;
  } else {
    status = ReimbursementStatus.PENDING_ADMIN_REVIEW;
  }

  const created = await prisma.$transaction(async (tx) => {
    const r = await tx.reimbursement.create({
      data: {
        umkmId: umkm.id,
        amountIDR: BigInt(parsed.data.amountIDR),
        category: parsed.data.category,
        supplier: parsed.data.supplier,
        description: parsed.data.description,
        invoiceUrl: parsed.data.invoiceFileName ?? null,
        refPriceIDR: BigInt(Math.round(validation.refPriceIDR)),
        deltaPct: validation.deltaPct,
        verdict: validation.verdict,
        status,
        resolvedAt: status === ReimbursementStatus.AUTO_APPROVED ? new Date() : null,
      },
    });

    if (status === ReimbursementStatus.AUTO_APPROVED) {
      await tx.bankAccount.update({
        where: { id: umkm.bankAccount!.id },
        data: { balanceIDR: { decrement: BigInt(parsed.data.amountIDR) } },
      });
      await tx.transaction.create({
        data: {
          bankAccountId: umkm.bankAccount!.id,
          amountIDR: BigInt(parsed.data.amountIDR),
          kind: TxnKind.OUTFLOW,
          channel: "Reimbursement",
          counterparty: parsed.data.supplier ?? "Supplier (Reimbursement)",
          note: `Reimbursement ${parsed.data.category} · ${parsed.data.description.slice(0, 80)}`,
        },
      });
      await tx.reimbursement.update({
        where: { id: r.id },
        data: { status: ReimbursementStatus.DISBURSED },
      });
    }

    return r;
  });

  revalidatePath("/umkm/reimbursement");
  revalidatePath("/umkm/dashboard");
  return { ok: true as const, status, validation, id: created.id };
}

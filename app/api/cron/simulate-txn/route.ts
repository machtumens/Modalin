import { NextResponse } from "next/server";
import { TxnKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const inflowChannels = ["QRIS", "Transfer", "QRIS"];
const outflowChannels = ["Supplier", "Payroll", "Utility", "Logistik"];
const inflowParties = [
  "Pelanggan QRIS Jakarta",
  "Toko Mitra Niaga",
  "Reseller Bandung",
  "Marketplace Tokobaru",
];
const outflowParties = [
  "PT Bahan Baku Indo",
  "Payroll Operasional",
  "PLN Pascabayar",
  "JNE Express",
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.CRON_SECRET && auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.bankAccount.findMany({ select: { id: true } });
  if (!accounts.length) return NextResponse.json({ inserted: 0 });

  const rows = accounts.map((a) => {
    const inflow = Math.random() < 0.6;
    const amountIDR = BigInt(Math.round(Math.pow(10, 4 + Math.random() * 3)));
    return {
      bankAccountId: a.id,
      kind: inflow ? TxnKind.INFLOW : TxnKind.OUTFLOW,
      amountIDR,
      channel: inflow ? randPick(inflowChannels) : randPick(outflowChannels),
      counterparty: inflow ? randPick(inflowParties) : randPick(outflowParties),
      ts: new Date(),
    };
  });
  await prisma.transaction.createMany({ data: rows });

  for (const r of rows) {
    if (r.kind === TxnKind.OUTFLOW) {
      await prisma.bankAccount.update({
        where: { id: r.bankAccountId },
        data: { balanceIDR: { decrement: r.amountIDR } },
      });
    } else {
      await prisma.bankAccount.update({
        where: { id: r.bankAccountId },
        data: { balanceIDR: { increment: r.amountIDR } },
      });
    }
  }

  return NextResponse.json({ inserted: rows.length });
}

export const POST = GET;

"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  umkmId: z.string().min(1),
  body: z.string().min(2).max(1000),
});

export async function postCommunityMessage(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user) return { ok: false as const, error: "Unauthorized" };
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Input tidak valid." };

  if (session.user.role === "INVESTOR") {
    const eq = await prisma.investment.aggregate({
      where: { investorId: session.user.id, umkmId: parsed.data.umkmId },
      _sum: { equityPct: true },
    });
    if ((eq._sum.equityPct ?? 0) < 5) {
      return { ok: false as const, error: "Akses komunitas membutuhkan kepemilikan ≥5%." };
    }
  } else if (session.user.role === "UMKM") {
    const owned = await prisma.uMKM.findFirst({
      where: { id: parsed.data.umkmId, ownerId: session.user.id },
      select: { id: true },
    });
    if (!owned) return { ok: false as const, error: "Bukan UMKM milik Anda." };
  } else {
    return { ok: false as const, error: "Akses ditolak." };
  }

  await prisma.communityPost.create({
    data: {
      umkmId: parsed.data.umkmId,
      authorId: session.user.id,
      body: parsed.data.body,
    },
  });
  revalidatePath(`/investor/community/${parsed.data.umkmId}`);
  return { ok: true as const };
}

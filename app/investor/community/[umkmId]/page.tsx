import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { postCommunityMessage } from "@/actions/community";

export const dynamic = "force-dynamic";

export default async function CommunityRoom({ params }: { params: Promise<{ umkmId: string }> }) {
  const session = await requireRole("INVESTOR");
  const { umkmId } = await params;

  const equity = await prisma.investment.aggregate({
    where: { investorId: session.user.id, umkmId },
    _sum: { equityPct: true },
  });
  const eq = equity._sum.equityPct ?? 0;

  const u = await prisma.uMKM.findUnique({
    where: { id: umkmId },
    include: { owner: { select: { name: true } } },
  });
  if (!u) notFound();

  if (eq < 5) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="font-display text-2xl font-bold">Akses Terkunci</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Kepemilikan Anda di {u.name} saat ini <span className="font-semibold">{eq.toFixed(2)}%</span>. Tingkatkan ke ≥5% untuk akses Modalin Community.
            </p>
            <div className="mt-5">
              <Button asChild><Link href={`/marketplace/${umkmId}`}>Tambah investasi</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const posts = await prisma.communityPost.findMany({
    where: { umkmId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { author: { select: { name: true, role: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/investor/community" className="text-sm text-brand-700 hover:underline">← Komunitas</Link>
      <header className="mt-3">
        <h1 className="font-display text-3xl font-bold">{u.name} · Komunitas</h1>
        <p className="mt-1 text-sm text-zinc-500">Pendiri {u.owner.name} · Kepemilikan Anda {eq.toFixed(2)}%</p>
      </header>

      <form
        action={async (formData) => {
          "use server";
          const body = String(formData.get("body") ?? "");
          await postCommunityMessage({ umkmId, body });
        }}
        className="mt-6 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <textarea
          name="body"
          required
          minLength={2}
          maxLength={1000}
          placeholder="Tulis pertanyaan, ide, atau update..."
          className="h-24 w-full resize-none rounded-md border border-zinc-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <div className="mt-3 flex justify-end">
          <Button type="submit" size="sm">Kirim</Button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-zinc-500">
              Belum ada percakapan. Mulai diskusi dengan pendiri.
            </CardContent>
          </Card>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-zinc-900">{p.author.name}</span>
                {p.author.role === "UMKM" && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Pendiri</span>
                )}
                <span className="text-zinc-500">· {p.createdAt.toLocaleString("id-ID")}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{p.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

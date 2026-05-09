import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/role";
import { getUMKM, aggregateHoldings, getCommunityPosts } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityRoomClient } from "@/components/investor/community-room-client";

export const dynamic = "force-dynamic";

export default async function CommunityRoom({ params }: { params: Promise<{ umkmId: string }> }) {
  const { demoUserId } = await requireRole("INVESTOR");
  const { umkmId } = await params;
  const u = getUMKM(umkmId);
  if (!u) notFound();
  const seedEquity = aggregateHoldings(demoUserId).find((h) => h.umkmId === umkmId)?.equityPct ?? 0;
  const posts = getCommunityPosts(umkmId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/investor/community" className="text-sm text-brand-700 hover:underline">← Komunitas</Link>
      <CommunityRoomClient
        umkmId={umkmId}
        umkmName={u.name}
        ownerName={u.ownerName}
        seedEquity={seedEquity}
        posts={posts}
      />
      {posts.length === 0 && (
        <Card className="mt-6">
          <CardContent className="py-10 text-center text-sm text-zinc-500">
            Belum ada percakapan di komunitas ini.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

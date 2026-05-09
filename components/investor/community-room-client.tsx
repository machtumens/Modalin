"use client";
import Link from "next/link";
import { useState } from "react";
import { useDemoStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Post = {
  id: string;
  authorName: string;
  authorRole: "UMKM" | "INVESTOR";
  body: string;
  createdAt: string;
};

export function CommunityRoomClient({
  umkmId,
  umkmName,
  ownerName,
  seedEquity,
  posts,
}: {
  umkmId: string;
  umkmName: string;
  ownerName: string;
  seedEquity: number;
  posts: Post[];
}) {
  const clientEquity = useDemoStore((s) => s.investments.filter((i) => i.umkmId === umkmId).reduce((sum, i) => sum + i.equityPct, 0));
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState("");

  const totalEquity = seedEquity + clientEquity;

  if (totalEquity < 5) {
    return (
      <Card className="mt-3">
        <CardContent className="py-12 text-center">
          <h1 className="font-display text-2xl font-bold text-white">Akses Terkunci</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Kepemilikan Anda di {umkmName}: <span className="font-semibold text-white">{totalEquity.toFixed(2)}%</span>. Tingkatkan ke ≥5% untuk akses.
          </p>
          <div className="mt-5">
            <Button asChild><Link href={`/marketplace/${umkmId}`}>Tambah investasi</Link></Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  function send() {
    if (!draft.trim()) return;
    setLocalPosts((cur) => [
      {
        id: `local-${Date.now()}`,
        authorName: "Anda",
        authorRole: "INVESTOR",
        body: draft,
        createdAt: new Date().toISOString(),
      },
      ...cur,
    ]);
    setDraft("");
  }

  const allPosts = [...localPosts, ...posts];

  return (
    <>
      <header className="mt-3">
        <h1 className="font-display text-3xl font-bold text-white">{umkmName} · Komunitas</h1>
        <p className="mt-1 text-sm text-zinc-400">Pendiri {ownerName} · Kepemilikan Anda {totalEquity.toFixed(2)}%</p>
      </header>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tulis pertanyaan atau ide..."
          className="h-24 w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={send} size="sm">Kirim</Button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {allPosts.map((p) => (
          <article key={p.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-white">{p.authorName}</span>
              {p.authorRole === "UMKM" && <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-gold-300 ring-1 ring-inset ring-gold-400/30">Pendiri</span>}
              <span className="text-zinc-400">· {new Date(p.createdAt).toLocaleString("id-ID")}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{p.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}

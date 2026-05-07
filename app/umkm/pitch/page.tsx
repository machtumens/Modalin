import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PitchForm } from "@/components/umkm/pitch-form";

export const dynamic = "force-dynamic";

export default async function UMKMPitchPage() {
  const session = await requireRole("UMKM");
  const u = await prisma.uMKM.findFirst({
    where: { ownerId: session.user.id },
    include: { pitch: true },
  });
  if (!u) return <div className="p-10 text-center text-sm text-zinc-500">UMKM tidak ditemukan.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Edit Pitch</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Status pitch: <span className="font-mono">{u.pitch?.status}</span>. Pengajuan ulang akan masuk antrian admin.
      </p>
      <PitchForm
        defaults={{
          story: u.story,
          fundingTargetIDR: Number(u.fundingTargetIDR),
          equityOfferedPct: u.equityOfferedPct,
          deadlineDays: u.pitch
            ? Math.max(7, Math.ceil((u.pitch.deadline.getTime() - Date.now()) / 86_400_000))
            : 30,
          syariahCompliant: u.syariahCompliant,
        }}
      />
    </div>
  );
}

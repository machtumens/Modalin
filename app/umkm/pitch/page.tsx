import { requireRole } from "@/lib/role";
import { getOwnedUMKM, getPitch } from "@/lib/data";
import { PitchForm } from "@/components/umkm/pitch-form";

export const dynamic = "force-dynamic";

export default async function UMKMPitchPage() {
  const { demoUserId } = await requireRole("UMKM");
  const u = getOwnedUMKM(demoUserId);
  if (!u) return <div className="p-10 text-center text-sm text-zinc-500">UMKM tidak ditemukan.</div>;
  const pitch = getPitch(u.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Edit Pitch</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Status pitch: <span className="font-mono">{pitch?.status}</span>. Demo prototype — perubahan disimpan di browser localStorage.
      </p>
      <PitchForm
        defaults={{
          story: u.story,
          fundingTargetIDR: u.fundingTargetIDR,
          equityOfferedPct: u.equityOfferedPct,
          deadlineDays: pitch
            ? Math.max(7, Math.ceil((new Date(pitch.deadline).getTime() - Date.now()) / 86_400_000))
            : 30,
          syariahCompliant: u.syariahCompliant,
        }}
      />
    </div>
  );
}

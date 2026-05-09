import { requireRole } from "@/lib/role";
import { ReimbursementForm } from "@/components/umkm/reimbursement-form";

export const dynamic = "force-dynamic";

export default async function NewReimbursementPage() {
  await requireRole("UMKM");
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Pencairan Reimbursement</h1>
      <p className="mt-2 text-sm text-zinc-600">
        AI memvalidasi harga supplier vs harga pasar. Pengajuan ≤ Rp5jt yang lulus validasi otomatis cair.
      </p>
      <ReimbursementForm />
    </div>
  );
}

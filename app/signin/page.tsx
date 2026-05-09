import Link from "next/link";
import { redirect } from "next/navigation";
import { setRole, getRole } from "@/lib/role";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const personas = [
  { role: "INVESTOR" as const, id: "u-andi-inv", name: "Andi Investor", desc: "Browse marketplace, invest, lihat live transaksi UMKM, akses Modalin Community." },
  { role: "UMKM" as const, id: "u-umkm-1", name: "Andi Pratama (Kopi Tani Toraja)", desc: "Modalin Bank Account, AI score, ajukan reimbursement, edit pitch." },
  { role: "ADMIN" as const, id: "u-admin", name: "Admin Modalin", desc: "Curation queue, override AI score, approve payouts, platform metrics." },
];

export default async function SigninPage() {
  const existing = await getRole();
  if (existing) redirect(`/${existing.toLowerCase()}/dashboard`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Pilih persona demo</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Prototype klikable. Tidak ada password — pilih peran untuk mulai eksplorasi.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {personas.map((p) => (
          <form
            key={p.role}
            action={async () => {
              "use server";
              await setRole(p.role, p.id);
              redirect(`/${p.role.toLowerCase()}/dashboard`);
            }}
          >
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">{p.role}</div>
                <CardTitle className="mt-1 text-lg">{p.name}</CardTitle>
                <CardDescription className="mt-2">{p.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="submit" className="w-full">Masuk sebagai {p.role}</Button>
              </CardContent>
            </Card>
          </form>
        ))}
      </div>
      <div className="mt-8 text-center text-xs text-zinc-500">
        <Link href="/" className="hover:text-brand-700">← Kembali ke beranda</Link>
      </div>
    </div>
  );
}

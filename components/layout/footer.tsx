import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-zinc-800/80 bg-zinc-950">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Logo size="md" withTagline />
            <p className="mt-3 max-w-xs text-sm text-zinc-400">
              Equity crowdfunding pertama Indonesia yang terintegrasi dengan rekening bank UMKM.
              Modal tumbuh, akses terbuka.
            </p>
          </div>
          <FooterCol title="Produk" links={[
            { href: "/marketplace", label: "Marketplace" },
            { href: "/untuk-umkm", label: "Untuk UMKM" },
            { href: "/untuk-investor", label: "Untuk Investor" },
            { href: "/mitra-bpr", label: "Mitra BPR" },
          ]} />
          <FooterCol title="Perusahaan" links={[
            { href: "/tentang", label: "Tentang" },
            { href: "/faq", label: "FAQ" },
          ]} />
          <FooterCol title="Legal" links={[
            { href: "/legal/tos", label: "Syarat Layanan" },
            { href: "/legal/privasi", label: "Privasi" },
            { href: "/legal/risiko", label: "Disclaimer Risiko" },
          ]} />
        </div>
        <div className="mt-10 border-t border-zinc-800 pt-6 text-xs text-zinc-500">
          Modalin adalah prototype demo. Bukan platform finansial yang berizin OJK saat ini.
        </div>
        <div className="mt-2 text-xs text-zinc-600">
          © {new Date().getFullYear()} Modalin. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-zinc-400 transition-colors hover:text-brand-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

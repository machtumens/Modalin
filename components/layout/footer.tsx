import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-3 text-sm text-zinc-600 max-w-xs">
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
        <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          Modalin adalah prototype demo. Bukan platform finansial yang berizin OJK saat ini.
        </div>
        <div className="mt-2 text-xs text-zinc-400">
          © {new Date().getFullYear()} Modalin. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-zinc-600 hover:text-brand-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

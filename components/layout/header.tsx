import Link from "next/link";
import { Logo } from "./logo";
import { AuthState } from "./auth-state";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Modalin home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/" className="text-zinc-700 hover:text-brand-700">Beranda</Link>
            <Link href="/marketplace" className="text-zinc-700 hover:text-brand-700">Marketplace</Link>
            <Link href="/untuk-umkm" className="text-zinc-700 hover:text-brand-700">Untuk UMKM</Link>
            <Link href="/untuk-investor" className="text-zinc-700 hover:text-brand-700">Untuk Investor</Link>
            <Link href="/tentang" className="text-zinc-700 hover:text-brand-700">Tentang</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <AuthState />
        </div>
      </div>
    </header>
  );
}

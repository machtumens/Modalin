import Link from "next/link";
import { Logo } from "./logo";
import { AuthState } from "./auth-state";
import { HeaderShell } from "./header-shell";

export function Header() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Modalin home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/" className="text-zinc-300 transition-colors hover:text-brand-400">Beranda</Link>
            <Link href="/marketplace" className="text-zinc-300 transition-colors hover:text-brand-400">Marketplace</Link>
            <Link href="/untuk-umkm" className="text-zinc-300 transition-colors hover:text-brand-400">Untuk UMKM</Link>
            <Link href="/untuk-investor" className="text-zinc-300 transition-colors hover:text-brand-400">Untuk Investor</Link>
            <Link href="/tentang" className="text-zinc-300 transition-colors hover:text-brand-400">Tentang</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <AuthState />
        </div>
      </div>
    </HeaderShell>
  );
}

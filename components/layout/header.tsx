import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { AuthState } from "./auth-state";

export async function Header() {
  const t = await getTranslations("Nav");
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Modalin home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/" className="text-zinc-700 hover:text-brand-700">{t("home")}</Link>
            <Link href="/marketplace" className="text-zinc-700 hover:text-brand-700">{t("marketplace")}</Link>
            <Link href="/untuk-umkm" className="text-zinc-700 hover:text-brand-700">{t("forUMKM")}</Link>
            <Link href="/untuk-investor" className="text-zinc-700 hover:text-brand-700">{t("forInvestor")}</Link>
            <Link href="/tentang" className="text-zinc-700 hover:text-brand-700">{t("about")}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <AuthState />
        </div>
      </div>
    </header>
  );
}

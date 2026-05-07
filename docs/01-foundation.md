# Phase 1 — Foundation

## Scope
Bootstrap Next.js 15 app, install full stack, set up Auth, DB schema, seed script, design tokens, base layout, i18n skeleton, money utility, RBAC helpers. No business pages yet — just the platform shell that later phases plug into.

## Deliverables
- Next.js 15 + TS + Tailwind v4 app builds and runs
- shadcn/ui initialized with neutral + brand tokens
- Auth.js credentials provider with 3 roles seeded (UMKM/INVESTOR/ADMIN)
- Prisma schema for all core entities (see 00-PLAN)
- Supabase Postgres connected, migrations applied, seed script populates 12 UMKM + 3 investors + 1 admin + 60 days txns each
- next-intl wired for `id-ID` (default) and `en-US`
- `lib/money.ts` IDR formatter, `lib/rbac.ts` role guard middleware
- Root layout with header (logo, locale switch, auth state) and footer
- `.env.example` documenting all required vars
- README with `pnpm dev`, `pnpm db:seed`, `pnpm db:reset`

## Brand tokens
- Primary: deep emerald `#0F766E` (trust + Islamic-finance neutral)
- Accent: warm gold `#F59E0B` (capital, growth)
- Neutral grayscale via Tailwind `zinc`
- Typography: Inter (UI), Plus Jakarta Sans (display)

## Folder skeleton
See 00-PLAN architecture section. Create empty route groups now; phases 2–5 fill them.

---

## Prompt for executing agent

> You are bootstrapping the Modalin prototype. Working directory is `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`. The directory is empty except for `docs/`.
>
> Initialize a Next.js 15 App Router project with TypeScript, Tailwind v4, ESLint, and pnpm. Install: `@auth/core`, `next-auth@beta`, `@prisma/client`, `prisma`, `zod`, `react-hook-form`, `@hookform/resolvers`, `zustand`, `@tanstack/react-query`, `@tanstack/react-table`, `framer-motion`, `lucide-react`, `recharts`, `@tremor/react`, `next-intl`, `react-leaflet`, `leaflet`, `clsx`, `tailwind-merge`, `class-variance-authority`. Init shadcn/ui with the tokens in this MD (emerald primary `#0F766E`, gold accent `#F59E0B`, Inter + Plus Jakarta Sans). Add components: button, card, input, label, dialog, sheet, dropdown-menu, table, badge, tabs, toast, avatar, select, form.
>
> Create `prisma/schema.prisma` with the data model in `docs/00-PLAN.md` § Data Model. Use `provider = "postgresql"` and `DATABASE_URL` from env. Add a `prisma/seed.ts` that creates: 1 admin (`admin@modalin.id`), 3 investors (`andi@inv.id`, `siti@inv.id`, `rahmat@inv.id`), 12 UMKM founders + 12 UMKM businesses across sectors F&B, retail, agri, services with realistic Indonesian names, locations across Java + Sumatra + Sulawesi, monthly revenue Rp30–300 jt, ageMonths 12–36, fundingTarget Rp50–500 jt, story 2–3 paragraphs, aiScore 55–88. For each UMKM create a `BankAccount` and 60 days of `Transaction` rows mixing INFLOW/OUTFLOW with realistic channels (QRIS, transfer, payroll, supplier). All passwords seeded as `Demo123!` with bcrypt.
>
> Configure Auth.js credentials provider reading from Prisma. Session strategy `jwt`. Role on session. Add `lib/rbac.ts` exporting `requireRole(role: 'UMKM'|'INVESTOR'|'ADMIN')` server helper that redirects non-matching users.
>
> Add `lib/money.ts` exporting `formatIDR(n: number)` using `Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0})` and `formatIDRCompact(n)` returning `Rp1,2 jt` / `Rp24,5 mlr` style.
>
> Configure next-intl with `id` (default) and `en` locales, messages in `messages/id.json` and `messages/en.json`, middleware for locale detection. Wrap root layout.
>
> Build the root layout: top nav with Modalin logo (text wordmark for now, emerald + gold gradient), nav links (Beranda, Marketplace, Untuk UMKM, Untuk Investor, Tentang), locale switcher, auth state (Masuk / avatar dropdown). Footer with 4 columns (Produk, Perusahaan, Legal, Kontak) and OJK disclaimer placeholder.
>
> Add empty route group folders: `app/(marketing)`, `app/(auth)`, `app/(investor)`, `app/(umkm)`, `app/(admin)`. Each gets a placeholder `page.tsx` rendering its name, so routing is verifiable.
>
> Write `.env.example` with `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Write a README with setup, seed, and dev commands.
>
> Verify: `pnpm dev` boots, `/` renders the placeholder marketing page with header and footer, `/en` switches locale, `pnpm db:seed` populates Supabase, signing in as `admin@modalin.id` lands on `/admin` placeholder.

# Module 1 Prompt — Foundation

You are bootstrapping the Modalin prototype (an early-growth Equity Crowdfunding + integrated UMKM digital banking platform for Indonesia). Working directory is `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`. Read `docs/00-PLAN.md` and `docs/01-foundation.md` before starting.

## Tasks

1. Initialize Next.js 15 App Router project with TypeScript, Tailwind v4, ESLint, pnpm.
2. Install dependencies: `next-auth@beta`, `@auth/prisma-adapter`, `@prisma/client`, `prisma`, `zod`, `react-hook-form`, `@hookform/resolvers`, `zustand`, `@tanstack/react-query`, `@tanstack/react-table`, `framer-motion`, `lucide-react`, `recharts`, `@tremor/react`, `next-intl`, `react-leaflet`, `leaflet`, `clsx`, `tailwind-merge`, `class-variance-authority`, `bcryptjs`, `@supabase/supabase-js`, `canvas-confetti`, `react-markdown`.
3. Initialize shadcn/ui with brand tokens — primary emerald `#0F766E`, accent gold `#F59E0B`, neutral zinc, fonts Inter (UI) + Plus Jakarta Sans (display). Add components: `button card input label dialog sheet dropdown-menu table badge tabs toast avatar select form drawer popover calendar slider checkbox switch tooltip hover-card form`.
4. Create `prisma/schema.prisma` with the data model from `docs/00-PLAN.md` § Data Model. Provider `postgresql`. Use `DATABASE_URL` and `DIRECT_URL`.
5. Write `prisma/seed.ts`:
   - 1 admin (`admin@modalin.id`)
   - 3 investors (`andi@inv.id`, `siti@inv.id`, `rahmat@inv.id`)
   - 12 UMKM founders + 12 UMKM businesses across F&B / retail / agri / services
   - Realistic Indonesian names + locations across Java, Sumatra, Sulawesi
   - monthlyRevenue Rp30–300 jt, ageMonths 12–36, fundingTarget Rp50–500 jt
   - 2–3 paragraph stories, aiScore 55–88, syariahCompliant ~70% true
   - One BankAccount per UMKM, 60 days of mixed INFLOW/OUTFLOW Transactions (channels: QRIS, transfer, payroll, supplier, utility)
   - Passwords bcrypt-hashed, all `Demo123!`
6. Configure Auth.js credentials provider reading from Prisma. Session strategy `jwt`. Role on session token + augment `next-auth` types.
7. Add `lib/rbac.ts` with `requireRole(role: 'UMKM'|'INVESTOR'|'ADMIN')` server helper that redirects non-matching users to `/signin`.
8. Add `lib/money.ts` exporting `formatIDR(n)` (full IDR via `Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0})`) and `formatIDRCompact(n)` returning `Rp1,2 jt` / `Rp24,5 mlr`.
9. Configure next-intl: locales `id` (default) + `en`, messages in `messages/id.json` + `messages/en.json`, `middleware.ts` for locale detection, root layout wraps `NextIntlClientProvider`.
10. Build root layout: top nav (Modalin wordmark with emerald→gold gradient, links Beranda · Marketplace · Untuk UMKM · Untuk Investor · Tentang, locale switcher, auth state Masuk/avatar dropdown), footer (4 columns Produk / Perusahaan / Legal / Kontak + OJK disclaimer placeholder).
11. Create empty route group placeholders: `app/(marketing)/page.tsx`, `app/(auth)/signin/page.tsx`, `app/(investor)/dashboard/page.tsx`, `app/(umkm)/dashboard/page.tsx`, `app/(admin)/dashboard/page.tsx`. Each renders its name.
12. Write `.env.example` documenting `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `CRON_SECRET`.
13. Write `README.md` with setup, seed, dev commands.

## Verification
- `pnpm dev` boots
- `/` renders marketing placeholder with header + footer
- `/en` switches locale
- `pnpm db:seed` populates Postgres
- Sign in as `admin@modalin.id` lands on `/admin/dashboard` placeholder
- Sign in as `andi@inv.id` lands on `/investor/dashboard` placeholder
- Sign in as a UMKM founder lands on `/umkm/dashboard` placeholder

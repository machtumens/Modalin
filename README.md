# Modalin — Static Prototype

Indonesia's first equity-crowdfunding platform integrated with UMKM digital banking. **Clickable demo prototype, not a real platform.**

No database. No real auth. No payments. All data is hardcoded in `data/seed.ts` and user actions persist to browser localStorage via Zustand.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Framer Motion · Tremor · Zustand · react-leaflet · shadcn-style UI primitives.

Zero external services. Vercel-deployable as-is.

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Demo personas

Visit `/signin` and pick:

| Role | Persona | Sees |
|------|---------|------|
| INVESTOR | Andi Investor (`u-andi-inv`) | Dashboard, portfolio, live activity, Index Fund, Community access for UMKM with ≥5% holding |
| UMKM | Andi Pratama (`Kopi Tani Toraja`, `u-umkm-1`) | Modalin Bank Account view, transactions, AI score, edit pitch, ajukan reimbursement |
| ADMIN | Admin Modalin (`u-admin`) | Curation queue, AI score override (demo no-op), payout approval queue, platform metrics |

No password. Cookie-based role switch. Click "Keluar" in header to reset.

## Demo path

1. `/` landing → `/marketplace` → click any UMKM
2. Slide ticket to Rp200k → konfirmasi → confetti success
3. `/investor/dashboard` shows new investment in portfolio + live activity feed (synthetic transactions every 8s)
4. `/investor/index-fund` slide to Rp10jt + Balanced strategy → invest → 15 UMKM auto-allocated
5. Switch to UMKM persona → `/umkm/reimbursement/new` → category Laptop, jumlah Rp7,5jt → AI verdict OK → DISBURSED
6. Try Marketing digital Rp30jt → AI verdict OVER → BLOCKED_PRICE_CHECK
7. Switch to Admin → `/admin/payouts` → see blocked entry; `/admin/umkm` → all approved seed pitches

## Project structure

```
app/             # All routes (marketing, signin, marketplace, role dashboards)
components/      # UI primitives + layout + marketing sections + per-domain components
data/seed.ts     # Hardcoded UMKM, transactions, investments, posts (deterministic PRNG)
lib/
  data.ts        # Server-side query helpers reading seed
  store.ts       # Zustand store persisted to localStorage (invest + reimburse mutations)
  role.ts        # Cookie-based fake auth (no password)
  enums.ts       # String-const enum types (Role / Sector / TxnKind / etc)
  ai/scorer.ts   # Rule-based AI score (SLIK + e-com + behavior + revenue/age + sector)
  ai/price-validator.ts  # Reimbursement price validation vs hardcoded ref table
  money.ts       # IDR formatters
content/legal/   # Markdown for /legal/[slug]
docs/            # Original 5-module plan + architecture
prompts/         # Build prompts (historical)
```

## What's NOT here (intentional)

- No Prisma, SQLite, Postgres
- No NextAuth / Auth.js
- No `/api/*` routes (all data lives client-/server-side via direct seed import)
- No cron job (live feed is client setInterval)
- No middleware
- No i18n routing (Indonesian only)

## Deploy

```bash
vercel --prod
```

Zero env vars required. Build is pure static + RSC.

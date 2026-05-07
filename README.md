# Modalin — Dynamic Prototype

Indonesia's first equity-crowdfunding platform integrated with UMKM digital banking. This repo is a clickable, data-backed prototype — not a production system.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · shadcn-style UI · Framer Motion · Tremor · TanStack Query/Table · Zustand · Auth.js v5 · Prisma + Postgres (Supabase) · Supabase Realtime · next-intl · react-leaflet.

## Build phases (one per module)

| Module | Doc | Prompt | Scope |
|--------|-----|--------|-------|
| 1 | `docs/01-foundation.md` | `prompts/01-foundation.prompt.md` | Init, Auth, DB, design system, layout |
| 2 | `docs/02-marketing.md` | `prompts/02-marketing.prompt.md` | Public landing + sub-pages + BPR map |
| 3 | `docs/03-marketplace.md` | `prompts/03-marketplace.prompt.md` | ECF listing + detail + AI score + invest |
| 4 | `docs/04-investor-dashboard.md` | `prompts/04-investor-dashboard.prompt.md` | Portfolio + live txn + Index Fund + Community |
| 5 | `docs/05-umkm-and-admin.md` | `prompts/05-umkm-and-admin.prompt.md` | UMKM bank + reimbursement + admin |

See [`docs/00-PLAN.md`](docs/00-PLAN.md) for full architecture and data model.

## Setup

```bash
pnpm install
cp .env.example .env
# fill DATABASE_URL, DIRECT_URL, AUTH_SECRET, NEXT_PUBLIC_SUPABASE_*
pnpm db:push
pnpm db:seed
pnpm dev
```

Open http://localhost:3000.

## Demo accounts

Password for all: **`Demo123!`**

| Email | Role |
|-------|------|
| `admin@modalin.id` | Admin |
| `andi@inv.id` | Investor |
| `siti@inv.id` | Investor |
| `rahmat@inv.id` | Investor |
| `andi.kopitani@umkm.id` | UMKM founder (Kopi Tani Toraja) |
| `siti.sari@umkm.id` | UMKM founder (Sari Kemasan Nusantara) |
| ... 10 more UMKM founders | UMKM |

## Scripts

```bash
pnpm dev          # next dev
pnpm build        # next build
pnpm db:generate  # prisma generate
pnpm db:push      # push schema to DB (dev)
pnpm db:migrate   # create migration
pnpm db:seed      # seed demo data
pnpm db:reset     # nuke + reseed
```

## Status

Module 1 complete. Modules 2–5 pending — run their prompts in `prompts/` sequentially.

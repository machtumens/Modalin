# Phase 4 — Investor Dashboard

## Scope
Logged-in investor home. Surfaces portfolio, live UMKM bank-account transaction stream (the Modalin moat), Index Fund auto-diversifier, and Modalin Community (gated by ≥5% equity). This is where information-asymmetry elimination is demonstrated to investors and OJK.

## Pages
- `/(investor)/dashboard` — overview
- `/(investor)/portfolio` — full holdings table
- `/(investor)/portfolio/[umkmId]` — single UMKM deep-dive (live txn feed)
- `/(investor)/index-fund` — Modalin Index Fund simulator
- `/(investor)/community` — list of UMKMs investor has community access to
- `/(investor)/community/[umkmId]` — gated feed + founder Q&A

## Dashboard overview sections
1. Greeting + total invested + total equity-weighted value (mock +/- vs invested)
2. KPI cards: Total Invested, Active UMKM, Avg AI Score, Community Access count
3. Tremor `AreaChart` portfolio value 90 days (mocked walk)
4. Live Activity Feed (Realtime): newest 20 transactions across all invested UMKM, auto-prepending
5. Holdings table (top 5 by value) with link to deep-dive
6. Suggested UMKM strip (3 highest AI score not-yet-invested)

## Live transaction stream
- Subscribe to Supabase Realtime channel `txn:investor:{userId}` filtered to UMKM the investor holds
- Server cron / route handler `/api/cron/simulate-txn` (Vercel cron every 60s) inserts a randomized `Transaction` for each active UMKM and broadcasts via Realtime
- Client uses TanStack Query + Realtime subscription, optimistic prepend, fade-in animation
- Each row shows: timestamp (relative + absolute on hover), UMKM avatar + name, channel badge (QRIS/transfer/payroll), amount in green (inflow) / red (outflow), counterparty (anonymized for non-community-access UMKM as `Pelanggan #1234`)

## Single-UMKM deep-dive
- Tabs: Overview · Live Bank · AI Score · Q&A · Dokumen
- Live Bank tab: full filterable transaction table (TanStack Table), date range picker, channel filter, export CSV (only available for ≥5% holders)
- "Anda memiliki X% — akses Komunitas tersedia" banner if equity ≥ 5%

## Modalin Index Fund
- Headline: "Diversifikasi otomatis ke 10–20 UMKM terkurasi"
- Slider: investment amount Rp1jt–Rp100jt
- Strategy selector: Conservative (AI ≥ 80, mature sector) / Balanced (AI ≥ 70) / Growth (AI ≥ 60, early-stage)
- Live preview pie chart of allocation across selected UMKM (Tremor `DonutChart`)
- Projected blended ROI band (mock)
- "Investasikan via Index Fund" → confirm → creates N `Investment` rows + `IndexFundHolding` rows

## Modalin Community
- Listing: cards of UMKM where investor's equity ≥ 5%
- Detail: Founder updates feed (text + image), exclusive metrics (next-quarter forecast, named customers), threaded discussion. Anyone <5% sees gated empty state with "Tingkatkan kepemilikan ke 5% untuk akses"

---

## Prompt for executing agent

> Phases 1–3 done. Read `docs/00-PLAN.md` and `docs/04-investor-dashboard.md`. Working dir `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`.
>
> Build the investor area exactly per `docs/04-investor-dashboard.md`. All routes under `app/(investor)/` are guarded by `requireRole('INVESTOR')` from `lib/rbac.ts`.
>
> Build the live transaction stream first — it's the demo's hero feature.
>
> 1. Add Vercel cron config `vercel.json` with one cron `*/1 * * * *` hitting `/api/cron/simulate-txn`. The handler iterates active UMKM, generates a randomized `Transaction` (60% INFLOW with channel QRIS/transfer; 40% OUTFLOW with channel supplier/payroll/utility, amount Rp10k–Rp5jt log-distributed), inserts via Prisma, then publishes to Supabase Realtime channel `public:Transaction` (Realtime is enabled on the table via Supabase migration). Protect the route with `CRON_SECRET` header check.
>
> 2. Client subscription: a `useTransactionStream(investorId)` hook using `@supabase/supabase-js` v2 client that subscribes to inserts on `Transaction` filtered to UMKM ids the investor holds. Combine with a TanStack Query initial fetch of the 20 most recent.
>
> 3. `LiveActivityFeed` component renders an animated list (Framer Motion `AnimatePresence`, layout animations). Prepended rows fade in from top. Cap at 50 rows in DOM.
>
> Build the dashboard overview page combining: greeting (`getServerSession`), KPI cards (Tremor `Card`), 90-day portfolio area chart (mock walk seeded by user id for stable demo), `LiveActivityFeed`, top-5 holdings table, suggested UMKM strip (server query: top 3 by aiScore not in user's investments).
>
> Build `/portfolio` (full holdings TanStack Table) and `/portfolio/[umkmId]` deep-dive with the 5 tabs. Live Bank tab: TanStack Table over Transactions with date-range picker (shadcn `Calendar` + `Popover`), channel multi-select. CSV export button visible only when computed equity ≥ 5% — server action streams CSV.
>
> Build `/index-fund` simulator. Strategy selector pre-filters UMKM by aiScore threshold. On amount change, recompute allocation: weight each candidate UMKM by `aiScore` then take top 15. Render Tremor `DonutChart` of allocation. Confirm CTA opens dialog, server action creates 15 `Investment` + 15 `IndexFundHolding` rows in a transaction.
>
> Build `/community` listing (only UMKM where user equity ≥ 5%, computed via SUM(Investment.equityPct) GROUP BY umkmId). `/community/[umkmId]` server-checks access; if not eligible, render gated state. If eligible, render founder updates feed (seed 3 mock posts per UMKM) and threaded discussion (server action to post + reply).
>
> All counterparty names anonymize to `Pelanggan #${hash(originalName).slice(0,4)}` unless investor has community access for that UMKM.
>
> Verify: signing in as `andi@inv.id` shows dashboard with seeded portfolio; live feed prepends a new row within 60s; deep-diving on an active UMKM shows full transaction table; Index Fund slider at Rp10jt allocates across 15 UMKM with donut summing 100%; community access page is gated for low-equity holdings and unlocked for ≥ 5%.

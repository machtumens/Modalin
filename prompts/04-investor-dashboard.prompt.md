# Module 4 Prompt — Investor Dashboard

Modules 1–3 complete. Working dir `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`. Read `docs/00-PLAN.md` + `docs/04-investor-dashboard.md`.

## Routes (all `requireRole('INVESTOR')`)

- `/investor/dashboard`
- `/investor/portfolio`
- `/investor/portfolio/[umkmId]`
- `/investor/index-fund`
- `/investor/community`
- `/investor/community/[umkmId]`

## Live transaction stream — build first (hero feature)

1. `vercel.json` cron `*/1 * * * *` → `/api/cron/simulate-txn`.
2. Handler iterates active UMKM, generates randomized Transaction:
   - 60% INFLOW (channels QRIS/transfer)
   - 40% OUTFLOW (channels supplier/payroll/utility)
   - amount Rp10k–Rp5jt, log-distributed
3. Insert via Prisma + publish to Supabase Realtime channel `public:Transaction` (Realtime enabled on table).
4. Protect with `CRON_SECRET` header check.
5. Client hook `useTransactionStream(investorId)` using `@supabase/supabase-js` v2 — subscribes to inserts on Transaction filtered by UMKM ids investor holds. TanStack Query for initial fetch of 20 most recent.
6. `LiveActivityFeed` component — Framer Motion `AnimatePresence` + layout animations, fade-in prepend, cap 50 rows in DOM.

## Dashboard overview sections

1. Greeting (`getServerSession`).
2. KPI cards (Tremor): Total Invested · Active UMKM · Avg AI Score · Community Access count.
3. Tremor `AreaChart` portfolio value 90 days (mocked walk seeded by user id for stable demo).
4. `LiveActivityFeed`.
5. Top-5 holdings table.
6. Suggested UMKM strip (top 3 by aiScore not in user investments).

## Portfolio

- `/portfolio` — full holdings TanStack Table.
- `/portfolio/[umkmId]` — 5 tabs: Overview · Live Bank · AI Score · Q&A · Dokumen.
  - Live Bank tab: TanStack Table over Transactions. Date-range picker (shadcn Calendar + Popover). Channel multi-select. CSV export button visible only when computed equity ≥ 5% (server action streams CSV).

## Modalin Index Fund (`/index-fund`)

- Slider Rp1jt → Rp100jt.
- Strategy selector: Conservative (AI ≥ 80, mature sector) · Balanced (AI ≥ 70) · Growth (AI ≥ 60, early-stage).
- On amount/strategy change: filter UMKM by aiScore threshold, weight by aiScore, take top 15.
- Tremor `DonutChart` allocation summing 100%.
- Projected blended ROI band (mock).
- Confirm CTA opens dialog → server action creates 15 `Investment` + 15 `IndexFundHolding` rows in `$transaction`.

## Community

- `/community` lists UMKM where investor equity ≥ 5% (SUM Investment.equityPct GROUP BY umkmId).
- `/community/[umkmId]` server-checks access:
  - Not eligible → gated state "Tingkatkan kepemilikan ke 5% untuk akses".
  - Eligible → founder updates feed (seed 3 mock posts per UMKM) + threaded discussion (server action post + reply).

## Counterparty anonymization

In live feed and bank tabs, counterparty name shown as `Pelanggan #${hash(name).slice(0,4)}` UNLESS investor has community access (≥5%) for that UMKM — then real name shown.

## Verification

- `andi@inv.id` dashboard shows seeded portfolio.
- Live feed prepends new row within 60s of cron tick.
- Deep-dive shows full transaction table.
- Index Fund Rp10jt → 15 UMKM, donut 100%.
- Community gated for low-equity, unlocked for ≥ 5%.

# Modalin — Dynamic Prototype Plan

**Goal:** clickable, data-backed prototype of Modalin — Indonesia's first early-growth ECF + integrated UMKM digital banking platform — to demo to investors, OJK reviewers, and pilot BPR partners.

**Audience of demo:** pre-seed investors, OJK regulators, BPR/bank daerah BD teams, advisor founders.

**Not in scope (prototype):**
- Real KYC / Dukcapil integration
- Real OJK POJK 22/2024 sandbox license
- Real BPR core banking integration
- Real money movement / payment gateway settlement
- Production-grade security audit

**In scope (prototype):**
- All public marketing surfaces
- 3 logged-in roles: UMKM founder, Retail Investor, Admin
- ECF Marketplace with seeded UMKM data + AI scoring display
- Investor Dashboard with live-feel bank transaction stream (mocked)
- Modalin Bank Account UMKM dashboard with reimbursement flow
- Modalin Index Fund auto-diversification simulator
- Modalin Community gated access (≥5% ownership)
- Admin panel: UMKM curation, AI score override, payout approval

## Tech Stack

Frontend: **Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui + Framer Motion + Tremor + TanStack Table + react-leaflet**
Backend: **Next.js Route Handlers + Server Actions + Prisma + Supabase Postgres**
Auth: **Auth.js (credentials + role)**
Realtime: **Supabase Realtime channel for fake transaction stream**
Forms/validation: **React Hook Form + Zod**
State: **Zustand (UI) + TanStack Query (server)**
i18n: **next-intl (id-ID primary, en-US fallback)**
Money: **Intl.NumberFormat('id-ID')**
Mock services: **rule-based AI scorer, fake SLIK lookup, fake e-commerce signal feed, fake open-banking pull**
Deploy: **Vercel + Supabase free tier**

## Architecture

```
app/
  (marketing)/        # public landing, problem, solution, BPR map, FAQ
  (auth)/             # signin, signup, role select
  (investor)/
    dashboard/        # portfolio + live feed
    marketplace/      # ECF listing
    marketplace/[id]  # UMKM detail + invest flow
    index-fund/       # auto-diversifier
    community/        # gated by ≥5% ownership
  (umkm)/
    dashboard/        # Modalin Bank Account view
    pitch/            # create / edit pitch
    reimbursement/    # disbursement requests
  (admin)/
    umkm/             # curation queue
    payouts/          # disbursement approval
    metrics/          # platform AUM, GMV
  api/
    score/            # POST /api/score → AI score
    txn-stream/       # SSE/Realtime hookup
    reimburse/        # POST → AI price-validation
lib/
  ai/scorer.ts        # rule-based score
  ai/price-validator.ts
  money.ts            # IDR formatter
  rbac.ts
prisma/
  schema.prisma
```

## Data Model (core)

- `User` (id, role: UMKM|INVESTOR|ADMIN, email, ...)
- `UMKM` (id, ownerId, name, sector, ageMonths, monthlyRevenue, fundingTarget, valuation, status, aiScore, sliKScore, story, mediaUrls, location)
- `Pitch` (umkmId, equityOffered%, minTicket, deadline, status)
- `Investment` (id, investorId, umkmId, amount, equityPct, createdAt)
- `BankAccount` (umkmId, balance, providerBPR)
- `Transaction` (bankAccountId, ts, amount, kind: INFLOW|OUTFLOW, counterparty, channel)
- `Reimbursement` (umkmId, amount, invoiceUrl, marketPriceCheck, status)
- `IndexFundHolding` (investorId, umkmId, weight)
- `CommunityPost` (umkmId, authorId, body, gateThresholdPct=5)

## Phases (1 MD per phase)

1. `01-foundation.md` — repo init, Auth, DB, design system, base layout, i18n, money utils
2. `02-marketing.md` — public landing + problem/solution + BPR map + FAQ + footer
3. `03-marketplace.md` — ECF listing, filters, UMKM detail, AI score panel, invest modal
4. `04-investor-dashboard.md` — portfolio, live bank feed (Realtime), Index Fund, Community gate
5. `05-umkm-and-admin.md` — UMKM bank dashboard, reimbursement flow with AI price check, admin panel, mocks

## Success criteria

- Investor can: browse → invest Rp100k → see live transaction stream of invested UMKM → join Community if ≥5%
- UMKM can: submit pitch → get AI score → receive reimbursement after AI price validation
- Admin can: approve/reject UMKM, override score, approve disbursement
- All flows runnable in <60s demo on Vercel preview

## Demo data

- 12 seeded UMKM across 4 sectors (F&B, retail, agri, services)
- 3 sample investors with different portfolios
- 1 admin
- 60 days of seeded bank transactions per UMKM

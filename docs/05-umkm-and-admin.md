# Phase 5 — UMKM Bank Account, Reimbursement, and Admin

## Scope
Closes the loop. UMKM founders get their digital banking dashboard (the BPR-integrated Modalin Bank Account moat) plus reimbursement-on-demand flow with AI price validation. Admin gets the curation, scoring override, and disbursement-approval console. After this phase the prototype demonstrates the full three-sided ecosystem end-to-end.

## UMKM area

### Pages
- `/(umkm)/dashboard` — Modalin Bank Account view
- `/(umkm)/pitch` — create/edit pitch
- `/(umkm)/pitch/preview` — investor-eye preview
- `/(umkm)/reimbursement` — disbursement requests
- `/(umkm)/reimbursement/new` — create request
- `/(umkm)/community` — manage Community posts (if listed and has ≥1 ≥5% holder)

### Modalin Bank Account dashboard
1. Account header: BPR partner name, masked account number, current balance (large)
2. Quick actions: Tarik Reimbursement, Tagihan QRIS, Cetak Mutasi, Hubungi BPR
3. Cashflow chart: 30-day inflow vs outflow Tremor `BarChart`
4. Recent transactions table (TanStack Table), same data investors see live
5. Funding status card: target, raised, %, days left, equity given
6. AI score card with tips ("Tingkatkan skor: tambah QRIS volume, lengkapi dokumen")
7. Investor list strip (avatars + count)

### Pitch builder
- Multi-step form (React Hook Form + Zod schema per step):
  1. Bisnis: nama, sektor, lokasi, usia, omzet/bln
  2. Cerita: visi, masalah yang dipecahkan, traction
  3. Pendanaan: target Rp, equity offered %, valuation pre-money, deadline
  4. Tim: pendiri + foto + LinkedIn
  5. Dokumen: NIB, NPWP, laporan keuangan (mock upload, store filename only)
  6. Syariah: toggle + checklist 5 kriteria (MUI fatwa-aligned)
- Auto-save draft (debounced server action)
- Preview button → opens `/(umkm)/pitch/preview`
- Submit → `Pitch.status = PENDING_REVIEW`, lands in admin queue

### Reimbursement on-demand
- Request form: amount, kategori (alat/inventory/marketing/payroll), supplier, deskripsi, upload faktur (mock)
- On submit, server action calls `lib/ai/price-validator.ts` which compares amount vs a hardcoded market reference table per category and returns `{ verdict: 'OK' | 'OVER' | 'REVIEW', refPrice, deltaPct, note }`
- If `OK` and amount ≤ Rp5jt and balance covers it: auto-approve, deduct balance, create OUTFLOW Transaction, status `DISBURSED`
- If `OVER` (>20% above ref): status `BLOCKED_PRICE_CHECK` with tooltip
- Else: `PENDING_ADMIN_REVIEW`
- List view: status badges, filter, detail drawer

## Admin area

### Pages
- `/(admin)/dashboard` — platform metrics
- `/(admin)/umkm` — curation queue
- `/(admin)/umkm/[id]` — UMKM review (override AI, approve/reject pitch)
- `/(admin)/payouts` — pending reimbursements
- `/(admin)/users` — list, role change

### Platform metrics
Tremor cards + charts: total AUM, count UMKM funded, count investors, GMV through Modalin Bank Accounts (sum of inflows last 30d), avg AI score, success-fee revenue MTD.

### UMKM curation
Queue table of `Pitch.status = PENDING_REVIEW`. Detail page shows full pitch, computed AI score with manual override input (admin can set `aiScoreOverride: number, overrideReason: string`), approve/reject buttons.

### Payout approval
Table of `Reimbursement.status = PENDING_ADMIN_REVIEW`. Each row shows AI verdict + delta vs reference. Approve creates OUTFLOW + sets DISBURSED; reject sets REJECTED + reason.

## AI price validator

`lib/ai/price-validator.ts`:
```ts
const REF: Record<Category, { unit: string; pricePerUnitIDR: number }> = { ... }
export function validateReimbursement(input: {
  category: Category; amountIDR: number; quantity?: number;
}): { verdict: 'OK'|'OVER'|'REVIEW'; refPrice: number; deltaPct: number; note: string }
```
Hardcode 8–10 ref categories (laptop, kemasan, sewa kios, marketing digital, payroll/orang/bln, mesin produksi, bahan baku F&B/kg, ongkir).

---

## Prompt for executing agent

> Phases 1–4 done. Read `docs/00-PLAN.md` and `docs/05-umkm-and-admin.md`. Working dir `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`.
>
> Build the UMKM and Admin areas per `docs/05-umkm-and-admin.md`. All `app/(umkm)/*` routes guarded by `requireRole('UMKM')`; all `app/(admin)/*` routes guarded by `requireRole('ADMIN')`.
>
> Add to Prisma schema: `Pitch.status` enum (DRAFT|PENDING_REVIEW|APPROVED|REJECTED), `UMKM.aiScoreOverride: Int?`, `UMKM.overrideReason: String?`, `UMKM.syariahCompliant: Boolean` (if not added in phase 3). Migrate.
>
> UMKM dashboard: server-render with the 7 sections in this MD. Reuse `LiveActivityFeed`-style Realtime subscription (filtered to own UMKM only) for the transactions table — UMKM sees all counterparty names un-anonymized. AI score card with tips driven by which sub-score is lowest.
>
> Pitch builder: 6-step wizard component. Per-step Zod schema, parent state in `useReducer`. Auto-save: debounced 800ms server action `savePitchDraft(umkmId, partial)`. Each step renders its fields with shadcn `Form` + RHF. Preview opens `/pitch/preview` rendering the marketplace detail page with the live-edit data.
>
> Reimbursement: form posts to server action `requestReimbursement(input)`. The action calls `validateReimbursement(input)` from `lib/ai/price-validator.ts`. Implement the validator with at least 10 ref categories using realistic Indonesian SME prices (e.g., laptop kerja Rp7,5jt, kemasan box karton Rp3.500/pcs, sewa kios pasar Rp2,5jt/bln, marketing digital Rp5jt/campaign, payroll staf operasional Rp4jt/bln). Decision logic per the MD. Create the row, update balance and create OUTFLOW Transaction inside a Prisma `$transaction` only when auto-approved.
>
> Admin dashboard: server-render Tremor cards aggregating from Prisma. AUM = sum of all `Investment.amount`. UMKM count distinct funded. GMV = sum of inflows last 30d. Success fee revenue = sum(Investment.amount) × 0.05 of pitches closed in current month.
>
> Admin curation: list page is `Pitch.status = PENDING_REVIEW`. Detail page shows the would-be marketplace card + raw fields + computed AI score. Override input + reason textarea + Approve/Reject buttons (server actions). Approve sets `Pitch.status = APPROVED`, makes UMKM visible on marketplace.
>
> Admin payouts: list `Reimbursement.status = PENDING_ADMIN_REVIEW`. Each row clickable → drawer with full detail + AI verdict. Approve action: deduct balance + create OUTFLOW Transaction + set DISBURSED. Reject: set REJECTED + reason.
>
> Final check — end-to-end demo path (must work without manual DB edits):
>
> 1. Sign in as a UMKM founder, open `/dashboard`, see balance + live txn.
> 2. Submit a new pitch via the 6-step wizard.
> 3. Sign in as admin, see pitch in queue, override AI score from 72 → 80 with reason, approve.
> 4. Sign in as investor `andi@inv.id`, find the new pitch on `/marketplace` (sort: newest), invest Rp200k.
> 5. Back as the UMKM founder, request a reimbursement of Rp7,5jt for "laptop kerja" → AI verdict `OK` → auto-disbursed → balance decremented, new OUTFLOW visible.
> 6. As `andi@inv.id`, see the OUTFLOW appear in live feed within 60s of cron tick.
> 7. As admin, `/admin/payouts` is empty (auto-approved); request a Rp30jt "marketing digital" reimbursement instead → routes to PENDING_ADMIN_REVIEW or BLOCKED depending on ref price. Admin approves it.
>
> Document the 7-step demo path in a `DEMO.md` at repo root with screenshots placeholders.

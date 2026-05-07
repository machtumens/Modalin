# Module 5 Prompt — UMKM Bank Account, Reimbursement, Admin

Modules 1–4 complete. Working dir `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`. Read `docs/00-PLAN.md` + `docs/05-umkm-and-admin.md`.

All `app/(umkm)/*` guarded by `requireRole('UMKM')`. All `app/(admin)/*` guarded by `requireRole('ADMIN')`.

## Schema additions (migrate)

- `Pitch.status` enum (`DRAFT|PENDING_REVIEW|APPROVED|REJECTED`)
- `UMKM.aiScoreOverride: Int?`
- `UMKM.overrideReason: String?`
- `UMKM.syariahCompliant: Boolean` (if not added in module 3)
- `Reimbursement.status` enum (`AUTO_APPROVED|PENDING_ADMIN_REVIEW|BLOCKED_PRICE_CHECK|DISBURSED|REJECTED`)

## UMKM dashboard (`/umkm/dashboard`)

7 sections:

1. Account header — BPR partner name · masked account number · current balance (large).
2. Quick actions — `Tarik Reimbursement` · `Tagihan QRIS` · `Cetak Mutasi` · `Hubungi BPR`.
3. Cashflow chart — 30-day inflow vs outflow Tremor `BarChart`.
4. Recent transactions table (TanStack Table) — same Realtime stream as investors but filtered to own UMKM only, counterparties UN-anonymized.
5. Funding status card — target · raised · % · days left · equity given.
6. AI score card with tips — driven by lowest sub-score (e.g., "Tingkatkan skor: tambah QRIS volume, lengkapi dokumen").
7. Investor list strip — avatars + count.

## Pitch builder (`/umkm/pitch`)

6-step wizard (RHF + Zod per step, parent state in `useReducer`):

1. Bisnis: nama · sektor · lokasi · usia · omzet/bln
2. Cerita: visi · masalah yang dipecahkan · traction
3. Pendanaan: target · equity offered % · valuation pre-money · deadline
4. Tim: pendiri · foto · LinkedIn
5. Dokumen: NIB · NPWP · laporan keuangan (mock upload, store filename only)
6. Syariah: toggle + 5-item MUI fatwa-aligned checklist

- Auto-save: debounced 800ms server action `savePitchDraft(umkmId, partial)`.
- Preview button → `/umkm/pitch/preview` rendering marketplace detail with live-edit data.
- Submit → `Pitch.status = PENDING_REVIEW`, lands in admin queue.

## Reimbursement (`/umkm/reimbursement`)

Form: amount · kategori (alat/inventory/marketing/payroll/sewa/bahan-baku/...) · supplier · deskripsi · upload faktur (mock).

Server action `requestReimbursement(input)`:

- Calls `lib/ai/price-validator.ts validateReimbursement(input)`.
- Decision logic:
  - `OK` + amount ≤ Rp5jt + balance covers → auto-approve, deduct balance, create OUTFLOW Transaction, status `DISBURSED` (atomic via Prisma `$transaction`).
  - `OVER` (>20% above ref) → status `BLOCKED_PRICE_CHECK`.
  - else → `PENDING_ADMIN_REVIEW`.
- List view: status badges, filters, detail drawer.

`lib/ai/price-validator.ts` reference table (≥10 categories, realistic Indonesian SME prices):

```
laptop kerja                Rp7.500.000
kemasan box karton          Rp3.500/pcs
sewa kios pasar             Rp2.500.000/bln
marketing digital campaign  Rp5.000.000
payroll staf operasional    Rp4.000.000/orang/bln
mesin produksi UMKM         Rp15.000.000
bahan baku F&B              Rp35.000/kg
ongkir lokal                Rp25.000/paket
peralatan kasir QRIS        Rp1.200.000
seragam kerja               Rp250.000/pcs
```

```ts
validateReimbursement(input) → { verdict: 'OK'|'OVER'|'REVIEW', refPrice, deltaPct, note }
```

## Admin

### `/admin/dashboard`

Tremor cards: total AUM (sum Investment.amount) · UMKM funded (count distinct) · investors · GMV (sum inflows last 30d) · avg AI score · success-fee revenue MTD (sum closed pitches × 0.05).

### `/admin/umkm` — curation

- List `Pitch.status = PENDING_REVIEW`.
- Detail page shows would-be marketplace card + raw fields + computed AI score.
- Override input + reason textarea + Approve/Reject buttons.
- Approve → `Pitch.status = APPROVED`, UMKM visible on marketplace.

### `/admin/payouts` — disbursement approval

- List `Reimbursement.status = PENDING_ADMIN_REVIEW`.
- Each row → drawer with detail + AI verdict + delta vs ref.
- Approve → deduct balance + create OUTFLOW Transaction + set DISBURSED.
- Reject → set REJECTED + reason.

### `/admin/users`

- Table list, role change.

## End-to-end demo path (must work without manual DB edits)

1. UMKM founder signs in → `/umkm/dashboard` → balance + live txn visible.
2. Submit new pitch via 6-step wizard.
3. Admin signs in → queue → override AI 72 → 80 with reason → approve.
4. Investor `andi@inv.id` finds new pitch on `/marketplace` (sort: newest) → invest Rp200k.
5. UMKM founder requests Rp7,5jt "laptop kerja" reimbursement → AI verdict `OK` → auto-disbursed → balance decremented, new OUTFLOW visible.
6. `andi@inv.id` sees OUTFLOW in live feed within 60s of cron tick.
7. UMKM founder requests Rp30jt "marketing digital" → routes to `PENDING_ADMIN_REVIEW` or `BLOCKED_PRICE_CHECK` based on ref price → admin approves.

Document this 7-step path in `DEMO.md` at repo root with screenshot placeholders.

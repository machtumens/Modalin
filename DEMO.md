# Modalin — End-to-End Demo

7-step walk-through demonstrating the full three-sided ecosystem. All passwords: **`Demo123!`**.

## Pre-req

```bash
pnpm install
cp .env.example .env  # fill DATABASE_URL/DIRECT_URL/AUTH_SECRET/SUPABASE
pnpm db:push
pnpm db:seed
pnpm dev
```

Open http://localhost:3000.

## Walk-through

### 1. UMKM founder logs in
Sign in as `andi.kopitani@umkm.id` → lands on `/umkm/dashboard`. See Modalin Bank Account header (BPR mitra, masked account number, balance), 30-day cashflow, AI score with tip pointing to lowest sub-score, investor count.

### 2. Founder edits and resubmits pitch
Click **Edit Pitch** → `/umkm/pitch`. Adjust funding target, equity %, story. Submit. Pitch status becomes `PENDING_REVIEW`.

### 3. Admin reviews and approves
Sign out, sign in as `admin@modalin.id` → `/admin/dashboard`. See curation queue count = 1. Click **Buka antrian → Review** the pitch. Override AI score from 72 → 80 with reason "QRIS volume meningkat 40% MoM". Click **Approve Pitch**.

### 4. Investor invests
Sign in as `andi@inv.id` → `/marketplace`. Sort by **Terbaru**. Open the pitch you just approved. AI score panel animates to 80. Click **Investasi sekarang**, slide to Rp200.000, confirm risk + syariah, submit. Confetti fires. Equity calculation visible.

### 5. UMKM founder requests reimbursement
Sign back in as `andi.kopitani@umkm.id` → `/umkm/reimbursement/new`. Pilih kategori **Laptop kerja**, jumlah Rp7.500.000, deskripsi "Laptop admin keuangan". Submit. AI verdict: `OK`, status: `DISBURSED`. Saldo terpotong, OUTFLOW transaction tercatat.

### 6. Investor sees the OUTFLOW live
Sign in as `andi@inv.id` → `/investor/dashboard`. Live Activity Feed shows the `Reimbursement` outflow within 30s (polling). Open `/investor/portfolio/[umkmId]` for full transaction table.

### 7. Founder triggers admin review path
As `andi.kopitani@umkm.id` again, request a new reimbursement: kategori **Marketing digital campaign**, jumlah Rp30.000.000. AI verdict: `OVER` (>20% above Rp5jt reference) → status `BLOCKED_PRICE_CHECK`. Sign back in as admin → `/admin/payouts`. See the entry. Click **Approve & Cair** to override. Saldo terpotong, OUTFLOW posted.

## Cron simulation

Vercel cron fires `/api/cron/simulate-txn` every minute on production. For local dev:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/simulate-txn
```

This generates one new transaction per UMKM, mixing INFLOW/OUTFLOW. The investor's `LiveActivityFeed` polls `/api/investor/feed` every 30 seconds and prepends new rows.

## Key URLs

- `/` landing
- `/marketplace` ECF marketplace
- `/marketplace/[id]` UMKM detail + invest
- `/investor/dashboard` portfolio + live feed
- `/investor/index-fund` auto-diversification simulator
- `/investor/community` gated by ≥5% equity
- `/umkm/dashboard` Modalin Bank Account + AI score
- `/umkm/reimbursement` reimbursement history
- `/admin/dashboard` platform metrics
- `/admin/umkm` curation queue
- `/admin/payouts` payout approval

## Screenshot placeholders

(populate after deploy)
- ![landing](docs/screens/landing.png)
- ![marketplace](docs/screens/marketplace.png)
- ![investor-dashboard](docs/screens/investor-dashboard.png)
- ![umkm-dashboard](docs/screens/umkm-dashboard.png)
- ![admin](docs/screens/admin.png)

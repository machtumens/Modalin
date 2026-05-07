# Module 3 Prompt — ECF Marketplace

Modules 1–2 complete. Working dir `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`. Read `docs/00-PLAN.md` + `docs/03-marketplace.md`.

## Routes

- `app/(investor)/marketplace/page.tsx`
- `app/(investor)/marketplace/[id]/page.tsx`
- `app/(investor)/marketplace/[id]/success/page.tsx`
- `app/api/score/route.ts`

All `(investor)` routes guarded by `requireRole('INVESTOR')`.

## Listing page

- Server Component reading filters from `searchParams`.
- Filter rail (Client Component) pushes URL state via `useRouter().replace`.
- Filters: sector multi · location · funding stage (1–3 yr) · AI score range slider · syariah-only switch · min ticket.
- Sort: AI score desc · funding progress · deadline soonest · newest.
- Cards: thumbnail · name · sector chip · location · AI score badge (≥80 emerald, 65–79 amber, <65 zinc) · progress bar · days left · "Bagi hasil" badge.
- Pagination 12/page.
- Skeleton loading.

## Detail page sections

1. Hero — founder photo, business name, sector, location, "Funding aktif" badge, share button.
2. KPI strip — omzet/bln · usia bisnis · funding target · equity offered % · valuation pre-money · days left.
3. Story tabs — `Tentang Bisnis` · `Tim Pendiri` · `Proyeksi` · `Risiko` · `Dokumen`.
4. **AI Score panel** — radial dial 0–100 + 4 sub-scores (SLIK · e-commerce velocity · digital behavior · sector outlook). HoverCard tooltips in Bahasa Indonesia. Powered by `lib/ai/scorer.ts`.
5. Live transaction preview — last 7 days from seeded Transactions, Tremor `BarList` of inflow vs outflow. Lower half blurred with overlay `🔒 Investasikan Rp100rb untuk akses real-time penuh`.
6. Investment widget — sticky right rail desktop (`lg:sticky lg:top-24`), bottom Drawer on mobile. Ticket slider min Rp100k, step Rp100k, max = remaining. Live equity calc, fee disclosure (success fee 5% UMKM-side, 0 investor-side), CTA opens Dialog with risk + syariah checkboxes.
7. Q&A — server-rendered thread + form server action. Founder replies marked `Pendiri` badge.
8. Comparable UMKM strip.

## AI scorer

`lib/ai/scorer.ts`:

```ts
export function scoreUMKM(input: {
  monthlyRevenueIDR: number;
  ageMonths: number;
  sliKScore: number;
  ecomVelocity: number;
  digitalBehavior: number;
  sector: string;
}): { total: number; components: Record<string, number> }
```

Weights: SLIK 30% · e-commerce velocity 25% · digital behavior 20% · revenue/age normalized 15% · sector outlook 10%. Cap 0–100.

`app/api/score/route.ts` accepts UMKM id, looks up row, computes, returns JSON. Also supports `?demo=1` returning `{score:78, components:{slik:82, ecommerce:71, behavior:80}}` (used by marketing module).

## Invest server action

```ts
investAction({ umkmId, amountIDR }) → { ok, equityPctNow }
```

- Validates auth + Zod.
- Creates `Investment` + updates `Pitch.raised` in `prisma.$transaction`.
- Revalidates path.
- Redirects to `/marketplace/[id]/success`.

Success page fires `canvas-confetti` and shows next steps. If `equityPctNow >= 5`, render Toast with link to `/community/[umkmId]`.

## Verification

- Investor filters by sector + AI ≥ 75 + syariah-only → filtered cards.
- Card click → detail.
- AI score animates 0 → value.
- Invest Rp100k decrements remaining.
- Investing into UMKM with ≤ Rp50jt remaining can push equity ≥ 5% → community toast.
- All money via `formatIDR`/`formatIDRCompact`.
- All copy via next-intl.

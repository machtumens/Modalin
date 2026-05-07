# Phase 3 — ECF Marketplace

## Scope
The investor-facing browsing and investing surface. Lets a logged-in investor discover seeded UMKM, deep-dive on one, and execute a mock investment that updates DB state. AI score panel, syariah filter, and ticket-size slider are core differentiators vs Bizhare/Santara.

## Pages
- `/(investor)/marketplace` — listing
- `/(investor)/marketplace/[id]` — UMKM detail
- `/(investor)/marketplace/[id]/invest` — invest modal/route (parallel route)

## Listing features
- Filter rail: sector (multi), location (Java/Sumatra/etc), funding stage (1–3 yr), AI score range slider, syariah-only toggle, min ticket
- Sort: AI score desc, funding progress, deadline soonest, newest
- Card grid: thumbnail, name, sector chip, location, AI score badge color-coded (≥80 emerald, 65–79 amber, <65 zinc), funding progress bar (raised / target), days left, "Bagi hasil" badge
- Pagination via `searchParams` (server component fetch)
- Skeleton loading

## Detail page sections
1. Hero: founder photo, business name, sector, location, "Funding aktif" badge, share button
2. KPI strip: omzet/bln, usia bisnis, funding target, equity offered %, valuation pre-money, days left
3. Story tabs: Tentang Bisnis · Tim Pendiri · Proyeksi · Risiko · Dokumen
4. **AI Score panel** — radial 0–100 + 4 sub-scores (SLIK, e-commerce velocity, digital behavior, sector outlook) with explainer tooltips. Powered by `lib/ai/scorer.ts`.
5. Live transaction preview (last 7 days from seeded `Transaction`s) — Tremor `BarList` of inflow vs outflow, "lihat lengkap setelah investasi"
6. Investment widget (sticky right rail desktop / bottom sheet mobile): ticket slider Rp100k → max remaining, equity calc, "Investasi Sekarang" CTA
7. Q&A section — investors can post questions, founders reply (state in DB)
8. Comparable UMKM strip

## Invest flow
1. Modal: confirm ticket + checkbox risk disclosure + syariah aknowledgement
2. POST `/api/invest` server action → creates `Investment`, updates `Pitch.raised`, redirects to success page with confetti (canvas-confetti)
3. If post-invest equity ≥ 5%, show toast "Anda kini berhak akses Modalin Community untuk UMKM ini"

## Mock AI scorer
`lib/ai/scorer.ts`:
```ts
export function scoreUMKM(input: {
  monthlyRevenueIDR: number; ageMonths: number; sliKScore: number;
  ecomVelocity: number; digitalBehavior: number; sector: string;
}): { total: number; components: Record<string, number>; }
```
Weighted: SLIK 30%, e-com velocity 25%, digital behavior 20%, revenue/age normalized 15%, sector outlook 10%. Cap 0–100.

---

## Prompt for executing agent

> Phases 1–2 done. Read `docs/00-PLAN.md` and `docs/03-marketplace.md`. Working dir `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`.
>
> Build the ECF Marketplace exactly per `docs/03-marketplace.md`. Listing page is a Server Component reading filters from `searchParams`, querying Prisma with `where`/`orderBy`, paginated 12 per page. Filter rail is a Client Component that pushes URL state via `useRouter().replace(?...)`. Use shadcn `Slider`, `Checkbox`, `Switch`. Add a `"Hanya Syariah"` toggle that filters UMKM where `syariahCompliant: true` (add boolean to Prisma schema with migration; seed ~70% true).
>
> Implement `lib/ai/scorer.ts` per the signature in this MD with the documented weights. Add an API route `app/api/score/route.ts` that accepts a UMKM id, looks up the row, computes score, returns JSON. The detail page server-fetches this and passes to a client `<AIScorePanel>` that renders an SVG radial dial (count-up via Framer Motion `useMotionValue`) + 4 horizontal component bars with Radix `HoverCard` tooltips explaining each signal in Bahasa Indonesia.
>
> Detail page route `app/(investor)/marketplace/[id]/page.tsx` implements the 8 sections in order. Story tabs use shadcn `Tabs`. Live transaction preview uses Tremor `BarList` with the last 7 days aggregated, and shows a blurred lower half with overlay "🔒 Investasikan Rp100rb untuk akses real-time penuh".
>
> Investment widget is a Client Component, sticky on desktop (`lg:sticky lg:top-24`), rendered as `Drawer` (shadcn) on mobile. Ticket slider min Rp100,000, step Rp100,000, max = remaining funding. Show live equity % calc, fee disclosure (success fee 5% from UMKM side, 0 from investor side), and the CTA opens a `Dialog` with the risk-disclosure checkbox + syariah acknowledgment. On confirm, call a Server Action `investAction({ umkmId, amountIDR })` that:
> - validates auth (INVESTOR role) via `lib/rbac.ts`
> - validates Zod schema
> - creates `Investment` row in a transaction with raised total update
> - revalidates the path
> - returns `{ ok: true, equityPctNow: number }`
>
> On success, redirect to `/(investor)/marketplace/[id]/success` which fires `canvas-confetti` and shows next steps. If `equityPctNow >= 5`, render a `Toast` with link to `/community/[umkmId]`.
>
> Q&A section: simple thread component (server-rendered list + form using server action). Founder replies marked with a "Pendiri" badge.
>
> All money rendered via `formatIDR`/`formatIDRCompact`. All copy through next-intl.
>
> Verify: signed-in investor can filter by sector + AI score ≥ 75 + syariah-only and see filtered cards; clicking a card opens detail; AI score animates from 0 to value; investing Rp100k decrements remaining and shows on next reload; investing into a UMKM with ≤ Rp50jt remaining can push equity ≥ 5% and trigger the community toast.

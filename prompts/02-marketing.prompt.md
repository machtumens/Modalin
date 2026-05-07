# Module 2 Prompt — Marketing Surfaces

Module 1 (foundation) is complete. Working directory `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`. Read `docs/00-PLAN.md` + `docs/02-marketing.md` first.

## Pages to build

1. `/` landing
2. `/untuk-investor`
3. `/untuk-umkm`
4. `/mitra-bpr`
5. `/tentang`
6. `/faq`
7. `/legal/[slug]` (markdown-driven; create `risiko`, `privasi`, `tos`)

## Landing sections (top to bottom)

1. **Hero** — headline `"Modal untuk UMKM Bertumbuh, Akses untuk Investor Generasi Baru."`, sub-copy, dual CTA (`Mulai Investasi Rp100rb` / `Daftarkan UMKM Anda`), trust strip (OJK pending badge, BPR mitra count, Sharia-friendly badge).
2. **Problem strip** — 3 stats: 65 jt UMKM · Rp1.605 T funding gap · 14,8 jt investor ritel.
3. **Solution triad** — 3 cards (ECF Marketplace · Modalin Bank Account · Investor Dashboard).
4. **How it works** — 4-step animated timeline (Daftar → AI Score → Funding → Live Tracking).
5. **AI scoring teaser** — fetch `GET /api/score?demo=1` (stub returning `{score:78, components:{slik:82, ecommerce:71, behavior:80}}`). Render count-up radial dial + 3 component bars.
6. **BPR partner map** — react-leaflet, OSM tiles, 8 markers (Jakarta · Surabaya · Bandung · Medan · Makassar · Yogyakarta · Denpasar · Palembang). Each popup shows mock partnership status + UMKM count served. `<ul>` fallback below for a11y. Lazy-load via `dynamic(() => import(...), { ssr: false })`.
7. **Comparison table** — 5 rows × 4 cols (Modalin highlighted emerald). Rows: Bunga/Riba · Min ticket · Akses early-growth UMKM · Transparansi real-time · Skema syariah. Cols: Modalin · Bank Konvensional · P2P Lending · ECF Eksisting.
8. **Testimonial carousel** — 3 mock UMKM founders + 3 investors.
9. **Numbers / projection** — Tremor `AreaChart` Year 1 → Year 3 (72→288 UMKM, Rp3,6 M → Rp24,5 M raised).
10. **Final CTA + footer.**

## Animation rules

- Framer Motion `motion.section whileInView={{opacity:1, y:0}} initial={{opacity:0, y:24}} viewport={{once:true, margin:'-80px'}}`.
- Hero text staggered children.
- Score card count-up via `useMotionValue` + `useTransform`.
- Honor `prefers-reduced-motion: reduce` → opacity-only fade.

## Implementation notes

- Each section under `components/marketing/`.
- All copy via `next-intl useTranslations`, mirrored in `messages/en.json`.
- Use shadcn primitives.
- Bahasa Indonesia primary copy.

## SEO

- Per-page `generateMetadata`.
- Root JSON-LD `Organization` + `WebSite`.
- Dynamic OG image at `app/opengraph-image.tsx` via `next/og`: text `"Modalin — Modal Tumbuh, Akses Terbuka"` on emerald gradient.
- `app/sitemap.ts`, `app/robots.ts`.
- Legal pages render `content/legal/{slug}.md` via `react-markdown`.

## A11y

- Keyboard navigable.
- Color contrast ≥ AA against emerald primary.
- Map has list fallback.

## Verification

- All 7 routes render.
- Lighthouse mobile ≥ 90.
- Locale toggle swaps copy.
- Scroll animations fire once, never re-trigger.
- `prefers-reduced-motion` respected.

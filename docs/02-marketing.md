# Phase 2 — Marketing Surfaces

## Scope
Public, unauthenticated pages that pitch Modalin to all three audiences (investor ritel, UMKM founder, BPR partner). Must communicate problem, solution, and traction credibly within 30 seconds of scrolling. Bahasa Indonesia primary copy, English mirror.

## Pages
1. `/` — Landing
2. `/untuk-investor` — Investor value prop
3. `/untuk-umkm` — UMKM value prop
4. `/mitra-bpr` — Bank partner value prop + map
5. `/tentang` — About + team + traction
6. `/faq` — Syariah-conscious FAQ + risk + OJK status
7. `/legal/[slug]` — TOS, privacy, risk disclosure (markdown-driven)

## Landing sections (top to bottom)
1. **Hero** — headline "Modal untuk UMKM Bertumbuh, Akses untuk Investor Generasi Baru.", sub, dual CTA (Mulai Investasi Rp100rb / Daftarkan UMKM Anda), trust strip (OJK pending, BPR mitra count, Sharia-friendly badge)
2. **Problem strip** — 3 stats: 65 jt UMKM, Rp1.605 T funding gap, 14,8 jt investor ritel underserved
3. **Solution triad** — 3 cards: ECF Marketplace, Modalin Bank Account, Investor Dashboard
4. **How it works** — 4-step animated timeline (Daftar → AI Score → Funding → Live Tracking)
5. **AI scoring teaser** — animated mock score card pulling from `/api/score?demo=1`
6. **BPR partner map** — react-leaflet Indonesia map with 8 mock pinned BPR locations
7. **Comparison table** — Modalin vs Bank vs P2P vs ECF eksisting
8. **Testimonial carousel** — 3 mock UMKM founders + 3 investors
9. **Numbers / projection** — Tremor area chart Year 1→3 (72→288 UMKM, Rp3,6M→Rp24,5M raised)
10. **Final CTA + footer**

## Animation rules
Framer Motion: section reveal on scroll (`whileInView`, `once: true`), hero text stagger, score card number count-up (use `useMotionValue` + `useTransform`). Respect `prefers-reduced-motion`.

## SEO
- Per-page metadata, Open Graph image template (next/og)
- JSON-LD `Organization` + `WebSite` on root
- Sitemap + robots.txt

## Accessibility
- All sections keyboard-navigable
- Color contrast ≥ AA against emerald primary
- Map has list-fallback for screen readers

---

## Prompt for executing agent

> Phase 1 foundation is complete and merged. Working directory `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\Modalin`. Read `docs/00-PLAN.md` and `docs/02-marketing.md` first.
>
> Build all 7 marketing pages listed in `docs/02-marketing.md` § Pages. Use the section list for landing exactly in order. Copy is Bahasa Indonesia, mirrored to English in `messages/en.json`. Pull every user-visible string through `next-intl`'s `useTranslations`.
>
> Implement each landing section as its own component under `components/marketing/`. Use shadcn/ui primitives + Framer Motion `motion.section` with `whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true, margin: '-80px' }}`. Hero headline uses staggered children. The AI scoring teaser fetches `GET /api/score?demo=1` (build a stub route returning `{score: 78, components: {slik: 82, ecommerce: 71, behavior: 80}}`) and displays a count-up animated radial dial (Tremor `CategoryBar` or custom SVG arc) plus 3 component bars.
>
> BPR map: react-leaflet with OpenStreetMap tiles, 8 hardcoded markers (BPR Jakarta, BPR Surabaya, BPR Bandung, BPR Medan, BPR Makassar, BPR Yogyakarta, BPR Denpasar, BPR Palembang), each marker has popup with mock partnership status + UMKM count served. Provide a `<ul>` fallback below the map listing the same data for a11y. Lazy-load leaflet with `dynamic(() => import(...), { ssr: false })`.
>
> Comparison table: 5 rows (Bunga/Riba, Min ticket, Akses early-growth UMKM, Transparansi real-time, Skema syariah) × 4 columns (Modalin, Bank Konvensional, P2P Lending, ECF Eksisting). Modalin column highlighted emerald.
>
> Projection chart: Tremor `AreaChart` with two series (UMKM count, Funding raised Rp M) for Year 1, 2, 3 using base-case numbers from `docs/00-PLAN.md`.
>
> SEO: Add `generateMetadata` per page, root JSON-LD Organization, dynamic OG image at `app/opengraph-image.tsx` using `next/og` rendering "Modalin — Modal Tumbuh, Akses Terbuka" on emerald gradient.
>
> Add `app/sitemap.ts`, `app/robots.ts`. Legal pages render markdown from `content/legal/{slug}.md` via `react-markdown`.
>
> All sections must respect `prefers-reduced-motion: reduce`: animations collapse to opacity-only fade.
>
> Verify: `/`, `/untuk-investor`, `/untuk-umkm`, `/mitra-bpr`, `/tentang`, `/faq`, `/legal/risiko` all render, lighthouse mobile score ≥ 90, locale toggle swaps copy, scroll animations fire once and never re-trigger.

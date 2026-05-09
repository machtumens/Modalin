"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Wallet,
  Banknote,
  Activity,
  Sparkles,
  Zap,
  Building2,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  id: string;
  icon: LucideIcon;
  pill: string;
  title: string;
  sub: string;
  body: string;
  metricLabel: string;
  metric: string;
  metricSub?: string;
  visual: "tx" | "score" | "bars" | "pulse";
};

const features: Feature[] = [
  {
    id: "bpr",
    icon: Building2,
    pill: "BPR Account",
    title: "Modalin Bank Account",
    sub: "POJK 22/2024 · Bank rakyat",
    body: "Rekening bisnis digital di atas BPR mitra. Tanpa antrian, langsung aktif setelah onboarding 6 langkah.",
    metricLabel: "Mitra BPR aktif",
    metric: "8",
    metricSub: "kota · 132 UMKM dilayani",
    visual: "bars",
  },
  {
    id: "bagi-hasil",
    icon: Banknote,
    pill: "Bagi Hasil",
    title: "100% Bagi Hasil Ekuitas",
    sub: "Syariah-friendly · Zero riba",
    body: "Investor mendapat saham ekuitas, bukan utang. Pengembalian terikat pada kinerja bisnis nyata UMKM.",
    metricLabel: "Min ticket investor",
    metric: "Rp 100.000",
    metricSub: "Terendah di industri ECF",
    visual: "pulse",
  },
  {
    id: "live-tx",
    icon: Activity,
    pill: "Live Tx",
    title: "Live Transaction Stream",
    sub: "Open banking · Real-time",
    body: "Setiap pembayaran masuk dan keluar UMKM ter-pull otomatis ke dashboard investor dalam hitungan detik.",
    metricLabel: "Tx terverifikasi hari ini",
    metric: "1.247",
    metricSub: "+18% vs kemarin",
    visual: "tx",
  },
  {
    id: "ai-score",
    icon: Sparkles,
    pill: "AI Score",
    title: "AI Credit Scoring",
    sub: "SLIK + GMV + behavior",
    body: "Skor 0–100 menggabungkan SLIK OJK, e-commerce velocity, perilaku digital, dan outlook sektor.",
    metricLabel: "Skor demo",
    metric: "78 / 100",
    metricSub: "Above benchmark threshold 65",
    visual: "score",
  },
  {
    id: "reimburse",
    icon: Zap,
    pill: "Reimbursement",
    title: "AI-Validated Reimbursement",
    sub: "On-demand cash out",
    body: "AI validasi harga supplier vs harga pasar real-time. Dana cair otomatis bila lolos threshold.",
    metricLabel: "Avg waktu validasi",
    metric: "< 2 menit",
    metricSub: "vs 3–5 hari di bank konvensional",
    visual: "bars",
  },
  {
    id: "open-banking",
    icon: Wallet,
    pill: "Open Banking",
    title: "Open Banking Integration",
    sub: "API · POJK 22/2024",
    body: "Modalin menarik data transaksi dari rekening BPR UMKM, langsung ke dashboard investor — tanpa upload manual.",
    metricLabel: "Latency pull",
    metric: "~ 8 dtk",
    metricSub: "End-to-end transaction sync",
    visual: "pulse",
  },
];

export function FeatureDeck() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % features.length), 3500);
    return () => clearInterval(id);
  }, [paused, reduce]);

  const f = features[active];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full"
    >
      {/* glow under */}
      <div className="pointer-events-none absolute -inset-x-10 -bottom-8 h-40 rounded-full bg-brand-500/30 blur-3xl" />

      {/* Pills row above */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {features.slice(0, 3).map((feat, i) => (
          <Pill
            key={feat.id}
            feat={feat}
            active={active === i}
            onClick={() => {
              setActive(i);
              setPaused(true);
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <motion.div
        layout
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          setActive((a) => (a + 1) % features.length);
          setPaused(true);
        }}
        className="bevel-card gold-ring relative cursor-pointer overflow-hidden rounded-2xl p-6 sm:p-7"
      >
        {/* progress bar at top */}
        {!reduce && !paused && (
          <motion.div
            key={active}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 3.5, ease: "linear" }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-gold-400 via-gold-200 to-gold-400"
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/40 bg-zinc-950 text-gold-300 shadow-[0_0_24px_-5px_rgba(251,191,36,0.55)]">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-300">
                    {f.sub}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{f.title}</h3>
                </div>
              </div>
              <span className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                {String(active + 1).padStart(2, "0")} / 06
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-zinc-300">{f.body}</p>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <Visual kind={f.visual} />
              <div className="mt-3 flex items-baseline justify-between border-t border-zinc-800 pt-3">
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    {f.metricLabel}
                  </div>
                  <div className="mt-0.5 font-display text-2xl font-bold text-white">
                    {f.metric}
                  </div>
                </div>
                {f.metricSub && (
                  <div className="text-right text-[10px] uppercase tracking-widest text-brand-300">
                    {f.metricSub}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                Tekan untuk lanjut
              </span>
              <ArrowUpRight className="h-4 w-4 text-gold-300" />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Pills row below */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {features.slice(3).map((feat, i) => (
          <Pill
            key={feat.id}
            feat={feat}
            active={active === i + 3}
            onClick={() => {
              setActive(i + 3);
              setPaused(true);
            }}
          />
        ))}
      </div>

      {/* Dot indicator */}
      <div className="mt-4 flex justify-center gap-1.5">
        {features.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);
              setPaused(true);
            }}
            aria-label={`Show feature ${i + 1}`}
            className={`h-1 rounded-full transition-all ${
              active === i ? "w-8 bg-gold-400" : "w-1.5 bg-zinc-700 hover:bg-zinc-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Pill({
  feat,
  active,
  onClick,
}: {
  feat: Feature;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors ${
        active
          ? "border-gold-400/60 bg-gold-400/15 text-gold-200 shadow-[0_0_24px_-5px_rgba(251,191,36,0.6)]"
          : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-brand-400/50 hover:text-brand-300"
      }`}
    >
      <feat.icon className={`h-3.5 w-3.5 ${active ? "text-gold-300" : "text-brand-300"}`} />
      <span className="uppercase tracking-widest text-[10px]">{feat.pill}</span>
    </motion.button>
  );
}

function Visual({ kind }: { kind: Feature["visual"] }) {
  if (kind === "tx") return <TxVisual />;
  if (kind === "score") return <ScoreVisual />;
  if (kind === "bars") return <BarsVisual />;
  return <PulseVisual />;
}

function TxVisual() {
  const txs = [
    { t: "+ Pembayaran masuk", v: "Rp 1.958.557", up: true },
    { t: "+ QRIS settlement", v: "Rp 412.300", up: true },
    { t: "− Supplier outflow", v: "Rp 285.000", up: false },
  ];
  return (
    <div className="space-y-1.5 font-mono text-[11px]">
      {txs.map((t, i) => (
        <motion.div
          key={t.t}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.25 }}
          className="flex items-center justify-between rounded-md bg-zinc-900/60 px-2.5 py-1.5"
        >
          <span className="text-zinc-400">{t.t}</span>
          <span className={t.up ? "text-brand-300" : "text-rose-300"}>{t.v}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ScoreVisual() {
  const items = [
    { k: "SLIK", v: 82 },
    { k: "GMV", v: 71 },
    { k: "Behavior", v: 80 },
    { k: "Sector", v: 76 },
  ];
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={it.k}>
          <div className="mb-0.5 flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">{it.k}</span>
            <span className="font-mono font-semibold text-white">{it.v}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              key={it.k}
              initial={{ width: 0 }}
              animate={{ width: `${it.v}%` }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="h-full rounded-full bg-linear-to-r from-brand-400 to-gold-400"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BarsVisual() {
  const heights = [40, 65, 50, 80, 70, 90, 75];
  return (
    <div className="flex h-16 items-end justify-between gap-1.5">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
          className="flex-1 rounded-sm bg-linear-to-t from-brand-500/40 to-gold-400 shadow-[0_0_8px_rgba(251,191,36,0.35)]"
        />
      ))}
    </div>
  );
}

function PulseVisual() {
  return (
    <div className="relative flex h-16 items-center justify-center">
      <svg viewBox="0 0 320 60" className="h-full w-full">
        <defs>
          <linearGradient id="pulseG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 30 L 60 30 L 75 18 L 90 42 L 105 12 L 120 48 L 135 30 L 320 30"
          fill="none"
          stroke="url(#pulseG)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

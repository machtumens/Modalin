"use client";
import { useState } from "react";
import { AreaChart, BarChart } from "@tremor/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, TrendingUp, Wallet, Users, Building2 } from "lucide-react";
import { Section } from "./section";

type Scenario = "bear" | "base" | "best";

const revenueStack = [
  {
    tahun: "Y1",
    "Success Fee": 180,
    "Management Fee": 36,
    "Revenue Sharing": 70.2,
    "Premium Listing": 70.2,
  },
  {
    tahun: "Y2",
    "Success Fee": 630,
    "Management Fee": 198,
    "Revenue Sharing": 440.1,
    "Premium Listing": 293.4,
  },
  {
    tahun: "Y3",
    "Success Fee": 1224,
    "Management Fee": 568.8,
    "Revenue Sharing": 1211.76,
    "Premium Listing": 712.8,
  },
];

const ebitdaPath = [
  { tahun: "Y1", "Revenue": 356.4, "OPEX": 1050, "EBITDA": -693.6 },
  { tahun: "Y2", "Revenue": 1561.5, "OPEX": 2250, "EBITDA": -688.5 },
  { tahun: "Y3", "Revenue": 3717.36, "OPEX": 3300, "EBITDA": 417.36 },
];

const scenarios: Record<Scenario, {
  label: string;
  umkmPerMonth: number;
  ticket: string;
  revenueY3: number;
  opexY3: number;
  ebitdaY3: number;
  margin: string;
  bep: string;
  tone: string;
}> = {
  bear: {
    label: "Bear Case",
    umkmPerMonth: 12,
    ticket: "Rp 65 jt",
    revenueY3: 1860,
    opexY3: 2800,
    ebitdaY3: -940,
    margin: "-51%",
    bep: "Q2 Y4",
    tone: "from-red-400 to-red-600",
  },
  base: {
    label: "Base Case",
    umkmPerMonth: 24,
    ticket: "Rp 85 jt",
    revenueY3: 3717.36,
    opexY3: 3300,
    ebitdaY3: 417.36,
    margin: "+11%",
    bep: "Q3 Y3",
    tone: "from-brand-300 to-brand-500",
  },
  best: {
    label: "Best Case",
    umkmPerMonth: 31,
    ticket: "Rp 95 jt",
    revenueY3: 5300,
    opexY3: 3800,
    ebitdaY3: 1500,
    margin: "+28%",
    bep: "Q4 Y2",
    tone: "from-gold-300 to-gold-500",
  },
};

export function ProjectionChart() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const s = scenarios[scenario];

  return (
    <Section>
      <div className="mb-12 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
          Proyeksi finansial · 36 bulan
        </div>
        <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          Dari{" "}
          <span className="shimmer-text">Rp356 jt</span>{" "}
          ke{" "}
          <span className="shimmer-text">Rp3,72 M</span>{" "}
          revenue tahunan.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Empat revenue stream menyatu — success fee 5%, management fee 2% AUM, revenue sharing bank 30%, dan premium listing.
          AUM kumulatif Rp40,68 M di akhir Y3, EBITDA break-even Q3 Y3.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue stream stack */}
        <ChartCard
          eyebrow="Revenue mix"
          title="4 stream menumpuk"
          subtitle="Rp juta · Y1 → Y3"
        >
          <BarChart
            className="h-72 dark-tremor"
            data={revenueStack}
            index="tahun"
            categories={["Success Fee", "Management Fee", "Revenue Sharing", "Premium Listing"]}
            colors={["teal", "amber", "emerald", "yellow"]}
            stack
            showLegend
            showAnimation
            valueFormatter={(n) => `${n.toLocaleString("id-ID")} jt`}
          />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-zinc-800 pt-4">
            <Mini label="Y1 Total" value="Rp 356,4 jt" />
            <Mini label="Y2 Total" value="Rp 1,56 M" growth="+338%" />
            <Mini label="Y3 Total" value="Rp 3,72 M" growth="+138%" highlight />
          </div>
        </ChartCard>

        {/* EBITDA path */}
        <ChartCard
          eyebrow="Path to profitability"
          title="EBITDA crossover Y3"
          subtitle="Revenue vs OPEX · Rp juta"
        >
          <AreaChart
            className="h-72 dark-tremor"
            data={ebitdaPath}
            index="tahun"
            categories={["Revenue", "OPEX"]}
            colors={["teal", "rose"]}
            showAnimation
            showLegend
            valueFormatter={(n) => `${n.toLocaleString("id-ID")} jt`}
          />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-zinc-800 pt-4">
            <Mini label="Y1 EBITDA" value="-Rp 693,6 jt" tone="bad" />
            <Mini label="Y2 EBITDA" value="-Rp 688,5 jt" tone="bad" />
            <Mini label="Y3 EBITDA" value="+Rp 417,4 jt" tone="good" />
          </div>
        </ChartCard>
      </div>

      {/* Scenario toggle */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="card-dark relative mt-6 overflow-hidden rounded-2xl p-7"
      >
        <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Skenario Y3</div>
              <h3 className="mt-1 font-display text-2xl font-bold text-white">Bear · Base · Best</h3>
            </div>
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-950 p-1">
              {(Object.keys(scenarios) as Scenario[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setScenario(k)}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    scenario === k ? "text-zinc-950" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {scenario === k && (
                    <motion.span
                      layoutId="scenario-pill"
                      className="absolute inset-0 rounded-full bg-brand-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{scenarios[k].label}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={scenario}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              <ScenarioMetric label="UMKM/bulan" value={`${s.umkmPerMonth}`} unit="UMKM/bln" tone={s.tone} />
              <ScenarioMetric label="Avg ticket" value={s.ticket} tone={s.tone} />
              <ScenarioMetric label="Revenue Y3" value={`Rp ${s.revenueY3.toLocaleString("id-ID")} jt`} tone={s.tone} />
              <ScenarioMetric label="OPEX Y3" value={`Rp ${s.opexY3.toLocaleString("id-ID")} jt`} tone={s.tone} />
              <ScenarioMetric label="EBITDA margin" value={s.margin} tone={s.tone} primary />
              <ScenarioMetric label="BEP tercapai" value={s.bep} tone={s.tone} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Unit economics + funding plan */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <UnitCard
          icon={TrendingUp}
          eyebrow="Unit economics"
          title="LTV/CAC 5,0x"
          rows={[
            { k: "LTV/CAC Investor", v: "4,4x" },
            { k: "LTV/CAC UMKM", v: "12,6x" },
            { k: "Payback Investor", v: "~8 bulan" },
            { k: "Payback UMKM", v: "~3 bulan" },
          ]}
          accent="from-brand-400 to-brand-600"
        />
        <UnitCard
          icon={Wallet}
          eyebrow="AUM growth"
          title="Rp 40,68 M"
          rows={[
            { k: "Y1 AUM akhir", v: "Rp 3,6 M" },
            { k: "Y2 AUM akhir", v: "Rp 16,2 M" },
            { k: "Y3 AUM akhir", v: "Rp 40,68 M" },
            { k: "Take rate Y3", v: "9,1% AUM" },
          ]}
          accent="from-gold-400 to-gold-600"
        />
        <UnitCard
          icon={Users}
          eyebrow="Reach Y3"
          title="528 UMKM · 26,4rb investor"
          rows={[
            { k: "UMKM kumulatif", v: "528" },
            { k: "Investor terdaftar", v: "26.400" },
            { k: "Avg investor / UMKM", v: "100" },
            { k: "Funding success rate", v: ">85%" },
          ]}
          accent="from-brand-300 to-gold-400"
        />
      </div>

      {/* Funding plan */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="card-dark glow-ring mt-6 rounded-2xl p-7"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
              Total funding need
            </div>
            <div className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
              Rp 3 miliar
            </div>
            <div className="mt-1 text-sm text-zinc-400">Pre-Seed + Seed · runway sampai EBITDA breakeven Q3 Y3</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3">
            <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Series A target</div>
            <div className="mt-1 font-mono text-sm text-brand-300">Rp 10–15 M · Q2 2027</div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <UseOfFunds label="Tech & AI engine" pct={40} value="Rp 1,20 M" />
          <UseOfFunds label="OJK & compliance" pct={25} value="Rp 750 jt" />
          <UseOfFunds label="Marketing CAC Y1" pct={20} value="Rp 600 jt" />
          <UseOfFunds label="Operational reserve" pct={10} value="Rp 300 jt" />
          <UseOfFunds label="Legal & advisory" pct={5} value="Rp 150 jt" />
        </div>

        <div className="mt-6 grid gap-3 border-t border-zinc-800 pt-5 sm:grid-cols-3">
          <FundStage stage="Pre-Seed" amount="Rp 1,2 M" timing="Q4 2025" dilution="15%" source="Founder + Angel" />
          <FundStage stage="Seed Round" amount="Rp 1,8 M" timing="Q3 2026" dilution="20%" source="VC Tier-2" />
          <FundStage stage="Series A" amount="Rp 10–15 M" timing="Q2 2027" dilution="25%" source="VC Tier-1" highlight />
        </div>
      </motion.div>
    </Section>
  );
}

function ChartCard({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="card-dark relative overflow-hidden rounded-2xl p-6"
    >
      <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="relative">
        <div className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-400">{eyebrow}</div>
        <h3 className="font-display text-2xl font-bold text-white">{title}</h3>
        <div className="text-xs text-zinc-500">{subtitle}</div>
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
}

function Mini({
  label,
  value,
  growth,
  highlight,
  tone,
}: {
  label: string;
  value: string;
  growth?: string;
  highlight?: boolean;
  tone?: "good" | "bad";
}) {
  const valColor =
    tone === "good"
      ? "text-brand-300"
      : tone === "bad"
      ? "text-rose-300"
      : highlight
      ? "text-gold-300"
      : "text-white";
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{label}</div>
      <div className={`mt-1 flex items-baseline gap-1.5 font-display font-bold ${valColor}`}>
        <span className="text-base">{value}</span>
        {growth && (
          <span className="inline-flex items-center text-[10px] font-mono text-brand-400">
            <ArrowUpRight className="h-3 w-3" />
            {growth}
          </span>
        )}
      </div>
    </div>
  );
}

function ScenarioMetric({
  label,
  value,
  unit,
  tone,
  primary,
}: {
  label: string;
  value: string;
  unit?: string;
  tone: string;
  primary?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-zinc-800 ${primary ? "bg-zinc-950" : "bg-zinc-900/40"} p-3`}>
      <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{label}</div>
      <div className={`mt-1 font-display font-bold ${primary ? `bg-linear-to-br ${tone} bg-clip-text text-transparent text-xl` : "text-white text-base"}`}>
        {value}
      </div>
      {unit && <div className="text-[10px] text-zinc-500">{unit}</div>}
    </div>
  );
}

function UnitCard({
  icon: Icon,
  eyebrow,
  title,
  rows,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  rows: { k: string; v: string }[];
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-colors hover:border-zinc-700"
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br ${accent} opacity-15 blur-3xl transition-opacity group-hover:opacity-30`} />
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-brand-300">
          <Icon className="h-4 w-4" />
        </div>
        <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-400">{eyebrow}</div>
        <div className={`mt-1 font-display text-xl font-bold bg-linear-to-br ${accent} bg-clip-text text-transparent`}>{title}</div>
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.k} className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5 text-xs last:border-0">
              <span className="text-zinc-500">{r.k}</span>
              <span className="font-medium text-zinc-200 tabular-nums">{r.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function UseOfFunds({ label, pct, value }: { label: string; pct: number; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{label}</span>
        <span className="font-mono text-xs font-semibold text-brand-300">{pct}%</span>
      </div>
      <div className="mt-1.5 font-display text-sm font-bold text-white">{value}</div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct * 2.5}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full bg-linear-to-r from-brand-400 to-gold-400"
        />
      </div>
    </div>
  );
}

function FundStage({
  stage,
  amount,
  timing,
  dilution,
  source,
  highlight,
}: {
  stage: string;
  amount: string;
  timing: string;
  dilution: string;
  source: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-brand-400/40 bg-brand-500/5"
          : "border-zinc-800 bg-zinc-950/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-400">{stage}</div>
        <Building2 className={`h-3.5 w-3.5 ${highlight ? "text-brand-300" : "text-zinc-600"}`} />
      </div>
      <div className="mt-2 font-display text-xl font-bold text-white">{amount}</div>
      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
        <span>{timing}</span>
        <span className="h-1 w-1 rounded-full bg-zinc-700" />
        <span>Dilusi {dilution}</span>
      </div>
      <div className="mt-2 text-xs text-zinc-400">{source}</div>
    </div>
  );
}

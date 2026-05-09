"use client";
import { BarList } from "@tremor/react";
import { formatIDRCompact } from "@/lib/money";

export function TransactionPreview({
  inflow,
  outflow,
}: {
  inflow: { name: string; value: number }[];
  outflow: { name: string; value: number }[];
}) {
  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-brand-400">Inflow 7 hari</div>
          <BarList
            className="mt-3"
            data={inflow.map((i) => ({ name: i.name, value: i.value }))}
            valueFormatter={(n: number) => formatIDRCompact(n)}
            color="emerald"
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-red-400">Outflow 7 hari</div>
          <BarList
            className="mt-3"
            data={outflow.map((i) => ({ name: i.name, value: i.value }))}
            valueFormatter={(n: number) => formatIDRCompact(n)}
            color="red"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-xl bg-linear-to-t from-zinc-950 via-zinc-950/85 to-transparent flex items-end justify-center pb-4">
        <span className="rounded-full bg-brand-500/20 px-4 py-1.5 text-xs text-brand-200 ring-1 ring-inset ring-brand-400/30">
          Investasikan Rp100rb untuk akses real-time penuh
        </span>
      </div>
    </div>
  );
}

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
    <div className="relative rounded-xl border border-zinc-200 bg-white p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-emerald-700">Inflow 7 hari</div>
          <BarList
            className="mt-3"
            data={inflow.map((i) => ({ name: i.name, value: i.value }))}
            valueFormatter={(n: number) => formatIDRCompact(n)}
            color="emerald"
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-red-700">Outflow 7 hari</div>
          <BarList
            className="mt-3"
            data={outflow.map((i) => ({ name: i.name, value: i.value }))}
            valueFormatter={(n: number) => formatIDRCompact(n)}
            color="red"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-xl bg-gradient-to-t from-white via-white/85 to-transparent flex items-end justify-center pb-4">
        <span className="rounded-full bg-zinc-900/90 px-4 py-1.5 text-xs text-white">
          🔒 Investasikan Rp100rb untuk akses real-time penuh
        </span>
      </div>
    </div>
  );
}

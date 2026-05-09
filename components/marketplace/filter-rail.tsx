"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { sectorOptions } from "@/lib/labels";

export function FilterRail() {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const sectors = (sp.get("sector") ?? "").split(",").filter(Boolean);
  const minScore = Number(sp.get("minScore") ?? 0);
  const syariah = sp.get("syariah") === "1";
  const sort = sp.get("sort") ?? "score";

  function update(next: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === "" || v === "0") params.delete(k);
      else params.set(k, v);
    }
    start(() => router.replace(`${path}?${params.toString()}`));
  }

  function toggleSector(s: string) {
    const next = sectors.includes(s) ? sectors.filter((x) => x !== s) : [...sectors, s];
    update({ sector: next.join(",") || null });
  }

  return (
    <aside className={`space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur ${pending ? "opacity-70" : ""}`}>
      <div>
        <h3 className="text-sm font-semibold text-white">Sektor</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {sectorOptions.map((o) => {
            const on = sectors.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleSector(o.value)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${on ? "border-brand-500 bg-brand-500 text-zinc-950" : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-brand-400 hover:text-brand-300"}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Min AI Score: <span className="text-brand-400">{minScore}</span></h3>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={minScore}
          onChange={(e) => update({ minScore: e.target.value })}
          className="mt-3 w-full accent-brand-500"
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm font-semibold text-white">Hanya Syariah</span>
          <input
            type="checkbox"
            checked={syariah}
            onChange={(e) => update({ syariah: e.target.checked ? "1" : null })}
            className="h-4 w-4 accent-brand-500"
          />
        </label>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Urutkan</h3>
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="score">AI Score tertinggi</option>
          <option value="progress">Progress pendanaan</option>
          <option value="deadline">Deadline terdekat</option>
          <option value="newest">Terbaru</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => start(() => router.replace(path))}
        className="w-full rounded-md border border-zinc-800 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800/60"
      >
        Reset filter
      </button>
    </aside>
  );
}

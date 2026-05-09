"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatIDRCompact } from "@/lib/money";

type Item = {
  id: string;
  ts: string;
  amountIDR: number;
  kind: "INFLOW" | "OUTFLOW";
  channel: string;
  counterparty: string;
  umkmId: string;
  umkmName: string;
};

const FAKE_CHANNELS_IN = ["QRIS", "Transfer", "QRIS"];
const FAKE_CHANNELS_OUT = ["Supplier", "Payroll", "Logistik"];
const FAKE_PARTIES_IN = ["Pelanggan QRIS", "Reseller", "Marketplace"];
const FAKE_PARTIES_OUT = ["PLN Pascabayar", "JNE Express", "Iklan Meta Ads"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function LiveActivityFeed({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);

  useEffect(() => {
    if (!initial.length) return;
    const id = setInterval(() => {
      const sample = initial[Math.floor(Math.random() * initial.length)];
      const isInflow = Math.random() < 0.6;
      const newItem: Item = {
        id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ts: new Date().toISOString(),
        amountIDR: Math.floor(Math.random() * 5_000_000) + 10_000,
        kind: isInflow ? "INFLOW" : "OUTFLOW",
        channel: isInflow ? pick(FAKE_CHANNELS_IN) : pick(FAKE_CHANNELS_OUT),
        counterparty: isInflow ? pick(FAKE_PARTIES_IN) : pick(FAKE_PARTIES_OUT),
        umkmId: sample.umkmId,
        umkmName: sample.umkmName,
      };
      setItems((cur) => [newItem, ...cur].slice(0, 50));
    }, 8000);
    return () => clearInterval(id);
  }, [initial]);

  if (!items.length) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        Belum ada aktivitas. Investasikan ke UMKM untuk melihat transaksi mereka di sini.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 text-xs">
        <span className="font-semibold text-zinc-900">Live Activity (simulated)</span>
        <span className="flex items-center gap-2 text-zinc-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Streaming
        </span>
      </div>
      <ul className="max-h-96 divide-y divide-zinc-100 overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 px-5 py-3 text-sm"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${t.kind === "INFLOW" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {t.kind === "INFLOW" ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-medium text-zinc-900">{t.umkmName}</span>
                  <span className={`font-semibold ${t.kind === "INFLOW" ? "text-emerald-700" : "text-red-600"}`}>
                    {t.kind === "INFLOW" ? "+" : "-"}{formatIDRCompact(t.amountIDR)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-3 text-xs text-zinc-500">
                  <span className="truncate">{t.counterparty} · {t.channel}</span>
                  <time>{new Date(t.ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</time>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

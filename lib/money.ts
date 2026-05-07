const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatIDR(n: number): string {
  return idr.format(Math.round(n));
}

export function formatIDRCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000_000) return `${sign}Rp${formatNum(abs / 1_000_000_000_000)} t`;
  if (abs >= 1_000_000_000) return `${sign}Rp${formatNum(abs / 1_000_000_000)} mlr`;
  if (abs >= 1_000_000) return `${sign}Rp${formatNum(abs / 1_000_000)} jt`;
  if (abs >= 1_000) return `${sign}Rp${formatNum(abs / 1_000)} rb`;
  return `${sign}Rp${Math.round(abs)}`;
}

function formatNum(n: number): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

export function parseIDR(input: string): number {
  return Number(input.replace(/[^\d-]/g, "")) || 0;
}

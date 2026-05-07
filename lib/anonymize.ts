function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return h >>> 0;
}

export function anonymizeCounterparty(name: string): string {
  const code = djb2(name).toString(36).slice(0, 4).toUpperCase();
  return `Pelanggan #${code}`;
}

// Server-side query helpers — no DB. Reads in-memory seed.
import { transactions, umkms, pitches, bankAccounts, investments, reimbursements, users, communityPosts } from "@/data/seed";
import type { DemoUMKM, DemoTransaction, DemoInvestment } from "@/data/seed";
import type { Sector, TxnKind } from "@/lib/enums";

export type ListUMKMOpts = {
  sectors?: string[];
  minScore?: number;
  syariah?: boolean;
  sort?: "score" | "newest" | "deadline" | "progress";
  page?: number;
  pageSize?: number;
  approvedOnly?: boolean;
};

export function listUMKMs(opts: ListUMKMOpts = {}) {
  const { sectors = [], minScore = 0, syariah, sort = "score", page = 1, pageSize = 12, approvedOnly = true } = opts;
  let out = [...umkms];
  if (approvedOnly) {
    const approved = new Set(pitches.filter((p) => p.status === "APPROVED").map((p) => p.umkmId));
    out = out.filter((u) => approved.has(u.id));
  }
  if (sectors.length) out = out.filter((u) => sectors.includes(u.sector));
  if (minScore) out = out.filter((u) => (u.aiScoreOverride ?? u.aiScore) >= minScore);
  if (syariah) out = out.filter((u) => u.syariahCompliant);

  out.sort((a, b) => {
    if (sort === "newest") return b.id.localeCompare(a.id);
    if (sort === "deadline") {
      const ad = pitches.find((p) => p.umkmId === a.id)?.deadline ?? "";
      const bd = pitches.find((p) => p.umkmId === b.id)?.deadline ?? "";
      return ad.localeCompare(bd);
    }
    if (sort === "progress") {
      const ar = pitches.find((p) => p.umkmId === a.id)?.raisedIDR ?? 0;
      const br = pitches.find((p) => p.umkmId === b.id)?.raisedIDR ?? 0;
      return br - ar;
    }
    return (b.aiScoreOverride ?? b.aiScore) - (a.aiScoreOverride ?? a.aiScore);
  });

  const total = out.length;
  const sliced = out.slice((page - 1) * pageSize, page * pageSize);
  return { items: sliced, total };
}

export function getUMKM(id: string): DemoUMKM | undefined {
  return umkms.find((u) => u.id === id);
}

export function getPitch(umkmId: string) {
  return pitches.find((p) => p.umkmId === umkmId);
}

export function getBankAccount(umkmId: string) {
  return bankAccounts.find((b) => b.umkmId === umkmId);
}

export function getTransactionsByUMKM(umkmId: string, limit = 100): DemoTransaction[] {
  return transactions.filter((t) => t.umkmId === umkmId).slice(0, limit);
}

export function getRecentTransactions(umkmIds: string[], limit = 30): DemoTransaction[] {
  if (!umkmIds.length) return [];
  const set = new Set(umkmIds);
  return transactions.filter((t) => set.has(t.umkmId)).slice(0, limit);
}

export function getInvestmentsByInvestor(investorId: string): DemoInvestment[] {
  return investments.filter((i) => i.investorId === investorId);
}

export function getInvestmentsByUMKM(umkmId: string): DemoInvestment[] {
  return investments.filter((i) => i.umkmId === umkmId);
}

export function aggregateHoldings(investorId: string) {
  const ours = getInvestmentsByInvestor(investorId);
  const map = new Map<string, { umkmId: string; amountIDR: number; equityPct: number; count: number }>();
  for (const i of ours) {
    const existing = map.get(i.umkmId) ?? { umkmId: i.umkmId, amountIDR: 0, equityPct: 0, count: 0 };
    existing.amountIDR += i.amountIDR;
    existing.equityPct += i.equityPct;
    existing.count += 1;
    map.set(i.umkmId, existing);
  }
  return [...map.values()];
}

export function getReimbursementsByUMKM(umkmId: string) {
  return reimbursements
    .filter((r) => r.umkmId === umkmId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getReimbursementsByStatus(statuses: string[]) {
  return reimbursements
    .filter((r) => statuses.includes(r.status))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUserById(id: string) {
  return users.find((u) => u.id === id);
}

export function getOwnedUMKM(ownerId: string) {
  return umkms.find((u) => u.ownerId === ownerId);
}

export function getCommunityPosts(umkmId: string) {
  return communityPosts
    .filter((p) => p.umkmId === umkmId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function platformMetrics() {
  const totalAum = investments.reduce((s, i) => s + i.amountIDR, 0);
  const fundedSet = new Set(investments.map((i) => i.umkmId));
  const since30 = Date.now() - 30 * 86_400_000;
  const gmv30 = transactions
    .filter((t) => t.kind === ("INFLOW" as TxnKind) && new Date(t.ts).getTime() >= since30)
    .reduce((s, t) => s + t.amountIDR, 0);
  const investorCount = users.filter((u) => u.role === "INVESTOR").length;
  const avgScore = Math.round(umkms.reduce((s, u) => s + (u.aiScoreOverride ?? u.aiScore), 0) / umkms.length);
  const successFee = Math.round(totalAum * 0.05);
  return { totalAum, umkmFunded: fundedSet.size, investorCount, gmv30, avgScore, successFee };
}

export function suggestUMKM(excludeIds: string[], limit = 3) {
  const set = new Set(excludeIds);
  return [...umkms]
    .filter((u) => !set.has(u.id))
    .sort((a, b) => (b.aiScoreOverride ?? b.aiScore) - (a.aiScoreOverride ?? a.aiScore))
    .slice(0, limit);
}

export { umkms, pitches, bankAccounts, transactions, users, investments, reimbursements, communityPosts };

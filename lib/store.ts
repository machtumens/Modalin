"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ClientInvestment = {
  id: string;
  umkmId: string;
  umkmName: string;
  amountIDR: number;
  equityPct: number;
  createdAt: string;
};

export type ClientReimbursement = {
  id: string;
  umkmId: string;
  amountIDR: number;
  category: string;
  description: string;
  supplier?: string;
  refPriceIDR: number;
  deltaPct: number;
  verdict: "OK" | "OVER" | "REVIEW";
  status: "AUTO_APPROVED" | "PENDING_ADMIN_REVIEW" | "BLOCKED_PRICE_CHECK" | "DISBURSED" | "REJECTED";
  createdAt: string;
};

type DemoState = {
  investments: ClientInvestment[];
  reimbursements: ClientReimbursement[];
  addInvestment: (i: Omit<ClientInvestment, "id" | "createdAt">) => ClientInvestment;
  addReimbursement: (r: Omit<ClientReimbursement, "id" | "createdAt">) => ClientReimbursement;
  reset: () => void;
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      investments: [],
      reimbursements: [],
      addInvestment: (i) => {
        const created: ClientInvestment = {
          ...i,
          id: `cli-inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set({ investments: [...get().investments, created] });
        return created;
      },
      addReimbursement: (r) => {
        const created: ClientReimbursement = {
          ...r,
          id: `cli-rb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set({ reimbursements: [...get().reimbursements, created] });
        return created;
      },
      reset: () => set({ investments: [], reimbursements: [] }),
    }),
    { name: "modalin-demo-store" }
  )
);

export interface ScoreInput {
  monthlyRevenueIDR: number;
  ageMonths: number;
  sliKScore: number;
  ecomVelocity: number;
  digitalBehavior: number;
  sector: string;
}

const SECTOR_OUTLOOK: Record<string, number> = {
  F_AND_B: 78,
  RETAIL: 70,
  AGRI: 75,
  SERVICES: 72,
};

export function scoreUMKM(input: ScoreInput): {
  total: number;
  components: Record<string, number>;
} {
  const slik = clamp(input.sliKScore);
  const ecom = clamp(input.ecomVelocity);
  const behavior = clamp(input.digitalBehavior);
  const sectorOutlook = SECTOR_OUTLOOK[input.sector] ?? 65;

  const ageNorm = clamp((Math.min(input.ageMonths, 36) / 36) * 100);
  const revenueNorm = clamp((Math.log10(Math.max(input.monthlyRevenueIDR, 1_000_000)) - 6) * 33);
  const revAge = (ageNorm + revenueNorm) / 2;

  const total =
    slik * 0.30 +
    ecom * 0.25 +
    behavior * 0.20 +
    revAge * 0.15 +
    sectorOutlook * 0.10;

  return {
    total: Math.round(clamp(total)),
    components: {
      slik: Math.round(slik),
      ecommerce: Math.round(ecom),
      behavior: Math.round(behavior),
      revenueAge: Math.round(revAge),
      sectorOutlook: Math.round(sectorOutlook),
    },
  };
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

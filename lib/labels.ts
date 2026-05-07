export const sectorLabel: Record<string, string> = {
  F_AND_B: "F&B",
  RETAIL: "Retail",
  AGRI: "Agri",
  SERVICES: "Jasa",
};

export const sectorOptions: { value: string; label: string }[] = [
  { value: "F_AND_B", label: "F&B" },
  { value: "RETAIL", label: "Retail" },
  { value: "AGRI", label: "Agri" },
  { value: "SERVICES", label: "Jasa" },
];

export function aiBadgeVariant(score: number): "success" | "warning" | "muted" {
  if (score >= 80) return "success";
  if (score >= 65) return "warning";
  return "muted";
}

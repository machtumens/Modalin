import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDRCompact } from "@/lib/money";
import { aiBadgeVariant, sectorLabel } from "@/lib/labels";

export interface UMKMCardData {
  id: string;
  name: string;
  sector: string;
  location: string;
  province: string;
  syariahCompliant: boolean;
  aiScore: number;
  fundingTargetIDR: number;
  raisedIDR: number;
  daysLeft: number;
}

export function UMKMCard({ d }: { d: UMKMCardData }) {
  const pct = Math.min(100, Math.round((d.raisedIDR / d.fundingTargetIDR) * 100));
  return (
    <Link href={`/marketplace/${d.id}`} className="group">
      <Card className="overflow-hidden transition-shadow group-hover:shadow-md">
        <div className="relative h-32 bg-gradient-to-br from-brand-100 via-brand-50 to-amber-50">
          <div className="absolute right-3 top-3 flex items-center gap-1">
            <Badge variant={aiBadgeVariant(d.aiScore)}>AI {d.aiScore}</Badge>
            {d.syariahCompliant && <Badge variant="success">Syariah</Badge>}
          </div>
          <div className="absolute bottom-3 left-4 font-display text-xl font-semibold text-zinc-900">
            {d.name}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.location}</span>
            <span>{sectorLabel[d.sector] ?? d.sector}</span>
          </div>
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-brand-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-900">{formatIDRCompact(d.raisedIDR)} <span className="text-zinc-500">/ {formatIDRCompact(d.fundingTargetIDR)}</span></span>
              <span className="text-zinc-500">{pct}%</span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">{d.daysLeft} hari lagi · Bagi hasil ekuitas</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

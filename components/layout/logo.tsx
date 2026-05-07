import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-xl font-bold tracking-tight bg-gradient-to-r from-brand-700 to-gold-500 bg-clip-text text-transparent",
        className
      )}
    >
      Modalin
    </span>
  );
}

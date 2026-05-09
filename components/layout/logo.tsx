import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

export function Logo({
  className,
  withTagline = false,
  size = "sm",
}: {
  className?: string;
  withTagline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const markSize = size === "lg" ? 56 : size === "md" ? 40 : 32;
  const wordCls = size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-xl";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={markSize} />
      <div className="flex flex-col leading-none">
        <span className={cn("font-display font-bold tracking-tight text-white", wordCls)}>
          modalin
        </span>
        {withTagline && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            Invest · Grow · Impact
          </span>
        )}
      </div>
    </div>
  );
}

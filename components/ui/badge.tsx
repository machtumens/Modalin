import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-500 text-zinc-950",
        secondary: "border-transparent bg-zinc-800 text-zinc-100",
        outline: "text-zinc-200 border-zinc-700",
        success: "border-transparent bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-400/30",
        warning: "border-transparent bg-gold-500/15 text-gold-300 ring-1 ring-inset ring-gold-400/30",
        muted: "border-transparent bg-zinc-800/80 text-zinc-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

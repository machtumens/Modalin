"use client";
import { useState } from "react";
import Image from "next/image";
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
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {imgFailed ? (
        <LogoMark size={markSize} />
      ) : (
        <Image
          src="/modalin-logo.png"
          alt="Modalin"
          width={markSize}
          height={markSize}
          priority={size !== "sm"}
          className="object-contain"
          onError={() => setImgFailed(true)}
        />
      )}
      <div className="flex flex-col leading-none">
        <span className={cn("font-display font-bold tracking-tight text-zinc-900", wordCls)}>
          modalin
        </span>
        {withTagline && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Invest · Grow · Impact
          </span>
        )}
      </div>
    </div>
  );
}

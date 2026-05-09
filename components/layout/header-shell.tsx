"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      {children}
    </header>
  );
}

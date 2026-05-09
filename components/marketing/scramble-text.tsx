"use client";
import { useEffect, useRef, useState } from "react";

const CHARS = "АΛΔΣ#$@!?*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function ScrambleText({ text, className, trigger = true }: { text: string; className?: string; trigger?: boolean }) {
  const [out, setOut] = useState(text);
  const ran = useRef(false);

  useEffect(() => {
    if (!trigger || ran.current) return;
    ran.current = true;
    let i = 0;
    const total = text.length;
    const interval = setInterval(() => {
      const reveal = Math.min(total, Math.floor(i / 2));
      const noise = text
        .split("")
        .map((c, idx) => {
          if (idx < reveal) return c;
          if (c === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setOut(noise);
      i++;
      if (reveal >= total) {
        setOut(text);
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span className={className}>{out}</span>;
}

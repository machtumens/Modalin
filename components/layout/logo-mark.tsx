import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn("shrink-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]", className)}
      role="img"
      aria-label="Modalin"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <radialGradient id="bgGrad" cx="0.3" cy="0.2" r="0.9">
          <stop offset="0%" stopColor="#134e4a" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
      </defs>
      <rect x="10" y="10" width="180" height="180" rx="42" fill="url(#bgGrad)" stroke="rgba(251,191,36,0.5)" strokeWidth="2" />
      {/* Stylised M */}
      <path
        d="M 50 145 L 50 60 L 75 60 L 100 110 L 125 60 L 150 60 L 150 145 L 130 145 L 130 95 L 110 135 L 90 135 L 70 95 L 70 145 Z"
        fill="url(#goldGrad)"
      />
      {/* Teal accent stroke under M valley */}
      <path
        d="M 70 150 L 100 145 L 130 150"
        stroke="url(#tealGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sparkle dot */}
      <circle cx="100" cy="40" r="4" fill="#fde68a" />
    </svg>
  );
}

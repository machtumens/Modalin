import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Modalin"
    >
      <defs>
        <linearGradient id="modL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#71717a" />
        </linearGradient>
        <linearGradient id="modR" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#d4d4d8" />
        </linearGradient>
      </defs>
      {/* Left figure head */}
      <circle cx="55" cy="38" r="16" fill="url(#modL)" />
      {/* Right figure head */}
      <circle cx="145" cy="38" r="16" fill="url(#modR)" />
      {/* Sparkle between */}
      <path d="M100 50 L104 60 L114 64 L104 68 L100 78 L96 68 L86 64 L96 60 Z" fill="#71717a" />
      {/* Left M leg (figure body) */}
      <path d="M30 70 Q40 60 60 60 L60 170 Q60 180 50 180 L30 180 Q20 180 20 170 Z" fill="url(#modL)" opacity="0.85" />
      {/* Center M valley */}
      <path d="M60 60 L100 130 L140 60 L140 80 L100 145 L60 80 Z" fill="url(#modL)" opacity="0.55" />
      {/* Right M leg with bar chart accent */}
      <path d="M170 70 Q160 60 140 60 L140 170 Q140 180 150 180 L170 180 Q180 180 180 170 Z" fill="url(#modR)" />
      {/* Bar chart bars on right */}
      <rect x="148" y="155" width="6" height="12" rx="1" fill="#3f3f46" />
      <rect x="158" y="148" width="6" height="19" rx="1" fill="#3f3f46" />
      <rect x="168" y="140" width="6" height="27" rx="1" fill="#3f3f46" />
    </svg>
  );
}

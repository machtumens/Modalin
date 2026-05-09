"use client";
import confetti from "canvas-confetti";

export function fireConfettiAt(x: number, y: number) {
  const origin = {
    x: x / window.innerWidth,
    y: y / window.innerHeight,
  };
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 40,
    origin,
    colors: ["#fbbf24", "#fde68a", "#2dd4bf", "#fef3c7", "#d97706"],
    scalar: 0.9,
    ticks: 200,
  });
  confetti({
    particleCount: 40,
    spread: 110,
    startVelocity: 55,
    origin,
    colors: ["#fbbf24", "#2dd4bf"],
    shapes: ["star"],
    scalar: 1.2,
    ticks: 220,
  });
}

export function ConfettiClick({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      onClick={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        fireConfettiAt(r.left + r.width / 2, r.top + r.height / 2);
      }}
    >
      {children}
    </span>
  );
}

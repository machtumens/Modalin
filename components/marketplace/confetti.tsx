"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export function Confetti() {
  useEffect(() => {
    const fire = () => {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 }, colors: ["#0f766e", "#f59e0b", "#fbbf24"] });
      confetti({ particleCount: 60, spread: 100, startVelocity: 50, origin: { y: 0.6 }, colors: ["#0f766e", "#f59e0b"] });
    };
    fire();
  }, []);
  return null;
}

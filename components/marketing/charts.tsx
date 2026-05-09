"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type StackRow = { tahun: string; segments: { key: string; value: number; color: string }[] };

export function StackedBars({
  data,
  height = 280,
  formatValue,
}: {
  data: StackRow[];
  height?: number;
  formatValue?: (n: number) => string;
}) {
  const max = Math.max(...data.map((r) => r.segments.reduce((s, x) => s + x.value, 0)));
  const stepCount = 4;
  const yStep = niceStep(max, stepCount);
  const yMax = yStep * stepCount;
  const padL = 56;
  const padR = 12;
  const padT = 10;
  const padB = 28;
  const w = 600;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const barW = innerW / data.length / 1.6;

  const fmt = formatValue ?? ((n) => n.toLocaleString("id-ID"));
  const [hover, setHover] = useState<number | null>(null);

  const allKeys = data[0]?.segments.map((s) => s.key) ?? [];
  const colorMap = Object.fromEntries(data[0]?.segments.map((s) => [s.key, s.color]) ?? []);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* gridlines + y labels */}
        {Array.from({ length: stepCount + 1 }).map((_, i) => {
          const v = yStep * (stepCount - i);
          const y = padT + (i * innerH) / stepCount;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="rgba(63,63,70,0.5)" strokeDasharray={i === stepCount ? "0" : "2 4"} />
              <text x={padL - 8} y={y + 4} textAnchor="end" className="fill-zinc-500" style={{ fontSize: 10, fontFamily: "ui-monospace" }}>
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {data.map((row, i) => {
          const cx = padL + (innerW / data.length) * (i + 0.5);
          let acc = 0;
          return (
            <g key={row.tahun}
               onMouseEnter={() => setHover(i)}
               onMouseLeave={() => setHover(null)}
               style={{ cursor: "pointer" }}>
              {row.segments.map((seg) => {
                const segH = (seg.value / yMax) * innerH;
                const y = padT + innerH - acc - segH;
                acc += segH;
                return (
                  <motion.rect
                    key={seg.key}
                    x={cx - barW / 2}
                    width={barW}
                    initial={{ y: padT + innerH, height: 0 }}
                    whileInView={{ y, height: segH }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 * i }}
                    fill={seg.color}
                    rx={3}
                    style={{
                      filter: hover === i ? "brightness(1.25) drop-shadow(0 0 12px currentColor)" : "none",
                      transition: "filter 0.2s",
                    }}
                  />
                );
              })}
              <text x={cx} y={height - 8} textAnchor="middle" className="fill-zinc-300" style={{ fontSize: 12, fontWeight: 600 }}>
                {row.tahun}
              </text>
            </g>
          );
        })}

        {/* hover total label */}
        {hover !== null && (() => {
          const total = data[hover].segments.reduce((s, x) => s + x.value, 0);
          const cx = padL + (innerW / data.length) * (hover + 0.5);
          const y = padT + innerH - (total / yMax) * innerH - 8;
          return (
            <g>
              <rect x={cx - 40} y={y - 18} width={80} height={20} rx={4} fill="rgba(9,9,11,0.95)" stroke="rgba(251,191,36,0.5)" />
              <text x={cx} y={y - 4} textAnchor="middle" className="fill-gold-300" style={{ fontSize: 11, fontWeight: 700, fontFamily: "ui-monospace" }}>
                {fmt(total)}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* legend */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        {allKeys.map((k) => (
          <div key={k} className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colorMap[k] }} />
            {k}
          </div>
        ))}
      </div>
    </div>
  );
}

type AreaRow = { tahun: string; revenue: number; opex: number };

export function RevenueOpexChart({
  data,
  height = 280,
  formatValue,
}: {
  data: AreaRow[];
  height?: number;
  formatValue?: (n: number) => string;
}) {
  const all = data.flatMap((r) => [r.revenue, r.opex]);
  const max = Math.max(...all);
  const stepCount = 4;
  const yStep = niceStep(max, stepCount);
  const yMax = yStep * stepCount;
  const padL = 56;
  const padR = 12;
  const padT = 10;
  const padB = 28;
  const w = 600;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const fmt = formatValue ?? ((n) => n.toLocaleString("id-ID"));

  const x = (i: number) => padL + (innerW / (data.length - 1)) * i;
  const y = (v: number) => padT + innerH - (v / yMax) * innerH;

  const revPath = data.map((r, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(r.revenue)}`).join(" ");
  const opexPath = data.map((r, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(r.opex)}`).join(" ");
  const revArea = `${revPath} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const opexArea = `${opexPath} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${w} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="opexFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: stepCount + 1 }).map((_, i) => {
          const v = yStep * (stepCount - i);
          const yp = padT + (i * innerH) / stepCount;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={yp} y2={yp} stroke="rgba(63,63,70,0.5)" strokeDasharray={i === stepCount ? "0" : "2 4"} />
              <text x={padL - 8} y={yp + 4} textAnchor="end" className="fill-zinc-500" style={{ fontSize: 10, fontFamily: "ui-monospace" }}>
                {fmt(v)}
              </text>
            </g>
          );
        })}

        <motion.path
          d={opexArea}
          fill="url(#opexFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        <motion.path
          d={opexPath}
          fill="none"
          stroke="#fb7185"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.path
          d={revArea}
          fill="url(#revFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.path
          d={revPath}
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />

        {data.map((r, i) => (
          <g key={r.tahun}>
            <rect
              x={x(i) - innerW / data.length / 2}
              y={padT}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              style={{ cursor: "pointer" }}
            />
            <circle cx={x(i)} cy={y(r.revenue)} r={4} fill="#2dd4bf" stroke="#09090b" strokeWidth={2} />
            <circle cx={x(i)} cy={y(r.opex)} r={4} fill="#fb7185" stroke="#09090b" strokeWidth={2} />
            <text x={x(i)} y={height - 8} textAnchor="middle" className="fill-zinc-300" style={{ fontSize: 12, fontWeight: 600 }}>
              {r.tahun}
            </text>
          </g>
        ))}

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} stroke="rgba(251,191,36,0.4)" strokeDasharray="2 4" />
            <rect x={Math.min(x(hover) + 8, w - 130)} y={padT} width={120} height={50} rx={6} fill="rgba(9,9,11,0.95)" stroke="rgba(251,191,36,0.5)" />
            <text x={Math.min(x(hover) + 18, w - 120)} y={padT + 16} className="fill-brand-300" style={{ fontSize: 11, fontFamily: "ui-monospace" }}>
              Rev: {fmt(data[hover].revenue)}
            </text>
            <text x={Math.min(x(hover) + 18, w - 120)} y={padT + 34} className="fill-rose-300" style={{ fontSize: 11, fontFamily: "ui-monospace" }}>
              OPEX: {fmt(data[hover].opex)}
            </text>
          </g>
        )}
      </svg>

      <div className="mt-2 flex gap-4 text-[11px]">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-400" /> Revenue
        </div>
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" /> OPEX
        </div>
      </div>
    </div>
  );
}

function niceStep(max: number, steps: number) {
  const raw = max / steps;
  const exp = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / exp;
  let nice;
  if (norm < 1.5) nice = 1;
  else if (norm < 3) nice = 2;
  else if (norm < 7) nice = 5;
  else nice = 10;
  return nice * exp;
}

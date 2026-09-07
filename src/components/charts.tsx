"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

// smooth path helper (catmull-rom → bezier)
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function AreaChart({ data, labels, color = "#818cf8", height = 190, format = (v: number) => String(v) }: {
  data: number[]; labels?: string[]; color?: string; height?: number; format?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = 220, P = 12;
  const max = Math.max(...data) * 1.12, min = Math.min(...data) * 0.85;
  const pts = data.map((v, i) => ({ x: P + (i / (data.length - 1)) * (W - P * 2), y: H - 24 - ((v - min) / (max - min)) * (H - 48) }));
  const line = useMemo(() => smoothPath(pts), [data]);
  const area = `${line} L ${pts[pts.length - 1].x} ${H - 24} L ${pts[0].x} ${H - 24} Z`;
  const gid = useMemo(() => "g" + Math.random().toString(36).slice(2, 8), []);
  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W;
          let best = 0, bd = 1e9;
          pts.forEach((p, i) => { const d = Math.abs(p.x - x); if (d < bd) { bd = d; best = i; } });
          setHover(best);
        }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={P} x2={W - P} y1={H * f} y2={H * f} stroke="rgba(148,163,184,.09)" strokeDasharray="3 5" />
        ))}
        <motion.path d={area} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} />
        <motion.path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}66)` }} />
        {hover !== null && (
          <g>
            <line x1={pts[hover].x} x2={pts[hover].x} y1={20} y2={H - 24} stroke={color} strokeOpacity="0.4" />
            <circle cx={pts[hover].x} cy={pts[hover].y} r="5" fill={color} stroke="#06090f" strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div className="absolute pointer-events-none glass-strong rounded-lg px-3 py-1.5 text-xs -translate-x-1/2 -translate-y-full"
          style={{ left: `${(pts[hover].x / 640) * 100}%`, top: `${(pts[hover].y / 220) * 100}%`, marginTop: -10 }}>
          <span className="text-white font-semibold">{format(data[hover])}</span>
          {labels && <span className="text-slate-400 ml-1.5">{labels[hover]}</span>}
        </div>
      )}
      {labels && (
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
          {labels.map((l, i) => <span key={i} className={i % 2 ? "hidden md:block" : ""}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

export function BarChart({ data, labels, color = "#22d3ee", height = 180, format = (v: number) => String(v) }: {
  data: number[]; labels: string[]; color?: string; height?: number; format?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data) * 1.15;
  return (
    <div className="w-full" style={{ height: height + 22 }}>
      <div className="flex items-end gap-2 md:gap-3 h-full relative">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            {hover === i && <div className="glass-strong rounded-md px-2 py-0.5 text-[10px] text-white absolute z-10" style={{ bottom: `${(v / max) * 82 + 12}%` }}>{format(v)}</div>}
            <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 82}%` }} transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[42px] rounded-t-lg"
              style={{ background: `linear-gradient(180deg, ${color}, ${color}30)`, boxShadow: hover === i ? `0 0 18px ${color}66` : "none" }} />
            <span className="text-[10px] text-slate-500">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Donut({ value, size = 120, stroke = 11, color = "#34d399", label, sub, track = "rgba(148,163,184,.12)" }: {
  value: number; size?: number; stroke?: number; color?: string; label?: string; sub?: string; track?: string;
}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }} style={{ filter: `drop-shadow(0 0 6px ${color}66)` }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display font-bold text-white" style={{ fontSize: size * 0.21 }}>{label ?? `${Math.round(value)}%`}</div>
          {sub && <div className="text-[10px] text-slate-400 -mt-0.5">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export function Sparkline({ data, color = "#818cf8", width = 110, height = 34 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * width, y: height - 3 - ((v - min) / (max - min || 1)) * (height - 6) }));
  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
    </svg>
  );
}

export function HBar({ label, pct, color = "#818cf8", right }: { label: string; pct: number; color?: string; right?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-28 truncate shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/6 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
      <span className="text-xs font-medium text-slate-300 w-12 text-right">{right ?? `${pct}%`}</span>
    </div>
  );
}

export function HeatRow({ values, labels, color = "#818cf8" }: { values: number[]; labels: string[]; color?: string }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {values.map((v, i) => (
        <div key={i} className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            className="h-9 rounded-lg grid place-items-center text-[11px] font-medium"
            style={{ background: `${color}${Math.round(10 + v * 0.75).toString(16).padStart(2, "0")}`, color: v > 0.55 ? "#fff" : "#94a3b8" }}>
            {Math.round(v * 100)}
          </motion.div>
          <span className="text-[10px] text-slate-500 mt-1 block">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

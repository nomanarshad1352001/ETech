"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { initials, toneOf } from "@/lib/data";

// ─── motion presets ─────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } }),
};
export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } };

// ─── Card ───────────────────────────────────────────────────
export function Card({ className = "", children, hover = false, onClick }: { className?: string; children: React.ReactNode; hover?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`glass rounded-2xl ${hover ? "hover-lift cursor-pointer" : ""} ${className}`}>{children}</div>
  );
}

export function SectionTitle({ icon, title, sub, right }: { icon?: React.ReactNode; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-start gap-3">
        {icon && <div className="w-9 h-9 rounded-xl glass-soft grid place-items-center text-indigo-300 shrink-0">{icon}</div>}
        <div>
          <h2 className="font-display font-semibold text-lg text-white leading-tight">{title}</h2>
          {sub && <p className="text-[13px] text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

// ─── Badge ──────────────────────────────────────────────────
const BADGE_TONES: Record<string, string> = {
  green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
  red: "bg-rose-400/10 text-rose-300 border-rose-400/25",
  amber: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  blue: "bg-sky-400/10 text-sky-300 border-sky-400/25",
  violet: "bg-violet-400/10 text-violet-300 border-violet-400/25",
  cyan: "bg-cyan-400/10 text-cyan-300 border-cyan-400/25",
  slate: "bg-slate-400/10 text-slate-300 border-slate-400/25",
  pink: "bg-pink-400/10 text-pink-300 border-pink-400/25",
};
export function Badge({ tone = "slate", children, dot = false }: { tone?: string; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${BADGE_TONES[tone]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-soft" />}
      {children}
    </span>
  );
}

// ─── Button ─────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", size = "md", icon, disabled = false, className = "", type = "button" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "outline" | "danger" | "success"; size?: "sm" | "md" | "lg"; icon?: React.ReactNode; disabled?: boolean; className?: string; type?: "button" | "submit";
}) {
  const base = "btn-sheen inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none select-none";
  const sizes = { sm: "text-xs px-3 py-2", md: "text-sm px-4 py-2.5", lg: "text-sm px-6 py-3.5" };
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right text-white shadow-lg shadow-indigo-500/25",
    ghost: "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
    outline: "border border-indigo-400/40 text-indigo-300 hover:bg-indigo-400/10",
    danger: "bg-rose-500/15 border border-rose-400/30 text-rose-300 hover:bg-rose-500/25",
    success: "bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25",
  };
  return (
    <motion.button type={type} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {icon}{children}
    </motion.button>
  );
}

// ─── Progress ───────────────────────────────────────────────
export function Progress({ value, color = "#818cf8", className = "", height = 8 }: { value: number; color?: string; className?: string; height?: number }) {
  return (
    <div className={`w-full rounded-full bg-white/6 overflow-hidden ${className}`} style={{ height }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, value)}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}dd)`, boxShadow: `0 0 12px ${color}55` }} />
    </div>
  );
}

// ─── Counter (animated number) ──────────────────────────────
export function Counter({ to, decimals = 0, prefix = "", suffix = "", className = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const [txt, setTxt] = useState("0");
  useEffect(() => { mv.set(to); }, [to, mv]);
  useEffect(() => {
    const unsub = spring.on("change", (v) => setTxt(v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })));
    return unsub;
  }, [spring, decimals]);
  return <span className={className}>{prefix}{txt}{suffix}</span>;
}

// ─── Avatar ─────────────────────────────────────────────────
export function Avatar({ name, id, size = 38, ring = false }: { name: string; id?: string; size?: number; ring?: boolean }) {
  return (
    <div className={`rounded-full grid place-items-center font-display font-semibold text-white bg-gradient-to-br ${toneOf(id ?? name)} ${ring ? "ring-2 ring-white/20" : ""} shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials(name)}
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center p-4"
          style={{ background: "rgba(3,6,12,.72)", backdropFilter: "blur(8px)" }} onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`glass-strong rounded-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[88vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 sticky top-0 bg-[#0b1120]/90 backdrop-blur-xl z-10 rounded-t-2xl">
              <h3 className="font-display font-semibold text-white">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-lg grid place-items-center text-slate-400 hover:text-white hover:bg-white/10 transition"><X size={16} /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Form fields ────────────────────────────────────────────
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">{label}</span>
      {children}
    </label>
  );
}
export const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20 transition";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-[90px] resize-y ${props.className ?? ""}`} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} appearance-none [&>option]:bg-[#0e1524] ${props.className ?? ""}`} />;
}

// ─── Segmented control / tabs ───────────────────────────────
export function Segmented<T extends string>({ options, value, onChange, accent = "#818cf8" }: { options: { value: T; label: string; icon?: React.ReactNode }[]; value: T; onChange: (v: T) => void; accent?: string }) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl glass-soft flex-wrap">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className="relative px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition">
          {value === o.value && <motion.span layoutId={undefined} className="absolute inset-0 rounded-lg" style={{ background: `${accent}22`, border: `1px solid ${accent}55` }} />}
          <span className="relative z-10 flex items-center gap-1.5">{o.icon}{o.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Toggle ─────────────────────────────────────────────────
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${on ? "bg-indigo-500" : "bg-white/10"}`}>
      <motion.span layout className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow ${on ? "right-1" : "left-1"}`} transition={{ type: "spring", stiffness: 500, damping: 32 }} />
    </button>
  );
}

// ─── Stat card ──────────────────────────────────────────────
export function Stat({ label, value, icon, delta, accent = "#818cf8", suffix = "", prefix = "", decimals = 0 }: {
  label: string; value: number; icon: React.ReactNode; delta?: string; accent?: string; suffix?: string; prefix?: string; decimals?: number;
}) {
  return (
    <Card className="p-5 relative overflow-hidden group" hover>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: `${accent}1d`, color: accent }}>{icon}</div>
        {delta && <Badge tone="green">{delta}</Badge>}
      </div>
      <div className="mt-4">
        <Counter to={value} prefix={prefix} suffix={suffix} decimals={decimals} className="font-display text-2xl md:text-[28px] font-bold text-white" />
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </div>
    </Card>
  );
}

// ─── Animated check (success) ───────────────────────────────
export function SuccessPulse({ size = 64, color = "#34d399" }: { size?: number; color?: string }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <motion.span initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        className="absolute rounded-full" style={{ width: size, height: size, border: `2px solid ${color}` }} />
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}
        className="rounded-full grid place-items-center" style={{ width: size, height: size, background: `${color}22`, border: `1.5px solid ${color}66` }}>
        <Check size={size * 0.42} color={color} strokeWidth={3} />
      </motion.div>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 text-slate-400 text-sm">
      <Loader2 size={16} className="animate-spin text-indigo-400" />{label ?? "Loading"}
    </div>
  );
}

// ─── Page enter wrapper ─────────────────────────────────────
export function PageIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Home, Bus, School, Check, Clock3, Plus, Smile,
  Meh, Frown, Sparkles, ShieldCheck, Download, BookOpenText, ChevronDown,
} from "lucide-react";
import { CalEvent, EVENT_STYLE, fmtDate, pad, rel, todayISO } from "@/lib/data";
import { Badge, Btn, Card, Modal, Textarea, Field, Input } from "./ui";

// ─── Calendar month view ────────────────────────────────────
export function CalendarMonth({ events, accent = "#818cf8", title = "District Calendar" }: { events: CalEvent[]; accent?: string; title?: string }) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<string>(todayISO());
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${year}-${pad(month + 1)}-${pad(d)}`);
  const byDate = useMemo(() => {
    const m = new Map<string, CalEvent[]>();
    events.forEach((e) => m.set(e.date, [...(m.get(e.date) ?? []), e]));
    return m;
  }, [events]);
  const sel = byDate.get(selected) ?? [];
  const evType = (t: CalEvent["type"]) => EVENT_STYLE[t];
  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
      <Card className="p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-white">{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
            <p className="text-[11px] text-slate-500">{title} · holidays, exams & events</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="w-8 h-8 rounded-lg glass-soft grid place-items-center text-slate-400 hover:text-white transition"><ChevronLeft size={15} /></button>
            <button onClick={() => setCursor(new Date())} className="px-2.5 h-8 rounded-lg glass-soft text-[11px] text-slate-300 hover:text-white transition">Today</button>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="w-8 h-8 rounded-lg glass-soft grid place-items-center text-slate-400 hover:text-white transition"><ChevronRight size={15} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d} className="text-center text-[10px] uppercase tracking-wider text-slate-500 font-semibold py-1">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={`x${i}`} className="h-[52px] md:h-[62px] rounded-lg" />;
            const evs = byDate.get(d) ?? [];
            const isToday = d === todayISO(), isSel = d === selected;
            const holiday = evs.some((e) => e.type === "holiday");
            return (
              <motion.button key={d} onClick={() => setSelected(d)} whileTap={{ scale: 0.92 }}
                className={`h-[52px] md:h-[62px] rounded-lg p-1.5 text-left relative transition-all duration-200 border
                  ${isSel ? "border-transparent" : "border-white/5 hover:border-white/15"} ${holiday ? "bg-rose-500/6" : "bg-white/[0.02]"}`}
                style={isSel ? { background: `${accent}1e`, borderColor: `${accent}66`, boxShadow: `0 0 16px ${accent}22` } : {}}>
                <span className={`text-[11px] font-semibold ${isToday ? "w-5 h-5 grid place-items-center rounded-full text-[#06090f]" : "text-slate-400"}`}
                  style={isToday ? { background: accent } : {}}>
                  {Number(d.slice(8))}
                </span>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-1 flex-wrap">
                  {evs.slice(0, 3).map((e) => <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: evType(e.type).color }} />)}
                  {evs.length > 3 && <span className="text-[8px] text-slate-500 leading-none">+{evs.length - 3}</span>}
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-white/6">
          {Object.entries(EVENT_STYLE).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full" style={{ background: v.color }} />{v.label}</span>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h4 className="font-display font-semibold text-white text-sm mb-1">{fmtDate(selected, { weekday: "long", month: "long", day: "numeric" })}</h4>
        <p className="text-[11px] text-slate-500 mb-4">{sel.length ? `${sel.length} scheduled item${sel.length > 1 ? "s" : ""}` : "No events — regular school day"}</p>
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {sel.map((e) => (
              <motion.div key={e.id} layout initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-soft rounded-xl p-3.5 relative overflow-hidden">
                <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: evType(e.type).color }} />
                <div className="flex items-center justify-between gap-2 pl-2">
                  <p className="text-[13px] font-semibold text-white leading-snug">{e.title}</p>
                  <Badge tone={e.type === "holiday" ? "red" : e.type === "exam" ? "amber" : "cyan"}>{evType(e.type).label}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 pl-2 leading-relaxed">{e.desc}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {!sel.length && (
            <div className="text-center py-10 text-slate-500">
              <School size={26} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs">Classes run on the regular timetable.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── Commute journey timeline ───────────────────────────────
export function JourneyTimeline({ leftHomeAt, arrivedAt, compact = false }: { leftHomeAt?: string; arrivedAt?: string; compact?: boolean }) {
  const steps = [
    { icon: <Home size={compact ? 13 : 15} />, label: "Left home", time: leftHomeAt, done: !!leftHomeAt, color: "#fbbf24" },
    { icon: <Bus size={compact ? 13 : 15} />, label: "On the way", time: leftHomeAt && !arrivedAt ? "en route" : undefined, done: !!leftHomeAt, color: "#22d3ee" },
    { icon: <School size={compact ? 13 : 15} />, label: "Reached school", time: arrivedAt, done: !!arrivedAt, color: "#34d399" },
  ];
  return (
    <div className="flex items-center">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.12, type: "spring", stiffness: 320, damping: 18 }}
              className={`rounded-full grid place-items-center border ${compact ? "w-7 h-7" : "w-9 h-9"}`}
              style={s.done ? { background: `${s.color}22`, borderColor: `${s.color}77`, color: s.color, boxShadow: `0 0 14px ${s.color}33` } : { borderColor: "rgba(148,163,184,.2)", color: "#475569" }}>
              {s.done ? s.icon : <Clock3 size={compact ? 12 : 14} />}
            </motion.div>
            {!compact && <p className={`text-[10px] mt-1.5 font-medium ${s.done ? "text-slate-300" : "text-slate-600"}`}>{s.label}</p>}
            {!compact && <p className="text-[9px] text-slate-500">{s.time ?? "—"}</p>}
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-[2px] rounded mx-1.5 relative overflow-hidden ${compact ? "mb-0" : "mb-8"}`} style={{ background: "rgba(148,163,184,.15)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: s.done && steps[i + 1].done ? "100%" : s.done ? "55%" : "0%" }} transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full" style={{ background: `linear-gradient(90deg, ${steps[i].color}, ${steps[i + 1].color})` }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Diary ──────────────────────────────────────────────────
const MOODS = [
  { id: "great", icon: <Sparkles size={14} />, color: "#34d399", label: "Great" },
  { id: "good", icon: <Smile size={14} />, color: "#22d3ee", label: "Good" },
  { id: "ok", icon: <Meh size={14} />, color: "#fbbf24", label: "Okay" },
  { id: "tough", icon: <Frown size={14} />, color: "#fb7185", label: "Tough" },
] as const;
export const moodOf = (m: string) => MOODS.find((x) => x.id === m) ?? MOODS[1];

export function DiaryComposer({ onSave, placeholder }: { onSave: (title: string, body: string, mood: any, tags: string[]) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<string>("good");
  const [tag, setTag] = useState("");
  return (
    <>
      <Btn icon={<Plus size={15} />} onClick={() => setOpen(true)}>New diary entry</Btn>
      <Modal open={open} onClose={() => setOpen(false)} title="Today's diary entry">
        <div className="space-y-4">
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={placeholder ?? "What defined today?"} /></Field>
          <Field label="How did today feel?">
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button key={m.id} onClick={() => setMood(m.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${mood === m.id ? "text-white" : "text-slate-400 border-white/10 hover:border-white/20"}`}
                  style={mood === m.id ? { background: `${m.color}1e`, borderColor: `${m.color}66` } : {}}>
                  <span style={{ color: m.color }}>{m.icon}</span>{m.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="What happened — work done, learnings, moments">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Captured the day's work, key learnings and anything worth remembering…" rows={4} />
          </Field>
          <Field label="Tags (comma separated)"><Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Math, Capstone, Lab" /></Field>
          <Btn className="w-full" disabled={!title.trim() || !body.trim()} onClick={() => { onSave(title, body, mood, tag.split(",").map((t) => t.trim()).filter(Boolean)); setOpen(false); setTitle(""); setBody(""); setTag(""); }}>
            Save to diary
          </Btn>
        </div>
      </Modal>
    </>
  );
}

export function DiaryCard({ e, i }: { e: { date: string; title: string; body: string; mood: string; tags: string[]; remark?: string }; i: number }) {
  const m = moodOf(e.mood);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.45 }}>
      <Card className="p-5 relative overflow-hidden" hover>
        <span className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(${m.color}, transparent)` }} />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: `${m.color}1c`, color: m.color }}>{m.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{e.title}</p>
              <p className="text-[11px] text-slate-500">{fmtDate(e.date)}</p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">{e.tags.map((t) => <Badge key={t} tone="violet">{t}</Badge>)}</div>
        </div>
        <p className="text-[13px] text-slate-300 leading-relaxed mt-3">{e.body}</p>
        {e.remark && (
          <div className="mt-3 rounded-xl bg-indigo-500/8 border border-indigo-400/20 p-3 flex gap-2.5">
            <BookOpenText size={14} className="text-indigo-300 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-200/90 leading-relaxed">{e.remark}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Attendance status chip ─────────────────────────────────
export const ATT_STYLE: Record<string, { label: string; tone: string; color: string }> = {
  unmarked: { label: "Not marked", tone: "slate", color: "#64748b" },
  pending: { label: "Pending approval", tone: "amber", color: "#fbbf24" },
  approved: { label: "Present · Approved", tone: "green", color: "#34d399" },
  absent: { label: "Absent", tone: "red", color: "#fb7185" },
  late: { label: "Late", tone: "amber", color: "#fbbf24" },
  excused: { label: "Excused", tone: "blue", color: "#60a5fa" },
};

// ─── Certificate ────────────────────────────────────────────
export function CertificateCard({ student, course, grade, date, onView }: { student: string; course: string; grade: string; date: string; onView: () => void }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="relative rounded-2xl overflow-hidden cursor-pointer group" onClick={onView}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-[#0d1226] to-cyan-500/20" />
      <div className="absolute inset-[1.5px] rounded-2xl bg-[#0a0e1c]/90" />
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-[11px] tracking-[0.3em] uppercase text-slate-400">EduNova · Verified Credential</span>
          <ShieldCheck size={18} className="text-emerald-400" />
        </div>
        <p className="text-[11px] text-slate-500 mt-6">Proudly awarded to</p>
        <p className="font-display text-2xl font-bold text-gradient mt-1">{student}</p>
        <p className="text-[13px] text-slate-300 mt-3 leading-snug">for successfully completing the capstone and all requirements of</p>
        <p className="font-display text-[15px] font-semibold text-white mt-1">{course}</p>
        <div className="flex items-end justify-between mt-6">
          <div>
            <p className="text-[10px] text-slate-500">Final grade</p>
            <p className="font-display text-lg font-bold text-emerald-300">{grade}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500">Issued</p>
            <p className="text-xs text-slate-300">{date}</p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-amber-400/50 grid place-items-center relative">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-amber-400/40" />
            <span className="font-display text-[8px] font-bold text-amber-300 text-center leading-tight px-1">EDU·NOVA SEAL</span>
          </div>
        </div>
        <div className="mt-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Btn size="sm" variant="outline" icon={<Download size={13} />} onClick={() => {}}>Download PDF</Btn>
          <Btn size="sm" variant="ghost">Verify credential</Btn>
        </div>
      </div>
    </motion.div>
  );
}

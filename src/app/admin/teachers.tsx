"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Wallet, CalendarDays, UserPlus, Grid3X3, Star, Check, X, ArrowRight,
  Minus, Plus, AlertTriangle, CheckCheck, Clock3, Briefcase, GraduationCap, Send, BadgeCheck, Timer,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CANDIDATE_STAGES, TEACHERS, SCHOOLS, fmtDate, money, monthName } from "@/lib/data";
import { Avatar, Badge, Btn, Card, Field, Modal, Progress, SectionTitle, Stat, Textarea } from "@/components/ui";

type Sub = "directory" | "workload" | "payroll" | "leaves" | "onboarding";
const SUBS: { id: Sub; label: string; icon: React.ReactNode }[] = [
  { id: "directory", label: "Directory", icon: <Users size={14} /> },
  { id: "workload", label: "Periods & Workload", icon: <Grid3X3 size={14} /> },
  { id: "payroll", label: "Payroll", icon: <Wallet size={14} /> },
  { id: "leaves", label: "Leave Desk", icon: <CalendarDays size={14} /> },
  { id: "onboarding", label: "Onboarding", icon: <UserPlus size={14} /> },
];

export default function TeacherManagement() {
  const [sub, setSub] = useState<Sub>("directory");
  const app = useApp();
  const pendingLeaves = app.leaves.filter((l) => l.status === "pending").length;
  const pendingPay = app.payroll.filter((p) => p.status === "pending" && p.month === monthName(0)).length;
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {SUBS.map((s) => (
          <button key={s.id} onClick={() => setSub(s.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition ${sub === s.id ? "text-white" : "text-slate-400 glass-soft hover:text-white"}`}>
            {sub === s.id && <motion.span layoutId="tch-sub" className="absolute inset-0 rounded-xl bg-emerald-400/12 border border-emerald-400/40" />}
            <span className="relative z-10 flex items-center gap-2">{s.icon}{s.label}
              {s.id === "leaves" && pendingLeaves > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300">{pendingLeaves}</span>}
              {s.id === "payroll" && pendingPay > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-400/20 text-rose-300">{pendingPay}</span>}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sub} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {sub === "directory" && <Directory />}
          {sub === "workload" && <Workload />}
          {sub === "payroll" && <Payroll />}
          {sub === "leaves" && <Leaves />}
          {sub === "onboarding" && <Onboarding />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Directory ──────────────────────────────────────────────
function Directory() {
  const app = useApp();
  const [q, setQ] = useState("");
  const list = TEACHERS.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()) || t.subject.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle icon={<Users size={15} />} title="Teacher Directory" sub={`${TEACHERS.length} staff across 3 schools`} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or subject…"
          className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400/60 w-[240px]" />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {list.map((t, i) => {
          const school = SCHOOLS.find((s) => s.id === t.schoolId)!;
          const load = Math.round((t.periods / t.maxPeriods) * 100);
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5" hover>
                <div className="flex items-start justify-between">
                  <Avatar name={t.name} id={t.id} size={46} ring />
                  <Badge tone={t.status === "active" ? "green" : t.status === "on-leave" ? "amber" : "slate"}>{t.status.replace("-", " ")}</Badge>
                </div>
                <h3 className="font-display font-semibold text-white mt-3">{t.name}</h3>
                <p className="text-[11px] text-slate-500">{t.subject} · {school.short} · {t.experience} yrs</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-300 mt-1.5"><Star size={11} /> {t.rating} · {t.dept}</div>
                <div className="mt-3.5">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1.5"><span>Weekly load</span><span>{t.periods}/{t.maxPeriods} periods</span></div>
                  <Progress value={load} color={load > 92 ? "#fb7185" : load > 75 ? "#fbbf24" : "#34d399"} height={6} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.classes.slice(0, 3).map((c) => <span key={c} className="text-[9px] px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/8">{c}</span>)}
                  {t.classes.length > 3 && <span className="text-[9px] px-2 py-1 text-slate-500">+{t.classes.length - 3}</span>}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Workload & periods ─────────────────────────────────────
function Workload() {
  const app = useApp();
  const [loads, setLoads] = useState<Record<string, number>>(Object.fromEntries(TEACHERS.map((t) => [t.id, t.periods])));
  const [sections, setSections] = useState<Record<string, string[]>>(Object.fromEntries(TEACHERS.map((t) => [t.id, t.classes])));
  const adjust = (id: string, d: number) => {
    const t = TEACHERS.find((x) => x.id === id)!;
    const cur = loads[id];
    if (cur + d < 0) return;
    if (cur + d > t.maxPeriods) { app.toast("Lecture cap reached", `${t.name} is capped at ${t.maxPeriods} periods/week by policy.`, "warn"); return; }
    setLoads((l) => ({ ...l, [id]: cur + d }));
  };
  const totalAssigned = Object.values(loads).reduce((a, b) => a + b, 0);
  const totalCap = TEACHERS.reduce((a, t) => a + t.maxPeriods, 0);
  const overloaded = TEACHERS.filter((t) => loads[t.id] >= t.maxPeriods * 0.95);
  const dropSection = (tid: string, cls: string) => {
    setSections((s) => ({ ...s, [tid]: s[tid].filter((c) => c !== cls) }));
    setLoads((l) => ({ ...l, [tid]: Math.max(0, l[tid] - 5) }));
    app.toast("Section reassigned", `${cls} removed and 5 weekly periods freed.`, "info");
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Periods assigned / week" value={totalAssigned} icon={<Grid3X3 size={17} />} accent="#34d399" />
        <Stat label="Total teaching capacity" value={totalCap} icon={<Briefcase size={17} />} accent="#22d3ee" />
        <Stat label="Utilization" value={Math.round((totalAssigned / totalCap) * 100)} suffix="%" icon={<Timer size={17} />} accent="#a78bfa" />
        <Stat label="Near lecture cap" value={overloaded.length} icon={<AlertTriangle size={17} />} accent="#fb7185" />
      </div>
      <Card className="p-5">
        <SectionTitle icon={<Grid3X3 size={15} />} title="Lecture allocation & caps" sub="Each teacher has a maximum period ceiling — rebalance with one click" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/8">
              <th className="pb-3 font-semibold">Teacher</th><th className="pb-3 font-semibold">Sections taught</th><th className="pb-3 font-semibold w-[220px]">Load vs cap</th><th className="pb-3 font-semibold text-center">Max lectures/week</th><th className="pb-3 font-semibold text-right">Fine-tune</th>
            </tr></thead>
            <tbody>
              {TEACHERS.map((t) => {
                const cur = loads[t.id];
                const pct = Math.round((cur / t.maxPeriods) * 100);
                const hot = pct >= 95;
                return (
                  <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={t.name} id={t.id} size={34} />
                        <div><p className="text-[13px] font-medium text-white">{t.name}</p><p className="text-[10px] text-slate-500">{t.subject}</p></div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                        {(sections[t.id] ?? []).map((c) => (
                          <span key={c} className="group text-[9px] pl-2 pr-1 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                            {c}
                            <button onClick={() => dropSection(t.id, c)} title="Reassign section" className="w-3.5 h-3.5 rounded grid place-items-center text-slate-500 hover:text-rose-300 hover:bg-rose-400/15 opacity-0 group-hover:opacity-100 transition"><X size={9} /></button>
                          </span>
                        ))}
                        {!(sections[t.id] ?? []).length && <span className="text-[10px] text-slate-600">No sections — free for cover duty</span>}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Progress value={pct} color={hot ? "#fb7185" : pct > 75 ? "#fbbf24" : "#34d399"} height={7} className="flex-1" />
                        <span className="text-[11px] text-slate-300 w-11 text-right">{cur}/{t.maxPeriods}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center">{hot ? <Badge tone="red">At ceiling</Badge> : <Badge tone="green">{t.maxPeriods - cur} open</Badge>}</td>
                    <td className="py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => adjust(t.id, -1)} className="w-7 h-7 rounded-lg glass-soft grid place-items-center text-slate-400 hover:text-white transition"><Minus size={12} /></button>
                        <button onClick={() => adjust(t.id, 1)} className="w-7 h-7 rounded-lg glass-soft grid place-items-center text-slate-400 hover:text-white transition"><Plus size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Payroll ────────────────────────────────────────────────
function Payroll() {
  const app = useApp();
  const cur = app.payroll.filter((p) => p.month === monthName(0));
  const prev = app.payroll.filter((p) => p.month !== monthName(0));
  const pending = cur.filter((p) => p.status === "pending");
  const totalMonth = cur.reduce((a, p) => a + p.net, 0);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label={`Payroll · ${monthName(0)}`} value={totalMonth} prefix="$" icon={<Wallet size={17} />} accent="#34d399" />
        <Stat label="Pending disbursements" value={pending.length} icon={<Clock3 size={17} />} accent="#fbbf24" />
        <Stat label="Paid out" value={cur.filter((p) => p.status === "paid").reduce((a, p) => a + p.net, 0)} prefix="$" icon={<CheckCheck size={17} />} accent="#22d3ee" />
        <Stat label="Staff covered" value={cur.length} icon={<Users size={17} />} accent="#a78bfa" />
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <SectionTitle icon={<Wallet size={15} />} title={`Salary run — ${monthName(0)}`} sub="Base + allowances − deductions" />
          <div className="flex gap-2">
            <Btn size="sm" variant="ghost" disabled={!selected.length} onClick={() => { app.runPayroll(selected); setSelected([]); }}>Pay selected ({selected.length})</Btn>
            <Btn size="sm" variant="success" icon={<CheckCheck size={14} />} disabled={!pending.length} onClick={() => app.runPayroll(pending.map((p) => p.id))}>Run full payroll</Btn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/8">
              <th className="pb-3 w-8"></th><th className="pb-3 font-semibold">Teacher</th><th className="pb-3 font-semibold text-right">Base</th><th className="pb-3 font-semibold text-right">Allowances</th><th className="pb-3 font-semibold text-right">Deductions</th><th className="pb-3 font-semibold text-right">Net pay</th><th className="pb-3 font-semibold text-right">Status</th>
            </tr></thead>
            <tbody>
              {cur.map((p) => {
                const t = TEACHERS.find((x) => x.id === p.teacherId)!;
                return (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3">
                      <input type="checkbox" disabled={p.status === "paid"} checked={selected.includes(p.id)}
                        onChange={(e) => setSelected((s) => e.target.checked ? [...s, p.id] : s.filter((x) => x !== p.id))}
                        className="w-4 h-4 accent-emerald-500 disabled:opacity-20" />
                    </td>
                    <td className="py-3"><div className="flex items-center gap-2.5"><Avatar name={t.name} id={t.id} size={30} /><div><p className="text-[13px] text-white font-medium">{t.name}</p><p className="text-[10px] text-slate-500">{t.subject}</p></div></div></td>
                    <td className="py-3 text-right text-[12px] text-slate-300">{money(p.base)}</td>
                    <td className="py-3 text-right text-[12px] text-emerald-300/80">+{money(p.allowance)}</td>
                    <td className="py-3 text-right text-[12px] text-rose-300/80">−{money(p.deduction)}</td>
                    <td className="py-3 text-right font-display font-bold text-white">{money(p.net)}</td>
                    <td className="py-3 text-right">{p.status === "paid" ? <Badge tone="green"><CheckCheck size={10} className="mr-1" />Paid{p.paidOn ? ` · ${fmtDate(p.paidOn)}` : ""}</Badge> : <Badge tone="amber" dot>Pending</Badge>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500 mt-4">Direct deposit via district banking rail · payslips auto-emailed · tax withholding applied at source. Previous cycle ({monthName(-1)}): {money(prev.reduce((a, p) => a + p.net, 0))} across {prev.length} staff — fully settled.</p>
      </Card>
    </div>
  );
}

// ─── Leaves ─────────────────────────────────────────────────
function Leaves() {
  const app = useApp();
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const pending = app.leaves.filter((l) => l.status === "pending");
  const decided = app.leaves.filter((l) => l.status !== "pending");
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="p-5">
        <SectionTitle icon={<CalendarDays size={15} />} title="Incoming requests" sub={`${pending.length} awaiting your decision`} />
        <div className="space-y-3">
          {pending.length === 0 && <p className="text-sm text-slate-500 text-center py-8">Inbox zero — no pending leave requests.</p>}
          {pending.map((l, i) => {
            const t = TEACHERS.find((x) => x.id === l.teacherId)!;
            return (
              <motion.div key={l.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-soft rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} id={t.id} size={38} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white">{t.name} <span className="text-slate-500 font-normal">· {t.subject}</span></p>
                    <p className="text-[10px] text-slate-500">{fmtDate(l.from)} → {fmtDate(l.to)} · {l.days} day{l.days > 1 ? "s" : ""}</p>
                  </div>
                  <Badge tone="amber">{l.type}</Badge>
                </div>
                <p className="text-[12px] text-slate-400 mt-2.5 leading-relaxed">{l.reason}</p>
                <div className="flex gap-2 mt-3.5">
                  <Btn size="sm" variant="success" icon={<Check size={13} />} onClick={() => app.decideLeave(l.id, true)}>Approve</Btn>
                  <Btn size="sm" variant="danger" icon={<X size={13} />} onClick={() => { setRejecting(l.id); setNote(""); }}>Decline</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => app.toast("Substitute pool opened", "3 qualified substitutes available for these dates.", "info")}>Find cover</Btn>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={<CheckCheck size={15} />} title="Decision history" sub="Approved and declined requests" />
        <div className="space-y-2.5">
          {decided.map((l, i) => {
            const t = TEACHERS.find((x) => x.id === l.teacherId)!;
            return (
              <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 glass-soft rounded-xl p-3.5">
                <Avatar name={t.name} id={t.id} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-white">{t.name} · {l.type}</p>
                  <p className="text-[10px] text-slate-500">{fmtDate(l.from)} · {l.days}d{l.note ? ` — ${l.note}` : ""}</p>
                </div>
                <Badge tone={l.status === "approved" ? "green" : "red"}>{l.status}</Badge>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-5 rounded-xl bg-white/[0.03] border border-white/8 p-4">
          <p className="text-[11px] font-semibold text-white mb-2">Leave balances (annual 24d)</p>
          {TEACHERS.slice(0, 4).map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-1.5">
              <span className="text-[11px] text-slate-400 w-28 truncate">{t.name}</span>
              <Progress value={((24 - ([4, 12, 6, 2][t.id.charCodeAt(3) % 4])) / 24) * 100} color="#34d399" height={5} className="flex-1" />
              <span className="text-[10px] text-slate-500 w-12 text-right">{[4, 12, 6, 2][t.id.charCodeAt(3) % 4]}d used</span>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={!!rejecting} onClose={() => setRejecting(null)} title="Decline leave request">
        <div className="space-y-4">
          <Field label="Reason shared with the teacher"><Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Mid-term duty week — please propose alternative dates." /></Field>
          <Btn variant="danger" className="w-full" onClick={() => { if (rejecting) app.decideLeave(rejecting, false, note || undefined); setRejecting(null); }}>Confirm decline</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Onboarding pipeline ────────────────────────────────────
function Onboarding() {
  const app = useApp();
  const [invite, setInvite] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SectionTitle icon={<UserPlus size={15} />} title="Hiring & onboarding pipeline" sub="Application → Screening → Interview → Offer → Onboarded" />
        <Btn size="sm" icon={<Plus size={14} />} onClick={() => setInvite(true)}>Add candidate</Btn>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {CANDIDATE_STAGES.map((stage, si) => {
          const items = app.candidates.filter((c) => c.stage === si);
          return (
            <div key={stage} className="glass-soft rounded-2xl p-3 min-h-[260px]">
              <div className="flex items-center justify-between px-1.5 pb-2.5">
                <p className="text-[11px] font-semibold text-slate-300">{stage}</p>
                <span className="text-[10px] font-bold text-slate-500 bg-white/5 rounded-md px-1.5 py-0.5">{items.length}</span>
              </div>
              <div className="space-y-2.5">
                <AnimatePresence>
                  {items.map((c) => (
                    <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 340, damping: 26 }} className="glass rounded-xl p-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={c.name} id={c.id} size={28} />
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-white truncate">{c.name}</p>
                          <p className="text-[9px] text-slate-500">{c.subject} · {SCHOOLS.find((s) => s.id === c.schoolId)?.short}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 leading-snug">{c.note}</p>
                      <p className="text-[9px] text-slate-600 mt-1.5">applied {fmtDate(c.applied)}</p>
                      {c.stage < 4 ? (
                        <button onClick={() => app.advanceCandidate(c.id)} className="mt-2.5 w-full text-[10px] font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/25 rounded-lg py-1.5 hover:bg-emerald-400/20 transition flex items-center justify-center gap-1">
                          Advance <ArrowRight size={10} />
                        </button>
                      ) : (
                        <p className="mt-2.5 text-center text-[10px] font-semibold text-emerald-300 flex items-center justify-center gap-1"><BadgeCheck size={11} /> Onboarded</p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {!items.length && <p className="text-[10px] text-slate-600 text-center py-6">Empty stage</p>}
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={invite} onClose={() => setInvite(false)} title="Add candidate to pipeline">
        <div className="space-y-4">
          <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dana Whitfield" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-400/60" /></Field>
          <Field label="Subject">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none [&>option]:bg-[#0e1524]">
              {["Mathematics", "Physics", "English", "Computer Science", "History", "Chemistry", "Biology", "Art"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Btn className="w-full" disabled={!name.trim()} icon={<Send size={14} />} onClick={() => {
            app.candidates.unshift({ id: `cnd${Date.now() % 9999}`, name: name.trim(), subject, schoolId: "sch1", stage: 0, applied: new Date().toISOString().slice(0, 10), note: "Added manually by district office." });
            setInvite(false); setName("");
            app.toast("Candidate added", "They enter at Application stage.");
          }}>Add to pipeline</Btn>
        </div>
      </Modal>
    </div>
  );
}

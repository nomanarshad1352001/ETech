"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, School, Users, GraduationCap, CreditCard, ShieldCheck, BarChart3,
  CalendarDays, Settings2, BookMarked, IdCard, TrendingUp, Wallet, AlertTriangle,
  CheckCheck, Clock3, ArrowRight, Check, X, Plus, Send, FileCheck2, Landmark, Search, Building2,
  Receipt, Percent, BellRing, Rocket, Download, Activity, KeyRound,
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/shell";
import { useApp, studentById } from "@/lib/store";
import {
  SCHOOLS, STUDENTS, TEACHERS, ENROLLMENT_TREND, REVENUE_TREND, SCHOOL_MONTHS, GRADE_DIST,
  EVENT_STYLE, fmtDate, money, monthName, todayISO,
} from "@/lib/data";
import { Avatar, Badge, Btn, Card, Field, Input, Modal, Progress, SectionTitle, Select, Stat, Textarea, Toggle } from "@/components/ui";
import { AreaChart, BarChart, Donut, HBar, Sparkline } from "@/components/charts";
import { CalendarMonth } from "@/components/widgets";
import TeacherManagement from "./teachers";

// ─── Overview ───────────────────────────────────────────────
function Overview({ go }: { go: (t: string) => void }) {
  const app = useApp();
  const pendingLeaves = app.leaves.filter((l) => l.status === "pending").length;
  const pendingCourses = app.courses.filter((c) => c.status === "pending").length;
  const overdue = app.invoices.filter((i) => i.status === "overdue").reduce((a, i) => a + i.amount, 0);
  const pendingPay = app.payroll.filter((p) => p.status === "pending" && p.month === monthName(0)).length;
  return (
    <div className="space-y-5">
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full blur-3xl opacity-20 bg-emerald-400" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <Badge tone="green" dot>District snapshot · live</Badge>
            <h2 className="font-display font-bold text-white text-2xl md:text-3xl mt-3">District command, Dr. Osei</h2>
            <p className="text-[13px] text-slate-400 mt-1.5">3 schools synced · attendance flowing in · {pendingLeaves} leave requests and {pendingCourses} curriculum item need decisions today.</p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Btn icon={<Users size={15} />} onClick={() => go("teachers")}>Teacher management</Btn>
            <Btn variant="ghost" icon={<BarChart3 size={15} />} onClick={() => go("analytics")}>Business analytics</Btn>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Students district-wide" value={2740} icon={<GraduationCap size={17} />} accent="#34d399" delta="+140 yoy" />
        <Stat label="Teachers & staff" value={154} icon={<Users size={17} />} accent="#22d3ee" />
        <Stat label="Avg attendance today" value={94.6} decimals={1} suffix="%" icon={<CheckCheck size={17} />} accent="#fbbf24" />
        <Stat label="Monthly revenue" value={1.92} decimals={2} prefix="$" suffix="M" icon={<Wallet size={17} />} accent="#a78bfa" delta="+6.7%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle icon={<TrendingUp size={15} />} title="Enrollment & revenue trajectory" sub="Trailing 12 months · entire district" />
          <AreaChart data={ENROLLMENT_TREND} labels={SCHOOL_MONTHS} color="#34d399" height={210} format={(v) => `${v.toLocaleString()} students`} />
        </Card>
        <Card className="p-5">
          <SectionTitle icon={<BellRing size={15} />} title="Needs attention" sub="Prioritized by impact" />
          <div className="space-y-2.5">
            {[
              { l: `${pendingLeaves} teacher leave requests`, d: "Approve or decline in the Leave Desk", fn: () => go("teachers"), c: "#fbbf24", i: <CalendarDays size={14} /> },
              { l: `${pendingCourses} course awaiting approval`, d: "Curriculum review queue", fn: () => go("curriculum"), c: "#a78bfa", i: <BookMarked size={14} /> },
              { l: `${money(overdue)} overdue fees`, d: "Send family reminders from Fee Management", fn: () => go("fees"), c: "#fb7185", i: <Receipt size={14} /> },
              { l: `${pendingPay} salaries pending`, d: `Run the ${monthName(0)} payroll`, fn: () => go("teachers"), c: "#34d399", i: <Wallet size={14} /> },
            ].map((a, i) => (
              <motion.button key={a.l} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} onClick={a.fn}
                className="w-full glass-soft rounded-xl p-3.5 flex items-center gap-3 text-left hover:border-white/25 transition group">
                <span className="w-9 h-9 rounded-lg grid place-items-center shrink-0" style={{ background: `${a.c}18`, color: a.c }}>{a.i}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-medium text-white">{a.l}</span>
                  <span className="block text-[10px] text-slate-500 truncate">{a.d}</span>
                </span>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition" />
              </motion.button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {SCHOOLS.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card hover className="p-5" onClick={() => go("schools")}>
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl grid place-items-center font-display font-bold text-white" style={{ background: `${s.color}2a`, color: s.color }}>{s.short}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">{s.name}</p><p className="text-[10px] text-slate-500">{s.city} · {s.principal}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                {[[s.students, "students"], [s.teachers, "teachers"], [`${s.attendance}%`, "attend."]].map(([v, l]) => (
                  <div key={l as string} className="glass-soft rounded-lg py-2"><p className="font-display font-bold text-white text-[13px]">{v as any}</p><p className="text-[9px] text-slate-500">{l as string}</p></div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Schools ────────────────────────────────────────────────
function SchoolsView() {
  const app = useApp();
  return (
    <div className="space-y-5">
      <SectionTitle icon={<School size={16} />} title="Multi-School Management" sub="Performance, licenses and compliance per campus" />
      <div className="grid lg:grid-cols-3 gap-5">
        {SCHOOLS.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}>
            <Card className="p-5 relative overflow-hidden" hover>
              <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20" style={{ background: s.color }} />
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl grid place-items-center font-display font-bold text-lg" style={{ background: `${s.color}25`, color: s.color }}>{s.short}</span>
                <Badge tone="green" dot>Operational</Badge>
              </div>
              <h3 className="font-display font-semibold text-white text-lg mt-3.5">{s.name}</h3>
              <p className="text-[11px] text-slate-500">{s.city} · Principal {s.principal}</p>
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <div className="glass-soft rounded-xl p-3"><p className="text-[9px] text-slate-500 uppercase tracking-wider">Students</p><p className="font-display font-bold text-white text-lg">{s.students.toLocaleString()}</p></div>
                <div className="glass-soft rounded-xl p-3"><p className="text-[9px] text-slate-500 uppercase tracking-wider">Teachers</p><p className="font-display font-bold text-white text-lg">{s.teachers}</p></div>
                <div className="glass-soft rounded-xl p-3"><p className="text-[9px] text-slate-500 uppercase tracking-wider">Attendance</p><p className="font-display font-bold text-emerald-300 text-lg">{s.attendance}%</p></div>
                <div className="glass-soft rounded-xl p-3"><p className="text-[9px] text-slate-500 uppercase tracking-wider">Fees collected</p><p className="font-display font-bold text-cyan-300 text-lg">{s.feeCollected}%</p></div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1.5"><span>License seats used</span><span>{s.usedSeats}/{s.licenseSeats}</span></div>
                <Progress value={(s.usedSeats / s.licenseSeats) * 100} color={s.color} height={6} />
              </div>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {s.depts.map((d) => <span key={d} className="text-[9px] px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/8">{d}</span>)}
              </div>
              <Btn size="sm" variant="outline" className="w-full mt-4" onClick={() => app.toast("Campus workspace", `${s.name} detail workspace would open with dept deep-dives.`, "info")}>Open campus workspace</Btn>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Students ───────────────────────────────────────────────
function StudentsView() {
  const app = useApp();
  const [q, setQ] = useState("");
  const [school, setSchool] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = STUDENTS.filter((s) => (school === "all" || s.schoolId === school) && s.name.toLowerCase().includes(q.toLowerCase()));
  const sel = open ? STUDENTS.find((s) => s.id === open)! : null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <SectionTitle icon={<GraduationCap size={15} />} title="Student Management" sub="Profiles, records and academic history" />
        <div className="flex gap-2.5">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students…" className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400/60 w-[210px]" />
          </div>
          <Select value={school} onChange={(e) => setSchool(e.target.value)} className="w-[190px]">
            <option value="all">All schools</option>
            {SCHOOLS.map((s) => <option key={s.id} value={s.id}>{s.short} — {s.name}</option>)}
          </Select>
        </div>
      </div>
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/8">
              <th className="pb-3 font-semibold">Student</th><th className="pb-3 font-semibold">School</th><th className="pb-3 font-semibold">Grade</th><th className="pb-3 font-semibold">GPA</th><th className="pb-3 font-semibold">Streak</th><th className="pb-3 font-semibold">Fees</th><th className="pb-3 font-semibold text-right">Profile</th>
            </tr></thead>
            <tbody>
              {list.map((s, i) => {
                const due = app.invoices.filter((x) => x.studentId === s.id && x.status !== "paid").reduce((a, x) => a + x.amount, 0);
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3"><div className="flex items-center gap-2.5"><Avatar name={s.name} id={s.id} size={32} /><span className="text-[13px] text-white font-medium">{s.name}</span></div></td>
                    <td className="py-3 text-[12px] text-slate-400">{SCHOOLS.find((x) => x.id === s.schoolId)?.short}</td>
                    <td className="py-3 text-[12px] text-slate-300">{s.grade} · {s.section}</td>
                    <td className="py-3"><Badge tone={s.gpa >= 3.5 ? "green" : s.gpa >= 3 ? "cyan" : "amber"}>{s.gpa.toFixed(2)}</Badge></td>
                    <td className="py-3 text-[12px] text-slate-400">{s.streak}d</td>
                    <td className="py-3 text-[12px]">{due > 0 ? <span className="text-rose-300">{money(due)} due</span> : <span className="text-emerald-300">clear</span>}</td>
                    <td className="py-3 text-right"><Btn size="sm" variant="ghost" onClick={() => setOpen(s.id)}>Open</Btn></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={!!sel} onClose={() => setOpen(null)} title={sel ? `${sel.name} — Record` : ""} wide>
        {sel && (
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center gap-4">
                <Avatar name={sel.name} id={sel.id} size={58} ring />
                <div>
                  <p className="font-display font-bold text-white text-lg">{sel.name}</p>
                  <p className="text-xs text-slate-500">{sel.grade} · Section {sel.section} · {SCHOOLS.find((x) => x.id === sel.schoolId)?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mt-5">
                {[["GPA", sel.gpa.toFixed(2)], ["Study streak", `${sel.streak} days`], ["XP", sel.xp.toLocaleString()], ["Guardian", "Layla Rahman"]].map(([l, v]) => (
                  <div key={l as string} className="glass-soft rounded-xl p-3"><p className="text-[9px] text-slate-500 uppercase tracking-wider">{l as string}</p><p className="text-sm font-semibold text-white mt-0.5">{v as any}</p></div>
                ))}
              </div>
              <div className="mt-4 glass-soft rounded-xl p-3.5">
                <p className="text-[11px] font-semibold text-white mb-1.5">Enrollment & academic history</p>
                {["2023 · Enrolled Grade 8 (transfer — merit scholarship)", "2024 · Grade 9 honor roll · Science Olympiad silver", "2025 · Promoted to Grade 10 · STEM track"].map((h) => (
                  <p key={h} className="text-[11px] text-slate-400 py-1 border-b border-white/5 last:border-0">{h}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white mb-2.5">Attendance — last 10 days</p>
              <div className="space-y-1.5">
                {app.attendance.filter((a) => a.studentId === sel.id).slice(-10).reverse().map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-[11px] glass-soft rounded-lg px-3 py-2">
                    <span className="text-slate-400">{fmtDate(a.date)}</span>
                    <Badge tone={a.status === "approved" ? "green" : a.status === "pending" ? "amber" : a.status === "unmarked" ? "slate" : "red"}>{a.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Fees ───────────────────────────────────────────────────
function FeesView() {
  const app = useApp();
  const [planModal, setPlanModal] = useState(false);
  const [plan, setPlan] = useState({ name: "", school: "sch1", amount: 400 });
  const open = app.invoices.filter((i) => i.status !== "paid");
  const collected = app.invoices.filter((i) => i.status === "paid").reduce((a, i) => a + i.amount, 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Collected (tracked set)" value={collected} prefix="$" icon={<CheckCheck size={17} />} accent="#34d399" />
        <Stat label="Outstanding" value={open.reduce((a, i) => a + i.amount, 0)} prefix="$" icon={<Clock3 size={17} />} accent="#fbbf24" />
        <Stat label="Collection rate" value={89} suffix="%" icon={<Percent size={17} />} accent="#22d3ee" delta="+4%" />
        <Stat label="Active fee plans" value={app.feePlans.length} icon={<CreditCard size={17} />} accent="#a78bfa" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle icon={<CreditCard size={15} />} title="Fee plans" sub="Structured plans per school & band" />
            <Btn size="sm" icon={<Plus size={13} />} onClick={() => setPlanModal(true)}>New plan</Btn>
          </div>
          <div className="space-y-2.5">
            {app.feePlans.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-soft rounded-xl p-3.5 flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-lg grid place-items-center bg-emerald-400/10 text-emerald-300 shrink-0"><Landmark size={15} /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white">{f.name}</p>
                  <p className="text-[10px] text-slate-500">{SCHOOLS.find((s) => s.id === f.schoolId)?.short} · {f.gradeBand} · {f.cycle} · {f.enrolled} enrolled</p>
                </div>
                <span className="font-display font-bold text-white">{money(f.amount)}</span>
              </motion.div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle icon={<TrendingUp size={15} />} title="Collections trend" sub="Monthly receipts, $M — district wide" />
          <AreaChart data={REVENUE_TREND} labels={SCHOOL_MONTHS} color="#22d3ee" height={200} format={(v) => `$${v.toFixed(2)}M`} />
          <div className="mt-4 space-y-2.5">
            {SCHOOLS.map((s) => <HBar key={s.id} label={s.short} pct={s.feeCollected} color={s.color} right={`${s.feeCollected}%`} />)}
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <SectionTitle icon={<Receipt size={15} />} title="Dues & collections" sub="Every open invoice across the district" />
          <Btn size="sm" variant="outline" icon={<Send size={13} />} onClick={() => app.toast("Reminders sent", `${open.length} families notified via app, SMS and email.`)}>Remind all ({open.length})</Btn>
        </div>
        <div className="space-y-2">
          {open.map((inv) => {
            const st = studentById(inv.studentId)!;
            return (
              <div key={inv.id} className="flex flex-wrap items-center gap-3 glass-soft rounded-xl px-4 py-3">
                <Avatar name={st.name} id={st.id} size={30} />
                <div className="flex-1 min-w-[180px]">
                  <p className="text-[12.5px] text-white font-medium">{inv.title} — {st.name}</p>
                  <p className="text-[10px] text-slate-500">due {fmtDate(inv.due)} · guardian Layla Rahman</p>
                </div>
                <span className="font-display font-bold text-white text-sm">{money(inv.amount)}</span>
                <Badge tone={inv.status === "overdue" ? "red" : "amber"} dot={inv.status === "overdue"}>{inv.status}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
      <Modal open={planModal} onClose={() => setPlanModal(false)} title="Create fee plan">
        <div className="space-y-4">
          <Field label="Plan name"><Input value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} placeholder="e.g. Senior Science Labs" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="School"><Select value={plan.school} onChange={(e) => setPlan({ ...plan, school: e.target.value })}>{SCHOOLS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>
            <Field label={`Amount · ${money(plan.amount)}`}><input type="range" min={25} max={1200} step={5} value={plan.amount} onChange={(e) => setPlan({ ...plan, amount: +e.target.value })} className="w-full accent-emerald-500 mt-3" /></Field>
          </div>
          <Btn className="w-full" disabled={!plan.name.trim()} onClick={() => {
            app.feePlans.push({ id: `fp${Date.now() % 9999}`, name: plan.name.trim(), schoolId: plan.school, gradeBand: "All grades", amount: plan.amount, cycle: "Per term", enrolled: 0 });
            setPlanModal(false); setPlan({ name: "", school: "sch1", amount: 400 });
            app.toast("Fee plan created", "Families see it in their Parent App immediately.");
          }}>Publish plan</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Curriculum approval ────────────────────────────────────
function CurriculumView() {
  const app = useApp();
  const pending = app.courses.filter((c) => c.status === "pending");
  const [review, setReview] = useState<string | null>(null);
  const course = pending.find((c) => c.id === review);
  return (
    <div className="space-y-5">
      <SectionTitle icon={<BookMarked size={15} />} title="Curriculum Approval" sub="District QA gate before courses go live to students" />
      {pending.length === 0 && (
        <Card className="p-10 text-center">
          <CheckCheck size={28} className="mx-auto text-emerald-300 mb-3" />
          <p className="font-display font-semibold text-white">Queue clear</p>
          <p className="text-xs text-slate-500 mt-1.5">Every submitted course has been reviewed. New submissions appear here instantly.</p>
        </Card>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {pending.map((c) => {
          const t = TEACHERS.find((x) => x.id === c.teacherId)!;
          return (
            <Card key={c.id} className="p-5 relative overflow-hidden">
              <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: c.color }} />
              <div className="flex items-center justify-between"><Badge tone="violet">{c.subject}</Badge><Badge tone="amber" dot>Awaiting review</Badge></div>
              <h3 className="font-display font-semibold text-white text-lg mt-3">{c.title}</h3>
              <p className="text-[11px] text-slate-500 mt-1.5">By {t.name} · {c.gradeBand} · {c.modules.length} modules · {c.weeks} weeks · capstone {c.capstone.points} pts</p>
              <div className="flex gap-2 mt-4">
                <Btn size="sm" className="flex-1" onClick={() => setReview(c.id)}>Open review checklist</Btn>
              </div>
            </Card>
          );
        })}
      </div>
      <Modal open={!!course} onClose={() => setReview(null)} title={course ? `Review — ${course.title}` : ""} wide>
        {course && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {["Standards-aligned objectives", "Assessment blueprint present", "Capstone rubric defined", "Accessibility & reading level"].map((c, i) => (
                <div key={c} className="glass-soft rounded-xl p-3 text-center">
                  <Check size={16} className="mx-auto text-emerald-400 mb-1.5" />
                  <p className="text-[10px] text-slate-300 leading-snug">{c}</p>
                </div>
              ))}
            </div>
            <div className="glass-soft rounded-xl p-4">
              <p className="text-[12px] font-semibold text-white">Capstone — {course.capstone.title}</p>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{course.capstone.brief}</p>
            </div>
            <div className="flex gap-2.5">
              <Btn variant="success" className="flex-1" icon={<Check size={14} />} onClick={() => { app.decideCurriculum(course.id, true); setReview(null); }}>Approve & publish</Btn>
              <Btn variant="danger" className="flex-1" icon={<X size={14} />} onClick={() => { app.decideCurriculum(course.id, false); setReview(null); }}>Return for revision</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Analytics ──────────────────────────────────────────────
function AnalyticsView() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Enrollment (YTD)" value={2740} icon={<GraduationCap size={17} />} accent="#34d399" delta="+5.2%" />
        <Stat label="Annual revenue run-rate" value={23.1} decimals={1} prefix="$" suffix="M" icon={<Wallet size={17} />} accent="#22d3ee" delta="+8.4%" />
        <Stat label="Retention (re-enrollment)" value={96.2} decimals={1} suffix="%" icon={<Activity size={17} />} accent="#a78bfa" />
        <Stat label="Family NPS" value={67} icon={<TrendingUp size={17} />} accent="#fbbf24" delta="+9 pts" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle icon={<TrendingUp size={15} />} title="Enrollment growth" sub="Trailing 12 months" />
          <AreaChart data={ENROLLMENT_TREND} labels={SCHOOL_MONTHS} color="#34d399" height={190} format={(v) => v.toLocaleString()} />
        </Card>
        <Card className="p-5">
          <SectionTitle icon={<BarChart3 size={15} />} title="Revenue by month ($M)" sub="Tuition + fees + licenses" />
          <BarChart data={REVENUE_TREND} labels={SCHOOL_MONTHS} color="#22d3ee" height={190} format={(v) => "$" + v.toFixed(2) + "M"} />
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <SectionTitle icon={<Percent size={15} />} title="Outcome distribution" sub="District grade bands" />
          <div className="space-y-3 mt-1">{GRADE_DIST.map((g) => <HBar key={g.band} label={g.band} pct={g.pct} color={g.color} right={`${g.pct}%`} />)}</div>
          <div className="flex justify-center mt-5"><Donut value={66} size={110} color="#34d399" label="66%" sub="A/B bands" /></div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <SectionTitle icon={<Users size={15} />} title="Teacher effectiveness" sub="Rating × mastery gain — top of leaderboard" />
          <div className="space-y-2.5">
            {TEACHERS.slice(0, 5).map((t, i) => (
              <div key={t.id} className="flex items-center gap-3.5 glass-soft rounded-xl px-4 py-3">
                <span className="font-display font-bold text-slate-500 w-5">{i + 1}</span>
                <Avatar name={t.name} id={t.id} size={32} />
                <div className="flex-1 min-w-0"><p className="text-[13px] text-white font-medium">{t.name}</p><p className="text-[10px] text-slate-500">{t.subject}</p></div>
                <div className="w-36"><Progress value={t.rating * 20} color="#a78bfa" height={6} /></div>
                <Badge tone="violet">★ {t.rating}</Badge>
                <Badge tone="green">+{[11, 9, 9, 8, 7][i]}% mastery</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-5 border-indigo-400/20" >
        <div className="flex flex-wrap items-center gap-4">
          <span className="w-11 h-11 rounded-xl grid place-items-center bg-indigo-500/15 text-indigo-300 shrink-0"><Rocket size={18} /></span>
          <div className="flex-1 min-w-[260px]">
            <p className="text-sm font-semibold text-white">AI board brief — auto-generated</p>
            <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Revenue is tracking 4% ahead of plan. Attendance dipped 0.8% on Mondays after holidays — schedule Monday advisory blocks. If the two flagged Grade-10 students receive intervention this month, projected term GPA improves district-wide by 0.04.</p>
          </div>
          <Btn size="sm" variant="outline" icon={<Download size={13} />} onClick={() => {}}>Export board pack</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Compliance ─────────────────────────────────────────────
function ComplianceView() {
  const app = useApp();
  const items = [
    { t: "Daily attendance registers filed", s: "100% · 3/3 schools", ok: true, d: "State board requirement §4.2" },
    { t: "Teacher certification currency", s: "152/154 valid", ok: false, d: "2 renewals expiring in 30 days" },
    { t: "Safety & safeguarding training", s: "100% staff complete", ok: true, d: "Annual refresh due next term" },
    { t: "Fee ledger reconciliation", s: "Balanced to the cent", ok: true, d: "Audited weekly by finance rail" },
    { t: "Data-privacy (FERPA-style) audit", s: "Passed", ok: true, d: "Last external audit: this quarter" },
    { t: "Curriculum standards coverage", s: "97% mapped", ok: true, d: "State framework v9 alignment" },
  ];
  const audit = [
    "08:30 — Payroll run approved by District Finance",
    "08:12 — Leave request L-104 approved (E. Petrova cover assigned)",
    "Yesterday — Curriculum item 'Organic Chemistry' entered review",
    "Yesterday — 240 attendance approvals synced to parent apps",
    "Mon — License pool rebalanced: +40 seats to Riverdale STEM",
  ];
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="p-5">
        <SectionTitle icon={<ShieldCheck size={15} />} title="Compliance checklist" sub="Regulatory & accreditation posture" />
        <div className="space-y-2.5">
          {items.map((it, i) => (
            <motion.div key={it.t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3.5 glass-soft rounded-xl p-3.5">
              <span className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${it.ok ? "bg-emerald-400/12 text-emerald-300" : "bg-amber-400/12 text-amber-300"}`}>
                {it.ok ? <FileCheck2 size={15} /> : <AlertTriangle size={15} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white">{it.t}</p>
                <p className="text-[10px] text-slate-500">{it.d}</p>
              </div>
              <Badge tone={it.ok ? "green" : "amber"}>{it.s}</Badge>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Btn size="sm" variant="outline" icon={<Download size={13} />} onClick={() => app.toast("Report exported", "Compliance pack PDF generated for the board.", "info")}>Export for board</Btn>
          <Btn size="sm" variant="ghost" icon={<Send size={13} />} onClick={() => app.toast("Submitted", "Quarterly filing transmitted to the state portal.")}>File quarterly report</Btn>
        </div>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={<Activity size={15} />} title="Audit trail" sub="Immutable operational log · newest first" />
        <div className="relative pl-5 space-y-4 mt-2">
          <span className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-400/50 to-transparent rounded" />
          {audit.map((a, i) => (
            <motion.div key={a} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="relative">
              <span className="absolute -left-5 top-1 w-[10px] h-[10px] rounded-full bg-[#06090f] border-2 border-emerald-400" />
              <p className="text-[12px] text-slate-300 leading-snug">{a}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Licenses ───────────────────────────────────────────────
function LicensesView() {
  const app = useApp();
  const [seats, setSeats] = useState<Record<string, number>>(Object.fromEntries(SCHOOLS.map((s) => [s.id, s.usedSeats])));
  const totalCap = SCHOOLS.reduce((a, s) => a + s.licenseSeats, 0);
  const totalUsed = Object.values(seats).reduce((a, b) => a + b, 0);
  const adjust = (id: string, d: number) => {
    const s = SCHOOLS.find((x) => x.id === id)!;
    setSeats((x) => ({ ...x, [id]: Math.min(s.licenseSeats, Math.max(0, x[id] + d)) }));
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <Stat label="District license seats" value={totalCap} icon={<IdCard size={17} />} accent="#34d399" />
        <Stat label="Seats allocated" value={totalUsed} icon={<KeyRound size={17} />} accent="#22d3ee" />
        <Stat label="Utilization" value={Math.round((totalUsed / totalCap) * 100)} suffix="%" icon={<Percent size={17} />} accent="#a78bfa" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {SCHOOLS.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl grid place-items-center font-display font-bold" style={{ background: `${s.color}25`, color: s.color }}>{s.short}</span>
                <div className="flex-1"><p className="text-sm font-semibold text-white">{s.name}</p><p className="text-[10px] text-slate-500">Annual plan · auto-renews Aug 1</p></div>
              </div>
              <div className="flex justify-center my-4"><Donut value={(seats[s.id] / s.licenseSeats) * 100} size={104} color={s.color} label={`${Math.round((seats[s.id] / s.licenseSeats) * 100)}%`} sub={`${seats[s.id]}/${s.licenseSeats}`} /></div>
              <div className="flex items-center justify-center gap-3">
                <Btn size="sm" variant="ghost" onClick={() => adjust(s.id, -10)}>− 10 seats</Btn>
                <Btn size="sm" variant="outline" onClick={() => { adjust(s.id, 10); app.allocateSeats(s.id, 10); }}>+ 10 seats</Btn>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Calendar / events mgmt ─────────────────────────────────
function EventsView() {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: todayISO(), type: "event" as const, school: "all" as const, desc: "" });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SectionTitle icon={<CalendarDays size={15} />} title="District Calendar & Events" sub="Holidays, exams and events — published to every app instantly" />
        <Btn size="sm" icon={<Plus size={14} />} onClick={() => setOpen(true)}>Publish event</Btn>
      </div>
      <CalendarMonth events={app.events} accent="#34d399" title="District-wide calendar" />
      <Modal open={open} onClose={() => setOpen(false)} title="Publish calendar item">
        <div className="space-y-4">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Spring Concert" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Type">
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                {Object.entries(EVENT_STYLE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Audience">
            <Select value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value as any })}>
              <option value="all">All schools</option>
              {SCHOOLS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label="Description"><Textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Short detail shown in every calendar…" /></Field>
          <Btn className="w-full" disabled={!form.title.trim() || !form.desc.trim()} onClick={() => {
            app.addEvent({ title: form.title.trim(), date: form.date, type: form.type, schoolId: form.school as any, desc: form.desc.trim() });
            setOpen(false); setForm({ title: "", date: todayISO(), type: "event", school: "all", desc: "" });
          }}>Publish to all calendars</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Settings ───────────────────────────────────────────────
function SettingsView() {
  const app = useApp();
  const [cfg, setCfg] = useState({ selfMark: true, parentAlerts: true, aiSuite: true, diary: true, commute: true, autoApprove: false });
  const [year, setYear] = useState("2025–26");
  const [scale, setScale] = useState("Letter (A–F)");
  const rows: { k: keyof typeof cfg; t: string; d: string }[] = [
    { k: "selfMark", t: "Student attendance self check-in", d: "Students mark themselves; teachers approve" },
    { k: "autoApprove", t: "Auto-approve on-campus check-ins", d: "Skip teacher approval when device is on school network" },
    { k: "commute", t: "Home-to-school commute tracking", d: "Parent departures + teacher arrival confirmations" },
    { k: "parentAlerts", t: "Instant parent notifications", d: "Push, SMS and email for attendance & journey events" },
    { k: "diary", t: "Daily learning diaries", d: "Student diaries + class diaries visible to parents" },
    { k: "aiSuite", t: "EduNova AI suite", d: "Quiz generator, reports, syllabus, test planner" },
  ];
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="p-5">
        <SectionTitle icon={<Settings2 size={15} />} title="Platform configuration" sub="Applies district-wide, instantly" />
        <div className="space-y-1">
          {rows.map((r) => (
            <div key={r.k} className="flex items-center gap-4 py-3.5 border-b border-white/5 last:border-0">
              <div className="flex-1"><p className="text-[13px] font-medium text-white">{r.t}</p><p className="text-[11px] text-slate-500 mt-0.5">{r.d}</p></div>
              <Toggle on={cfg[r.k]} onChange={(v) => { setCfg((c) => ({ ...c, [r.k]: v })); app.toast("Setting updated", `${r.t} ${v ? "enabled" : "disabled"} across the district.`, "info"); }} />
            </div>
          ))}
        </div>
      </Card>
      <div className="space-y-5">
        <Card className="p-5">
          <SectionTitle icon={<Building2 size={15} />} title="Academic structure" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Academic year"><Select value={year} onChange={(e) => { setYear(e.target.value); }}>{["2025–26", "2026–27"].map((y) => <option key={y}>{y}</option>)}</Select></Field>
            <Field label="Grading scale"><Select value={scale} onChange={(e) => setScale(e.target.value)}>{["Letter (A–F)", "Percentage", "IB (1–7)", "Standards (1–4)"].map((y) => <option key={y}>{y}</option>)}</Select></Field>
            <Field label="Terms per year"><Select>{[2, 3, 4].map((y) => <option key={y}>{y}</option>)}</Select></Field>
            <Field label="Periods per day"><Select>{[6, 7, 8].map((y) => <option key={y}>{y}</option>)}</Select></Field>
          </div>
          <Btn size="sm" className="mt-4" onClick={() => app.toast("Structure saved", "Rolls out next academic term.")}>Save structure</Btn>
        </Card>
        <Card className="p-5 border-emerald-400/20">
          <div className="flex items-center gap-3.5">
            <ShieldCheck size={20} className="text-emerald-300 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Security posture: strong</p>
              <p className="text-[11px] text-slate-400 mt-0.5">SSO enforced · role-based access on 4 workspaces · encrypted at rest & in transit · nightly backups retained 90 days.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────
const TITLES: Record<string, [string, string]> = {
  overview: ["District Command", "Everything, everywhere, one deck"],
  schools: ["Schools", "Multi-campus management"],
  teachers: ["Teacher Management", "Directory, periods, payroll, leaves & onboarding"],
  students: ["Students", "Profiles, records & academic history"],
  fees: ["Fee Management", "Plans, dues and collections"],
  curriculum: ["Curriculum Approval", "District QA gate for new courses"],
  analytics: ["Analytics", "Operational, pedagogical & business metrics"],
  compliance: ["Compliance", "Reporting, filings & audit trail"],
  licenses: ["Licenses", "Seat allocation across schools"],
  calendar: ["Calendar & Events", "District-wide publishing"],
  settings: ["Settings", "System configuration"],
};

export default function AdminApp() {
  const [tab, setTab] = useState("overview");
  const app = useApp();
  const pendingLeaves = app.leaves.filter((l) => l.status === "pending").length;
  const pendingCourses = app.courses.filter((c) => c.status === "pending").length;
  const nav: NavItem[] = [
    { id: "overview", label: "Command Deck", icon: <LayoutDashboard size={16} /> },
    { id: "schools", label: "Schools", icon: <School size={16} /> },
    { id: "teachers", label: "Teacher Management", icon: <Users size={16} />, badge: pendingLeaves || undefined },
    { id: "students", label: "Students", icon: <GraduationCap size={16} /> },
    { id: "fees", label: "Fees & Dues", icon: <CreditCard size={16} /> },
    { id: "curriculum", label: "Curriculum Approval", icon: <BookMarked size={16} />, badge: pendingCourses || undefined },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
    { id: "compliance", label: "Compliance", icon: <ShieldCheck size={16} /> },
    { id: "licenses", label: "Licenses", icon: <IdCard size={16} /> },
    { id: "calendar", label: "Calendar & Events", icon: <CalendarDays size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings2 size={16} /> },
  ];
  const [title, sub] = TITLES[tab];
  return (
    <DashboardShell role="admin" nav={nav} active={tab} onNav={setTab} title={title} subtitle={sub}>
      {tab === "overview" && <Overview go={setTab} />}
      {tab === "schools" && <SchoolsView />}
      {tab === "teachers" && <TeacherManagement />}
      {tab === "students" && <StudentsView />}
      {tab === "fees" && <FeesView />}
      {tab === "curriculum" && <CurriculumView />}
      {tab === "analytics" && <AnalyticsView />}
      {tab === "compliance" && <ComplianceView />}
      {tab === "licenses" && <LicensesView />}
      {tab === "calendar" && <EventsView />}
      {tab === "settings" && <SettingsView />}
    </DashboardShell>
  );
}

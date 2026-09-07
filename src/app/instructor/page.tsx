"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CalendarCheck2, NotebookPen, GraduationCap, BarChart3, Sparkles,
  CalendarDays, MessageSquareText, ClipboardCheck, BookOpenCheck, Users, Check, X,
  Clock3, CheckCheck, AlertTriangle, Bus, Plus, ChevronRight, Send, FileText, Star,
  Presentation, Timer, TrendingUp, BookMarked, ArrowRight, Coffee, PenLine,
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/shell";
import { useApp, studentById } from "@/lib/store";
import {
  ASSIGNMENTS, COURSES, Course, GRADE_DIST, MASTERY_TOPICS, STUDENTS, Submission,
  TEACHERS, fmtDate, todayISO, rel,
} from "@/lib/data";
import { Avatar, Badge, Btn, Card, Field, Input, Modal, Progress, SectionTitle, Select, Stat, Textarea } from "@/components/ui";
import { BarChart, Donut, HBar, HeatRow } from "@/components/charts";
import { ATT_STYLE, CalendarMonth, DiaryCard, DiaryComposer } from "@/components/widgets";
import { AIReportPanel, QuizGenerator } from "@/components/ai";
import { ThreadChat } from "@/components/chat";

const ME = "tch1";
const CLASS_STUDENTS = ["stu1", "stu5", "stu6", "stu7", "stu8", "stu9", "stu10"];

const MY_PERIODS = [
  { p: 1, time: "08:00 – 08:45", cls: "Grade 10-A", topic: "Logarithm laws workshop", room: "M-204" },
  { p: 2, time: "08:50 – 09:35", cls: "Grade 9-A", topic: "Quadratics — vertex form", room: "M-204" },
  { p: 4, time: "10:50 – 11:35", cls: "Grade 10-B", topic: "Rational functions clinic", room: "M-207" },
  { p: 6, time: "13:15 – 14:00", cls: "Free period", topic: "Grading & prep block", room: "Staff hub" },
  { p: 7, time: "14:05 – 14:50", cls: "Grade 10-A", topic: "Support seminar (by invitation)", room: "M-204" },
];

// ─── Overview ───────────────────────────────────────────────
function Overview({ go }: { go: (t: string) => void }) {
  const app = useApp();
  const t = todayISO();
  const dayAtt = app.attendance.filter((a) => a.date === t && CLASS_STUDENTS.includes(a.studentId));
  const pendingAtt = dayAtt.filter((a) => a.status === "pending");
  const approvedAtt = dayAtt.filter((a) => ["approved", "late"].includes(a.status)).length;
  const ungraded = app.submissions.filter((s) => s.status === "submitted");
  const nextPeriod = MY_PERIODS[0];
  return (
    <div className="space-y-5">
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 bg-violet-500" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <Badge tone="violet" dot>Live teaching day</Badge>
            <h2 className="font-display font-bold text-white text-2xl md:text-3xl mt-3">Good morning, Ms. Chen</h2>
            <p className="text-[13px] text-slate-400 mt-1.5">
              <span className="text-amber-300 font-medium">{pendingAtt.length} attendance approvals</span> and
              <span className="text-violet-300 font-medium"> {ungraded.length} submissions</span> need you. First period: {nextPeriod.cls} · {nextPeriod.topic}.
            </p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Btn icon={<CalendarCheck2 size={15} />} onClick={() => go("attendance")}>Open Attendance Desk</Btn>
            <Btn variant="ghost" icon={<ClipboardCheck size={15} />} onClick={() => go("grading")}>Grade {ungraded.length} submissions</Btn>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Present today (10-A)" value={approvedAtt} suffix="/7" icon={<Users size={17} />} accent="#34d399" />
        <Stat label="Pending approvals" value={pendingAtt.length} icon={<Clock3 size={17} />} accent="#fbbf24" />
        <Stat label="Ungraded work" value={ungraded.length} icon={<ClipboardCheck size={17} />} accent="#a78bfa" />
        <Stat label="Class mastery" value={80} suffix="%" icon={<TrendingUp size={17} />} accent="#22d3ee" delta="+9% term" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* today schedule */}
        <Card className="p-5">
          <SectionTitle icon={<Timer size={15} />} title="Today's periods" sub="6 assigned · inside your 30/wk cap" />
          <div className="space-y-2.5 relative">
            {MY_PERIODS.map((p, i) => (
              <motion.div key={p.p} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className={`flex gap-3.5 p-3 rounded-xl border ${p.cls === "Free period" ? "border-white/6 bg-white/[0.015]" : "border-violet-400/15 bg-violet-500/6"}`}>
                <div className="w-10 h-10 rounded-lg grid place-items-center shrink-0 font-display font-bold text-sm"
                  style={{ background: p.cls === "Free period" ? "rgba(148,163,184,.1)" : "rgba(167,139,250,.16)", color: p.cls === "Free period" ? "#64748b" : "#c4b5fd" }}>
                  P{p.p}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white flex items-center gap-2">{p.cls} {p.cls === "Free period" && <Coffee size={11} className="text-slate-500" />}</p>
                  <p className="text-[11px] text-slate-400 truncate">{p.topic}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{p.time} · {p.room}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* approvals preview */}
        <Card className="p-5">
          <SectionTitle icon={<CalendarCheck2 size={15} />} title="Attendance queue" sub="Self-marked by students"
            right={<Btn size="sm" variant="ghost" onClick={() => go("attendance")}>Open desk</Btn>} />
          <div className="space-y-2">
            {pendingAtt.length === 0 && <p className="text-xs text-slate-500 py-6 text-center">All caught up — no pending check-ins.</p>}
            {pendingAtt.map((a) => {
              const s = studentById(a.studentId)!;
              return (
                <div key={a.id} className="flex items-center gap-3 glass-soft rounded-xl p-3">
                  <Avatar name={s.name} id={s.id} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{s.name}</p>
                    <p className="text-[10px] text-slate-500">marked {a.markedAt}</p>
                  </div>
                  <Btn size="sm" icon={<Check size={12} />} onClick={() => app.approveAttendance([a.id], "Sarah Chen")}>Approve</Btn>
                </div>
              );
            })}
          </div>
        </Card>

        {/* quick actions + AI */}
        <div className="space-y-5">
          <Card className="p-5">
            <SectionTitle icon={<Sparkles size={15} />} title="Quick actions" />
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { l: "Generate quiz", i: <Sparkles size={15} />, fn: () => go("ai") },
                { l: "Write class diary", i: <PenLine size={15} />, fn: () => go("diary") },
                { l: "New course draft", i: <Plus size={15} />, fn: () => go("courses") },
                { l: "Message parents", i: <MessageSquareText size={15} />, fn: () => go("messages") },
              ].map((a) => (
                <button key={a.l} onClick={a.fn} className="glass-soft rounded-xl p-3.5 text-left text-[12px] font-medium text-slate-200 hover:border-violet-400/40 hover:bg-violet-500/8 transition-all flex flex-col gap-2">
                  <span className="text-violet-300">{a.i}</span>{a.l}
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-white mb-3">Class wellbeing pulse</p>
            <BarChart data={[62, 74, 81, 78, 88, 45, 38]} labels={["M", "T", "W", "T", "F", "S", "S"]} color="#a78bfa" height={120} format={(v) => v + "% active"} />
          </Card>
        </div>
      </div>

      {/* at risk */}
      <Card className="p-5">
        <SectionTitle icon={<AlertTriangle size={15} />} title="Early-warning list" sub="Students trending below 65% in your subject" />
        <div className="grid md:grid-cols-2 gap-3.5">
          {["stu9", "stu6"].map((sid) => {
            const s = studentById(sid)!;
            const g = app.grades.find((x) => x.studentId === sid && x.courseId === "crs1");
            const pct = g ? Math.round((g.items.reduce((a, i) => a + i.score, 0) / g.items.reduce((a, i) => a + i.out, 0)) * 100) : 0;
            return (
              <div key={sid} className="glass-soft rounded-xl p-4 flex items-center gap-4">
                <Avatar name={s.name} id={s.id} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-[11px] text-slate-500">Current standing in Algebra II</p>
                  <Progress value={pct} color="#fb7185" height={6} className="mt-2" />
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-xl text-rose-300">{pct}%</p>
                  <button onClick={() => app.toast("Intervention scheduled", `Guardian conference drafted for ${s.name.split(" ")[0]}'s family.`, "info")} className="text-[10px] text-indigo-300 hover:text-indigo-200 font-medium mt-1">Plan intervention →</button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Attendance Desk ────────────────────────────────────────
function AttendanceDesk() {
  const app = useApp();
  const t = todayISO();
  const [selection, setSelection] = useState<string[]>([]);
  const rows = CLASS_STUDENTS.map((sid) => {
    const s = studentById(sid)!;
    const rec = app.attendance.find((a) => a.studentId === sid && a.date === t);
    const journey = app.journeys.find((j) => j.studentId === sid && j.date === t);
    return { s, rec, journey };
  });
  const pending = rows.filter((r) => r.rec?.status === "pending");
  const presentCount = rows.filter((r) => r.rec && ["approved", "late"].includes(r.rec.status)).length;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Present / approved" value={presentCount} suffix={` of ${rows.length}`} icon={<CheckCheck size={17} />} accent="#34d399" />
        <Stat label="Awaiting approval" value={pending.length} icon={<Clock3 size={17} />} accent="#fbbf24" />
        <Stat label="Not yet marked" value={rows.filter((r) => !r.rec || r.rec.status === "unmarked").length} icon={<AlertTriangle size={17} />} accent="#fb7185" />
        <Stat label="Left home (alerts)" value={rows.filter((r) => r.journey?.leftHomeAt).length} icon={<Bus size={17} />} accent="#22d3ee" />
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <SectionTitle icon={<CalendarCheck2 size={15} />} title="Grade 10-A — Today" sub="Approve self check-ins or quick-mark the roster" />
          <div className="flex gap-2">
            <Btn size="sm" variant="ghost" disabled={!selection.length} onClick={() => { app.approveAttendance(selection, "Sarah Chen"); setSelection([]); }}>
              Approve selected ({selection.length})
            </Btn>
            <Btn size="sm" variant="success" icon={<CheckCheck size={14} />} disabled={!pending.length} onClick={() => { app.approveAttendance(pending.map((p) => p.rec!.id), "Sarah Chen"); setSelection([]); }}>
              Approve all pending
            </Btn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/8">
                <th className="pb-3 font-semibold w-8"></th>
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Commute</th>
                <th className="pb-3 font-semibold">Marked at</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ s, rec, journey }, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="py-3">
                    <input type="checkbox" disabled={rec?.status !== "pending"} checked={selection.includes(rec?.id ?? "")}
                      onChange={(e) => setSelection((sel) => e.target.checked ? [...sel, rec!.id] : sel.filter((x) => x !== rec!.id))}
                      className="w-4 h-4 rounded accent-violet-500 disabled:opacity-20" />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} id={s.id} size={34} />
                      <div><p className="text-[13px] font-medium text-white">{s.name}</p><p className="text-[10px] text-slate-500">{s.grade} · {s.section}</p></div>
                    </div>
                  </td>
                  <td className="py-3">
                    {journey?.leftHomeAt ? (
                      <span className="text-[11px] text-cyan-300 flex items-center gap-1.5"><Bus size={12} /> Left {journey.leftHomeAt}{journey.arrivedAt ? ` · Arrived ${journey.arrivedAt}` : ""}</span>
                    ) : <span className="text-[11px] text-slate-600">—</span>}
                  </td>
                  <td className="py-3 text-[12px] text-slate-400">{rec?.markedAt ?? "—"}</td>
                  <td className="py-3"><Badge tone={ATT_STYLE[rec?.status ?? "unmarked"].tone as any} dot={rec?.status === "pending"}>{ATT_STYLE[rec?.status ?? "unmarked"].label}</Badge></td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {rec?.status === "pending" && (
                        <Btn size="sm" icon={<Check size={12} />} onClick={() => app.approveAttendance([rec.id], "Sarah Chen")}>Approve</Btn>
                      )}
                      {(rec?.status === "approved") && (
                        <span className="text-[10px] text-emerald-400/80 mr-1 flex items-center gap-1"><CheckCheck size={11} /> {rec.approvedBy?.split(" ")[1] ?? "You"}</span>
                      )}
                      {(!rec || ["unmarked", "absent", "late"].includes(rec.status)) && (
                        <>
                          <button onClick={() => app.quickMark(s.id, "approved", "Sarah Chen")} className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/25 hover:bg-emerald-400/20 transition">Present</button>
                          <button onClick={() => app.quickMark(s.id, "late", "Sarah Chen")} className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/25 hover:bg-amber-400/20 transition">Late</button>
                          <button onClick={() => app.quickMark(s.id, "absent", "Sarah Chen")} className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-rose-400/10 text-rose-300 border border-rose-400/25 hover:bg-rose-400/20 transition">Absent</button>
                        </>
                      )}
                      {journey && !journey.arrivedAt && journey.leftHomeAt && (
                        <button onClick={() => app.notifyArrival(s.id, "Sarah Chen")} className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/25 hover:bg-cyan-400/20 transition flex items-center gap-1">
                          <Bus size={10} /> Notify arrival
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5"><Bus size={12} className="text-cyan-300" /> Approving a Rahman-family student's check-in automatically sends the "reached school" alert to their parents.</p>
      </Card>
    </div>
  );
}

// ─── Course studio ──────────────────────────────────────────
function CourseStudio() {
  const app = useApp();
  const mine = app.courses.filter((c) => c.teacherId === ME);
  const [wizard, setWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", subject: "Mathematics", grade: "Grade 10", m1: "Foundations", m2: "Applications", l1: 3, l2: 3 });
  const create = () => {
    const mk = (n: number, count: number) => ({
      id: `m${n}`, title: n === 1 ? form.m1 : form.m2,
      lessons: Array.from({ length: count }, (_, i) => ({ id: `l${n}${i}`, title: `${n === 1 ? form.m1 : form.m2} — Part ${i + 1}`, type: "video" as const, dur: 12, summary: "Draft lesson — add your narrative and resources.", points: ["Learning objective " + (i + 1)] })),
    });
    app.courses.push; // no-op guard
    const draft: Course = {
      id: `crs${Date.now() % 100000}`, title: form.title, subject: form.subject, teacherId: ME, schoolId: "sch1", gradeBand: form.grade,
      color: "#a78bfa", glow: "rgba(167,139,250,.3)", rating: 0, weeks: form.l1 + form.l2 + 6, status: "draft", enrolled: [],
      modules: [mk(1, form.l1), mk(2, form.l2)],
      capstone: { title: `${form.title} — Capstone`, brief: "Define your capstone brief and rubric before publishing.", points: 100 },
    };
    app.courses.unshift(draft);
    setWizard(false); setStep(0); setForm({ title: "", subject: "Mathematics", grade: "Grade 10", m1: "Foundations", m2: "Applications", l1: 3, l2: 3 });
    app.toast("Course draft created", "Open it, then submit for district approval when ready.");
  };
  return (
    <div className="space-y-5">
      <SectionTitle icon={<Presentation size={16} />} title="Course Studio" sub="Author, structure and publish your courses"
        right={<Btn icon={<Plus size={15} />} onClick={() => setWizard(true)}>New course</Btn>} />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mine.map((c, i) => {
          const lessons = c.modules.flatMap((m) => m.lessons);
          const subs = app.submissions.filter((s) => { const a = ASSIGNMENTS.find((x) => x.id === s.assignmentId); return a?.courseId === c.id && s.status === "submitted"; });
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 relative overflow-hidden" hover>
                <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: c.color }} />
                <div className="flex items-center justify-between">
                  <Badge tone="violet">{c.subject}</Badge>
                  <Badge tone={c.status === "published" ? "green" : c.status === "pending" ? "amber" : "slate"} dot={c.status === "pending"}>
                    {c.status === "published" ? "Published" : c.status === "pending" ? "In district review" : "Draft"}
                  </Badge>
                </div>
                <h3 className="font-display font-semibold text-white text-lg mt-3 leading-snug">{c.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1.5">{c.gradeBand} · {c.modules.length} modules · {lessons.length} lessons</p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  {[[c.enrolled.length + (c.status === "published" ? 24 : 0), "learners"], [c.rating || "—", "rating"], [subs.length, "to grade"]].map(([v, l]) => (
                    <div key={l as string} className="glass-soft rounded-lg py-2"><p className="font-display font-bold text-white text-sm">{v as any}</p><p className="text-[9px] text-slate-500">{l as string}</p></div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  {c.status === "draft" && <Btn size="sm" className="flex-1" icon={<Send size={13} />} onClick={() => app.publishCourse(c.id)}>Submit for approval</Btn>}
                  {c.status === "pending" && <Btn size="sm" variant="ghost" className="flex-1" disabled>Awaiting district review</Btn>}
                  {c.status === "published" && <Btn size="sm" variant="outline" className="flex-1" onClick={() => app.toast("Editor opened", "Lesson editor would open here with versioning.", "info")}>Edit content</Btn>}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* wizard */}
      <Modal open={wizard} onClose={() => setWizard(false)} title="Create a course — guided wizard" wide>
        <div className="flex items-center gap-2 mb-6">
          {["Details", "Curriculum", "Review"].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold transition-all ${step >= i ? "bg-violet-500 text-white" : "bg-white/8 text-slate-500"}`}>{i + 1}</span>
                <span className={`text-xs font-medium ${step >= i ? "text-white" : "text-slate-500"}`}>{s}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-[2px] rounded ${step > i ? "bg-violet-500" : "bg-white/8"}`} />}
            </React.Fragment>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <Field label="Course title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Statistics & Probability" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Subject"><Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{["Mathematics", "Physics", "English", "Computer Science", "History", "Chemistry"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
                <Field label="Grade band"><Select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>{["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Module 1 title"><Input value={form.m1} onChange={(e) => setForm({ ...form, m1: e.target.value })} /></Field>
                <Field label={`Lessons · ${form.l1}`}><input type="range" min={2} max={6} value={form.l1} onChange={(e) => setForm({ ...form, l1: +e.target.value })} className="w-full accent-violet-500 mt-3" /></Field>
                <Field label="Module 2 title"><Input value={form.m2} onChange={(e) => setForm({ ...form, m2: e.target.value })} /></Field>
                <Field label={`Lessons · ${form.l2}`}><input type="range" min={2} max={6} value={form.l2} onChange={(e) => setForm({ ...form, l2: +e.target.value })} className="w-full accent-violet-500 mt-3" /></Field>
              </div>
              <div className="rounded-xl bg-violet-500/8 border border-violet-400/20 p-3.5 text-[11px] text-violet-200/80">You can add more modules, adaptive quizzes and a capstone rubric after the draft is created.</div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <div className="glass-soft rounded-xl p-5">
                <p className="font-display font-semibold text-white text-lg">{form.title || "Untitled course"}</p>
                <p className="text-xs text-slate-400 mt-1">{form.subject} · {form.grade} · {form.l1 + form.l2} lessons across 2 starter modules</p>
                <div className="flex gap-2 mt-3 flex-wrap"><Badge tone="violet">{form.m1} · {form.l1} lessons</Badge><Badge tone="cyan">{form.m2} · {form.l2} lessons</Badge><Badge tone="slate">Capstone 100 pts</Badge></div>
              </div>
              <p className="text-[11px] text-slate-500">The draft is private to you. Submit it for district approval to make it visible in the catalog.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between mt-7">
          <Btn variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Btn>
          {step < 2 ? <Btn disabled={step === 0 && !form.title.trim()} onClick={() => setStep((s) => s + 1)}>Continue <ChevronRight size={14} /></Btn>
            : <Btn icon={<Check size={15} />} onClick={create}>Create draft</Btn>}
        </div>
      </Modal>
    </div>
  );
}

// ─── Class diary ────────────────────────────────────────────
function ClassDiary() {
  const app = useApp();
  const entries = app.diary.filter((d) => d.ownerId === ME);
  return (
    <div className="grid lg:grid-cols-[1fr_330px] gap-5">
      <div>
        <SectionTitle icon={<NotebookPen size={16} />} title="Class Diary — Grade 10-A" sub="Daily log of what was taught, homework and observations — visible to parents"
          right={<DiaryComposer placeholder="e.g. Logarithm laws — pair workshop" onSave={(title, body, mood, tags) => app.addDiary({ ownerId: ME, ownerRole: "teacher", className: "Grade 10-A", date: todayISO(), title, body, mood, tags })} />} />
        <div className="space-y-4">{entries.map((e, i) => <DiaryCard key={e.id} e={e} i={i} />)}</div>
      </div>
      <div className="space-y-5">
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-3">This week's coverage</p>
          {["Inverse functions", "Rational asymptotes", "Log laws (intro)", "Problem set 4.2", "Support seminar"].map((t, i) => (
            <div key={t} className="flex items-center gap-2.5 py-2 border-b border-white/5 last:border-0">
              <span className="w-6 h-6 rounded-md grid place-items-center bg-violet-500/15 text-violet-300 text-[10px] font-bold">D{i + 1}</span>
              <span className="text-[12px] text-slate-300">{t}</span>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-2">Why the diary matters</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">Parents see this log next to their child's personal diary — alignment between classroom and home is the strongest predictor of term outcomes.</p>
        </Card>
      </div>
    </div>
  );
}

// ─── Grading desk ───────────────────────────────────────────
function GradingDesk() {
  const app = useApp();
  const queue = app.submissions.filter((s) => s.status === "submitted");
  const graded = app.submissions.filter((s) => s.status === "graded");
  const [active, setActive] = useState<Submission | null>(null);
  const [grade, setGrade] = useState(80);
  const [feedback, setFeedback] = useState("");
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Waiting to grade" value={queue.length} icon={<ClipboardCheck size={17} />} accent="#fbbf24" />
        <Stat label="Graded this term" value={graded.length} icon={<CheckCheck size={17} />} accent="#34d399" />
        <Stat label="Avg turnaround" value={1.8} decimals={1} suffix=" days" icon={<Clock3 size={17} />} accent="#22d3ee" delta="fast" />
        <Stat label="Class average" value={82} suffix="%" icon={<BarChart3 size={17} />} accent="#a78bfa" />
      </div>
      <Card className="p-5">
        <SectionTitle icon={<ClipboardCheck size={15} />} title="Grading queue" sub="Newest submissions first" />
        <div className="space-y-3">
          {queue.length === 0 && <p className="text-center text-slate-500 text-sm py-8">Queue empty — everything is graded. Enjoy your evening.</p>}
          {queue.map((s, i) => {
            const a = ASSIGNMENTS.find((x) => x.id === s.assignmentId)!;
            const st = studentById(s.studentId)!;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-soft rounded-xl p-4 flex flex-wrap items-center gap-4">
                <Avatar name={st.name} id={st.id} size={40} />
                <div className="flex-1 min-w-[220px]">
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <p className="text-[11px] text-slate-500">{st.name} · submitted {fmtDate(s.submittedAt)} · {a.points} pts</p>
                  {s.text && <p className="text-[11px] text-slate-400 mt-1.5 italic">“{s.text}”</p>}
                </div>
                <Btn size="sm" icon={<PenLine size={13} />} onClick={() => { setActive(s); setGrade(Math.round(a.points * 0.8)); setFeedback(""); }}>Open & grade</Btn>
              </motion.div>
            );
          })}
        </div>
      </Card>
      <Modal open={!!active} onClose={() => setActive(null)} title={active ? `Grade — ${studentById(active.studentId)?.name}` : ""}>
        {active && (() => {
          const a = ASSIGNMENTS.find((x) => x.id === active.assignmentId)!;
          return (
            <div className="space-y-5">
              <div className="glass-soft rounded-xl p-4">
                <p className="text-sm font-semibold text-white">{a.title}</p>
                <p className="text-[11px] text-slate-500 mt-1">{active.text ?? "Submitted via portal"}</p>
                <div className="mt-2.5 flex gap-2"><Badge tone="cyan">submission.pdf</Badge><Badge tone="slate">auto-scan: originality 96%</Badge></div>
              </div>
              <Field label={`Score — ${grade} / ${a.points}`}>
                <input type="range" min={0} max={a.points} value={grade} onChange={(e) => setGrade(+e.target.value)} className="w-full accent-violet-500" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>0</span><span className="font-semibold text-white">{Math.round((grade / a.points) * 100)}% · {grade / a.points >= 0.9 ? "Distinction" : grade / a.points >= 0.75 ? "Merit" : grade / a.points >= 0.6 ? "Pass" : "Support"}</span><span>{a.points}</span></div>
              </Field>
              <Field label="Feedback to student"><Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Specific, kind, actionable — what was strong and what to improve…" /></Field>
              <Btn className="w-full" icon={<Send size={14} />} onClick={() => { app.gradeSubmission(active.id, grade, feedback || "Graded — well done. See margin notes."); setActive(null); }}>Publish grade & feedback</Btn>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

// ─── Grade matrix ───────────────────────────────────────────
function GradeMatrix() {
  const app = useApp();
  return (
    <Card className="p-5">
      <SectionTitle icon={<BookOpenCheck size={15} />} title="Grade Book — Algebra II · Grade 10-A" sub="Live matrix from graded assessments" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead><tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/8">
            <th className="pb-3 font-semibold">Student</th><th className="pb-3 font-semibold">Midterm</th><th className="pb-3 font-semibold">Quiz 2</th><th className="pb-3 font-semibold">Standing</th><th className="pb-3 font-semibold text-right">Trend</th>
          </tr></thead>
          <tbody>
            {CLASS_STUDENTS.map((sid) => {
              const s = studentById(sid)!;
              const g = app.grades.find((x) => x.studentId === sid && x.courseId === "crs1");
              const mid = g?.items.find((i) => i.name.includes("Midterm"));
              const quiz = g?.items.find((i) => i.name.includes("Quiz 2"));
              const pct = g ? Math.round((g.items.reduce((a, i) => a + i.score, 0) / g.items.reduce((a, i) => a + i.out, 0)) * 100) : null;
              return (
                <tr key={sid} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="py-3"><div className="flex items-center gap-2.5"><Avatar name={s.name} id={s.id} size={30} /><span className="text-[13px] text-white font-medium">{s.name}</span></div></td>
                  <td className="py-3 text-[12px] text-slate-300">{mid ? `${mid.score}/${mid.out}` : "—"}</td>
                  <td className="py-3 text-[12px] text-slate-300">{quiz ? `${quiz.score}/${quiz.out}` : "—"}</td>
                  <td className="py-3">{pct === null ? <span className="text-[11px] text-slate-600">no data</span> : <Badge tone={pct >= 85 ? "green" : pct >= 70 ? "cyan" : pct >= 60 ? "amber" : "red"}>{pct}%</Badge>}</td>
                  <td className="py-3 text-right text-[11px]">{pct !== null && <span className={pct >= 70 ? "text-emerald-400" : "text-rose-400"}>{pct >= 70 ? "▲ improving" : "▼ at risk"}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Analytics ──────────────────────────────────────────────
function AnalyticsView() {
  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle icon={<BarChart3 size={15} />} title="Score distribution — Grade 10-A" sub="All graded assessments this term" />
          <div className="space-y-3 mt-2">
            {GRADE_DIST.map((g) => <HBar key={g.band} label={g.band} pct={g.pct} color={g.color} right={`${g.pct}%`} />)}
          </div>
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Engagement — % active learners per day</p>
            <HeatRow values={[0.82, 0.9, 0.76, 0.88, 0.94, 0.41, 0.3]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} color="#a78bfa" />
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle icon={<TrendingUp size={15} />} title="Topic mastery" sub="Class-wide, auto-audited" />
          <div className="space-y-3">{MASTERY_TOPICS.map((t) => <HBar key={t.topic} label={t.topic} pct={t.pct} color={t.pct >= 75 ? "#34d399" : t.pct >= 55 ? "#fbbf24" : "#fb7185"} />)}</div>
        </Card>
      </div>
      <AIReportPanel who="teacher" />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────
const TITLES: Record<string, [string, string]> = {
  overview: ["Teaching Dashboard", "Your day, approvals and quick actions"],
  attendance: ["Attendance Desk", "Approve self check-ins & quick-mark"],
  courses: ["Course Studio", "Authoring & publishing"],
  diary: ["Class Diary", "Daily teaching log shared with parents"],
  grading: ["Grading Desk", "Review, score and give feedback"],
  grades: ["Grade Book", "Class performance matrix"],
  analytics: ["Student Analytics", "Mastery, distribution & early warnings"],
  ai: ["AI Quiz Generator", "Draft export-ready quizzes in seconds"],
  messages: ["Communication Hub", "Parents, students & department"],
  calendar: ["Calendar", "School events & your schedule"],
};

export default function InstructorApp() {
  const [tab, setTab] = useState("overview");
  const app = useApp();
  const t = todayISO();
  const pendingAtt = app.attendance.filter((a) => a.date === t && CLASS_STUDENTS.includes(a.studentId) && a.status === "pending").length;
  const ungraded = app.submissions.filter((s) => s.status === "submitted").length;
  const nav: NavItem[] = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { id: "attendance", label: "Attendance Desk", icon: <CalendarCheck2 size={16} />, badge: pendingAtt || undefined },
    { id: "courses", label: "Course Studio", icon: <Presentation size={16} /> },
    { id: "diary", label: "Class Diary", icon: <NotebookPen size={16} /> },
    { id: "grading", label: "Grading Desk", icon: <ClipboardCheck size={16} />, badge: ungraded || undefined },
    { id: "grades", label: "Grade Book", icon: <BookOpenCheck size={16} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
    { id: "ai", label: "AI Quiz Generator", icon: <Sparkles size={16} /> },
    { id: "messages", label: "Messages", icon: <MessageSquareText size={16} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
  ];
  const [title, sub] = TITLES[tab];
  return (
    <DashboardShell role="instructor" nav={nav} active={tab} onNav={setTab} title={title} subtitle={sub}>
      {tab === "overview" && <Overview go={setTab} />}
      {tab === "attendance" && <AttendanceDesk />}
      {tab === "courses" && <CourseStudio />}
      {tab === "diary" && <ClassDiary />}
      {tab === "grading" && <GradingDesk />}
      {tab === "grades" && <GradeMatrix />}
      {tab === "analytics" && <AnalyticsView />}
      {tab === "ai" && <QuizGenerator role="instructor" />}
      {tab === "messages" && <ThreadChat role="instructor" accent="#a78bfa" />}
      {tab === "calendar" && <CalendarMonth events={app.events} accent="#a78bfa" title="Northwood High + district events" />}
    </DashboardShell>
  );
}

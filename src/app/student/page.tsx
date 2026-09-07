"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpenCheck, NotebookPen, CalendarCheck2, FileText, Award,
  BarChart3, Sparkles, CalendarDays, Users, Flame, CheckCircle2, Clock3, Plus,
  ArrowRight, Zap, Target, Bus, BrainCircuit, Star,
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/shell";
import { useApp, courseProgress } from "@/lib/store";
import { fmtDate, iso, pad, rel, STUDENTS, todayISO } from "@/lib/data";
import { Badge, Btn, Card, Progress, SectionTitle, Stat, Input } from "@/components/ui";
import { Donut, Sparkline } from "@/components/charts";
import { ATT_STYLE, CalendarMonth, DiaryCard, DiaryComposer, JourneyTimeline } from "@/components/widgets";
import { AssignmentsView, AISuiteView, CertificatesView, CommunityView, CoursesView, GradesView } from "./lms";

const ME = "stu1";

function useToday() {
  const { attendance, journeys } = useApp();
  const t = todayISO();
  const att = attendance.find((a) => a.studentId === ME && a.date === t);
  const journey = journeys.find((j) => j.studentId === ME && j.date === t);
  return { att, journey, t };
}

// ─── Overview ───────────────────────────────────────────────
function Overview({ go }: { go: (t: string) => void }) {
  const app = useApp();
  const { att, journey } = useToday();
  const me = STUDENTS.find((s) => s.id === ME)!;
  const tasks = app.tasks.filter((x) => x.studentId === ME);
  const doneTasks = tasks.filter((x) => x.done).length;
  const enrolled = app.courses.filter((c) => c.enrolled.includes(ME) || app.enrolledExtra.includes(c.id));
  const continueCourse = enrolled.find((c) => courseProgress(c, app.completedLessons).pct < 100) ?? enrolled[0];
  const contProg = continueCourse ? courseProgress(continueCourse, app.completedLessons) : null;
  const myAtt = app.attendance.filter((a) => a.studentId === ME);
  const present = myAtt.filter((a) => ["approved", "late", "pending"].includes(a.status)).length;
  const attPct = myAtt.length ? Math.round((present / myAtt.length) * 100) : 100;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">
      {/* hero strip */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute -top-28 -right-16 w-80 h-80 rounded-full blur-3xl opacity-20 bg-cyan-400" />
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10 bg-violet-500" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="cyan" dot>Term 2 · Week 9</Badge>
              <Badge tone="amber"><Flame size={11} className="mr-1" /> {me.streak}-day study streak</Badge>
            </div>
            <h2 className="font-display font-bold text-white text-2xl md:text-3xl mt-3">{greet}, Aarav</h2>
            <p className="text-[13px] text-slate-400 mt-1.5">You have <span className="text-white font-medium">{tasks.length - doneTasks} tasks</span> left today and your next lesson is queued up.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Donut value={attPct} size={92} color="#22d3ee" label={`${attPct}%`} sub="attendance" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 text-amber-300 mb-1.5"><Zap size={14} /><span className="font-display font-bold text-lg">{me.xp.toLocaleString()} XP</span></div>
              <p className="text-[10px] text-slate-500 mb-1">Level 8 Scholar · 180 XP to Level 9</p>
              <Progress value={88} color="#fbbf24" height={6} className="w-40" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="GPA standing" value={3.7} decimals={1} suffix=" / 4" icon={<Star size={17} />} accent="#fbbf24" delta="+0.2" />
        <Stat label="Active courses" value={enrolled.length} icon={<BookOpenCheck size={17} />} accent="#818cf8" />
        <Stat label="Lessons completed" value={app.completedLessons.length} icon={<CheckCircle2 size={17} />} accent="#34d399" delta="+4 wk" />
        <Stat label="Avg quiz score" value={88} suffix="%" icon={<Target size={17} />} accent="#22d3ee" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* today attendance + journey */}
        <Card className="p-5">
          <SectionTitle icon={<CalendarCheck2 size={15} />} title="Today — check-in" sub={fmtDate(todayISO())} />
          <div className={`rounded-xl p-4 border ${att?.status === "approved" ? "bg-emerald-500/8 border-emerald-400/25" : att?.status === "pending" ? "bg-amber-500/8 border-amber-400/25" : "bg-white/[0.03] border-white/10"}`}>
            <div className="flex items-center justify-between">
              <Badge tone={ATT_STYLE[att?.status ?? "unmarked"].tone as any} dot>{ATT_STYLE[att?.status ?? "unmarked"].label}</Badge>
              {att?.markedAt && <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock3 size={10} /> {att.markedAt}</span>}
            </div>
            {(!att || att.status === "unmarked") && (
              <>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">Arrived at school? Mark yourself present — Ms. Chen approves it instantly in class.</p>
                <Btn className="w-full mt-3.5" icon={<CheckCircle2 size={15} />} onClick={() => app.selfMarkAttendance(ME)}>Mark my attendance</Btn>
              </>
            )}
            {att?.status === "pending" && <p className="text-xs text-amber-200/80 mt-3">Waiting for Ms. Chen's approval — you're in her queue.</p>}
            {att?.status === "approved" && <p className="text-xs text-emerald-200/80 mt-3 flex items-center gap-1.5"><CheckCircle2 size={13} /> Approved by {att.approvedBy}. Have a great day!</p>}
          </div>
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Commute status</p>
            <JourneyTimeline leftHomeAt={journey?.leftHomeAt} arrivedAt={journey?.arrivedAt ?? (att?.status === "approved" ? att.markedAt : undefined)} />
          </div>
        </Card>

        {/* today's tasks */}
        <Card className="p-5">
          <SectionTitle icon={<Target size={15} />} title="Today's tasks" sub={`${doneTasks} of ${tasks.length} complete`}
            right={<Badge tone="violet">AI-planned</Badge>} />
          <div className="space-y-2">
            {tasks.map((t, i) => (
              <motion.button key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => app.toggleTask(t.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${t.done ? "border-emerald-400/20 bg-emerald-500/6" : "border-white/8 bg-white/[0.02] hover:border-white/20"}`}>
                <span className={`w-5 h-5 rounded-md grid place-items-center border shrink-0 transition-all ${t.done ? "bg-emerald-400 border-emerald-400 text-[#06090f]" : "border-slate-600"}`}>
                  {t.done && <CheckCircle2 size={13} />}
                </span>
                <span className={`flex-1 text-[12.5px] leading-snug ${t.done ? "text-slate-500 line-through" : "text-slate-200"}`}>{t.label}</span>
                <Badge tone={t.source === "ai" ? "violet" : t.source === "teacher" ? "cyan" : "slate"}>{t.source}</Badge>
              </motion.button>
            ))}
          </div>
          <QuickAddTask />
        </Card>

        {/* continue learning */}
        <Card className="p-5 flex flex-col">
          <SectionTitle icon={<BookOpenCheck size={15} />} title="Continue learning" sub="Featured course" />
          {continueCourse && contProg && (
            <div className="flex-1 flex flex-col">
              <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: `linear-gradient(140deg, ${continueCourse.color}14, transparent)` }}>
                <Badge tone="violet">{continueCourse.subject}</Badge>
                <p className="font-display font-semibold text-white mt-2.5 leading-snug">{continueCourse.title}</p>
                <div className="flex items-center gap-3 mt-4">
                  <Progress value={contProg.pct} color={continueCourse.color} height={7} className="flex-1" />
                  <span className="text-xs font-semibold text-white">{contProg.pct}%</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">{contProg.total - contProg.done} lessons left · capstone unlocks at 100%</p>
              </div>
              <Btn className="w-full mt-4" icon={<ArrowRight size={14} />} onClick={() => go("courses")}>Resume course</Btn>
              <div className="mt-4 glass-soft rounded-xl p-3.5 flex items-center gap-3">
                <BrainCircuit size={18} className="text-violet-300 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-relaxed"><span className="text-violet-300 font-medium">AI nudge:</span> 20 minutes on logarithms today keeps your mastery path on schedule.</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* upcoming + diary teaser */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle icon={<CalendarDays size={15} />} title="Coming up" sub="Holidays, exams & events"
            right={<Btn size="sm" variant="ghost" onClick={() => go("calendar")}>Full calendar</Btn>} />
          <div className="space-y-2.5">
            {app.events.filter((e) => e.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4).map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3.5 glass-soft rounded-xl p-3">
                <span className="w-10 h-10 rounded-lg grid place-items-center font-display font-bold text-sm shrink-0"
                  style={{ background: e.type === "holiday" ? "rgba(244,63,94,.12)" : "rgba(99,102,241,.12)", color: e.type === "holiday" ? "#fb7185" : "#a5b4fc" }}>
                  {e.date.slice(8)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{e.title}</p>
                  <p className="text-[10px] text-slate-500">{fmtDate(e.date)}</p>
                </div>
                <Badge tone={e.type === "holiday" ? "red" : e.type === "exam" ? "amber" : "cyan"}>{e.type}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle icon={<NotebookPen size={15} />} title="Latest diary page" sub="Your daily record"
            right={<Btn size="sm" variant="ghost" onClick={() => go("diary")}>Open diary</Btn>} />
          {app.diary.filter((d) => d.ownerId === ME).slice(0, 1).map((d) => (
            <div key={d.id} className="rounded-xl bg-white/[0.03] border border-white/8 p-4">
              <p className="text-sm font-semibold text-white">{d.title}</p>
              <p className="text-[11px] text-slate-500 mb-2.5">{fmtDate(d.date)}</p>
              <p className="text-[13px] text-slate-300 leading-relaxed">{d.body}</p>
              {d.remark && <p className="text-[11px] text-indigo-300/90 mt-3 border-l-2 border-indigo-400/40 pl-3">{d.remark}</p>}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function QuickAddTask() {
  const app = useApp();
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2 mt-3">
      <Input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && v.trim()) { app.addTask(v.trim()); setV(""); } }} placeholder="Add a task…" className="text-xs" />
      <Btn size="sm" variant="ghost" disabled={!v.trim()} onClick={() => { app.addTask(v.trim()); setV(""); }}><Plus size={14} /></Btn>
    </div>
  );
}

// ─── Attendance tab ─────────────────────────────────────────
function AttendanceView() {
  const app = useApp();
  const { att } = useToday();
  const my = app.attendance.filter((a) => a.studentId === ME).sort((a, b) => b.date.localeCompare(a.date));
  const present = my.filter((a) => ["approved", "late"].includes(a.status)).length;
  const pending = my.filter((a) => a.status === "pending").length;
  const absent = my.filter((a) => a.status === "absent").length;
  // build last 5 weeks grid
  const weeks = useMemo(() => {
    const rows: { date: string; status?: string }[][] = [];
    const today = new Date();
    const dow = (today.getDay() + 6) % 7;
    const start = new Date(today); start.setDate(start.getDate() - dow - 7 * 4);
    for (let w = 0; w < 5; w++) {
      const row: { date: string; status?: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const cur = new Date(start); cur.setDate(cur.getDate() + w * 7 + d);
        const key = iso(cur);
        if (key > todayISO()) { row.push({ date: key }); continue; }
        const rec = my.find((a) => a.date === key);
        row.push({ date: key, status: cur.getDay() === 0 || cur.getDay() === 6 ? "weekend" : rec?.status ?? "none" });
      }
      rows.push(row);
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.attendance]);
  const cellColor: Record<string, string> = { approved: "#34d399", pending: "#fbbf24", late: "#f59e0b", absent: "#fb7185", excused: "#60a5fa", weekend: "rgba(148,163,184,.08)", none: "rgba(148,163,184,.14)", unmarked: "rgba(148,163,184,.2)" };
  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-6 text-center relative overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl opacity-15 bg-cyan-400" />
          <p className="font-display font-semibold text-white">Today's check-in</p>
          <p className="text-[11px] text-slate-500 mt-1">{fmtDate(todayISO(), { weekday: "long", month: "long", day: "numeric" })}</p>
          <div className="my-6 flex justify-center">
            {(!att || att.status === "unmarked") ? (
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} onClick={() => app.selfMarkAttendance(ME)}
                className="w-36 h-36 rounded-full relative grid place-items-center text-white font-display font-bold text-sm"
                style={{ background: "linear-gradient(140deg, rgba(34,211,238,.25), rgba(99,102,241,.25))", border: "2px solid rgba(34,211,238,.5)", boxShadow: "0 0 50px rgba(34,211,238,.2)" }}>
                <motion.span animate={{ scale: [1, 1.35], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full border-2 border-cyan-400/50" />
                <span>MARK<br />PRESENT</span>
              </motion.button>
            ) : att.status === "pending" ? (
              <div className="w-36 h-36 rounded-full grid place-items-center relative" style={{ border: "2px solid rgba(251,191,36,.5)", background: "rgba(251,191,36,.08)" }}>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border border-dashed border-amber-400/50" />
                <div><Clock3 size={22} className="text-amber-300 mx-auto mb-1.5" /><p className="text-[11px] font-semibold text-amber-200">Awaiting<br />approval</p></div>
              </div>
            ) : (
              <div className="w-36 h-36 rounded-full grid place-items-center" style={{ border: "2px solid rgba(52,211,153,.55)", background: "rgba(52,211,153,.09)", boxShadow: "0 0 50px rgba(52,211,153,.15)" }}>
                <div><CheckCircle2 size={24} className="text-emerald-300 mx-auto mb-1.5" /><p className="text-[11px] font-semibold text-emerald-200">Approved<br />{att.markedAt}</p></div>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            {(!att || att.status === "unmarked") && "Tap when you reach campus — your teacher approves it during registration and your parents get the arrival alert."}
            {att?.status === "pending" && "Nice — you're in the queue. Ms. Chen approves check-ins at 8:00 registration."}
            {att?.status === "approved" && `Confirmed by ${att.approvedBy}. Your parents were notified of your safe arrival.`}
          </p>
        </Card>
        <Card className="p-6">
          <p className="font-display font-semibold text-white text-sm">This term</p>
          <div className="flex justify-center my-5"><Donut value={my.length ? (present / my.length) * 100 : 100} size={130} color="#22d3ee" label={`${my.length ? Math.round((present / my.length) * 100) : 100}%`} sub="presence" /></div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Present", present, "#34d399"], ["Pending", pending, "#fbbf24"], ["Absent", absent, "#fb7185"]].map(([l, v, c]) => (
              <div key={l as string} className="glass-soft rounded-xl py-2.5">
                <p className="font-display font-bold text-lg" style={{ color: c as string }}>{v as number}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">{l as string}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <p className="font-display font-semibold text-white text-sm mb-1">Last 5 weeks</p>
          <p className="text-[10px] text-slate-500 mb-4">Every school day, color-coded</p>
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-center text-[9px] text-slate-600 font-semibold">{d}</span>)}
          </div>
          <div className="space-y-1.5">
            {weeks.map((w, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1.5">
                {w.map((c, di) => (
                  <motion.div key={c.date} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (wi * 7 + di) * 0.012 }}
                    title={`${fmtDate(c.date)} — ${c.status ?? "upcoming"}`}
                    className="aspect-square rounded-md grid place-items-center text-[8px] font-semibold"
                    style={{ background: cellColor[c.status ?? "none"], color: ["approved", "pending", "late", "absent"].includes(c.status ?? "") ? "#06090f" : "transparent" }}>
                    {Number(c.date.slice(8))}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4">
            {[["Present", "#34d399"], ["Pending", "#fbbf24"], ["Late", "#f59e0b"], ["Absent", "#fb7185"], ["Excused", "#60a5fa"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1 text-[9px] text-slate-500"><span className="w-2 h-2 rounded-sm" style={{ background: c }} />{l}</span>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <SectionTitle icon={<CalendarCheck2 size={15} />} title="History & approvals" sub="Who confirmed each day" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/8">
              <th className="pb-2.5 font-semibold">Date</th><th className="pb-2.5 font-semibold">Marked at</th><th className="pb-2.5 font-semibold">Status</th><th className="pb-2.5 font-semibold">Approved by</th>
            </tr></thead>
            <tbody>
              {my.slice(0, 8).map((a) => (
                <tr key={a.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                  <td className="py-3 text-slate-300 text-[13px]">{fmtDate(a.date)}</td>
                  <td className="py-3 text-slate-500 text-[12px]">{a.markedAt ?? "—"}</td>
                  <td className="py-3"><Badge tone={ATT_STYLE[a.status].tone as any} dot>{ATT_STYLE[a.status].label}</Badge></td>
                  <td className="py-3 text-slate-400 text-[12px]">{a.approvedBy ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Diary tab ──────────────────────────────────────────────
function DiaryView() {
  const app = useApp();
  const entries = app.diary.filter((d) => d.ownerId === ME);
  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      <div>
        <SectionTitle icon={<NotebookPen size={16} />} title="My Learning Diary" sub="A daily record of work, learnings and moments — teachers can leave remarks"
          right={<DiaryComposer onSave={(title, body, mood, tags) => app.addDiary({ ownerId: ME, ownerRole: "student", date: todayISO(), title, body, mood, tags })} />} />
        <div className="space-y-4">
          {entries.map((e, i) => <DiaryCard key={e.id} e={e} i={i} />)}
        </div>
      </div>
      <div className="space-y-5">
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-1">Streak</p>
          <p className="text-[11px] text-slate-500 mb-4">Days journaled in a row</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl grid place-items-center bg-amber-400/12 border border-amber-400/30">
              <Flame size={26} className="text-amber-300" />
            </div>
            <div>
              <p className="font-display font-bold text-3xl text-white">12</p>
              <p className="text-[10px] text-slate-500">personal best: 21 days</p>
            </div>
          </div>
          <div className="flex gap-1.5 mt-4">
            {[1, 1, 1, 1, 1, 0, 1].map((v, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 }} className="flex-1 h-2 rounded-full" style={{ background: v ? "#fbbf24" : "rgba(148,163,184,.15)" }} />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-3">Writing prompts</p>
          {["What challenged you today and how did you respond?", "One idea you could teach a classmate right now.", "A moment today worth remembering in 5 years."].map((p, i) => (
            <div key={p} className="glass-soft rounded-xl p-3 text-[11px] text-slate-400 mb-2 leading-relaxed flex gap-2">
              <Sparkles size={12} className="text-violet-300 shrink-0 mt-0.5" /> {p}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────
const TITLES: Record<string, [string, string]> = {
  overview: ["Dashboard", "Your learning day at a glance"],
  courses: ["Courses & Lessons", "Interactive learning consumption"],
  diary: ["My Diary", "Daily records, tasks and teacher remarks"],
  attendance: ["Attendance", "Self check-in, approvals & history"],
  assignments: ["Assignments", "Submissions, grades and feedback"],
  grades: ["Grade Book", "Marks, trends and standing"],
  ai: ["AI Learning Suite", "Quizzes, reports, syllabus & test plans"],
  calendar: ["School Calendar", "Holidays, exams and events"],
  certificates: ["Certificates", "Verified, sealed credentials"],
  community: ["Community", "Messages and study groups"],
};

export default function StudentApp() {
  const [tab, setTab] = useState("overview");
  const { attendance, tasks } = useApp();
  const t = todayISO();
  const attBadge = attendance.find((a) => a.studentId === ME && a.date === t)?.status === "unmarked" ? 1 : undefined;
  const nav: NavItem[] = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { id: "courses", label: "Courses", icon: <BookOpenCheck size={16} /> },
    { id: "diary", label: "My Diary", icon: <NotebookPen size={16} /> },
    { id: "attendance", label: "Attendance", icon: <CalendarCheck2 size={16} />, badge: attBadge },
    { id: "assignments", label: "Assignments", icon: <FileText size={16} /> },
    { id: "grades", label: "Grade Book", icon: <BarChart3 size={16} /> },
    { id: "ai", label: "AI Suite", icon: <Sparkles size={16} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
    { id: "certificates", label: "Certificates", icon: <Award size={16} /> },
    { id: "community", label: "Community", icon: <Users size={16} /> },
  ];
  const [title, sub] = TITLES[tab];
  return (
    <DashboardShell role="student" nav={nav} active={tab} onNav={setTab} title={title} subtitle={sub}>
      {tab === "overview" && <Overview go={setTab} />}
      {tab === "courses" && <CoursesView />}
      {tab === "diary" && <DiaryView />}
      {tab === "attendance" && <AttendanceView />}
      {tab === "assignments" && <AssignmentsView />}
      {tab === "grades" && <GradesView />}
      {tab === "ai" && <AISuiteView />}
      {tab === "calendar" && <Calendar />}
      {tab === "certificates" && <CertificatesView />}
      {tab === "community" && <CommunityView />}
    </DashboardShell>
  );
}

function Calendar() {
  const { events } = useApp();
  return <CalendarMonth events={events} accent="#22d3ee" title="Northwood High + district events" />;
}

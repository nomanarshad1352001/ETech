"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bus, Wallet, MessageSquareText, CalendarDays, FileText, ArrowLeft,
  BellRing, CheckCircle2, Clock3, CreditCard, NotebookPen, BarChart3, CalendarCheck2,
  Sparkles, ShieldCheck, ArrowRight, Receipt, Download, AlertCircle, School, Star,
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/shell";
import { useApp } from "@/lib/store";
import { fmtDate, money, SCHOOLS, STUDENTS, Student, todayISO } from "@/lib/data";
import { Avatar, Badge, Btn, Card, Progress, SectionTitle, Stat } from "@/components/ui";
import { Donut } from "@/components/charts";
import { ATT_STYLE, CalendarMonth, DiaryCard, JourneyTimeline } from "@/components/widgets";
import { AIReportPanel } from "@/components/ai";
import { ThreadChat } from "@/components/chat";

const KIDS = ["stu1", "stu2", "stu3", "stu4"];

function useKidData(sid: string) {
  const app = useApp();
  const t = todayISO();
  const s = STUDENTS.find((x) => x.id === sid)!;
  const att = app.attendance.find((a) => a.studentId === sid && a.date === t);
  const journey = app.journeys.find((j) => j.studentId === sid && j.date === t);
  const history = app.attendance.filter((a) => a.studentId === sid);
  const present = history.filter((a) => ["approved", "late", "pending"].includes(a.status)).length;
  const attPct = history.length ? Math.round((present / history.length) * 100) : 100;
  const invoices = app.invoices.filter((i) => i.studentId === sid);
  const due = invoices.filter((i) => i.status !== "paid").reduce((a, i) => a + i.amount, 0);
  const diary = app.diary.filter((d) => d.ownerId === sid);
  const school = SCHOOLS.find((sc) => sc.id === s.schoolId)!;
  return { app, s, att, journey, history, attPct, invoices, due, diary, school, t };
}

// ─── Children board ─────────────────────────────────────────
function ChildrenBoard({ open, go }: { open: (sid: string) => void; go: (t: string) => void }) {
  const app = useApp();
  const totalDue = app.invoices.filter((i) => KIDS.includes(i.studentId) && i.status !== "paid").reduce((a, i) => a + i.amount, 0);
  const atSchool = KIDS.filter((k) => app.journeys.find((j) => j.studentId === k && j.date === todayISO())?.arrivedAt).length;
  return (
    <div className="space-y-5">
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 bg-amber-400" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <Badge tone="amber" dot>Family command board</Badge>
            <h2 className="font-display font-bold text-white text-2xl md:text-3xl mt-3">The Rahman family</h2>
            <p className="text-[13px] text-slate-400 mt-1.5">All four children on one board — <span className="text-emerald-300 font-medium">{atSchool} at school</span> · <span className="text-amber-300 font-medium">{money(totalDue)} fees open</span></p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Btn icon={<Bus size={15} />} onClick={() => go("journey")}>Commute controls</Btn>
            <Btn variant="ghost" icon={<Wallet size={15} />} onClick={() => go("fees")}>Pay fees</Btn>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {KIDS.map((sid, i) => <KidCard key={sid} sid={sid} i={i} onOpen={() => open(sid)} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle icon={<BellRing size={15} />} title="Today — live family feed" sub="Commute & attendance events in real time" />
          <div className="space-y-2.5">
            {KIDS.map((sid) => <KidFeedRow key={sid} sid={sid} />).flat()}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle icon={<CalendarDays size={15} />} title="Next on the family calendar" sub="Across both schools" />
          <div className="space-y-2.5">
            {app.events.filter((e) => e.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 glass-soft rounded-xl p-3">
                <span className="w-9 h-9 rounded-lg grid place-items-center font-display font-bold text-[13px] shrink-0"
                  style={{ background: e.type === "holiday" ? "rgba(244,63,94,.12)" : "rgba(251,191,36,.1)", color: e.type === "holiday" ? "#fb7185" : "#fcd34d" }}>{e.date.slice(8)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{e.title}</p>
                  <p className="text-[10px] text-slate-500">{fmtDate(e.date)} · {e.schoolId === "all" ? "All schools" : SCHOOLS.find((s) => s.id === e.schoolId)?.short}</p>
                </div>
                <Badge tone={e.type === "holiday" ? "red" : e.type === "exam" ? "amber" : "cyan"}>{e.type}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function KidFeedRow({ sid }: { sid: string }) {
  const { s, att, journey } = useKidData(sid);
  const rows: React.ReactNode[] = [];
  if (journey?.leftHomeAt) rows.push(
    <div key={`jh-${sid}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-400/6 border border-amber-400/15">
      <Bus size={14} className="text-amber-300 shrink-0" />
      <p className="text-xs text-slate-300 flex-1"><span className="text-white font-medium">{s.name.split(" ")[0]}</span> left home at {journey.leftHomeAt}</p>
      {journey.arrivedAt ? <Badge tone="green">arrived {journey.arrivedAt}</Badge> : <Badge tone="amber" dot>en route</Badge>}
    </div>);
  if (att && att.status !== "unmarked") rows.push(
    <div key={`at-${sid}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/8">
      <CalendarCheck2 size={14} className="text-cyan-300 shrink-0" />
      <p className="text-xs text-slate-300 flex-1"><span className="text-white font-medium">{s.name.split(" ")[0]}</span>'s attendance {ATT_STYLE[att.status].label.toLowerCase()}</p>
      <Badge tone={ATT_STYLE[att.status].tone as any}>{att.status}</Badge>
    </div>);
  if (!rows.length) rows.push(
    <div key={`wt-${sid}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/6">
      <Clock3 size={14} className="text-slate-500 shrink-0" />
      <p className="text-xs text-slate-400 flex-1"><span className="text-slate-300 font-medium">{s.name.split(" ")[0]}</span> — waiting for the day to begin</p>
    </div>);
  return rows;
}

function KidCard({ sid, i, onOpen }: { sid: string; i: number; onOpen: () => void }) {
  const { s, att, journey, attPct, due, school } = useKidData(sid);
  return (
    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <Card hover className="p-5 relative overflow-hidden h-full" onClick={onOpen}>
        <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${s.tone}`} />
        <div className="flex items-start justify-between">
          <Avatar name={s.name} id={s.id} size={52} ring />
          <Badge tone={ATT_STYLE[att?.status ?? "unmarked"].tone as any} dot={att?.status === "pending"}>{ATT_STYLE[att?.status ?? "unmarked"].label}</Badge>
        </div>
        <h3 className="font-display font-bold text-white text-lg mt-3.5">{s.name}</h3>
        <p className="text-[11px] text-slate-500">{s.grade} · Section {s.section} · {school.short}</p>
        <div className="flex items-center gap-4 mt-4">
          <Donut value={attPct} size={58} stroke={7} color="#fbbf24" label={`${attPct}%`} />
          <div className="space-y-1 text-[10px] text-slate-400">
            <p className="flex items-center gap-1.5"><Star size={10} className="text-amber-300" /> GPA {s.gpa.toFixed(1)}</p>
            <p className="flex items-center gap-1.5"><Wallet size={10} className={due > 0 ? "text-rose-300" : "text-emerald-300"} /> {due > 0 ? `${money(due)} due` : "fees clear"}</p>
          </div>
        </div>
        <div className="mt-4 pt-3.5 border-t border-white/6">
          <JourneyTimeline leftHomeAt={journey?.leftHomeAt} arrivedAt={journey?.arrivedAt} compact />
          <p className="text-[10px] text-indigo-300 font-medium mt-3.5 flex items-center gap-1">Open full child board <ArrowRight size={10} /></p>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Child detail (opens separately) ────────────────────────
function ChildDetail({ sid, onBack, go }: { sid: string; onBack: () => void; go: (t: string) => void }) {
  const { app, s, att, journey, attPct, invoices, due, diary, school, history } = useKidData(sid);
  const [tab, setTab] = useState<"overview" | "diary" | "grades" | "fees">("overview");
  const childGrades = app.grades.filter((g) => g.studentId === sid);
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"><ArrowLeft size={13} /> All children</button>
      <Card className="p-6 relative overflow-hidden">
        <div className={`absolute -top-24 -right-16 w-80 h-80 rounded-full blur-3xl opacity-25 bg-gradient-to-br ${s.tone}`} />
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar name={s.name} id={s.id} size={64} ring />
          <div className="flex-1 min-w-[200px]">
            <h2 className="font-display font-bold text-white text-2xl">{s.name}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1"><School size={11} /> {school.name}</span> · {s.grade} · Section {s.section} · streak {s.streak} days
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Donut value={attPct} size={76} color="#fbbf24" label={`${attPct}%`} sub="attendance" />
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Open balance</p>
              <p className={`font-display font-bold text-xl ${due > 0 ? "text-rose-300" : "text-emerald-300"}`}>{due > 0 ? money(due) : "Clear"}</p>
            </div>
          </div>
        </div>
        <div className="relative flex gap-2 mt-6 flex-wrap">
          {(["overview", "diary", "grades", "fees"] as const).map((tb) => (
            <button key={tb} onClick={() => setTab(tb)} className={`relative px-4 py-2 rounded-xl text-xs font-medium transition ${tab === tb ? "text-white" : "text-slate-400 glass-soft hover:text-white"}`}>
              {tab === tb && <motion.span layoutId={`kid-${sid}`} className="absolute inset-0 rounded-xl bg-amber-400/15 border border-amber-400/40" />}
              <span className="relative z-10 capitalize">{tb === "grades" ? "Grade book" : tb}</span>
            </button>
          ))}
        </div>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-5">
              <Card className="p-5">
                <SectionTitle icon={<Bus size={15} />} title="Today's journey" sub={fmtDate(todayISO())} />
                <JourneyTimeline leftHomeAt={journey?.leftHomeAt} arrivedAt={journey?.arrivedAt} />
                <div className={`mt-4 rounded-xl p-3.5 border text-xs leading-relaxed ${att?.status === "approved" ? "bg-emerald-500/8 border-emerald-400/25 text-emerald-200/90" : att?.status === "pending" ? "bg-amber-500/8 border-amber-400/25 text-amber-200/90" : "bg-white/[0.03] border-white/10 text-slate-400"}`}>
                  {att?.status === "approved" ? `Attendance approved by ${att.approvedBy} at ${att.markedAt}.` :
                   att?.status === "pending" ? `${s.name.split(" ")[0]} self-marked attendance — awaiting teacher approval.` :
                   "No attendance record yet today."}
                </div>
              </Card>
              <Card className="p-5">
                <SectionTitle icon={<CalendarCheck2 size={15} />} title="Recent attendance" />
                <div className="space-y-2">
                  {history.slice(0, 5).sort((a, b) => b.date.localeCompare(a.date)).map((a) => (
                    <div key={a.id} className="flex items-center justify-between glass-soft rounded-lg px-3 py-2.5">
                      <span className="text-[12px] text-slate-300">{fmtDate(a.date)}</span>
                      <Badge tone={ATT_STYLE[a.status].tone as any}>{ATT_STYLE[a.status].label}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <SectionTitle icon={<Sparkles size={15} />} title="This week in class" sub="From the teacher's class diary" />
                {app.diary.filter((d) => d.ownerRole === "teacher").slice(0, 2).map((d) => (
                  <div key={d.id} className="glass-soft rounded-xl p-3.5 mb-2.5">
                    <p className="text-[12px] font-semibold text-white">{d.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-3">{d.body}</p>
                  </div>
                ))}
                <Btn size="sm" variant="ghost" className="w-full mt-2" onClick={() => go("reports")}>View AI progress report</Btn>
              </Card>
            </div>
          )}
          {tab === "diary" && (
            <div>
              <SectionTitle icon={<NotebookPen size={15} />} title={`${s.name.split(" ")[0]}'s diary`} sub="Read-only for parents · teacher remarks highlighted" />
              {diary.length ? (
                <div className="grid md:grid-cols-2 gap-4">{diary.map((e, i) => <DiaryCard key={e.id} e={e} i={i} />)}</div>
              ) : (
                <Card className="p-10 text-center">
                  <NotebookPen size={26} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400">{s.name.split(" ")[0]} hasn't written diary entries yet this term.</p>
                  <p className="text-[11px] text-slate-600 mt-1.5">The school nudges a diary reflection every afternoon at 3:30 PM.</p>
                </Card>
              )}
            </div>
          )}
          {tab === "grades" && (
            <div className="grid lg:grid-cols-2 gap-4">
              {childGrades.length ? childGrades.map((g, i) => (
                <Card key={g.courseId} className="p-5">
                  <div className="flex items-center justify-between mb-3.5">
                    <p className="text-sm font-semibold text-white">{app.courses.find((c) => c.id === g.courseId)?.title ?? g.courseId}</p>
                    <Badge tone="green">{Math.round((g.items.reduce((a, x) => a + x.score, 0) / g.items.reduce((a, x) => a + x.out, 0)) * 100)}%</Badge>
                  </div>
                  <div className="space-y-2.5">
                    {g.items.map((it) => (
                      <div key={it.name} className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 w-40 truncate shrink-0">{it.name}</span>
                        <Progress value={(it.score / it.out) * 100} color="#fbbf24" height={6} className="flex-1" />
                        <span className="text-[11px] text-slate-300 w-14 text-right shrink-0">{it.score}/{it.out}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )) : (
                <Card className="p-10 text-center lg:col-span-2">
                  <BarChart3 size={26} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400">Grade book entries publish at the end of each grading window for {s.grade}.</p>
                  <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    {["Reading A−", "Math A", "Science A", "Art A+"].map((x) => <Badge key={x} tone="amber">{x}</Badge>)}
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2">Latest classroom marks snapshot</p>
                </Card>
              )}
            </div>
          )}
          {tab === "fees" && (
            <Card className="p-5">
              <SectionTitle icon={<Wallet size={15} />} title={`Invoices — ${s.name.split(" ")[0]}`} sub="Pay individually or across all children in the Fees tab" />
              <div className="space-y-2.5">
                {invoices.map((inv) => <InvoiceRow key={inv.id} inv={inv} />)}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Invoice row + payment flow ─────────────────────────────
function InvoiceRow({ inv }: { inv: any }) {
  const app = useApp();
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const kid = STUDENTS.find((s) => s.id === inv.studentId)!;
  const pay = () => {
    setPaying(true);
    setTimeout(() => { app.payInvoice(inv.id); setDone(true); setTimeout(() => { setPaying(false); setDone(false); }, 1400); }, 1200);
  };
  return (
    <motion.div layout className="flex flex-wrap items-center gap-4 glass-soft rounded-xl p-4">
      <span className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${inv.status === "paid" ? "bg-emerald-400/12 text-emerald-300" : inv.status === "overdue" ? "bg-rose-400/12 text-rose-300" : "bg-amber-400/12 text-amber-300"}`}>
        <Receipt size={16} />
      </span>
      <div className="flex-1 min-w-[180px]">
        <p className="text-[13px] font-semibold text-white">{inv.title}</p>
        <p className="text-[10px] text-slate-500">{kid.name} · due {fmtDate(inv.due)}{inv.paidOn ? ` · paid ${fmtDate(inv.paidOn)}` : ""}</p>
      </div>
      <span className="font-display font-bold text-white">{money(inv.amount)}</span>
      {inv.status === "paid" ? (
        <Badge tone="green"><CheckCircle2 size={11} className="mr-1" /> Paid</Badge>
      ) : (
        <Btn size="sm" variant={inv.status === "overdue" ? "danger" : "primary"} disabled={paying} onClick={pay} className="min-w-[110px]">
          {done ? <CheckCircle2 size={14} /> : paying ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white/60 border-t-transparent animate-spin" /> : <CreditCard size={13} />}
          {done ? "Paid!" : paying ? "Processing" : "Pay now"}
        </Btn>
      )}
    </motion.div>
  );
}

// ─── Journey tab ────────────────────────────────────────────
function JourneyTab() {
  return (
    <div className="space-y-5">
      <Card className="p-5 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-15 bg-cyan-400" />
        <SectionTitle icon={<ShieldCheck size={16} />} title="The Daily Safety Loop" sub="Mark departures as children leave — the school confirms arrivals and attendance, you get instant alerts" />
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {KIDS.map((sid) => <JourneyCard key={sid} sid={sid} />)}
        </div>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={<BellRing size={15} />} title="Commute & arrival alert log" sub="Every notification raised today" />
        <JourneyAlertLog />
      </Card>
    </div>
  );
}

function JourneyCard({ sid }: { sid: string }) {
  const { app, s, att, journey, school } = useKidData(sid);
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-soft rounded-2xl p-5 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={s.name} id={s.id} size={40} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{s.name.split(" ")[0]}</p>
          <p className="text-[10px] text-slate-500 truncate">{school.short} · {s.grade}</p>
        </div>
      </div>
      <JourneyTimeline leftHomeAt={journey?.leftHomeAt} arrivedAt={journey?.arrivedAt} compact />
      <div className="mt-4 space-y-2">
        {!journey?.leftHomeAt ? (
          <Btn size="sm" className="w-full" icon={<Bus size={13} />} onClick={() => app.markLeftHome(sid)}>Mark “left home”</Btn>
        ) : (
          <div className="text-center text-[11px] text-emerald-300 bg-emerald-400/8 border border-emerald-400/20 rounded-lg py-2 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={12} /> Left home {journey.leftHomeAt}
          </div>
        )}
        <div className={`text-center text-[11px] rounded-lg py-2 border ${journey?.arrivedAt ? "text-emerald-300 bg-emerald-400/8 border-emerald-400/20" : "text-slate-500 bg-white/[0.03] border-white/8"}`}>
          {journey?.arrivedAt ? `Reached school ${journey.arrivedAt} ✓ teacher confirmed` : "Awaiting school arrival confirmation"}
        </div>
      </div>
    </motion.div>
  );
}

function JourneyAlertLog() {
  const { notices } = useApp();
  const feed = notices.filter((n) => n.role === "parent" && ["journey", "attendance"].includes(n.icon)).slice(0, 8);
  return (
    <div className="space-y-2.5">
      {feed.length === 0 && <p className="text-xs text-slate-500 py-6 text-center">No alerts yet — mark a child “left home” to begin the loop.</p>}
      {feed.map((n, i) => (
        <motion.div key={n.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3.5 glass-soft rounded-xl p-3.5">
          <span className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${n.icon === "journey" ? "bg-amber-400/12 text-amber-300" : "bg-cyan-400/12 text-cyan-300"}`}>
            {n.icon === "journey" ? <Bus size={15} /> : <CalendarCheck2 size={15} />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white">{n.title}</p>
            <p className="text-[11px] text-slate-400">{n.body}</p>
          </div>
          <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Fees tab ───────────────────────────────────────────────
function FeesTab() {
  const app = useApp();
  const mine = app.invoices.filter((i) => KIDS.includes(i.studentId));
  const open = mine.filter((i) => i.status !== "paid");
  const totalOpen = open.reduce((a, i) => a + i.amount, 0);
  const paidThisTerm = mine.filter((i) => i.status === "paid").reduce((a, i) => a + i.amount, 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Open balance" value={totalOpen} prefix="$" icon={<AlertCircle size={17} />} accent="#fb7185" />
        <Stat label="Paid this term" value={paidThisTerm} prefix="$" icon={<CheckCircle2 size={17} />} accent="#34d399" />
        <Stat label="Open invoices" value={open.length} icon={<Receipt size={17} />} accent="#fbbf24" />
        <Stat label="Children covered" value={4} icon={<School size={17} />} accent="#22d3ee" />
      </div>
      <Card className="p-5">
        <SectionTitle icon={<Wallet size={15} />} title="All invoices — 4 children" sub="One board for tuition, transport, clubs and activity fees" />
        <div className="space-y-2.5">
          {[...mine].sort((a, b) => (a.status === "paid" ? 1 : 0) - (b.status === "paid" ? 1 : 0)).map((inv) => <InvoiceRow key={inv.id} inv={inv} />)}
        </div>
        <div className="mt-5 rounded-xl bg-indigo-500/8 border border-indigo-400/20 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-indigo-200/80">Paying in full before Friday earns the <span className="font-semibold text-white">2% early-bird credit</span> applied to next term.</p>
          <Btn size="sm" variant="outline" icon={<Download size={13} />} onClick={() => app.toast("Receipts downloaded", "Term statement PDF saved to your device.", "info")}>Download term statement</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────
const TITLES: Record<string, [string, string]> = {
  board: ["Family Board", "All four children, one calm view"],
  journey: ["Commute & Safety", "Departures, arrivals and instant alerts"],
  fees: ["Fees & Payments", "Invoices, dues and receipts"],
  reports: ["AI Progress Reports", "Smart summaries for every child"],
  messages: ["Messages", "Direct line to your children's teachers"],
  calendar: ["School Calendar", "Holidays, exams & events — both schools"],
};

export default function ParentApp() {
  const [tab, setTab] = useState("board");
  const [child, setChild] = useState<string | null>(null);
  const app = useApp();
  const openInvoices = app.invoices.filter((i) => KIDS.includes(i.studentId) && i.status !== "paid").length;
  const nav: NavItem[] = [
    { id: "board", label: "Children Board", icon: <LayoutDashboard size={16} /> },
    { id: "journey", label: "Commute & Safety", icon: <Bus size={16} /> },
    { id: "fees", label: "Fees & Payments", icon: <Wallet size={16} />, badge: openInvoices || undefined },
    { id: "reports", label: "AI Reports", icon: <FileText size={16} /> },
    { id: "messages", label: "Messages", icon: <MessageSquareText size={16} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
  ];
  const [title, sub] = child ? [`${STUDENTS.find((s) => s.id === child)?.name} — Board`, "Individual child workspace"] : TITLES[tab];
  return (
    <DashboardShell role="parent" nav={nav} active={tab} onNav={(t) => { setTab(t); setChild(null); }} title={title} subtitle={sub}>
      <AnimatePresence mode="wait">
        {child ? (
          <ChildDetail key={child} sid={child} onBack={() => setChild(null)} go={(t) => { setChild(null); setTab(t); }} />
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {tab === "board" && <ChildrenBoard open={setChild} go={setTab} />}
            {tab === "journey" && <JourneyTab />}
            {tab === "fees" && <FeesTab />}
            {tab === "reports" && (
              <div className="space-y-5">
                <SectionTitle icon={<FileText size={16} />} title="AI Reports — per child" sub="Generate actionable progress summaries" />
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {KIDS.map((sid) => {
                    const s = STUDENTS.find((x) => x.id === sid)!;
                    return <Card key={sid} className="p-4 flex items-center gap-3" hover><Avatar name={s.name} id={s.id} size={38} /><div><p className="text-[13px] font-semibold text-white">{s.name}</p><p className="text-[10px] text-slate-500">{s.grade} · GPA {s.gpa}</p></div></Card>;
                  })}
                </div>
                <AIReportPanel who="student" />
              </div>
            )}
            {tab === "messages" && <ThreadChat role="parent" accent="#fbbf24" />}
            {tab === "calendar" && <CalendarMonth events={app.events} accent="#fbbf24" title="Northwood High + Bloomfield Elementary" />}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

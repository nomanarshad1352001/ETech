"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap, ArrowLeft, ArrowRight, BookOpenText, Presentation, HeartHandshake, ShieldCheck,
  Compass, Rocket, Award, ClipboardList, Bus, CheckCircle2, Sparkles, FileText, Map, CalendarClock,
  Users, Wallet, CreditCard, BookOpenCheck, CalendarCheck2, Smartphone, LayoutDashboard, BrainCircuit,
  TrendingUp, Home, School, Check, ChevronRight, Target, MessageSquareText, NotebookPen, Grid3X3, UserPlus, CalendarDays, IdCard, Settings2, Landmark,
} from "lucide-react";
import { Badge, Btn, Card, SectionTitle, fadeUp, stagger } from "@/components/ui";
import { ROLE_META, Role } from "@/lib/data";

const PERSONAS: { role: Role; icon: React.ReactNode; scope: string[] }[] = [
  { role: "student", icon: <BookOpenText size={18} />, scope: ["Course discovery & enrollment", "Interactive lessons & quizzes", "Daily learning diary + tasks", "Self attendance check-in", "Assignment & capstone submission", "AI study tools & certificates", "Peer study groups & messaging"] },
  { role: "instructor", icon: <Presentation size={18} />, scope: ["Course authoring studio", "Attendance approval & quick-mark", "Class diary shared with parents", "Grading desk with feedback", "Grade book & early warnings", "AI quiz generation & reports", "Parent/student communication hub"] },
  { role: "parent", icon: <HeartHandshake size={18} />, scope: ["4 children on one board", "Commute departure marking", "Arrival & attendance alerts", "Read-only child diaries", "Grade book visibility", "Fees, dues & one-tap payments", "Direct teacher messaging"] },
  { role: "admin", icon: <ShieldCheck size={18} />, scope: ["Multi-school command deck", "Teacher directory, periods & caps", "Payroll, leaves & onboarding", "Student records & history", "Fee plans & collections", "Curriculum approval & compliance", "Licenses, analytics & settings"] },
];

const JOURNEY = [
  { t: "Enroll & Onboard", d: "Student discovers a course in the catalog, enrolls with one tap; first module unlocks with a guided orientation checklist.", sys: "Catalog → Profile → LMS", kpi: "Activation < 24h" },
  { t: "Learn Interactively", d: "Video, readings, interactive labs and adaptive checkpoints. Progress syncs live; XP and streaks sustain momentum.", sys: "Lesson player → Progress engine → Gamification", kpi: "Weekly active learners ≥ 85%" },
  { t: "Practice & Diary", d: "Daily tasks, AI micro-drills for weak topics, and the personal diary capturing work, learnings and mood — visible to parents.", sys: "Planner → AI syllabus → Diary", kpi: "Diary streak ≥ 5 days/wk" },
  { t: "Assess & Feedback", d: "Submissions flow to the instructor's grading desk; scores and rich feedback publish to the grade book instantly.", sys: "Assignments → Grading desk → Grade book", kpi: "Feedback ≤ 3 days" },
  { t: "Capstone Project", d: "All lessons completed unlocks the 200-point capstone — a real-world modeling brief with rubric, milestones and viva-ready report.", sys: "Capstone unlock → Rubric engine", kpi: "Capstone completion ≥ 70%" },
  { t: "Verified Certificate", d: "Graded capstone mints a sealed, shareable certificate with credential ID, verifiable by any institution.", sys: "Credential ledger → Wallet", kpi: "Time-to-credential ≤ 48h" },
];

const MATRIX: { m: string; items: { n: string; s: boolean; i: boolean; p: boolean; a: boolean }[] }[] = [
  { m: "Learning & Pedagogy", items: [
    { n: "Course catalog & discovery", s: true, i: true, p: false, a: true },
    { n: "Interactive lesson player", s: true, i: true, p: false, a: false },
    { n: "Capstone projects & rubrics", s: true, i: true, p: false, a: true },
    { n: "Course authoring studio", s: false, i: true, p: false, a: true },
    { n: "Curriculum approval gate", s: false, i: false, p: false, a: true },
  ]},
  { m: "Diaries, Tasks & Planner", items: [
    { n: "Personal daily diary + mood", s: true, i: false, p: true, a: false },
    { n: "Today's tasks (self/teacher/AI)", s: true, i: true, p: true, a: false },
    { n: "Class diary shared to parents", s: false, i: true, p: true, a: false },
  ]},
  { m: "Attendance & Safety", items: [
    { n: "Self check-in + approval loop", s: true, i: true, p: true, a: true },
    { n: "Quick roster marking & reports", s: false, i: true, p: false, a: true },
    { n: "Commute: left-home marking", s: false, i: true, p: true, a: false },
    { n: "Arrival confirmation alerts", s: false, i: true, p: true, a: false },
    { n: "Monthly heatmaps & history", s: true, i: true, p: true, a: true },
  ]},
  { m: "Assessment & Grades", items: [
    { n: "Assignment submission flow", s: true, i: true, p: false, a: false },
    { n: "Grading desk with feedback", s: false, i: true, p: false, a: false },
    { n: "Grade book & trends", s: true, i: true, p: true, a: true },
    { n: "Verified certificates", s: true, i: false, p: true, a: true },
  ]},
  { m: "AI Suite", items: [
    { n: "AI quiz generator (1,000/mo)", s: true, i: true, p: false, a: true },
    { n: "AI progress/teaching reports", s: true, i: true, p: true, a: true },
    { n: "AI personalized syllabus", s: true, i: true, p: false, a: false },
    { n: "AI 4-month test planner", s: true, i: true, p: false, a: true },
  ]},
  { m: "Operations & Finance", items: [
    { n: "Fee plans, dues & payments", s: false, i: false, p: true, a: true },
    { n: "Payroll runs & payslips", s: false, i: false, p: false, a: true },
    { n: "Leave desk & balances", s: false, i: true, p: false, a: true },
    { n: "Periods & lecture caps", s: false, i: true, p: false, a: true },
    { n: "Hiring & onboarding pipeline", s: false, i: false, p: false, a: true },
    { n: "Licenses & compliance", s: false, i: false, p: false, a: true },
  ]},
  { m: "Communication & Calendar", items: [
    { n: "Messaging hubs & groups", s: true, i: true, p: true, a: false },
    { n: "Holiday & events calendar", s: true, i: true, p: true, a: true },
    { n: "Notification center", s: true, i: true, p: true, a: true },
  ]},
];

const METRICS: { group: string; color: string; items: { n: string; f: string; t: string }[] }[] = [
  { group: "Pedagogical — is learning working?", color: "#a78bfa", items: [
    { n: "Topic mastery index", f: "Σ mastered topics / Σ taught, per class", t: "≥ 80%" },
    { n: "Learning gain per course", f: "Post-assessment − pre-assessment delta", t: "≥ +18 pts" },
    { n: "Assignment health", f: "On-time submission rate & grade velocity", t: "≥ 88% · ≤ 3d" },
    { n: "At-risk detection lead time", f: "Days before failure that flags appear", t: "≥ 21 days" },
    { n: "Capstone & credential rate", f: "Completers / enrolled, per cohort", t: "≥ 70%" },
  ]},
  { group: "Operational — is the school day smooth?", color: "#22d3ee", items: [
    { n: "Daily attendance rate", f: "Approved present / enrolled, per school", t: "≥ 95%" },
    { n: "Check-in cycle time", f: "Self-mark → teacher approval latency", t: "≤ 15 min" },
    { n: "Arrival alert coverage", f: "Students with confirmed arrival events", t: "100% K-8" },
    { n: "Teacher load balance", f: "Periods assigned / cap, variance", t: "70–95% band" },
    { n: "Payroll & leave SLA", f: "Payroll on-time; leave decisions ≤ 48h", t: "100% · ≥ 95%" },
  ]},
  { group: "Business — is the institution healthy?", color: "#34d399", items: [
    { n: "Learner success (GPA + retention)", f: "`Cohort GPA × re-enrollment rate`", t: "≥ 3.4 · ≥ 95%" },
    { n: "Course effectiveness margin", f: "Completion × rating × referral index", t: "≥ 0.72" },
    { n: "Revenue per learner", f: "Tuition + fees + add-ons / student / yr", t: "growth ≥ 6%" },
    { n: "Collection rate & DSO", f: "Collected / billed; days sales outstanding", t: "≥ 92% · ≤ 25d" },
    { n: "Family NPS & app MAU", f: "Quarterly NPS; monthly active guardians", t: "≥ 60 · ≥ 75%" },
  ]},
];

const WORKFLOWS = [
  { t: "The Daily Safety Loop", steps: ["Parent marks “left home”", "School notified in transit", "Student self check-in", "Teacher approves → arrival alert", "Registers & reports auto-file"] },
  { t: "Content-to-Classroom Pipeline", steps: ["Instructor authors course", "Modules, quizzes, capstone rubric", "Submit for district approval", "Admin QA checklist → publish", "Live in catalog · analytics on"] },
  { t: "Fee Cycle", steps: ["Admin publishes fee plan", "Invoices issued to families", "Parent pays in app → receipt", "Dues dashboard updates live", "Collections report to finance"] },
  { t: "Teacher Lifecycle", steps: ["Onboarding pipeline (5 stages)", "Directory profile & sections", "Periods assigned under caps", "Leaves decided in 48h", "Payroll run monthly, 1 click"] },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#06090f] text-slate-200 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] -top-40 left-1/3 -translate-x-1/2" style={{ background: "rgba(99,102,241,.13)" }} />
        <div className="absolute inset-0 grid-bg" />
      </div>
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#06090f]/80 border-b border-white/6">
        <div className="max-w-6xl mx-auto px-5 h-[60px] flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"><ArrowLeft size={13} /> Home</Link>
          <div className="flex items-center gap-2 mx-auto">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center"><GraduationCap size={14} className="text-white" /></div>
            <span className="font-display font-bold text-white text-sm">EduNova OS — Product Blueprint</span>
          </div>
          <Btn size="sm" onClick={() => (window.location.href = "/login")}>Live demo <ArrowRight size={12} /></Btn>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 py-14 space-y-20 pb-28">
        {/* vision */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Badge tone="violet" dot>PRD · v1.0 · Chief Product Office</Badge>
          <h1 className="font-display font-extrabold text-white text-4xl md:text-6xl mt-5 leading-tight">The complete blueprint for a<br /><span className="text-gradient">school-day operating system</span></h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-5 leading-relaxed">
            Scope: user capabilities, pedagogical workflows, engagement mechanics and administrative management for a
            K-12 district of three schools — students, instructors, guardians and administrators. Everything below is implemented in the live demo.
          </p>
          <div className="flex justify-center gap-2.5 mt-7 flex-wrap">
            {["Deliverable 1 — Journey Map", "Deliverable 2 — Feature Matrix", "Deliverable 3 — Metrics"].map((d) => (
              <a key={d} href={`#${d.split(" ")[0].toLowerCase() === "deliverable" ? "d" + d.split(" ")[2] : ""}`} className="glass rounded-full px-4 py-2 text-[11px] text-slate-300 hover:text-white hover:border-indigo-400/40 transition">{d}</a>
            ))}
          </div>
        </motion.section>

        {/* personas */}
        <section>
          <SectionTitle icon={<Users size={16} />} title="System scope — four personas, four workspaces" sub="Capabilities mapped per role; each row is live in the demo" />
          <div className="grid md:grid-cols-2 gap-4">
            {PERSONAS.map((p, i) => (
              <motion.div key={p.role} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="p-6 h-full relative overflow-hidden" hover>
                  <div className="absolute -top-14 -right-14 w-36 h-36 rounded-full blur-3xl opacity-25" style={{ background: ROLE_META[p.role].accent }} />
                  <div className="flex items-center gap-3.5">
                    <span className="w-11 h-11 rounded-xl grid place-items-center" style={{ background: `${ROLE_META[p.role].accent}1c`, color: ROLE_META[p.role].accent }}>{p.icon}</span>
                    <div>
                      <p className="font-display font-semibold text-white text-lg">{ROLE_META[p.role].label}</p>
                      <p className="text-[10px] text-slate-500">/{p.role} workspace · demo credentials on the login page</p>
                    </div>
                  </div>
                  <ul className="mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-2">
                    {p.scope.map((s) => <li key={s} className="flex items-start gap-2 text-[11.5px] text-slate-300"><Check size={12} className="mt-0.5 shrink-0" style={{ color: ROLE_META[p.role].accent }} />{s}</li>)}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* D1 journey */}
        <section id="d1">
          <SectionTitle icon={<Compass size={16} />} title="Deliverable 1 — End-to-end student learning journey map" sub="Enroll → learn → practice → assess → capstone → certified" />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {JOURNEY.map((j, i) => (
              <motion.div key={j.t} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="p-5 h-full relative" hover>
                  <span className="absolute -top-3 -left-1 font-display font-extrabold text-[64px] leading-none text-white/5 select-none">{i + 1}</span>
                  <div className="relative">
                    <Badge tone="cyan">{j.kpi}</Badge>
                    <p className="font-display font-semibold text-white mt-3">{j.t}</p>
                    <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">{j.d}</p>
                    <p className="text-[10px] text-indigo-300/90 mt-3 font-mono">{j.sys}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* D2 matrix */}
        <section id="d2">
          <SectionTitle icon={<ClipboardList size={16} />} title="Deliverable 2 — Operational feature checklist" sub="Every screen, tool and automated workflow by role — S student · I instructor · P parent · A admin" />
          <div className="space-y-4">
            {MATRIX.map((g, gi) => (
              <motion.div key={g.m} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="p-5 overflow-x-auto">
                  <p className="font-display font-semibold text-white text-sm mb-3.5">{g.m}</p>
                  <table className="w-full min-w-[560px]">
                    <tbody>
                      {g.items.map((r) => (
                        <tr key={r.n} className="border-t border-white/5">
                          <td className="py-2.5 text-[12.5px] text-slate-300 pr-4">{r.n}</td>
                          {[r.s, r.i, r.p, r.a].map((v, k) => (
                            <td key={k} className="py-2.5 w-14 text-center">
                              {v ? (
                                <span className="inline-grid place-items-center w-6 h-6 rounded-md text-[10px] font-bold"
                                  style={{ background: `${Object.values(ROLE_META)[k].accent}1e`, color: Object.values(ROLE_META)[k].accent }}>
                                  {"SIPA"[k]}
                                </span>
                              ) : <span className="text-slate-700 text-[10px]">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* D3 metrics */}
        <section id="d3">
          <SectionTitle icon={<TrendingUp size={16} />} title="Deliverable 3 — Instructor & admin analytics framework" sub="Exact metrics, formulas and healthy targets" />
          <div className="grid lg:grid-cols-3 gap-4">
            {METRICS.map((m, i) => (
              <motion.div key={m.group} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="p-5 h-full">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: `${m.color}1c`, color: m.color }}><Target size={15} /></span>
                    <p className="text-[13px] font-semibold text-white leading-snug">{m.group}</p>
                  </div>
                  <div className="space-y-3.5">
                    {m.items.map((it) => (
                      <div key={it.n} className="border-t border-white/5 pt-3">
                        <p className="text-[12.5px] font-medium text-white">{it.n}</p>
                        <p className="text-[10.5px] text-slate-500 mt-1 font-mono">{it.f}</p>
                        <p className="text-[10.5px] font-semibold mt-1" style={{ color: m.color }}>Target {it.t}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* operational workflows */}
        <section>
          <SectionTitle icon={<Rocket size={16} />} title="Operational framework — automated background workflows" sub="Cross-role automations that keep the district humming" />
          <div className="grid lg:grid-cols-2 gap-4">
            {WORKFLOWS.map((w, i) => (
              <motion.div key={w.t} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Card className="p-5" hover>
                  <p className="font-display font-semibold text-white text-sm mb-4">{w.t}</p>
                  <div className="flex flex-wrap items-center gap-y-2">
                    {w.steps.map((s, k) => (
                      <React.Fragment key={s}>
                        <span className="text-[10.5px] px-3 py-1.5 rounded-lg bg-white/[0.045] border border-white/10 text-slate-300">{s}</span>
                        {k < w.steps.length - 1 && <ChevronRight size={12} className="text-slate-600 mx-0.5 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* engagement mechanics */}
        <section>
          <SectionTitle icon={<Sparkles size={16} />} title="Engagement mechanics" sub="The motivational engine behind daily usage" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Streaks & XP", d: "Study streaks, XP levels and term leaderboards reward consistency over cramming." },
              { t: "Diary ritual", d: "A 3:30 PM reflective diary prompt builds metacognition — parents reinforce it at home." },
              { t: "Safety reassurance", d: "Arrival alerts close the emotional loop for families every single morning." },
              { t: "Visible mastery", d: "Progress rings, mastery maps and sealed certificates make growth tangible." },
            ].map((e, i) => (
              <motion.div key={e.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Card className="p-5 h-full hover-lift">
                  <p className="font-display font-semibold text-white text-sm">{e.t}</p>
                  <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">{e.d}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="text-center glass rounded-3xl p-10">
          <h3 className="font-display font-bold text-white text-2xl">See every line of this blueprint running</h3>
          <p className="text-slate-400 text-sm mt-2.5">Four live workspaces with dummy credentials — all flows clickable end-to-end.</p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <Btn size="lg" icon={<ArrowRight size={15} />} onClick={() => (window.location.href = "/login")}>Open the live demo</Btn>
            <Btn size="lg" variant="ghost" onClick={() => (window.location.href = "/")}>Back to home</Btn>
          </div>
        </div>
      </main>
    </div>
  );
}

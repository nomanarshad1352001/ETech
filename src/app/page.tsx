"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap, ArrowRight, CalendarCheck2, Users, Briefcase, Wallet, CreditCard,
  BookOpenCheck, Smartphone, HeartHandshake, Sparkles, FileText, Map, CalendarClock,
  ShieldCheck, Bus, School, Home, Check, ChevronRight, Wand2, BrainCircuit, Star,
  LayoutDashboard, Bell, Search, TrendingUp, ClipboardList, BookOpen, Play, Award,
} from "lucide-react";
import { Badge, Btn, Counter } from "@/components/ui";
import { Donut, Sparkline, HBar } from "@/components/charts";
import { DEMO_LOGINS, ROLE_META, Role } from "@/lib/data";
import { fadeUp, stagger } from "@/components/ui";

// ─── hero dashboard mock (screenshot-style) ─────────────────
function HeroDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 60, rotateX: 18 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }} className="relative" style={{ perspective: 1200 }}>
      <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-cyan-400/20 blur-3xl rounded-full" />
      <div className="relative glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/60">
        {/* titlebar */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-white/8 bg-white/[0.03]">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" /><span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <div className="flex-1 flex justify-center"><div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-white/5 rounded-md px-3 py-1"><ShieldCheck size={10} className="text-emerald-400" /> edunova.school/dashboard</div></div>
        </div>
        <div className="flex">
          {/* mini sidebar */}
          <div className="hidden sm:flex w-[54px] flex-col items-center gap-3 py-4 border-r border-white/6">
            {[LayoutDashboard, CalendarCheck2, BookOpenCheck, Wallet, Users].map((I, i) => (
              <div key={i} className={`w-9 h-9 rounded-xl grid place-items-center ${i === 0 ? "bg-indigo-500/25 text-indigo-300" : "text-slate-600"}`}><I size={15} /></div>
            ))}
          </div>
          <div className="flex-1 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="font-display text-[13px] md:text-[15px] font-semibold text-white">Good morning, Dr. Osei — district is thriving</motion.p>
                <p className="text-[9px] text-slate-500">3 schools · 2,740 students · live attendance sync</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 text-[9px] text-slate-500"><Search size={10} /> Search</div>
                <div className="relative w-7 h-7 rounded-lg bg-white/5 grid place-items-center text-slate-400"><Bell size={12} /><span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 text-[7px] font-bold grid place-items-center text-[#06090f]">3</span></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { l: "Attendance today", v: "94.6%", s: [80, 85, 90, 87, 94, 92, 95], c: "#34d399" },
                { l: "Fees collected", v: "$1.42M", s: [1.1, 1.2, 1.25, 1.3, 1.36, 1.4, 1.42], c: "#22d3ee" },
                { l: "Active teachers", v: "154", s: [140, 145, 150, 148, 152, 154, 154], c: "#a78bfa" },
              ].map((k, i) => (
                <motion.div key={k.l} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.12 }} className="glass-soft rounded-xl p-3">
                  <p className="text-[8px] md:text-[9px] text-slate-500">{k.l}</p>
                  <p className="font-display font-bold text-white text-sm md:text-lg mt-0.5">{k.v}</p>
                  <div className="mt-1.5 hidden md:block"><Sparkline data={k.s} color={k.c} width={90} height={22} /></div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-3">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="col-span-3 glass-soft rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] md:text-[10px] font-semibold text-slate-300">Mastery by topic — Grade 10</p>
                  <span className="text-[8px] text-emerald-300 flex items-center gap-1"><TrendingUp size={9} /> +9% term</span>
                </div>
                <div className="space-y-2">
                  <HBar label="Functions" pct={86} color="#34d399" />
                  <HBar label="Polynomials" pct={78} color="#22d3ee" />
                  <HBar label="Logarithms" pct={47} color="#fb7185" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.55 }} className="col-span-2 glass-soft rounded-xl p-3.5 flex items-center gap-3">
                <Donut value={92} size={64} stroke={8} color="#34d399" label="92%" />
                <div>
                  <p className="text-[9px] md:text-[10px] font-semibold text-slate-300">Capstones verified</p>
                  <p className="text-[8px] text-slate-500 mt-1 leading-relaxed">Certificates issued with blockchain-anchored seals</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {/* floating chips */}
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-3 md:-left-10 top-16 glass-strong rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xl">
        <span className="w-7 h-7 rounded-lg bg-emerald-400/15 grid place-items-center"><Bus size={13} className="text-emerald-300" /></span>
        <div><p className="text-[10px] font-semibold text-white">Zara reached school</p><p className="text-[8px] text-slate-500">Confirmed 07:44 AM · parent notified</p></div>
      </motion.div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -right-2 md:-right-8 bottom-14 glass-strong rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xl">
        <span className="w-7 h-7 rounded-lg bg-violet-400/15 grid place-items-center"><Sparkles size={13} className="text-violet-300" /></span>
        <div><p className="text-[10px] font-semibold text-white">AI quiz generated</p><p className="text-[8px] text-slate-500">5 items · answer key attached</p></div>
      </motion.div>
    </motion.div>
  );
}

// ─── data for sections ──────────────────────────────────────
const CAPS = [
  { icon: CalendarCheck2, t: "Attendance Management", d: "Self-mark, teacher approval, quick roster marking and live reports.", c: "#22d3ee" },
  { icon: Users, t: "Student Management", d: "Profiles, records, diary and full academic history in one view.", c: "#818cf8" },
  { icon: Briefcase, t: "Teacher Management", d: "Profiles, classes, periods and workload balancing per teacher.", c: "#a78bfa" },
  { icon: Wallet, t: "Payroll", d: "Teacher & staff salary runs, allowances and payslip history.", c: "#34d399" },
  { icon: CreditCard, t: "Fee Management", d: "Fee plans, dues tracking, collections and instant receipts.", c: "#fbbf24" },
  { icon: BookOpenCheck, t: "Grade Book", d: "Record marks, monitor performance and spot trends early.", c: "#f472b6" },
  { icon: Smartphone, t: "Teacher App", d: "Attendance, grades, class diary and updates from anywhere.", c: "#60a5fa" },
  { icon: HeartHandshake, t: "Parent App", d: "Attendance, grade book, commute alerts and instant notifications.", c: "#fb7185" },
];
const AI_SUITE = [
  { icon: Wand2, t: "AI Quiz Generator", points: ["Up to 1,000 AI-generated quizzes / month", "Custom topics & difficulty", "Export-ready drafts with answer keys"], c: "#a78bfa" },
  { icon: FileText, t: "AI-Based Reports", points: ["Teacher performance reports", "Student progress summaries", "Actionable insights, not noise"], c: "#22d3ee" },
  { icon: Map, t: "AI Personalized Syllabus", points: ["Per-student syllabus for test sessions", "Weakness & goal-based recommendations", "Adaptive improvement paths"], c: "#34d399" },
  { icon: CalendarClock, t: "AI Test Session Planner", points: ["Plans the final 3–4 months", "Student-wise schedules by weakness", "Automated academic planning"], c: "#fbbf24" },
];
const WORKFLOW = [
  { icon: Home, actor: "Parent", text: "marks “left home” as the child departs", c: "#fbbf24" },
  { icon: Bus, actor: "System", text: "tracks the commute & notifies the school", c: "#22d3ee" },
  { icon: CalendarCheck2, actor: "Student", text: "self-marks attendance on arrival", c: "#818cf8" },
  { icon: Check, actor: "Teacher", text: "approves — arrival alert sent to parents", c: "#34d399" },
];

export default function Landing() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 600], [0, -80]);
  return (
    <div className="min-h-screen bg-[#06090f] text-slate-200 overflow-x-clip">
      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[700px] h-[700px] -top-64 left-1/2 -translate-x-1/2" style={{ background: "rgba(99,102,241,.16)" }} />
        <div className="orb w-[500px] h-[500px] top-[45%] -right-52" style={{ background: "rgba(34,211,238,.09)" }} />
        <div className="orb w-[500px] h-[500px] bottom-[-10%] -left-52" style={{ background: "rgba(168,85,247,.1)" }} />
        <div className="absolute inset-0 grid-bg" />
      </div>

      {/* nav */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-5 mt-4">
          <div className="glass-strong rounded-2xl px-4 md:px-5 h-[60px] flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 grid place-items-center shadow-lg shadow-indigo-500/30">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-white">EduNova <span className="text-gradient">OS</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-[13px] text-slate-400 mx-auto">
              {[["Platform", "#platform"], ["AI Suite", "#ai"], ["Safety Loop", "#loop"], ["Blueprint", "/docs"]].map(([l, h]) => (
                <Link key={l} href={h} className="hover:text-white transition-colors">{l}</Link>
              ))}
            </nav>
            <Btn size="sm" icon={<ArrowRight size={13} />} onClick={() => (window.location.href = "/login")}>Sign in</Btn>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative pt-36 md:pt-44 pb-16 px-5">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-[11px] text-slate-300">
              <Sparkles size={12} className="text-violet-300" /> Enterprise EdTech · K-12 & districts · AI-first
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12 }}
            className="font-display font-extrabold text-white leading-[1.04] tracking-tight text-[42px] md:text-[76px] mt-6">
            One operating system<br />for the <span className="text-gradient">entire school day</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28 }}
            className="max-w-2xl mx-auto text-slate-400 text-sm md:text-lg mt-6 leading-relaxed">
            EduNova OS unifies learners, educators, parents and administrators — from the morning commute
            and attendance to AI-personalized learning, payroll, fees and verified certificates.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.42 }} className="flex flex-wrap justify-center gap-3 mt-8">
            <Btn size="lg" icon={<Play size={15} />} onClick={() => (window.location.href = "/login")}>Launch live demo</Btn>
            <Btn size="lg" variant="ghost" icon={<ChevronRight size={15} />} onClick={() => (window.location.href = "/docs")}>Read the product blueprint</Btn>
          </motion.div>
          {/* role quick login */}
          <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
            {DEMO_LOGINS.map((d, i) => (
              <motion.div key={d.role} variants={fadeUp} custom={i}>
                <Link href={`/login?role=${d.role}`} className="block glass rounded-xl p-3.5 text-left hover-lift group">
                  <span className="w-2 h-2 rounded-full inline-block mb-2" style={{ background: ROLE_META[d.role].accent, boxShadow: `0 0 10px ${ROLE_META[d.role].accent}` }} />
                  <p className="text-[12px] font-semibold text-white group-hover:text-gradient transition">{ROLE_META[d.role].label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{d.blurb}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div style={{ y: yHero }} className="max-w-6xl mx-auto mt-14 md:mt-20 relative z-10 px-1">
          <HeroDashboard />
        </motion.div>
      </section>

      {/* marquee */}
      <section className="border-y border-white/6 py-4 overflow-hidden relative z-10 bg-white/[0.015]">
        <div className="flex gap-10 whitespace-nowrap animate-marquee w-max">
          {[...Array(2)].flatMap((_, k) =>
            ["Attendance", "Diaries", "Grade Book", "Payroll", "Fee Plans", "AI Quizzes", "Commute Alerts", "Calendars", "Capstones", "Certificates", "Onboarding", "Leave Desk", "Licenses", "Compliance", "Analytics", "Messaging"].map((w) => (
              <span key={`${k}-${w}`} className="text-[13px] text-slate-500 flex items-center gap-10">
                {w} <Star size={10} className="text-indigo-400/60" />
              </span>
            ))
          )}
        </div>
      </section>

      {/* platform capabilities */}
      <section id="platform" className="relative z-10 py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.3em] text-indigo-300 font-semibold">Core operations</motion.p>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-white text-3xl md:text-5xl mt-3">Every school workflow, <span className="text-gradient">one roof</span></motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-sm md:text-base mt-4 max-w-xl mx-auto">Eight operational engines working as one — click into each inside the live demo.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPS.map((c, i) => (
              <motion.div key={c.t} variants={fadeUp} custom={i}>
                <Link href="/login" className="block glass rounded-2xl p-5 hover-lift h-full group">
                  <div className="w-11 h-11 rounded-xl grid place-items-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: `${c.c}1c`, color: c.c }}>
                    <c.icon size={19} />
                  </div>
                  <p className="font-display font-semibold text-white text-[15px]">{c.t}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{c.d}</p>
                  <p className="text-[11px] mt-4 flex items-center gap-1 font-medium" style={{ color: c.c }}>Open in demo <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" /></p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* safety loop */}
      <section id="loop" className="relative z-10 py-24 px-5 border-y border-white/6 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-semibold">The Daily Safety Loop</p>
            <h2 className="font-display font-bold text-white text-3xl md:text-5xl mt-3">Home to school, <span className="text-gradient-gold">watched over</span></h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {WORKFLOW.map((w, i) => (
              <motion.div key={w.actor} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.14, duration: 0.6 }} className="relative">
                <div className="glass rounded-2xl p-6 text-center h-full hover-lift">
                  <div className="w-14 h-14 mx-auto rounded-2xl grid place-items-center mb-4" style={{ background: `${w.c}1c`, color: w.c, boxShadow: `0 0 30px ${w.c}22` }}>
                    <w.icon size={24} />
                  </div>
                  <Badge tone="slate">{w.actor}</Badge>
                  <p className="text-[13px] text-slate-300 mt-3 leading-relaxed">{w.text}</p>
                </div>
                {i < 3 && <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.14 + 0.3 }} className="hidden md:block absolute top-1/2 -right-[14px] z-10 text-slate-600"><ChevronRight size={18} /></motion.div>}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-8">Try it live: sign in as Parent → mark “left home”, then approve attendance as Instructor and watch the Parent board light up.</p>
        </div>
      </section>

      {/* AI suite */}
      <section id="ai" className="relative z-10 py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-violet-300 font-semibold flex items-center justify-center gap-2"><BrainCircuit size={13} /> EduNova Intelligence</p>
            <h2 className="font-display font-bold text-white text-3xl md:text-5xl mt-3">An AI copilot for <span className="text-gradient">every classroom</span></h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {AI_SUITE.map((a, i) => (
              <motion.div key={a.t} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }} className="glass rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-45 transition-opacity" style={{ background: a.c }} />
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-5" style={{ background: `${a.c}1c`, color: a.c }}><a.icon size={21} /></div>
                <p className="font-display font-semibold text-white text-lg">{a.t}</p>
                <ul className="mt-4 space-y-2.5">
                  {a.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                      <Check size={12} className="mt-0.5 shrink-0" style={{ color: a.c }} /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="relative z-10 py-16 px-5 border-y border-white/6 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: 2740, s: "", l: "students thriving", d: 0 },
            { v: 94.6, s: "%", l: "average daily attendance", d: 1 },
            { v: 154, s: "", l: "teachers on one payroll", d: 0 },
            { v: 4.8, s: "/5", l: "family satisfaction", d: 1 },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Counter to={s.v} decimals={s.d} suffix={s.s} className="font-display font-extrabold text-3xl md:text-5xl text-gradient" />
              <p className="text-xs text-slate-500 mt-2">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-5 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto glass rounded-3xl p-10 md:p-14 relative overflow-hidden noise">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-500/20 blur-[90px]" />
          <Award size={30} className="mx-auto text-amber-300 mb-4" />
          <h2 className="font-display font-bold text-white text-3xl md:text-4xl">Step inside each role</h2>
          <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">Four live workspaces — student, instructor, parent and district admin — with demo credentials pre-filled.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Btn size="lg" icon={<ArrowRight size={15} />} onClick={() => (window.location.href = "/login")}>Open the demo</Btn>
            <Btn size="lg" variant="ghost" onClick={() => (window.location.href = "/docs")}>Product blueprint</Btn>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/6 py-10 px-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center"><GraduationCap size={15} className="text-white" /></div>
            <span className="font-display font-semibold text-white text-sm">EduNova OS</span>
            <span className="text-[11px] text-slate-600">· The operating system for modern schools</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-slate-500">
            <Link href="/docs" className="hover:text-white transition">Product Blueprint</Link>
            <Link href="/login" className="hover:text-white transition">Sign in</Link>
            <span>© 2026 EduNova District Systems</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

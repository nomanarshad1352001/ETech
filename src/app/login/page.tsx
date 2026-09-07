"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, ArrowLeft, BookOpenText, Presentation, HeartHandshake, ShieldCheck,
  KeyRound, Mail, ArrowRight, Sparkles, Check, Eye, EyeOff,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { DEMO_LOGINS, ROLE_META, Role } from "@/lib/data";
import { Btn, inputCls } from "@/components/ui";

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  student: <BookOpenText size={20} />,
  instructor: <Presentation size={20} />,
  parent: <HeartHandshake size={20} />,
  admin: <ShieldCheck size={20} />,
};

export default function LoginPage() {
  const { login, user, ready, toast } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState(DEMO_LOGINS[0].email);
  const [pass, setPass] = useState(DEMO_LOGINS[0].pass);
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("role") as Role | null;
    if (q && ROLE_META[q]) pick(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready && user && !busy) router.replace(ROLE_META[user.role].path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const pick = (r: Role) => {
    setRole(r);
    const d = DEMO_LOGINS.find((x) => x.role === r)!;
    setEmail(d.email); setPass(d.pass);
  };

  const submit = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      login(role);
      setDone(true);
      toast(`Welcome back, ${DEMO_LOGINS.find((d) => d.role === role)?.blurb.split("·")[0].trim()}`, "Signed in with demo credentials.");
      setTimeout(() => router.push(ROLE_META[role].path), 750);
    }, 900);
  };

  const meta = ROLE_META[role];

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-200 flex">
      {/* left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12 border-r border-white/6">
        <div className="absolute inset-0 grid-bg opacity-70" />
        <motion.div key={role + "-orb"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="orb w-[480px] h-[480px] -top-24 -left-24" style={{ background: `${meta.accent}22` }} />
        <div className="orb w-[380px] h-[380px] bottom-[-120px] right-[-100px]" style={{ background: "rgba(99,102,241,.14)" }} />

        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 grid place-items-center shadow-lg shadow-indigo-500/30">
            <GraduationCap size={19} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white">EduNova <span className="text-gradient">OS</span></p>
            <p className="text-[10px] text-slate-500">The operating system for modern schools</p>
          </div>
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={role} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }}>
              <div className="w-14 h-14 rounded-2xl grid place-items-center mb-6" style={{ background: `${meta.accent}1d`, color: meta.accent, boxShadow: `0 0 40px ${meta.accent}26` }}>
                {ROLE_ICONS[role]}
              </div>
              <h2 className="font-display font-bold text-white text-4xl leading-tight">
                {role === "student" && <>Learn boldly.<br /><span className="text-gradient">Track everything.</span></>}
                {role === "instructor" && <>Teach brilliantly.<br /><span className="text-gradient">Grade effortlessly.</span></>}
                {role === "parent" && <>Four children.<br /><span className="text-gradient-gold">One calm board.</span></>}
                {role === "admin" && <>Three schools.<br /><span className="text-gradient">One command deck.</span></>}
              </h2>
              <p className="text-slate-400 text-sm mt-4 max-w-sm leading-relaxed">
                {role === "student" && "Courses, interactive lessons, your daily diary, attendance self-check-in, AI study tools and verified certificates."}
                {role === "instructor" && "Course studio, attendance approvals, grading desk, class diary, AI quiz generation and student analytics."}
                {role === "parent" && "Watch all four children on one board — commute alerts, attendance, diaries, grade books and fee payments."}
                {role === "admin" && "Schools, teachers, periods, payroll, leave desk, onboarding pipeline, fees, licenses and compliance."}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-2 mt-8">
            {(["student", "instructor", "parent", "admin"] as Role[]).map((r) => (
              <span key={r} className="h-1 rounded-full transition-all duration-500" style={{ width: r === role ? 32 : 14, background: r === role ? meta.accent : "rgba(148,163,184,.2)" }} />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-[11px] text-slate-500">
          <Sparkles size={12} className="text-violet-300" /> AI-first · FERPA-conscious · 99.98% uptime SLA
        </div>
      </div>

      {/* right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 lg:hidden"><div className="orb w-[380px] h-[380px] -top-20 -right-20" style={{ background: "rgba(99,102,241,.18)" }} /></div>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[440px] relative z-10">
          <button onClick={() => router.push("/")} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-white transition mb-6"><ArrowLeft size={13} /> Back to home</button>
          <div className="glass-strong rounded-3xl p-7 md:p-8 relative overflow-hidden noise">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl transition-colors duration-700" style={{ background: `${meta.accent}1e` }} />
            <h1 className="font-display font-bold text-white text-2xl">Sign in to EduNova</h1>
            <p className="text-xs text-slate-500 mt-1.5">Choose a role — demo credentials auto-fill, everything is clickable.</p>

            <div className="grid grid-cols-4 gap-2 mt-6">
              {(Object.keys(ROLE_META) as Role[]).map((r) => (
                <button key={r} onClick={() => pick(r)}
                  className={`rounded-xl border py-3 flex flex-col items-center gap-1.5 text-[10px] font-medium transition-all duration-300 ${r === role ? "text-white" : "text-slate-500 border-white/8 hover:border-white/20"}`}
                  style={r === role ? { background: `${ROLE_META[r].accent}18`, borderColor: `${ROLE_META[r].accent}66`, boxShadow: `0 0 20px ${ROLE_META[r].accent}18` } : {}}>
                  <span style={{ color: ROLE_META[r].accent }}>{ROLE_ICONS[r]}</span>
                  {ROLE_META[r].label}
                </button>
              ))}
            </div>

            <form className="space-y-4 mt-6" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} pl-10`} placeholder="you@school.edu" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} className={`${inputCls} pl-10 pr-10`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
                    <Check size={16} /> Success — opening your workspace…
                  </motion.div>
                ) : (
                  <motion.button key="btn" type="submit" disabled={busy} whileTap={{ scale: 0.97 }}
                    className="btn-sheen w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-70 flex items-center justify-center gap-2">
                    {busy ? <><span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-transparent animate-spin" /> Verifying…</> : <>Enter {meta.label} workspace <ArrowRight size={15} /></>}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/8 p-3.5">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Demo credential</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{DEMO_LOGINS.find((d) => d.role === role)?.blurb}</span>
                <span className="font-mono text-slate-500">{DEMO_LOGINS.find((d) => d.role === role)?.pass}</span>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-slate-600 mt-5">Protected by district SSO in production · this demo runs fully client-side</p>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, LogOut, Menu, X, GraduationCap, CheckCheck, CalendarCheck2, Bus,
  Award, Wallet, CalendarDays, MessageSquareText, BookOpen, ShieldAlert,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Notice, Role, ROLE_META } from "@/lib/data";
import { Avatar, Badge, Btn } from "./ui";

export interface NavItem { id: string; label: string; icon: React.ReactNode; badge?: number }

const NOTICE_ICON: Record<Notice["icon"], React.ReactNode> = {
  attendance: <CalendarCheck2 size={15} className="text-cyan-300" />,
  journey: <Bus size={15} className="text-amber-300" />,
  grade: <Award size={15} className="text-emerald-300" />,
  fee: <Wallet size={15} className="text-rose-300" />,
  leave: <CalendarDays size={15} className="text-violet-300" />,
  system: <ShieldAlert size={15} className="text-slate-300" />,
  message: <MessageSquareText size={15} className="text-sky-300" />,
  diary: <BookOpen size={15} className="text-pink-300" />,
};

export function useRoleGuard(role: Role) {
  const { user, ready } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.role !== role) router.replace(ROLE_META[user.role].path);
  }, [ready, user, role, router]);
  return ready && user?.role === role;
}

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed bottom-5 right-5 z-[120] flex flex-col gap-2.5 w-[320px] max-w-[calc(100vw-40px)]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} layout initial={{ opacity: 0, x: 60, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="glass-strong rounded-xl p-3.5 flex items-start gap-3 cursor-pointer" onClick={() => dismissToast(t.id)}>
            <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${t.tone === "ok" ? "bg-emerald-400" : t.tone === "warn" ? "bg-amber-400" : "bg-sky-400"}`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">{t.title}</p>
              {t.body && <p className="text-xs text-slate-400 mt-0.5">{t.body}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function BellMenu({ role, accent }: { role: Role; accent: string }) {
  const { notices, markNoticesRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mine = useMemo(() => notices.filter((n) => n.role === role), [notices, role]);
  const unread = mine.filter((n) => !n.read).length;
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="relative w-10 h-10 rounded-xl glass-soft grid place-items-center text-slate-300 hover:text-white transition">
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold grid place-items-center text-[#06090f]" style={{ background: accent }}>
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }} className="absolute right-0 top-12 w-[340px] glass-strong rounded-2xl overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <span className="text-sm font-semibold text-white">Notifications</span>
              <button onClick={() => markNoticesRead(role)} className="text-[11px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1"><CheckCheck size={12} /> Mark all read</button>
            </div>
            <div className="max-h-[380px] overflow-y-auto">
              {mine.length === 0 && <p className="text-xs text-slate-500 p-5 text-center">All caught up.</p>}
              {mine.slice(0, 12).map((n) => (
                <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-white/5 ${n.read ? "opacity-55" : ""}`}>
                  <div className="w-8 h-8 rounded-lg glass-soft grid place-items-center shrink-0">{NOTICE_ICON[n.icon]}</div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white leading-snug">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{n.body}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
                  </div>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accent }} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardShell({ role, nav, active, onNav, title, subtitle, children, right }: {
  role: Role; nav: NavItem[]; active: string; onNav: (id: string) => void;
  title: string; subtitle?: string; children: React.ReactNode; right?: React.ReactNode;
}) {
  const { user, logout } = useApp();
  const router = useRouter();
  const meta = ROLE_META[role];
  const [mobileNav, setMobileNav] = useState(false);
  const allowed = useRoleGuard(role);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (!allowed) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#06090f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center animate-pulse-soft">
            <GraduationCap size={22} className="text-white" />
          </div>
          <p className="text-sm text-slate-400">Preparing your workspace…</p>
        </div>
      </div>
    );
  }

  const navList = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {nav.map((n) => (
        <button key={n.id} onClick={() => { onNav(n.id); setMobileNav(false); }}
          className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 ${active === n.id ? "text-white" : "text-slate-400 hover:text-slate-200"}`}>
          {active === n.id && (
            <motion.span layoutId={`nav-${role}`} transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="absolute inset-0 rounded-xl" style={{ background: `${meta.accent}17`, border: `1px solid ${meta.accent}40`, boxShadow: `inset 0 0 20px ${meta.accent}10` }} />
          )}
          <span className="relative z-10" style={{ color: active === n.id ? meta.accent : undefined }}>{n.icon}</span>
          <span className="relative z-10 flex-1 text-left">{n.label}</span>
          {n.badge ? <span className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: `${meta.accent}26`, color: meta.accent }}>{n.badge}</span> : null}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-200">
      {/* ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[500px] h-[500px] -top-40 -left-40" style={{ background: `${meta.accent}14` }} />
        <div className="orb w-[420px] h-[420px] bottom-[-160px] right-[-120px]" style={{ background: "rgba(99,102,241,.1)" }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      {/* sidebar — desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[248px] flex-col border-r border-white/6 bg-[#080c15]/80 backdrop-blur-2xl z-40">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 grid place-items-center shadow-lg shadow-indigo-500/30">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-[15px] text-white leading-none">EduNova <span style={{ color: meta.accent }}>OS</span></p>
              <p className="text-[10px] text-slate-500 mt-1">{meta.label} workspace</p>
            </div>
          </div>
        </div>
        {navList}
        <div className="p-3 border-t border-white/6">
          <div className="glass-soft rounded-xl p-3 flex items-center gap-3">
            <Avatar name={user!.name} id={user!.id} size={36} ring />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">{user!.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user!.title}</p>
            </div>
            <button onClick={() => { logout(); router.push("/login"); }} title="Sign out" className="w-8 h-8 rounded-lg grid place-items-center text-slate-500 hover:text-rose-300 hover:bg-rose-400/10 transition">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileNav(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] flex flex-col bg-[#0a0f1a] border-r border-white/8 z-50 lg:hidden">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center"><GraduationCap size={18} className="text-white" /></div>
                  <p className="font-display font-bold text-white">EduNova OS</p>
                </div>
                <button onClick={() => setMobileNav(false)} className="text-slate-400"><X size={18} /></button>
              </div>
              {navList}
              <div className="p-3 border-t border-white/6">
                <Btn variant="ghost" className="w-full" icon={<LogOut size={14} />} onClick={() => { logout(); router.push("/login"); }}>Sign out</Btn>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* main column */}
      <div className="lg:pl-[248px] relative z-10">
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#06090f]/75 border-b border-white/6">
          <div className="flex items-center gap-3 px-4 md:px-7 h-[64px] max-w-[1560px] mx-auto">
            <button onClick={() => setMobileNav(true)} className="lg:hidden w-10 h-10 rounded-xl glass-soft grid place-items-center text-slate-300"><Menu size={17} /></button>
            <div className="min-w-0">
              <motion.h1 key={title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display font-semibold text-white text-[15px] md:text-lg leading-tight truncate">{title}</motion.h1>
              {subtitle && <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>}
            </div>
            <div className="flex-1" />
            <div className="hidden md:flex items-center gap-2 glass-soft rounded-xl px-3.5 py-2.5 w-[240px] text-slate-500">
              <Search size={14} />
              <input placeholder="Search anything…" className="bg-transparent outline-none text-[13px] text-white placeholder:text-slate-600 w-full" />
              <kbd className="text-[9px] border border-white/10 rounded px-1 py-0.5">⌘K</kbd>
            </div>
            <div className="hidden xl:block text-right mr-1">
              <p className="text-[11px] font-medium text-slate-300">{today}</p>
              <p className="text-[10px] text-slate-500">Academic year 2025–26 · Term 2</p>
            </div>
            <BellMenu role={role} accent={meta.accent} />
            <div className="hidden sm:block"><Avatar name={user!.name} id={user!.id} size={38} ring /></div>
          </div>
        </header>

        <main className="px-4 md:px-7 py-6 max-w-[1560px] mx-auto pb-24">
          {right && <div className="mb-4 flex justify-end">{right}</div>}
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toasts />
    </div>
  );
}

"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AttRecord, AttStatus, CalEvent, Candidate, DiaryEntry, FeePlan, FEE_PLANS, Invoice, Journey,
  LeaveReq, Notice, PayRecord, Role, Student, STUDENTS, Submission, SEED_SUBMISSIONS, TaskItem,
  Thread, USERS, seedAttendance, seedCandidates, seedDiary, seedEvents, seedInvoices, seedJourneys,
  seedLeaves, seedNotices, seedPayroll, seedTasks, seedThreads, todayISO, SEED_GRADES, GradeRow,
  GRADE_DIST, COURSES, Course, QuizQ, CANNED_REPLIES,
} from "./data";

export interface Toast { id: number; title: string; body?: string; tone: "ok" | "info" | "warn" }

interface AppState {
  ready: boolean;
  user: { id: string; name: string; email: string; title: string; role: Role } | null;
  attendance: AttRecord[];
  journeys: Journey[];
  diary: DiaryEntry[];
  tasks: TaskItem[];
  events: CalEvent[];
  invoices: Invoice[];
  payroll: PayRecord[];
  leaves: LeaveReq[];
  candidates: Candidate[];
  notices: Notice[];
  threads: Thread[];
  submissions: Submission[];
  grades: GradeRow[];
  enrolledExtra: string[]; // course ids the demo student enrolled into this session
  completedLessons: string[];
  courses: Course[];
  feePlans: FeePlan[];
  toasts: Toast[];
}

interface Actions {
  login: (role: Role) => void;
  logout: () => void;
  toast: (title: string, body?: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: number) => void;
  // attendance & journey
  selfMarkAttendance: (studentId: string) => void;
  approveAttendance: (ids: string[], approver: string) => void;
  quickMark: (studentId: string, status: AttStatus, approver: string) => void;
  markLeftHome: (studentId: string) => void;
  notifyArrival: (studentId: string, teacher: string) => void;
  // diary & tasks
  addDiary: (e: Omit<DiaryEntry, "id">) => void;
  toggleTask: (id: string) => void;
  addTask: (label: string) => void;
  // learning
  completeLesson: (lessonId: string) => void;
  enroll: (courseId: string) => void;
  submitAssignment: (assignmentId: string, text: string) => void;
  gradeSubmission: (subId: string, grade: number, feedback: string) => void;
  publishCourse: (courseId: string) => void;
  decideCurriculum: (courseId: string, ok: boolean) => void;
  // finance
  payInvoice: (id: string) => void;
  runPayroll: (ids: string[]) => void;
  // hr
  decideLeave: (id: string, ok: boolean, note?: string) => void;
  advanceCandidate: (id: string) => void;
  allocateSeats: (schoolId: string, delta: number) => void;
  // comms
  sendMessage: (threadId: string, text: string) => void;
  markNoticesRead: (role: Role) => void;
  addEvent: (e: Omit<CalEvent, "id">) => void;
}

const Ctx = createContext<(AppState & Actions) | null>(null);
const LS_KEY = "edunova-os-v3";
let toastSeq = 1;

const nowTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

function freshState(): Omit<AppState, "ready" | "toasts"> {
  return {
    user: null,
    attendance: seedAttendance(),
    journeys: seedJourneys(),
    diary: seedDiary(),
    tasks: seedTasks(),
    events: seedEvents(),
    invoices: seedInvoices(),
    payroll: seedPayroll(),
    leaves: seedLeaves(),
    candidates: seedCandidates(),
    notices: seedNotices(),
    threads: seedThreads(),
    submissions: SEED_SUBMISSIONS,
    grades: SEED_GRADES,
    enrolledExtra: [],
    completedLessons: ["crs1:l1", "crs1:l2", "crs1:l3", "crs1:l4"],
    courses: COURSES,
    feePlans: FEE_PLANS,
  };
}

let idSeq = 5000;
const nid = (p: string) => `${p}${++idSeq}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ ready: false, toasts: [], ...freshState() });
  const hydrated = useRef(false);

  // hydrate from localStorage (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setState((s) => ({ ...s, ...saved, ready: true, toasts: [] }));
      } else {
        setState((s) => ({ ...s, ready: true }));
      }
    } catch {
      setState((s) => ({ ...s, ready: true }));
    }
    hydrated.current = true;
  }, []);

  // ensure "today" rows exist whenever date rolls over
  useEffect(() => {
    if (!state.ready) return;
    setState((s) => {
      const t = todayISO();
      const missing = STUDENTS.filter((st) => !s.attendance.some((a) => a.studentId === st.id && a.date === t));
      if (!missing.length) return s;
      return {
        ...s,
        attendance: [...s.attendance, ...missing.map((m) => ({ id: nid("att"), studentId: m.id, date: t, status: "unmarked" as AttStatus }))],
        journeys: [...s.journeys, ...missing.filter((m) => m.parentId === "par1").map((m) => ({ id: nid("jrn"), studentId: m.id, date: t }))],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ready]);

  // persist
  useEffect(() => {
    if (!state.ready) return;
    const { toasts, ready, ...rest } = state;
    try { localStorage.setItem(LS_KEY, JSON.stringify(rest)); } catch {}
  }, [state]);

  const dismissToast = useCallback((id: number) => setState((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) })), []);
  const toast = useCallback((title: string, body?: string, tone: Toast["tone"] = "ok") => {
    const id = toastSeq++;
    setState((s) => ({ ...s, toasts: [...s.toasts.slice(-3), { id, title, body, tone }] }));
    setTimeout(() => setState((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) })), 4200);
  }, []);

  const pushNotice = useCallback((role: Role, icon: Notice["icon"], title: string, body: string) => {
    setState((s) => ({ ...s, notices: [{ id: nid("n"), role, icon, title, body, time: nowTime(), read: false }, ...s.notices] }));
  }, []);

  // ─── auth ─────────────────────────────
  const login = useCallback((role: Role) => {
    const u = USERS[role];
    setState((s) => ({ ...s, user: { ...u, role } }));
  }, []);
  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), []);

  // ─── attendance & journey ─────────────
  const selfMarkAttendance = useCallback((studentId: string) => {
    const t = todayISO();
    setState((s) => ({
      ...s,
      attendance: s.attendance.map((a) =>
        a.studentId === studentId && a.date === t ? { ...a, status: "pending", markedAt: nowTime() } : a),
    }));
    const st = STUDENTS.find((x) => x.id === studentId);
    pushNotice("instructor", "attendance", `${st?.name ?? "Student"} self-marked`, "Waiting for your approval in Attendance Desk.");
    toast("Attendance marked", "Your teacher will confirm on arrival check-in.", "info");
  }, [pushNotice, toast]);

  const approveAttendance = useCallback((ids: string[], approver: string) => {
    setState((s) => ({ ...s, attendance: s.attendance.map((a) => (ids.includes(a.id) ? { ...a, status: "approved", approvedBy: approver } : a)) }));
    // journey arrival for any par1 child among them
    setState((s) => {
      const t = todayISO();
      const kids = s.attendance.filter((a) => ids.includes(a.id)).map((a) => a.studentId);
      let journeys = s.journeys;
      kids.forEach((sid) => {
        const st = STUDENTS.find((x) => x.id === sid);
        if (st?.parentId === "par1") {
          journeys = journeys.map((j) => (j.studentId === sid && j.date === t ? { ...j, arrivedAt: j.arrivedAt ?? nowTime() } : j));
          pushNotice("parent", "journey", `${st.name.split(" ")[0]} reached school`, `Confirmed by ${approver}. Attendance approved.`);
        }
        if (sid === "stu1") pushNotice("student", "attendance", "Attendance approved", `Confirmed by ${approver}.`);
      });
      return { ...s, journeys };
    });
    toast("Attendance approved", `${ids.length} record${ids.length > 1 ? "s" : ""} confirmed.`, "ok");
  }, [pushNotice, toast]);

  const quickMark = useCallback((studentId: string, status: AttStatus, approver: string) => {
    const t = todayISO();
    setState((s) => ({ ...s, attendance: s.attendance.map((a) => (a.studentId === studentId && a.date === t ? { ...a, status, approvedBy: approver, markedAt: a.markedAt ?? nowTime() } : a)) }));
  }, []);

  const markLeftHome = useCallback((studentId: string) => {
    const t = todayISO();
    setState((s) => ({ ...s, journeys: s.journeys.map((j) => (j.studentId === studentId && j.date === t ? { ...j, leftHomeAt: nowTime() } : j)) }));
    const st = STUDENTS.find((x) => x.id === studentId);
    pushNotice("instructor", "journey", `${st?.name} left home`, "The family marked departure — confirm on arrival.");
    toast(`${st?.name.split(" ")[0]} marked as left home`, "The school has been notified.", "info");
  }, [pushNotice, toast]);

  const notifyArrival = useCallback((studentId: string, teacher: string) => {
    const t = todayISO();
    setState((s) => ({ ...s, journeys: s.journeys.map((j) => (j.studentId === studentId && j.date === t ? { ...j, arrivedAt: nowTime() } : j)) }));
    const st = STUDENTS.find((x) => x.id === studentId);
    pushNotice("parent", "journey", `${st?.name.split(" ")[0]} reached school`, `Safely checked in — confirmed by ${teacher}.`);
    toast("Arrival notification sent", `${st?.name}'s family has been alerted.`, "ok");
  }, [pushNotice, toast]);

  // ─── diary & tasks ────────────────────
  const addDiary = useCallback((e: Omit<DiaryEntry, "id">) => {
    setState((s) => ({ ...s, diary: [{ ...e, id: nid("d") }, ...s.diary] }));
    toast("Diary entry saved", "Today's record has been added to the diary.");
  }, [toast]);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  }, []);
  const addTask = useCallback((label: string) => {
    setState((s) => ({ ...s, tasks: [...s.tasks, { id: nid("tsk"), studentId: "stu1", label, done: false, source: "self", due: todayISO() }] }));
  }, []);

  // ─── learning ─────────────────────────
  const completeLesson = useCallback((lessonId: string) => {
    setState((s) => (s.completedLessons.includes(lessonId) ? s : { ...s, completedLessons: [...s.completedLessons, lessonId] }));
    toast("Lesson complete", "Progress synced to your learning record.");
  }, [toast]);
  const enroll = useCallback((courseId: string) => {
    setState((s) => (s.enrolledExtra.includes(courseId) ? s : { ...s, enrolledExtra: [...s.enrolledExtra, courseId] }));
    const c = COURSES.find((x) => x.id === courseId);
    toast("Enrolled successfully", `Welcome to ${c?.title}. First module unlocked.`);
  }, [toast]);
  const submitAssignment = useCallback((assignmentId: string, text: string) => {
    setState((s) => ({
      ...s,
      submissions: [{ id: nid("sub"), assignmentId, studentId: "stu1", status: "submitted", submittedAt: todayISO(), text }, ...s.submissions.filter((x) => !(x.assignmentId === assignmentId && x.studentId === "stu1"))],
    }));
    pushNotice("instructor", "grade", "New submission", "Aarav Rahman submitted work for grading.");
    toast("Assignment submitted", "Your instructor has been notified.");
  }, [pushNotice, toast]);
  const gradeSubmission = useCallback((subId: string, grade: number, feedback: string) => {
    setState((s) => ({ ...s, submissions: s.submissions.map((x) => (x.id === subId ? { ...x, status: "graded", grade, feedback } : x)) }));
    pushNotice("student", "grade", "Work graded", `New graded feedback is in your Grade Book.`);
    toast("Grade published", "Student and grade book updated.", "ok");
  }, [pushNotice, toast]);
  const publishCourse = useCallback((courseId: string) => {
    setState((s) => ({ ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, status: "pending" } : c)) }));
    pushNotice("admin", "system", "Curriculum approval requested", "A course awaits review in Curriculum Approval.");
    toast("Submitted for approval", "The district office will review this course.", "info");
  }, [pushNotice, toast]);
  const decideCurriculum = useCallback((courseId: string, ok: boolean) => {
    setState((s) => ({ ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, status: ok ? "published" : "draft" } : c)) }));
    toast(ok ? "Course approved & published" : "Course returned for revision", ok ? "It is now live in the catalog." : "The instructor has been notified.", ok ? "ok" : "warn");
  }, [toast]);

  // ─── finance & HR ─────────────────────
  const payInvoice = useCallback((id: string) => {
    setState((s) => ({ ...s, invoices: s.invoices.map((i) => (i.id === id ? { ...i, status: "paid", paidOn: todayISO() } : i)) }));
    toast("Payment successful", "Receipt emailed to the family account.");
  }, [toast]);
  const runPayroll = useCallback((ids: string[]) => {
    setState((s) => ({ ...s, payroll: s.payroll.map((p) => (ids.includes(p.id) ? { ...p, status: "paid", paidOn: todayISO() } : p)) }));
    toast("Payroll processed", `${ids.length} salary run${ids.length > 1 ? "s" : ""} disbursed via direct deposit.`);
  }, [toast]);
  const decideLeave = useCallback((id: string, ok: boolean, note?: string) => {
    setState((s) => ({ ...s, leaves: s.leaves.map((l) => (l.id === id ? { ...l, status: ok ? "approved" : "rejected", note } : l)) }));
    toast(ok ? "Leave approved" : "Leave declined", "The teacher has been notified instantly.", ok ? "ok" : "warn");
  }, [toast]);
  const advanceCandidate = useCallback((id: string) => {
    setState((s) => ({ ...s, candidates: s.candidates.map((c) => (c.id === id && c.stage < 4 ? { ...c, stage: c.stage + 1 } : c)) }));
  }, []);
  const allocateSeats = useCallback((_schoolId: string, _delta: number) => {
    toast("License seats updated", "Allocation synced across the district directory.", "info");
  }, [toast]);

  // ─── comms ────────────────────────────
  const sendMessage = useCallback((threadId: string, text: string) => {
    setState((s) => ({ ...s, threads: s.threads.map((t) => (t.id === threadId ? { ...t, msgs: [...t.msgs, { from: "me", text, ts: "Just now" }] } : t)) }));
    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
      setState((s) => ({ ...s, threads: s.threads.map((t) => (t.id === threadId ? { ...t, msgs: [...t.msgs, { from: "them", text: reply, ts: "Just now" }] } : t)) }));
    }, 1400);
  }, []);
  const markNoticesRead = useCallback((role: Role) => {
    setState((s) => ({ ...s, notices: s.notices.map((n) => (n.role === role ? { ...n, read: true } : n)) }));
  }, []);
  const addEvent = useCallback((e: Omit<CalEvent, "id">) => {
    setState((s) => ({ ...s, events: [...s.events, { ...e, id: nid("ev") }] }));
    toast("Event published", "Added to every calendar across the district.");
  }, [toast]);

  const value = useMemo<AppState & Actions>(() => ({
    ...state, login, logout, toast, dismissToast,
    selfMarkAttendance, approveAttendance, quickMark, markLeftHome, notifyArrival,
    addDiary, toggleTask, addTask, completeLesson, enroll, submitAssignment, gradeSubmission,
    publishCourse, decideCurriculum, payInvoice, runPayroll, decideLeave, advanceCandidate,
    allocateSeats, sendMessage, markNoticesRead, addEvent,
  }), [state, login, logout, toast, dismissToast, selfMarkAttendance, approveAttendance, quickMark, markLeftHome, notifyArrival, addDiary, toggleTask, addTask, completeLesson, enroll, submitAssignment, gradeSubmission, publishCourse, decideCurriculum, payInvoice, runPayroll, decideLeave, advanceCandidate, allocateSeats, sendMessage, markNoticesRead, addEvent]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const studentById = (id: string): Student | undefined => STUDENTS.find((s) => s.id === id);
export const quizGradeLabel = (pct: number) => (pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : "D");
export function courseProgress(course: Course, completed: string[]) {
  const lessons = course.modules.flatMap((m) => m.lessons);
  const done = lessons.filter((l) => completed.includes(`${course.id}:${l.id}`)).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}
export type { QuizQ };
export { GRADE_DIST };

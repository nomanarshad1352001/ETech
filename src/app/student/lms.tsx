"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, ChevronDown, Clock3, Compass,
  FileText, GraduationCap, Layers, Lock, Play, Pause, Rocket, Star, UploadCloud, Users,
  CircleCheck, Award, FlaskConical, PenTool, HelpCircle, BookMarked,
} from "lucide-react";
import { useApp, courseProgress } from "@/lib/store";
import { ASSIGNMENTS, Assignment, Course, Lesson, QUIZ_BANK, TEACHERS, fmtDate, rel } from "@/lib/data";
import { Badge, Btn, Card, Field, Modal, Progress, SectionTitle, Textarea, Counter } from "@/components/ui";
import { Donut, AreaChart } from "@/components/charts";
import { CertificateCard } from "@/components/widgets";
import { QuizGenerator, AIReportPanel, PersonalizedSyllabus, TestPlanner } from "@/components/ai";
import { ThreadChat } from "@/components/chat";

const LESSON_ICON: Record<Lesson["type"], React.ReactNode> = {
  video: <Play size={13} />, reading: <BookMarked size={13} />, interactive: <FlaskConical size={13} />, quiz: <HelpCircle size={13} />,
};
const ASG_ICON: Record<Assignment["type"], React.ReactNode> = {
  homework: <PenTool size={15} />, lab: <FlaskConical size={15} />, essay: <FileText size={15} />, quiz: <HelpCircle size={15} />, capstone: <Rocket size={15} />,
};

// ─── Courses view (catalog + detail + lesson player) ────────
export function CoursesView() {
  const { courses, completedLessons, completeLesson, enroll, enrolledExtra, submissions, toast } = useApp();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lessonKey, setLessonKey] = useState<string | null>(null); // courseId:lessonId
  const published = courses.filter((c) => c.status === "published");
  const isEnrolled = (c: Course) => c.enrolled.includes("stu1") || enrolledExtra.includes(c.id);
  const mine = published.filter(isEnrolled);
  const discover = published.filter((c) => !isEnrolled(c));
  const course = courses.find((c) => c.id === courseId) ?? null;

  // ── lesson player ──
  if (course && lessonKey) {
    const lesson = course.modules.flatMap((m) => m.lessons).find((l) => `${course.id}:${l.id}` === lessonKey);
    if (lesson) return <LessonPlayer course={course} lesson={lesson} onBack={() => setLessonKey(null)} onDone={() => {
      completeLesson(lessonKey);
      const all = course.modules.flatMap((m) => m.lessons).map((l) => `${course.id}:${l.id}`);
      const idx = all.indexOf(lessonKey);
      const next = all.slice(idx + 1).find((k) => !completedLessons.includes(k));
      setLessonKey(next ?? null);
    }} />;
  }

  // ── course detail ──
  if (course) {
    const prog = courseProgress(course, completedLessons);
    const allDone = prog.pct === 100;
    const capAsg = ASSIGNMENTS.find((a) => a.courseId === course.id && a.type === "capstone");
    const capSub = submissions.find((s) => s.assignmentId === capAsg?.id && s.studentId === "stu1");
    return (
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
        <button onClick={() => setCourseId(null)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"><ArrowLeft size={13} /> All courses</button>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: course.color }} />
          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex gap-2 flex-wrap"><Badge tone="violet">{course.subject}</Badge><Badge tone="slate">{course.gradeBand}</Badge><Badge tone="cyan">{course.weeks} weeks</Badge></div>
              <h2 className="font-display font-bold text-white text-2xl md:text-3xl mt-3">{course.title}</h2>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><Star size={12} className="text-amber-300" /> {course.rating}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {course.enrolled.length + 24} learners</span>
                <span className="flex items-center gap-1"><Layers size={12} /> {prog.total} lessons</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Donut value={prog.pct} size={84} color={course.color} label={`${prog.pct}%`} sub={`${prog.done}/${prog.total}`} />
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-5">
          <div className="space-y-4">
            {course.modules.map((m, mi) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mi * 0.08 }}>
                <Card className="p-5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Module {mi + 1}</p>
                  <h3 className="font-display font-semibold text-white mt-1 mb-3.5">{m.title}</h3>
                  <div className="space-y-2">
                    {m.lessons.map((l) => {
                      const key = `${course.id}:${l.id}`;
                      const done = completedLessons.includes(key);
                      return (
                        <button key={l.id} onClick={() => setLessonKey(key)}
                          className="w-full flex items-center gap-3.5 p-3 rounded-xl border border-white/6 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.045] transition-all group text-left">
                          <span className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${done ? "bg-emerald-400/15 text-emerald-300" : "bg-white/6 text-slate-400 group-hover:text-white"}`}>
                            {done ? <CircleCheck size={16} /> : LESSON_ICON[l.type]}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className={`block text-[13px] font-medium ${done ? "text-slate-400" : "text-white"}`}>{l.title}</span>
                            <span className="text-[10px] text-slate-500 capitalize">{l.type} · {l.dur} min</span>
                          </span>
                          <span className={`text-[11px] font-medium flex items-center gap-1 ${done ? "text-emerald-300" : "text-indigo-300"}`}>
                            {done ? "Review" : "Start"} <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            <Card className={`p-5 relative overflow-hidden ${allDone ? "" : "opacity-90"}`}>
              <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-3xl" style={{ background: `${course.color}30` }} />
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: `${course.color}1e`, color: course.color }}><Rocket size={16} /></span>
                <div>
                  <p className="text-sm font-semibold text-white">Capstone Project</p>
                  <p className="text-[10px] text-slate-500">{course.capstone.points} points · verified credential</p>
                </div>
                {!allDone && <Lock size={15} className="ml-auto text-slate-500" />}
              </div>
              <p className="text-[13px] font-medium text-slate-200">{course.capstone.title}</p>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{course.capstone.brief}</p>
              <div className="mt-4">
                {capSub?.status === "graded" ? (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/25 p-3.5">
                    <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5"><CheckCircle2 size={13} /> Graded {capSub.grade}/{course.capstone.points} — certificate unlocked</p>
                    <p className="text-[11px] text-slate-400 mt-1">{capSub.feedback}</p>
                  </div>
                ) : allDone ? (
                  <Btn className="w-full" icon={<UploadCloud size={15} />} onClick={() => toast("Capstone submission opened", "Upload your report in the Assignments tab.", "info")}>Submit capstone</Btn>
                ) : (
                  <div>
                    <Progress value={prog.pct} color={course.color} height={6} />
                    <p className="text-[10px] text-slate-500 mt-2">Complete all {prog.total} lessons to unlock · {prog.total - prog.done} remaining</p>
                  </div>
                )}
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-sm font-semibold text-white mb-3">Your instructor</p>
              <InstructorChip teacherId={course.teacherId} />
            </Card>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── catalog ──
  return (
    <div className="space-y-8">
      <div>
        <SectionTitle icon={<BookOpenCheck size={16} />} title="My Courses" sub="Pick up exactly where you left off" />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mine.map((c, i) => {
            const p = courseProgress(c, completedLessons);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card hover className="p-5 h-full relative overflow-hidden" onClick={() => setCourseId(c.id)}>
                  <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20" style={{ background: c.color }} />
                  <div className="flex items-center justify-between">
                    <Badge tone="violet">{c.subject}</Badge>
                    <span className="text-[11px] text-amber-300 flex items-center gap-1"><Star size={11} /> {c.rating}</span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-[17px] mt-3 leading-snug">{c.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1.5">{p.done} of {p.total} lessons · {c.weeks}-week course</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={p.pct} color={c.color} height={7} className="flex-1" />
                    <span className="text-xs font-semibold text-white w-9 text-right">{p.pct}%</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <InstructorMini teacherId={c.teacherId} />
                    <span className="text-[11px] font-medium text-indigo-300 flex items-center gap-1">{p.pct === 100 ? "Review" : "Continue"} <ArrowRight size={11} /></span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div>
        <SectionTitle icon={<Compass size={16} />} title="Course Discovery" sub="New electives open for enrollment this term" />
        <div className="grid md:grid-cols-2 gap-4">
          {discover.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 relative overflow-hidden" hover>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-15" style={{ background: c.color }} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex gap-2"><Badge tone="cyan">{c.subject}</Badge><Badge tone="slate">{c.gradeBand}</Badge></div>
                    <h3 className="font-display font-semibold text-white text-[17px] mt-2.5">{c.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1.5">{c.modules.flatMap((m) => m.lessons).length} lessons · capstone {c.capstone.points} pts</p>
                  </div>
                  <Btn size="sm" variant="outline" onClick={() => enroll(c.id)}>Enroll free</Btn>
                </div>
              </Card>
            </motion.div>
          ))}
          {!discover.length && <Card className="p-8 text-center text-slate-500 text-sm md:col-span-2">You're enrolled in everything available this term. Impressive.</Card>}
        </div>
      </div>
    </div>
  );
}

function InstructorMini({ teacherId }: { teacherId: string }) {
  const t = TEACHERS.find((x) => x.id === teacherId);
  if (!t) return null;
  return <span className="flex items-center gap-2 text-[11px] text-slate-400"><span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-[9px] font-bold text-white">{t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>{t.name}</span>;
}
function InstructorChip({ teacherId }: { teacherId: string }) {
  const t = TEACHERS.find((x) => x.id === teacherId);
  const { threads } = useApp();
  if (!t) return null;
  return (
    <div className="flex items-center gap-3.5">
      <span className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-sm font-bold text-white ring-2 ring-white/15">{t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{t.name}</p>
        <p className="text-[11px] text-slate-500">{t.subject} · {t.experience} yrs · ★ {t.rating}</p>
      </div>
    </div>
  );
}

// ─── Lesson player ──────────────────────────────────────────
function LessonPlayer({ course, lesson, onBack, onDone }: { course: Course; lesson: Lesson; onBack: () => void; onDone: () => void }) {
  const { completedLessons, toast } = useApp();
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const already = completedLessons.includes(`${course.id}:${lesson.id}`);
  React.useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPct((p) => {
      if (p >= 100) { setPlaying(false); return 100; }
      return p + 4;
    }), 220);
    return () => clearInterval(t);
  }, [playing]);
  const quizQs = QUIZ_BANK[`${course.subject === "Mathematics" ? "Algebra" : course.subject === "Computer Science" ? "Computer Science" : course.subject} — ${course.subject === "Mathematics" ? "Functions" : course.subject === "Physics" ? "Mechanics" : course.subject === "History" ? "20th Century" : course.subject === "Computer Science" ? "Python" : "Organic"}`] ?? QUIZ_BANK["Algebra — Functions"];
  const isQuiz = lesson.type === "quiz";
  const canFinish = !isQuiz || Object.keys(answers).length >= 3;
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"><ArrowLeft size={13} /> {course.title}</button>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="space-y-5">
          {/* mock player */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video grid place-items-center" style={{ background: `radial-gradient(ellipse at 30% 20%, ${course.color}33, transparent 60%), linear-gradient(140deg, #0b1120, #070b14)` }}>
              <div className="absolute inset-0 grid-bg opacity-40" />
              {lesson.type === "video" || lesson.type === "interactive" ? (
                <>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => { setPlaying((p) => !p); if (pct >= 100) setPct(0); }}
                    className="relative z-10 w-20 h-20 rounded-full grid place-items-center text-white shadow-2xl"
                    style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}88)`, boxShadow: `0 0 60px ${course.glow}` }}>
                    {playing ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                  </motion.button>
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ width: `${pct}%`, background: course.color }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span>{Math.round((pct / 100) * lesson.dur)}:{String(Math.floor((pct * 2.7) % 60)).padStart(2, "0")} min</span>
                      <span>{lesson.dur}:00 min · 1080p</span>
                    </div>
                  </div>
                </>
              ) : lesson.type === "reading" ? (
                <div className="relative z-10 max-w-md px-8 text-center">
                  <BookMarked size={30} className="mx-auto mb-4" style={{ color: course.color }} />
                  <p className="font-display text-white font-semibold">Interactive reading</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{lesson.summary}</p>
                </div>
              ) : (
                <div className="relative z-10 text-center px-8">
                  <HelpCircle size={30} className="mx-auto mb-4" style={{ color: course.color }} />
                  <p className="font-display text-white font-semibold">Adaptive checkpoint</p>
                  <p className="text-xs text-slate-400 mt-2">Answer all items below to clear this lesson.</p>
                </div>
              )}
            </div>
          </Card>
          {isQuiz && (
            <Card className="p-5 space-y-3">
              { (quizQs.slice(0, 3)).map((q, i) => (
                <div key={i} className="glass-soft rounded-xl p-4">
                  <p className="text-[13px] font-medium text-white">{i + 1}. {q.q}</p>
                  <div className="grid sm:grid-cols-2 gap-2 mt-3">
                    {q.options.map((o, j) => (
                      <button key={j} onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                        className={`text-left text-xs px-3 py-2.5 rounded-lg border transition ${answers[i] === j ? "border-cyan-400/60 bg-cyan-400/10 text-white" : "border-white/10 text-slate-400 hover:border-white/25"}`}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          )}
          <div className="flex justify-end">
            <Btn icon={<CircleCheck size={15} />} disabled={!canFinish} onClick={() => { onDone(); }}>
              {already ? "Completed — next lesson" : "Mark complete & continue"}
            </Btn>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <Badge tone="cyan">{lesson.type} · {lesson.dur} min</Badge>
            <h2 className="font-display font-semibold text-white text-xl mt-3">{lesson.title}</h2>
            <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">{lesson.summary}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-white mb-3">What you'll master</p>
            <ul className="space-y-2.5">
              {lesson.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-xs text-slate-300"><CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" /> {p}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-white mb-2.5">Resources</p>
            {["Lesson slides (PDF)", "Practice set — 12 items", "Desmos / simulation link"].map((r) => (
              <button key={r} onClick={() => toast("Resource downloaded", r, "info")} className="w-full flex items-center gap-2.5 text-xs text-slate-300 hover:text-white py-2 border-b border-white/5 last:border-0 transition text-left">
                <FileText size={13} className="text-indigo-300" /> {r}
              </button>
            ))}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Assignments ────────────────────────────────────────────
export function AssignmentsView() {
  const { submissions, submitAssignment, enrolledExtra, courses } = useApp();
  const [open, setOpen] = useState<Assignment | null>(null);
  const [text, setText] = useState("");
  const enrolledIds = courses.filter((c) => c.enrolled.includes("stu1") || enrolledExtra.includes(c.id)).map((c) => c.id);
  const list = ASSIGNMENTS.filter((a) => enrolledIds.includes(a.courseId)).sort((a, b) => a.dueOffset - b.dueOffset);
  const mySub = (a: Assignment) => submissions.find((s) => s.assignmentId === a.id && s.studentId === "stu1");
  return (
    <div className="space-y-3.5">
      <SectionTitle icon={<FileText size={16} />} title="Assignments & Capstones" sub="Submit work, track grades and feedback" />
      {list.map((a, i) => {
        const c = courses.find((x) => x.id === a.courseId);
        const sub = mySub(a);
        const overdue = a.dueOffset < 0 && !sub;
        return (
          <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5 flex flex-wrap items-center gap-4">
              <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0" style={{ background: `${c?.color ?? "#818cf8"}1c`, color: c?.color ?? "#818cf8" }}>{ASG_ICON[a.type]}</span>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-semibold text-white">{a.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{c?.title} · {a.points} pts · due {fmtDate(rel(a.dueOffset))}</p>
              </div>
              <div className="flex items-center gap-3">
                {sub?.status === "graded" ? (
                  <div className="text-right">
                    <Badge tone="green">Graded · {sub.grade}/{a.points}</Badge>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[220px] truncate" title={sub.feedback}>{sub.feedback}</p>
                  </div>
                ) : sub?.status === "submitted" ? (
                  <Badge tone="amber" dot>Submitted — awaiting grade</Badge>
                ) : overdue ? (
                  <Badge tone="red">Overdue</Badge>
                ) : (
                  <Badge tone="slate">Not submitted</Badge>
                )}
                {sub?.status !== "graded" && (
                  <Btn size="sm" variant={sub ? "ghost" : "primary"} icon={<UploadCloud size={13} />} onClick={() => { setOpen(a); setText(sub?.text ?? ""); }}>
                    {sub ? "Resubmit" : "Submit work"}
                  </Btn>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
      <Modal open={!!open} onClose={() => setOpen(null)} title={`Submit — ${open?.title ?? ""}`}>
        <div className="space-y-4">
          <div className="rounded-xl bg-white/[0.03] border border-dashed border-white/15 p-8 text-center">
            <UploadCloud size={26} className="mx-auto text-indigo-300 mb-2" />
            <p className="text-xs text-slate-400">Drag files here or <span className="text-indigo-300 font-medium">browse</span> — PDF, DOCX, ZIP up to 50 MB</p>
            <p className="text-[10px] text-slate-600 mt-1">capstone_aarav_v3.pdf · 2.4 MB attached</p>
          </div>
          <Field label="Notes for your instructor">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Anything your teacher should know — approach, blockers, sources…" />
          </Field>
          <Btn className="w-full" onClick={() => { if (open) submitAssignment(open.id, text || "Submitted via portal"); setOpen(null); setText(""); }}>
            Submit for grading
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Grade book ─────────────────────────────────────────────
export function GradesView() {
  const { grades, courses } = useApp();
  const mine = grades.filter((g) => g.studentId === "stu1");
  const allItems = mine.flatMap((g) => g.items);
  const gpa = allItems.length ? (allItems.reduce((a, i) => a + (i.score / i.out) * 100, 0) / allItems.length) : 0;
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-5">
          <Donut value={gpa} size={96} color={gpa >= 85 ? "#34d399" : "#fbbf24"} label={`${gpa.toFixed(0)}%`} sub="overall" />
          <div>
            <p className="text-sm font-semibold text-white">Grade point standing</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">GPA 3.7 · Rank 4th of 32 in Grade 10-A. On distinction track.</p>
          </div>
        </Card>
        <Card className="p-5 md:col-span-2">
          <p className="text-sm font-semibold text-white mb-1">Term trend</p>
          <p className="text-[11px] text-slate-500 mb-3">Weighted score across the last 7 grading windows</p>
          <AreaChart data={[78, 81, 76, 84, 88, 85, 91]} labels={["W1", "W2", "W3", "W4", "W5", "W6", "W7"]} color="#22d3ee" height={150} format={(v) => v + "%"} />
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {mine.map((g, i) => {
          const c = courses.find((x) => x.id === g.courseId);
          const pct = Math.round((g.items.reduce((a, x) => a + x.score, 0) / g.items.reduce((a, x) => a + x.out, 0)) * 100);
          return (
            <motion.div key={g.courseId} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{c?.title}</p>
                    <p className="text-[10px] text-slate-500">{g.items.length} graded items</p>
                  </div>
                  <Badge tone={pct >= 85 ? "green" : pct >= 70 ? "cyan" : "amber"}>{pct}%</Badge>
                </div>
                <div className="space-y-2.5">
                  {g.items.map((it) => {
                    const p = Math.round((it.score / it.out) * 100);
                    return (
                      <div key={it.name} className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 w-44 truncate shrink-0">{it.name}</span>
                        <Progress value={p} color={p >= 85 ? "#34d399" : p >= 70 ? "#22d3ee" : "#fbbf24"} height={6} className="flex-1" />
                        <span className="text-[11px] text-slate-300 w-14 text-right shrink-0">{it.score}/{it.out}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AI Suite ───────────────────────────────────────────────
export function AISuiteView() {
  const [tool, setTool] = useState<"quiz" | "report" | "syllabus" | "planner">("quiz");
  const tools = [
    { id: "quiz" as const, label: "Quiz Generator" },
    { id: "report" as const, label: "AI Report" },
    { id: "syllabus" as const, label: "My Syllabus" },
    { id: "planner" as const, label: "Test Planner" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        {tools.map((t) => (
          <button key={t.id} onClick={() => setTool(t.id)}
            className={`relative px-4 py-2.5 rounded-xl text-xs font-medium transition ${tool === t.id ? "text-white" : "text-slate-400 hover:text-white glass-soft"}`}>
            {tool === t.id && <motion.span layoutId="ai-tool" className="absolute inset-0 rounded-xl bg-violet-500/20 border border-violet-400/50" />}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tool} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tool === "quiz" && <QuizGenerator role="student" />}
          {tool === "report" && <AIReportPanel who="student" />}
          {tool === "syllabus" && <PersonalizedSyllabus />}
          {tool === "planner" && <TestPlanner />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Certificates ───────────────────────────────────────────
export function CertificatesView() {
  const { submissions, courses } = useApp();
  const [view, setView] = useState(false);
  const earned = submissions.filter((s) => {
    if (s.studentId !== "stu1" || s.status !== "graded") return false;
    const a = ASSIGNMENTS.find((x) => x.id === s.assignmentId);
    return a?.type === "capstone";
  });
  return (
    <div className="space-y-5">
      <SectionTitle icon={<Award size={16} />} title="Verified Certificates" sub="Capstone-verified credentials, sealed & shareable" />
      <div className="grid md:grid-cols-2 gap-5">
        {earned.map((s, i) => {
          const a = ASSIGNMENTS.find((x) => x.id === s.assignmentId)!;
          const c = courses.find((x) => x.id === a.courseId)!;
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <CertificateCard student="Aarav Rahman" course={c.title} grade={`${s.grade}/${a.points} · Distinction`} date={fmtDate(s.submittedAt)} onView={() => setView(true)} />
            </motion.div>
          );
        })}
        <Card className="p-6 border-dashed grid place-items-center text-center min-h-[240px]">
          <div>
            <GraduationCap size={26} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-400">Next credential in progress</p>
            <p className="text-[11px] text-slate-600 mt-1.5">Finish "Advanced Algebra II" capstone (86% ready) to mint your second certificate.</p>
          </div>
        </Card>
      </div>
      <Modal open={view} onClose={() => setView(false)} title="Credential verification">
        <div className="text-center py-4 space-y-3">
          <Donut value={100} size={90} color="#34d399" label="✓" />
          <p className="font-display font-semibold text-white">Credential EDU-2026-08841 is valid</p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">Issued to Aarav Rahman for "World History: 1900–Present" capstone — anchored on the EduNova trust ledger, verifiable by any institution.</p>
        </div>
      </Modal>
    </div>
  );
}

// ─── Community ──────────────────────────────────────────────
export function CommunityView() {
  const { toast } = useApp();
  const groups = [
    { name: "Grade 10-A Study Circle", members: 12, topic: "Physics + Algebra cramming", joined: true },
    { name: "History Documentary Crew", members: 5, topic: "Capstone peer review", joined: true },
    { name: "Python Builders", members: 18, topic: "Weekly build challenges", joined: false },
    { name: "Debate & Discourse", members: 22, topic: "Inter-school prep", joined: false },
  ];
  const [joined, setJoined] = useState<Record<string, boolean>>({ "Grade 10-A Study Circle": true, "History Documentary Crew": true });
  return (
    <div className="space-y-6">
      <SectionTitle icon={<Users size={16} />} title="Messages & Peer Spaces" sub="Direct threads with teachers and study groups" />
      <ThreadChat role="student" accent="#22d3ee" />
      <div>
        <p className="font-display font-semibold text-white text-sm mb-3">Study groups</p>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {groups.map((g, i) => (
            <motion.div key={g.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="p-4" hover>
                <p className="text-[13px] font-semibold text-white leading-snug">{g.name}</p>
                <p className="text-[10px] text-slate-500 mt-1">{g.topic}</p>
                <div className="flex items-center justify-between mt-3.5">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1"><Users size={10} /> {g.members + (joined[g.name] ? 1 : 0)} members</span>
                  <Btn size="sm" variant={joined[g.name] ? "ghost" : "outline"} onClick={() => {
                    setJoined((j) => ({ ...j, [g.name]: !j[g.name] }));
                    toast(joined[g.name] ? `Left ${g.name}` : `Joined ${g.name}`, joined[g.name] ? undefined : "You'll get group updates in Messages.", "info");
                  }}>{joined[g.name] ? "Joined ✓" : "Join"}</Btn>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

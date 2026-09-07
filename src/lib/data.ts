// ─────────────────────────────────────────────────────────────
// EduNova OS — domain model & seeded operational dataset
// ─────────────────────────────────────────────────────────────

export type Role = "student" | "instructor" | "parent" | "admin";

export const pad = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** ISO date relative to today (0 = today, -1 = yesterday, +3 = in 3 days) */
export const rel = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return iso(d);
};
export const todayISO = () => rel(0);
export const fmtDate = (s: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(s + "T12:00:00").toLocaleDateString("en-US", opts ?? { month: "short", day: "numeric", weekday: "short" });
export const monthName = (offset = 0) => {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
export const money = (n: number) => "$" + n.toLocaleString("en-US");

export const AVATAR_TONES = [
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-fuchsia-500 to-purple-500",
  "from-sky-500 to-indigo-500",
  "from-lime-500 to-emerald-500",
];
export const toneOf = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return AVATAR_TONES[h % AVATAR_TONES.length];
};
export const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

// ─── Schools ────────────────────────────────────────────────
export interface School {
  id: string; name: string; short: string; city: string; color: string;
  principal: string; students: number; teachers: number; attendance: number;
  feeCollected: number; licenseSeats: number; usedSeats: number; depts: string[];
}
export const SCHOOLS: School[] = [
  { id: "sch1", name: "Northwood High School", short: "NWH", city: "Springfield", color: "#6366f1", principal: "Dr. Helen Marsh", students: 1240, teachers: 68, attendance: 94.2, feeCollected: 87, licenseSeats: 1400, usedSeats: 1240, depts: ["Mathematics", "Sciences", "Humanities", "Computer Science", "Arts"] },
  { id: "sch2", name: "Riverdale STEM Academy", short: "RSA", city: "Riverton", color: "#22d3ee", principal: "Prof. Alan Reyes", students: 860, teachers: 47, attendance: 95.8, feeCollected: 92, licenseSeats: 1000, usedSeats: 860, depts: ["Engineering", "Robotics", "Mathematics", "Sciences"] },
  { id: "sch3", name: "Bloomfield Elementary", short: "BFE", city: "Springfield", color: "#f59e0b", principal: "Ms. Karen Doyle", students: 640, teachers: 39, attendance: 96.1, feeCollected: 90, licenseSeats: 750, usedSeats: 640, depts: ["Early Years", "Primary", "Languages", "Arts"] },
];

// ─── People ─────────────────────────────────────────────────
export interface Student {
  id: string; name: string; grade: string; section: string; schoolId: string;
  parentId: string; gpa: number; streak: number; xp: number; tone: string;
}
export const STUDENTS: Student[] = [
  { id: "stu1", name: "Aarav Rahman", grade: "Grade 10", section: "A", schoolId: "sch1", parentId: "par1", gpa: 3.7, streak: 12, xp: 4820, tone: "from-cyan-500 to-blue-500" },
  { id: "stu2", name: "Zara Rahman", grade: "Grade 8", section: "B", schoolId: "sch1", parentId: "par1", gpa: 3.9, streak: 21, xp: 6110, tone: "from-fuchsia-500 to-purple-500" },
  { id: "stu3", name: "Idris Rahman", grade: "Grade 5", section: "A", schoolId: "sch1", parentId: "par1", gpa: 3.5, streak: 6, xp: 2880, tone: "from-amber-500 to-orange-500" },
  { id: "stu4", name: "Mina Rahman", grade: "Grade 2", section: "C", schoolId: "sch3", parentId: "par1", gpa: 4.0, streak: 9, xp: 1740, tone: "from-rose-500 to-pink-500" },
  { id: "stu5", name: "Sofia Delgado", grade: "Grade 10", section: "A", schoolId: "sch1", parentId: "par2", gpa: 3.8, streak: 15, xp: 5120, tone: "from-emerald-500 to-teal-500" },
  { id: "stu6", name: "Liam O'Connor", grade: "Grade 10", section: "A", schoolId: "sch1", parentId: "par2", gpa: 3.2, streak: 4, xp: 2330, tone: "from-indigo-500 to-violet-500" },
  { id: "stu7", name: "Chen Wei", grade: "Grade 10", section: "A", schoolId: "sch1", parentId: "par2", gpa: 3.95, streak: 30, xp: 7450, tone: "from-sky-500 to-indigo-500" },
  { id: "stu8", name: "Fatima Noor", grade: "Grade 10", section: "A", schoolId: "sch1", parentId: "par2", gpa: 3.6, streak: 8, xp: 3610, tone: "from-pink-500 to-rose-500" },
  { id: "stu9", name: "Noah Bennett", grade: "Grade 10", section: "A", schoolId: "sch1", parentId: "par2", gpa: 2.9, streak: 2, xp: 1420, tone: "from-lime-500 to-emerald-500" },
  { id: "stu10", name: "Amara Diallo", grade: "Grade 10", section: "A", schoolId: "sch1", parentId: "par2", gpa: 3.85, streak: 18, xp: 5780, tone: "from-violet-500 to-fuchsia-500" },
];

export interface Teacher {
  id: string; name: string; subject: string; dept: string; schoolId: string;
  email: string; phone: string; experience: number; rating: number;
  maxPeriods: number; periods: number; // per week
  salary: { base: number; allowance: number; deduction: number };
  status: "active" | "on-leave" | "onboarding" | "probation";
  joined: string; classes: string[];
}
export const TEACHERS: Teacher[] = [
  { id: "tch1", name: "Sarah Chen", subject: "Mathematics", dept: "Mathematics", schoolId: "sch1", email: "s.chen@edunova.school", phone: "+1 555 0182", experience: 11, rating: 4.9, maxPeriods: 30, periods: 26, salary: { base: 5200, allowance: 850, deduction: 410 }, status: "active", joined: "2019-08-12", classes: ["Grade 10-A", "Grade 10-B", "Grade 9-A"] },
  { id: "tch2", name: "David Okafor", subject: "Physics", dept: "Sciences", schoolId: "sch1", email: "d.okafor@edunova.school", phone: "+1 555 0143", experience: 9, rating: 4.7, maxPeriods: 30, periods: 24, salary: { base: 5000, allowance: 800, deduction: 395 }, status: "active", joined: "2020-01-06", classes: ["Grade 10-A", "Grade 11-C"] },
  { id: "tch3", name: "Priya Nair", subject: "English Literature", dept: "Humanities", schoolId: "sch1", email: "p.nair@edunova.school", phone: "+1 555 0117", experience: 14, rating: 4.8, maxPeriods: 28, periods: 22, salary: { base: 5450, allowance: 900, deduction: 430 }, status: "active", joined: "2016-07-21", classes: ["Grade 10-A", "Grade 12-A"] },
  { id: "tch4", name: "Marco Rossi", subject: "Computer Science", dept: "Computer Science", schoolId: "sch1", email: "m.rossi@edunova.school", phone: "+1 555 0166", experience: 7, rating: 4.6, maxPeriods: 30, periods: 29, salary: { base: 5300, allowance: 820, deduction: 405 }, status: "active", joined: "2021-09-01", classes: ["Grade 10-A", "Grade 10-B", "Grade 11-A", "Grade 9-B"] },
  { id: "tch5", name: "Elena Petrova", subject: "Chemistry", dept: "Sciences", schoolId: "sch1", email: "e.petrova@edunova.school", phone: "+1 555 0129", experience: 12, rating: 4.5, maxPeriods: 28, periods: 20, salary: { base: 5150, allowance: 780, deduction: 390 }, status: "on-leave", joined: "2018-03-14", classes: ["Grade 10-A", "Grade 11-B"] },
  { id: "tch6", name: "James Wu", subject: "Biology", dept: "Sciences", schoolId: "sch2", email: "j.wu@edunova.school", phone: "+1 555 0195", experience: 6, rating: 4.4, maxPeriods: 30, periods: 18, salary: { base: 4800, allowance: 720, deduction: 360 }, status: "active", joined: "2022-08-19", classes: ["Grade 9-A", "Grade 10-C"] },
  { id: "tch7", name: "Aisha Bello", subject: "History", dept: "Humanities", schoolId: "sch1", email: "a.bello@edunova.school", phone: "+1 555 0158", experience: 10, rating: 4.8, maxPeriods: 26, periods: 16, salary: { base: 5050, allowance: 760, deduction: 385 }, status: "active", joined: "2019-11-03", classes: ["Grade 10-A", "Grade 8-B"] },
  { id: "tch8", name: "Tomás Silva", subject: "Art & Design", dept: "Arts", schoolId: "sch3", email: "t.silva@edunova.school", phone: "+1 555 0174", experience: 5, rating: 4.3, maxPeriods: 24, periods: 12, salary: { base: 4400, allowance: 640, deduction: 330 }, status: "probation", joined: "2024-02-05", classes: ["Grade 2-C", "Grade 4-A"] },
];

export const USERS: Record<Role, { id: string; name: string; email: string; title: string }> = {
  student: { id: "stu1", name: "Aarav Rahman", email: "aarav@edunova.school", title: "Grade 10 · Section A · Northwood High" },
  instructor: { id: "tch1", name: "Sarah Chen", email: "s.chen@edunova.school", title: "Mathematics Dept. · Northwood High" },
  parent: { id: "par1", name: "Layla Rahman", email: "layla@rahman.family", title: "Guardian of 4 learners" },
  admin: { id: "adm1", name: "Dr. Amara Osei", email: "a.osei@edunova.district", title: "District Administrator · 3 schools" },
};

// ─── Courses ────────────────────────────────────────────────
export interface Lesson { id: string; title: string; type: "video" | "reading" | "interactive" | "quiz"; dur: number; summary: string; points: string[] }
export interface Module { id: string; title: string; lessons: Lesson[] }
export interface Course {
  id: string; title: string; subject: string; teacherId: string; schoolId: string;
  gradeBand: string; color: string; glow: string; rating: number; weeks: number;
  status: "published" | "pending" | "draft";
  enrolled: string[]; modules: Module[];
  capstone: { title: string; brief: string; points: number };
}
const L = (id: string, title: string, type: Lesson["type"], dur: number, summary: string, points: string[]): Lesson => ({ id, title, type, dur, summary, points });

export const COURSES: Course[] = [
  {
    id: "crs1", title: "Advanced Algebra II", subject: "Mathematics", teacherId: "tch1", schoolId: "sch1", gradeBand: "Grade 10", color: "#818cf8", glow: "rgba(129,140,248,.35)", rating: 4.9, weeks: 14, status: "published",
    enrolled: ["stu1", "stu5", "stu6", "stu7", "stu8", "stu9", "stu10"],
    capstone: { title: "Modeling Real-World Systems with Functions", brief: "Choose a real system — traffic flow, a savings plan, population growth — and model it with polynomial, exponential and logarithmic functions. Defend your model in a written report with error analysis.", points: 200 },
    modules: [
      { id: "m1", title: "Functions & Transformations", lessons: [
        L("l1", "Parent functions & families", "video", 12, "How every function family behaves and why transformations move graphs predictably.", ["Identify 8 parent functions", "Map f(x)→a·f(b(x−h))+k", "Sketch transformed graphs"]),
        L("l2", "Inverse functions deep-dive", "interactive", 18, "Build inverses algebraically and graphically with the horizontal line test.", ["Verify inverses by composition", "Restrict domains", "Solve real inverse problems"]),
        L("l3", "Checkpoint: transformations", "quiz", 10, "Adaptive checkpoint covering shifts, stretches and reflections.", ["8 auto-graded items", "Instant feedback", "Mastery threshold 80%"]),
      ]},
      { id: "m2", title: "Polynomials & Rational Expressions", lessons: [
        L("l4", "Polynomial division & theorems", "video", 15, "Remainder and factor theorems as problem-solving shortcuts.", ["Synthetic division fluency", "Factor higher-degree polynomials", "Rational root hunting"]),
        L("l5", "Graphing rational functions", "reading", 14, "Asymptotes, holes and end behavior decoded step by step.", ["Find vertical/horizontal asymptotes", "Detect removable discontinuities", "Graph from factored form"]),
        L("l6", "Checkpoint: polynomials", "quiz", 12, "Auto-graded mastery check with worked solutions.", ["10 adaptive items", "Worked solutions", "Retry with new variants"]),
      ]},
      { id: "m3", title: "Exponentials & Logarithms", lessons: [
        L("l7", "Exponential growth & decay", "video", 13, "Compound interest to half-life — one model, many faces.", ["Model growth/decay", "Continuous compounding", "Half-life calculations"]),
        L("l8", "Logarithm laws workshop", "interactive", 20, "Manipulate logs with confidence using the three core laws.", ["Product/quotient/power laws", "Change of base", "Solve log equations"]),
        L("l9", "Capstone briefing", "reading", 8, "Everything you need to start your modeling capstone.", ["Rubric walkthrough", "Dataset sources", "Milestone calendar"]),
      ]},
    ],
  },
  {
    id: "crs2", title: "Physics: Mechanics in Motion", subject: "Physics", teacherId: "tch2", schoolId: "sch1", gradeBand: "Grade 10", color: "#22d3ee", glow: "rgba(34,211,238,.3)", rating: 4.7, weeks: 12, status: "published",
    enrolled: ["stu1", "stu5", "stu7", "stu8", "stu10"],
    capstone: { title: "Design a Crash-Test Safety Report", brief: "Using momentum and energy principles, analyze a vehicle collision dataset and recommend a safety improvement backed by calculations.", points: 150 },
    modules: [
      { id: "m1", title: "Kinematics", lessons: [
        L("l1", "Motion graphs decoded", "video", 11, "Position, velocity and acceleration graphs as one story.", ["Slope & area meaning", "Convert between graphs", "Narrate motion from data"]),
        L("l2", "Projectile motion lab", "interactive", 22, "Fire virtual projectiles and verify the equations live.", ["Resolve vectors", "Time of flight", "Range optimization"]),
      ]},
      { id: "m2", title: "Forces & Newton's Laws", lessons: [
        L("l3", "Free-body diagrams", "video", 14, "The single most important skill in mechanics.", ["Isolate systems", "Normal vs weight", "Friction models"]),
        L("l4", "Checkpoint: dynamics", "quiz", 10, "Scenario-based items on Newton's three laws.", ["8 scenario items", "Instant feedback", "Threshold 80%"]),
      ]},
      { id: "m3", title: "Energy & Momentum", lessons: [
        L("l5", "Work-energy theorem", "reading", 12, "Why energy bookkeeping beats force-chasing.", ["Kinetic & potential energy", "Conservation problems", "Power ratings"]),
        L("l6", "Impulse & collisions", "video", 16, "From airbags to billiards — momentum everywhere.", ["Conservation of momentum", "Elastic vs inelastic", "Impulse-safety link"]),
      ]},
    ],
  },
  {
    id: "crs3", title: "English Literature: Modern Classics", subject: "English", teacherId: "tch3", schoolId: "sch1", gradeBand: "Grade 10", color: "#f472b6", glow: "rgba(244,114,182,.3)", rating: 4.8, weeks: 10, status: "published",
    enrolled: ["stu1", "stu6", "stu7", "stu9"],
    capstone: { title: "Comparative Author Study Essay", brief: "Compare how two modern authors treat identity and belonging. 1,500 words with cited textual evidence.", points: 120 },
    modules: [
      { id: "m1", title: "Reading Like a Critic", lessons: [
        L("l1", "Annotation systems that work", "reading", 9, "A marginalia framework used by literature professors.", ["Color-coded annotation", "Motif tracking", "Question journals"]),
        L("l2", "Narrative voice & unreliability", "video", 13, "When can we trust the storyteller?", ["First vs third person", "Unreliable narrators", "Bias detection"]),
      ]},
      { id: "m2", title: "Things Fall Apart — Unit Study", lessons: [
        L("l3", "Chapters 1–7 seminar", "interactive", 18, "Guided seminar on Okonkwo's world and its fractures.", ["Igbo cultural context", "Character mapping", "Proverb analysis"]),
        L("l4", "Checkpoint: themes", "quiz", 10, "Theme-tracking quiz with quote identification.", ["6 quote items", "Theme matching", "Instant feedback"]),
      ]},
    ],
  },
  {
    id: "crs4", title: "Intro to Computer Science & Python", subject: "Computer Science", teacherId: "tch4", schoolId: "sch1", gradeBand: "Grades 9–10", color: "#34d399", glow: "rgba(52,211,153,.3)", rating: 4.6, weeks: 16, status: "published",
    enrolled: ["stu1", "stu5", "stu8"],
    capstone: { title: "Build a Text Adventure Game", brief: "Ship a playable Python text adventure with branching story, inventory system and save files. Code review included.", points: 200 },
    modules: [
      { id: "m1", title: "Thinking in Code", lessons: [
        L("l1", "Variables, types & flow", "video", 14, "From zero to your first interactive program.", ["Primitive types", "Input/output", "Conditionals"]),
        L("l2", "Loops & patterns", "interactive", 20, "Pattern-drawing drills that make loops click.", ["for vs while", "Nested loops", "Loop tables"]),
        L("l3", "Checkpoint: logic", "quiz", 12, "Trace-the-output challenge set.", ["8 tracing items", "Parsons puzzles", "Threshold 75%"]),
      ]},
      { id: "m2", title: "Data & Functions", lessons: [
        L("l4", "Lists & dictionaries", "video", 15, "Model the real world with collections.", ["CRUD on collections", "Comprehensions", "Nested data"]),
        L("l5", "Functions & decomposition", "reading", 11, "Write functions like a professional.", ["Parameters & returns", "Scope", "Pure functions"]),
      ]},
    ],
  },
  {
    id: "crs5", title: "Organic Chemistry Foundations", subject: "Chemistry", teacherId: "tch5", schoolId: "sch1", gradeBand: "Grade 11", color: "#fbbf24", glow: "rgba(251,191,36,.28)", rating: 4.5, weeks: 12, status: "pending",
    enrolled: [],
    capstone: { title: "Molecule of the Year Presentation", brief: "Research a molecule that changed the world and present its chemistry, synthesis and impact.", points: 100 },
    modules: [
      { id: "m1", title: "Carbon Architecture", lessons: [
        L("l1", "Bonding & hybridization", "video", 13, "sp³, sp², sp — the geometry of life.", ["Orbital hybridization", "Molecular geometry", "Isomerism intro"]),
        L("l2", "Functional groups tour", "reading", 10, "Meet the twelve groups that rule organic chemistry.", ["Identify functional groups", "Nomenclature basics", "Property prediction"]),
      ]},
    ],
  },
  {
    id: "crs6", title: "World History: 1900–Present", subject: "History", teacherId: "tch7", schoolId: "sch1", gradeBand: "Grade 10", color: "#c084fc", glow: "rgba(192,132,252,.3)", rating: 4.8, weeks: 14, status: "published",
    enrolled: ["stu1", "stu6", "stu9", "stu10"],
    capstone: { title: "Oral History Documentary", brief: "Interview an elder about a historical event they lived through; produce a 5-minute sourced mini-documentary.", points: 150 },
    modules: [
      { id: "m1", title: "The World Wars", lessons: [
        L("l1", "Causes that ignited 1914", "video", 12, "Alliances, imperialism and the spark at Sarajevo.", ["M-A-I-N causes", "Map the alliances", "Primary source reading"]),
        L("l2", "WWII turning points", "interactive", 16, "Interactive timeline of the decisions that changed the war.", ["Stalingrad & Midway", "Home fronts", "Historiography"]),
      ]},
      { id: "m2", title: "Cold War & Beyond", lessons: [
        L("l3", "Ideology & proxy wars", "reading", 13, "How superpowers fought without fighting.", ["Containment", "Proxy conflict map", "Space race"]),
        L("l4", "Checkpoint: causation", "quiz", 10, "Causation chains and consequence webs.", ["6 chain items", "Instant feedback", "Threshold 80%"]),
      ]},
    ],
  },
];

// ─── Assignments & submissions ──────────────────────────────
export interface Assignment { id: string; courseId: string; title: string; type: "homework" | "lab" | "essay" | "quiz" | "capstone"; dueOffset: number; points: number }
export const ASSIGNMENTS: Assignment[] = [
  { id: "asg1", courseId: "crs1", title: "Problem Set 4.2 — Rational Functions", type: "homework", dueOffset: 2, points: 40 },
  { id: "asg2", courseId: "crs2", title: "Lab Report: Projectile Motion", type: "lab", dueOffset: 3, points: 60 },
  { id: "asg3", courseId: "crs3", title: "Close-Reading Journal — Ch. 1–7", type: "essay", dueOffset: 5, points: 50 },
  { id: "asg4", courseId: "crs4", title: "Loop Patterns Challenge", type: "homework", dueOffset: 1, points: 30 },
  { id: "asg5", courseId: "crs1", title: "Capstone: Modeling Real-World Systems", type: "capstone", dueOffset: 9, points: 200 },
  { id: "asg6", courseId: "crs6", title: "Source Analysis — Treaty of Versailles", type: "essay", dueOffset: -2, points: 45 },
  { id: "asg7", courseId: "crs2", title: "Checkpoint Quiz: Dynamics", type: "quiz", dueOffset: -4, points: 25 },
  { id: "asg8", courseId: "crs6", title: "Capstone: Oral History Documentary", type: "capstone", dueOffset: -6, points: 150 },
];

export interface Submission { id: string; assignmentId: string; studentId: string; status: "submitted" | "graded" | "missing"; submittedAt: string; grade?: number; feedback?: string; text?: string }
export const SEED_SUBMISSIONS: Submission[] = [
  { id: "sub1", assignmentId: "asg6", studentId: "stu1", status: "graded", submittedAt: rel(-3), grade: 41, feedback: "Excellent handling of primary sources. Push your thesis further next time." },
  { id: "sub2", assignmentId: "asg7", studentId: "stu1", status: "graded", submittedAt: rel(-4), grade: 22, feedback: "Strong on Newton's 2nd law; review free-body diagrams." },
  { id: "sub3", assignmentId: "asg8", studentId: "stu1", status: "graded", submittedAt: rel(-7), grade: 138, feedback: "Moving documentary with rigorous sourcing. Verified for certification." },
  { id: "sub4", assignmentId: "asg2", studentId: "stu5", status: "submitted", submittedAt: rel(-1), text: "Attached lab report with error analysis and slow-motion captures." },
  { id: "sub5", assignmentId: "asg2", studentId: "stu7", status: "submitted", submittedAt: rel(-1), text: "Full dataset + uncertainty tables included." },
  { id: "sub6", assignmentId: "asg1", studentId: "stu6", status: "submitted", submittedAt: rel(-1), text: "Problems 1–18 completed; question 12 needs review." },
  { id: "sub7", assignmentId: "asg4", studentId: "stu8", status: "submitted", submittedAt: rel(0), text: "All five patterns rendering correctly, incl. bonus diamond." },
  { id: "sub8", assignmentId: "asg1", studentId: "stu9", status: "missing", submittedAt: rel(-1) },
  { id: "sub9", assignmentId: "asg6", studentId: "stu10", status: "submitted", submittedAt: rel(-2), text: "Focus on Article 231 and its economic ripple effects." },
  { id: "sub10", assignmentId: "asg3", studentId: "stu7", status: "submitted", submittedAt: rel(0), text: "Journal entries for chapters 1–7 with proverb index." },
];

// ─── Gradebook ──────────────────────────────────────────────
export interface GradeItem { name: string; score: number; out: number; topic: string }
export interface GradeRow { studentId: string; courseId: string; items: GradeItem[] }
export const SEED_GRADES: GradeRow[] = [
  { studentId: "stu1", courseId: "crs1", items: [
    { name: "Quiz 1 — Transformations", score: 18, out: 20, topic: "Functions" },
    { name: "Problem Set 3.1", score: 34, out: 40, topic: "Polynomials" },
    { name: "Midterm — Functions & Polynomials", score: 78, out: 100, topic: "Functions" },
    { name: "Quiz 2 — Rational Functions", score: 14, out: 20, topic: "Rational Expr." },
    { name: "Participation", score: 9, out: 10, topic: "Engagement" },
  ]},
  { studentId: "stu1", courseId: "crs2", items: [
    { name: "Lab 1 — Motion Graphs", score: 26, out: 30, topic: "Kinematics" },
    { name: "Quiz — Dynamics", score: 22, out: 25, topic: "Forces" },
    { name: "Midterm", score: 81, out: 100, topic: "Mechanics" },
  ]},
  { studentId: "stu1", courseId: "crs3", items: [
    { name: "Seminar Contributions", score: 17, out: 20, topic: "Discussion" },
    { name: "Essay 1 — Narrative Voice", score: 42, out: 50, topic: "Analysis" },
  ]},
  { studentId: "stu1", courseId: "crs4", items: [
    { name: "Checkpoint: Logic", score: 21, out: 25, topic: "Loops" },
    { name: "Project 1 — Mad Libs Engine", score: 45, out: 50, topic: "Functions" },
  ]},
  { studentId: "stu1", courseId: "crs6", items: [
    { name: "Source Analysis", score: 41, out: 45, topic: "WWI" },
    { name: "Capstone Documentary", score: 138, out: 150, topic: "Cold War" },
  ]},
  { studentId: "stu5", courseId: "crs1", items: [
    { name: "Midterm — Functions & Polynomials", score: 88, out: 100, topic: "Functions" },
    { name: "Quiz 2 — Rational Functions", score: 17, out: 20, topic: "Rational Expr." },
  ]},
  { studentId: "stu6", courseId: "crs1", items: [
    { name: "Midterm — Functions & Polynomials", score: 61, out: 100, topic: "Functions" },
    { name: "Quiz 2 — Rational Functions", score: 9, out: 20, topic: "Rational Expr." },
  ]},
  { studentId: "stu7", courseId: "crs1", items: [
    { name: "Midterm — Functions & Polynomials", score: 96, out: 100, topic: "Functions" },
    { name: "Quiz 2 — Rational Functions", score: 19, out: 20, topic: "Rational Expr." },
  ]},
  { studentId: "stu9", courseId: "crs1", items: [
    { name: "Midterm — Functions & Polynomials", score: 52, out: 100, topic: "Functions" },
    { name: "Quiz 2 — Rational Functions", score: 11, out: 20, topic: "Rational Expr." },
  ]},
  { studentId: "stu10", courseId: "crs1", items: [
    { name: "Midterm — Functions & Polynomials", score: 90, out: 100, topic: "Functions" },
    { name: "Quiz 2 — Rational Functions", score: 16, out: 20, topic: "Rational Expr." },
  ]},
];

// ─── Attendance ─────────────────────────────────────────────
export type AttStatus = "unmarked" | "pending" | "approved" | "absent" | "late" | "excused";
export interface AttRecord { id: string; studentId: string; date: string; status: AttStatus; markedAt?: string; approvedBy?: string }

export function seedAttendance(): AttRecord[] {
  const rows: AttRecord[] = [];
  let n = 0;
  const next = () => `att${++n}`;
  // class 10-A (instructor scope) — today
  const cls = ["stu1", "stu5", "stu6", "stu7", "stu8", "stu9", "stu10"];
  const todayStatus: Record<string, AttStatus> = { stu1: "unmarked", stu5: "pending", stu6: "pending", stu7: "approved", stu8: "pending", stu9: "approved", stu10: "approved" };
  for (const sid of cls) {
    const st = todayStatus[sid];
    rows.push({ id: next(), studentId: sid, date: rel(0), status: st, markedAt: st === "unmarked" ? undefined : "07:48 AM", approvedBy: st === "approved" ? "Sarah Chen" : undefined });
  }
  // siblings today
  rows.push({ id: next(), studentId: "stu2", date: rel(0), status: "approved", markedAt: "07:31 AM", approvedBy: "Aisha Bello" });
  rows.push({ id: next(), studentId: "stu3", date: rel(0), status: "unmarked" });
  rows.push({ id: next(), studentId: "stu4", date: rel(0), status: "approved", markedAt: "08:02 AM", approvedBy: "Tomás Silva" });
  // history for the 4 Rahman children (past 12 weekdays)
  const kids = ["stu1", "stu2", "stu3", "stu4"];
  let back = 1, count = 0;
  while (count < 12) {
    const d = new Date(); d.setDate(d.getDate() - back);
    const dow = d.getDay(); back++;
    if (dow === 0 || dow === 6) continue;
    count++;
    kids.forEach((sid, i) => {
      let st: AttStatus = "approved";
      if (count === 4 && sid === "stu3") st = "excused";
      if (count === 7 && sid === "stu1") st = "late";
      if (count === 9 && sid === "stu2") st = "absent";
      rows.push({ id: next(), studentId: sid, date: iso(d), status: st, markedAt: `07:${pad(20 + i * 7 % 38)} AM`, approvedBy: st === "approved" || st === "late" ? "Class Teacher" : undefined });
    });
  }
  return rows;
}

// ─── Commute journey (home ↔ school) ────────────────────────
export interface Journey { id: string; studentId: string; date: string; leftHomeAt?: string; arrivedAt?: string }
export function seedJourneys(): Journey[] {
  return [
    { id: "jrn1", studentId: "stu1", date: rel(0), leftHomeAt: "07:15 AM" },
    { id: "jrn2", studentId: "stu2", date: rel(0), leftHomeAt: "07:18 AM", arrivedAt: "07:44 AM" },
    { id: "jrn3", studentId: "stu3", date: rel(0) },
    { id: "jrn4", studentId: "stu4", date: rel(0), leftHomeAt: "07:52 AM", arrivedAt: "08:05 AM" },
  ];
}

// ─── Diary ──────────────────────────────────────────────────
export interface DiaryEntry { id: string; ownerId: string; ownerRole: "student" | "teacher"; className?: string; date: string; title: string; body: string; mood: "great" | "good" | "ok" | "tough"; tags: string[]; remark?: string }
export function seedDiary(): DiaryEntry[] {
  return [
    { id: "d1", ownerId: "stu1", ownerRole: "student", date: rel(-1), title: "Rational functions finally clicked", body: "Worked through problem set 3.8 and the asymptote rules make sense now. Physics lab data collection went well — our projectile landed within 4% of the prediction.", mood: "great", tags: ["Math", "Physics"], remark: "Wonderful persistence, Aarav. Bring that energy to the capstone! — Ms. Chen" },
    { id: "d2", ownerId: "stu1", ownerRole: "student", date: rel(-2), title: "History documentary interview", body: "Recorded the interview with grandfather about the 1971 war. Two hours of footage. Need to log sources and trim to 5 minutes.", mood: "good", tags: ["History", "Capstone"] },
    { id: "d3", ownerId: "stu1", ownerRole: "student", date: rel(-3), title: "Loops practice grind", body: "Finished the loop patterns challenge — the nested pyramid took 6 attempts. Read chapter 6 of Things Fall Apart; the proverbs are beautiful.", mood: "ok", tags: ["CS", "English"], remark: "Your debugging journal was excellent. — Mr. Rossi" },
    { id: "d4", ownerId: "stu1", ownerRole: "student", date: rel(-4), title: "Tough midterm review day", body: "Mixed feelings about the functions midterm — section B was harder than expected. Attended study group; Sofia explained inverse composition clearly.", mood: "tough", tags: ["Math", "Study Group"] },
    { id: "d5", ownerId: "tch1", ownerRole: "teacher", className: "Grade 10-A", date: rel(-1), title: "Rational functions — asymptotes", body: "Covered vertical/horizontal asymptotes with desmos demos. Most of the class is confident; Liam and Noah need a support seminar. Homework: PS 4.2.", mood: "good", tags: ["Algebra II", "Homework set"] },
    { id: "d6", ownerId: "tch1", ownerRole: "teacher", className: "Grade 10-A", date: rel(-2), title: "Inverse functions workshop", body: "Ran pair-teaching activity. Strong engagement. Collected transformation sketches for the corridor gallery.", mood: "great", tags: ["Algebra II"] },
  ];
}

export interface TaskItem { id: string; studentId: string; label: string; done: boolean; source: "self" | "teacher" | "ai"; due: string }
export function seedTasks(): TaskItem[] {
  return [
    { id: "tsk1", studentId: "stu1", label: "Finish Algebra problem set 4.2 (Q1–18)", done: false, source: "teacher", due: rel(2) },
    { id: "tsk2", studentId: "stu1", label: "Read Things Fall Apart — Chapter 7", done: true, source: "teacher", due: rel(0) },
    { id: "tsk3", studentId: "stu1", label: "Draft physics lab report (projectile)", done: false, source: "self", due: rel(3) },
    { id: "tsk4", studentId: "stu1", label: "AI: 20 min — logarithm laws micro-drills", done: false, source: "ai", due: rel(0) },
    { id: "tsk5", studentId: "stu1", label: "Trim documentary interview to 8 min", done: false, source: "self", due: rel(4) },
  ];
}

// ─── Calendar events ────────────────────────────────────────
export interface CalEvent { id: string; title: string; date: string; type: "holiday" | "exam" | "event" | "meeting" | "sports" | "arts"; schoolId: string | "all"; desc: string }
export function seedEvents(): CalEvent[] {
  return [
    { id: "ev1", title: "Founder's Day — School Closed", date: rel(-8), type: "holiday", schoolId: "all", desc: "Annual commemoration of the district's founding in 1962. No classes." },
    { id: "ev2", title: "Inter-School Debate Finals", date: rel(-3), type: "event", schoolId: "sch1", desc: "Northwood hosts the regional finals in the main auditorium." },
    { id: "ev3", title: "Mid-Term Exams Begin", date: rel(4), type: "exam", schoolId: "all", desc: "Mathematics and Sciences on day 1–2. Revised timetable on the portal." },
    { id: "ev4", title: "Science & Innovation Fair", date: rel(7), type: "event", schoolId: "sch1", desc: "Student capstone exhibits. Parents welcome from 2 PM. Judges from City University." },
    { id: "ev5", title: "Parent–Teacher Conference", date: rel(11), type: "meeting", schoolId: "all", desc: "Book 15-minute slots with class teachers via the Parent App." },
    { id: "ev6", title: "Winter Break Begins", date: rel(18), type: "holiday", schoolId: "all", desc: "School closes for two weeks. Campus offices open 9 AM–1 PM." },
    { id: "ev7", title: "Annual Sports Day", date: rel(14), type: "sports", schoolId: "sch1", desc: "Track events, house relays and staff-vs-seniors football." },
    { id: "ev8", title: "Art & Design Exhibition", date: rel(9), type: "arts", schoolId: "sch3", desc: "Bloomfield elementary showcase of term projects in the east gallery." },
    { id: "ev9", title: "Robotics Club Demo", date: rel(5), type: "event", schoolId: "sch2", desc: "Line-follower and drone demos by the RSA robotics team." },
    { id: "ev10", title: "Staff Development Day", date: rel(25), type: "holiday", schoolId: "all", desc: "No classes for students. Teachers attend pedagogy workshops." },
    { id: "ev11", title: "Math Olympiad — Round 1", date: rel(16), type: "exam", schoolId: "sch1", desc: "Selected Grade 9–11 students; hall B from 10 AM." },
    { id: "ev12", title: "New Year Concert Rehearsal", date: rel(22), type: "arts", schoolId: "all", desc: "Full-dress rehearsal, main auditorium, all performers." },
  ];
}
export const EVENT_STYLE: Record<CalEvent["type"], { color: string; label: string }> = {
  holiday: { color: "#f43f5e", label: "Holiday" },
  exam: { color: "#f59e0b", label: "Exam" },
  event: { color: "#22d3ee", label: "Event" },
  meeting: { color: "#818cf8", label: "Meeting" },
  sports: { color: "#34d399", label: "Sports" },
  arts: { color: "#c084fc", label: "Arts" },
};

// ─── Finance ────────────────────────────────────────────────
export interface Invoice { id: string; studentId: string; title: string; amount: number; due: string; status: "paid" | "due" | "overdue"; paidOn?: string }
export function seedInvoices(): Invoice[] {
  return [
    { id: "inv1", studentId: "stu1", title: "Tuition — Term 2", amount: 850, due: rel(-4), status: "overdue" },
    { id: "inv2", studentId: "stu1", title: "Transport — Monthly", amount: 120, due: rel(6), status: "due" },
    { id: "inv3", studentId: "stu1", title: "STEM Lab Fee", amount: 60, due: rel(-20), status: "paid", paidOn: rel(-22) },
    { id: "inv4", studentId: "stu2", title: "Tuition — Term 2", amount: 780, due: rel(-22), status: "paid", paidOn: rel(-25) },
    { id: "inv5", studentId: "stu2", title: "Robotics Club", amount: 45, due: rel(9), status: "due" },
    { id: "inv6", studentId: "stu3", title: "Tuition — Term 2", amount: 640, due: rel(-18), status: "paid", paidOn: rel(-19) },
    { id: "inv7", studentId: "stu3", title: "Art Supplies", amount: 35, due: rel(4), status: "due" },
    { id: "inv8", studentId: "stu4", title: "Tuition — Term 2", amount: 520, due: rel(-15), status: "paid", paidOn: rel(-16) },
    { id: "inv9", studentId: "stu4", title: "Activity Fee", amount: 40, due: rel(12), status: "due" },
  ];
}
export interface FeePlan { id: string; name: string; schoolId: string; gradeBand: string; amount: number; cycle: string; enrolled: number }
export const FEE_PLANS: FeePlan[] = [
  { id: "fp1", name: "Senior Tuition Plan", schoolId: "sch1", gradeBand: "Grades 9–12", amount: 850, cycle: "Per term", enrolled: 512 },
  { id: "fp2", name: "Middle Tuition Plan", schoolId: "sch1", gradeBand: "Grades 6–8", amount: 780, cycle: "Per term", enrolled: 428 },
  { id: "fp3", name: "STEM Labs Add-on", schoolId: "sch2", gradeBand: "Grades 6–12", amount: 60, cycle: "Per term", enrolled: 610 },
  { id: "fp4", name: "Elementary Plan", schoolId: "sch3", gradeBand: "Grades 1–5", amount: 520, cycle: "Per term", enrolled: 640 },
  { id: "fp5", name: "Transport — Zone A", schoolId: "sch1", gradeBand: "All grades", amount: 120, cycle: "Monthly", enrolled: 356 },
];

// ─── HR: payroll, leaves, onboarding ────────────────────────
export interface PayRecord { id: string; teacherId: string; month: string; base: number; allowance: number; deduction: number; net: number; status: "pending" | "paid"; paidOn?: string }
export function seedPayroll(): PayRecord[] {
  const rows: PayRecord[] = [];
  TEACHERS.forEach((t, i) => {
    rows.push({ id: `pay${i + 1}`, teacherId: t.id, month: monthName(0), base: t.salary.base, allowance: t.salary.allowance, deduction: t.salary.deduction, net: t.salary.base + t.salary.allowance - t.salary.deduction, status: i < 3 ? "paid" : "pending", paidOn: i < 3 ? rel(-2) : undefined });
    rows.push({ id: `payp${i + 1}`, teacherId: t.id, month: monthName(-1), base: t.salary.base, allowance: t.salary.allowance, deduction: t.salary.deduction + (i % 3) * 40, net: t.salary.base + t.salary.allowance - t.salary.deduction - (i % 3) * 40, status: "paid", paidOn: rel(-32) });
  });
  return rows;
}
export interface LeaveReq { id: string; teacherId: string; type: string; from: string; to: string; days: number; reason: string; status: "pending" | "approved" | "rejected"; note?: string }
export function seedLeaves(): LeaveReq[] {
  return [
    { id: "lv1", teacherId: "tch3", type: "Medical", from: rel(3), to: rel(4), days: 2, reason: "Scheduled minor procedure; lesson plans shared with substitute pool.", status: "pending" },
    { id: "lv2", teacherId: "tch4", type: "Family event", from: rel(6), to: rel(6), days: 1, reason: "Sister's wedding out of state.", status: "pending" },
    { id: "lv3", teacherId: "tch6", type: "Professional development", from: rel(9), to: rel(10), days: 2, reason: "IB Biology workshop in the city.", status: "pending" },
    { id: "lv4", teacherId: "tch5", type: "Medical", from: rel(-6), to: rel(2), days: 7, reason: "Post-operative recovery.", status: "approved", note: "Covered by Mr. Wu for two weeks." },
    { id: "lv5", teacherId: "tch8", type: "Personal", from: rel(-12), to: rel(-12), days: 1, reason: "Moving apartments.", status: "approved" },
    { id: "lv6", teacherId: "tch2", type: "Casual", from: rel(-9), to: rel(-9), days: 1, reason: "Family commitment.", status: "rejected", note: "Mid-term duty week — please reschedule." },
  ];
}
export interface Candidate { id: string; name: string; subject: string; schoolId: string; stage: number; applied: string; note: string }
export const CANDIDATE_STAGES = ["Application", "Screening", "Interview", "Offer", "Onboarded"];
export function seedCandidates(): Candidate[] {
  return [
    { id: "cnd1", name: "Ingrid Halvorsen", subject: "Mathematics", schoolId: "sch1", stage: 2, applied: rel(-6), note: "Strong demo lesson on functions." },
    { id: "cnd2", name: "Samuel Adeyemi", subject: "Physics", schoolId: "sch2", stage: 3, applied: rel(-11), note: "Offer drafted — relocation support requested." },
    { id: "cnd3", name: "Grace Mbeki", subject: "English", schoolId: "sch3", stage: 1, applied: rel(-3), note: "8 yrs exp, IB PYP trained." },
    { id: "cnd4", name: "Ravi Chandran", subject: "Computer Science", schoolId: "sch1", stage: 0, applied: rel(-1), note: "Ex-industry engineer, wants teaching career." },
    { id: "cnd5", name: "Lucía Fernández", subject: "Spanish", schoolId: "sch2", stage: 4, applied: rel(-20), note: "Onboarded last week — mentor: Ms. Nair." },
    { id: "cnd6", name: "Omar Haddad", subject: "Chemistry", schoolId: "sch1", stage: 2, applied: rel(-8), note: "Panel interview scheduled." },
  ];
}

// ─── Notifications & messages ───────────────────────────────
export interface Notice { id: string; role: Role; icon: "attendance" | "journey" | "grade" | "fee" | "leave" | "system" | "message" | "diary"; title: string; body: string; time: string; read: boolean }
export function seedNotices(): Notice[] {
  return [
    { id: "n1", role: "parent", icon: "journey", title: "Zara reached school", body: "Confirmed by Ms. Bello at 07:44 AM. Attendance approved.", time: "07:44 AM", read: false },
    { id: "n2", role: "parent", icon: "journey", title: "Mina reached school", body: "Confirmed by Mr. Silva at 08:05 AM.", time: "08:05 AM", read: false },
    { id: "n3", role: "parent", icon: "fee", title: "Tuition reminder — Aarav", body: "Term 2 tuition of $850 is overdue. Pay securely in the Fees tab.", time: "09:00 AM", read: false },
    { id: "n4", role: "student", icon: "grade", title: "Capstone graded!", body: "Oral History Documentary — 138/150. Your certificate is unlocked.", time: "Yesterday", read: false },
    { id: "n5", role: "student", icon: "attendance", title: "Don't forget", body: "Mark your attendance when you arrive today.", time: "07:00 AM", read: false },
    { id: "n6", role: "instructor", icon: "attendance", title: "3 attendance approvals", body: "Sofia, Liam and Fatima self-marked — review in Attendance Desk.", time: "07:50 AM", read: false },
    { id: "n7", role: "instructor", icon: "grade", title: "5 submissions to grade", body: "Projectile motion labs and PS 4.2 are waiting in Grading Desk.", time: "08:10 AM", read: false },
    { id: "n8", role: "admin", icon: "leave", title: "3 leave requests pending", body: "Ms. Nair (medical 2d), Mr. Rossi (family 1d), Mr. Wu (PD 2d).", time: "08:30 AM", read: false },
    { id: "n9", role: "admin", icon: "fee", title: "Collections at 89%", body: "District fee collection is tracking 4% ahead of last term.", time: "06:00 AM", read: true },
    { id: "n10", role: "admin", icon: "system", title: "Curriculum approval", body: "Organic Chemistry Foundations awaits your review.", time: "Yesterday", read: false },
  ];
}
export interface Thread { id: string; role: Role; with: string; subtitle: string; msgs: { from: "me" | "them"; text: string; ts: string }[] }
export function seedThreads(): Thread[] {
  return [
    { id: "th1", role: "student", with: "Sarah Chen (Math)", subtitle: "Algebra II · Grade 10-A", msgs: [
      { from: "them", text: "Aarav, great work on the transformations quiz. Ready for rational functions?", ts: "Mon 4:12 PM" },
      { from: "me", text: "Almost! Struggling a bit with oblique asymptotes.", ts: "Mon 4:40 PM" },
      { from: "them", text: "Watch lesson l5 twice and try the desmos demo — then come to Wednesday's support seminar.", ts: "Mon 5:02 PM" },
    ]},
    { id: "th2", role: "student", with: "Study Group — Grade 10-A", subtitle: "6 members · Peer space", msgs: [
      { from: "them", text: "Sofia: physics lab data sheet is in shared notes 📎", ts: "Today 8:02 AM" },
      { from: "them", text: "Chen Wei: quiz at 11? i'm doing the loop patterns again", ts: "Today 8:15 AM" },
    ]},
    { id: "th3", role: "parent", with: "Sarah Chen (Math)", subtitle: "Aarav · Algebra II", msgs: [
      { from: "them", text: "Mrs. Rahman, Aarav's capstone proposal is excellent — traffic flow modeling.", ts: "Tue 3:20 PM" },
      { from: "me", text: "That's wonderful to hear. He's been gathering intersection data every evening!", ts: "Tue 6:45 PM" },
    ]},
    { id: "th4", role: "parent", with: "Aisha Bello (History)", subtitle: "Zara · Grade 8-B", msgs: [
      { from: "them", text: "Zara led today's seminar discussion beautifully. A natural historian.", ts: "Wed 1:10 PM" },
    ]},
    { id: "th5", role: "instructor", with: "Layla Rahman (Parent)", subtitle: "Aarav · Grade 10-A", msgs: [
      { from: "them", text: "Thank you for the seminar recommendation — he found it very helpful.", ts: "Tue 6:45 PM" },
      { from: "me", text: "Glad to hear. His trajectory this term is strong.", ts: "Tue 7:02 PM" },
    ]},
    { id: "th6", role: "instructor", with: "Dept: Mathematics", subtitle: "8 teachers · Northwood", msgs: [
      { from: "them", text: "HOD: midterm analysis meeting moved to Friday 2 PM.", ts: "Today 7:30 AM" },
    ]},
  ];
}
export const CANNED_REPLIES = [
  "Received — thank you! I'll get back to you after class.",
  "Noted, thanks for the update.",
  "Great, let's discuss this at the next check-in.",
  "Thanks! I'll review this tonight and respond in detail.",
];

// ─── Analytics series ───────────────────────────────────────
export const ENROLLMENT_TREND = [2210, 2245, 2280, 2315, 2305, 2360, 2405, 2450, 2480, 2530, 2600, 2740];
export const REVENUE_TREND = [1.42, 1.45, 1.5, 1.48, 1.55, 1.6, 1.58, 1.66, 1.7, 1.74, 1.8, 1.92]; // $M
export const ENGAGEMENT_WEEK = [62, 74, 81, 78, 88, 45, 38]; // % active by day M–S
export const GRADE_DIST = [
  { band: "A (90+)", pct: 32, color: "#34d399" },
  { band: "B (80–89)", pct: 34, color: "#22d3ee" },
  { band: "C (70–79)", pct: 21, color: "#f59e0b" },
  { band: "D (<70)", pct: 13, color: "#f43f5e" },
];
export const MASTERY_TOPICS = [
  { topic: "Functions", pct: 86 }, { topic: "Polynomials", pct: 78 }, { topic: "Rational Expr.", pct: 64 },
  { topic: "Exponentials", pct: 58 }, { topic: "Logarithms", pct: 47 }, { topic: "Modeling", pct: 39 },
];
export const SCHOOL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── AI quiz bank ───────────────────────────────────────────
export interface QuizQ { q: string; options: string[]; answer: number; expl: string }
export const QUIZ_BANK: Record<string, QuizQ[]> = {
  "Algebra — Functions": [
    { q: "If f(x) = 3x − 2, what is f⁻¹(7)?", options: ["3", "5", "19", "1/3"], answer: 0, expl: "Solve 7 = 3x − 2 → x = 3, so f⁻¹(7) = 3." },
    { q: "The graph of y = (x − 2)² + 3 is y = x² shifted…", options: ["right 2, up 3", "left 2, up 3", "right 2, down 3", "left 2, down 3"], answer: 0, expl: "Inside shift moves opposite sign; +3 moves up." },
    { q: "Which is a one-to-one function?", options: ["y = 2x + 5", "y = x²", "y = |x|", "y = x⁴"], answer: 0, expl: "Only the linear function passes the horizontal line test." },
    { q: "f(x) = 1/x has a vertical asymptote at…", options: ["x = 0", "x = 1", "y = 0 only", "none"], answer: 0, expl: "Division by zero at x = 0 creates the asymptote." },
    { q: "Domain of f(x) = √(x − 4)?", options: ["x ≥ 4", "x > 4", "x ≤ 4", "all reals"], answer: 0, expl: "The radicand must be non-negative: x − 4 ≥ 0." },
    { q: "If f(x) = x² and g(x) = x + 1, then f(g(2)) =", options: ["9", "5", "6", "4"], answer: 0, expl: "g(2) = 3, then f(3) = 9." },
  ],
  "Physics — Mechanics": [
    { q: "Area under a velocity–time graph gives…", options: ["displacement", "acceleration", "force", "momentum"], answer: 0, expl: "v × t = distance, so area = displacement." },
    { q: "An object in free fall (no air resistance) has acceleration…", options: ["9.8 m/s² down", "0", "increasing", "depends on mass"], answer: 0, expl: "Near Earth's surface g ≈ 9.8 m/s² for all masses." },
    { q: "Newton's 3rd law pair acts on…", options: ["two different bodies", "the same body", "only moving bodies", "only massive bodies"], answer: 0, expl: "Action–reaction pairs never cancel because they act on different objects." },
    { q: "Kinetic energy is proportional to…", options: ["v²", "v", "m²", "√v"], answer: 0, expl: "KE = ½mv² — doubling speed quadruples energy." },
    { q: "Momentum is conserved when…", options: ["net external force is zero", "friction exists", "bodies stick", "speeds are equal"], answer: 0, expl: "Conservation requires no net external impulse." },
    { q: "Unit of power is…", options: ["Watt", "Joule", "Newton", "Pascal"], answer: 0, expl: "Power = work/time → Joule/second = Watt." },
  ],
  "Computer Science — Python": [
    { q: "Output of print(2 ** 3 ** 2)?", options: ["512", "64", "36", "26"], answer: 0, expl: "Exponentiation is right-associative: 3²=9, 2⁹=512." },
    { q: "Which creates an empty dictionary?", options: ["{}", "[]", "()", "set()"], answer: 0, expl: "Curly braces define an empty dict." },
    { q: "range(2, 10, 3) produces…", options: ["2, 5, 8", "2, 5, 8, 10", "3, 6, 9", "2, 4, 6, 8"], answer: 0, expl: "Start 2, step 3, stop before 10." },
    { q: "A function that calls itself is…", options: ["recursive", "iterative", "nested", "lambda"], answer: 0, expl: "Self-invocation = recursion (needs a base case)." },
    { q: "'abc'[::-1] returns…", options: ["'cba'", "'abc'", "'ab'", "error"], answer: 0, expl: "Step −1 reverses the string." },
    { q: "Which is immutable?", options: ["tuple", "list", "dict", "set"], answer: 0, expl: "Tuples cannot be changed after creation." },
  ],
  "History — 20th Century": [
    { q: "The immediate trigger of WWI was…", options: ["assassination of Archduke Franz Ferdinand", "invasion of Poland", "sinking of Lusitania", "Treaty of Versailles"], answer: 0, expl: "Sarajevo, June 1914, set the alliance dominoes falling." },
    { q: "The policy of 'containment' targeted…", options: ["Soviet expansion", "German reunification", "colonial trade", "fascist Italy"], answer: 0, expl: "Truman-era doctrine to limit USSR influence." },
    { q: "D-Day landings occurred in…", options: ["Normandy, 1944", "Dunkirk, 1940", "Sicily, 1943", "Berlin, 1945"], answer: 0, expl: "June 6, 1944 — opening the western front." },
    { q: "The Cold War space race peaked with…", options: ["Apollo 11 Moon landing", "Sputnik launch", "Hubble deployment", "ISS assembly"], answer: 0, expl: "1969 — the decisive symbolic victory." },
    { q: "The Berlin Wall fell in…", options: ["1989", "1991", "1961", "1979"], answer: 0, expl: "November 9, 1989 — symbol of the Cold War's end." },
    { q: "The Treaty of Versailles primarily blamed…", options: ["Germany", "Austria-Hungary", "Russia", "Ottoman Empire"], answer: 0, expl: "Article 231 — the 'war guilt' clause." },
  ],
  "Chemistry — Organic": [
    { q: "Methane's geometry is…", options: ["tetrahedral", "linear", "trigonal planar", "bent"], answer: 0, expl: "sp³ carbon gives 109.5° bond angles." },
    { q: "Functional group of alcohols is…", options: ["–OH", "–COOH", "–NH₂", "–CHO"], answer: 0, expl: "Hydroxyl group defines alcohols." },
    { q: "General formula of alkanes…", options: ["CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₂", "CₙHₙ"], answer: 0, expl: "Saturated hydrocarbons follow CₙH₂ₙ₊₂." },
    { q: "Isomers have the same…", options: ["molecular formula", "structure", "properties", "bond angles"], answer: 0, expl: "Same formula, different arrangement." },
    { q: "Ethene is…", options: ["unsaturated", "saturated", "aromatic", "an alcohol"], answer: 0, expl: "Its C=C double bond makes it unsaturated." },
    { q: "Carbon forms 4 bonds because it has…", options: ["4 valence electrons", "4 shells", "4 protons", "4 isotopes"], answer: 0, expl: "Four valence electrons → four covalent bonds." },
  ],
};

// ─── Demo credentials ───────────────────────────────────────
export const DEMO_LOGINS: { role: Role; email: string; pass: string; blurb: string }[] = [
  { role: "student", email: "aarav@edunova.school", pass: "learn@123", blurb: "Aarav Rahman · Grade 10" },
  { role: "instructor", email: "s.chen@edunova.school", pass: "teach@123", blurb: "Sarah Chen · Mathematics" },
  { role: "parent", email: "layla@rahman.family", pass: "family@123", blurb: "Layla Rahman · 4 children" },
  { role: "admin", email: "a.osei@edunova.district", pass: "district@123", blurb: "Dr. Amara Osei · District" },
];

export const ROLE_META: Record<Role, { label: string; accent: string; soft: string; path: string }> = {
  student: { label: "Student", accent: "#22d3ee", soft: "rgba(34,211,238,.12)", path: "/student" },
  instructor: { label: "Instructor", accent: "#a78bfa", soft: "rgba(167,139,250,.12)", path: "/instructor" },
  parent: { label: "Parent", accent: "#fbbf24", soft: "rgba(251,191,36,.12)", path: "/parent" },
  admin: { label: "Administrator", accent: "#34d399", soft: "rgba(52,211,153,.12)", path: "/admin" },
};

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Home as HomeIcon, Calendar, Map, BarChart3, Target, Plus, X, Settings,
  ChevronRight, ChevronLeft, Trophy, Briefcase, BookOpen, Code2, FileText,
  FlaskConical, FolderKanban, Leaf, Flag, GraduationCap, Circle, CheckCircle2,
  Sparkles, Trash2, Archive, Rocket, Award, PenLine,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const TOKENS = `
  :root{
    --bg:#FAFAFC;
    --surface:#FFFFFF;
    --ink:#1B1B3A;
    --ink-soft:#5B5B76;
    --ink-faint:#9B9BB0;
    --primary:#5D5FEF;
    --primary-dark:#4A4CD1;
    --primary-soft:#ECEBFF;
    --accent:#A78BFA;
    --green:#2FB876;
    --green-soft:#E4F8ED;
    --orange:#F0955A;
    --orange-soft:#FDEEE1;
    --gray:#C7C7D1;
    --gray-soft:#F2F2F6;
    --border:#EAEAF1;
    --shadow: 0 1px 2px rgba(27,27,58,0.04), 0 10px 28px rgba(27,27,58,0.07);
    --shadow-lift: 0 4px 10px rgba(27,27,58,0.06), 0 18px 40px rgba(93,95,239,0.14);
    --shadow-btn: 0 1px 2px rgba(27,27,58,0.06), 0 8px 18px rgba(93,95,239,0.28);
  }
  .btj{
    font-family:'Inter',system-ui,sans-serif;
    background:
      radial-gradient(circle at 1px 1px, rgba(27,27,58,0.05) 1px, transparent 0) 0 0/24px 24px,
      var(--bg);
    color:var(--ink);
    min-height:100%;
    width:100%;
    -webkit-font-smoothing:antialiased;
    letter-spacing:-0.01em;
    position:relative;
  }
  .btj *{box-sizing:border-box;}
  .disp{font-family:'Outfit','Inter',system-ui,sans-serif; letter-spacing:-0.02em;}
  .btj ::selection{background:var(--primary-soft);}
  .btj button{font-family:inherit;cursor:pointer;}
  .btj input, .btj textarea, .btj select{font-family:inherit;}
  .btj input:focus, .btj textarea:focus, .btj select:focus, .btj button:focus-visible{
    outline:2px solid var(--primary); outline-offset:2px;
  }
  .card{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:20px;
    box-shadow:var(--shadow);
    transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s ease;
  }
  .card-hover:hover{
    transform: translateY(-2px);
    box-shadow: var(--shadow-lift);
  }
  .softcard{
    background:var(--gray-soft);
    border-radius:16px;
  }
  .track{
    height:8px; border-radius:999px; background:var(--gray-soft); overflow:hidden;
  }
  .fill{ height:100%; border-radius:999px; transition:width .7s cubic-bezier(.22,1,.36,1); background-size:200% 100%; }
  .chip{
    display:inline-flex; align-items:center; gap:6px; padding:4px 11px; border-radius:999px;
    font-size:11.5px; font-weight:700;
  }
  .btn{
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    border-radius:14px; font-weight:700; font-size:14px; border:none; transition:transform .15s cubic-bezier(.22,1,.36,1), box-shadow .15s ease, background .15s ease;
    padding:11px 18px;
  }
  .btn:active{ transform:scale(0.96); }
  .btn-primary{ background:var(--primary); color:#fff; box-shadow:var(--shadow-btn); }
  .btn-primary:hover{ background:var(--primary-dark); transform:translateY(-1px); }
  .btn-ghost{ background:var(--gray-soft); color:var(--ink); }
  .btn-ghost:hover{ background:var(--border); }
  .btn-text{ background:transparent; color:var(--primary); padding:6px 4px; font-weight:700; }
  .blob{ position:absolute; border-radius:999px; filter:blur(38px); pointer-events:none; z-index:0; }
  .ambient-layer{ position:fixed; inset:0; overflow:hidden; pointer-events:none; z-index:0; }
  .ambient-blob{ position:absolute; border-radius:999px; filter:blur(70px); }
  .content-layer{ position:relative; z-index:1; }
  @keyframes driftA{ 0%,100%{ transform:translate(0,0);} 50%{ transform:translate(18px,-24px);} }
  @keyframes driftB{ 0%,100%{ transform:translate(0,0);} 50%{ transform:translate(-22px,20px);} }
  @media (prefers-reduced-motion: no-preference){
    .ambient-blob.a{ animation: driftA 22s ease-in-out infinite; }
    .ambient-blob.b{ animation: driftB 26s ease-in-out infinite; }
  }
  @keyframes pulseRing{ 0%,100%{ box-shadow:0 0 0 0 rgba(93,95,239,0.35);} 50%{ box-shadow:0 0 0 7px rgba(93,95,239,0);} }
  .pulse{ animation: pulseRing 2.2s ease-in-out infinite; }

  .checkbox{
    width:22px; height:22px; border-radius:8px; border:2px solid var(--gray);
    display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s ease;
    background:#fff;
  }
  .checkbox.done{ background:var(--green); border-color:var(--green); }

  .navwrap-desktop{ display:none; }
  .navwrap-mobile{ display:flex; }
  @media (min-width: 860px){
    .navwrap-desktop{ display:flex; }
    .navwrap-mobile{ display:none; }
  }

  .heatcell{ width:11px; height:11px; border-radius:3px; }

  .modal-overlay{
    position:fixed; inset:0; background:rgba(27,27,58,0.35); backdrop-filter:blur(2px);
    display:flex; align-items:flex-end; justify-content:center; z-index:50; padding:0;
  }
  @media (min-width:640px){
    .modal-overlay{ align-items:center; padding:20px; }
  }
  .modal-sheet{
    background:#fff; width:100%; max-width:480px; border-radius:24px 24px 0 0;
    max-height:88vh; overflow-y:auto; box-shadow:var(--shadow);
    animation: rise .28s cubic-bezier(.22,1,.36,1);
  }
  @media (min-width:640px){
    .modal-sheet{ border-radius:24px; }
  }
  @keyframes rise{ from{ transform:translateY(24px); opacity:0;} to{ transform:translateY(0); opacity:1; } }
  @keyframes pop{ 0%{ transform:scale(.9); opacity:0;} 60%{transform:scale(1.03);} 100%{ transform:scale(1); opacity:1; } }
  .pop-in{ animation: pop .32s cubic-bezier(.22,1,.36,1); }
  @keyframes floatUp{ from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }
  .float-in{ animation: floatUp .45s cubic-bezier(.22,1,.36,1) both; }
  @keyframes dash{ from{ stroke-dashoffset: var(--dash-from); } to{ stroke-dashoffset: var(--dash-to); } }

  .textarea, .field-input, .field-select{
    width:100%; border:1.5px solid var(--border); border-radius:12px; padding:10px 12px;
    font-size:14px; color:var(--ink); background:#fff;
  }
  .field-label{ font-size:12px; font-weight:600; color:var(--ink-soft); margin-bottom:6px; display:block; }

  .scrollbar-none::-webkit-scrollbar{ display:none; }
  .scrollbar-none{ -ms-overflow-style:none; scrollbar-width:none; }
`;

/* ============================================================
   CONSTANTS
   ============================================================ */
const CATEGORIES = [
  { id: "study", label: "Study", icon: BookOpen, color: "#5D5FEF", soft: "#ECEBFF" },
  { id: "coding", label: "Coding", icon: Code2, color: "#2FB876", soft: "#E4F8ED" },
  { id: "assignment", label: "Assignment", icon: FileText, color: "#F0955A", soft: "#FDEEE1" },
  { id: "lab", label: "Lab", icon: FlaskConical, color: "#A78BFA", soft: "#F2EEFF" },
  { id: "project", label: "Project", icon: FolderKanban, color: "#3D9BE0", soft: "#E7F4FD" },
  { id: "career", label: "Career", icon: Briefcase, color: "#D2603A", soft: "#FBE8E0" },
  { id: "personal", label: "Personal", icon: Leaf, color: "#5B8C4A", soft: "#EAF4E4" },
];
const catInfo = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

const YEAR_META = [
  { year: 1, name: "Foundation", icon: "🌱", focus: "Programming, Maths, Communication, Basic DSA" },
  { year: 2, name: "Skill Building", icon: "🚀", focus: "DSA, DBMS, Operating Systems, Web Dev" },
  { year: 3, name: "Career Preparation", icon: "💼", focus: "Advanced DSA, Major Projects, Internship" },
  { year: 4, name: "Launch", icon: "🎓", focus: "Placements, Final Project, Interviews" },
];

const QUOTES = [
  "Small steps. Big future.",
  "Your future self will thank you.",
  "Progress is progress.",
  "Keep showing up.",
  "One day at a time.",
  "Progress > perfection.",
  "You are building something.",
  "Consistency compounds.",
  "Today matters.",
];

const STORAGE_KEY = "btech-journey-data";

/* ============================================================
   DATE / DAY HELPERS
   ============================================================ */
const toISO = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().slice(0, 10);
};
const todayISO = () => toISO(new Date());
const daysBetween = (a, b) => {
  const A = new Date(a), B = new Date(b);
  A.setHours(0, 0, 0, 0); B.setHours(0, 0, 0, 0);
  return Math.round((B - A) / 86400000);
};
const addDays = (iso, n) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const fmtHuman = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
const fmtShort = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

function useJourney(student) {
  return useMemo(() => {
    const totalDays = Math.max(1, daysBetween(student.startDate, student.endDate) + 1);
    const rawDay = daysBetween(student.startDate, todayISO()) + 1;
    const dayNumber = Math.min(Math.max(rawDay, 1), totalDays);
    const percent = Math.min(100, Math.max(0, (dayNumber / totalDays) * 100));
    const yearLenDays = totalDays / 4;
    const currentYear = Math.min(4, Math.floor((dayNumber - 1) / yearLenDays) + 1);
    const semLenDays = totalDays / 8;
    const currentSem = Math.min(8, Math.floor((dayNumber - 1) / semLenDays) + 1);
    return { totalDays, dayNumber, percent, currentYear, currentSem, yearLenDays, semLenDays };
  }, [student.startDate, student.endDate]);
}

/* ============================================================
   DEMO DATA
   ============================================================ */
function seedDemo() {
  const today = todayISO();
  const startDate = addDays(today, -236);
  const endDate = addDays(startDate, 1459);

  const tasks = [
    { id: "t1", title: "Complete DBMS notes", category: "study", date: today, completed: true, priority: true, notes: "" },
    { id: "t2", title: "Solve 2 DSA problems", category: "coding", date: today, completed: true, priority: true, notes: "" },
    { id: "t3", title: "Work on project", category: "project", date: today, completed: false, priority: true, notes: "Frontend routing" },
    { id: "t4", title: "Operating Systems — 30 min", category: "study", date: today, completed: false, priority: false, notes: "" },
    { id: "t5", title: "LeetCode — 2 problems", category: "coding", date: today, completed: true, priority: false, notes: "" },
    { id: "t6", title: "Exercise", category: "personal", date: today, completed: false, priority: false, notes: "" },
    { id: "t7", title: "Read — 15 min", category: "personal", date: today, completed: false, priority: false, notes: "" },
    { id: "t8", title: "Finish DBMS assignment", category: "assignment", date: addDays(today, -3), completed: false, priority: false, notes: "", backlog: true },
    { id: "t9", title: "Update resume", category: "career", date: addDays(today, -6), completed: false, priority: false, notes: "", backlog: true },
  ];

  const goals = [
    { id: "g1", title: "Learn DSA", description: "Master data structures and algorithms end to end.", deadline: addDays(today, 200), progress: 45 },
    { id: "g2", title: "Build Portfolio", description: "3 solid projects showcasing full-stack skills.", deadline: addDays(today, 260), progress: 30 },
    { id: "g3", title: "Get an Internship", description: "Land a summer internship in software engineering.", deadline: addDays(today, 140), progress: 20 },
    { id: "g4", title: "Prepare for Placements", description: "Aptitude, HR rounds, and mock interviews.", deadline: addDays(today, 520), progress: 10 },
  ];

  const milestones = [
    { id: "m1", title: "First C++ Program", completed: true },
    { id: "m2", title: "First DSA Problem", completed: true },
    { id: "m3", title: "First 100 DSA Problems", completed: true },
    { id: "m4", title: "First Major Project", completed: true },
    { id: "m5", title: "First Hackathon", completed: false },
    { id: "m6", title: "First Internship", completed: false },
    { id: "m7", title: "First Job Interview", completed: false },
    { id: "m8", title: "First Job Offer", completed: false },
    { id: "m9", title: "Final Year Project", completed: false },
    { id: "m10", title: "Graduation", completed: false },
  ];

  const reflections = {};

  return {
    student: { name: "Student", startDate, endDate, branch: "Computer Science", college: "" },
    tasks, goals, milestones, reflections,
  };
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
const ProgressBar = ({ value, color = "var(--primary)", track = "var(--gray-soft)", height = 8 }) => (
  <div className="track" style={{ height, background: track }}>
    <div className="fill" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color, height }} />
  </div>
);

const Chip = ({ children, color, soft }) => (
  <span className="chip" style={{ color, background: soft }}>{children}</span>
);

const IconBadge = ({ Icon, color, soft, size = 34 }) => (
  <div style={{
    width: size, height: size, borderRadius: 11, background: soft, color,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>
    <Icon size={size * 0.52} />
  </div>
);

function EmptyState({ title, sub, cta, onClick, Icon = Sparkles }) {
  return (
    <div className="softcard float-in" style={{ padding: "36px 20px", textAlign: "center" }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, background: "var(--primary-soft)", color: "var(--primary)",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
      }}>
        <Icon size={20} />
      </div>
      <p className="disp" style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{title}</p>
      {sub && <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 18, maxWidth: 240, margin: "0 auto 18px" }}>{sub}</p>}
      {cta && (
        <button className="btn btn-primary" onClick={onClick} style={{ margin: "0 auto" }}>
          <Plus size={16} /> {cta}
        </button>
      )}
    </div>
  );
}

/* Circular progress ring for the hero day-counter */
function CircularRing({ percent, size = 128, stroke = 11, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  const gid = "ringGrad";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5D5FEF" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(93,95,239,0.12)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={`url(#${gid})`} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   TASK ROW
   ============================================================ */
function TaskRow({ task, onToggle, onDelete }) {
  const cat = catInfo(task.category);
  return (
    <div
      className="float-in"
      style={{
        display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 4px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
        className={`checkbox ${task.completed ? "done" : ""}`}
        onClick={() => onToggle(task.id)}
        style={{ marginTop: 2 }}
      >
        {task.completed && <CheckCircle2 size={15} color="#fff" strokeWidth={3} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14.5, fontWeight: 500,
          textDecoration: task.completed ? "line-through" : "none",
          color: task.completed ? "var(--ink-faint)" : "var(--ink)",
        }}>
          {task.title}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 5, alignItems: "center", flexWrap: "wrap" }}>
          <Chip color={cat.color} soft={cat.soft}>
            <cat.icon size={11} /> {cat.label}
          </Chip>
          {task.priority && <Chip color="var(--orange)" soft="var(--orange-soft)"><Flag size={11} />Priority</Chip>}
        </div>
      </div>
      <button
        aria-label="Delete task"
        onClick={() => onDelete(task.id)}
        className="btn-text"
        style={{ padding: 6, color: "var(--ink-faint)" }}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

/* ============================================================
   ADD TASK MODAL
   ============================================================ */
function AddTaskModal({ open, onClose, onSave, defaultDate }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("study");
  const [priority, setPriority] = useState(false);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(defaultDate);

  useEffect(() => {
    if (open) { setTitle(""); setCategory("study"); setPriority(false); setNotes(""); setDate(defaultDate); }
  }, [open, defaultDate]);

  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), category, priority, notes: notes.trim(), date });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit} style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 className="disp" style={{ fontSize: 19, fontWeight: 700 }}>Add task</h3>
            <button type="button" onClick={onClose} aria-label="Close" className="btn-text" style={{ color: "var(--ink-faint)" }}>
              <X size={20} />
            </button>
          </div>

          <label className="field-label" htmlFor="task-title">What do you want to get done?</label>
          <input
            id="task-title" className="field-input" style={{ marginBottom: 14 }}
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Solve 2 DSA problems" autoFocus
          />

          <label className="field-label" htmlFor="task-cat">Category</label>
          <select id="task-cat" className="field-select" style={{ marginBottom: 14 }} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          <label className="field-label" htmlFor="task-date">Date</label>
          <input id="task-date" type="date" className="field-input" style={{ marginBottom: 14 }} value={date} onChange={(e) => setDate(e.target.value)} />

          <label className="field-label" htmlFor="task-notes">Notes (optional)</label>
          <textarea id="task-notes" className="textarea" rows={2} style={{ marginBottom: 14, resize: "vertical" }} value={notes} onChange={(e) => setNotes(e.target.value)} />

          <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
            <input type="checkbox" checked={priority} onChange={(e) => setPriority(e.target.checked)} style={{ width: 17, height: 17 }} />
            Mark as a top priority for today
          </label>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Add task</button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   ADD GOAL MODAL
   ============================================================ */
function AddGoalModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(addDays(todayISO(), 90));

  useEffect(() => { if (open) { setTitle(""); setDescription(""); setDeadline(addDays(todayISO(), 90)); } }, [open]);
  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), deadline, progress: 0 });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit} style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 className="disp" style={{ fontSize: 19, fontWeight: 700 }}>New goal</h3>
            <button type="button" onClick={onClose} aria-label="Close" className="btn-text" style={{ color: "var(--ink-faint)" }}><X size={20} /></button>
          </div>
          <label className="field-label" htmlFor="goal-title">What do you want to achieve?</label>
          <input id="goal-title" className="field-input" style={{ marginBottom: 14 }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Learn System Design" autoFocus />
          <label className="field-label" htmlFor="goal-desc">Description</label>
          <textarea id="goal-desc" className="textarea" rows={2} style={{ marginBottom: 14, resize: "vertical" }} value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="field-label" htmlFor="goal-deadline">Target date</label>
          <input id="goal-deadline" type="date" className="field-input" style={{ marginBottom: 20 }} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Create goal</button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS MODAL
   ============================================================ */
function SettingsModal({ open, onClose, student, onSave }) {
  const [name, setName] = useState(student.name);
  const [startDate, setStartDate] = useState(student.startDate);
  const [endDate, setEndDate] = useState(student.endDate);
  const [branch, setBranch] = useState(student.branch || "");

  useEffect(() => {
    if (open) { setName(student.name); setStartDate(student.startDate); setEndDate(student.endDate); setBranch(student.branch || ""); }
  }, [open, student]);
  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    onSave({ name: name.trim() || "Student", startDate, endDate, branch: branch.trim() });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit} style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 className="disp" style={{ fontSize: 19, fontWeight: 700 }}>Your journey settings</h3>
            <button type="button" onClick={onClose} aria-label="Close" className="btn-text" style={{ color: "var(--ink-faint)" }}><X size={20} /></button>
          </div>
          <label className="field-label" htmlFor="s-name">Name</label>
          <input id="s-name" className="field-input" style={{ marginBottom: 14 }} value={name} onChange={(e) => setName(e.target.value)} />
          <label className="field-label" htmlFor="s-branch">Branch (optional)</label>
          <input id="s-branch" className="field-input" style={{ marginBottom: 14 }} value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g. Computer Science" />
          <label className="field-label" htmlFor="s-start">B.Tech start date</label>
          <input id="s-start" type="date" className="field-input" style={{ marginBottom: 14 }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label className="field-label" htmlFor="s-end">Expected graduation date</label>
          <input id="s-end" type="date" className="field-input" style={{ marginBottom: 20 }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Save</button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "planner", label: "Planner", icon: Calendar },
  { id: "journey", label: "Journey", icon: Map },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "goals", label: "Goals", icon: Target },
];

function MobileNav({ page, setPage }) {
  return (
    <nav className="navwrap-mobile" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff",
      borderTop: "1px solid var(--border)", padding: "8px 6px calc(env(safe-area-inset-bottom,0px) + 6px)",
      justifyContent: "space-around", zIndex: 30,
    }}>
      {NAV_ITEMS.map((item) => {
        const active = page === item.id;
        return (
          <button
            key={item.id} onClick={() => setPage(item.id)}
            aria-label={item.label} aria-current={active ? "page" : undefined}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "6px 10px", borderRadius: 12, background: "transparent", border: "none",
              color: active ? "var(--primary)" : "var(--ink-faint)", flex: 1,
              transition: "color .15s ease",
            }}
          >
            <div style={{
              width: 34, height: 22, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              background: active ? "var(--primary-soft)" : "transparent", transition: "background .2s ease",
            }}>
              <item.icon size={19} strokeWidth={active ? 2.4 : 2} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function DesktopSidebar({ page, setPage, journey, onOpenSettings }) {
  return (
    <aside className="navwrap-desktop" style={{
      flexDirection: "column", width: 236, flexShrink: 0, borderRight: "1px solid var(--border)",
      padding: "26px 16px", height: "100vh", position: "sticky", top: 0, background: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 30 }}>
        <div style={{ fontSize: 22 }}>🎓</div>
        <div className="disp" style={{ fontWeight: 700, fontSize: 16 }}>B.Tech Journey</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV_ITEMS.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id} onClick={() => setPage(item.id)}
              aria-current={active ? "page" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
                border: "none", background: active ? "var(--primary-soft)" : "transparent",
                color: active ? "var(--primary)" : "var(--ink-soft)", fontWeight: active ? 700 : 500,
                fontSize: 14, textAlign: "left",
              }}
            >
              <item.icon size={18} /> {item.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 20 }}>
        <div className="softcard" style={{ padding: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 6 }}>Day {journey.dayNumber} / {journey.totalDays}</div>
          <ProgressBar value={journey.percent} />
        </div>
        <button onClick={onOpenSettings} className="btn btn-ghost" style={{ width: "100%" }}>
          <Settings size={16} /> Settings
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function HomePage({ student, journey, tasks, onToggle, onOpenAdd, onOpenSettings }) {
  const todayTasks = tasks.filter((t) => t.date === todayISO());
  const priorities = todayTasks.filter((t) => t.priority);
  const completedCount = todayTasks.filter((t) => t.completed).length;
  const todayPct = todayTasks.length ? (completedCount / todayTasks.length) * 100 : 0;
  const quote = QUOTES[journey.dayNumber % QUOTES.length];
  const allDone = todayTasks.length > 0 && completedCount === todayTasks.length;

  return (
    <div style={{ padding: "24px 18px 100px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <div className="disp" style={{ fontSize: 22, fontWeight: 800 }}>🎓 B.Tech Journey</div>
          <div style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 2 }}>Welcome back, {student.name}</div>
        </div>
        <button onClick={onOpenSettings} aria-label="Open settings" className="btn-ghost btn" style={{ padding: 10, borderRadius: 12 }}>
          <Settings size={17} />
        </button>
      </div>

      <div className="card" style={{
        padding: 24, marginBottom: 18, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
      }}>
        <div className="blob" style={{ width: 180, height: 180, top: -70, right: -60, background: "var(--accent)", opacity: 0.22 }} />
        <div className="blob" style={{ width: 130, height: 130, bottom: -60, left: -40, background: "var(--green)", opacity: 0.14 }} />

        <CircularRing percent={journey.percent}>
          <div className="disp" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{journey.dayNumber}</div>
          <div style={{ fontSize: 10, color: "var(--ink-faint)", fontWeight: 700, marginTop: 1 }}>of {journey.totalDays}</div>
        </CircularRing>

        <div style={{ flex: 1, minWidth: 180, position: "relative", zIndex: 1 }}>
          <div style={{ color: "var(--primary)", fontWeight: 800, fontSize: 22 }} className="disp">
            {journey.percent.toFixed(1)}% complete
          </div>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <ProgressBar value={journey.percent} color="linear-gradient(90deg, var(--primary), var(--accent))" track="var(--gray-soft)" height={8} />
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 500 }}>
            Year {journey.currentYear} · Sem {journey.currentSem} · {YEAR_META[journey.currentYear - 1].name}
          </div>
        </div>
      </div>

      {allDone && (
        <div className="card pop-in" style={{ padding: "16px 18px", marginBottom: 18, background: "var(--green-soft)", border: "1px solid #cdeedd", display: "flex", gap: 12, alignItems: "center" }}>
          <Sparkles size={20} color="var(--green)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Day {journey.dayNumber} complete</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>You finished today's plan. One day, one step, one future.</div>
          </div>
        </div>
      )}

      <SectionTitle>Current journey</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {YEAR_META.map((y) => {
          const status = y.year < journey.currentYear ? "done" : y.year === journey.currentYear ? "active" : "upcoming";
          const yStart = (y.year - 1) * journey.yearLenDays;
          const pct = status === "done" ? 100 : status === "upcoming" ? 0 :
            Math.min(100, Math.max(0, ((journey.dayNumber - 1 - yStart) / journey.yearLenDays) * 100));
          const barColor = status === "done" ? "var(--green)" : status === "active" ? "var(--primary)" : "var(--gray)";
          const badgeBg = status === "done" ? "var(--green-soft)" : status === "active" ? "var(--primary-soft)" : "var(--gray-soft)";
          return (
            <div key={y.year} className="card card-hover" style={{
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 14,
              borderLeft: `4px solid ${barColor}`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0, fontSize: 18,
                background: badgeBg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{y.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7, gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Year {y.year} · {y.name}</div>
                  {status === "done" && <Chip color="var(--green)" soft="var(--green-soft)"><CheckCircle2 size={11} />Done</Chip>}
                  {status === "active" && <Chip color="var(--primary)" soft="var(--primary-soft)">In progress</Chip>}
                  {status === "upcoming" && <Chip color="var(--ink-faint)" soft="var(--gray-soft)">Not started</Chip>}
                </div>
                <ProgressBar value={pct} color={barColor} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <SectionTitle noMargin>Today's focus</SectionTitle>
        <button onClick={onOpenAdd} className="btn-text" style={{ fontSize: 13, fontWeight: 700 }}>+ Add task</button>
      </div>
      <div className="card" style={{ padding: 16, marginBottom: 18 }}>
        {priorities.length === 0 ? (
          <EmptyState Icon={Flag} title="No priorities set for today" sub="Pick up to 3 things that matter most." cta="Add task" onClick={onOpenAdd} />
        ) : (
          <div>
            {priorities.map((t) => <TaskRow key={t.id} task={t} onToggle={onToggle} onDelete={() => {}} />)}
          </div>
        )}
      </div>

      {todayTasks.length > 0 && (
        <div className="card" style={{ padding: 16, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            <span>Today's progress</span>
            <span style={{ color: "var(--ink-soft)" }}>{completedCount} / {todayTasks.length} tasks</span>
          </div>
          <ProgressBar value={todayPct} color="var(--green)" />
        </div>
      )}

      <div style={{ textAlign: "center", padding: "10px 0 4px", color: "var(--ink-soft)", fontSize: 13.5, fontStyle: "italic" }}>
        “{quote}”
      </div>
    </div>
  );
}

function SectionTitle({ children, noMargin }) {
  return <div className="disp" style={{ fontWeight: 700, fontSize: 15, marginBottom: noMargin ? 0 : 12 }}>{children}</div>;
}

/* ============================================================
   PLANNER PAGE
   ============================================================ */
function PlannerPage({ tasks, onToggle, onDelete, onOpenAdd, journey, reflections, onSaveReflection }) {
  const [tab, setTab] = useState("today");
  const [selDate, setSelDate] = useState(todayISO());

  const todayTasks = tasks.filter((t) => t.date === todayISO() && !t.backlog);
  const backlog = tasks.filter((t) => t.backlog && !t.completed);
  const grouped = CATEGORIES.map((c) => ({ cat: c, items: todayTasks.filter((t) => t.category === c.id) })).filter((g) => g.items.length);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(todayISO(), i));

  return (
    <div style={{ padding: "24px 18px 100px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <div className="disp" style={{ fontSize: 20, fontWeight: 700 }}>Planner</div>
          <div style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>{fmtHuman(todayISO())} · Day {journey.dayNumber}</div>
        </div>
        <button onClick={onOpenAdd} className="btn btn-primary" style={{ padding: "9px 14px" }}><Plus size={16} /> Task</button>
      </div>

      <div style={{ display: "flex", gap: 6, margin: "18px 0", background: "var(--gray-soft)", borderRadius: 14, padding: 4 }}>
        {["today", "week", "month"].map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, border: "none", padding: "8px 0", borderRadius: 11, fontWeight: 700, fontSize: 13, textTransform: "capitalize",
              background: tab === t ? "#fff" : "transparent", color: tab === t ? "var(--primary)" : "var(--ink-soft)",
              boxShadow: tab === t ? "var(--shadow)" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <>
          {todayTasks.length === 0 ? (
            <EmptyState Icon={Sparkles} title="No tasks for today" sub="A blank day is a fresh start." cta="Add task" onClick={onOpenAdd} />
          ) : (
            grouped.map(({ cat, items }) => (
              <div key={cat.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 13, fontWeight: 700, color: cat.color }}>
                  <cat.icon size={14} /> {cat.label}
                </div>
                <div className="card" style={{ padding: "2px 14px" }}>
                  {items.map((t) => <TaskRow key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}
                </div>
              </div>
            ))
          )}

          {backlog.length > 0 && (
            <div style={{ marginTop: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, fontWeight: 700, color: "var(--ink-soft)" }}>
                <Archive size={14} /> Backlog
              </div>
              <div className="card" style={{ padding: "2px 14px" }}>
                {backlog.map((t) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{t.title}</div>
                    <button className="btn-text" style={{ fontSize: 12.5, fontWeight: 700 }} onClick={() => onToggle(t.id, "moveToday")}>
                      Move to today
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ReflectionCard reflections={reflections} onSave={onSaveReflection} />
        </>
      )}

      {tab === "week" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {weekDays.map((d, i) => {
            const dayTasks = tasks.filter((t) => t.date === d && !t.backlog);
            const done = dayTasks.filter((t) => t.completed).length;
            return (
              <div key={d} className="card card-hover" style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 600 }}>{i === 0 ? "TODAY" : new Date(d).toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase()}</div>
                  <div className="disp" style={{ fontSize: 17, fontWeight: 700 }}>{new Date(d).getDate()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  {dayTasks.length === 0 ? (
                    <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>No tasks planned</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{done} / {dayTasks.length} done</div>
                      <ProgressBar value={dayTasks.length ? (done / dayTasks.length) * 100 : 0} height={6} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "month" && <MonthView tasks={tasks} selDate={selDate} setSelDate={setSelDate} />}
    </div>
  );
}

function ReflectionCard({ reflections, onSave }) {
  const key = todayISO();
  const existing = reflections[key] || { mood: null, learned: "", improve: "" };
  const [mood, setMood] = useState(existing.mood);
  const [learned, setLearned] = useState(existing.learned);
  const [improve, setImprove] = useState(existing.improve);
  const moods = ["😞", "😐", "🙂", "🔥"];

  useEffect(() => {
    const t = setTimeout(() => onSave(key, { mood, learned, improve }), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [mood, learned, improve]);

  return (
    <div className="card" style={{ padding: 18, marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
        <PenLine size={15} /> Daily reflection <span style={{ fontWeight: 400, color: "var(--ink-faint)", fontSize: 12 }}>(optional)</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {moods.map((m) => (
          <button
            key={m} onClick={() => setMood(m)} aria-label={`Mood ${m}`}
            style={{
              fontSize: 22, padding: "8px 12px", borderRadius: 12, border: "none",
              background: mood === m ? "var(--primary-soft)" : "var(--gray-soft)",
            }}
          >{m}</button>
        ))}
      </div>
      <label className="field-label">What did you learn today?</label>
      <textarea className="textarea" rows={2} style={{ marginBottom: 10, resize: "vertical" }} value={learned} onChange={(e) => setLearned(e.target.value)} />
      <label className="field-label">What should you improve tomorrow?</label>
      <textarea className="textarea" rows={2} style={{ resize: "vertical" }} value={improve} onChange={(e) => setImprove(e.target.value)} />
    </div>
  );
}

function MonthView({ tasks, selDate, setSelDate }) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startOffset }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  const taskDates = new Set(tasks.map((t) => t.date));
  const selTasks = tasks.filter((t) => t.date === selDate);

  return (
    <div>
      <div className="disp" style={{ fontWeight: 700, marginBottom: 12 }}>{now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--ink-faint)" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 18 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const iso = toISO(new Date(year, month, day));
          const isToday = iso === todayISO();
          const hasTasks = taskDates.has(iso);
          const isSel = iso === selDate;
          return (
            <button
              key={i} onClick={() => setSelDate(iso)}
              style={{
                aspectRatio: "1", borderRadius: 10, border: isToday ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                background: isSel ? "var(--primary-soft)" : "#fff", position: "relative", fontSize: 12.5,
                fontWeight: isToday ? 700 : 500, color: isToday ? "var(--primary)" : "var(--ink)",
              }}
            >
              {day}
              {hasTasks && <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
            </button>
          );
        })}
      </div>
      <SectionTitle>{fmtHuman(selDate)}</SectionTitle>
      <div className="card" style={{ padding: 16 }}>
        {selTasks.length === 0 ? (
          <div style={{ fontSize: 13.5, color: "var(--ink-faint)", textAlign: "center", padding: "10px 0" }}>No tasks on this day.</div>
        ) : selTasks.map((t) => {
          const cat = catInfo(t.category);
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px" }}>
              <cat.icon size={14} color={cat.color} />
              <span style={{ fontSize: 13.5, textDecoration: t.completed ? "line-through" : "none", color: t.completed ? "var(--ink-faint)" : "var(--ink)" }}>{t.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   JOURNEY PAGE
   ============================================================ */
function JourneyPage({ journey }) {
  const nodes = useMemo(() => {
    const list = [
      { label: "Start", type: "start", day: 1 },
      { label: "Semester 1", type: "sem", day: journey.semLenDays * 1 },
      { label: "Semester 2", type: "sem", day: journey.semLenDays * 2 },
      { label: "Year 1 complete", type: "year", day: journey.yearLenDays * 1 },
      { label: "Semester 3", type: "sem", day: journey.semLenDays * 3 },
      { label: "Semester 4", type: "sem", day: journey.semLenDays * 4 },
      { label: "Year 2 complete", type: "year", day: journey.yearLenDays * 2 },
      { label: "Internship", type: "special", day: journey.yearLenDays * 2 + journey.semLenDays * 0.3, icon: "💼" },
      { label: "Semester 5", type: "sem", day: journey.semLenDays * 5 },
      { label: "Semester 6", type: "sem", day: journey.semLenDays * 6 },
      { label: "Year 3 complete", type: "year", day: journey.yearLenDays * 3 },
      { label: "Final year", type: "special", day: journey.yearLenDays * 3 + journey.semLenDays * 0.3, icon: "🎓" },
      { label: "Semester 7", type: "sem", day: journey.semLenDays * 7 },
      { label: "Semester 8", type: "sem", day: journey.semLenDays * 8 },
      { label: "Graduation", type: "grad", day: journey.totalDays },
    ];
    return list.map((n) => ({
      ...n,
      status: journey.dayNumber >= n.day ? "done" : journey.dayNumber >= n.day - journey.semLenDays * 0.5 ? "active" : "upcoming",
    }));
  }, [journey]);

  const currentIdx = (() => {
    let idx = 0;
    nodes.forEach((n, i) => { if (journey.dayNumber >= n.day) idx = i; });
    return idx;
  })();

  // Build a winding S-curve path in a 320-wide coordinate space.
  const W = 320, ROW = 108, PAD_TOP = 40, PAD_BOTTOM = 40;
  const H = PAD_TOP + (nodes.length - 1) * ROW + PAD_BOTTOM;
  const points = nodes.map((n, i) => ({
    x: i % 2 === 0 ? 92 : W - 92,
    y: PAD_TOP + i * ROW,
  }));
  const pathD = points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + p.y) / 2;
    return `${d} C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
  }, "");
  const progressFrac = nodes.length > 1 ? currentIdx / (nodes.length - 1) : 0;

  return (
    <div style={{ padding: "24px 18px 100px", maxWidth: 640, margin: "0 auto" }}>
      <div className="disp" style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Your journey</div>
      <div style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 22 }}>
        4 years · 8 semesters · {journey.totalDays} days — this is your path to graduation.
      </div>

      <div style={{ position: "relative", width: "100%", paddingBottom: `${(H / W) * 100}%` }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5D5FEF" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <path key={f} d={pathD} stroke="var(--primary)" strokeOpacity={0.05} strokeWidth={5}
              fill="none" strokeLinecap="round"
              transform={`translate(${(f - 0.5) * 70}, 0)`} />
          ))}
          <path d={pathD} stroke="var(--gray-soft)" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path
            d={pathD} stroke="url(#pathGrad)" strokeWidth={5} fill="none" strokeLinecap="round"
            pathLength={100}
            style={{
              strokeDasharray: 100, strokeDashoffset: 100 - progressFrac * 100,
              transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </svg>

        {points.map((p, i) => {
          const n = nodes[i];
          const isRight = i % 2 === 1;
          const dotColor = n.status === "done" ? "var(--green)" : n.status === "active" ? "var(--primary)" : "#fff";
          const big = n.type === "grad" || n.type === "year";
          return (
            <div key={i} style={{
              position: "absolute", left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`,
              transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center",
              width: 128,
            }}>
              <div className={n.status === "active" ? "pulse" : ""} style={{
                width: big ? 34 : 26, height: big ? 34 : 26, borderRadius: 999, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: big ? 15 : 12,
                background: dotColor, color: n.status === "upcoming" ? "var(--ink-faint)" : "#fff",
                border: n.status === "upcoming" ? "2.5px solid var(--gray)" : "none", zIndex: 2,
                boxShadow: n.status !== "upcoming" ? "0 3px 8px rgba(27,27,58,0.15)" : "none",
              }}>
                {n.icon ? n.icon : n.type === "grad" ? <Trophy size={14} /> : n.type === "year" ? <Award size={14} /> :
                  n.status === "done" ? <CheckCircle2 size={13} /> : null}
              </div>
              <div style={{
                marginTop: 8, textAlign: "center", fontSize: big ? 12.5 : 11.5,
                fontWeight: n.type === "year" || n.type === "grad" || n.type === "special" ? 700 : 500,
                color: n.status === "upcoming" ? "var(--ink-faint)" : "var(--ink)", lineHeight: 1.25,
              }}>
                {n.label}
              </div>
              {n.status === "active" && (
                <div style={{
                  marginTop: 3, fontSize: 10.5, color: "#fff", background: "var(--primary)", fontWeight: 700,
                  padding: "2px 8px", borderRadius: 999,
                }}>
                  You are here
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   PROGRESS PAGE
   ============================================================ */
function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function ProgressPage({ journey, tasks }) {
  const byCat = CATEGORIES.map((c) => {
    const items = tasks.filter((t) => t.category === c.id);
    const done = items.filter((t) => t.completed).length;
    const pct = items.length ? Math.round((done / items.length) * 100) : Math.round(20 + seededRand(c.id.length * 7) * 50);
    return { ...c, pct };
  });

  const weeks = 14;
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const dayIdx = weeks * 7 - i;
    const level = i > weeks * 7 - journey.dayNumber - 5 ? Math.floor(seededRand(i * 3.3) * 5) : -1;
    return level;
  }).reverse();
  const heatColor = (lvl) => {
    if (lvl < 0) return "var(--gray-soft)";
    return ["#F2F2F6", "#D9D7FF", "#B3AEFF", "#7D77FF", "#5D5FEF"][lvl];
  };

  return (
    <div style={{ padding: "24px 18px 100px", maxWidth: 640, margin: "0 auto" }}>
      <div className="disp" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Progress</div>

      <div className="card" style={{ padding: 26, marginBottom: 20, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 150, height: 150, top: -60, left: -50, background: "var(--accent)", opacity: 0.18 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="disp" style={{ fontSize: 44, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{journey.percent.toFixed(1)}%</div>
          <div style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 6 }}>Day {journey.dayNumber} of {journey.totalDays}</div>
          <div style={{ marginTop: 16 }}><ProgressBar value={journey.percent} color="linear-gradient(90deg, var(--primary), var(--accent))" height={9} /></div>
        </div>
      </div>

      <SectionTitle>By area</SectionTitle>
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        {byCat.map((c) => (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 600 }}><c.icon size={14} color={c.color} />{c.label}</span>
              <span style={{ color: "var(--ink-soft)", fontWeight: 600 }}>{c.pct}%</span>
            </div>
            <ProgressBar value={c.pct} color={c.color} />
          </div>
        ))}
      </div>

      <SectionTitle>Consistency</SectionTitle>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 3, marginBottom: 10 }}>
          {cells.map((lvl, i) => (
            <div key={i} className="heatcell" style={{ background: heatColor(lvl) }} title={lvl >= 0 ? `Activity level ${lvl}` : "No data"} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-faint)", justifyContent: "flex-end" }}>
          Less {[0, 1, 2, 3, 4].map((l) => <div key={l} className="heatcell" style={{ background: heatColor(l) }} />)} More
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   GOALS PAGE
   ============================================================ */
function GoalsPage({ goals, milestones, onOpenAddGoal, onToggleMilestone, onDeleteGoal }) {
  return (
    <div style={{ padding: "24px 18px 100px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="disp" style={{ fontSize: 20, fontWeight: 700 }}>Goals</div>
        <button onClick={onOpenAddGoal} className="btn btn-primary" style={{ padding: "9px 14px" }}><Plus size={16} /> Goal</button>
      </div>

      {goals.length === 0 ? (
        <EmptyState Icon={Target} title="No goals yet" sub="What do you want to achieve before graduation?" cta="Create goal" onClick={onOpenAddGoal} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 30 }}>
          {goals.map((g) => (
            <div key={g.id} className="card card-hover" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Target size={16} color="var(--primary)" />
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{g.title}</div>
                </div>
                <button onClick={() => onDeleteGoal(g.id)} aria-label="Delete goal" className="btn-text" style={{ padding: 4, color: "var(--ink-faint)" }}><Trash2 size={14} /></button>
              </div>
              {g.description && <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>{g.description}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-faint)", margin: "12px 0 6px" }}>
                <span>Progress</span><span style={{ fontWeight: 700, color: "var(--primary)" }}>{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} />
              <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 10 }}>Target: {fmtShort(g.deadline)}</div>
            </div>
          ))}
        </div>
      )}

      <SectionTitle>Milestones</SectionTitle>
      <div className="card" style={{ padding: 8 }}>
        {milestones.map((m) => (
          <button
            key={m.id} onClick={() => onToggleMilestone(m.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", width: "100%",
              border: "none", background: "transparent", textAlign: "left", borderBottom: "1px solid var(--border)",
            }}
          >
            <div className={`checkbox ${m.completed ? "done" : ""}`} style={{ borderRadius: "999px" }}>
              {m.completed && <CheckCircle2 size={14} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{
              fontSize: 14, fontWeight: 500, color: m.completed ? "var(--ink-faint)" : "var(--ink)",
              textDecoration: m.completed ? "line-through" : "none",
            }}>
              {m.title}
            </span>
            {m.title === "Graduation" && <GraduationCap size={15} style={{ marginLeft: "auto" }} color="var(--orange)" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function BTechJourneyApp() {
  const [page, setPage] = useState("home");
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const firstLoad = useRef(true);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setData(raw ? JSON.parse(raw) : seedDemo());
    } catch (e) {
      setData(seedDemo());
    } finally {
      setLoaded(true);
    }
  }, []);

  // save
  useEffect(() => {
    if (!loaded || !data) return;
    if (firstLoad.current) { firstLoad.current = false; return; }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  }, [data, loaded]);

  const journey = useJourney(data?.student || { startDate: todayISO(), endDate: addDays(todayISO(), 1459) });

  const toggleTask = useCallback((id, action) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== id) return t;
        if (action === "moveToday") return { ...t, backlog: false, date: todayISO() };
        return { ...t, completed: !t.completed };
      }),
    }));
  }, []);

  const deleteTask = useCallback((id) => {
    setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
  }, []);

  const addTask = useCallback((task) => {
    setData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { id: `t-${Date.now()}`, completed: false, ...task }],
    }));
  }, []);

  const addGoal = useCallback((goal) => {
    setData((prev) => ({ ...prev, goals: [...prev.goals, { id: `g-${Date.now()}`, ...goal }] }));
  }, []);

  const deleteGoal = useCallback((id) => {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }, []);

  const toggleMilestone = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)),
    }));
  }, []);

  const saveReflection = useCallback((dateKey, val) => {
    setData((prev) => ({ ...prev, reflections: { ...prev.reflections, [dateKey]: val } }));
  }, []);

  const saveSettings = useCallback((student) => {
    setData((prev) => ({ ...prev, student: { ...prev.student, ...student } }));
  }, []);

  if (!loaded || !data) {
    return (
      <div className="btj" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 400 }}>
        <style>{TOKENS}</style>
        <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🎓</div>
          Loading your journey…
        </div>
      </div>
    );
  }

  return (
    <div className="btj">
      <style>{TOKENS}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div className="ambient-layer">
        <div className="ambient-blob a" style={{ width: 320, height: 320, top: "-8%", right: "-10%", background: "var(--accent)", opacity: 0.16 }} />
        <div className="ambient-blob b" style={{ width: 280, height: 280, top: "38%", left: "-12%", background: "var(--green)", opacity: 0.12 }} />
        <div className="ambient-blob a" style={{ width: 240, height: 240, bottom: "-6%", right: "18%", background: "var(--orange)", opacity: 0.1 }} />
      </div>

      <div className="content-layer" style={{ display: "flex" }}>
        <DesktopSidebar page={page} setPage={setPage} journey={journey} onOpenSettings={() => setShowSettings(true)} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {page === "home" && (
            <HomePage
              student={data.student} journey={journey} tasks={data.tasks}
              onToggle={toggleTask} onOpenAdd={() => setShowAddTask(true)} onOpenSettings={() => setShowSettings(true)}
            />
          )}
          {page === "planner" && (
            <PlannerPage
              tasks={data.tasks} onToggle={toggleTask} onDelete={deleteTask} onOpenAdd={() => setShowAddTask(true)}
              journey={journey} reflections={data.reflections} onSaveReflection={saveReflection}
            />
          )}
          {page === "journey" && <JourneyPage journey={journey} />}
          {page === "progress" && <ProgressPage journey={journey} tasks={data.tasks} />}
          {page === "goals" && (
            <GoalsPage
              goals={data.goals} milestones={data.milestones} onOpenAddGoal={() => setShowAddGoal(true)}
              onToggleMilestone={toggleMilestone} onDeleteGoal={deleteGoal}
            />
          )}
        </div>
      </div>

      <div className="content-layer">
        <MobileNav page={page} setPage={setPage} />
      </div>

      <AddTaskModal open={showAddTask} onClose={() => setShowAddTask(false)} onSave={addTask} defaultDate={todayISO()} />
      <AddGoalModal open={showAddGoal} onClose={() => setShowAddGoal(false)} onSave={addGoal} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} student={data.student} onSave={saveSettings} />

      {saveError && (
        <div style={{
          position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", background: "var(--ink)",
          color: "#fff", padding: "8px 16px", borderRadius: 12, fontSize: 12.5, zIndex: 60,
        }}>
          Couldn't save changes — they'll stay for this session.
        </div>
      )}
    </div>
  );
}

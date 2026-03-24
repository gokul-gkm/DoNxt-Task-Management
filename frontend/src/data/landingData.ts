// ─── Feature cards ─────────────────────────────────────────────────────────────
export interface Feature {
  iconName: string;
  title: string;
  desc: string;
  accent: string;
  accentLight: string;
  accentText: string;
}

export const features: Feature[] = [
  {
    iconName: "GridPlusIcon",
    title: "Project Workspaces",
    desc: "Create focused project spaces in seconds. Organise everything under one roof — goals, tasks, and timelines, neatly structured.",
    accent: "bg-blue-500",
    accentLight: "bg-blue-50",
    accentText: "text-blue-600",
  },
  {
    iconName: "TaskListIcon",
    title: "Task Management",
    desc: "Add tasks to any project, set priorities, and mark them complete with a single click. Clean, distraction-free, and fast.",
    accent: "bg-violet-500",
    accentLight: "bg-violet-50",
    accentText: "text-violet-600",
  },
  {
    iconName: "ClockIcon",
    title: "Due Date Timers",
    desc: "See a live countdown to every deadline. No more missed dates — the timer keeps you honest and your team on track.",
    accent: "bg-orange-500",
    accentLight: "bg-orange-50",
    accentText: "text-orange-600",
  },
  {
    iconName: "ChartLineIcon",
    title: "Progress Dashboard",
    desc: "A clear, beautiful dashboard showing completed tasks, pending work, and project health — all at a glance.",
    accent: "bg-emerald-500",
    accentLight: "bg-emerald-50",
    accentText: "text-emerald-600",
  },
  {
    iconName: "StarIcon",
    title: "Priority Scoring",
    desc: "High, Medium, Low — with bold visual cues so priorities are never ambiguous. Ship what truly matters, first.",
    accent: "bg-rose-500",
    accentLight: "bg-rose-50",
    accentText: "text-rose-600",
  },
  {
    iconName: "TeamPlusIcon",
    title: "Team Collaboration",
    desc: "Invite members, assign tasks, share projects. Built for small teams that communicate clearly and move fast together.",
    accent: "bg-cyan-500",
    accentLight: "bg-cyan-50",
    accentText: "text-cyan-600",
  },
];

// ─── Stats strip ──────────────────────────────────────────────────────────────
export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: "10×", label: "Faster task creation" },
  { value: "85%", label: "Avg productivity boost" },
  { value: "50k+", label: "Teams onboarded" },
  { value: "99.9%", label: "Uptime SLA" },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "DoNxt replaced four tools for us. Our sprint velocity went up 40% in the first month.",
    name: "Arjun Mehta",
    role: "Engineering Lead, Razorpay",
    avatar: "https://i.pravatar.cc/56?img=11",
  },
  {
    quote: "The timer on every task is a game-changer. We never miss deadlines anymore — it's beautifully simple.",
    name: "Priya Sharma",
    role: "Product Manager, Swiggy",
    avatar: "https://i.pravatar.cc/56?img=5",
  },
  {
    quote: "The dashboard gives me instant clarity on what's done and what's blocking us. I'm never flying blind.",
    name: "Daniel Osei",
    role: "CTO, Paystack",
    avatar: "https://i.pravatar.cc/56?img=15",
  },
];

// ─── How it works steps ───────────────────────────────────────────────────────
export interface Step {
  step: string;
  title: string;
  desc: string;
  color: string;
}

export const steps: Step[] = [
  {
    step: "01",
    title: "Create a project",
    desc: "Set up a project workspace in seconds. Name it, describe it, and you're ready to build.",
    color: "bg-blue-500 shadow-blue-100",
  },
  {
    step: "02",
    title: "Add tasks with due dates",
    desc: "Break your project into tasks, assign priority levels, and set due dates. The built-in timer tracks time remaining automatically.",
    color: "bg-violet-500 shadow-violet-100",
  },
  {
    step: "03",
    title: "Track progress and ship",
    desc: "Mark tasks complete as you go. Your dashboard updates in real-time — showing completed, pending, and overall project health at a glance.",
    color: "bg-emerald-500 shadow-emerald-100",
  },
];

// ─── Nav links ────────────────────────────────────────────────────────────────
export const navLinks = ["Features", "How it works", "Testimonials"];

// ─── Footer columns ───────────────────────────────────────────────────────────
export const footerColumns = [
  { heading: "Product", links: ["Features", "How it works", "Changelog", "Roadmap"] },
  { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { heading: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
];

// ─── Mini dashboard task rows ─────────────────────────────────────────────────
export interface DashTask {
  task: string;
  due: string;
  done: boolean;
  priority: "high" | "med" | "low";
}

export const dashTasks: DashTask[] = [
  { task: "Design onboarding screens", due: "2h 14m left", done: false, priority: "high" },
  { task: "Write API integration docs", due: "Done", done: true, priority: "med" },
  { task: "Review pull requests", due: "1d 3h left", done: false, priority: "low" },
  { task: "Set up CI pipeline", due: "Done", done: true, priority: "high" },
];

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  platform: "google_meet" | "zoom" | "teams";
  status: "upcoming" | "completed" | "cancelled";
  summary?: string;
  tags?: string[];
  transcript?: TranscriptEntry[];
  tasks?: Task[];
  keyTakeaways?: string[];
}

export interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface Task {
  id: string;
  text: string;
  assignee: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  meetingTitle: string;
  type: "summary" | "transcript" | "tasks";
  timestamp: string;
}

export const upcomingMeetings: Meeting[] = [
  {
    id: "1",
    title: "Weekly Product Sync",
    date: "2026-04-10",
    time: "10:00 AM",
    platform: "google_meet",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Biology 101 — Cell Division",
    date: "2026-04-10",
    time: "2:00 PM",
    platform: "zoom",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Sprint Retrospective",
    date: "2026-04-11",
    time: "11:30 AM",
    platform: "google_meet",
    status: "upcoming",
  },
];

export const pastMeetings: Meeting[] = [
  {
    id: "m1",
    title: "Sync with DevOps Team",
    date: "2026-04-07",
    time: "9:00 AM",
    platform: "google_meet",
    status: "completed",
    summary: "Discussed CI/CD pipeline improvements and deployment strategies for Q2. Agreed on migrating to containerized workflows.",
    tags: ["devops", "infrastructure", "sprint-14"],
    keyTakeaways: [
      "Migrate CI/CD to GitHub Actions by April 20",
      "Set up staging environment with Docker Compose",
      "Review Kubernetes config for production readiness",
      "Budget approval needed for additional cloud resources",
    ],
    tasks: [
      { id: "t1", text: "Set up GitHub Actions workflow", assignee: "Sarah", completed: true },
      { id: "t2", text: "Write Docker Compose config for staging", assignee: "Mike", completed: false },
      { id: "t3", text: "Review cloud budget with finance", assignee: "Alex", completed: false },
      { id: "t4", text: "Update deployment documentation", assignee: "Sarah", completed: false },
    ],
    transcript: [
      { timestamp: "00:00", speaker: "Alex", text: "Alright everyone, let's start with the CI/CD migration status." },
      { timestamp: "00:15", speaker: "Sarah", text: "I've been looking into GitHub Actions. It supports our stack well and we can reuse most existing scripts." },
      { timestamp: "01:02", speaker: "Mike", text: "For the staging environment, I recommend Docker Compose. It's simpler than K8s for non-prod." },
      { timestamp: "02:30", speaker: "Alex", text: "Good idea. Let's also review the cloud costs. We might need budget approval." },
      { timestamp: "03:45", speaker: "Sarah", text: "I'll draft the migration plan and share it by Friday." },
      { timestamp: "04:10", speaker: "Mike", text: "I can have the Docker setup ready by next Wednesday." },
      { timestamp: "05:00", speaker: "Alex", text: "Perfect. Let's reconvene next Monday to check progress." },
    ],
  },
  {
    id: "m2",
    title: "Biology 101 Lecture — Genetics",
    date: "2026-04-05",
    time: "2:00 PM",
    platform: "zoom",
    status: "completed",
    summary: "Comprehensive lecture on Mendelian genetics, covering dominant/recessive traits, Punnett squares, and real-world applications in medicine.",
    tags: ["education", "biology", "genetics"],
    keyTakeaways: [
      "Mendel's laws: segregation and independent assortment",
      "Punnett squares predict offspring genotype ratios",
      "Genetic disorders can follow dominant or recessive patterns",
      "Midterm covers chapters 4-6, focus on problem solving",
    ],
    tasks: [
      { id: "t5", text: "Complete genetics problem set (Ch. 5)", assignee: "Self", completed: false },
      { id: "t6", text: "Review lecture recording for Punnett squares", assignee: "Self", completed: true },
    ],
    transcript: [
      { timestamp: "00:00", speaker: "Prof. Williams", text: "Today we'll dive into Mendelian genetics and how traits are inherited." },
      { timestamp: "05:12", speaker: "Prof. Williams", text: "Mendel's first law, the law of segregation, states that allele pairs separate during gamete formation." },
      { timestamp: "12:30", speaker: "Prof. Williams", text: "Let's work through a Punnett square example with eye color." },
    ],
  },
  {
    id: "m3",
    title: "Design Review — Mobile App v2",
    date: "2026-04-03",
    time: "4:00 PM",
    platform: "teams",
    status: "completed",
    summary: "Reviewed updated mobile app designs. Discussed navigation improvements and new onboarding flow.",
    tags: ["design", "mobile", "ux"],
    keyTakeaways: [
      "Bottom navigation preferred over hamburger menu",
      "Onboarding should be max 3 screens",
      "Dark mode support required for launch",
    ],
    tasks: [
      { id: "t7", text: "Update Figma with nav changes", assignee: "Jordan", completed: true },
      { id: "t8", text: "Create dark mode color tokens", assignee: "Taylor", completed: false },
    ],
  },
  {
    id: "m4",
    title: "Agile Standup — Sprint 14",
    date: "2026-04-02",
    time: "9:15 AM",
    platform: "google_meet",
    status: "completed",
    summary: "Quick standup covering blockers and progress on user authentication module.",
    tags: ["agile", "standup", "sprint-14"],
    keyTakeaways: [
      "Auth module 70% complete",
      "Blocker: waiting on API docs from partner team",
    ],
    tasks: [
      { id: "t9", text: "Follow up on API documentation", assignee: "Alex", completed: true },
    ],
  },
];

export const recentActivity: Activity[] = [
  { id: "a1", meetingTitle: "Sync with DevOps Team", type: "summary", timestamp: "2 hours ago" },
  { id: "a2", meetingTitle: "Sync with DevOps Team", type: "tasks", timestamp: "2 hours ago" },
  { id: "a3", meetingTitle: "Biology 101 — Genetics", type: "transcript", timestamp: "2 days ago" },
  { id: "a4", meetingTitle: "Design Review — Mobile App", type: "summary", timestamp: "4 days ago" },
];

export const platformIcons: Record<string, { label: string; color: string }> = {
  google_meet: { label: "Google Meet", color: "hsl(152 60% 42%)" },
  zoom: { label: "Zoom", color: "hsl(213 90% 55%)" },
  teams: { label: "Teams", color: "hsl(264 67% 55%)" },
};

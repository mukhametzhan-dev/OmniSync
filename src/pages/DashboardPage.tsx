import { useTelegram } from "@/hooks/useTelegram";
import { upcomingMeetings, recentActivity } from "@/data/mockData";
import { PlatformBadge } from "@/components/PlatformBadge";
import {
  CalendarPlus,
  FileText,
  CheckSquare,
  Clock,
  X,
  Sparkles,
  ArrowRight,
  FileCheck,
  ListTodo,
  ScrollText,
} from "lucide-react";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onMeetingSelect: (id: string) => void;
}

const activityIcons: Record<string, typeof FileText> = {
  summary: FileCheck,
  transcript: ScrollText,
  tasks: ListTodo,
};

export function DashboardPage({ onNavigate, onMeetingSelect }: DashboardPageProps) {
  const { user } = useTelegram();

  return (
    <div className="animate-fade-in p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="rounded-2xl gradient-hero p-5 md:p-6 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <p className="text-sm opacity-80 font-medium">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-0.5">{user.firstName}! 👋</h1>
          <p className="text-sm opacity-75 mt-2 max-w-sm">
            Your AI meeting agent is ready. Schedule a bot or review your latest insights.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CalendarPlus, label: "Schedule Bot", page: "schedule", accent: "primary" },
            { icon: FileText, label: "Last Summary", page: "library", accent: "success" },
            { icon: CheckSquare, label: "My Tasks", page: "tasks", accent: "warning" },
          ].map((action) => (
            <button
              key={action.page}
              onClick={() => action.page === "library" ? onMeetingSelect("m1") : onNavigate(action.page)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card shadow-card card-hover border border-border/50 touch-target"
            >
              <div className={`p-2.5 rounded-xl bg-${action.accent}/10`}>
                <action.icon className={`h-5 w-5 text-${action.accent}`} />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming Meetings */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Upcoming Meetings</h2>
          <button onClick={() => onNavigate("schedule")} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2.5">
          {upcomingMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-card shadow-card border border-border/50 card-hover"
            >
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-accent text-accent-foreground">
                <span className="text-[10px] font-medium uppercase">
                  {new Date(meeting.date).toLocaleDateString("en", { month: "short" })}
                </span>
                <span className="text-base font-bold leading-tight">
                  {new Date(meeting.date).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{meeting.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{meeting.time}</span>
                  <PlatformBadge platform={meeting.platform} />
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors touch-target">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h2>
        <div className="rounded-2xl bg-card shadow-card border border-border/50 divide-y divide-border/50">
          {recentActivity.map((activity) => {
            const Icon = activityIcons[activity.type] ?? Sparkles;
            return (
              <div key={activity.id} className="flex items-center gap-3 px-4 py-3">
                <div className="p-1.5 rounded-lg bg-accent">
                  <Icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.meetingTitle}</p>
                  <p className="text-xs text-muted-foreground capitalize">{activity.type} generated</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

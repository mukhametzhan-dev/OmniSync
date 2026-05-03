import { useState } from "react";
import { pastMeetings, type Meeting } from "@/data/mockData";
import { PlatformBadge } from "@/components/PlatformBadge";
import { ArrowLeft, Search, CheckCircle2, Circle, Sparkles, ListChecks, ScrollText } from "lucide-react";

interface MeetingDetailPageProps {
  meetingId: string;
  onBack: () => void;
}

export function MeetingDetailPage({ meetingId, onBack }: MeetingDetailPageProps) {
  const meeting = pastMeetings.find((m) => m.id === meetingId);
  const [tasks, setTasks] = useState(meeting?.tasks ?? []);
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "tasks" | "transcript">("summary");

  if (!meeting) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Meeting not found</p>
        <button onClick={onBack} className="text-primary text-sm mt-2">Go back</button>
      </div>
    );
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const filteredTranscript = meeting.transcript?.filter((entry) =>
    transcriptSearch
      ? entry.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
        entry.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
      : true
  );

  const SummarySection = () => (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card shadow-card border border-border/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{meeting.summary}</p>
      </div>

      {meeting.keyTakeaways && (
        <div className="rounded-2xl bg-card shadow-card border border-border/50 p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Key Takeaways</h3>
          <ul className="space-y-2">
            {meeting.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const TasksSection = () => (
    <div className="rounded-2xl bg-card shadow-card border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Tasks ({tasks.filter((t) => t.completed).length}/{tasks.length})</h3>
      </div>
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-secondary/50 transition-colors text-left touch-target"
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.text}
              </p>
              <p className="text-[11px] text-muted-foreground">@{task.assignee}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const TranscriptSection = () => (
    <div className="rounded-2xl bg-card shadow-card border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ScrollText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Transcript</h3>
      </div>

      {/* Mock audio player */}
      <div className="rounded-xl bg-secondary/50 p-3 mb-3 flex items-center gap-3">
        <button className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground">
          <svg className="h-3.5 w-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </button>
        <div className="flex-1">
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full w-1/3 gradient-primary rounded-full" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">01:23</span>
            <span className="text-[10px] text-muted-foreground">05:00</span>
          </div>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search transcript..."
          value={transcriptSearch}
          onChange={(e) => setTranscriptSearch(e.target.value)}
          className="w-full h-9 pl-8 pr-3 rounded-lg bg-secondary/50 border-none text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {filteredTranscript?.map((entry, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-[10px] text-muted-foreground font-mono mt-0.5 w-10 flex-shrink-0">{entry.timestamp}</span>
            <div>
              <span className="text-xs font-semibold text-primary">{entry.speaker}</span>
              <p className="text-sm text-foreground leading-relaxed">{entry.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors touch-target">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground truncate">{meeting.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">{meeting.date} · {meeting.time}</span>
              <PlatformBadge platform={meeting.platform} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-[57px] z-10">
        {(["summary", "tasks", "transcript"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mobile Content */}
      <div className="md:hidden p-4 space-y-4">
        {activeTab === "summary" && <SummarySection />}
        {activeTab === "tasks" && <TasksSection />}
        {activeTab === "transcript" && <TranscriptSection />}
      </div>

      {/* Desktop Split View */}
      <div className="hidden md:grid grid-cols-2 gap-6 p-6 max-w-5xl mx-auto">
        <div className="space-y-4">
          <SummarySection />
          <TasksSection />
        </div>
        <div>
          <TranscriptSection />
        </div>
      </div>
    </div>
  );
}

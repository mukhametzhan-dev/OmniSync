import { useState } from "react";
import { CalendarPlus, Link as LinkIcon, FileText, Clock, ChevronDown, Sparkles } from "lucide-react";

interface SchedulePageProps {
  onNavigate: (page: string) => void;
}

const templates = ["General Meeting", "Educational Lecture", "Agile Standup", "Client Call", "Brainstorm"];

export function SchedulePage({ onNavigate }: SchedulePageProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [template, setTemplate] = useState(templates[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setLink("");
      setDate("");
      setTime("");
      onNavigate("home");
    }, 2000);
  };

  return (
    <div className="animate-fade-in p-4 md:p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Schedule Bot</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Set up OmniSync to join your next meeting</p>
      </div>

      {submitted ? (
        <div className="rounded-2xl gradient-primary p-8 text-center text-primary-foreground animate-fade-in">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold">Agent Scheduled!</h2>
          <p className="text-sm opacity-80 mt-1">OmniSync will join your meeting automatically.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Meeting Title</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Weekly Product Sync"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow touch-target"
              />
            </div>
          </div>

          {/* Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Meeting Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://meet.google.com/abc-def-ghi"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow touch-target"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
              <div className="relative">
                <CalendarPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow touch-target"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow touch-target"
                />
              </div>
            </div>
          </div>

          {/* Template */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Summarization Template</label>
            <div className="relative">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-card border border-border/50 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow touch-target"
              >
                {templates.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:shadow-lg transition-all touch-target mt-2"
          >
            Schedule OmniSync Agent
          </button>
        </form>
      )}
    </div>
  );
}

import { useState } from "react";
import { pastMeetings } from "@/data/mockData";
import { CheckCircle2, Circle } from "lucide-react";

export function TasksPage() {
  const allTasks = pastMeetings.flatMap((m) =>
    (m.tasks ?? []).map((t) => ({ ...t, meetingTitle: m.title }))
  );
  const [tasks, setTasks] = useState(allTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div className="animate-fade-in p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {pending.length} pending · {done.length} completed
        </p>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pending</h2>
          <div className="rounded-2xl bg-card shadow-card border border-border/50 divide-y divide-border/50">
            {pending.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 w-full p-3.5 text-left hover:bg-secondary/30 transition-colors touch-target"
              >
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{task.text}</p>
                  <p className="text-[11px] text-muted-foreground">
                    @{task.assignee} · {task.meetingTitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Completed</h2>
          <div className="rounded-2xl bg-card shadow-card border border-border/50 divide-y divide-border/50">
            {done.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 w-full p-3.5 text-left hover:bg-secondary/30 transition-colors touch-target"
              >
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground line-through">{task.text}</p>
                  <p className="text-[11px] text-muted-foreground">@{task.assignee}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

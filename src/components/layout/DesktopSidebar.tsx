import { Home, BookOpen, CheckSquare, Settings, CalendarPlus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopSidebarProps {
  active: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "library", label: "Library", icon: BookOpen },
  { id: "schedule", label: "Schedule", icon: CalendarPlus },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DesktopSidebar({ active, onNavigate }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-foreground">
            OmniSync <span className="text-primary">AI</span>
          </span>
          <p className="text-[10px] text-muted-foreground font-medium">AI Meeting Agent</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 touch-target",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-2xl gradient-primary p-4 text-primary-foreground">
          <p className="text-xs font-semibold mb-1">Pro Tip</p>
          <p className="text-[11px] opacity-90 leading-relaxed">
            Schedule your bot before meetings to capture every detail automatically.
          </p>
        </div>
      </div>
    </aside>
  );
}

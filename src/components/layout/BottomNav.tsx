import { Home, BookOpen, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  active: string;
  onNavigate: (page: string) => void;
}

const items = [
  { id: "home", label: "Home", icon: Home },
  { id: "library", label: "Library", icon: BookOpen },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 md:hidden">
      <div className="flex items-center justify-around py-1.5 px-2">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl touch-target transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-all duration-200",
                isActive && "bg-accent"
              )}>
                <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

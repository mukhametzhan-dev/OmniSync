import { useTelegram } from "@/hooks/useTelegram";
import { Sparkles } from "lucide-react";

export function AppHeader() {
  const { user } = useTelegram();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 glass border-b border-border/50 md:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          OmniSync <span className="text-primary">AI</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-foreground leading-tight">{user.firstName}</p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>
        <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground ring-2 ring-primary/20">
          {user.firstName[0]}
        </div>
      </div>
    </header>
  );
}

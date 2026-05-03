import { useState } from "react";
import { Bell, FileText, Link2, ChevronRight, Moon } from "lucide-react";

interface SettingItemProps {
  icon: typeof Bell;
  label: string;
  description?: string;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

function SettingItem({ icon: Icon, label, description, toggle, checked, onToggle, onClick }: SettingItemProps) {
  return (
    <button
      onClick={toggle ? onToggle : onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-secondary/30 transition-colors touch-target"
    >
      <div className="p-2 rounded-xl bg-accent">
        <Icon className="h-4 w-4 text-accent-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      </div>
      {toggle ? (
        <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${checked ? "bg-primary" : "bg-border"}`}>
          <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </div>
      ) : (
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="animate-fade-in p-4 md:p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Customize your OmniSync experience</p>
      </div>

      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Preferences</h2>
        <div className="rounded-2xl bg-card shadow-card border border-border/50 divide-y divide-border/50 overflow-hidden">
          <SettingItem
            icon={Bell}
            label="Notifications"
            description="Get alerts when summaries are ready"
            toggle
            checked={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingItem
            icon={Moon}
            label="Dark Mode"
            description="Switch to dark theme"
            toggle
            checked={darkMode}
            onToggle={handleDarkToggle}
          />
          <SettingItem
            icon={FileText}
            label="Default Template"
            description="General Meeting"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Connections</h2>
        <div className="rounded-2xl bg-card shadow-card border border-border/50 divide-y divide-border/50 overflow-hidden">
          <SettingItem icon={Link2} label="Google Account" description="alex.chen@gmail.com" />
          <SettingItem icon={Link2} label="Zoom" description="Not connected" />
          <SettingItem icon={Link2} label="Microsoft Teams" description="Not connected" />
        </div>
      </section>

      <p className="text-center text-[11px] text-muted-foreground">OmniSync AI v0.1.0 · Built with ❤️</p>
    </div>
  );
}

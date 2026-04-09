import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";

interface AppLayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function AppLayout({ children, activePage, onNavigate }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <DesktopSidebar active={activePage} onNavigate={onNavigate} />
      <div className="flex flex-1 flex-col min-w-0">
        <div className="md:hidden">
          <AppHeader />
        </div>
        <main className="flex-1 overflow-y-auto pb-20 md:pb-4">
          {children}
        </main>
        <BottomNav active={activePage} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

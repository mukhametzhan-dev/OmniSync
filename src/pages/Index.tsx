import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { MeetingDetailPage } from "@/pages/MeetingDetailPage";
import { SchedulePage } from "@/pages/SchedulePage";
import { TasksPage } from "@/pages/TasksPage";
import { SettingsPage } from "@/pages/SettingsPage";

export default function Index() {
  const [page, setPage] = useState("home");
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);

  const handleMeetingSelect = (id: string) => {
    setSelectedMeeting(id);
    setPage("detail");
  };

  const handleBack = () => {
    setSelectedMeeting(null);
    setPage("library");
  };

  const renderPage = () => {
    if (page === "detail" && selectedMeeting) {
      return <MeetingDetailPage meetingId={selectedMeeting} onBack={handleBack} />;
    }
    switch (page) {
      case "home":
        return <DashboardPage onNavigate={setPage} onMeetingSelect={handleMeetingSelect} />;
      case "library":
        return <LibraryPage onMeetingSelect={handleMeetingSelect} />;
      case "schedule":
        return <SchedulePage onNavigate={setPage} />;
      case "tasks":
        return <TasksPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setPage} onMeetingSelect={handleMeetingSelect} />;
    }
  };

  return (
    <AppLayout activePage={page} onNavigate={setPage}>
      {renderPage()}
    </AppLayout>
  );
}

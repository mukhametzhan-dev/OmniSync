import { useState } from "react";
import { pastMeetings } from "@/data/mockData";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";

interface LibraryPageProps {
  onMeetingSelect: (id: string) => void;
}

export function LibraryPage({ onMeetingSelect }: LibraryPageProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = pastMeetings.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Meeting Library</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Browse and search your past meetings</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search meetings, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-4 rounded-xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
          />
        </div>
        <button className="h-11 w-11 flex items-center justify-center rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-colors">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <div className="hidden md:flex items-center bg-card border border-border/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Meeting Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-2.5"}>
        {filtered.map((meeting) => (
          <button
            key={meeting.id}
            onClick={() => onMeetingSelect(meeting.id)}
            className="w-full text-left p-4 rounded-2xl bg-card shadow-card border border-border/50 card-hover"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{meeting.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground">{meeting.date}</span>
                  <PlatformBadge platform={meeting.platform} />
                </div>
              </div>
            </div>
            {meeting.summary && (
              <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">{meeting.summary}</p>
            )}
            {meeting.tags && meeting.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {meeting.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No meetings found</p>
        </div>
      )}
    </div>
  );
}

import { Video, Camera, Headphones } from "lucide-react";

const icons: Record<string, typeof Video> = {
  google_meet: Video,
  zoom: Camera,
  teams: Headphones,
};

const colors: Record<string, string> = {
  google_meet: "bg-success/10 text-success",
  zoom: "bg-primary/10 text-primary",
  teams: "bg-[hsl(264_67%_55%/0.1)] text-[hsl(264_67%_55%)]",
};

const labels: Record<string, string> = {
  google_meet: "Meet",
  zoom: "Zoom",
  teams: "Teams",
};

export function PlatformBadge({ platform }: { platform: string }) {
  const Icon = icons[platform] ?? Video;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${colors[platform] ?? "bg-muted text-muted-foreground"}`}>
      <Icon className="h-3 w-3" />
      {labels[platform] ?? platform}
    </span>
  );
}

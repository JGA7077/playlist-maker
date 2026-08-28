import type { DeezerTrack } from "@/lib/types";
import { formatDuration } from "@/lib/format";

interface TrackCardProps {
  track: DeezerTrack;
  selected: boolean;
  onToggle: (track: DeezerTrack) => void;
  disabled?: boolean;
}

export default function TrackCard({
  track,
  selected,
  onToggle,
  disabled,
}: TrackCardProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
        selected
          ? "border-[#A238FF] bg-[#A238FF]/10"
          : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <input
        type="checkbox"
        checked={selected}
        disabled={disabled}
        onChange={() => onToggle(track)}
        className="h-4 w-4 accent-[#A238FF]"
      />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{track.title}</p>
        <p className="truncate text-xs text-zinc-500">
          {track.artist?.name}
          {track.album?.title ? ` • ${track.album.title}` : ""}
        </p>
      </div>
      <span className="shrink-0 text-xs tabular-nums text-zinc-500">
        {formatDuration(track.duration)}
      </span>
    </label>
  );
}

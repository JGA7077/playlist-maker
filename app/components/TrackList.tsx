"use client";

import type { DeezerTrack } from "@/lib/types";
import TrackCard from "./TrackCard";

interface TrackListProps {
  tracks: DeezerTrack[];
  selectedIds: Set<number>;
  onToggle: (track: DeezerTrack) => void;
  groupByArtist?: boolean;
}

export default function TrackList({
  tracks,
  selectedIds,
  onToggle,
  groupByArtist = false,
}: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        Nenhuma música encontrada.
      </p>
    );
  }

  if (groupByArtist) {
    const groups = new Map<number, { artistName: string; tracks: DeezerTrack[] }>();
    for (const t of tracks) {
      const artistId = t.artist?.id ?? 0;
      if (!groups.has(artistId)) {
        groups.set(artistId, {
          artistName: t.artist?.name ?? "Desconhecido",
          tracks: [],
        });
      }
      groups.get(artistId)!.tracks.push(t);
    }

    return (
      <div className="space-y-6">
        {[...groups.entries()].map(([artistId, group]) => (
          <div key={artistId}>
            <h3 className="mb-2 px-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {group.artistName}{" "}
              <span className="font-normal text-zinc-500">
                ({group.tracks.filter((t) => selectedIds.has(t.id)).length}
                /{group.tracks.length})
              </span>
            </h3>
            <div className="flex flex-col gap-1">
              {group.tracks.map((t) => (
                <TrackCard
                  key={t.id}
                  track={t}
                  selected={selectedIds.has(t.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {tracks.map((t) => (
        <TrackCard
          key={t.id}
          track={t}
          selected={selectedIds.has(t.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

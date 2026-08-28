"use client";

import type { DeezerAlbum } from "@/lib/types";
import { formatDate, formatFans } from "@/lib/format";

interface AlbumCardProps {
  album: DeezerAlbum;
  selected: boolean;
  onToggle: (album: DeezerAlbum) => void;
}

export default function AlbumCard({
  album,
  selected,
  onToggle,
}: AlbumCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(album)}
      className={`group flex flex-col gap-2 overflow-hidden rounded-xl border-2 bg-white dark:bg-zinc-900 text-left transition-all ${
        selected
          ? "border-[#A238FF] shadow-lg"
          : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      <div className="relative">
        {album.cover_big ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={album.cover_big}
            alt={album.title}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-4xl text-zinc-400">
            💿
          </div>
        )}
        {selected && (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#A238FF] text-white text-sm">
            ✓
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 px-3 pb-3">
        <span className="line-clamp-2 text-sm font-semibold leading-tight">
          {album.title}
        </span>
        <span className="text-xs text-zinc-500">
          {formatDate(album.release_date)} • {album.nb_tracks ?? 0} faixas
        </span>
        {album.fans ? (
          <span className="text-xs text-zinc-500">
            {formatFans(album.fans)} fãs
          </span>
        ) : null}
      </div>
    </button>
  );
}

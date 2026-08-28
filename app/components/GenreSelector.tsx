"use client";

import { useEffect, useState } from "react";
import type { DeezerGenre } from "@/lib/types";
import { getGenresAction } from "@/app/actions/deezer";
import { Spinner } from "./ui/Spinner";

interface GenreSelectorProps {
  selectedGenreId: number | null;
  onSelect: (genre: DeezerGenre) => void;
}

export default function GenreSelector({
  selectedGenreId,
  onSelect,
}: GenreSelectorProps) {
  const [genres, setGenres] = useState<DeezerGenre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getGenresAction();
        setGenres(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-zinc-500">
        <Spinner className="h-4 w-4" /> Carregando gêneros...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {genres
        .filter((g) => g.id !== 0 && g.name !== "Alle")
        .map((genre) => {
          const selected = selectedGenreId === genre.id;
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => onSelect(genre)}
              className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
                selected
                  ? "border-[#A238FF] shadow-lg"
                  : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {genre.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={genre.picture}
                  alt={genre.name}
                  className="h-24 w-full object-cover opacity-80 transition-transform group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="text-sm font-semibold text-white">
                  {genre.name}
                </span>
              </div>
              {selected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#A238FF] text-xs text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
    </div>
  );
}

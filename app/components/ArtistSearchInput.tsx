"use client";

import { useEffect, useRef, useState } from "react";
import type { DeezerArtist } from "@/lib/types";
import { searchArtistsAction } from "@/app/actions/deezer";
import { Input } from "./ui/Input";
import { Spinner } from "./ui/Spinner";

interface ArtistSearchInputProps {
  onSelect: (artist: DeezerArtist) => void;
  placeholder?: string;
}

export default function ArtistSearchInput({
  onSelect,
  placeholder = "Buscar banda ou artista...",
}: ArtistSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DeezerArtist[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchArtistsAction(query.trim());
        setResults(data);
        setOpen(data.length > 0);
      } catch (err) {
        console.error(err);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setResults([]);
    setOpen(false);
  }

  function handleSelect(artist: DeezerArtist) {
    onSelect(artist);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner className="h-4 w-4" />
        </span>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
          {results.map((artist) => (
            <li key={artist.id}>
              <button
                type="button"
                onMouseDown={() => handleSelect(artist)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {artist.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artist.picture}
                    alt={artist.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500">
                    ♪
                  </span>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{artist.name}</span>
                  <span className="text-xs text-zinc-500">
                    {artist.nb_fan
                      ? `${artist.nb_fan.toLocaleString("pt-BR")} fãs`
                      : "Artista"}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

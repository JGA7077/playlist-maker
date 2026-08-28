"use client";

import { useState } from "react";
import type { DeezerGenre } from "@/lib/types";
import { getGenreArtistsAction } from "@/app/actions/deezer";
import BandSearchPanel from "@/app/components/BandSearchPanel";
import GenreSelector from "@/app/components/GenreSelector";
import { Spinner } from "@/app/components/ui/Spinner";
import { formatFans } from "@/lib/format";

const MAX_BANDS = 10;

export default function ByGenrePage() {
  const [genre, setGenre] = useState<DeezerGenre | null>(null);
  const [artists, setArtists] = useState<
    { id: number; name: string; picture?: string; nb_fan?: number }[]
  >([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [bandInput, setBandInput] = useState("");

  async function handleGenreSelect(g: DeezerGenre) {
    setGenre(g);
    setArtists([]);
    setLoadingArtists(true);
    try {
      const data = await getGenreArtistsAction(g.id);
      setArtists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingArtists(false);
    }
  }

  function addArtistToInput(name: string) {
    setBandInput((prev) => {
      const existing = new Set(
        prev
          .split(/[\n,]/)
          .map((b) => b.trim().toLowerCase())
          .filter((b) => b.length > 0)
      );
      if (existing.has(name.toLowerCase()) || existing.size >= MAX_BANDS) {
        return prev;
      }
      return prev.trim() ? `${prev.trim()}, ${name}` : name;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-40 pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Buscar por gênero</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Escolha um estilo para ver as bandas mais ouvidas e monte sua
          playlist.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          1. Escolha o gênero
        </h2>
        <GenreSelector
          selectedGenreId={genre?.id ?? null}
          onSelect={handleGenreSelect}
        />
      </div>

      {loadingArtists && (
        <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
          <Spinner className="h-4 w-4" /> Carregando bandas mais ouvidas...
        </div>
      )}

      {artists.length > 0 && !loadingArtists && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            2. Bandas mais ouvidas de{" "}
            <span className="text-[#A238FF]">{genre?.name}</span>{" "}
            <span className="font-normal text-zinc-500">(clique para adicionar)</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {artists.map((artist) => (
              <button
                key={artist.id}
                type="button"
                onClick={() => addArtistToInput(artist.name)}
                className="group flex flex-col items-center gap-2 rounded-xl border-2 border-transparent p-3 text-center transition-all hover:border-[#A238FF] hover:bg-[#A238FF]/10"
              >
                {artist.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artist.picture}
                    alt={artist.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 text-2xl">
                    ♪
                  </span>
                )}
                <span className="text-sm font-semibold leading-tight">
                  {artist.name}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatFans(artist.nb_fan)} fãs
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          3. Informe as bandas e a quantidade de músicas
        </h2>
        <BandSearchPanel
          bandInput={bandInput}
          onBandInputChange={setBandInput}
        />
      </div>
    </div>
  );
}

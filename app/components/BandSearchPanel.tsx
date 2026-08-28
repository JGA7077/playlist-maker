"use client";

import { useState } from "react";
import type { DeezerTrack } from "@/lib/types";
import { getTopTracksForArtistNameAction } from "@/app/actions/deezer";
import TrackList from "./TrackList";
import PlaylistBuilder from "./PlaylistBuilder";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Spinner } from "./ui/Spinner";

const MAX_BANDS = 10;

interface BandError {
  name: string;
  message: string;
}

interface BandSearchPanelProps {
  placeholder?: string;
  hint?: string;
  bandInput?: string;
  onBandInputChange?: (value: string) => void;
}

export default function BandSearchPanel({
  placeholder = "Ex.: Depeche Mode, U2, Tears for Fears",
  hint = "Uma banda por linha ou separadas por vírgula.",
  bandInput,
  onBandInputChange,
}: BandSearchPanelProps) {
  const [internalInput, setInternalInput] = useState("");
  const [tracksPerBand, setTracksPerBand] = useState(5);
  const [tracks, setTracks] = useState<DeezerTrack[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [errors, setErrors] = useState<BandError[]>([]);

  const isControlled = bandInput !== undefined && onBandInputChange !== undefined;
  const currentInput = isControlled ? (bandInput ?? "") : internalInput;

  function setInput(value: string) {
    if (isControlled) {
      onBandInputChange!(value);
    } else {
      setInternalInput(value);
    }
  }

  function parseBandNames(): string[] {
    return currentInput
      .split(/[\n,]/)
      .map((b) => b.trim())
      .filter((b) => b.length > 0);
  }

  async function fetchTracks() {
    const names = parseBandNames();
    if (names.length === 0) return;

    if (names.length > MAX_BANDS) {
      setErrors([{ name: "", message: `No máximo ${MAX_BANDS} bandas por vez.` }]);
      return;
    }

    setLoading(true);
    setProgress(null);
    setErrors([]);
    setSelectedIds(new Set());
    setTracks([]);

    const results: DeezerTrack[] = [];
    const bandErrors: BandError[] = [];

    for (const name of names) {
      setProgress(`Buscando ${name}...`);
      try {
        const found = await getTopTracksForArtistNameAction(
          name,
          tracksPerBand
        );
        if (!found) {
          bandErrors.push({ name, message: "Banda não encontrada." });
          continue;
        }
        results.push(...found.tracks);
      } catch (err) {
        console.error(err);
        bandErrors.push({ name, message: "Erro ao buscar as músicas." });
      }
    }

    setTracks(results);
    setSelectedIds(new Set(results.map((t) => t.id)));
    setErrors(bandErrors);
    setProgress(null);
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6 grid gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label
            htmlFor="bands"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Bandas (máximo {MAX_BANDS})
          </label>
          <textarea
            id="bands"
            value={currentInput}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder={placeholder}
            className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#A238FF]"
          />
          <p className="mt-1 text-xs text-zinc-500">{hint}</p>
        </div>

        <div className="sm:w-40">
          <label
            htmlFor="tracks-per-band"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Músicas por banda
          </label>
          <Input
            id="tracks-per-band"
            type="number"
            min={1}
            max={50}
            value={tracksPerBand}
            onChange={(e) =>
              setTracksPerBand(Math.max(1, Math.min(50, Number(e.target.value) || 1)))
            }
          />
        </div>
      </div>

      <div className="mb-8">
        <Button
          onClick={fetchTracks}
          disabled={parseBandNames().length === 0 || loading}
          isLoading={loading}
          size="lg"
        >
          Buscar músicas
        </Button>
      </div>

      {loading && progress && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
          <Spinner className="h-4 w-4" />
          {progress}
        </div>
      )}

      {errors.length > 0 && !loading && (
        <div className="mb-6 space-y-2">
          {errors.map((err, i) => (
            <p
              key={i}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              {err.name ? (
                <>
                  <strong>{err.name}:</strong> {err.message}
                </>
              ) : (
                err.message
              )}
            </p>
          ))}
        </div>
      )}

      {tracks.length > 0 && !loading && (
        <>
          <TrackList
            tracks={tracks}
            selectedIds={selectedIds}
            onToggle={(track) =>
              setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(track.id)) next.delete(track.id);
                else next.add(track.id);
                return next;
              })
            }
            groupByArtist
          />
          <PlaylistBuilder tracks={tracks} selectedIds={selectedIds} />
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { DeezerTrack } from "@/lib/types";
import { savePlaylistToYoutubeAction } from "@/app/actions/youtube";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface PlaylistBuilderProps {
  tracks: DeezerTrack[]; // flat list of all possible tracks
  selectedIds: Set<number>;
}

interface SaveResult {
  url: string;
  title: string;
}

export default function PlaylistBuilder({
  tracks,
  selectedIds,
}: PlaylistBuilderProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SaveResult | null>(null);

  const selectedTracks = tracks.filter((t) => selectedIds.has(t.id));
  const count = selectedTracks.length;

  async function handleSave() {
    if (count === 0) return;
    const name = playlistName.trim() || `Playlist ${new Date().toLocaleDateString("pt-BR")}`;
    setSaving(true);
    setError(null);
    setResult(null);
    try {
      const res = await savePlaylistToYoutubeAction({
        title: name,
        tracks: selectedTracks.map((t) => ({
          artist: t.artist?.name ?? "",
          title: t.title,
        })),
      });
      setResult({ url: res.url, title: res.title });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Erro ao salvar a playlist."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[#A238FF]">
            {count} {count === 1 ? "música" : "músicas"}
          </span>
          <Input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Nome da playlist"
            className="sm:w-72"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            isLoading={saving}
            disabled={count === 0}
            className="sm:ml-auto"
          >
            Salvar no YouTube
          </Button>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            Playlist <strong>{result.title}</strong> salva com sucesso!{" "}
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              Abrir no YouTube
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

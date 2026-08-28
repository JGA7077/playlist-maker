"use client";

import { useMemo, useState } from "react";
import type { DeezerAlbum, DeezerArtist, DeezerTrack } from "@/lib/types";
import { getArtistAlbumsAction, getAlbumAction } from "@/app/actions/deezer";
import ArtistSearchInput from "@/app/components/ArtistSearchInput";
import AlbumCard from "@/app/components/AlbumCard";
import TrackList from "@/app/components/TrackList";
import PlaylistBuilder from "@/app/components/PlaylistBuilder";
import { Button } from "@/app/components/ui/Button";
import { Spinner } from "@/app/components/ui/Spinner";

type SortMode = "popular" | "release";

export default function ByAlbumsPage() {
  const [artist, setArtist] = useState<DeezerArtist | null>(null);
  const [albums, setAlbums] = useState<DeezerAlbum[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("popular");
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<Set<number>>(
    new Set()
  );
  const [tracks, setTracks] = useState<DeezerTrack[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(false);

  async function handleArtistSelect(a: DeezerArtist) {
    setArtist(a);
    setAlbums([]);
    setSelectedAlbumIds(new Set());
    setTracks([]);
    setSelectedIds(new Set());
    setLoading(true);
    try {
      const data = await getArtistAlbumsAction(a.id);
      setAlbums(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const sortedAlbums = useMemo(() => {
    const filtered = albums.filter((album) => album.record_type === "album");
    const arr = [...filtered];
    if (sortMode === "popular") {
      arr.sort((a, b) => (b.fans ?? 0) - (a.fans ?? 0));
    } else {
      arr.sort((a, b) => {
        const da = a.release_date ? new Date(a.release_date).getTime() : 0;
        const db = b.release_date ? new Date(b.release_date).getTime() : 0;
        return db - da;
      });
    }
    return arr;
  }, [albums, sortMode]);

  function toggleAlbum(album: DeezerAlbum) {
    setSelectedAlbumIds((prev) => {
      const next = new Set(prev);
      if (next.has(album.id)) {
        next.delete(album.id);
      } else {
        next.add(album.id);
      }
      return next;
    });
  }

  function toggleTrack(track: DeezerTrack) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(track.id)) {
        next.delete(track.id);
      } else {
        next.add(track.id);
      }
      return next;
    });
  }

  async function fetchAlbumTracks() {
    const selectedAlbums = albums.filter((a) => selectedAlbumIds.has(a.id));
    if (selectedAlbums.length === 0) return;
    setLoadingTracks(true);
    setTracks([]);
    setSelectedIds(new Set());
    try {
      const results: DeezerTrack[] = [];
      for (const album of selectedAlbums) {
        const detail = await getAlbumAction(album.id);
        const albumTracks = detail.tracks?.data ?? [];
        for (const t of albumTracks) {
          results.push({ ...t, album });
        }
      }
      setTracks(results);
      setSelectedIds(new Set(results.map((t) => t.id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTracks(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-40 pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Buscar por álbuns</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Escolha uma banda, filtre pelos álbuns mais ouvidos ou por lançamento.
        </p>
      </div>

      <div className="mb-6 max-w-md">
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Buscar banda
        </label>
        <ArtistSearchInput
          onSelect={handleArtistSelect}
          placeholder="Buscar banda ou artista..."
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Spinner className="h-4 w-4" /> Carregando álbuns...
        </div>
      )}

      {albums.length > 0 && !loading && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              Álbuns de{" "}
              <span className="text-[#A238FF]">{artist?.name}</span>
            </h2>
            <div className="flex gap-2">
              <Button
                variant={sortMode === "popular" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSortMode("popular")}
              >
                Mais ouvidos
              </Button>
              <Button
                variant={sortMode === "release" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSortMode("release")}
              >
                Por lançamento
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {sortedAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                selected={selectedAlbumIds.has(album.id)}
                onToggle={toggleAlbum}
              />
            ))}
          </div>

          <div className="mt-6">
            <Button
              onClick={fetchAlbumTracks}
              disabled={selectedAlbumIds.size === 0 || loadingTracks}
              isLoading={loadingTracks}
              size="lg"
            >
              Adicionar músicas dos álbuns selecionados (
              {selectedAlbumIds.size})
            </Button>
          </div>
        </>
      )}

      {tracks.length > 0 && (
        <div className="mt-6">
          <TrackList
            tracks={tracks}
            selectedIds={selectedIds}
            onToggle={toggleTrack}
          />
        </div>
      )}

      {tracks.length > 0 && (
        <PlaylistBuilder tracks={tracks} selectedIds={selectedIds} />
      )}
    </div>
  );
}

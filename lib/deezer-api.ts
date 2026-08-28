import type {
  DeezerAlbum,
  DeezerArtist,
  DeezerGenre,
  DeezerSearchResult,
  DeezerTrack,
  DeezerUser,
} from "./types";

const BASE_URL = "https://api.deezer.com";
const MAX_TRACKS_PER_REQUEST = 100;

async function getJson<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Deezer API error (${res.status}) for ${path}`);
  }
  const data = await res.json();
  if (data?.error) {
    throw new Error(`Deezer API error: ${data.error.message || "unknown"}`);
  }
  return data as T;
}

export async function searchArtists(query: string): Promise<DeezerArtist[]> {
  const q = encodeURIComponent(query);
  const result = await getJson<DeezerSearchResult<DeezerArtist>>(
    `/search/artist?q=${q}&limit=10`
  );
  return result.data;
}

export async function searchArtistTracks(
  artistId: number,
  limit = 20
): Promise<DeezerTrack[]> {
  const result = await getJson<DeezerSearchResult<DeezerTrack>>(
    `/artist/${artistId}/top?limit=${limit}`
  );
  return result.data;
}

export interface ArtistTracksResult {
  artist: DeezerArtist;
  tracks: DeezerTrack[];
}

export async function getTopTracksForArtistName(
  name: string,
  limit = 5
): Promise<ArtistTracksResult | null> {
  const artists = await searchArtists(name);
  if (artists.length === 0) {
    return null;
  }
  const artist = artists.reduce((best, a) =>
    (a.nb_fan ?? 0) > (best.nb_fan ?? 0) ? a : best
  );
  const tracks = await searchArtistTracks(artist.id, limit);
  return { artist, tracks };
}

export async function getGenres(): Promise<DeezerGenre[]> {
  const result = await getJson<DeezerSearchResult<DeezerGenre>>(`/genre`);
  return result.data;
}

export async function getGenreArtists(
  genreId: number,
  limit = 15
): Promise<DeezerArtist[]> {
  // O endpoint /chart/{genreId}/artists retorna o chart global (incorreto por gênero).
  // Derivamos os artistas mais ouvidos a partir das top tracks do gênero.
  const result = await getJson<DeezerSearchResult<DeezerTrack>>(
    `/chart/${genreId}/tracks?limit=200`
  );
  const seen = new Set<number>();
  const artists: DeezerArtist[] = [];
  for (const track of result.data) {
    const a = track.artist;
    if (a?.id && !seen.has(a.id)) {
      seen.add(a.id);
      artists.push(a);
    }
  }
  const top = artists.slice(0, limit);
  const enriched = await Promise.all(
    top.map((a) => getArtist(a.id).catch(() => a))
  );
  return enriched;
}

export async function getArtistAlbums(
  artistId: number
): Promise<DeezerAlbum[]> {
  const result = await getJson<DeezerSearchResult<DeezerAlbum>>(
    `/artist/${artistId}/albums?limit=50`
  );
  return result.data;
}

export async function getArtist(artistId: number): Promise<DeezerArtist> {
  return getJson<DeezerArtist>(`/artist/${artistId}`);
}

export async function getAlbum(albumId: number): Promise<DeezerAlbum> {
  return getJson<DeezerAlbum>(`/album/${albumId}`);
}

export async function getMyUserInfo(token: string): Promise<DeezerUser> {
  return getJson<DeezerUser>(`/user/me?access_token=${token}`);
}

export interface CreatePlaylistResult {
  id: string;
  link: string;
  title: string;
}

export async function createDeezerPlaylist(
  token: string,
  title: string,
  description?: string
): Promise<CreatePlaylistResult> {
  const params = new URLSearchParams({ access_token: token, title });
  if (description) {
    params.set("description", description);
  }
  const res = await fetch(`${BASE_URL}/user/me/playlists?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (data?.error) {
    throw new Error(`Deezer API error: ${data.error.message || "unknown"}`);
  }
  return { id: String(data.id), link: data.link, title: data.title };
}

export async function addTracksToDeezerPlaylist(
  token: string,
  playlistId: string,
  trackIds: number[]
): Promise<void> {
  for (let i = 0; i < trackIds.length; i += MAX_TRACKS_PER_REQUEST) {
    const batch = trackIds.slice(i, i + MAX_TRACKS_PER_REQUEST);
    const params = new URLSearchParams({
      access_token: token,
      songs: batch.join(","),
    });
    const res = await fetch(
      `${BASE_URL}/playlist/${playlistId}/tracks?${params.toString()}`,
      { method: "POST" }
    );
    const data = await res.json();
    if (data?.error) {
      throw new Error(`Deezer API error: ${data.error.message || "unknown"}`);
    }
  }
}

export async function savePlaylist(
  token: string,
  title: string,
  trackIds: number[],
  description?: string
): Promise<CreatePlaylistResult> {
  const playlist = await createDeezerPlaylist(token, title, description);
  if (trackIds.length > 0) {
    await addTracksToDeezerPlaylist(token, playlist.id, trackIds);
  }
  return playlist;
}

export const DEEZER_CONSTANTS = {
  MAX_TRACKS_PER_PLAYLIST: 2000,
};

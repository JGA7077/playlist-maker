import { getYoutubeAccessToken } from "./sessionTokens";

const YT_BASE = "https://www.googleapis.com/youtube/v3";

interface YoutubePlaylistResult {
  id: string;
  url: string;
  title: string;
}

interface YtResponse {
  ok: boolean;
  status: number;
  data: {
    id?: string;
    snippet?: { title?: string };
    items?: { id?: { videoId?: string } }[];
    error?: { message?: string };
  };
}

async function ytRequest(
  path: string,
  options: { method?: string; body?: object } = {}
): Promise<YtResponse> {
  const authToken = await getYoutubeAccessToken();
  if (!authToken) {
    return { ok: false, status: 401, data: { error: { message: "Não autenticado." } } };
  }

  const isUpload = options.body !== undefined;
  const url = `${YT_BASE}${path}`;
  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${authToken.token}`,
      ...(isUpload
        ? { "Content-Type": "application/json" }
        : { Accept: "application/json" }),
    },
    body: isUpload ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function createYoutubePlaylist(
  title: string,
  description?: string
): Promise<YoutubePlaylistResult> {
  const { ok, status, data } = await ytRequest(`/playlists?part=snippet%2Cstatus`, {
    method: "POST",
    body: {
      snippet: { title, description: description ?? "" },
      status: { privacyStatus: "private" },
    },
  });
  if (!ok) {
    throw new Error(
      `Erro ao criar playlist no YouTube (${status}): ${
        data?.error?.message ?? "desconhecido"
      }`
    );
  }
  return {
    id: data.id!,
    url: `https://www.youtube.com/playlist?list=${data.id}`,
    title: data.snippet!.title!,
  };
}

export async function searchYoutubeVideo(
  query: string
): Promise<string | null> {
  const q = encodeURIComponent(query);
  const { ok, status, data } = await ytRequest(
    `/search?part=snippet&maxResults=5&type=video&videoCategoryId=10&q=${q}`
  );
  if (!ok) {
    throw new Error(
      `Erro ao buscar vídeo no YouTube (${status}): ${
        data?.error?.message ?? "desconhecido"
      }`
    );
  }
  return data?.items?.[0]?.id?.videoId ?? null;
}

export async function addVideoToYoutubePlaylist(
  playlistId: string,
  videoId: string
): Promise<void> {
  const { ok, status, data } = await ytRequest(
    `/playlistItems?part=snippet`,
    {
      method: "POST",
      body: {
        snippet: {
          playlistId,
          resourceId: { kind: "youtube#video", videoId },
        },
      },
    }
  );
  if (!ok) {
    throw new Error(
      `Erro ao adicionar vídeo à playlist (${status}): ${
        data?.error?.message ?? "desconhecido"
      }`
    );
  }
}

export async function savePlaylistToYoutube(
  title: string,
  searchQueries: string[],
  description?: string
): Promise<YoutubePlaylistResult> {
  const playlist = await createYoutubePlaylist(title, description);
  for (const query of searchQueries) {
    if (!query.trim()) continue;
    const videoId = await searchYoutubeVideo(query);
    if (!videoId) continue;
    await addVideoToYoutubePlaylist(playlist.id, videoId);
  }
  return playlist;
}

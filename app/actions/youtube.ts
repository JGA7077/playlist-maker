"use server";

import { redirect } from "next/navigation";
import { getConnectedUser } from "@/lib/session";
import { savePlaylistToYoutube } from "@/lib/youtube-api";

export interface SavePlaylistInput {
  title: string;
  tracks: { artist: string; title: string }[];
  description?: string;
}

export async function savePlaylistToYoutubeAction(
  input: SavePlaylistInput
): Promise<{ url: string; title: string; added: number }> {
  const user = await getConnectedUser();
  if (!user) {
    redirect("/connect");
  }

  const queries = input.tracks.map((t) => `${t.artist} ${t.title}`.trim());
  const result = await savePlaylistToYoutube(
    input.title,
    queries,
    input.description
  );

  return { url: result.url, title: result.title, added: input.tracks.length };
}

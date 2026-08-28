"use server";

import {
  searchArtists,
  getTopTracksForArtistName,
  getGenres,
  getGenreArtists,
  getArtistAlbums,
  getAlbum,
} from "@/lib/deezer-api";

export async function searchArtistsAction(query: string) {
  return searchArtists(query);
}

export async function getTopTracksForArtistNameAction(
  name: string,
  limit?: number
) {
  return getTopTracksForArtistName(name, limit);
}

export async function getGenresAction() {
  return getGenres();
}

export async function getGenreArtistsAction(genreId: number) {
  return getGenreArtists(genreId);
}

export async function getArtistAlbumsAction(artistId: number) {
  return getArtistAlbums(artistId);
}

export async function getAlbumAction(albumId: number) {
  return getAlbum(albumId);
}

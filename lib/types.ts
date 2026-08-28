export interface DeezerUser {
  id: number;
  name: string;
  email?: string;
  picture_big?: string;
  link?: string;
  country?: string;
  type?: string;
}

export interface DeezerArtist {
  id: number;
  name: string;
  picture?: string;
  picture_big?: string;
  picture_xl?: string;
  nb_fan?: number;
  nb_album?: number;
  link?: string;
  type?: string;
  tracklist?: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  upc?: string;
  link?: string;
  cover?: string;
  cover_big?: string;
  cover_xl?: string;
  genre_id?: number;
  label?: string;
  nb_tracks?: number;
  fans?: number;
  release_date?: string;
  record_type?: string;
  artist?: DeezerArtist;
  tracks?: { data: DeezerTrack[] };
}

export interface DeezerGenre {
  id: number;
  name: string;
  picture?: string;
  picture_big?: string;
  picture_xl?: string;
  type?: string;
}

export interface DeezerTrack {
  id: number;
  readable?: boolean;
  title: string;
  title_short?: string;
  link?: string;
  duration?: number;
  rank?: number;
  preview?: string;
  artist?: DeezerArtist;
  album?: DeezerAlbum;
  position?: number;
  release_date?: string;
  isrc?: string;
  type?: string;
}

export interface DeezerSearchResult<T> {
  data: T[];
  total?: number;
  next?: string;
  prev?: string;
}

export interface DeezerChart {
  tracks: { data: DeezerTrack[] };
  albums: { data: DeezerAlbum[] };
  artists: { data: DeezerArtist[] };
  playlists: { data: unknown[] };
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type ProfileType = 'xtream' | 'm3u' | 'stalker';

export interface BaseProfile {
  id: string;
  name: string;
  type: ProfileType;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  type: 'xtream';
  url: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface M3UProfile extends BaseProfile {
  type: 'm3u';
  playlistUrl: string;
}

export interface StalkerProfile extends BaseProfile {
  type: 'stalker';
  server: string;
  macAddress: string;
}

export type Profiles = Profile | M3UProfile | StalkerProfile;

export interface Profile {
  id: string;
  name: string;
  type: 'xtream';
  url: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface StreamItem {
  id: string;
  name: string;
  thumbnail?: string;
  streamType: 'live' | 'movie' | 'series';
}

export interface LiveStream extends StreamItem {
  streamType: 'live';
  streamId: number;
  epgChannelId?: string;
  isAdult?: boolean;
  categoryId?: string;
}

export interface Movie extends StreamItem {
  streamType: 'movie';
  streamId: number;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate?: string;
  duration?: string;
  rating?: string;
}

export interface Series extends StreamItem {
  streamType: 'series';
  seriesId: number;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate?: string;
  rating?: string;
  seasons?: number[];
}

export interface Episode {
  id: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  plot?: string;
  duration?: string;
  releaseDate?: string;
}

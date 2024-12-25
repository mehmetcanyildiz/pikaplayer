import { LiveStream, Movie, Series, Episode, Profile } from '@/types/profile';

export interface XtreamAuthResponse {
  user_info: {
    username: string;
    password: string;
    message: string;
    auth: number;
    status: string;
    exp_date: string;
    is_trial: string;
    active_cons: string;
    created_at: string;
    max_connections: string;
    allowed_output_formats: string[];
  };
  server_info: {
    url: string;
    port: string;
    https_port: string;
    server_protocol: string;
    rtmp_port: string;
    timezone: string;
    timestamp_now: number;
    time_now: string;
  };
}

export class XtreamAPIError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'XtreamAPIError';
    this.statusCode = statusCode;
  }
}

interface BaseCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface LiveCategory extends BaseCategory {}
export interface VodCategory extends BaseCategory {}
export interface SeriesCategory extends BaseCategory {}

interface BaseStream {
  stream_id: number;
  name: string;
  stream_icon?: string;
  category_id: string;
}

export interface LiveStream extends BaseStream {
  epg_channel_id?: string;
  is_adult?: boolean;
}

export interface VodStream extends BaseStream {
  stream_type: string;
  container_extension: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  release_date?: string;
  youtube_trailer?: string;
  rating?: string;
  rating_5based?: number;
}

export interface SeriesStream extends BaseStream {
  series_id: number;
  cover?: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  release_date?: string;
  rating?: string;
  rating_5based?: number;
}

export interface SeriesInfo {
  seasons: {
    [key: string]: {
      air_date: string;
      episode_count: number;
      id: number;
      name: string;
      overview: string;
      season_number: number;
      episodes: {
        id: number;
        episode_num: number;
        title: string;
        container_extension: string;
        info: {
          duration_secs?: number;
          duration?: string;
          plot?: string;
          releasedate?: string;
        };
      }[];
    };
  };
  info: {
    name: string;
    cover?: string;
    plot?: string;
    cast?: string;
    director?: string;
    genre?: string;
    release_date?: string;
    rating?: string;
    rating_5based?: number;
  };
}

export interface Movie {
  id: string;
  streamId: number;
  name: string;
  thumbnail: string | null;
  streamType: 'movie';
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  duration: string;
  rating: string;
}

export interface Episode {
  id: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  plot: string;
  duration: string;
  releaseDate: string;
}

export interface Series {
  id: string;
  seriesId: number;
  name: string;
  thumbnail: string | null;
  streamType: 'series';
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  rating: string;
  rating_5based: number;
  seasons: number[];
}

export default class XtreamAPI {
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor(profile: Profile) {
    if (!profile.url || !profile.username || !profile.password) {
      throw new XtreamAPIError('Invalid profile: missing required fields');
    }

    // Add http:// if no protocol is specified
    const url = profile.url.startsWith('http://') || profile.url.startsWith('https://')
      ? profile.url
      : `http://${profile.url}`;

    this.baseUrl = url.replace(/\/$/, '');
    this.username = profile.username;
    this.password = profile.password;
  }

  private getPlayerApiUrl() {
    return `${this.baseUrl}/player_api.php`;
  }

  private async fetchApi<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(this.getPlayerApiUrl());
    url.searchParams.append('username', this.username);
    url.searchParams.append('password', this.password);
    
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new XtreamAPIError(`HTTP error: ${response.status}`, response.status);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof XtreamAPIError) {
        throw error;
      }
      throw new XtreamAPIError('Failed to connect to streaming service');
    }
  }

  async getLiveCategories() {
    return this.fetchApi<LiveCategory[]>({ action: 'get_live_categories' });
  }

  async getVodCategories() {
    return this.fetchApi<VodCategory[]>({ action: 'get_vod_categories' });
  }

  async getSeriesCategories() {
    return this.fetchApi<SeriesCategory[]>({ action: 'get_series_categories' });
  }

  async getLiveStreams(): Promise<LiveStream[]> {
    try {
      const data = await this.fetchApi<LiveStream[]>({ action: 'get_live_streams' });
      
      if (!Array.isArray(data)) {
        throw new XtreamAPIError('Invalid response format: expected array');
      }
      
      return data.map(stream => ({
        id: stream.stream_id.toString(),
        streamId: stream.stream_id,
        name: stream.name,
        thumbnail: stream.stream_icon || null,
        streamType: 'live',
        epgChannelId: stream.epg_channel_id,
        isAdult: stream.is_adult === '1',
        categoryId: stream.category_id?.toString()
      }));
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error instanceof XtreamAPIError ? error : new XtreamAPIError(
        error instanceof Error ? error.message : 'Failed to fetch live streams'
      );
    }
  }

  async getMovies(): Promise<Movie[]> {
    try {
      const data = await this.fetchApi<VodStream[]>({ action: 'get_vod_streams' });
      
      if (!Array.isArray(data)) {
        throw new XtreamAPIError('Invalid response format: expected array');
      }
      
      return data.map(movie => ({
        id: movie.stream_id.toString(),
        streamId: movie.stream_id,
        name: movie.name,
        thumbnail: movie.stream_icon || movie.cover || null,
        streamType: 'movie',
        plot: movie.plot,
        cast: movie.cast,
        director: movie.director,
        genre: movie.genre,
        releaseDate: movie.release_date,
        duration: movie.container_extension,
        rating: movie.rating
      }));
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error instanceof XtreamAPIError ? error : new XtreamAPIError(
        error instanceof Error ? error.message : 'Failed to fetch movies'
      );
    }
  }

  async getSeries(): Promise<Series[]> {
    try {
      const data = await this.fetchApi<SeriesStream[]>({ action: 'get_series' });
      
      if (!Array.isArray(data)) {
        throw new XtreamAPIError('Invalid response format: expected array');
      }
      
      return data.map(series => ({
        id: series.series_id.toString(),
        seriesId: series.series_id,
        name: series.name,
        thumbnail: series.cover || null,
        streamType: 'series',
        plot: series.plot,
        cast: series.cast,
        director: series.director,
        genre: series.genre,
        releaseDate: series.release_date,
        rating: series.rating,
        rating_5based: series.rating_5based,
        seasons: series.seasons?.map((s: any) => parseInt(s.season_number))
      }));
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error instanceof XtreamAPIError ? error : new XtreamAPIError(
        error instanceof Error ? error.message : 'Failed to fetch series'
      );
    }
  }

  async getSeriesInfo(seriesId: string): Promise<any> {
    try {
      return await this.fetchApi<SeriesInfo>({ action: 'get_series_info', series_id: seriesId });
    } catch (error) {
      console.error('Error fetching series info:', error);
      throw error instanceof XtreamAPIError ? error : new XtreamAPIError(
        error instanceof Error ? error.message : 'Failed to fetch series info'
      );
    }
  }

  getLiveStreamUrl(streamId: string): string {
    return `${this.baseUrl}/live/${this.username}/${this.password}/${streamId}.m3u8`;
  }

  getMovieStreamUrl(streamId: string): string {
    return `${this.baseUrl}/movie/${this.username}/${this.password}/${streamId}.ts`;
  }

  getSeriesStreamUrl(streamId: string): string {
    return `${this.baseUrl}/series/${this.username}/${this.password}/${streamId}.ts`;
  }
}

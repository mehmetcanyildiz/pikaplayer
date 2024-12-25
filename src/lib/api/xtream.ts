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
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'XtreamAPIError';
  }
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

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new XtreamAPIError(
            `HTTP error ${response.status}: ${response.statusText}`,
            response.status,
            await response.json().catch(() => null)
          );
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError || new Error('Failed to fetch after multiple retries');
  }

  private mapLiveStream(stream: any): LiveStream {
    return {
      id: stream.stream_id.toString(),
      streamId: stream.stream_id,
      name: stream.name,
      thumbnail: stream.stream_icon || null,
      streamType: 'live',
      epgChannelId: stream.epg_channel_id,
      isAdult: stream.is_adult === '1',
      categoryId: stream.category_id?.toString()
    };
  }

  private mapMovie(movie: any): Movie {
    return {
      id: movie.stream_id.toString(),
      streamId: movie.stream_id,
      name: movie.name,
      thumbnail: movie.stream_icon || movie.cover || null,
      streamType: 'movie',
      plot: movie.plot,
      cast: movie.cast,
      director: movie.director,
      genre: movie.genre,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
      rating: movie.rating
    };
  }

  private mapSeries(series: any): Series {
    return {
      id: series.series_id.toString(),
      seriesId: series.series_id,
      name: series.name,
      thumbnail: series.cover || null,
      streamType: 'series',
      plot: series.plot,
      cast: series.cast,
      director: series.director,
      genre: series.genre,
      releaseDate: series.releaseDate,
      rating: series.rating,
      seasons: series.seasons?.map((s: any) => parseInt(s.season_number))
    };
  }

  private mapEpisode(episode: any): Episode {
    return {
      id: episode.id.toString(),
      title: episode.title || episode.name,
      seasonNumber: parseInt(episode.season_number),
      episodeNumber: parseInt(episode.episode_number),
      plot: episode.plot,
      duration: episode.duration,
      releaseDate: episode.releaseDate
    };
  }

  async getLiveStreams(): Promise<LiveStream[]> {
    try {
      const data = await this.fetchWithRetry(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_live_streams`
      );
      
      if (!Array.isArray(data)) {
        throw new XtreamAPIError('Invalid response format: expected array');
      }
      
      return data.map(stream => this.mapLiveStream(stream));
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error instanceof XtreamAPIError ? error : new XtreamAPIError(
        error instanceof Error ? error.message : 'Failed to fetch live streams'
      );
    }
  }

  async getMovies(): Promise<Movie[]> {
    try {
      const data = await this.fetchWithRetry(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_vod_streams`
      );
      
      if (!Array.isArray(data)) {
        throw new XtreamAPIError('Invalid response format: expected array');
      }
      
      return data.map(movie => this.mapMovie(movie));
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error instanceof XtreamAPIError ? error : new XtreamAPIError(
        error instanceof Error ? error.message : 'Failed to fetch movies'
      );
    }
  }

  async getSeries(): Promise<Series[]> {
    try {
      const data = await this.fetchWithRetry(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_series`
      );
      
      if (!Array.isArray(data)) {
        throw new XtreamAPIError('Invalid response format: expected array');
      }
      
      return data.map(series => this.mapSeries(series));
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error instanceof XtreamAPIError ? error : new XtreamAPIError(
        error instanceof Error ? error.message : 'Failed to fetch series'
      );
    }
  }

  async getSeriesInfo(seriesId: string): Promise<any> {
    try {
      return await this.fetchWithRetry(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_series_info&series_id=${seriesId}`
      );
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

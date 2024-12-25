import { LiveStream, Movie, Series, Episode, Profile } from '@/types/profile';
import XtreamAPI from '@/lib/api/xtream';

export class StreamingService {
  private api: XtreamAPI;
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor(profile: Profile) {
    console.log('Initializing StreamingService with profile:', profile);
    
    if (!profile) {
      console.error('Profile is undefined');
      throw new Error('Profile is required to initialize StreamingService');
    }

    if (profile.type !== 'xtream') {
      console.error('Invalid profile type:', profile.type);
      throw new Error(`Unsupported profile type: ${profile.type}`);
    }

    if (!profile.url || !profile.username || !profile.password) {
      console.error('Missing required profile fields:', {
        hasUrl: !!profile.url,
        hasUsername: !!profile.username,
        hasPassword: !!profile.password
      });
      throw new Error('Invalid profile: missing required fields (url, username, or password)');
    }

    // Add http:// if no protocol is specified
    const url = profile.url.startsWith('http://') || profile.url.startsWith('https://')
      ? profile.url
      : `http://${profile.url}`;

    this.baseUrl = url.replace(/\/$/, '');
    this.username = profile.username;
    this.password = profile.password;
    
    this.api = new XtreamAPI(profile);
  }

  async getLiveStreams(): Promise<LiveStream[]> {
    try {
      console.log('StreamingService: Getting live streams');
      const streams = await this.api.getLiveStreams();
      console.log('StreamingService: Got live streams:', streams.length);
      return streams;
    } catch (error) {
      console.error('StreamingService: Error getting live streams:', error);
      throw error;
    }
  }

  async getMovies(): Promise<Movie[]> {
    try {
      console.log('StreamingService: Getting movies');
      const movies = await this.api.getMovies();
      console.log('StreamingService: Got movies:', movies.length);
      return movies;
    } catch (error) {
      console.error('StreamingService: Error getting movies:', error);
      throw error;
    }
  }

  async getSeries(): Promise<Series[]> {
    try {
      console.log('StreamingService: Getting series');
      const series = await this.api.getSeries();
      console.log('StreamingService: Got series:', series.length);
      return series;
    } catch (error) {
      console.error('StreamingService: Error getting series:', error);
      throw error;
    }
  }

  async getSeriesInfo(seriesId: string) {
    try {
      console.log('StreamingService: Getting series info:', seriesId);
      const info = await this.api.getSeriesInfo(seriesId);
      console.log('StreamingService: Got series info');
      return info;
    } catch (error) {
      console.error('StreamingService: Error getting series info:', error);
      throw error;
    }
  }
}

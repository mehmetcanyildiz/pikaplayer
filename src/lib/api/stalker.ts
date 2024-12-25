import axios from 'axios';
import { StalkerProfile } from '@/types/profile';

interface StalkerAuthResponse {
  js: {
    token: string;
    random: string;
  };
}

interface StalkerStream {
  id: string;
  name: string;
  number: number;
  cmd: string;
  logo: string;
  censored: boolean;
  genre_id: string;
  genre_title: string;
}

interface StalkerMovie {
  id: string;
  name: string;
  description: string;
  director: string;
  actors: string;
  year: string;
  poster: string;
  genres: string[];
  path: string;
}

class StalkerAPI {
  private baseUrl: string;
  private macAddress: string;
  private token: string | null = null;

  constructor(profile: StalkerProfile) {
    this.baseUrl = profile.server.replace(/\/$/, '');
    this.macAddress = profile.macAddress;
  }

  private async authenticate(): Promise<void> {
    try {
      const response = await axios.get<StalkerAuthResponse>(
        `${this.baseUrl}/server/load.php`,
        {
          params: {
            type: 'stb',
            action: 'handshake',
            token: '',
            JsHttpRequest: '1-xml',
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3',
            'X-User-Agent': 'Model: MAG250; Link: WiFi',
            'Authorization': 'Bearer ' + this.token,
          },
        }
      );

      this.token = response.data.js.token;
    } catch (error) {
      console.error('Stalker authentication error:', error);
      throw error;
    }
  }

  private async getProfile(): Promise<void> {
    if (!this.token) {
      await this.authenticate();
    }

    await axios.get(`${this.baseUrl}/server/load.php`, {
      params: {
        type: 'stb',
        action: 'get_profile',
        hd: '1',
        ver: 'ImageDescription: 0.2.18-r14-pub-250; ImageDate: Fri Jan 15 15:20:44 EET 2016; PORTAL version: 5.6.1; API Version: JS API version: 328; STB API version: 134; Player Engine version: 0x566',
        num_banks: '1',
        sn: this.macAddress,
        stb_type: 'MAG250',
        image_version: '218',
        device_id: this.macAddress,
        device_id2: this.macAddress,
        signature: '',
        auth_second_step: '1',
        hw_version: '1.7-BD-00',
        not_valid_token: '0',
        client_type: 'STB',
        timestamp: Date.now(),
        JsHttpRequest: '1-xml',
      },
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    });
  }

  async getLiveStreams(): Promise<StalkerStream[]> {
    if (!this.token) {
      await this.authenticate();
      await this.getProfile();
    }

    const response = await axios.get(`${this.baseUrl}/server/load.php`, {
      params: {
        type: 'itv',
        action: 'get_all_channels',
        force_ch_link_check: '1',
        JsHttpRequest: '1-xml',
      },
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    });

    return response.data.js.data || [];
  }

  async getMovies(): Promise<StalkerMovie[]> {
    if (!this.token) {
      await this.authenticate();
      await this.getProfile();
    }

    const response = await axios.get(`${this.baseUrl}/server/load.php`, {
      params: {
        type: 'vod',
        action: 'get_ordered_list',
        category: '',
        force_ch_link_check: '1',
        JsHttpRequest: '1-xml',
      },
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    });

    return response.data.js.data || [];
  }

  async getStreamUrl(streamId: string, type: 'live' | 'movie'): Promise<string> {
    if (!this.token) {
      await this.authenticate();
      await this.getProfile();
    }

    const response = await axios.get(`${this.baseUrl}/server/load.php`, {
      params: {
        type: type === 'live' ? 'itv' : 'vod',
        action: 'create_link',
        cmd: streamId,
        forced_storage: 'undefined',
        disable_ad: '0',
        JsHttpRequest: '1-xml',
      },
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    });

    return response.data.js.cmd || '';
  }
}

export default StalkerAPI;

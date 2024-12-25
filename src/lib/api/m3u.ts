import axios from 'axios';
import { M3UProfile } from '@/types/profile';

export interface M3UItem {
  id: string;
  name: string;
  logo?: string;
  group?: string;
  url: string;
  type: 'live' | 'movie' | 'series';
}

class M3UParser {
  private playlistUrl: string;

  constructor(profile: M3UProfile) {
    this.playlistUrl = profile.playlistUrl;
  }

  private parseM3U(content: string): M3UItem[] {
    const items: M3UItem[] = [];
    const lines = content.split('\n');
    let currentItem: Partial<M3UItem> | null = null;

    for (const line of lines) {
      if (line.startsWith('#EXTINF:')) {
        // Parse the EXTINF line
        currentItem = {};
        
        // Extract name and attributes
        const matches = line.match(/^#EXTINF:[-\d.]*(.*?),(.*)$/);
        if (matches) {
          const [, attributes, name] = matches;
          currentItem.name = name.trim();
          
          // Parse attributes
          const tvgLogoMatch = attributes.match(/tvg-logo="([^"]*)"/);
          if (tvgLogoMatch) {
            currentItem.logo = tvgLogoMatch[1];
          }

          const groupMatch = attributes.match(/group-title="([^"]*)"/);
          if (groupMatch) {
            currentItem.group = groupMatch[1];
          }

          // Generate a unique ID
          currentItem.id = crypto.randomUUID();
        }
      } else if (line.trim() && !line.startsWith('#') && currentItem) {
        // This is the URL line
        currentItem.url = line.trim();
        
        // Determine content type based on URL or group
        if (currentItem.url.includes('.m3u8')) {
          currentItem.type = 'live';
        } else if (currentItem.group?.toLowerCase().includes('movie')) {
          currentItem.type = 'movie';
        } else if (currentItem.group?.toLowerCase().includes('series')) {
          currentItem.type = 'series';
        } else {
          currentItem.type = 'live';
        }

        items.push(currentItem as M3UItem);
        currentItem = null;
      }
    }

    return items;
  }

  async getStreams(): Promise<M3UItem[]> {
    try {
      const response = await axios.get(this.playlistUrl);
      return this.parseM3U(response.data);
    } catch (error) {
      console.error('Error fetching M3U playlist:', error);
      throw error;
    }
  }
}

export default M3UParser;

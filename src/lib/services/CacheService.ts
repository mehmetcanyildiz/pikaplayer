interface CacheItem<T> {
  data: T;
  timestamp: number;
  profileId: string;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_ITEMS_PER_KEY = 100; // Maximum items to store per key

  private constructor() {
    this.cache = new Map();
    this.loadFromStorage();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private getCacheKey(key: string, profileId: string): string {
    return `${profileId}:${key}`;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
      this.cache = new Map();
      
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            this.cache.set(key.replace('cache_', ''), parsed);
          } catch (e) {
            console.error(`Error parsing cache item ${key}:`, e);
          }
        }
      });
    } catch (error) {
      console.error('Error loading cache from storage:', error);
      this.cache = new Map();
    }
  }

  private saveToStorage(key: string, item: CacheItem<any>): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `cache_${key}`;
      
      // If data is an array, limit its size
      if (Array.isArray(item.data)) {
        item = {
          ...item,
          data: {
            items: item.data.slice(0, this.MAX_ITEMS_PER_KEY),
            total: item.data.length,
          },
        };
      }

      localStorage.setItem(storageKey, JSON.stringify(item));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        // If quota is exceeded, clear old cache items
        this.clearOldItems();
        try {
          // Try saving again after clearing
          localStorage.setItem(`cache_${key}`, JSON.stringify(item));
        } catch (e) {
          console.error('Error saving to storage even after clearing:', e);
        }
      } else {
        console.error('Error saving cache to storage:', error);
      }
    }
  }

  private clearOldItems(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    const items = keys.map(key => ({
      key,
      timestamp: JSON.parse(localStorage.getItem(key) || '{"timestamp":0}').timestamp,
    }));

    // Sort by timestamp and remove older half
    items.sort((a, b) => b.timestamp - a.timestamp);
    items.slice(items.length / 2).forEach(item => {
      localStorage.removeItem(item.key);
    });
  }

  public set<T>(key: string, data: T, profileId: string): void {
    const cacheKey = this.getCacheKey(key, profileId);
    const item = {
      data,
      timestamp: Date.now(),
      profileId,
    };
    
    this.cache.set(cacheKey, item);
    this.saveToStorage(cacheKey, item);
  }

  public get<T>(key: string, profileId: string): T | null {
    const cacheKey = this.getCacheKey(key, profileId);
    const item = this.cache.get(cacheKey);

    if (!item) {
      const storageKey = `cache_${cacheKey}`;
      const storedItem = localStorage.getItem(storageKey);
      if (storedItem) {
        try {
          const parsed = JSON.parse(storedItem);
          if (Date.now() - parsed.timestamp > this.CACHE_DURATION) {
            localStorage.removeItem(storageKey);
            return null;
          }
          return parsed.data;
        } catch (e) {
          return null;
        }
      }
      return null;
    }

    if (Date.now() - item.timestamp > this.CACHE_DURATION) {
      this.cache.delete(cacheKey);
      localStorage.removeItem(`cache_${cacheKey}`);
      return null;
    }

    return item.data;
  }

  public clear(profileId?: string): void {
    if (typeof window === 'undefined') return;

    if (profileId) {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('cache_') && key.includes(profileId)
      );
      keys.forEach(key => localStorage.removeItem(key));
      
      for (const [key, value] of this.cache.entries()) {
        if (value.profileId === profileId) {
          this.cache.delete(key);
        }
      }
    } else {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
      keys.forEach(key => localStorage.removeItem(key));
      this.cache.clear();
    }
  }

  public clearKey(key: string, profileId: string): void {
    const cacheKey = this.getCacheKey(key, profileId);
    this.cache.delete(cacheKey);
    localStorage.removeItem(`cache_${cacheKey}`);
  }
}

export default CacheService;

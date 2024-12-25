import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Profile } from '@/types/profile';
import { StreamingService } from '@/lib/services/StreamingService';

// Infinite stale time and cache time
const STALE_TIME = Infinity;
const GC_TIME = Infinity;

// Query keys for easy access
export const QUERY_KEYS = {
  movies: 'movies',
  movieCategories: 'movieCategories',
  series: 'series',
  seriesCategories: 'seriesCategories',
  seriesInfo: 'seriesInfo',
  liveStreams: 'liveStreams',
  liveCategories: 'liveCategories',
} as const;

// Hook to get last update time and refresh data
export function useStreamingData() {
  const queryClient = useQueryClient();
  
  const refreshAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.movies] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.movieCategories] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.series] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.seriesCategories] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.seriesInfo] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.liveStreams] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.liveCategories] }),
    ]);
  };

  const getLastUpdateTime = () => {
    const state = queryClient.getQueryState([QUERY_KEYS.movies]);
    return state?.dataUpdatedAt ?? null;
  };

  return { refreshAll, getLastUpdateTime };
}

export function useMovies(profile: Profile | null, categoryId: string = '') {
  return useQuery({
    queryKey: [QUERY_KEYS.movies, profile?.id, categoryId],
    queryFn: async () => {
      if (!profile) return [];
      const service = new StreamingService(profile);
      const movies = await service.getMovies();
      return categoryId ? movies.filter(movie => movie.categoryId === categoryId) : movies;
    },
    enabled: !!profile,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useMovieCategories(profile: Profile | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.movieCategories, profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const service = new StreamingService(profile);
      return service.api.getVodCategories();
    },
    enabled: !!profile,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useSeries(profile: Profile | null, categoryId: string = '') {
  return useQuery({
    queryKey: [QUERY_KEYS.series, profile?.id, categoryId],
    queryFn: async () => {
      if (!profile) return [];
      const service = new StreamingService(profile);
      const series = await service.getSeries();
      return categoryId ? series.filter(series => series.categoryId === categoryId) : series;
    },
    enabled: !!profile,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useSeriesCategories(profile: Profile | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.seriesCategories, profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const service = new StreamingService(profile);
      return service.api.getSeriesCategories();
    },
    enabled: !!profile,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useSeriesInfo(profile: Profile | null, seriesId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.seriesInfo, profile?.id, seriesId],
    queryFn: async () => {
      if (!profile || !seriesId) return null;
      const service = new StreamingService(profile);
      return service.getSeriesInfo(seriesId);
    },
    enabled: !!profile && !!seriesId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useLiveStreams(profile: Profile | null, categoryId: string = '') {
  return useQuery({
    queryKey: [QUERY_KEYS.liveStreams, profile?.id, categoryId],
    queryFn: async () => {
      if (!profile) return [];
      const service = new StreamingService(profile);
      const streams = await service.getLiveStreams();
      console.log('Live streams data:', streams);
      return categoryId ? streams.filter(stream => stream.categoryId === categoryId) : streams;
    },
    enabled: !!profile,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useLiveCategories(profile: Profile | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.liveCategories, profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const service = new StreamingService(profile);
      return service.api.getLiveCategories();
    },
    enabled: !!profile,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

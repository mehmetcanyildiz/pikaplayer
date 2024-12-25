import { useQuery } from '@tanstack/react-query';
import { StreamingService } from '@/lib/services/StreamingService';
import { Profile } from '@/types/profile';

export function useMovies(profile: Profile | null) {
  return useQuery({
    queryKey: ['movies', profile?.id],
    queryFn: async () => {
      if (!profile) throw new Error('No profile selected');
      const service = new StreamingService(profile);
      return service.getMovies();
    },
    enabled: !!profile,
  });
}

export function useSeries(profile: Profile | null) {
  return useQuery({
    queryKey: ['series', profile?.id],
    queryFn: async () => {
      if (!profile) throw new Error('No profile selected');
      const service = new StreamingService(profile);
      return service.getSeries();
    },
    enabled: !!profile,
  });
}

export function useLiveStreams(profile: Profile | null) {
  return useQuery({
    queryKey: ['live-streams', profile?.id],
    queryFn: async () => {
      if (!profile) throw new Error('No profile selected');
      const service = new StreamingService(profile);
      return service.getLiveStreams();
    },
    enabled: !!profile,
  });
}

export function useSeriesInfo(profile: Profile | null, seriesId: string | null) {
  return useQuery({
    queryKey: ['series-info', profile?.id, seriesId],
    queryFn: async () => {
      if (!profile || !seriesId) throw new Error('Missing required parameters');
      const service = new StreamingService(profile);
      return service.getSeriesInfo(seriesId);
    },
    enabled: !!profile && !!seriesId,
  });
}

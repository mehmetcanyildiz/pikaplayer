'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';
import { Series } from '@/types/profile';
import VideoPlayer from '@/components/player/VideoPlayer';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { useSeries, useSeriesCategories, useSeriesInfo } from '@/hooks/useStreamingData';

const PAGE_SIZE = 24;

export default function SeriesPage() {
  const router = useRouter();
  const { currentProfile } = useProfiles();
  const { data: categories = [], isLoading: categoriesLoading } = useSeriesCategories(currentProfile);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { data: allSeries = [], error: fetchError, isLoading: seriesLoading } = useSeries(currentProfile, selectedCategory);
  
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [page, setPage] = useState(1);

  const { data: seriesInfo } = useSeriesInfo(currentProfile, selectedSeries?.id ?? null);

  const paginatedSeries = allSeries.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedSeries.length < allSeries.length;

  useEffect(() => {
    if (!currentProfile) {
      router.push('/profiles');
    }
  }, [currentProfile, router]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const loadMore = async () => {
    setPage(prev => prev + 1);
  };

  const handleSeriesSelect = (series: Series) => {
    setSelectedSeries(series);
    setSelectedEpisode(null);
  };

  const renderSeries = (series: Series) => (
    <div
      key={series.id}
      onClick={() => handleSeriesSelect(series)}
      className={`bg-secondary rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer ${
        selectedSeries?.id === series.id ? 'ring-2 ring-primary' : ''
      }`}
    >
      {series.thumbnail ? (
        <img
          src={series.thumbnail}
          alt={series.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <div className="p-2">
        <h3 className="text-sm font-medium truncate">{series.name}</h3>
      </div>
    </div>
  );

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-center mb-4">
          {fetchError instanceof Error ? fetchError.message : 'Failed to load series'}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/profiles')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Profiles
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {selectedSeries ? (
        <div className="mb-8">
          {selectedEpisode ? (
            <VideoPlayer
              src={`${currentProfile?.url}/series/${currentProfile?.username}/${currentProfile?.password}/${selectedEpisode.id}.ts`}
              poster={selectedSeries.thumbnail}
              title={`${selectedSeries.name} - ${selectedEpisode.title}`}
              onBack={() => setSelectedEpisode(null)}
              onError={(error) => {
                console.error('Video player error:', error);
              }}
            />
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSeries.name}</h2>
                  {selectedSeries.plot && (
                    <p className="mt-2 text-gray-400">{selectedSeries.plot}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedSeries(null)}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Series
                </button>
              </div>

              {seriesInfo && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Episodes</h3>
                  <div className="grid gap-4">
                  {Object.entries(seriesInfo?.seasons || {}).map(([seasonNum, season]) => (
                    <div key={seasonNum} className="space-y-4">
                      <h4 className="text-lg font-medium">Season {(season as any).season_number}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(season as any).episodes?.map((episode: any) => (
                          <div
                            key={episode.id}
                            onClick={() => setSelectedEpisode(episode)}
                            className="p-4 bg-secondary rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">Episode {episode.episode_num}</h5>
                                <p className="text-sm text-gray-400 mt-1">{episode.title}</p>
                              </div>
                              {episode.info?.duration && (
                                <span className="text-sm text-gray-400">
                                  {episode.info.duration}
                                </span>
                              )}
                            </div>
                            {episode.info?.plot && (
                              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                                {episode.info.plot}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-6 flex gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === ''
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-gray-700'
              }`}
            >
              All Series
            </button>
            {categories.map((category) => (
              <button
                key={category.category_id}
                onClick={() => setSelectedCategory(category.category_id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category.category_id
                    ? 'bg-primary text-white'
                    : 'bg-secondary hover:bg-gray-700'
                }`}
              >
                {category.category_name}
              </button>
            ))}
          </div>

          <InfiniteScroll
            items={paginatedSeries}
            renderItem={renderSeries}
            loadMore={loadMore}
            hasMore={hasMore}
            loading={seriesLoading || categoriesLoading}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}

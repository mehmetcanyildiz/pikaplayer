'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';
import { LiveStream } from '@/types/profile';
import VideoPlayer from '@/components/player/VideoPlayer';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { useLiveStreams } from '@/hooks/useStreamingData';

const PAGE_SIZE = 24;

export default function LivePage() {
  const router = useRouter();
  const { currentProfile } = useProfiles();
  const { data: allStreams, error: fetchError, isLoading } = useLiveStreams(currentProfile);
  
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (!allStreams) return ['all'];
    const categorySet = new Set<string>();
    allStreams.forEach(stream => {
      if (stream.category) {
        categorySet.add(stream.category);
      }
    });
    return ['all', ...Array.from(categorySet)];
  }, [allStreams]);

  const filteredStreams = useMemo(() => {
    if (!allStreams) return [];
    if (selectedCategory === 'all') return allStreams;
    return allStreams.filter(stream => stream.category === selectedCategory);
  }, [allStreams, selectedCategory]);

  const paginatedStreams = useMemo(() => {
    return filteredStreams.slice(0, page * PAGE_SIZE);
  }, [filteredStreams, page]);

  const hasMore = paginatedStreams.length < filteredStreams.length;

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

  const handleStreamSelect = (stream: LiveStream) => {
    setSelectedStream(stream);
  };

  const renderStream = (stream: LiveStream) => (
    <div
      key={stream.id}
      onClick={() => handleStreamSelect(stream)}
      className={`bg-secondary rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer ${
        selectedStream?.id === stream.id ? 'ring-2 ring-primary' : ''
      }`}
    >
      {stream.thumbnail ? (
        <img
          src={stream.thumbnail}
          alt={stream.name}
          className="w-full h-32 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">📺</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{stream.name}</h3>
        {stream.category && (
          <p className="text-xs text-gray-400 mt-1">{stream.category}</p>
        )}
      </div>
    </div>
  );

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-center mb-4">
          {fetchError instanceof Error ? fetchError.message : 'Failed to load live streams'}
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
      {selectedStream ? (
        <div className="mb-8">
          <VideoPlayer
            src={`${currentProfile?.url}/live/${currentProfile?.username}/${currentProfile?.password}/${selectedStream.streamId}.m3u8`}
            poster={selectedStream.thumbnail}
            onError={(error) => {
              console.error('Video player error:', error);
            }}
          />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedStream.name}</h2>
              {selectedStream.category && (
                <p className="mt-2 text-sm text-primary">{selectedStream.category}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedStream(null)}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Live TV
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-secondary hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All Channels' : category}
              </button>
            ))}
          </div>

          <InfiniteScroll
            items={paginatedStreams}
            renderItem={renderStream}
            loadMore={loadMore}
            hasMore={hasMore}
            loading={isLoading}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}

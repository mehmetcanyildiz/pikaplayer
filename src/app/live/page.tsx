'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';
import { LiveStream } from '@/types/profile';
import VideoPlayer from '@/components/player/VideoPlayer';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { useLiveStreams, useLiveCategories } from '@/hooks/useStreamingData';

const PAGE_SIZE = 24;

export default function LivePage() {
  const router = useRouter();
  const { currentProfile } = useProfiles();
  const { data: categories = [], isLoading: categoriesLoading } = useLiveCategories(currentProfile);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { data: allStreams = [], error: fetchError, isLoading: streamsLoading } = useLiveStreams(currentProfile, selectedCategory);
  
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [page, setPage] = useState(1);

  const paginatedStreams = allStreams.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedStreams.length < allStreams.length;

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
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <div className="p-2">
        <h3 className="text-sm font-medium truncate">{stream.name}</h3>
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
            title={selectedStream.name}
            onBack={() => setSelectedStream(null)}
            onError={(error) => {
              console.error('Video player error:', error);
            }}
          />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedStream.name}</h2>
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
          <div className="mb-6 flex gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === ''
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-gray-700'
              }`}
            >
              All Channels
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
            items={paginatedStreams}
            renderItem={renderStream}
            loadMore={loadMore}
            hasMore={hasMore}
            loading={streamsLoading || categoriesLoading}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}

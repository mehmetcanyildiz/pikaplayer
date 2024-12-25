'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';
import { Movie } from '@/types/profile';
import VideoPlayer from '@/components/player/VideoPlayer';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { useMovies } from '@/hooks/useStreamingData';

const PAGE_SIZE = 24;

export default function MoviesPage() {
  const router = useRouter();
  const { currentProfile } = useProfiles();
  const { data: allMovies, error: fetchError, isLoading } = useMovies(currentProfile);
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (!allMovies) return ['all'];
    const categorySet = new Set<string>();
    allMovies.forEach(movie => {
      if (movie.category) {
        categorySet.add(movie.category);
      }
    });
    return ['all', ...Array.from(categorySet)];
  }, [allMovies]);

  const filteredMovies = useMemo(() => {
    if (!allMovies) return [];
    if (selectedCategory === 'all') return allMovies;
    return allMovies.filter(movie => movie.category === selectedCategory);
  }, [allMovies, selectedCategory]);

  const paginatedMovies = useMemo(() => {
    return filteredMovies.slice(0, page * PAGE_SIZE);
  }, [filteredMovies, page]);

  const hasMore = paginatedMovies.length < filteredMovies.length;

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

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const renderMovie = (movie: Movie) => (
    <div
      key={movie.id}
      onClick={() => handleMovieSelect(movie)}
      className={`bg-secondary rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer ${
        selectedMovie?.id === movie.id ? 'ring-2 ring-primary' : ''
      }`}
    >
      {movie.thumbnail ? (
        <img
          src={movie.thumbnail}
          alt={movie.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <div className="p-2">
        <h3 className="text-sm font-medium truncate">{movie.name}</h3>
        {movie.category && (
          <p className="text-xs text-gray-400 mt-1">{movie.category}</p>
        )}
      </div>
    </div>
  );

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-center mb-4">
          {fetchError instanceof Error ? fetchError.message : 'Failed to load movies'}
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
      {selectedMovie ? (
        <div className="mb-8">
          <VideoPlayer
            src={`${currentProfile?.url}/movie/${currentProfile?.username}/${currentProfile?.password}/${selectedMovie.streamId}.m3u8`}
            poster={selectedMovie.thumbnail}
            onError={(error) => {
              console.error('Video player error:', error);
            }}
          />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedMovie.name}</h2>
              {selectedMovie.plot && (
                <p className="mt-2 text-gray-400">{selectedMovie.plot}</p>
              )}
              {selectedMovie.category && (
                <p className="mt-2 text-sm text-primary">{selectedMovie.category}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedMovie(null)}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Movies
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
                {category === 'all' ? 'All Movies' : category}
              </button>
            ))}
          </div>

          <InfiniteScroll
            items={paginatedMovies}
            renderItem={renderMovie}
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

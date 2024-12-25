'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import { useRouter } from 'next/navigation';
import FavoriteButton from '@/components/common/FavoriteButton';

export default function Favorites() {
  const router = useRouter();
  const { favorites } = useFavorites();

  const handleItemClick = (item: any) => {
    switch (item.type) {
      case 'live':
        router.push(`/live?id=${item.id}`);
        break;
      case 'movie':
        router.push(`/movies?id=${item.id}`);
        break;
      case 'series':
        router.push(`/series?id=${item.id}`);
        break;
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Favorites Yet</h2>
          <p className="text-gray-400">
            Add your favorite shows and movies to access them quickly!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {favorites.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-secondary hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-4xl">
                  {item.type === 'live' ? '📺' : item.type === 'movie' ? '🎬' : '📺'}
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-0 p-4 w-full">
                <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400 capitalize">{item.type}</span>
                  <FavoriteButton item={item} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

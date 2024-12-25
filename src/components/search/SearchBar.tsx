'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useProfiles } from '@/contexts/ProfileContext';
import StreamingService from '@/lib/services/StreamingService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const { currentProfile } = useProfiles();
  const { searchQuery, setSearchQuery, searchResults, setSearchResults, clearSearch } = useSearch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim() || !currentProfile) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const service = new StreamingService(currentProfile);
        const [liveStreams, movies] = await Promise.all([
          service.getLiveStreams(),
          service.getMovies(),
        ]);

        const filteredResults = [...liveStreams, ...movies].filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filteredResults);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);
  };

  const handleResultClick = (result: any) => {
    clearSearch();
    setIsDropdownOpen(false);
    
    switch (result.type) {
      case 'live':
        router.push(`/live?id=${result.id}`);
        break;
      case 'movie':
        router.push(`/movies?id=${result.id}`);
        break;
      case 'series':
        router.push(`/series?id=${result.id}`);
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="search"
          className="w-full md:w-64 bg-gray-700 text-white text-sm rounded-lg block p-2.5 pl-10"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          🔍
        </div>
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => {
              clearSearch();
              setIsDropdownOpen(false);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-secondary rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-2 hover:bg-gray-700 flex items-center gap-3 text-left"
              onClick={() => handleResultClick(result)}
            >
              {result.thumbnail ? (
                <img
                  src={result.thumbnail}
                  alt={result.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center">
                  {result.type === 'live' ? '📺' : result.type === 'movie' ? '🎬' : '📺'}
                </div>
              )}
              <div>
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-gray-400 capitalize">{result.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

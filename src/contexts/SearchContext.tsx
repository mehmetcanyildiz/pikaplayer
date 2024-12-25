'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { StreamItem } from '@/lib/services/StreamingService';

interface SearchContextType {
  searchQuery: string;
  searchResults: StreamItem[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: StreamItem[]) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StreamItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    if (!query) {
      setSearchResults([]);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        setSearchQuery: handleSetSearchQuery,
        setSearchResults,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useProfiles } from './ProfileContext';
import { StreamItem } from '@/lib/services/StreamingService';

interface FavoritesContextType {
  favorites: StreamItem[];
  addFavorite: (item: StreamItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { currentProfile } = useProfiles();
  const [favorites, setFavorites] = useState<StreamItem[]>([]);

  // Load favorites from localStorage when profile changes
  useEffect(() => {
    if (currentProfile) {
      const storedFavorites = localStorage.getItem(`favorites_${currentProfile.id}`);
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    }
  }, [currentProfile]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem(`favorites_${currentProfile.id}`, JSON.stringify(favorites));
    }
  }, [favorites, currentProfile]);

  const addFavorite = (item: StreamItem) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

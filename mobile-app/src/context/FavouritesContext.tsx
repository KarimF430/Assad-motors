/**
 * Favourites Context - Manages favourite cars state
 * Replicates web lib/favourites-context.tsx
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CarCardData } from '../components/home/CarCard';

interface FavouriteCarData extends CarCardData {
  isAutoAdded?: boolean;
}

interface FavouritesContextType {
  favourites: FavouriteCarData[];
  isFavourite: (carId: string) => boolean;
  toggleFavourite: (car: CarCardData) => void;
  clearAllFavourites: () => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteCarData[]>([]);

  const isFavourite = useCallback((carId: string) => {
    return favourites.some(car => car.id === carId);
  }, [favourites]);

  const toggleFavourite = useCallback((car: CarCardData) => {
    setFavourites(prev => {
      const exists = prev.find(c => c.id === car.id);
      if (exists) {
        // Remove from favourites
        return prev.filter(c => c.id !== car.id);
      } else {
        // Add to favourites
        return [...prev, { ...car, isAutoAdded: false }];
      }
    });
  }, []);

  const clearAllFavourites = useCallback(() => {
    setFavourites([]);
  }, []);

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite, clearAllFavourites }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within FavouritesProvider');
  }
  return context;
}

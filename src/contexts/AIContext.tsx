/**
 * AI Context Provider
 * 
 * Tracks the current state of the app so the AI can be aware of:
 * - Current page
 * - Selected movie/cinema/showtime
 * - Available movies and cinemas
 * - User preferences
 * 
 * This enables the AI to make context-aware decisions.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AIContext, Movie, Cinema } from '@/services/aiAgent';

interface AIContextProviderProps {
  children: React.ReactNode;
  availableMovies: Movie[];
  availableCinemas: Cinema[];
}

interface AIContextValue extends AIContext {
  updateContext: (updates: Partial<AIContext>) => void;
  setCurrentMovieId: (id: number | undefined) => void;
  setCurrentCinemaId: (id: number | undefined) => void;
  setSelectedShowtime: (time: string | undefined) => void;
  setSelectedSeats: (seats: string[] | undefined) => void;
}

const AIContextContext = createContext<AIContextValue | undefined>(undefined);

export const AIContextProvider: React.FC<AIContextProviderProps> = ({
  children,
  availableMovies,
  availableCinemas
}) => {
  const location = useLocation();
  
  // Determine current page from route
  const getCurrentPage = (): 'movies' | 'cinemas' | 'seats' => {
    if (location.pathname.startsWith('/seats')) return 'seats';
    if (location.pathname.startsWith('/cinemas')) return 'cinemas';
    return 'movies';
  };

  const [context, setContext] = useState<AIContext>({
    currentPage: getCurrentPage(),
    availableMovies,
    availableCinemas
  });

  const updateContext = useCallback((updates: Partial<AIContext>) => {
    setContext(prev => ({
      ...prev,
      ...updates,
      currentPage: getCurrentPage()
    }));
  }, [location]);

  const setCurrentMovieId = useCallback((id: number | undefined) => {
    updateContext({ currentMovieId: id });
  }, [updateContext]);

  const setCurrentCinemaId = useCallback((id: number | undefined) => {
    updateContext({ currentCinemaId: id });
  }, [updateContext]);

  const setSelectedShowtime = useCallback((time: string | undefined) => {
    updateContext({ selectedShowtime: time });
  }, [updateContext]);

  const setSelectedSeats = useCallback((seats: string[] | undefined) => {
    updateContext({ selectedSeats: seats });
  }, [updateContext]);

  // Update page when location changes
  React.useEffect(() => {
    updateContext({});
  }, [location.pathname]);

  const value: AIContextValue = {
    ...context,
    updateContext,
    setCurrentMovieId,
    setCurrentCinemaId,
    setSelectedShowtime,
    setSelectedSeats
  };

  return (
    <AIContextContext.Provider value={value}>
      {children}
    </AIContextContext.Provider>
  );
};

export const useAIContext = (): AIContextValue => {
  const context = useContext(AIContextContext);
  if (!context) {
    throw new Error('useAIContext must be used within AIContextProvider');
  }
  return context;
};

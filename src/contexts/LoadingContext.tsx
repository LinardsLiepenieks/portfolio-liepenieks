'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  isScrollNavigating: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsScrollNavigating: (scrolling: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScrollNavigating, setIsScrollNavigating] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isScrollNavigating,
        setIsLoading,
        setIsScrollNavigating,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
}

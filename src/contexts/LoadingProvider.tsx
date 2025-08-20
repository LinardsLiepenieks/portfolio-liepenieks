'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  disableLoading: boolean;
  setDisableLoading: (disable: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading on initial page load
  const [disableLoading, setDisableLoading] = useState(false); // New flag to disable loading
  const pathname = usePathname();

  const loadingStartTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Function to start loading with minimum duration enforcement
  const startLoading = useCallback(() => {
    if (disableLoading) {
      return;
    }
    setIsLoading(true);
    loadingStartTimeRef.current = Date.now();
  }, [disableLoading]);

  // Function to end loading with minimum duration check
  const endLoading = useCallback(() => {
    if (loadingStartTimeRef.current === null) {
      setIsLoading(false);
      return;
    }

    const elapsedTime = Date.now() - loadingStartTimeRef.current;
    const remainingTime = Math.max(0, 100 - elapsedTime); // Minimum 100ms

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (remainingTime > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        loadingStartTimeRef.current = null;
      }, remainingTime);
    } else {
      setIsLoading(false);
      loadingStartTimeRef.current = null;
    }
  }, []);

  // Manual loading control function
  const setLoading = useCallback((loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      endLoading();
    }
  }, [startLoading, endLoading]);

  // Handle initial page load
  useEffect(() => {
    if (isInitialLoadRef.current) {
      startLoading();

      // End initial loading after a delay to ensure page is ready and components are mounted
      const initialLoadTimer = setTimeout(() => {
        endLoading();
        isInitialLoadRef.current = false;
      }, 200);

      return () => clearTimeout(initialLoadTimer);
    }
  }, [startLoading, endLoading]);

  // Listen for pathname changes (navigation)
  useEffect(() => {
    // Skip the initial load since we handle it above
    if (isInitialLoadRef.current) {
      return;
    }

    // Check if the current history state indicates scroll navigation
    const isFromScroll = window.history.state?.fromScroll === true;
    
    // Don't start loading if it's disabled (scroll navigation) or if it's from scroll
    if (!disableLoading && !isFromScroll) {
      startLoading();

      // End loading after navigation completes
      const navigationTimer = setTimeout(() => {
        endLoading();
      }, 50);

      return () => clearTimeout(navigationTimer);
    }
  }, [pathname, startLoading, endLoading, disableLoading]);

  // Listen for page visibility changes (page refresh, coming back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        document.readyState === 'loading'
      ) {
        startLoading();
      } else if (
        document.visibilityState === 'visible' &&
        document.readyState === 'complete'
      ) {
        endLoading();
      }
    };

    const handleBeforeUnload = () => {
      startLoading();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [startLoading, endLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = {
    isLoading,
    setLoading,
    disableLoading,
    setDisableLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

// Hook to use the loading context
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

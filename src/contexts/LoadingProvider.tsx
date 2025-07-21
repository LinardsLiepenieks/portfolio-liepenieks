'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
  const router = useRouter();

  const loadingStartTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Function to start loading with minimum duration enforcement
  const startLoading = () => {
    if (disableLoading) {
      return;
    }
    setIsLoading(true);
    loadingStartTimeRef.current = Date.now();
  };

  // Function to end loading with minimum duration check
  const endLoading = () => {
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
  };

  // Manual loading control function
  const setLoading = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      endLoading();
    }
  };

  // Handle initial page load
  useEffect(() => {
    if (isInitialLoadRef.current) {
      startLoading();

      // End initial loading after a short delay to ensure page is ready
      const initialLoadTimer = setTimeout(() => {
        endLoading();
        isInitialLoadRef.current = false;
      }, 50);

      return () => clearTimeout(initialLoadTimer);
    }
  }, []);

  // Listen for pathname changes (navigation)
  useEffect(() => {
    // Skip the initial load since we handle it above
    if (isInitialLoadRef.current) {
      return;
    }

    startLoading();

    // End loading after navigation completes
    const navigationTimer = setTimeout(() => {
      endLoading();
    }, 50);

    return () => clearTimeout(navigationTimer);
  }, [pathname]);

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
  }, []);

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

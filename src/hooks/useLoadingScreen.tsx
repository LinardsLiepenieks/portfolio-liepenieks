'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoadingContext } from '@/contexts/LoadingContext';

export const useLoadingScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isScrollNavigating, setIsLoading, setIsScrollNavigating } =
    useLoadingContext();

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      // Don't show loading if this is a scroll navigation
      if (!isScrollNavigating) {
        console.log('Starting loading for:', url);
        setIsLoading(true);
      }
    };

    const handleRouteChangeComplete = () => {
      console.log('Route change complete');
      setIsLoading(false);
      setIsScrollNavigating(false); // Reset scroll navigation flag
    };

    const handleRouteChangeError = () => {
      setIsLoading(false);
      setIsScrollNavigating(false);
    };

    // For Next.js App Router, we need to listen to navigation events differently
    // This is a workaround since router.events doesn't exist in App Router
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      if (!isScrollNavigating) {
        setIsLoading(true);
      }
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      if (!isScrollNavigating) {
        setIsLoading(true);
      }
      return originalReplace.apply(router, args);
    };

    // Listen for browser back/forward
    const handlePopState = () => {
      const isFromScroll = window.history.state?.fromScroll;
      if (!isFromScroll) {
        setIsLoading(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [isScrollNavigating, setIsLoading, setIsScrollNavigating, router]);

  // Hide loading when pathname changes (indicating navigation is complete)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Small delay to ensure smooth transition

    return () => clearTimeout(timer);
  }, [pathname, setIsLoading]);

  const startScrollNavigation = () => {
    console.log('Starting scroll navigation');
    setIsScrollNavigating(true);
  };

  const endScrollNavigation = () => {
    console.log('Ending scroll navigation');
    setIsScrollNavigating(false);
  };

  return {
    isLoading,
    startScrollNavigation,
    endScrollNavigation,
  };
};

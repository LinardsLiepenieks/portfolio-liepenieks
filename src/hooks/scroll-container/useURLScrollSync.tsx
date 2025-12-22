/**
 * Custom hook that synchronizes scroll sections with browser URL and history.
 */

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface UseURLScrollSyncProps {
  routes: string[];
  onSectionChange: (
    sectionIndex: number,
    behavior?: 'smooth' | 'instant'
  ) => void;
  onPopState: (sectionIndex: number) => void;
  enabled?: boolean; // If false, don't call scroll functions
}

export const useURLScrollSync = ({
  routes,
  onSectionChange,
  onPopState,
  enabled = true,
}: UseURLScrollSyncProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update URL using History API (called during scroll)
  const updateURL = useCallback(
    (sectionIndex: number) => {
      const newURL = routes[sectionIndex];
      const state = { sectionIndex, fromScroll: true }; // Mark as scroll-initiated

      window.history.pushState(state, '', newURL);
    },
    [routes]
  );

  // Initialize current section based on URL
  useEffect(() => {
    if (!enabled) return; // Don't trigger scrolls in free scroll mode

    const routeIndex = routes.indexOf(pathname);
    if (routeIndex !== -1) {
      // Check for instant parameter
      const scrollBehavior =
        searchParams.get('instant') === 'true' ? 'instant' : 'smooth';

      onSectionChange(routeIndex, scrollBehavior);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams, enabled]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!enabled) return; // Don't trigger scrolls in free scroll mode

      if (event.state && typeof event.state.sectionIndex === 'number') {
        const newSection = event.state.sectionIndex;
        onPopState(newSection);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial state for the current page
    if (typeof window !== 'undefined' && !window.history.state) {
      const initialSection = routes.indexOf(pathname);
      window.history.replaceState(
        {
          sectionIndex: initialSection >= 0 ? initialSection : 0,
          fromScroll: false, // Initial state is not from scroll
        },
        '',
        pathname
      );
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, routes, onPopState, enabled]);

  return { updateURL };
};

/**
 * Custom hook that synchronizes scroll sections with browser URL and history.
 *
 * Handles URL updates when sections change, manages browser back/forward
 * navigation, and initializes the correct section based on the current URL.
 * Uses the HTML5 History API to maintain proper browser navigation without
 * page reloads, supporting both smooth and instant scroll behaviors.
 *
 * @param routes - Array of route paths corresponding to each section
 * @param onSectionChange - Callback when URL indicates a section change
 * @param onPopState - Callback for browser back/forward navigation
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
}

export const useURLScrollSync = ({
  routes,
  onSectionChange,
  onPopState,
}: UseURLScrollSyncProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update URL using History API
  const updateURL = useCallback(
    (sectionIndex: number) => {
      const newURL = routes[sectionIndex];
      const state = { sectionIndex };

      console.log(`Updating URL to ${newURL} with state:`, state);
      window.history.pushState(state, '', newURL);
    },
    [routes]
  );

  // Initialize current section based on URL
  useEffect(() => {
    const routeIndex = routes.indexOf(pathname);
    if (routeIndex !== -1) {
      // Check for instant parameter
      const scrollBehavior =
        searchParams.get('instant') === 'true' ? 'instant' : 'smooth';

      onSectionChange(routeIndex, scrollBehavior);
    }
  }, [pathname, routes, searchParams, onSectionChange]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('PopState event:', event.state);

      if (event.state && typeof event.state.sectionIndex === 'number') {
        const newSection = event.state.sectionIndex;
        console.log(`Navigating to section ${newSection} via popstate`);
        onPopState(newSection);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial state for the current page
    if (typeof window !== 'undefined' && !window.history.state) {
      const initialSection = routes.indexOf(pathname);
      window.history.replaceState(
        { sectionIndex: initialSection >= 0 ? initialSection : 0 },
        '',
        pathname
      );
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, routes, onPopState]);

  return { updateURL };
};

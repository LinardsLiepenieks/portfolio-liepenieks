/**
 * Custom hook that manages all scroll-related state and provides coordination functions.
 *
 * Acts as the central state manager for the scroll container, handling current section,
 * scroll status, target sections, and initial load state. Provides callback functions
 * for other hooks to communicate state changes and coordinates the overall scrolling
 * behavior including fallback timeouts and different scroll triggers.
 *
 * @param totalSections - Total number of sections in the container
 * @param updateURL - Function to update the browser URL when sections change
 */

import { useState, useCallback, useRef, MutableRefObject } from 'react';

interface UseScrollStateReturn {
  currentSection: number;
  isScrolling: boolean;
  targetSection: number | null;
  isInitialLoad: boolean;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  setCurrentSection: (section: number) => void;
  setIsScrolling: (scrolling: boolean) => void;
  setTargetSection: (section: number | null) => void;
  setIsInitialLoad: (loading: boolean) => void;
  scrollToSection: (
    sectionIndex: number,
    behavior?: 'smooth' | 'instant'
  ) => void;
  handleSectionReached: (sectionIndex: number) => void;
  handleTargetReached: () => void;
  handleInitialLoadComplete: () => void;
  handlePopStateNavigation: (sectionIndex: number) => void;
  handleURLSectionChange: (
    sectionIndex: number,
    behavior?: 'smooth' | 'instant'
  ) => void;
}

export const useScrollState = (
  totalSections: number,
  updateURL: (sectionIndex: number) => void
): UseScrollStateReturn => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [targetSection, setTargetSection] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback(
    (sectionIndex: number, behavior: 'smooth' | 'instant' = 'smooth') => {
      if (containerRef.current && !isScrolling) {
        console.log(`User scrolling to section ${sectionIndex}`);
        setIsScrolling(true);
        setTargetSection(sectionIndex);

        const targetElement = containerRef.current.children[
          sectionIndex
        ] as HTMLElement;
        targetElement.scrollIntoView({
          behavior,
          block: 'start',
        });

        // Fallback timeout in case intersection observer doesn't fire
        setTimeout(() => {
          if (isScrolling && !isInitialLoad) {
            console.log('Fallback: Setting section via timeout');
            setCurrentSection(sectionIndex);
            updateURL(sectionIndex);
            setIsScrolling(false);
            setTargetSection(null);
          }
        }, 1000);
      }
    },
    [isScrolling, isInitialLoad, updateURL]
  );

  const handleSectionReached = useCallback(
    (sectionIndex: number) => {
      setCurrentSection(sectionIndex);
      updateURL(sectionIndex);
    },
    [updateURL]
  );

  const handleTargetReached = useCallback(() => {
    setIsScrolling(false);
    setTargetSection(null);
  }, []);

  const handleInitialLoadComplete = useCallback(() => {
    setIsInitialLoad(false);
  }, []);

  const handlePopStateNavigation = useCallback((sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    setIsScrolling(true);
    setTargetSection(sectionIndex);

    // Scroll to the section
    if (containerRef.current) {
      const targetElement = containerRef.current.children[
        sectionIndex
      ] as HTMLElement;
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  const handleURLSectionChange = useCallback(
    (sectionIndex: number, behavior: 'smooth' | 'instant' = 'smooth') => {
      // On initial load, don't update currentSection until we reach the target
      if (isInitialLoad) {
        setTargetSection(sectionIndex);
        setIsScrolling(true);
        console.log(`Initial load: targeting section ${sectionIndex}`);
      } else {
        setCurrentSection(sectionIndex);
      }

      // Scroll to section if needed
      if (containerRef.current) {
        const targetElement = containerRef.current.children[
          sectionIndex
        ] as HTMLElement;
        targetElement.scrollIntoView({
          behavior,
          block: 'start',
        });
      }
    },
    [isInitialLoad]
  );

  return {
    currentSection,
    isScrolling,
    targetSection,
    isInitialLoad,
    containerRef,
    setCurrentSection,
    setIsScrolling,
    setTargetSection,
    setIsInitialLoad,
    scrollToSection,
    handleSectionReached,
    handleTargetReached,
    handleInitialLoadComplete,
    handlePopStateNavigation,
    handleURLSectionChange,
  };
};

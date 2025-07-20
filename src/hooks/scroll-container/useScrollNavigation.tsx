/**
 * Custom hook that handles user input navigation for scroll containers.
 *
 * Manages wheel events, touch/swipe gestures, and keyboard navigation
 * (arrow keys, page up/down) to enable smooth scrolling between sections.
 * Prevents navigation when already scrolling to avoid conflicts.
 *
 * @param currentSection - The currently active section index
 * @param isScrolling - Whether a scroll animation is in progress
 * @param totalSections - Total number of sections available
 * @param onScrollToSection - Callback function to trigger section navigation
 */

import { useEffect, useCallback } from 'react';

interface UseScrollNavigationProps {
  currentSection: number;
  isScrolling: boolean;
  totalSections: number;
  onScrollToSection: (sectionIndex: number) => void;
}

export const useScrollNavigation = ({
  currentSection,
  isScrolling,
  totalSections,
  onScrollToSection,
}: UseScrollNavigationProps) => {
  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      if (!isScrolling && sectionIndex >= 0 && sectionIndex < totalSections) {
        onScrollToSection(sectionIndex);
      }
    },
    [isScrolling, totalSections, onScrollToSection]
  );

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;

      if (nextSection >= 0 && nextSection < totalSections) {
        scrollToSection(nextSection);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection, isScrolling, totalSections, scrollToSection]);

  // Touch/swipe support
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        const direction = diff > 0 ? 1 : -1;
        const nextSection = currentSection + direction;

        if (nextSection >= 0 && nextSection < totalSections) {
          scrollToSection(nextSection);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSection, isScrolling, totalSections, scrollToSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          if (currentSection < totalSections - 1) {
            scrollToSection(currentSection + 1);
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          if (currentSection > 0) {
            scrollToSection(currentSection - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling, totalSections, scrollToSection]);

  return { scrollToSection };
};

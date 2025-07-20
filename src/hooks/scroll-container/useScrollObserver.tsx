/**
 * Custom hook that observes section visibility using Intersection Observer API.
 *
 * Detects when sections are fully visible in the viewport (95% threshold) and
 * handles different scenarios: initial page load, user-initiated scrolling,
 * and automatic section detection. Manages the complex logic of determining
 * when to update the current section based on scroll state and target sections.
 *
 * @param currentSection - The currently active section index
 * @param isScrolling - Whether a scroll animation is in progress
 * @param targetSection - The section we're scrolling towards (if any)
 * @param isInitialLoad - Whether this is the initial page load
 * @param containerRef - Reference to the scroll container element
 * @param onSectionReached - Callback when a section becomes active
 * @param onTargetReached - Callback when the target section is reached
 * @param onInitialLoadComplete - Callback when initial load is finished
 */

import { useEffect, useRef, MutableRefObject } from 'react';

interface UseScrollObserverProps {
  currentSection: number;
  isScrolling: boolean;
  targetSection: number | null;
  isInitialLoad: boolean;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  onSectionReached: (sectionIndex: number) => void;
  onTargetReached: () => void;
  onInitialLoadComplete: () => void;
  endScrollNavigation?: () => void;
}

export const useScrollObserver = ({
  currentSection,
  isScrolling,
  targetSection,
  isInitialLoad,
  containerRef,
  onSectionReached,
  onTargetReached,
  onInitialLoadComplete,
  endScrollNavigation,
}: UseScrollObserverProps) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer to detect when section is fully in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, index) => {
      if (section) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // Check if the section is fully visible (covers the entire viewport)
              if (entry.isIntersecting && entry.intersectionRatio >= 0.95) {
                // If we're on initial load and scrolling to target, only update when we reach the target
                if (isInitialLoad && isScrolling && targetSection !== null) {
                  if (index === targetSection) {
                    console.log(
                      `Initial load: reached target section ${index}`
                    );
                    onSectionReached(index);
                    onTargetReached();
                    onInitialLoadComplete();
                    endScrollNavigation?.(); // End loading screen
                  }
                  // Ignore other sections during initial load
                  return;
                }

                // If we're scrolling and have a target, only update to the target section
                if (isScrolling && targetSection !== null) {
                  if (index === targetSection && index !== currentSection) {
                    console.log(`User scroll: reached target section ${index}`);
                    onSectionReached(index);
                    onTargetReached();
                    endScrollNavigation?.(); // End loading screen
                  }
                }
                // If not scrolling, update to any section that becomes fully visible
                else if (!isScrolling && currentSection !== index) {
                  console.log(`Auto-update to section ${index}`);
                  onSectionReached(index);
                }
              }
            });
          },
          {
            root: containerRef.current,
            threshold: 0.95, // Trigger when 95% of section is visible
            rootMargin: '0px',
          }
        );

        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [
    currentSection,
    isScrolling,
    targetSection,
    isInitialLoad,
    containerRef,
    onSectionReached,
    onTargetReached,
    onInitialLoadComplete,
  ]);

  return { sectionRefs };
};

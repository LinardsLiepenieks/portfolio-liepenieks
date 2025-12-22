'use client';

import { useEffect, useState, RefObject } from 'react';

interface UseFreeScrollTrackingProps {
  enabled: boolean;
  sectionRefs: RefObject<(HTMLElement | null)[]>;
  containerRef: RefObject<HTMLElement | null>;
  routes: string[];
  initialSection?: number;
  onSectionChange?: (sectionIndex: number) => void;
}

export const useFreeScrollTracking = ({
  enabled,
  sectionRefs,
  containerRef,
  routes,
  initialSection = 0,
  onSectionChange,
}: UseFreeScrollTrackingProps) => {
  const [currentSection, setCurrentSection] = useState(initialSection);

  useEffect(() => {
    if (enabled) {
      setCurrentSection(initialSection);
    }
  }, [enabled, initialSection]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const observerOptions = {
      root: containerRef.current,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = sectionRefs.current?.findIndex(
            (ref) => ref === entry.target
          );

          if (
            sectionIndex !== undefined &&
            sectionIndex !== -1 &&
            sectionIndex !== currentSection
          ) {
            setCurrentSection(sectionIndex);

            const newURL = routes[sectionIndex];
            window.history.replaceState(
              { sectionIndex, fromScroll: true },
              '',
              newURL
            );

            // Inform parent of the change so snap mode is ready
            onSectionChange?.(sectionIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const timeoutId = setTimeout(() => {
      sectionRefs.current?.forEach((section) => {
        if (section) observer.observe(section);
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [
    enabled,
    routes,
    currentSection,
    containerRef,
    sectionRefs,
    onSectionChange,
  ]);

  return { currentSection };
};

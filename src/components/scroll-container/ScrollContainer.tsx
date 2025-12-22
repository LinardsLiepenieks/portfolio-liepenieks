'use client';

import {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useScrollContainer } from '@/hooks/scroll-container/useScrollContainer';
import { useURLScrollSync } from '@/hooks/scroll-container/useURLScrollSync';
import { useFreeScrollTracking } from '@/hooks/scroll-container/useFreeScrollTracking';
import { ScrollIndicators } from './ScrollIndicators';

interface ScrollContainerProps {
  children: ReactNode[];
  routes: string[];
}

export interface ScrollContainerRef {
  scrollToSection: (index: number) => void;
  setScrollSnapEnabled: (enabled: boolean) => void;
}

const ScrollContainer = forwardRef<ScrollContainerRef, ScrollContainerProps>(
  ({ children, routes }, ref) => {
    const [scrollSnapEnabled, setScrollSnapEnabled] = useState(true);
    const previousModeRef = useRef(scrollSnapEnabled);
    const mainRef = useRef<HTMLElement>(null);

    const {
      currentSection: snapCurrentSection,
      containerRef: snapContentRef,
      sectionRefs,
      scrollToSection: snapScrollToSection,
      handlePopStateNavigation,
      handleURLSectionChange,
    } = useScrollContainer({
      totalSections: children.length,
      updateURL: (sectionIndex: number) => {
        const newURL = routes[sectionIndex];
        window.history.pushState(
          { sectionIndex, fromScroll: true },
          '',
          newURL
        );
      },
      enabled: scrollSnapEnabled,
    });

    const { currentSection: freeCurrentSection } = useFreeScrollTracking({
      enabled: !scrollSnapEnabled,
      sectionRefs,
      containerRef: mainRef,
      routes,
      initialSection: snapCurrentSection,
    });

    const unifiedScrollToSection = useCallback(
      (index: number) => {
        if (scrollSnapEnabled) {
          snapScrollToSection(index);
        } else if (mainRef.current) {
          mainRef.current.scrollTo({
            top: index * window.innerHeight,
            behavior: 'smooth',
          });
        }
      },
      [scrollSnapEnabled, snapScrollToSection]
    );

    useImperativeHandle(ref, () => ({
      scrollToSection: unifiedScrollToSection,
      setScrollSnapEnabled,
    }));

    useURLScrollSync({
      routes,
      onSectionChange: handleURLSectionChange,
      onPopState: handlePopStateNavigation,
      enabled: scrollSnapEnabled,
    });

    useEffect(() => {
      const modeChanged = previousModeRef.current !== scrollSnapEnabled;
      if (!modeChanged) return;
      previousModeRef.current = scrollSnapEnabled;

      if (!scrollSnapEnabled) {
        // --- Switching to FREE SCROLL ---
        if (snapContentRef.current && mainRef.current) {
          const targetSection = snapCurrentSection;
          snapContentRef.current.style.transition = 'none';
          snapContentRef.current.style.transform = 'none';
          mainRef.current.scrollTop = targetSection * window.innerHeight;
        }
      } else {
        // --- Switching to SNAP MODE ---
        if (mainRef.current) {
          // CRITICAL: Reset native scroll to 0 so it doesn't add to the transform
          mainRef.current.scrollTop = 0;
        }

        // Snap to the section identified during free scroll
        const sectionToSnapTo = freeCurrentSection;

        // skipAnimation: true, force: true to center immediately
        snapScrollToSection(sectionToSnapTo, true, true);
      }
    }, [
      scrollSnapEnabled,
      freeCurrentSection,
      snapCurrentSection,
      snapScrollToSection,
      snapContentRef,
      routes,
    ]);

    const activeSection = scrollSnapEnabled
      ? snapCurrentSection
      : freeCurrentSection;

    return (
      <main
        ref={mainRef}
        className={`relative w-full h-screen ${
          scrollSnapEnabled
            ? 'overflow-hidden'
            : 'overflow-y-auto overflow-x-hidden'
        }`}
        style={{ height: '100dvh' }}
      >
        <div ref={snapContentRef} className="w-full will-change-transform">
          {children.map((child, index) => (
            <section
              key={index}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="h-screen w-full flex-shrink-0"
              style={{ height: '100dvh' }}
            >
              {child}
            </section>
          ))}
        </div>

        <ScrollIndicators
          totalSections={children.length}
          currentSection={activeSection}
          onSectionClick={unifiedScrollToSection}
        />
      </main>
    );
  }
);

ScrollContainer.displayName = 'ScrollContainer';
export default ScrollContainer;

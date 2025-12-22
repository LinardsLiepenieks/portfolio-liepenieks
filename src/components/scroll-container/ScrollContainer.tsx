'use client';

import {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { useScrollContainer } from '@/hooks/scroll-container/useScrollContainer';
import { useURLScrollSync } from '@/hooks/scroll-container/useURLScrollSync';
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

    const {
      currentSection,
      containerRef,
      sectionRefs,
      scrollToSection,
      handlePopStateNavigation,
      handleURLSectionChange,
    } = useScrollContainer({
      totalSections: children.length,
      updateURL: (sectionIndex: number) => {
        const newURL = routes[sectionIndex];
        window.history.pushState({ sectionIndex, fromScroll: true }, '', newURL);
      },
      enabled: scrollSnapEnabled,
    });

    // Expose methods to parent components (like Navbar)
    useImperativeHandle(ref, () => ({
      scrollToSection,
      setScrollSnapEnabled,
    }));

    // Sync URL changes (Back/Forward buttons) with the scroll state
    useURLScrollSync({
      routes,
      onSectionChange: handleURLSectionChange,
      onPopState: handlePopStateNavigation,
    });

    // Reset transform when switching to Free Scroll to avoid being "stuck" mid-way
    useEffect(() => {
      if (!scrollSnapEnabled && containerRef.current) {
        containerRef.current.style.transform = 'none';
      } else if (scrollSnapEnabled && containerRef.current) {
        const targetY = currentSection * window.innerHeight;
        containerRef.current.style.transform = `translateY(-${targetY}px)`;
      }
    }, [scrollSnapEnabled, currentSection]);

    return (
      <main
        className={`relative w-full h-screen ${
          scrollSnapEnabled
            ? 'overflow-hidden'
            : 'overflow-y-auto overflow-x-hidden'
        }`}
        style={{
          // Fix for mobile address bar jumping
          height: '100dvh',
        }}
      >
        <div
          ref={containerRef}
          className="w-full will-change-transform"
        >
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

        {scrollSnapEnabled && (
          <ScrollIndicators
            totalSections={children.length}
            currentSection={currentSection}
            onSectionClick={scrollToSection}
          />
        )}
      </main>
    );
  }
);

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;

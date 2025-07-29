'use client';

import { ReactNode, forwardRef, useImperativeHandle } from 'react';
import { useScrollContainer } from '@/hooks/scroll-container/useScrollContainer';
import { useURLScrollSync } from '@/hooks/scroll-container/useURLScrollSync';
import { ScrollIndicators } from './ScrollIndicators';

interface ScrollContainerProps {
  children: ReactNode[];
  routes: string[];
}

export interface ScrollContainerRef {
  scrollToSection: (index: number) => void;
}

const ScrollContainer = forwardRef<ScrollContainerRef, ScrollContainerProps>(
  ({ children, routes }, ref) => {
    // Initialize URL sync first to get the updateURL function
    const { updateURL } = useURLScrollSync({
      routes,
      onSectionChange: () => {},
      onPopState: () => {},
    });

    // Use unified scroll container hook
    const {
      currentSection,
      containerRef,
      sectionRefs,
      scrollToSection,
      handlePopStateNavigation,
      handleURLSectionChange,
    } = useScrollContainer({
      totalSections: children.length,
      updateURL,
    });

    // Expose scrollToSection method through ref
    useImperativeHandle(ref, () => ({
      scrollToSection,
    }));

    // Re-initialize URL sync with proper callbacks
    useURLScrollSync({
      routes,
      onSectionChange: handleURLSectionChange,
      onPopState: handlePopStateNavigation,
    });

    return (
      <main ref={containerRef} className="h-screen overflow-hidden">
        {children.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="h-screen w-full"
          >
            {child}
          </div>
        ))}

        <ScrollIndicators
          totalSections={children.length}
          currentSection={currentSection}
          onSectionClick={scrollToSection}
        />
      </main>
    );
  }
);

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;

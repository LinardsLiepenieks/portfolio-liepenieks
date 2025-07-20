'use client';

import { ReactNode } from 'react';
import { useScrollState } from '@/hooks/scroll-container/useScrollState';
import { useURLScrollSync } from '@/hooks/scroll-container/useURLScrollSync';
import { useScrollObserver } from '@/hooks/scroll-container/useScrollObserver';
import { useScrollNavigation } from '@/hooks/scroll-container/useScrollNavigation';
import { ScrollIndicators } from './ScrollIndicators';
interface ScrollContainerProps {
  children: ReactNode[];
  routes: string[]; // Array of route paths like ['/', '/about', '/contact']
}

export default function ScrollContainer({
  children,
  routes,
}: ScrollContainerProps) {
  // Initialize URL sync first to get the updateURL function
  const { updateURL } = useURLScrollSync({
    routes,
    onSectionChange: () => {}, // We'll update this below
    onPopState: () => {}, // We'll update this below
  });

  // Initialize scroll state with the updateURL function
  const {
    currentSection,
    isScrolling,
    targetSection,
    isInitialLoad,
    containerRef,
    scrollToSection,
    handleSectionReached,
    handleTargetReached,
    handleInitialLoadComplete,
    handlePopStateNavigation,
    handleURLSectionChange,
  } = useScrollState(children.length, updateURL);

  // Re-initialize URL sync with proper callbacks
  useURLScrollSync({
    routes,
    onSectionChange: handleURLSectionChange,
    onPopState: handlePopStateNavigation,
  });

  // Initialize scroll observer
  const { sectionRefs } = useScrollObserver({
    currentSection,
    isScrolling,
    targetSection,
    isInitialLoad,
    containerRef,
    onSectionReached: handleSectionReached,
    onTargetReached: handleTargetReached,
    onInitialLoadComplete: handleInitialLoadComplete,
  });

  // Initialize scroll navigation
  useScrollNavigation({
    currentSection,
    isScrolling,
    totalSections: children.length,
    onScrollToSection: scrollToSection,
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

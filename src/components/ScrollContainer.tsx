'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface ScrollContainerProps {
  children: ReactNode[];
  routes: string[]; // Array of route paths like ['/', '/about', '/contact']
}

export default function ScrollContainer({
  children,
  routes,
}: ScrollContainerProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [targetSection, setTargetSection] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize current section based on URL
  useEffect(() => {
    const routeIndex = routes.indexOf(pathname);
    if (routeIndex !== -1) {
      // Check for instant parameter
      const scrollBehavior =
        searchParams.get('instant') === 'true' ? 'instant' : 'smooth';

      // On initial load, don't update currentSection until we reach the target
      if (isInitialLoad) {
        setTargetSection(routeIndex);
        setIsScrolling(true);
        console.log(
          `Initial load: targeting section ${routeIndex} for ${pathname}`
        );
      } else {
        setCurrentSection(routeIndex);
      }

      // Scroll to section if needed
      if (containerRef.current) {
        const targetElement = containerRef.current.children[
          routeIndex
        ] as HTMLElement;
        targetElement.scrollIntoView({
          behavior: scrollBehavior,
          block: 'start',
        });
      }
    }
  }, [pathname, routes, isInitialLoad]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('PopState event:', event.state);

      if (event.state && typeof event.state.sectionIndex === 'number') {
        const newSection = event.state.sectionIndex;
        console.log(`Navigating to section ${newSection} via popstate`);

        setCurrentSection(newSection);
        setIsScrolling(true);
        setTargetSection(newSection);

        // Scroll to the section
        if (containerRef.current) {
          const targetElement = containerRef.current.children[
            newSection
          ] as HTMLElement;
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
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
  }, [pathname, routes]);

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
                    setCurrentSection(index);
                    updateURL(index);
                    setIsScrolling(false);
                    setTargetSection(null);
                    setIsInitialLoad(false);
                  }
                  // Ignore other sections during initial load
                  return;
                }

                // If we're scrolling and have a target, only update to the target section
                if (isScrolling && targetSection !== null) {
                  if (index === targetSection && index !== currentSection) {
                    console.log(`User scroll: reached target section ${index}`);
                    setCurrentSection(index);
                    updateURL(index);
                    setIsScrolling(false);
                    setTargetSection(null);
                  }
                }
                // If not scrolling, update to any section that becomes fully visible
                else if (!isScrolling && currentSection !== index) {
                  console.log(`Auto-update to section ${index}`);
                  setCurrentSection(index);
                  updateURL(index);
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
  }, [currentSection, isScrolling, targetSection, routes, isInitialLoad]);

  // Update URL using History API
  const updateURL = (sectionIndex: number) => {
    const newURL = routes[sectionIndex];
    const state = { sectionIndex };

    console.log(`Updating URL to ${newURL} with state:`, state);

    // Use pushState to add new history entry
    window.history.pushState(state, '', newURL);
  };

  const scrollToSection = (sectionIndex: number) => {
    if (containerRef.current && !isScrolling) {
      console.log(`User scrolling to section ${sectionIndex}`);
      setIsScrolling(true);
      setTargetSection(sectionIndex);

      const targetElement = containerRef.current.children[
        sectionIndex
      ] as HTMLElement;
      targetElement.scrollIntoView({
        behavior: 'smooth',
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
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;

      if (nextSection >= 0 && nextSection < children.length) {
        scrollToSection(nextSection);
      }
    };

    // Touch/swipe support
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

        if (nextSection >= 0 && nextSection < children.length) {
          scrollToSection(nextSection);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          if (currentSection < children.length - 1) {
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

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSection, isScrolling, children.length]);

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

      {/* Section indicators */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-3">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

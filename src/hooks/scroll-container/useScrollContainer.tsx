import { useRef, useState, useCallback, useEffect } from 'react';

interface UseScrollContainerProps {
  totalSections: number;
  updateURL: (sectionIndex: number) => void;
}

export const useScrollContainer = ({
  totalSections,
  updateURL,
}: UseScrollContainerProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const isScrollingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastThrottleTimeRef = useRef(0);

  const THROTTLE_WAIT = 900; // ms
  const MIN_DELTA = 4; // minimum deltaY to consider

  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      console.log('🚀 Scrolling to section:', sectionIndex);
      const targetElement = sectionRefs.current[sectionIndex];
      if (targetElement) {
        isScrollingRef.current = true;
        console.log('✅ Set isScrolling = true');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setCurrentSection(sectionIndex);
        updateURL(sectionIndex);
      }
    },
    [updateURL]
  );

  const handlePopStateNavigation = useCallback((sectionIndex: number) => {
    const targetElement = sectionRefs.current[sectionIndex];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSection(sectionIndex);
    }
  }, []);

  const handleURLSectionChange = useCallback(
    (sectionIndex: number, behavior: 'smooth' | 'instant' = 'smooth') => {
      const targetElement = sectionRefs.current[sectionIndex];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior, block: 'start' });
        setCurrentSection(sectionIndex);
      }
    },
    []
  );

  // Stop scrolling animation when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            console.log(
              '👁️ Observer: Section in view - only resetting isScrolling flag'
            );
            // Only reset the scrolling flag, NOT the throttle
            // Let throttle expire naturally to prevent momentum events from triggering new scrolls
            isScrollingRef.current = false;
            console.log('✅ Set isScrolling = false (throttle still active)');
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [totalSections]);

  useEffect(() => {
    const throttledWheelHandler = (e: WheelEvent) => {
      e.preventDefault();

      console.log('🖱️ Wheel event:', {
        deltaY: e.deltaY,
        absDelta: Math.abs(e.deltaY),
        minDelta: MIN_DELTA,
        isScrolling: isScrollingRef.current,
        lastThrottle: lastThrottleTimeRef.current,
        now: Date.now(),
        timeDiff: Date.now() - lastThrottleTimeRef.current,
        throttleWait: THROTTLE_WAIT,
      });

      // Dismiss wheel events with very small delta values (touchpad noise)
      if (Math.abs(e.deltaY) < MIN_DELTA) {
        console.log('❌ Dismissed: Delta too small');
        return;
      }

      // If currently scrolling, ignore
      if (isScrollingRef.current) {
        console.log('❌ Dismissed: Currently scrolling');
        return;
      }

      // Throttle: check if enough time has passed since last action
      const now = Date.now();
      if (now - lastThrottleTimeRef.current < THROTTLE_WAIT) {
        console.log('❌ Dismissed: Throttled - momentum blocked');
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;

      console.log('📍 Current section:', currentSection, 'Next:', nextSection);

      // Check bounds
      if (nextSection >= 0 && nextSection < totalSections) {
        console.log('✅ Valid scroll, executing');
        scrollToSection(nextSection);
        lastThrottleTimeRef.current = now;
        console.log('⏰ Set throttle time to:', now);
      } else {
        console.log('❌ Dismissed: Out of bounds');
      }
    };

    window.addEventListener('wheel', throttledWheelHandler, { passive: false });

    return () => {
      window.removeEventListener('wheel', throttledWheelHandler);
    };
  }, [currentSection, totalSections, scrollToSection]);

  return {
    currentSection,
    containerRef,
    sectionRefs,
    scrollToSection,
    handlePopStateNavigation,
    handleURLSectionChange,
  };
};

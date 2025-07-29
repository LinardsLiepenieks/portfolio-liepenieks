import { useRef, useState, useCallback, useEffect } from 'react';

interface UseScrollContainerProps {
  totalSections: number;
  updateURL: (sectionIndex: number) => void;
}

const DEBUG = false; // Set to true for development debugging

export const useScrollContainer = ({
  totalSections,
  updateURL,
}: UseScrollContainerProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const isScrollingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastThrottleTimeRef = useRef(0);

  // Delta pattern analysis tracking
  const lastDeltaRef = useRef(0);
  const lastDirectionRef = useRef(0);
  const lastEventTimeRef = useRef(0);

  const THROTTLE_WAIT = 400; // ms - reduced for better responsiveness
  const MOMENTUM_THROTTLE = 1800; // ms - extended throttle for momentum
  const MIN_DELTA = 4; // minimum deltaY to consider
  const MIN_TIME_GAP = 1500; // ms - minimum time gap to consider intentional

  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      DEBUG && console.log('🚀 Scrolling to section:', sectionIndex);
      const targetElement = sectionRefs.current[sectionIndex];
      if (targetElement) {
        isScrollingRef.current = true;
        DEBUG && console.log('✅ Set isScrolling = true');
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
            DEBUG &&
              console.log(
                '👁️ Observer: Section in view - only resetting isScrolling flag'
              );
            // Only reset the scrolling flag, NOT the throttle
            // Let throttle expire naturally to prevent momentum events from triggering new scrolls
            isScrollingRef.current = false;
            DEBUG &&
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

      const now = Date.now();
      const currentDelta = Math.abs(e.deltaY);
      const currentDirection = Math.sign(e.deltaY);
      const timeSinceLastEvent = now - lastEventTimeRef.current;

      // Delta pattern analysis for momentum detection
      // A scroll is momentum (not intentional) if ALL of these conditions are true:
      const isTimeTooQuick = timeSinceLastEvent < MIN_TIME_GAP;
      const isSameDirection =
        lastDirectionRef.current !== 0 &&
        currentDirection === lastDirectionRef.current;
      const isDeltaNotIncreasing = currentDelta <= lastDeltaRef.current; // Allow equal or decreasing

      const isMomentumScroll =
        isTimeTooQuick && isSameDirection && isDeltaNotIncreasing;
      const isIntentionalScroll = !isMomentumScroll;

      // Update tracking values
      lastDeltaRef.current = currentDelta;
      lastDirectionRef.current = currentDirection;
      lastEventTimeRef.current = now;

      if (DEBUG) {
        console.log('🖱️ Wheel event:', {
          deltaY: e.deltaY,
          absDelta: currentDelta,
          minDelta: MIN_DELTA,
          timeSinceLastEvent,
          isTimeTooQuick,
          isSameDirection,
          isDeltaNotIncreasing,
          isIntentionalScroll,
          isMomentumScroll,
          effectiveThrottle: isMomentumScroll
            ? MOMENTUM_THROTTLE
            : THROTTLE_WAIT,
          isScrolling: isScrollingRef.current,
          lastThrottle: lastThrottleTimeRef.current,
          timeDiff: now - lastThrottleTimeRef.current,
        });
      }

      // Dismiss wheel events with very small delta values (touchpad noise)
      if (currentDelta < MIN_DELTA) {
        DEBUG && console.log('❌ Dismissed: Delta too small');
        return;
      }

      // If currently scrolling, ignore
      if (isScrollingRef.current) {
        DEBUG && console.log('❌ Dismissed: Currently scrolling');
        return;
      }

      // Dynamic throttle based on momentum detection
      const effectiveThrottle = isMomentumScroll
        ? MOMENTUM_THROTTLE
        : THROTTLE_WAIT;

      if (now - lastThrottleTimeRef.current < effectiveThrottle) {
        DEBUG &&
          console.log(
            `❌ Dismissed: Throttled - ${
              isMomentumScroll ? 'momentum (1800ms)' : 'normal (600ms)'
            } blocked`
          );
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;

      DEBUG &&
        console.log(
          '📍 Current section:',
          currentSection,
          'Next:',
          nextSection
        );

      // Check bounds
      if (nextSection >= 0 && nextSection < totalSections) {
        DEBUG && console.log('✅ Valid scroll, executing');
        scrollToSection(nextSection);
        lastThrottleTimeRef.current = now;
        DEBUG && console.log('⏰ Set throttle time to:', now);
      } else {
        DEBUG && console.log('❌ Dismissed: Out of bounds');
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

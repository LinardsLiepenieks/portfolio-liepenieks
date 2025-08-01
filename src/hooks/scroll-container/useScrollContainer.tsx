import { useRef, useState, useCallback, useEffect } from 'react';
import { useTouchpadDetection } from './useTouchpadDetection';
import { useScrollThrottle } from './useScrollThrottle';

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

  // Touch tracking
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const isTouchingRef = useRef(false);

  // Use the extracted hooks
  const { detectInertia, isValidDelta } = useTouchpadDetection({
    minTimeGap: 1500,
    minDelta: 4,
    debug: DEBUG,
  });

  const { isThrottled, updateThrottle, getThrottleStatus } = useScrollThrottle({
    normalThrottle: 400,
    momentumThrottle: 1800,
    debug: DEBUG,
  });

  // Touch constants
  const MIN_TOUCH_DISTANCE = 50; // minimum distance for a valid swipe
  const MAX_TOUCH_TIME = 800; // maximum time for a valid swipe (ms)

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
        updateThrottle(); // Update throttle when scrolling
      }
    },
    [updateURL, updateThrottle]
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

  // Wheel event handler - now using extracted hooks
  useEffect(() => {
    const throttledWheelHandler = (e: WheelEvent) => {
      e.preventDefault();

      // Use the extracted touchpad detection
      const isMomentumScroll = detectInertia(e);
      const throttleStatus = getThrottleStatus(isMomentumScroll);

      if (DEBUG) {
        console.log('🖱️ Wheel event:', {
          deltaY: e.deltaY,
          isMomentumScroll,
          throttleStatus,
          isScrolling: isScrollingRef.current,
        });
      }

      // Dismiss wheel events with very small delta values (touchpad noise)
      if (!isValidDelta(e.deltaY)) {
        DEBUG && console.log('❌ Dismissed: Delta too small');
        return;
      }

      // If currently scrolling, ignore
      if (isScrollingRef.current) {
        DEBUG && console.log('❌ Dismissed: Currently scrolling');
        return;
      }

      // Check throttle using the extracted hook
      if (isThrottled(isMomentumScroll)) {
        DEBUG &&
          console.log(
            `❌ Dismissed: Throttled - ${throttleStatus.throttleType} (${throttleStatus.effectiveThrottle}ms) blocked`
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
      } else {
        DEBUG && console.log('❌ Dismissed: Out of bounds');
      }
    };

    window.addEventListener('wheel', throttledWheelHandler, { passive: false });

    return () => {
      window.removeEventListener('wheel', throttledWheelHandler);
    };
  }, [
    currentSection,
    totalSections,
    scrollToSection,
    detectInertia,
    isValidDelta,
    isThrottled,
    getThrottleStatus,
  ]);

  // Touch event handlers
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isScrollingRef.current) {
        DEBUG && console.log('📱❌ Touch dismissed: Currently scrolling');
        return;
      }

      const touch = e.touches[0];
      touchStartYRef.current = touch.clientY;
      touchStartTimeRef.current = Date.now();
      isTouchingRef.current = true;

      DEBUG &&
        console.log('📱🟢 Touch start:', {
          y: touch.clientY,
          time: touchStartTimeRef.current,
        });
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scrolling behavior during touch
      if (isTouchingRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouchingRef.current) {
        DEBUG && console.log('📱❌ Touch end dismissed: Not touching');
        return;
      }

      const touch = e.changedTouches[0];
      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();

      const deltaY = touchStartYRef.current - touchEndY;
      const deltaTime = touchEndTime - touchStartTimeRef.current;
      const distance = Math.abs(deltaY);

      isTouchingRef.current = false;

      DEBUG &&
        console.log('📱🔴 Touch end:', {
          startY: touchStartYRef.current,
          endY: touchEndY,
          deltaY,
          distance,
          deltaTime,
          minDistance: MIN_TOUCH_DISTANCE,
          maxTime: MAX_TOUCH_TIME,
        });

      // Check if it's a valid swipe
      if (distance < MIN_TOUCH_DISTANCE) {
        DEBUG && console.log('📱❌ Touch dismissed: Distance too small');
        return;
      }

      if (deltaTime > MAX_TOUCH_TIME) {
        DEBUG && console.log('📱❌ Touch dismissed: Too slow');
        return;
      }

      // Check throttle using the normal throttle for touch events
      if (isThrottled(false)) {
        // false = not momentum scroll for touch
        DEBUG && console.log('📱❌ Touch dismissed: Throttled');
        return;
      }

      // Determine direction (positive deltaY = swipe up = go to next section)
      const direction = deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;

      DEBUG &&
        console.log(
          '📱📍 Current section:',
          currentSection,
          'Next:',
          nextSection
        );

      // Check bounds
      if (nextSection >= 0 && nextSection < totalSections) {
        DEBUG && console.log('📱✅ Valid swipe, executing');
        scrollToSection(nextSection);
      } else {
        DEBUG && console.log('📱❌ Touch dismissed: Out of bounds');
      }
    };

    const handleTouchCancel = () => {
      isTouchingRef.current = false;
      DEBUG && console.log('📱🟡 Touch cancelled');
    };

    // Add touch event listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, {
      passive: true,
    });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [currentSection, totalSections, scrollToSection, isThrottled]);

  return {
    currentSection,
    containerRef,
    sectionRefs,
    scrollToSection,
    handlePopStateNavigation,
    handleURLSectionChange,
  };
};

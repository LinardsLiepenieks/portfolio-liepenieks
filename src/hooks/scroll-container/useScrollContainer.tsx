import { useRef, useState, useCallback, useEffect } from 'react';
import { useWheelGestureDetection } from './useWheelGestureDetection';
import { useScrollThrottle } from './useScrollThrottle';

interface UseScrollContainerProps {
  totalSections: number;
  updateURL: (sectionIndex: number) => void;
  enabled?: boolean;
}

const DEBUG = true;

export const useScrollContainer = ({
  totalSections,
  updateURL,
  enabled = true,
}: UseScrollContainerProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  // Constants
  const ANIMATION_DURATION = 500;
  const MIN_TOUCH_DISTANCE = 50;
  const MAX_TOUCH_TIME = 800;

  // Use gesture-based detection - only accept first event of each gesture
  const { check: gestureCheck } = useWheelGestureDetection({
    debug: DEBUG,
  });

  const { isThrottled, acceptScroll } = useScrollThrottle({
    scrollCooldown: 50, // Very short cooldown - gesture detection does the heavy lifting
    animationDuration: ANIMATION_DURATION,
    debug: DEBUG,
  });

  const scrollToSection = useCallback(
    (sectionIndex: number, skipAnimation = false) => {
      if (sectionIndex < 0 || sectionIndex >= totalSections) return;
      if (!containerRef.current) return;

      // Prevent scrolling to the same section
      if (sectionIndex === currentSection) {
        DEBUG && console.log('📍 Already at section:', sectionIndex);
        return;
      }

      const container = containerRef.current;
      const targetY = sectionIndex * window.innerHeight;

      container.style.transition = skipAnimation
        ? 'none'
        : `transform ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      container.style.transform = `translateY(-${targetY}px)`;

      if (!skipAnimation) {
        acceptScroll(); // Track animation state
      }

      setCurrentSection(sectionIndex);
      updateURL(sectionIndex);

      DEBUG && console.log('📍 Scrolled to section:', sectionIndex);
    },
    [totalSections, updateURL, acceptScroll, currentSection]
  );

  const handlePopStateNavigation = useCallback(
    (sectionIndex: number) => {
      scrollToSection(sectionIndex, false);
    },
    [scrollToSection]
  );

  const handleURLSectionChange = useCallback(
    (sectionIndex: number, behavior: 'smooth' | 'instant' = 'smooth') => {
      scrollToSection(sectionIndex, behavior === 'instant');
    },
    [scrollToSection]
  );

  // Wheel event handler
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Gesture detection - determines if this is first event of a new gesture
      const scrollDirection = gestureCheck(e);

      if (scrollDirection === false) {
        // Not the first event of a gesture - block it
        return;
      }

      // Check if we're in the middle of an animation
      if (isThrottled()) {
        DEBUG &&
          console.log('⛔ New gesture detected but animation in progress');
        return;
      }

      // This is a new gesture AND no animation running - accept it!
      const nextSection = currentSection + scrollDirection;

      if (nextSection >= 0 && nextSection < totalSections) {
        scrollToSection(nextSection);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [
    enabled,
    currentSection,
    totalSections,
    scrollToSection,
    gestureCheck,
    isThrottled,
  ]);

  // Keyboard navigation
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isThrottled()) return;

      let direction = 0;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        direction = 1;
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        direction = -1;
      } else if (e.key === 'Home') {
        scrollToSection(0);
        return;
      } else if (e.key === 'End') {
        scrollToSection(totalSections - 1);
        return;
      }

      if (direction !== 0) {
        e.preventDefault();
        const nextSection = currentSection + direction;
        if (nextSection >= 0 && nextSection < totalSections) {
          scrollToSection(nextSection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, currentSection, totalSections, scrollToSection, isThrottled]);

  // Touch event handlers
  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartYRef.current = touch.clientY;
      touchStartTimeRef.current = Date.now();

      DEBUG && console.log('📱 Touch start:', touch.clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isThrottled()) return;

      const touch = e.changedTouches[0];
      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();

      const deltaY = touchStartYRef.current - touchEndY;
      const deltaTime = touchEndTime - touchStartTimeRef.current;
      const distance = Math.abs(deltaY);

      DEBUG &&
        console.log('📱 Touch end:', {
          deltaY,
          distance,
          deltaTime,
        });

      // Validate swipe
      if (distance < MIN_TOUCH_DISTANCE || deltaTime > MAX_TOUCH_TIME) {
        return;
      }

      const direction = deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;

      if (nextSection >= 0 && nextSection < totalSections) {
        scrollToSection(nextSection);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, currentSection, totalSections, scrollToSection, isThrottled]);

  return {
    currentSection,
    containerRef,
    sectionRefs,
    scrollToSection,
    handlePopStateNavigation,
    handleURLSectionChange,
  };
};

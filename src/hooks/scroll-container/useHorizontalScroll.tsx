// useHorizontalScrollContainer.js
import { useRef, useState, useCallback, useEffect } from 'react';
import { useTouchpadDetection } from './useTouchpadDetection';
import { useScrollThrottle } from './useScrollThrottle';

interface UseHorizontalScrollContainerProps {
  totalItems: number;
  updateActiveItem?: (itemIndex: number) => void;
}

const DEBUG = false; // Set to true for development debugging

export const useHorizontalScrollContainer = ({
  totalItems,
  updateActiveItem,
}: UseHorizontalScrollContainerProps) => {
  const [currentItem, setCurrentItem] = useState(0);
  const isScrollingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Touch tracking
  const touchStartXRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const isTouchingRef = useRef(false);

  // Use the existing hooks (same as vertical)
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

  const scrollToItem = useCallback(
    (itemIndex: number) => {
      const targetElement = itemRefs.current[itemIndex];
      if (targetElement) {
        isScrollingRef.current = true;
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
        setCurrentItem(itemIndex);
        updateActiveItem?.(itemIndex);
        updateThrottle(); // Update throttle when scrolling
      }
    },
    [updateActiveItem, updateThrottle]
  );

  const handleItemChange = useCallback(
    (itemIndex: number, behavior: 'smooth' | 'instant' = 'smooth') => {
      const targetElement = itemRefs.current[itemIndex];
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior,
          block: 'nearest',
          inline: 'center',
        });
        setCurrentItem(itemIndex);
      }
    },
    []
  );

  // Stop scrolling animation when item comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            DEBUG &&
              console.log(
                '👁️ Observer: Item in view - only resetting isScrolling flag'
              );
            isScrollingRef.current = false;
            DEBUG &&
              console.log('✅ Set isScrolling = false (throttle still active)');
          }
        });
      },
      {
        threshold: 0.5,
        root: containerRef.current,
      }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [totalItems]);

  // Wheel event handler - horizontal scrolling
  useEffect(() => {
    const throttledWheelHandler = (e: WheelEvent) => {
      // Only handle horizontal scroll or shift+wheel for horizontal movement
      const deltaX = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0;

      if (deltaX === 0) return; // No horizontal movement

      e.preventDefault();

      // Create a mock event for the existing detectInertia function
      const mockEvent = { ...e, deltaY: deltaX };
      const isMomentumScroll = detectInertia(mockEvent);
      const throttleStatus = getThrottleStatus(isMomentumScroll);

      if (DEBUG) {
        console.log('🖱️ Horizontal Wheel event:', {
          deltaX,
          isMomentumScroll,
          throttleStatus,
          isScrolling: isScrollingRef.current,
        });
      }

      // Dismiss wheel events with very small delta values (touchpad noise)
      if (!isValidDelta(deltaX)) {
        return;
      }

      // If currently scrolling, ignore
      if (isScrollingRef.current) {
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

      const direction = deltaX > 0 ? 1 : -1;
      const nextItem = currentItem + direction;

      DEBUG && console.log('📍 Current item:', currentItem, 'Next:', nextItem);

      // Check bounds
      if (nextItem >= 0 && nextItem < totalItems) {
        scrollToItem(nextItem);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', throttledWheelHandler, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', throttledWheelHandler);
      }
    };
  }, [
    currentItem,
    totalItems,
    scrollToItem,
    detectInertia,
    isValidDelta,
    isThrottled,
    getThrottleStatus,
  ]);

  // Touch event handlers - horizontal
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isScrollingRef.current) {
        return;
      }

      const touch = e.touches[0];
      touchStartXRef.current = touch.clientX;
      touchStartTimeRef.current = Date.now();
      isTouchingRef.current = true;

      DEBUG &&
        console.log('📱🟢 Touch start:', {
          x: touch.clientX,
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
        return;
      }

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndTime = Date.now();

      const deltaX = touchStartXRef.current - touchEndX;
      const deltaTime = touchEndTime - touchStartTimeRef.current;
      const distance = Math.abs(deltaX);

      isTouchingRef.current = false;

      DEBUG &&
        console.log('📱🔴 Touch end:', {
          startX: touchStartXRef.current,
          endX: touchEndX,
          deltaX,
          distance,
          deltaTime,
          minDistance: MIN_TOUCH_DISTANCE,
          maxTime: MAX_TOUCH_TIME,
        });

      // Check if it's a valid swipe
      if (distance < MIN_TOUCH_DISTANCE) {
        return;
      }

      if (deltaTime > MAX_TOUCH_TIME) {
        return;
      }

      // Check throttle using the normal throttle for touch events
      if (isThrottled(false)) {
        return;
      }

      // Determine direction (positive deltaX = swipe left = go to next item)
      const direction = deltaX > 0 ? 1 : -1;
      const nextItem = currentItem + direction;

      DEBUG &&
        console.log('📱📍 Current item:', currentItem, 'Next:', nextItem);

      // Check bounds
      if (nextItem >= 0 && nextItem < totalItems) {
        scrollToItem(nextItem);
      }
    };

    const handleTouchCancel = () => {
      isTouchingRef.current = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      container.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      container.addEventListener('touchcancel', handleTouchCancel, {
        passive: true,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchcancel', handleTouchCancel);
      }
    };
  }, [currentItem, totalItems, scrollToItem, isThrottled]);

  return {
    currentItem,
    containerRef,
    itemRefs,
    scrollToItem,
    handleItemChange,
  };
};

// Only need the main useHorizontalScrollContainer hook
// Reuses existing useTouchpadDetection and useScrollThrottle hooks

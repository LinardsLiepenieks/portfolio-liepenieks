import { useRef, useState, useCallback, useEffect } from 'react';

interface UseHorizontalScrollProps {
  totalItems: number;
}

const DEBUG = false; // Set to true for development debugging

export const useHorizontalScroll = ({
  totalItems,
}: UseHorizontalScrollProps) => {
  const [currentItem, setCurrentItem] = useState(0);
  const isScrollingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollTime = useRef(0);

  // Touch tracking
  const touchStartXRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const isTouchingRef = useRef(false);

  // Scroll constants
  const SCROLL_THROTTLE = 800; // Reduced from 600ms for better responsiveness
  const MIN_TOUCH_DISTANCE = 30; // Reduced from 50 for easier swipes
  const MAX_TOUCH_TIME = 1000; // Increased from 800ms for more forgiving swipes
  const MIN_WHEEL_DELTA = 5; // Reduced from 10 for better sensitivity

  const scrollToItem = useCallback((itemIndex: number) => {
    const targetElement = itemRefs.current[itemIndex];
    if (targetElement && containerRef.current) {
      isScrollingRef.current = true;

      // Use scrollIntoView for smoother, more reliable scrolling
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });

      setCurrentItem(itemIndex);
      lastScrollTime.current = Date.now();

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400); // Slightly less than throttle time
    }
  }, []);

  // Stop scrolling animation when item comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            DEBUG &&
              console.log(
                '👁️ Observer: Item in view - resetting isScrolling flag'
              );
            isScrollingRef.current = false;
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

  // Horizontal wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prioritize horizontal scrolling, but allow vertical-to-horizontal conversion
      let delta = 0;

      // If there's horizontal wheel movement, use it directly
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        delta = e.deltaX;
      }
      // If vertical movement is stronger and there's no horizontal movement, convert it
      else if (Math.abs(e.deltaY) > MIN_WHEEL_DELTA && Math.abs(e.deltaX) < 5) {
        delta = e.deltaY;
      } else {
        return; // Don't handle mixed or unclear scroll directions
      }

      if (Math.abs(delta) < MIN_WHEEL_DELTA) {
        return;
      }

      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_THROTTLE) {
        return;
      }

      if (isScrollingRef.current) {
        return;
      }

      const direction = delta > 0 ? 1 : -1;
      const nextItem = currentItem + direction;

      DEBUG &&
        console.log(
          '📍 Current item:',
          currentItem,
          'Next:',
          nextItem,
          'Delta:',
          delta
        );

      if (nextItem >= 0 && nextItem < totalItems) {
        scrollToItem(nextItem);
      } else {
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [currentItem, totalItems, scrollToItem]);

  // Touch event handlers for horizontal swiping
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
        });

      if (distance < MIN_TOUCH_DISTANCE) {
        return;
      }

      if (deltaTime > MAX_TOUCH_TIME) {
        return;
      }

      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_THROTTLE) {
        return;
      }

      // Positive deltaX = swipe left = go to next item
      const direction = deltaX > 0 ? 1 : -1;
      const nextItem = currentItem + direction;

      DEBUG &&
        console.log('📱📍 Current item:', currentItem, 'Next:', nextItem);

      if (nextItem >= 0 && nextItem < totalItems) {
        scrollToItem(nextItem);
      } else {
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

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchcancel', handleTouchCancel);
      };
    }
  }, [currentItem, totalItems, scrollToItem]);

  return {
    currentItem,
    containerRef,
    itemRefs,
    scrollToItem,
  };
};

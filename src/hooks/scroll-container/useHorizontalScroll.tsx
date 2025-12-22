import { useRef, useState, useCallback, useEffect } from 'react';
import { useWheelGestureDetection } from './useWheelGestureDetection';
import { useScrollThrottle } from './useScrollThrottle';

interface UseHorizontalScrollContainerProps {
  totalItems: number;
  updateActiveItem?: (itemIndex: number) => void;
  enabled?: boolean;
}

const DEBUG = false;

export const useHorizontalScrollContainer = ({
  totalItems,
  updateActiveItem,
  enabled = true,
}: UseHorizontalScrollContainerProps) => {
  const [currentItem, setCurrentItem] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartXRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  // Constants
  const ANIMATION_DURATION = 500;
  const MIN_TOUCH_DISTANCE = 50;
  const MAX_TOUCH_TIME = 800;

  // Use Lethargy-inspired detection (industry standard)
  const { check: lethargyCheck } = useWheelGestureDetection({
    debug: DEBUG,
  });

  const { isThrottled, acceptScroll } = useScrollThrottle({
    scrollCooldown: 100, // Short cooldown to allow quick intentional scrolls
    animationDuration: ANIMATION_DURATION,
    debug: DEBUG,
  });

  const scrollToItem = useCallback(
    (itemIndex: number, skipAnimation = false) => {
      if (itemIndex < 0 || itemIndex >= totalItems) return;
      if (!containerRef.current) return;

      const targetElement = itemRefs.current[itemIndex];
      if (!targetElement) return;

      if (skipAnimation) {
        targetElement.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'center',
        });
      } else {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
        acceptScroll();
      }

      setCurrentItem(itemIndex);
      updateActiveItem?.(itemIndex);

      DEBUG && console.log('📍 Scrolled to item:', itemIndex);
    },
    [totalItems, updateActiveItem, acceptScroll]
  );

  const handleItemChange = useCallback(
    (itemIndex: number, behavior: 'smooth' | 'instant' = 'smooth') => {
      scrollToItem(itemIndex, behavior === 'instant');
    },
    [scrollToItem]
  );

  // Wheel event handler - horizontal scrolling
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      // Handle horizontal scroll or shift+wheel for horizontal movement
      const deltaX = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0;

      if (deltaX === 0) return; // No horizontal movement

      e.preventDefault();

      // Check if we're throttled (during animation)
      if (isThrottled()) {
        DEBUG && console.log('⛔ Horizontal throttled (animation in progress)');
        return;
      }

      // Create a mock wheel event for Lethargy with deltaY = deltaX
      // This allows Lethargy to analyze horizontal scroll momentum
      const mockEvent = { ...e, deltaY: deltaX } as WheelEvent;
      const scrollDirection = lethargyCheck(mockEvent);

      if (scrollDirection === false) {
        // Momentum/inertia event - ignore it
        DEBUG && console.log('⛔ Horizontal momentum blocked');
        return;
      }

      // scrollDirection is 1 (right) or -1 (left) based on deltaX
      const nextItem = currentItem + scrollDirection;

      DEBUG &&
        console.log('✅ Horizontal wheel event accepted:', {
          deltaX,
          scrollDirection,
          currentItem,
          nextItem,
        });

      if (nextItem >= 0 && nextItem < totalItems) {
        scrollToItem(nextItem);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [
    enabled,
    currentItem,
    totalItems,
    scrollToItem,
    lethargyCheck,
    isThrottled,
  ]);

  // Keyboard navigation (Arrow Left/Right)
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isThrottled()) return;

      let direction = 0;
      if (e.key === 'ArrowRight') {
        direction = 1;
      } else if (e.key === 'ArrowLeft') {
        direction = -1;
      } else if (e.key === 'Home') {
        scrollToItem(0);
        return;
      } else if (e.key === 'End') {
        scrollToItem(totalItems - 1);
        return;
      }

      if (direction !== 0) {
        e.preventDefault();
        const nextItem = currentItem + direction;
        if (nextItem >= 0 && nextItem < totalItems) {
          scrollToItem(nextItem);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, currentItem, totalItems, scrollToItem, isThrottled]);

  // Touch event handlers - horizontal swipes
  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartXRef.current = touch.clientX;
      touchStartTimeRef.current = Date.now();

      DEBUG && console.log('📱 Horizontal touch start:', touch.clientX);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isThrottled()) return;

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndTime = Date.now();

      const deltaX = touchStartXRef.current - touchEndX;
      const deltaTime = touchEndTime - touchStartTimeRef.current;
      const distance = Math.abs(deltaX);

      DEBUG &&
        console.log('📱 Horizontal touch end:', {
          deltaX,
          distance,
          deltaTime,
        });

      // Validate swipe
      if (distance < MIN_TOUCH_DISTANCE || deltaTime > MAX_TOUCH_TIME) {
        return;
      }

      const direction = deltaX > 0 ? 1 : -1;
      const nextItem = currentItem + direction;

      if (nextItem >= 0 && nextItem < totalItems) {
        scrollToItem(nextItem);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [enabled, currentItem, totalItems, scrollToItem, isThrottled]);

  return {
    currentItem,
    containerRef,
    itemRefs,
    scrollToItem,
    handleItemChange,
  };
};

'use client';

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

  const { check: lethargyCheck } = useWheelGestureDetection({
    debug: DEBUG,
  });

  const { isThrottled, acceptScroll } = useScrollThrottle({
    scrollCooldown: 100,
    animationDuration: ANIMATION_DURATION,
    debug: DEBUG,
  });

  const scrollToItem = useCallback(
    (itemIndex: number, skipAnimation = false, force = false) => {
      // Prevent double triggers unless forced
      if (!force && itemIndex === currentItem) return;
      if (itemIndex < 0 || itemIndex >= totalItems) return;
      if (!containerRef.current) return;

      const targetElement = itemRefs.current[itemIndex];
      if (!targetElement) return;

      // CRITICAL: Ensure native scrollLeft is 0 if we are using an animated wrapper
      // This prevents the "double offset" jump when switching modes
      if (force && containerRef.current) {
        containerRef.current.scrollLeft = 0;
      }

      targetElement.scrollIntoView({
        behavior: skipAnimation ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });

      if (!skipAnimation) {
        acceptScroll();
      }

      setCurrentItem(itemIndex);
      updateActiveItem?.(itemIndex);
    },
    [totalItems, updateActiveItem, acceptScroll, currentItem]
  );

  // Handle Wheel Events
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      const deltaX = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (deltaX === 0) return;

      e.preventDefault();

      if (isThrottled()) return;

      const mockEvent = { ...e, deltaY: deltaX } as WheelEvent;
      const scrollDirection = lethargyCheck(mockEvent);

      if (scrollDirection === false) return;

      const nextItem = currentItem + scrollDirection;

      if (nextItem >= 0 && nextItem < totalItems) {
        scrollToItem(nextItem);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [
    enabled,
    currentItem,
    totalItems,
    scrollToItem,
    lethargyCheck,
    isThrottled,
  ]);

  // Handle Touch Events (Swipe)
  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartTimeRef.current = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isThrottled()) return;

      const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;
      const deltaTime = Date.now() - touchStartTimeRef.current;
      const distance = Math.abs(deltaX);

      if (distance < MIN_TOUCH_DISTANCE || deltaTime > MAX_TOUCH_TIME) return;

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
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, currentItem, totalItems, scrollToItem, isThrottled]);

  return {
    currentItem,
    containerRef,
    itemRefs,
    scrollToItem,
  };
};

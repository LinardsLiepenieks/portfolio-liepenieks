import { useRef } from 'react';

interface UseScrollThrottleProps {
  scrollCooldown?: number;
  animationDuration?: number;
  debug?: boolean;
}

export const useScrollThrottle = ({
  scrollCooldown = 800,
  animationDuration = 500,
  debug = false,
}: UseScrollThrottleProps = {}) => {
  const lastScrollAcceptedRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const isThrottled = (): boolean => {
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollAcceptedRef.current;

    if (isAnimatingRef.current) {
      if (debug) {
        console.log('❌ Throttled: Animation in progress');
      }
      return true;
    }

    const inCooldown = timeSinceLastScroll < scrollCooldown;

    if (debug && inCooldown) {
      console.log('❌ Throttled: Cooldown active', {
        timeSinceLastScroll,
        remaining: scrollCooldown - timeSinceLastScroll,
      });
    }

    return inCooldown;
  };

  const acceptScroll = (): void => {
    const now = Date.now();
    lastScrollAcceptedRef.current = now;
    isAnimatingRef.current = true;

    setTimeout(() => {
      isAnimatingRef.current = false;
      if (debug) {
        console.log('✨ Animation completed');
      }
    }, animationDuration);

    if (debug) {
      console.log('✅ Scroll accepted at:', now, {
        nextAvailableTime: now + scrollCooldown,
      });
    }
  };

  const getThrottleStatus = () => {
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollAcceptedRef.current;
    const remainingCooldown = Math.max(0, scrollCooldown - timeSinceLastScroll);

    return {
      isThrottled: isAnimatingRef.current || remainingCooldown > 0,
      isAnimating: isAnimatingRef.current,
      timeSinceLastScroll,
      remainingCooldown,
      scrollCooldown,
    };
  };

  const reset = (): void => {
    lastScrollAcceptedRef.current = 0;
    isAnimatingRef.current = false;
    if (debug) {
      console.log('🔄 Throttle reset');
    }
  };

  return {
    isThrottled,
    acceptScroll,
    getThrottleStatus,
    reset,
  };
};

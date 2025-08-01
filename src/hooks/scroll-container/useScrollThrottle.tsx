import { useRef } from 'react';

interface UseScrollThrottleProps {
  normalThrottle?: number; // normal throttle time in ms
  momentumThrottle?: number; // momentum throttle time in ms
  debug?: boolean; // enable debug logging
}

export const useScrollThrottle = ({
  normalThrottle = 400,
  momentumThrottle = 1800,
  debug = false,
}: UseScrollThrottleProps = {}) => {
  const lastThrottleTimeRef = useRef(0);

  const isThrottled = (isMomentumScroll: boolean): boolean => {
    const now = Date.now();
    const effectiveThrottle = isMomentumScroll
      ? momentumThrottle
      : normalThrottle;
    const timeSinceLastThrottle = now - lastThrottleTimeRef.current;
    const throttled = timeSinceLastThrottle < effectiveThrottle;

    if (debug && throttled) {
      console.log('⏳ Scroll Throttled:', {
        isMomentumScroll,
        effectiveThrottle,
        timeSinceLastThrottle,
        throttleType: isMomentumScroll ? 'momentum' : 'normal',
        waitTime: effectiveThrottle - timeSinceLastThrottle,
      });
    }

    return throttled;
  };

  const updateThrottle = (): void => {
    const now = Date.now();
    lastThrottleTimeRef.current = now;

    if (debug) {
      console.log('⏰ Throttle Updated:', {
        timestamp: now,
        nextAvailableTime: now + normalThrottle,
      });
    }
  };

  const getThrottleStatus = (isMomentumScroll: boolean) => {
    const now = Date.now();
    const effectiveThrottle = isMomentumScroll
      ? momentumThrottle
      : normalThrottle;
    const timeSinceLastThrottle = now - lastThrottleTimeRef.current;
    const remainingTime = Math.max(
      0,
      effectiveThrottle - timeSinceLastThrottle
    );

    return {
      isThrottled: remainingTime > 0,
      remainingTime,
      effectiveThrottle,
      timeSinceLastThrottle,
      throttleType: isMomentumScroll ? 'momentum' : 'normal',
    };
  };

  const reset = (): void => {
    lastThrottleTimeRef.current = 0;
    if (debug) {
      console.log('🔄 Throttle Reset');
    }
  };

  return {
    isThrottled,
    updateThrottle,
    getThrottleStatus,
    reset,
  };
};

import { useRef } from 'react';

interface UseTouchpadDetectionProps {
  minTimeGap?: number; // minimum time gap to consider intentional (ms)
  minDelta?: number; // minimum deltaY to consider
  debug?: boolean; // enable debug logging
}

export const useTouchpadDetection = ({
  minTimeGap = 1500,
  minDelta = 4,
  debug = false,
}: UseTouchpadDetectionProps = {}) => {
  // Delta pattern analysis tracking
  const lastDeltaRef = useRef(0);
  const lastDirectionRef = useRef(0);
  const lastEventTimeRef = useRef(0);

  const detectInertia = (e: WheelEvent): boolean => {
    const now = Date.now();
    const currentDelta = Math.abs(e.deltaY);
    const currentDirection = Math.sign(e.deltaY);
    const timeSinceLastEvent = now - lastEventTimeRef.current;

    // Delta pattern analysis for momentum detection
    // A scroll is momentum (not intentional) if ALL of these conditions are true:
    const isTimeTooQuick = timeSinceLastEvent < minTimeGap;
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

    if (debug) {
      console.log('🔍 Touchpad Inertia Detection:', {
        deltaY: e.deltaY,
        absDelta: currentDelta,
        minDelta,
        timeSinceLastEvent,
        isTimeTooQuick,
        isSameDirection,
        isDeltaNotIncreasing,
        isIntentionalScroll,
        isMomentumScroll: isMomentumScroll
          ? '🌊 INERTIA DETECTED'
          : '👆 INTENTIONAL',
        conditions: {
          timeTooQuick: isTimeTooQuick,
          sameDirection: isSameDirection,
          deltaNotIncreasing: isDeltaNotIncreasing,
        },
      });
    }

    // Log inertia detection separately for visibility
    if (isMomentumScroll) {
      console.log('🌊 INERTIA DETECTED - Event will be throttled longer');
    }

    return isMomentumScroll;
  };

  const isValidDelta = (deltaY: number): boolean => {
    const currentDelta = Math.abs(deltaY);
    return currentDelta >= minDelta;
  };

  return {
    detectInertia,
    isValidDelta,
  };
};

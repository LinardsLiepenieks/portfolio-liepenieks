import { useRef } from 'react';

interface UseWheelGestureDetectionProps {
  debug?: boolean;
}

/**
 * Detect unique wheel gestures even when momentum from previous gesture is ongoing
 * Key insight: New intentional scrolls have larger deltas than momentum tail
 */
export const useWheelGestureDetection = ({
  debug = false,
}: UseWheelGestureDetectionProps = {}) => {
  const gestureIdRef = useRef(0);
  const lastEventTimeRef = useRef(0);
  const lastDeltaRef = useRef(0);
  const eventsInGestureRef = useRef(0);

  // Tunable thresholds
  const GESTURE_TIMEOUT = 100; // Events within 100ms might be same gesture
  const NEW_GESTURE_DELTA_THRESHOLD = 3; // New gesture has 3x larger delta than momentum
  const MIN_DELTA_FOR_NEW_GESTURE = 5; // Minimum delta to consider as new gesture

  const check = (e: WheelEvent): number | false => {
    const eventTime = e.timeStamp;
    const currentDelta = Math.abs(e.deltaY);
    const timeSinceLastEvent = eventTime - lastEventTimeRef.current;
    const deltaRatio =
      lastDeltaRef.current > 0 ? currentDelta / lastDeltaRef.current : 999;

    if (debug) {
      console.log('🔍 Wheel Gesture Event:', {
        delta: e.deltaY,
        currentDelta,
        lastDelta: lastDeltaRef.current,
        deltaRatio: deltaRatio.toFixed(2),
        timeSinceLastEvent,
        currentGesture: gestureIdRef.current,
        eventsInGesture: eventsInGestureRef.current,
      });
    }

    // CRITICAL: Detect NEW gesture even during momentum
    // A new intentional scroll has significantly larger delta than ongoing momentum
    const isSignificantDeltaIncrease = deltaRatio > NEW_GESTURE_DELTA_THRESHOLD;
    const hasMinimumDelta = currentDelta >= MIN_DELTA_FOR_NEW_GESTURE;
    const isLongTimeGap = timeSinceLastEvent > GESTURE_TIMEOUT;

    // NEW GESTURE if:
    // 1. Long time gap (obvious new gesture), OR
    // 2. Delta suddenly increased significantly (user started new scroll during momentum), OR
    // 3. First event ever
    if (
      isLongTimeGap ||
      isSignificantDeltaIncrease ||
      eventsInGestureRef.current === 0
    ) {
      // This is a NEW GESTURE!
      gestureIdRef.current++;
      eventsInGestureRef.current = 1;
      lastEventTimeRef.current = eventTime;
      lastDeltaRef.current = currentDelta;

      const direction = e.deltaY > 0 ? 1 : -1;

      if (debug) {
        console.log('✅ NEW GESTURE ACCEPTED', {
          gestureId: gestureIdRef.current,
          direction,
          delta: e.deltaY,
          reason: isLongTimeGap
            ? 'time gap'
            : isSignificantDeltaIncrease
            ? 'delta spike'
            : 'first event',
          timeSinceLastEvent,
          deltaRatio: deltaRatio.toFixed(2),
        });
      }

      return direction;
    }

    // SAME GESTURE - continuing momentum or small variations
    eventsInGestureRef.current++;
    lastEventTimeRef.current = eventTime;
    lastDeltaRef.current = currentDelta;

    if (debug) {
      console.log(
        '⛔ SAME GESTURE (event #' + eventsInGestureRef.current + ')',
        {
          gestureId: gestureIdRef.current,
          timeSinceLastEvent,
          deltaRatio: deltaRatio.toFixed(2),
        }
      );
    }

    return false;
  };

  const reset = (): void => {
    gestureIdRef.current = 0;
    lastEventTimeRef.current = 0;
    lastDeltaRef.current = 0;
    eventsInGestureRef.current = 0;
    if (debug) {
      console.log('🔄 Wheel Gesture Detection reset');
    }
  };

  return {
    check,
    reset,
  };
};

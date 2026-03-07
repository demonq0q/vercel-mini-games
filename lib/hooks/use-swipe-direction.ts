'use client';

import { useMemo, useRef, type TouchEventHandler } from 'react';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

type SwipeHandlers = {
  onTouchStart: TouchEventHandler<HTMLElement>;
  onTouchEnd: TouchEventHandler<HTMLElement>;
};

export function useSwipeDirection(
  onSwipe: (direction: SwipeDirection) => void,
  enabled = true,
  threshold = 28,
) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  return useMemo<Partial<SwipeHandlers>>(() => {
    if (!enabled) {
      return {};
    }

    return {
      onTouchStart: (event) => {
        const touch = event.changedTouches[0];

        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
        };
      },
      onTouchEnd: (event) => {
        const touchStart = touchStartRef.current;

        if (!touchStart) {
          return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;

        if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
          return;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          onSwipe(deltaX > 0 ? 'right' : 'left');
          return;
        }

        onSwipe(deltaY > 0 ? 'down' : 'up');
      },
    };
  }, [enabled, onSwipe, threshold]);
}


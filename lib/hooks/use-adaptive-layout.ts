'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSiteSettings } from '@/components/settings/site-settings-provider';

export function useAdaptiveLayout() {
  const { settings } = useSiteSettings();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    const touchMedia = window.matchMedia('(pointer: coarse)');
    const compactMedia = window.matchMedia('(max-width: 860px)');

    const updateState = () => {
      setIsTouchDevice(touchMedia.matches || 'ontouchstart' in window);
      setIsCompactViewport(compactMedia.matches);
    };

    updateState();

    touchMedia.addEventListener('change', updateState);
    compactMedia.addEventListener('change', updateState);

    return () => {
      touchMedia.removeEventListener('change', updateState);
      compactMedia.removeEventListener('change', updateState);
    };
  }, []);

  return useMemo(
    () => ({
      isTouchDevice,
      isCompactViewport,
      preferMobileExperience: settings.preferMobileLayout || isTouchDevice || isCompactViewport,
    }),
    [isCompactViewport, isTouchDevice, settings.preferMobileLayout],
  );
}


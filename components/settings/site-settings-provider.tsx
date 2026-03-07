'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export type ThemeMode = 'midnight' | 'aurora';

export type SiteSettings = {
  themeMode: ThemeMode;
  preferMobileLayout: boolean;
  reducedMotion: boolean;
};

type SiteSettingsContextValue = {
  settings: SiteSettings;
  setThemeMode: (themeMode: ThemeMode) => void;
  togglePreferMobileLayout: () => void;
  toggleReducedMotion: () => void;
};

const STORAGE_KEY = 'vercel-mini-games:site-settings';

const defaultSettings: SiteSettings = {
  themeMode: 'midnight',
  preferMobileLayout: false,
  reducedMotion: false,
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const savedSettings = window.localStorage.getItem(STORAGE_KEY);

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as Partial<SiteSettings>;

        setSettings({
          themeMode: parsedSettings.themeMode === 'aurora' ? 'aurora' : 'midnight',
          preferMobileLayout: Boolean(parsedSettings.preferMobileLayout),
          reducedMotion: Boolean(parsedSettings.reducedMotion),
        });
      } catch {
        setSettings(defaultSettings);
      }
    }

    setStorageReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
    document.documentElement.dataset.motion = settings.reducedMotion ? 'reduced' : 'full';
    document.documentElement.dataset.mobileLayout = settings.preferMobileLayout ? 'preferred' : 'auto';

    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, storageReady]);

  const value = useMemo<SiteSettingsContextValue>(
    () => ({
      settings,
      setThemeMode: (themeMode) => {
        setSettings((currentSettings) => ({
          ...currentSettings,
          themeMode,
        }));
      },
      togglePreferMobileLayout: () => {
        setSettings((currentSettings) => ({
          ...currentSettings,
          preferMobileLayout: !currentSettings.preferMobileLayout,
        }));
      },
      toggleReducedMotion: () => {
        setSettings((currentSettings) => ({
          ...currentSettings,
          reducedMotion: !currentSettings.reducedMotion,
        }));
      },
    }),
    [settings],
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error('useSiteSettings 必须在 SiteSettingsProvider 中使用。');
  }

  return context;
}


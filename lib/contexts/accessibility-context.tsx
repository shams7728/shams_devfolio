'use client';

/**
 * Accessibility Context and Provider
 * 
 * Manages accessibility settings including contrast mode, text scaling,
 * readability mode, and reduced motion preferences.
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AccessibilitySettings {
  contrastMode: boolean;
  textScale: number; // 1.0 - 2.0
  readabilityMode: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setContrastMode: (enabled: boolean) => void;
  setTextScale: (scale: number) => void;
  setReadabilityMode: (enabled: boolean) => void;
  resetSettings: () => void;
  mounted: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AccessibilitySettings = {
  contrastMode: false,
  textScale: 1.0,
  readabilityMode: false,
  reducedMotion: false,
};

const STORAGE_KEY = 'accessibility-settings';

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Initialize settings from localStorage and system preferences
  useEffect(() => {
    try {
      // Load saved settings from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      let loadedSettings = DEFAULT_SETTINGS;

      if (stored) {
        const parsed = JSON.parse(stored);
        loadedSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          // Ensure textScale is within valid range
          textScale: Math.max(1.0, Math.min(2.0, parsed.textScale || 1.0)),
        };
      }

      // Check system preference for reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      loadedSettings.reducedMotion = prefersReducedMotion;

      setSettings(loadedSettings);
      applySettings(loadedSettings);
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
      // Fall back to system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fallbackSettings = { ...DEFAULT_SETTINGS, reducedMotion: prefersReducedMotion };
      setSettings(fallbackSettings);
      applySettings(fallbackSettings);
    }

    setMounted(true);

    // Listen for changes to prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings(prev => {
        const updated = { ...prev, reducedMotion: e.matches };
        applySettings(updated);
        return updated;
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply settings to DOM
  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Apply contrast mode - WCAG AAA compliance
    if (newSettings.contrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply text scaling
    root.style.setProperty('--text-scale', newSettings.textScale.toString());
    root.style.fontSize = `${newSettings.textScale * 100}%`;

    // Apply readability mode (simplified animations)
    if (newSettings.readabilityMode) {
      root.classList.add('readability-mode');
    } else {
      root.classList.remove('readability-mode');
    }

    // Apply reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Add keyboard navigation focus indicators
    root.classList.add('keyboard-nav-enabled');
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: AccessibilitySettings) => {
    try {
      // Don't save reducedMotion as it comes from system preference
      const { reducedMotion, ...settingsToSave } = newSettings;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }, []);

  const setContrastMode = useCallback((enabled: boolean) => {
    setSettings(prev => {
      const updated = { ...prev, contrastMode: enabled };
      applySettings(updated);
      saveSettings(updated);
      return updated;
    });
  }, [applySettings, saveSettings]);

  const setTextScale = useCallback((scale: number) => {
    // Clamp scale between 1.0 and 2.0
    const clampedScale = Math.max(1.0, Math.min(2.0, scale));
    setSettings(prev => {
      const updated = { ...prev, textScale: clampedScale };
      applySettings(updated);
      saveSettings(updated);
      return updated;
    });
  }, [applySettings, saveSettings]);

  const setReadabilityMode = useCallback((enabled: boolean) => {
    setSettings(prev => {
      const updated = { ...prev, readabilityMode: enabled };
      applySettings(updated);
      saveSettings(updated);
      return updated;
    });
  }, [applySettings, saveSettings]);

  const resetSettings = useCallback(() => {
    const resetSettings = {
      ...DEFAULT_SETTINGS,
      reducedMotion: settings.reducedMotion, // Keep system preference
    };
    setSettings(resetSettings);
    applySettings(resetSettings);
    saveSettings(resetSettings);
  }, [settings.reducedMotion, applySettings, saveSettings]);

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setContrastMode,
        setTextScale,
        setReadabilityMode,
        resetSettings,
        mounted,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

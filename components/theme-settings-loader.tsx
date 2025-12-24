'use client';

/**
 * Theme Settings Loader
 * 
 * Fetches and applies theme settings from the database to CSS custom properties
 * Requirements: 12.2, 12.3, 12.5
 */

import { useEffect } from 'react';

export function ThemeSettingsLoader() {
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const response = await fetch('/api/theme-settings');
        if (!response.ok) {
          console.error('Failed to fetch theme settings');
          return;
        }

        const settings = await response.json();
        applyThemeSettings(settings);
      } catch (error) {
        console.error('Error loading theme settings:', error);
      }
    };

    loadThemeSettings();
  }, []);

  return null;
}

/**
 * Apply theme settings to CSS custom properties
 */
function applyThemeSettings(settings: {
  accent_color: string;
  animation_speed: number;
  default_theme: 'light' | 'dark' | 'system';
}) {
  const root = document.documentElement;

  // Apply accent color
  root.style.setProperty('--accent-color', settings.accent_color);

  // Apply animation speed
  root.style.setProperty('--animation-speed', settings.animation_speed.toString());

  // Apply default theme if no theme is set
  const currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    let themeToApply = settings.default_theme;
    
    if (themeToApply === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeToApply = prefersDark ? 'dark' : 'light';
    }

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    // Add new theme class
    root.classList.add(themeToApply);
  }
}

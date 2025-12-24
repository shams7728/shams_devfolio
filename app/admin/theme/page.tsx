'use client';

/**
 * Admin Theme Settings Page
 * 
 * Page for managing global theme customization settings
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

import { useEffect, useState } from 'react';
import type { ThemeSettings } from '@/lib/models/theme-settings';
import { useToast } from '@/lib/contexts/toast-context';

export default function AdminThemePage() {
  const { success: showSuccess, error: showError } = useToast();
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    accent_color: '#3b82f6',
    animation_speed: 1.0,
    default_theme: 'system' as 'light' | 'dark' | 'system',
  });

  // Fetch theme settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/theme-settings');
      if (!response.ok) throw new Error('Failed to fetch theme settings');
      const data = await response.json();
      setSettings(data);
      setFormData({
        accent_color: data.accent_color,
        animation_speed: data.animation_speed,
        default_theme: data.default_theme,
      });
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      showError('Failed to load theme settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/theme-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update theme settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      showSuccess('Theme settings updated successfully');

      // Apply theme changes to CSS custom properties
      applyThemeChanges(updatedSettings);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update theme settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Apply theme changes to CSS custom properties
  const applyThemeChanges = (settings: ThemeSettings) => {
    const root = document.documentElement;
    
    // Apply accent color
    root.style.setProperty('--accent-color', settings.accent_color);
    
    // Apply animation speed
    root.style.setProperty('--animation-speed', settings.animation_speed.toString());
  };

  // Handle reset to defaults
  const handleReset = () => {
    setFormData({
      accent_color: '#3b82f6',
      animation_speed: 1.0,
      default_theme: 'system',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading theme settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-8 w-full max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
          Theme Settings
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Customize the visual identity of your portfolio
        </p>
      </div>

      {/* Info Banner */}
      <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-1">Site-wide customization</p>
            <p className="text-blue-700 dark:text-blue-300">
              Changes made here will apply across your entire portfolio. Accent colors affect highlights, buttons, and neon effects.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6 space-y-6">
        {/* Accent Color */}
        <div>
          <label htmlFor="accent_color" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Accent Color
          </label>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Choose the primary accent color for highlights, buttons, and neon effects
          </p>
          <div className="flex items-center gap-4">
            <input
              type="color"
              id="accent_color"
              value={formData.accent_color}
              onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
              className="h-12 w-24 rounded-lg border-2 border-zinc-300 dark:border-zinc-600 cursor-pointer"
            />
            <input
              type="text"
              value={formData.accent_color}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setFormData({ ...formData, accent_color: value });
                }
              }}
              placeholder="#3b82f6"
              className="flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
              pattern="^#[0-9A-Fa-f]{6}$"
              maxLength={7}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Must be a valid hex color code (e.g., #3b82f6)
          </p>
        </div>

        {/* Animation Speed */}
        <div>
          <label htmlFor="animation_speed" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Animation Speed: {formData.animation_speed.toFixed(1)}x
          </label>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Adjust the speed of all animations across the site
          </p>
          <div className="space-y-2">
            <input
              type="range"
              id="animation_speed"
              min="0.5"
              max="2.0"
              step="0.1"
              value={formData.animation_speed}
              onChange={(e) => setFormData({ ...formData, animation_speed: parseFloat(e.target.value) })}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>0.5x (Slower)</span>
              <span>1.0x (Normal)</span>
              <span>2.0x (Faster)</span>
            </div>
          </div>
        </div>

        {/* Default Theme */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Default Theme
          </label>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Choose the default theme for first-time visitors
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(['light', 'dark', 'system'] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setFormData({ ...formData, default_theme: theme })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.default_theme === theme
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {theme === 'light' && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {theme === 'dark' && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  {theme === 'system' && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className="text-sm font-medium capitalize">{theme}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSaving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all"
          >
            Reset to Defaults
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Preview
        </h2>
        <div className="space-y-4">
          <div 
            className="p-4 rounded-lg border-2 transition-all"
            style={{ borderColor: formData.accent_color }}
          >
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              This border uses your accent color
            </p>
          </div>
          <button
            type="button"
            className="px-6 py-3 text-white font-medium rounded-xl shadow-lg transition-all"
            style={{ 
              background: `linear-gradient(to right, ${formData.accent_color}, ${formData.accent_color}dd)`,
              boxShadow: `0 10px 25px ${formData.accent_color}30`
            }}
          >
            Button with Accent Color
          </button>
        </div>
      </div>
    </div>
  );
}

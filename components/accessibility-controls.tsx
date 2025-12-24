'use client';

/**
 * Accessibility Controls Component
 * 
 * Provides UI controls for adjusting accessibility settings
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import { useAccessibility } from '@/lib/contexts/accessibility-context';
import { useState } from 'react';

export function AccessibilityControls() {
  const {
    contrastMode,
    textScale,
    readabilityMode,
    reducedMotion,
    setContrastMode,
    setTextScale,
    setReadabilityMode,
    resetSettings,
    mounted,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Check if any accessibility features are active
  const hasActiveFeatures = contrastMode || textScale > 1.0 || readabilityMode || reducedMotion;

  return (
    <>
      {/* Backdrop overlay when panel is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[9998] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-4 right-4 z-[9999]">
        {/* Toggle Button with active indicator */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            hasActiveFeatures ? 'ring-2 ring-green-400 ring-offset-2' : ''
          }`}
          aria-label="Toggle accessibility controls"
          aria-expanded={isOpen}
        >
          {/* Active indicator badge */}
          {hasActiveFeatures && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>

        {/* Controls Panel */}
        {isOpen && (
          <div className="fixed bottom-20 right-4 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-6 w-80 max-w-[calc(100vw-2rem)] border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Accessibility
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                aria-label="Close accessibility controls"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Contrast Mode Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="contrast-mode"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    High Contrast
                  </label>
                  <button
                    id="contrast-mode"
                    role="switch"
                    aria-checked={contrastMode}
                    onClick={() => setContrastMode(!contrastMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      contrastMode ? 'bg-blue-600 shadow-lg shadow-blue-500/50' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        contrastMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {contrastMode && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    WCAG AAA compliant contrast enabled
                  </p>
                )}
              </div>

              {/* Text Scale Slider */}
              <div className="space-y-2">
                <label
                  htmlFor="text-scale"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    Text Size
                  </span>
                  <span className={`font-semibold ${textScale > 1.0 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {textScale.toFixed(1)}x
                  </span>
                </label>
                <input
                  id="text-scale"
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.1"
                  value={textScale}
                  onChange={(e) => setTextScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-valuemin={1.0}
                  aria-valuemax={2.0}
                  aria-valuenow={textScale}
                />
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>1.0x</span>
                  <span>1.5x</span>
                  <span>2.0x</span>
                </div>
                {textScale > 1.0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Text scaled to {Math.round(textScale * 100)}%
                  </p>
                )}
              </div>

              {/* Readability Mode Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="readability-mode"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Simplified Animations
                  </label>
                  <button
                    id="readability-mode"
                    role="switch"
                    aria-checked={readabilityMode}
                    onClick={() => setReadabilityMode(!readabilityMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      readabilityMode ? 'bg-blue-600 shadow-lg shadow-blue-500/50' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        readabilityMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {readabilityMode && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Animations simplified for better focus
                  </p>
                )}
              </div>

              {/* Reduced Motion Info */}
              {reducedMotion && (
                <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                  <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    Reduced motion is enabled by your system preferences
                  </span>
                </div>
              )}

              {/* Active Features Summary */}
              {hasActiveFeatures && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    Active Features:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {contrastMode && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        High Contrast
                      </span>
                    )}
                    {textScale > 1.0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Text {Math.round(textScale * 100)}%
                      </span>
                    )}
                    {readabilityMode && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Simplified
                      </span>
                    )}
                    {reducedMotion && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                        Reduced Motion
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={resetSettings}
                disabled={!hasActiveFeatures}
                className={`w-full mt-2 px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  hasActiveFeatures
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                }`}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

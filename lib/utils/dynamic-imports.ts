/**
 * Dynamic Import Utilities
 * 
 * Utilities for code splitting and lazy loading components
 * Requirements: 8.2
 */

'use client';

import dynamic, { DynamicOptions } from 'next/dynamic';
import { ComponentType, ReactElement } from 'react';

/**
 * Create a dynamically imported component with loading state
 */
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: Omit<DynamicOptions<P>, 'loading'> & {
    loading?: () => ReactElement | null;
  }
) {
  return dynamic(importFn, {
    ...options,
    ssr: options?.ssr ?? false, // Disable SSR for admin components to reduce initial bundle
  });
}

/**
 * Preload a dynamic component
 * Useful for prefetching components before they're needed
 */
export function preloadComponent(
  importFn: () => Promise<any>
): void {
  if (typeof window !== 'undefined') {
    // Preload on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        importFn();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        importFn();
      }, 1);
    }
  }
}

/**
 * Animation Performance Initialization
 * 
 * Initializes animation performance monitoring and optimizations
 * Should be called once at app startup
 * 
 * Requirements: 10.5
 */

import { initAnimationPerformance } from './animation-performance';

let initialized = false;

/**
 * Initialize animation performance system
 * Safe to call multiple times - will only initialize once
 */
export function initializeAnimationPerformance(): void {
  if (initialized) return;
  
  if (typeof window === 'undefined') return;

  initAnimationPerformance();
  initialized = true;

  // Log initialization in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Animation Performance] Initialized');
  }
}

/**
 * Check if animation performance system is initialized
 */
export function isAnimationPerformanceInitialized(): boolean {
  return initialized;
}

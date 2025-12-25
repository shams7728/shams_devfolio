/**
 * Animation Performance Optimization Utilities
 * 
 * Provides utilities for:
 * - Animation pooling (reusing GSAP timelines)
 * - Performance monitoring
 * - Debouncing scroll/resize events
 * - GPU acceleration hints
 * 
 * Requirements: 10.5
 */

import { gsap } from 'gsap';

// ============================================================================
// Animation Pool Management
// ============================================================================

interface AnimationPool {
  [key: string]: gsap.core.Timeline | undefined;
}

class AnimationPoolManager {
  private pool: AnimationPool = {};
  private activeAnimations = new Set<string>();

  /**
   * Get or create a timeline from the pool
   */
  getTimeline(key: string, createFn?: () => gsap.core.Timeline): gsap.core.Timeline {
    if (!(key in this.pool)) {
      this.pool[key] = createFn ? createFn() : gsap.timeline({ paused: true });
    }
    return this.pool[key] as gsap.core.Timeline;
  }

  /**
   * Mark animation as active
   */
  markActive(key: string): void {
    this.activeAnimations.add(key);
  }

  /**
   * Mark animation as inactive and reset
   */
  markInactive(key: string): void {
    this.activeAnimations.delete(key);
    if (this.pool[key]) {
      this.pool[key].pause().progress(0);
    }
  }

  /**
   * Clear unused animations from pool
   */
  cleanup(): void {
    Object.keys(this.pool).forEach(key => {
      if (!this.activeAnimations.has(key)) {
        this.pool[key]?.kill();
        delete this.pool[key];
      }
    });
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      total: Object.keys(this.pool).length,
      active: this.activeAnimations.size,
      inactive: Object.keys(this.pool).length - this.activeAnimations.size,
    };
  }
}

export const animationPool = new AnimationPoolManager();

// ============================================================================
// Debounce Utilities
// ============================================================================

export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

/**
 * Debounce function for scroll/resize events
 * Uses requestAnimationFrame for optimal performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 150
): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let rafId: number | null = null;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const context = this;

    // Cancel previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Cancel previous RAF
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        func.apply(context, args);
      });
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return debounced as DebouncedFunction<T>;
}

/**
 * Throttle function for high-frequency events
 * Ensures function runs at most once per frame
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 16 // ~60fps
): DebouncedFunction<T> {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let rafId: number | null = null;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const context = this;
    lastArgs = args;

    if (!inThrottle) {
      inThrottle = true;

      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          func.apply(context, lastArgs);
          lastArgs = null;
        }

        setTimeout(() => {
          inThrottle = false;
        }, limit);
      });
    }
  };

  throttled.cancel = () => {
    inThrottle = false;
    lastArgs = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return throttled as DebouncedFunction<T>;
}

// ============================================================================
// Performance Monitoring
// ============================================================================

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  animationCount: number;
}

class PerformanceMonitor {
  private fps = 60;
  private frameTime = 16.67;
  private droppedFrames = 0;
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private fpsUpdateInterval = 1000; // Update FPS every second
  private lastFpsUpdate = performance.now();
  private rafId: number | null = null;
  private isMonitoring = false;
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];

  /**
   * Start monitoring performance
   */
  start(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.lastFpsUpdate = performance.now();
    this.frameCount = 0;
    this.droppedFrames = 0;

    this.monitor();
  }

  /**
   * Stop monitoring performance
   */
  stop(): void {
    this.isMonitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Subscribe to performance updates
   */
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      droppedFrames: this.droppedFrames,
      animationCount: animationPool.getStats().active,
    };
  }

  private monitor = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const delta = currentTime - this.lastFrameTime;

    this.frameTime = delta;
    this.frameCount++;

    // Detect dropped frames (more than 2 frames worth of time)
    if (delta > 33.33) {
      this.droppedFrames++;
    }

    // Update FPS calculation every second
    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;

      // Notify subscribers
      const metrics = this.getMetrics();
      this.callbacks.forEach(callback => callback(metrics));
    }

    this.lastFrameTime = currentTime;
    this.rafId = requestAnimationFrame(this.monitor);
  };
}

export const performanceMonitor = new PerformanceMonitor();

// ============================================================================
// GPU Acceleration Utilities
// ============================================================================

/**
 * Apply will-change hint to element
 * Automatically removes after animation completes
 */
export function applyWillChange(
  element: HTMLElement,
  properties: string[] = ['transform', 'opacity'],
  duration: number = 1000
): void {
  element.style.willChange = properties.join(', ');

  // Remove will-change after animation completes
  setTimeout(() => {
    element.style.willChange = 'auto';
  }, duration);
}

/**
 * Batch apply will-change to multiple elements
 */
export function batchApplyWillChange(
  elements: HTMLElement[],
  properties: string[] = ['transform', 'opacity'],
  duration: number = 1000
): void {
  elements.forEach(el => applyWillChange(el, properties, duration));
}

/**
 * Check if element should use GPU acceleration
 * Based on device capabilities and performance
 */
export function shouldUseGPUAcceleration(): boolean {
  // Check if on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check if device has good performance
  const hasGoodPerformance = performanceMonitor.getMetrics().fps >= 50;

  return !isMobile && !prefersReducedMotion && hasGoodPerformance;
}

// ============================================================================
// Animation Optimization Helpers
// ============================================================================

/**
 * Create optimized GSAP animation that only uses transform/opacity
 */
export function createOptimizedAnimation(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars
): gsap.core.Tween {
  // Ensure only transform and opacity are animated
  const optimizedVars: gsap.TweenVars = {
    ...vars,
    // Force GPU acceleration
    force3D: true,
  };

  // Warn if non-optimized properties are used
  const nonOptimizedProps = Object.keys(vars).filter(
    key => !['x', 'y', 'z', 'scale', 'scaleX', 'scaleY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'opacity', 'duration', 'ease', 'delay', 'onComplete', 'onUpdate', 'onStart'].includes(key)
  );

  if (nonOptimizedProps.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(
      `Non-optimized properties detected in animation: ${nonOptimizedProps.join(', ')}. ` +
      `Consider using only transform and opacity for better performance.`
    );
  }

  return gsap.to(target, optimizedVars);
}

/**
 * Batch animations with stagger for better performance
 */
export function batchAnimateWithStagger(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars,
  stagger: number = 0.1
): gsap.core.Tween {
  return createOptimizedAnimation(targets, {
    ...vars,
    stagger,
  });
}

// ============================================================================
// Scroll/Resize Event Helpers
// ============================================================================

/**
 * Create debounced scroll handler
 */
export function createDebouncedScrollHandler(
  handler: (event: Event) => void,
  delay: number = 150
): { attach: () => void; detach: () => void } {
  const debouncedHandler = debounce(handler, delay);

  return {
    attach: () => {
      window.addEventListener('scroll', debouncedHandler, { passive: true });
    },
    detach: () => {
      window.removeEventListener('scroll', debouncedHandler as any);
      debouncedHandler.cancel();
    },
  };
}

/**
 * Create debounced resize handler
 */
export function createDebouncedResizeHandler(
  handler: (event: Event) => void,
  delay: number = 150
): { attach: () => void; detach: () => void } {
  const debouncedHandler = debounce(handler, delay);

  return {
    attach: () => {
      window.addEventListener('resize', debouncedHandler, { passive: true });
    },
    detach: () => {
      window.removeEventListener('resize', debouncedHandler as any);
      debouncedHandler.cancel();
    },
  };
}

// ============================================================================
// Cleanup Utilities
// ============================================================================

/**
 * Cleanup all animations and event handlers
 */
export function cleanupAnimations(): void {
  animationPool.cleanup();
  performanceMonitor.stop();
}

/**
 * Initialize animation performance optimizations
 */
export function initAnimationPerformance(): void {
  // Start performance monitoring in development
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.start();
    performanceMonitor.subscribe((metrics) => {
      if (metrics.fps < 50) {
        console.warn(
          `Low FPS detected: ${metrics.fps}fps. ` +
          `Consider reducing animation complexity or disabling some effects.`
        );
      }
    });
  }

  // Cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupAnimations);
  }
}

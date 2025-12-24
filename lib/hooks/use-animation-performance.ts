/**
 * React Hook for Animation Performance Optimization
 * 
 * Provides easy access to animation performance utilities
 * and automatically manages cleanup
 * 
 * Requirements: 10.5
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  debounce,
  throttle,
  performanceMonitor,
  animationPool,
  createDebouncedScrollHandler,
  createDebouncedResizeHandler,
  type DebouncedFunction,
} from '@/lib/utils/animation-performance';

/**
 * Hook to use debounced scroll handler
 */
export function useDebouncedScroll(
  handler: (event: Event) => void,
  delay: number = 150
) {
  const handlerRef = useRef(handler);
  const scrollHandlerRef = useRef<{ attach: () => void; detach: () => void } | null>(null);

  // Update handler ref when it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    scrollHandlerRef.current = createDebouncedScrollHandler(
      (event) => handlerRef.current(event),
      delay
    );

    scrollHandlerRef.current.attach();

    return () => {
      scrollHandlerRef.current?.detach();
    };
  }, [delay]);
}

/**
 * Hook to use debounced resize handler
 */
export function useDebouncedResize(
  handler: (event: Event) => void,
  delay: number = 150
) {
  const handlerRef = useRef(handler);
  const resizeHandlerRef = useRef<{ attach: () => void; detach: () => void } | null>(null);

  // Update handler ref when it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    resizeHandlerRef.current = createDebouncedResizeHandler(
      (event) => handlerRef.current(event),
      delay
    );

    resizeHandlerRef.current.attach();

    return () => {
      resizeHandlerRef.current?.detach();
    };
  }, [delay]);
}

/**
 * Hook to monitor animation performance
 */
export function useAnimationPerformance(enabled: boolean = true) {
  const [metrics, setMetrics] = React.useState({
    fps: 60,
    frameTime: 16.67,
    droppedFrames: 0,
    animationCount: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    performanceMonitor.start();
    const unsubscribe = performanceMonitor.subscribe(setMetrics);

    return () => {
      unsubscribe();
      performanceMonitor.stop();
    };
  }, [enabled]);

  return metrics;
}

/**
 * Hook to create a debounced callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 150
): DebouncedFunction<T> {
  const callbackRef = useRef(callback);
  const debouncedRef = useRef<DebouncedFunction<T> | null>(null);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create debounced function
  if (!debouncedRef.current) {
    debouncedRef.current = debounce(
      ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
      delay
    );
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedRef.current?.cancel();
    };
  }, []);

  return debouncedRef.current;
}

/**
 * Hook to create a throttled callback
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 16
): DebouncedFunction<T> {
  const callbackRef = useRef(callback);
  const throttledRef = useRef<DebouncedFunction<T> | null>(null);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create throttled function
  if (!throttledRef.current) {
    throttledRef.current = throttle(
      ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
      limit
    );
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      throttledRef.current?.cancel();
    };
  }, []);

  return throttledRef.current;
}

/**
 * Hook to manage animation pool for a component
 */
export function useAnimationPool(key: string) {
  const timelineRef = useRef(animationPool.getTimeline(key));

  useEffect(() => {
    animationPool.markActive(key);

    return () => {
      animationPool.markInactive(key);
    };
  }, [key]);

  return timelineRef.current;
}

/**
 * Hook to apply will-change hints automatically
 */
export function useWillChange(
  ref: React.RefObject<HTMLElement>,
  properties: string[] = ['transform', 'opacity'],
  trigger: boolean = false
) {
  useEffect(() => {
    if (!ref.current || !trigger) return;

    const element = ref.current;
    element.style.willChange = properties.join(', ');

    return () => {
      element.style.willChange = 'auto';
    };
  }, [ref, properties, trigger]);
}

// Fix React import
import * as React from 'react';

/**
 * Performance Monitoring Utilities
 * 
 * Track and report Core Web Vitals and performance metrics
 * Requirements: 8.2
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: PerformanceMetric): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // In production, send to analytics service
  // Example: Google Analytics, Vercel Analytics, etc.
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

/**
 * Get performance rating based on thresholds
 */
export function getPerformanceRating(
  metricName: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  };

  const threshold = thresholds[metricName];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string): () => void {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Render Time] ${componentName}: ${duration.toFixed(2)}ms`);
    }

    // Report if render time is concerning (> 16ms for 60fps)
    if (duration > 16) {
      reportWebVitals({
        name: 'Component Render',
        value: duration,
        rating: duration > 50 ? 'poor' : 'needs-improvement',
      });
    }
  };
}

/**
 * Measure API request time
 */
export async function measureApiRequest<T>(
  url: string,
  requestFn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await requestFn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${url}: ${duration.toFixed(2)}ms`);
    }

    // Report slow API requests
    if (duration > 1000) {
      reportWebVitals({
        name: 'API Request',
        value: duration,
        rating: duration > 3000 ? 'poor' : 'needs-improvement',
      });
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Request Failed] ${url}: ${duration.toFixed(2)}ms`, error);
    }

    throw error;
  }
}

/**
 * Check if browser supports Performance Observer
 */
export function supportsPerformanceObserver(): boolean {
  return typeof window !== 'undefined' && 'PerformanceObserver' in window;
}

/**
 * Monitor long tasks (tasks that block the main thread for > 50ms)
 */
export function monitorLongTasks(): void {
  if (!supportsPerformanceObserver()) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[Long Task] Duration: ${entry.duration.toFixed(2)}ms`);
          }

          reportWebVitals({
            name: 'Long Task',
            value: entry.duration,
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
          });
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    // Long task API not supported
    console.warn('Long task monitoring not supported');
  }
}

/**
 * Get memory usage (if available)
 */
export function getMemoryUsage(): number | null {
  if (
    typeof window !== 'undefined' &&
    'performance' in window &&
    'memory' in (window.performance as any)
  ) {
    const memory = (window.performance as any).memory;
    return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
  }
  return null;
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Monitor long tasks
  monitorLongTasks();

  // Log memory usage periodically in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const memoryUsage = getMemoryUsage();
      if (memoryUsage !== null) {
        console.log(`[Memory Usage] ${(memoryUsage * 100).toFixed(2)}%`);
      }
    }, 30000); // Every 30 seconds
  }
}

// Type augmentation for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params: Record<string, any>
    ) => void;
  }
}

/**
 * Web Vitals Reporter
 * 
 * Client component to report Core Web Vitals
 * Requirements: 8.2
 */

'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, getPerformanceRating, initPerformanceMonitoring } from '@/lib/utils/performance-monitoring';

export function WebVitals() {
  // Report Next.js Web Vitals
  useReportWebVitals((metric) => {
    reportWebVitals({
      name: metric.name,
      value: metric.value,
      rating: getPerformanceRating(metric.name, metric.value),
      delta: metric.delta,
      id: metric.id,
    });
  });

  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return null;
}

'use client';

/**
 * Animation Performance Initialization Component
 * 
 * Initializes animation performance monitoring and optimizations
 * Should be included once in the root layout
 * 
 * Requirements: 10.5
 */

import { useEffect } from 'react';
import { initializeAnimationPerformance } from '@/lib/utils/init-animation-performance';

export function AnimationPerformanceInit() {
  useEffect(() => {
    initializeAnimationPerformance();
  }, []);

  return null;
}

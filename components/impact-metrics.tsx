'use client';

/**
 * Impact Metrics Display Component
 * 
 * Displays impact metrics with animated counters
 * Uses GSAP for counter animation and Intersection Observer for scroll trigger
 * Optimized for performance with animation pooling and GPU acceleration
 * 
 * Requirements: 3.1, 3.2, 3.4, 10.5
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { ImpactMetric } from '@/lib/types/database';
import { animationPool, applyWillChange } from '@/lib/utils/animation-performance';

interface ImpactMetricsProps {
  metrics: ImpactMetric[];
  animationDuration?: number;
}

interface CounterState {
  [key: string]: number;
}

export function ImpactMetrics({ 
  metrics, 
  animationDuration = 2 
}: ImpactMetricsProps) {
  const [counters, setCounters] = useState<CounterState>({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Initialize counters to 0
    const initialCounters: CounterState = {};
    metrics.forEach(metric => {
      initialCounters[metric.id] = 0;
    });
    setCounters(initialCounters);
  }, [metrics]);

  useEffect(() => {
    if (!containerRef.current || hasAnimated) return;

    // Create Intersection Observer to trigger animation when visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            animateCounters();
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Cleanup animation pool
      animationPool.markInactive('impact-metrics');
    };
  }, [hasAnimated, metrics]);

  const animateCounters = () => {
    // Apply will-change hints to cards for GPU acceleration
    cardsRef.current.forEach(card => {
      if (card) {
        applyWillChange(card, ['opacity', 'transform'], animationDuration * 1000);
      }
    });

    // Use animation pool for better performance
    const timeline = animationPool.getTimeline('impact-metrics', () => 
      gsap.timeline({ paused: true })
    );
    
    animationPool.markActive('impact-metrics');

    // Animate each counter
    metrics.forEach((metric, index) => {
      const counterObj = { value: 0 };
      
      timeline.to(counterObj, {
        value: metric.value,
        duration: animationDuration,
        ease: 'power2.out',
        onUpdate: () => {
          setCounters(prev => ({
            ...prev,
            [metric.id]: Math.round(counterObj.value)
          }));
        }
      }, index * 0.1); // Stagger animations slightly
    });

    timeline.play();
  };

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
    >
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          ref={el => {
            if (el) cardsRef.current[index] = el;
          }}
          className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors gpu-accelerated"
        >
          {metric.icon && (
            <div className="text-4xl mb-3">
              {metric.icon}
            </div>
          )}
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">
            {counters[metric.id] !== undefined ? counters[metric.id].toLocaleString() : '0'}
          </div>
          <div className="text-sm md:text-base text-gray-300 text-center">
            {metric.title}
          </div>
        </div>
      ))}
    </div>
  );
}

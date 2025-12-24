'use client';

/**
 * Timeline Component
 * 
 * Displays a vertical timeline with milestone markers and sequential scroll-triggered animations
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TimelineMilestone } from '@/lib/types/database';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineProps {
  milestones: TimelineMilestone[];
  className?: string;
}

export default function Timeline({
  milestones,
  className = '',
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || milestones.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate each milestone sequentially when scrolling into view
      milestonesRef.current.forEach((milestone, index) => {
        if (!milestone) return;

        // Apply will-change hints for GPU acceleration
        milestone.style.willChange = 'transform, opacity';

        // Initial state - using only transform and opacity
        gsap.set(milestone, {
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50, // Alternate from left and right
        });

        // Animate on scroll - optimized for performance
        gsap.to(milestone, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          force3D: true, // Force GPU acceleration
          scrollTrigger: {
            trigger: milestone,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1, // Stagger delay for sequential animation
          onComplete: () => {
            // Remove will-change after animation completes
            milestone.style.willChange = 'auto';
          }
        });

        // Animate the year marker
        const yearMarker = milestone.querySelector('.timeline-year');
        if (yearMarker instanceof HTMLElement) {
          yearMarker.style.willChange = 'transform';
          
          gsap.set(yearMarker, {
            scale: 0,
          });

          gsap.to(yearMarker, {
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            force3D: true,
            scrollTrigger: {
              trigger: milestone,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1 + 0.2,
            onComplete: () => {
              yearMarker.style.willChange = 'auto';
            }
          });
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [mounted, milestones]);

  if (milestones.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No timeline milestones configured yet.
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`timeline ${className}`}>
      <div className="max-w-5xl mx-auto relative">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 -translate-x-1/2 hidden md:block"></div>

        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            ref={(el) => {
              milestonesRef.current[index] = el;
            }}
            className={`relative mb-12 md:mb-16 ${
              index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'
            }`}
          >
            {/* Mobile layout (stacked) */}
            <div className="md:hidden">
              <div className="flex items-start gap-4">
                {/* Year marker */}
                <div className="timeline-year flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {milestone.year}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop layout (alternating sides) */}
            <div className="hidden md:block">
              <div
                className={`flex items-center ${
                  index % 2 === 0 ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Content on left side */}
                {index % 2 === 0 && (
                  <div className="w-5/12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 mr-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                )}

                {/* Year marker in center */}
                <div className="timeline-year absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg z-10 border-4 border-white dark:border-gray-900">
                  <span className="text-white font-bold text-lg">
                    {milestone.year}
                  </span>
                </div>

                {/* Content on right side */}
                {index % 2 === 1 && (
                  <div className="w-5/12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ml-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

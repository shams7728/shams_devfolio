'use client';

/**
 * Workflow Visualization Component
 * 
 * Displays a visual workflow diagram with sequential GSAP animations on scroll
 * Requirements: 5.1, 5.2, 5.3, 5.5
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WorkflowStage } from '@/lib/types/database';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface WorkflowVisualizationProps {
  stages: WorkflowStage[];
  className?: string;
}

export default function WorkflowVisualization({
  stages,
  className = '',
}: WorkflowVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || stages.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate each stage sequentially when scrolling into view
      stagesRef.current.forEach((stage, index) => {
        if (!stage) return;

        // Apply will-change hints for GPU acceleration
        stage.style.willChange = 'transform, opacity';

        // Initial state - using only transform and opacity
        gsap.set(stage, {
          opacity: 0,
          y: 50,
        });

        // Animate on scroll - optimized for performance
        gsap.to(stage, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          force3D: true, // Force GPU acceleration
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.15, // Stagger delay for sequential animation
          onComplete: () => {
            // Remove will-change after animation completes
            stage.style.willChange = 'auto';
          }
        });

        // Animate the connector line
        const connector = stage.querySelector('.workflow-connector');
        if (connector instanceof HTMLElement && index < stages.length - 1) {
          connector.style.willChange = 'transform';
          
          gsap.set(connector, {
            scaleY: 0,
            transformOrigin: 'top',
          });

          gsap.to(connector, {
            scaleY: 1,
            duration: 0.6,
            force3D: true,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: stage,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.15 + 0.3,
            onComplete: () => {
              connector.style.willChange = 'auto';
            }
          });
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [mounted, stages]);

  if (stages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No workflow stages configured yet.
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`workflow-visualization ${className}`}>
      <div className="max-w-4xl mx-auto">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            ref={(el) => {
              stagesRef.current[index] = el;
            }}
            className="relative"
          >
            {/* Stage Card */}
            <div className="flex items-start gap-6 mb-8">
              {/* Icon Circle */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                  {stage.icon || '📋'}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Step {index + 1}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {stage.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < stages.length - 1 && (
              <div className="workflow-connector absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-600 -translate-x-1/2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

/**
 * About Page Client Component
 * 
 * Enhanced about page with:
 * - Animated growth timeline
 * - "What Drives Me" section
 * - Cinematic fade-in animations
 * - Role-based visual adaptations
 * - Workflow visualization
 * 
 * Requirements: 5.1, 5.2, 9.1, 9.2
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Timeline from '@/components/timeline';
import WorkflowVisualization from '@/components/workflow-visualization';
import { NavigationBar } from '@/components/navigation-bar';
import { useRoleMode } from '@/lib/contexts/role-mode-context';
import type { TimelineMilestone, WorkflowStage } from '@/lib/types/database';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutPageClientProps {
  milestones: TimelineMilestone[];
  workflowStages: WorkflowStage[];
}

export default function AboutPageClient({
  milestones,
  workflowStages,
}: AboutPageClientProps) {
  const { selectedRole } = useRoleMode();
  const [mounted, setMounted] = useState(false);
  
  // Refs for animation
  const heroRef = useRef<HTMLDivElement>(null);
  const drivesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cinematic fade-in animations
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // Hero section animation
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll('.animate-fade-in');
        gsap.set(heroElements, { opacity: 0, y: 30 });
        gsap.to(heroElements, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }

      // "What Drives Me" section animation
      if (drivesRef.current) {
        gsap.set(drivesRef.current, { opacity: 0, y: 50 });
        gsap.to(drivesRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: drivesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        // Animate drive cards
        const driveCards = drivesRef.current.querySelectorAll('.drive-card');
        gsap.set(driveCards, { opacity: 0, scale: 0.9 });
        gsap.to(driveCards, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: drivesRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Timeline section animation
      if (timelineRef.current) {
        gsap.set(timelineRef.current.querySelector('.section-title'), {
          opacity: 0,
          y: 30,
        });
        gsap.to(timelineRef.current.querySelector('.section-title'), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Workflow section animation
      if (workflowRef.current) {
        gsap.set(workflowRef.current.querySelector('.section-title'), {
          opacity: 0,
          y: 30,
        });
        gsap.to(workflowRef.current.querySelector('.section-title'), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: workflowRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  // Role-based visual adaptations
  const getRoleThemeClasses = () => {
    if (!selectedRole) return '';
    
    const roleSlug = selectedRole.slug || '';
    
    // Map role slugs to theme classes
    const themeMap: Record<string, string> = {
      'data-analyst': 'role-theme-data',
      'web-developer': 'role-theme-web',
      'flutter-developer': 'role-theme-flutter',
      'sql-developer': 'role-theme-sql',
    };
    
    return themeMap[roleSlug] || '';
  };

  const getRoleAccentColor = () => {
    if (!selectedRole) return 'from-blue-500 to-purple-600';
    
    const roleSlug = selectedRole.slug || '';
    
    // Map role slugs to gradient colors
    const colorMap: Record<string, string> = {
      'data-analyst': 'from-cyan-500 to-blue-600',
      'web-developer': 'from-green-500 to-teal-600',
      'flutter-developer': 'from-blue-400 to-indigo-600',
      'sql-developer': 'from-orange-500 to-red-600',
    };
    
    return colorMap[roleSlug] || 'from-blue-500 to-purple-600';
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${getRoleThemeClasses()}`}>
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-20 px-4 overflow-hidden"
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getRoleAccentColor()} opacity-10`}></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About Me
          </h1>
          <p className="animate-fade-in text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Passionate about creating impactful solutions through technology
          </p>
        </div>
      </section>

      {/* What Drives Me Section */}
      <section
        ref={drivesRef}
        className="py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            What Drives Me
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Drive Card 1: Innovation */}
            <div className="drive-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleAccentColor()} flex items-center justify-center text-3xl mb-6 mx-auto`}>
                💡
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                Constantly exploring new technologies and approaches to solve complex problems in creative ways.
              </p>
            </div>

            {/* Drive Card 2: Impact */}
            <div className="drive-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleAccentColor()} flex items-center justify-center text-3xl mb-6 mx-auto`}>
                🎯
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                Building solutions that make a real difference in people's lives and businesses.
              </p>
            </div>

            {/* Drive Card 3: Excellence */}
            <div className="drive-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleAccentColor()} flex items-center justify-center text-3xl mb-6 mx-auto`}>
                ⭐
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Excellence
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                Committed to delivering high-quality work with attention to detail and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* My Process / Workflow Section */}
      <section
        ref={workflowRef}
        className="py-16 px-4 bg-white dark:bg-gray-800"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            My Process
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
            A systematic approach to delivering exceptional results
          </p>
          
          <WorkflowVisualization stages={workflowStages} />
        </div>
      </section>

      {/* Growth Timeline Section */}
      <section
        ref={timelineRef}
        className="py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            My Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
            Key milestones in my professional growth
          </p>
          
          <Timeline milestones={milestones} />
        </div>
      </section>

      {/* Role-specific styling */}
      <style jsx>{`
        .role-theme-data {
          --role-accent: #06b6d4;
        }
        .role-theme-web {
          --role-accent: #10b981;
        }
        .role-theme-flutter {
          --role-accent: #3b82f6;
        }
        .role-theme-sql {
          --role-accent: #f97316;
        }
      `}</style>
    </div>
  );
}

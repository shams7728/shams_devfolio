'use client';

/**
 * Role Projects Grid Client Component
 * 
 * Client-side grid for role projects with enhanced cards
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { useRef, useEffect, useState } from 'react';
import type { Project, Role } from '@/lib/types/database';
import { EnhancedProjectCard } from '@/components/enhanced-project-card';

interface ProjectWithRole extends Project {
  role: Role;
}

interface RoleProjectsGridProps {
  projects: ProjectWithRole[];
}


export function RoleProjectsGrid({ projects }: RoleProjectsGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle manual scroll to update active index
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth; // Width of one snap item approximately
    const newIndex = Math.round(container.scrollLeft / cardWidth);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < projects.length) {
      setActiveIndex(newIndex);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    // Only run on mobile
    if (window.innerWidth >= 640) return;

    const startAutoScroll = () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);

      autoScrollTimerRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Calculate next index based on current scroll position to handle manual interruptions gracefully
        const cardWidth = container.offsetWidth;
        const currentIndex = Math.round(container.scrollLeft / cardWidth);
        const nextIndex = (currentIndex + 1) % projects.length;

        container.scrollTo({
          left: nextIndex * cardWidth,
          behavior: 'smooth'
        });
      }, 3000); // 3 seconds interval
    };

    startAutoScroll();

    // Pause on interaction could be added here, but requirement says "automatic show", 
    // so we keep it running or restart it. For now, simple interval.

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [projects.length]); // Dependency reduced to just projects length

  return (
    <>
      {/* Mobile: Horizontal Carousel with Auto-Scroll */}
      <div
        ref={scrollContainerRef}
        className="sm:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-8 touch-pan-y"
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {projects.map((project, index) => (
          <div key={project.id} className="min-w-[85vw] snap-center mr-4 last:mr-0">
            <EnhancedProjectCard
              project={project}
              showRoleBadge={false}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Tablet/Desktop: Grid Layout (Hidden on Mobile) */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
        {projects.map((project, index) => (
          <EnhancedProjectCard
            key={project.id}
            project={project}
            showRoleBadge={false}
            index={index}
          />
        ))}
      </div>

      {/* Mobile Progress Indicators */}
      <div className="sm:hidden flex justify-center gap-2 mt-4">
        {projects.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-fuchsia-500 shadow-[0_0_10px_rgba(232,121,249,0.5)]' : 'w-2 bg-white/10'}`}
          />
        ))}
      </div>
    </>
  );
}

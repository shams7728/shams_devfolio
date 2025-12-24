'use client';

/**
 * Enhanced Project Card Component
 * 
 * Project card with 3D tilt effects, depth shadows, and neon glow animations
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { TiltCard } from './tilt-card';
import type { Project, Role } from '@/lib/types/database';
import { useAccessibility } from '@/lib/contexts/accessibility-context';

interface ProjectWithRole extends Project {
  role: Role;
}

interface EnhancedProjectCardProps {
  project: ProjectWithRole;
  showRoleBadge?: boolean;
  index?: number;
}

export function EnhancedProjectCard({
  project,
  showRoleBadge = false,
  index = 0,
}: EnhancedProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAccessibility();

  // Staggered entrance animation
  useEffect(() => {
    if (!cardRef.current) return;

    // If reduced motion, just show the card immediately
    if (reducedMotion) {
      gsap.set(cardRef.current, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    // Set initial state and animate
    gsap.set(cardRef.current, { opacity: 0, y: 50, scale: 0.9 });
    gsap.to(cardRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      delay: index * 0.1, // Stagger based on index
      ease: 'power3.out',
    });
  }, [index, reducedMotion]);

  // Neon glow animation for tech tags on hover
  useEffect(() => {
    if (!tagsRef.current || reducedMotion) return;

    const tags = tagsRef.current.querySelectorAll('.tech-tag');

    const handleMouseEnter = () => {
      gsap.to(tags, {
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(tags, {
        boxShadow: '0 0 0px rgba(59, 130, 246, 0)',
        duration: 0.3,
        ease: 'power2.in',
      });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [reducedMotion]);

  return (
    <div ref={cardRef}>
      <TiltCard
        className="group relative block overflow-hidden rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md transition-all duration-500 hover:border-cyan-500/30"
        tiltMaxAngle={5}
        glareEnable={true}
        scale={1.02}
      >
        <Link
          href={`/roles/${project.role.slug}/projects/${project.id}`}
          className="block"
        >
          {/* Cover image with enhanced hover effect */}
          <div className="relative w-full h-48 sm:h-56 overflow-hidden">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              quality={85}
              unoptimized
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

            {/* Role Badge positioned on image */}
            {showRoleBadge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-black/50 backdrop-blur-md text-white border border-white/10 rounded-full">
                  {project.role.title}
                </span>
              </div>
            )}
          </div>

          {/* Project info */}
          <div className="relative p-6 pt-2">

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
              {project.title}
            </h3>

            <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
              {project.short_description}
            </p>

            {/* Tech stack */}
            <div ref={tagsRef} className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="tech-tag px-2.5 py-1 text-[11px] font-medium bg-white/5 text-zinc-300 border border-white/5 rounded-lg group-hover:bg-white/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 3 && (
                <span className="px-2.5 py-1 text-[11px] font-medium text-zinc-500 border border-transparent">
                  +{project.tech_stack.length - 3}
                </span>
              )}
            </div>
          </div>
        </Link>
      </TiltCard>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RoleCard } from '@/components/role-card';
import type { Role } from '@/lib/types/database';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RolesGridProps {
  roles: Role[];
}

export function RolesGrid({ roles }: RolesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // -- Mobile Auto-Rotation State --
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (roles.length === 0) return;
    // Auto-rotate every 3 seconds for mobile
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);
  // -------------------------------

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      }

      // Animate DESKTOP grid cards
      // We only target the desktop grid container for scroll triggers
      const desktopCards = gridRef.current?.querySelectorAll('.desktop-card');
      if (desktopCards && desktopCards.length > 0) {
        gsap.fromTo(
          desktopCards,
          { opacity: 0, y: 100, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [roles]);

  if (roles.length === 0) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            No roles available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black relative z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-16 text-center md:text-left">
          <div>
            <h2
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-2 font-mono uppercase tracking-tighter"
            >
              Professional Roles
            </h2>
            <p className="text-zinc-500 font-mono text-sm md:text-base">
              &gt; Accessing Employee Records...
            </p>
          </div>

          {/* Mobile Indicator */}
          <div className="block md:hidden mt-4">
            <div className="flex gap-2 justify-center">
              {roles.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    idx === activeIndex ? "w-6 bg-cyan-400" : "w-1 bg-zinc-800"
                  )}
                />
              ))}
            </div>
          </div>
        </div>


        {/* --- MOBILE VIEW: Auto-Rotating Slideshow (Visible on small screens) --- */}
        <div className="block md:hidden h-[320px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={roles[activeIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <RoleCard role={roles[activeIndex]} index={activeIndex} />
            </motion.div>
          </AnimatePresence>
        </div>


        {/* --- DESKTOP VIEW: Grid (Visible on md+ screens) --- */}
        <div
          ref={gridRef}
          className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {roles.map((role, index) => (
            <div key={role.id} className="desktop-card h-[320px]">
              <RoleCard role={role} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

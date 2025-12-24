'use client';

/**
 * Command Deck Role Rotator (Controlled)
 * 
 * "Advanced, informative, and fully responsive"
 * Features:
 * - Glitch Text Effect
 * - Progress Timer
 * - Tech Tags (Simulated)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Role } from '@/lib/types/database';

interface RoleRotatorProps {
  role: Role;
  totalRoles: number;
  currentIndex: number;
}

// Simulated tech tags - normally this would come from the DB
const getTagsForRole = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('full stack')) return ['React', 'Node.js', 'PostgreSQL', 'Next.js'];
  if (t.includes('frontend')) return ['React', 'TypeScript', 'Tailwind', 'Framer Motion'];
  if (t.includes('backend')) return ['Node.js', 'Python', 'Go', 'SQL'];
  if (t.includes('mobile')) return ['React Native', 'Flutter', 'iOS', 'Android'];
  if (t.includes('data')) return ['Python', 'Pandas', 'SQL', 'Tableau'];
  return ['Development', 'Design', 'Architecture'];
};

export function RoleRotator({
  role,
  totalRoles,
  currentIndex
}: RoleRotatorProps) {
  const [glitch, setGlitch] = useState(false);

  // Trigger glitch effect when role changes
  useEffect(() => {
    setGlitch(true);
    const timer = setTimeout(() => setGlitch(false), 300);
    return () => clearTimeout(timer);
  }, [role.id]);

  const tags = getTagsForRole(role.title);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
      {/* 1. Header: Status & Index */}
      <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-4">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Active_Protocol
        </span>
        <span>{String(currentIndex + 1).padStart(2, '0')} / {String(totalRoles).padStart(2, '0')}</span>
      </div>

      {/* 2. Main Content: Title & Description */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              y: 0,
              filter: glitch ? 'blur(0px)' : 'blur(0px)',
              x: glitch ? [0, -2, 2, -1, 0] : 0, // Glitch shake
            }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <h2 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 font-mono leading-tight ${glitch ? 'text-shadow-glitch' : ''}`}>
              {role.title}
            </h2>
            <p className="text-sm text-zinc-400 line-clamp-3 font-mono border-l-2 border-blue-500/30 pl-3">
              {role.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Footer: Tech Tags & Progress Bar */}
      <div className="mt-4 space-y-3">
        {/* Tech Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 text-[10px] font-mono text-cyan-300 bg-cyan-900/20 border border-cyan-500/20 rounded-sm uppercase">
              {tag}
            </span>
          ))}
        </div>

        {/* Progress Bar - Animated loops every 4s (matching parent interval) */}
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            key={role.id}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.8, ease: "linear" }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
          />
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 blur-[40px] pointer-events-none" />
    </div>
  );
}

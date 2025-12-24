'use client';

/**
 * Role Card Component (Revamped)
 * 
 * "Holographic Data Plate" Design
 * Features:
 * - 3D Tilt Interaction
 * - Glassmorphism & Neon Glow
 * - Simulated Tech Metadata
 * - Responsive Layout
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/tilt-card'; // Reuse existing 3D tilt
import type { Role } from '@/lib/types/database';

interface RoleCardProps {
  role: Role;
  index?: number;
}

// Simulated metadata generator
const getRoleMeta = (title: string) => {
  const t = title.toLowerCase();

  if (t.includes('data')) return {
    level: 'Lvl. 4',
    access: 'RES', // Restricted
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    tags: ['Python', 'SQL', 'Tableau']
  };

  if (t.includes('web') || t.includes('frontend')) return {
    level: 'Lvl. 3',
    access: 'PUB', // Public
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]',
    tags: ['React', 'Next.js', 'Tailwind']
  };

  if (t.includes('backend') || t.includes('manager')) return {
    level: 'Lvl. 5',
    access: 'ADM', // Admin
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    tags: ['Node', 'Go', 'System Design']
  };

  if (t.includes('mobile')) return {
    level: 'Lvl. 3',
    access: 'MOB',
    color: 'text-green-400',
    borderColor: 'border-green-500/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]',
    tags: ['Flutter', 'React Native']
  };

  return {
    level: 'Lvl. 1',
    access: 'STD',
    color: 'text-zinc-400',
    borderColor: 'border-zinc-500/30',
    glow: 'group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    tags: ['Creative', 'Design']
  };
};

export function RoleCard({ role, index = 0 }: RoleCardProps) {
  const meta = getRoleMeta(role.title);

  return (
    <Link href={`/roles/${role.slug}`} className="block h-full cursor-none-if-custom-cursor">
      <TiltCard
        className={`
          h-full relative group overflow-hidden bg-black/40 backdrop-blur-md 
          border ${meta.borderColor} transition-all duration-500
          ${meta.glow}
        `}
      >
        {/* 1. Animated Background Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none" />

        {/* 2. Top Bar: Meta Info */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/2 relative z-10">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${meta.color.replace('text-', 'bg-')} animate-pulse`} />
            <span className={`text-[10px] font-mono tracking-widest ${meta.color} opacity-80`}>
              {meta.access}_PROTOCOL
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">{meta.level}</span>
        </div>

        {/* 3. Main Content */}
        <div className="p-6 relative z-10 flex flex-col h-[calc(100%-80px)]">
          <h3 className="text-2xl font-bold text-white mb-2 font-mono group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
            {role.title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-3 mb-6 font-mono leading-relaxed">
            {role.description}
          </p>

          {/* 4. Bottom: Tags & Action */}
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-wrap gap-2">
              {meta.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-zinc-300 font-mono uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
              <svg className="w-4 h-4 transform group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 5. Decorative Corners */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 rounded-bl-lg" />

      </TiltCard>
    </Link>
  );
}

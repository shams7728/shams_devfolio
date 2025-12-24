'use client';

/**
 * Interactive Particle Tech Hero Section
 * 
 * Theme: Sci-Fi / Holographic / High-Tech
 * - Background: 3D Particle Network connecting nodes.
 * - Profile: 3D Tilt Card with Glitch Text.
 * - Layout: Compact 4-column Grid (Intro: 2, Profile: 1, Sidebar: 1).
 */

import { Suspense, lazy, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/tilt-card';
import Image from 'next/image';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { RoleRotator } from './animations/role-rotator';
import type { Role, RoleBackground as RoleBackgroundType } from '@/lib/types/database';

// Lazy load 3D assets
const ParticleNetwork = lazy(() => import('./3d/particle-network'));

interface HeroSectionProps {
  roles?: Role[];
  roleBackgrounds?: Map<string, RoleBackgroundType>;
  portraitUrl?: string;
}

export function HeroSection({
  roles = [],
  roleBackgrounds = new Map(),
  portraitUrl = '/portrait.jpg'
}: HeroSectionProps) {

  // State for role rotation - syncs Profile Card and Rotator
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  // Auto-rotate roles
  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [roles.length]);

  // Fallback if no roles
  const currentRole = roles.length > 0 ? roles[currentRoleIndex] : {
    title: 'Full Stack Dev',
    description: 'Loading...',
    id: 'default',
    slug: 'default',
    is_published: true,
    display_order: 0,
    created_at: '',
    updated_at: ''
  } as Role;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 50 } }
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-black selection:bg-cyan-500/30">

      {/* 1. Particle Network Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black/90" />}>
          <ParticleNetwork />
        </Suspense>
      </div>

      {/* Vignette Overlay to focus center */}
      <div className="absolute inset-0 z-0 bg-radial-gradient(circle_at_center,transparent_0%,black_100%) opacity-80 pointer-events-none" />

      {/* 2. Main Bento Grid (Compact Height) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-auto lg:h-[500px]"
      >

        {/* --- Card A: Main Introduction (Left, 2 cols) --- */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 h-[400px] lg:h-full">
          <SpotlightCard className="h-full group border-cyan-500/20 bg-black/60 backdrop-blur-md">
            <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Scanline */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-scan" />

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-xs font-medium text-cyan-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  System Online
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[0.9] uppercase font-mono">
                  ARCHITECTING<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">INTELLIGENT</span><br />
                  EXPERIENCES.
                  <span className="animate-pulse">_</span>
                </h1>
              </div>

              <div className="space-y-6 relative z-10">
                <p className="text-base text-zinc-400 max-w-md font-mono">
                  &gt; Decoding Data Patterns...<br />
                  &gt; Assembling Web Realities...<br />
                  &gt; Syncing Mobile Systems...
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/projects"
                    className="px-6 py-3 bg-cyan-500 text-black rounded-sm font-bold hover:bg-cyan-400 transition-colors uppercase tracking-widest text-sm"
                  >
                    [ Explore ]
                  </Link>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* --- Card B: Advanced Profile (Center, 1 col) --- */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
          <TiltCard className="h-full w-full bg-black/60 border border-purple-500/30 overflow-hidden relative group">
            {/* Holographic Grid overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none z-10 mix-blend-overlay" />

            {/* Image Container */}
            <div className="absolute inset-2 top-2 bottom-16 rounded-lg overflow-hidden border border-white/10 z-0">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-60 z-10" />
              <Image
                src={portraitUrl}
                alt="Profile"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>

            {/* HUD Overlay - Synced with Rotator */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-sm bg-black/80 border border-purple-500/50 text-center backdrop-blur-sm z-20 group-hover:border-purple-400 transition-colors">
              <h3 className="font-bold text-white text-lg font-mono uppercase tracking-wider transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 whitespace-nowrap overflow-hidden text-ellipsis">
                Shams Mansuri
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-purple-300 uppercase tracking-[0.2em] font-mono animate-pulse">
                  {currentRole.title}
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* --- Sidebar Column (Right, 1 col) --- */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-col gap-4 h-full">

          {/* 1. Role Rotator (Top, Flex Grow) */}
          <div className="flex-1 min-h-[160px]">
            <SpotlightCard className="h-full bg-black/60 border border-blue-500/30">
              <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <RoleRotator
                  role={currentRole}
                  totalRoles={roles.length}
                  currentIndex={currentRoleIndex}
                />
              </div>
            </SpotlightCard>
          </div>

          {/* 2. Social Connections (Bottom, Vertical Stack) */}
          <div className="min-h-[160px] grid grid-rows-3 gap-2">

            {/* Gmail */}
            <a href="mailto:shamsmansoori567@gmail.com" className="group relative block overflow-hidden rounded-sm bg-black/60 border border-zinc-800 hover:border-red-500/50 transition-colors">
              <div className="absolute inset-0 bg-red-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="relative h-full flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-red-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <span className="text-[9px] uppercase text-zinc-500 font-mono tracking-wider group-hover:text-red-300">Email System</span>
                  <span className="text-[10px] font-bold text-white truncate group-hover:text-red-100">shamsmansoori567@gmail.com</span>
                </div>
              </div>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/shams-mansuri-44477812a/" target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-sm bg-black/60 border border-zinc-800 hover:border-blue-500/50 transition-colors">
              <div className="absolute inset-0 bg-blue-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="relative h-full flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] uppercase text-zinc-500 font-mono tracking-wider group-hover:text-blue-300">Network</span>
                  <span className="text-[10px] font-bold text-white group-hover:text-blue-100">LinkedIn Profile</span>
                </div>
              </div>
            </a>

            {/* GitHub */}
            <a href="https://github.com/shams7728" target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-sm bg-black/60 border border-zinc-800 hover:border-purple-500/50 transition-colors">
              <div className="absolute inset-0 bg-purple-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="relative h-full flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] uppercase text-zinc-500 font-mono tracking-wider group-hover:text-purple-300">Codebase</span>
                  <span className="text-[10px] font-bold text-white group-hover:text-purple-100">GitHub</span>
                </div>
              </div>
            </a>

          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}

'use client';

/**
 * Skills Page Client Component
 * 
 * Re-designed with "Cosmic Fusion" theme for premium aesthetic.
 * Features:
 * - Immersive Liquid Background
 * - Glassmorphism Skill Cards
 * - Responsive Grid Layout
 * - Category Filtering
 */

import { useState, useEffect, useMemo } from 'react';
import { NavigationBar } from '@/components/navigation-bar';
import { PageTransition } from '@/components/page-transition';
import LiquidBackground from '@/components/3d/liquid-background';
import { buildTechGraph, getTechCategories, filterTechByCategory, Technology } from '@/lib/utils/tech-graph';
import type { Project, Skill, SkillCategory } from '@/lib/types/database'; // Added imports
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '@/components/ui/tilt-card';

interface SkillsPageClientProps {
  projects: Project[];
  dbCategories?: SkillCategory[];
  dbSkills?: Skill[];
}

export default function SkillsPageClient({ projects, dbCategories = [], dbSkills = [] }: SkillsPageClientProps) {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Build technology graph or use DB Data
  useEffect(() => {
    if (dbSkills.length > 0) {
      // Map DB skills to UI format
      const mappedTechs: Technology[] = dbSkills.map(skill => {
        const cat = dbCategories.find(c => c.id === skill.category_id);
        return {
          id: skill.id,
          name: skill.name,
          category: cat ? cat.title : 'Other',
          relatedTech: [], // Connections not stored in simple DB model yet
        };
      });
      setTechnologies(mappedTechs);
    } else {
      // Fallback to auto-generated graph
      const techGraph = buildTechGraph(projects);
      setTechnologies(techGraph);
    }
    setMounted(true);
  }, [projects, dbSkills, dbCategories]);

  // Get categories
  const categories = useMemo(() => {
    if (dbCategories.length > 0) {
      return dbCategories.map(c => c.title);
    }
    return getTechCategories(technologies);
  }, [technologies, dbCategories]);

  // Filter technologies
  const filteredTechnologies = useMemo(() => {
    if (!selectedCategory) return technologies;
    return filterTechByCategory(technologies, selectedCategory);
  }, [technologies, selectedCategory]);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[#0f0720] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0f0720] text-white">
        {/* Navigation */}
        <div className="relative z-50">
          <NavigationBar />
        </div>

        {/* Background Layers */}
        <div className="fixed inset-0 z-0 h-full w-full">
          <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
            <LiquidBackground c1="#2e1065" c2="#c026d3" c3="#4f46e5" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0720]/50 via-[#0f0720]/80 to-[#0f0720] z-10" />
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none z-10" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-10" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">

          {/* Header */}
          <div className="text-center mb-16">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-fuchsia-300 hover:text-white transition-colors duration-300 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-indigo-200 mb-6 drop-shadow-[0_0_20px_rgba(192,38,211,0.3)]"
            >
              Tech Arsenal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl text-fuchsia-100/60 max-w-2xl mx-auto font-light leading-relaxed"
            >
              A curated collection of technologies and tools used to build immersive digital experiences.
            </motion.p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-30">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${selectedCategory === null
                ? 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-[0_0_15px_rgba(192,38,211,0.5)]'
                : 'bg-white/5 text-fuchsia-100/70 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
            >
              All Skills
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${selectedCategory === category
                  ? 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-[0_0_15px_rgba(192,38,211,0.5)]'
                  : 'bg-white/5 text-fuchsia-100/70 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          {technologies.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
              <p className="text-xl text-fuchsia-100/50">No skills data available yet.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
            >
              <AnimatePresence>
                {filteredTechnologies.map((tech) => (
                  <motion.div
                    layout
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TiltCard
                      className="h-full group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#1a0b2e]/60 border border-white/5 backdrop-blur-md hover:border-fuchsia-500/50 hover:bg-[#2e1065]/60 transition-all duration-500 text-center"
                      tiltMaxAngle={10}
                      glareEnable={true}
                      scale={1.05}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 to-indigo-500/0 group-hover:from-fuchsia-500/10 group-hover:to-indigo-500/10 transition-all duration-500 rounded-2xl" />

                      <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-fuchsia-400/50 group-hover:shadow-[0_0_15px_rgba(192,38,211,0.3)] transition-all duration-300">
                        <span className="text-xl font-bold text-fuchsia-300 group-hover:text-white">
                          {tech.name.charAt(0)}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-white group-hover:text-fuchsia-200 transition-colors mb-2">
                        {tech.name}
                      </h3>

                      <span className="text-xs text-fuchsia-100/40 uppercase tracking-wider font-medium">
                        {tech.category}
                      </span>

                      {/* Connection Count Badge */}
                      {tech.relatedTech.length > 0 && (
                        <div className="mt-3 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-indigo-300/60">
                          {tech.relatedTech.length} connection{tech.relatedTech.length !== 1 && 's'}
                        </div>
                      )}
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}

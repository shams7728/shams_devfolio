/**
 * Role Details Page
 * 
 * Server component that displays a role and its associated projects
 * Implements ISR with 60-second revalidation
 * Enhanced with 3D tilt effects on project cards
 * Requirements: 1.2, 2.1, 8.1, 8.3, 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { RoleModel } from '@/lib/models/role';
import { ProjectModel } from '@/lib/models/project';
import { NavigationBar } from '@/components/navigation-bar';
import { PageTransition } from '@/components/page-transition';
import { RoleProjectsGrid } from './role-projects-grid';
import LiquidBackground from '@/components/3d/liquid-background';

interface RolePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for SEO
 * Requirements: 8.1
 */
export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const role = await RoleModel.getBySlug(supabase, slug);

  if (!role) {
    return {
      title: 'Role Not Found',
    };
  }

  return {
    title: `${role.title} | Multi-Role Portfolio`,
    description: role.description,
    openGraph: {
      title: role.title,
      description: role.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: role.title,
      description: role.description,
    },
  };
}

/**
 * Role Details Page Component
 * 
 * Fetches role and projects, displays them with ISR
 * Requirements: 1.2, 2.1, 8.3
 */
export default async function RolePage({ params }: RolePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch role by slug
  const role = await RoleModel.getBySlug(supabase, slug);

  if (!role || !role.is_published) {
    notFound();
  }

  // Fetch published projects for this role
  const projects = await ProjectModel.getByRole(supabase, role.id, true);

  return (
    <PageTransition>
      <main className="relative w-full overflow-x-hidden bg-[#0f0720] min-h-screen">
        {/* Navigation bar */}
        <div className="relative z-50">
          <NavigationBar />
        </div>

        {/* Hero Section with Liquid Background */}
        <section className="relative w-full min-h-[50vh] flex flex-col justify-center overflow-hidden">
          {/* Background Layers */}
          <div className="absolute inset-0 z-0">
            {/* New "Cosmic Fusion" Theme: Deep Violet, Fuchsia, Indigo */}
            <div className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none">
              <LiquidBackground c1="#2e1065" c2="#c026d3" c3="#4f46e5" />
            </div>

            {/* Gradient Overlay - Smooth transition from dark violet */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0720]/30 via-[#0f0720]/60 to-[#0f0720] z-10" />

            {/* Decorative Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-10 animate-pulse" />
          </div>

          {/* Content Container */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center sm:text-left">
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-fuchsia-300 hover:text-white transition-colors duration-300 mb-8 group"
            >
              <div className="p-1.5 rounded-full bg-fuchsia-900/30 border border-fuchsia-500/30 group-hover:bg-fuchsia-600 mr-2 transition-all">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </div>
              Back to Home
            </Link>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Role Icon / Initial */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl bg-[#1a0b2e] border border-white/10 flex items-center justify-center shadow-2xl">
                  {role.icon_url ? (
                    <img src={role.icon_url} alt={role.title} className="w-16 h-16 object-contain" />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-indigo-400">
                      {role.title.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Role Title & Description */}
              <div className="flex-1 w-full max-w-3xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">
                  {role.title}
                </h1>
                <p className="text-lg sm:text-xl text-fuchsia-100/80 leading-relaxed font-light border-l-2 border-fuchsia-500/50 pl-6">
                  {role.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="relative z-20 w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f0720] to-black">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12 sm:mb-16 border-b border-white/10 pb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-4">
                <span className="w-2 h-8 bg-gradient-to-b from-fuchsia-500 to-indigo-600 rounded-full" />
                Featured Projects
              </h2>
              <div className="hidden sm:block text-fuchsia-200/50 font-mono text-sm">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/5">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                  <svg className="w-8 h-8 text-fuchsia-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-xl text-fuchsia-100 font-medium">No projects available yet.</p>
                <p className="text-fuchsia-200/50 mt-2">Check back soon for updates!</p>
              </div>
            ) : (
              <RoleProjectsGrid
                projects={projects.map(p => ({ ...p, role }))}
              />
            )}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}

/**
 * Enable ISR with 60-second revalidation
 * Requirements: 8.3
 */
export const revalidate = 60;

/**
 * All Projects Page
 * 
 * Server component that displays all projects with role-based filtering
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { createClient } from '@/lib/supabase/server';
import { RoleModel } from '@/lib/models/role';
import { NavigationBar } from '@/components/navigation-bar';
import { PageTransition } from '@/components/page-transition';
import { ProjectsPageClient } from './projects-page-client';
import LiquidBackground from '@/components/3d/liquid-background';
import Link from 'next/link';

export const metadata = {
  title: 'All Projects | Multi-Role Portfolio',
  description: 'Browse all projects across different professional roles',
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  // Fetch all published roles
  const roles = await RoleModel.getAll(supabase, true);

  // Fetch all published projects with their roles
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      role:roles(*)
    `)
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return (
      <PageTransition>
        <main className="relative w-full overflow-x-hidden bg-black min-h-screen flex items-center justify-center">
          <div className="z-10 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Error Loading Projects</h1>
            <p className="text-zinc-400">Unable to load projects at this time.</p>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="relative w-full overflow-x-hidden bg-zinc-950 min-h-screen">
        <NavigationBar />

        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10 pointer-events-none" />
          {/* Dynamic Background using CSS or optimized Canvas if LiquidBackground is too heavy for full page scroll. 
               Using a dark gradient mesh here for performance and "premium" look. 
           */}
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="w-full border-b border-white/5 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors duration-300 mb-8 gap-2 group"
              >
                <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
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

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mb-6 tracking-tight">
                All Projects
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
                Explore my work across different professional roles. <br className="hidden sm:block" />
                Filter by role to see specialized projects.
              </p>
            </div>
          </div>

          {/* Client-side filtered content */}
          <ProjectsPageClient roles={roles} projects={projects || []} />
        </div>
      </main>
    </PageTransition>
  );
}

/**
 * Enable ISR with 60-second revalidation
 */
export const revalidate = 60;

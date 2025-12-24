'use client';

/**
 * Projects Page Client Component
 * 
 * Client-side wrapper for role mode filtering and global search
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1
 */

import type { Role, Project } from '@/lib/types/database';
import { RoleModeSelector } from '@/components/role-mode-selector';
import { FilteredProjectsGrid } from '@/components/filtered-projects-grid';
import { GlobalSearch } from '@/components/global-search';

interface ProjectWithRole extends Project {
  role: Role;
}

interface ProjectsPageClientProps {
  roles: Role[];
  projects: ProjectWithRole[];
}

export function ProjectsPageClient({ roles, projects }: ProjectsPageClientProps) {
  // Debug logging
  console.log('ProjectsPageClient rendering:', { 
    rolesCount: roles.length, 
    projectsCount: projects.length 
  });

  return (
    <>
      {/* Global Search Bar */}
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <GlobalSearch />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Search across all roles and projects
            </p>
          </div>
        </div>
      </div>

      {/* Role Mode Selector */}
      <RoleModeSelector roles={roles} />
      
      {/* Filtered Projects Grid */}
      <FilteredProjectsGrid projects={projects} />
    </>
  );
}

'use client';

/**
 * Filtered Projects Grid Component
 * 
 * Displays projects filtered by selected role mode with animations
 * Enhanced with 3D tilt effects and neon glow animations
 * Requirements: 6.1, 6.3, 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { useMemo } from 'react';
import type { Project, Role } from '@/lib/types/database';
import { useRoleMode } from '@/lib/contexts/role-mode-context';
import { EnhancedProjectCard } from './enhanced-project-card';

interface ProjectWithRole extends Project {
  role: Role;
}

interface FilteredProjectsGridProps {
  projects: ProjectWithRole[];
}

export function FilteredProjectsGrid({ projects }: FilteredProjectsGridProps) {
  const { selectedRoleId, selectedRole } = useRoleMode();

  // Filter projects based on selected role
  const filteredProjects = useMemo(() => {
    if (!selectedRoleId) {
      return projects;
    }
    return projects.filter((project) => project.role_id === selectedRoleId);
  }, [projects, selectedRoleId]);

  // Apply role-specific theme adaptation
  const themeClass = useMemo(() => {
    if (!selectedRole) return '';
    
    // Map role titles to theme classes
    const roleThemes: Record<string, string> = {
      'Data Analyst': 'data-analyst-theme',
      'Web Developer': 'web-developer-theme',
      'Flutter Developer': 'flutter-developer-theme',
      'SQL Developer': 'sql-developer-theme',
    };

    return roleThemes[selectedRole.title] || '';
  }, [selectedRole]);

  if (filteredProjects.length === 0) {
    return (
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <svg
              className="w-8 h-8 text-zinc-400 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            {selectedRole
              ? `No projects available for ${selectedRole.title} yet.`
              : 'No projects available at the moment.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 ${themeClass}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with count */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            {selectedRole ? `${selectedRole.title} Projects` : 'All Projects'}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {/* Projects grid with enhanced cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <EnhancedProjectCard
              key={project.id}
              project={project}
              showRoleBadge={!selectedRoleId}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

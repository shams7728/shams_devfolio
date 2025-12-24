'use client';

/**
 * Role Mode Selector Component
 * 
 * Allows users to filter portfolio by role with smooth animations
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Role } from '@/lib/types/database';
import { useRoleMode } from '@/lib/contexts/role-mode-context';

interface RoleModeSelectorProps {
  roles: Role[];
}

export function RoleModeSelector({ roles }: RoleModeSelectorProps) {
  const { selectedRoleId, setRoleMode } = useRoleMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Animate selector on mount
  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  // Animate indicator when selection changes
  useEffect(() => {
    if (!indicatorRef.current || !containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll('button');
    const activeButton = Array.from(buttons).find(
      (btn) => btn.dataset.roleId === (selectedRoleId || 'all')
    );

    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      gsap.to(indicatorRef.current, {
        x: rect.left - containerRect.left,
        width: rect.width,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [selectedRoleId]);

  const handleRoleSelect = (roleId: string | null, role: Role | null) => {
    setRoleMode(roleId, role);
  };

  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Filter by Role
            </h3>
            {selectedRoleId && (
              <button
                onClick={() => handleRoleSelect(null, null)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Clear filter
              </button>
            )}
          </div>

          <div
            ref={containerRef}
            className="relative flex flex-wrap gap-2 sm:gap-3"
          >
            {/* Animated indicator */}
            <div
              ref={indicatorRef}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 pointer-events-none transition-all duration-300"
              style={{ width: 0 }}
            />

            {/* All Roles button */}
            <button
              data-role-id="all"
              onClick={() => handleRoleSelect(null, null)}
              className={`
                relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${
                  selectedRoleId === null
                    ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `}
            >
              All Roles
            </button>

            {/* Role buttons */}
            {roles.map((role) => (
              <button
                key={role.id}
                data-role-id={role.id}
                onClick={() => handleRoleSelect(role.id, role)}
                className={`
                  relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    selectedRoleId === role.id
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }
                `}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

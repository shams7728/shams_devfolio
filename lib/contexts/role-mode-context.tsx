'use client';

/**
 * Role Mode Context
 * 
 * Manages role-based portfolio mode state with session storage persistence
 * Requirements: 6.1, 6.2, 6.4, 6.5
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Role } from '@/lib/types/database';

interface RoleModeContextType {
  selectedRoleId: string | null; // null means "All Roles"
  selectedRole: Role | null;
  setRoleMode: (roleId: string | null, role: Role | null) => void;
  isTransitioning: boolean;
}

const RoleModeContext = createContext<RoleModeContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'portfolio-role-mode';

interface RoleModeProviderProps {
  children: ReactNode;
  availableRoles?: Role[];
}

export function RoleModeProvider({ children, availableRoles = [] }: RoleModeProviderProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load from session storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const { roleId } = JSON.parse(stored);
        if (roleId) {
          const role = availableRoles.find(r => r.id === roleId);
          if (role) {
            setSelectedRoleId(roleId);
            setSelectedRole(role);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load role mode from session storage:', error);
    }
  }, [availableRoles]);

  const setRoleMode = (roleId: string | null, role: Role | null) => {
    // Start transition animation
    setIsTransitioning(true);

    // Update state after a brief delay for animation
    setTimeout(() => {
      setSelectedRoleId(roleId);
      setSelectedRole(role);

      // Persist to session storage
      try {
        if (roleId) {
          sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify({ roleId, roleTitle: role?.title })
          );
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save role mode to session storage:', error);
      }

      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 150);
  };

  return (
    <RoleModeContext.Provider
      value={{
        selectedRoleId,
        selectedRole,
        setRoleMode,
        isTransitioning,
      }}
    >
      {children}
    </RoleModeContext.Provider>
  );
}

export function useRoleMode() {
  const context = useContext(RoleModeContext);
  if (context === undefined) {
    throw new Error('useRoleMode must be used within a RoleModeProvider');
  }
  return context;
}

/**
 * Supabase Utilities
 * 
 * Central export point for all Supabase-related utilities.
 * This provides a clean API for the rest of the application.
 */

// Client exports
export { getSupabaseBrowserClient, supabase } from './client';
export { createClient, createAdminClient } from './server';

// Query helpers
export { roleQueries, projectQueries, userQueries } from './queries';

// Error handling
export {
  SupabaseError,
  handleSupabaseError,
  isSupabaseError,
  getErrorMessage,
  logError,
  withErrorHandling,
} from './errors';

// Re-export types for convenience
export type {
  Database,
  Role,
  Project,
  User,
  CreateRoleData,
  UpdateRoleData,
  CreateProjectData,
  UpdateProjectData,
  ProjectWithRole,
  RoleWithProjects,
} from '@/lib/types/database';

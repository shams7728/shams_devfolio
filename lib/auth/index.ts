/**
 * Authentication Module
 * 
 * Central export point for server-side authentication utilities.
 * For client-side auth, use the Supabase browser client directly.
 */

export {
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  requireAdmin,
  requireSuperAdmin,
} from './auth';

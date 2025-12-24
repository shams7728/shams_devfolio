/**
 * Authentication Utilities (Server-side only)
 * 
 * Provides helper functions for server-side authentication operations.
 * For client-side auth, use the Supabase browser client directly.
 * 
 * Requirements: 3.1, 3.2, 3.3
 */

import { createClient } from '@/lib/supabase/server';
import type { User } from '@/lib/types/database';
import { AuthenticationError, AuthorizationError } from '@/lib/utils/error-handler';

/**
 * Server-side: Get the current authenticated user
 * Returns null if no user is authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  
  const { data: { user: authUser }, error } = await supabase.auth.getUser();
  
  if (error || !authUser) {
    return null;
  }

  // Fetch user details from our users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (userError || !userData) {
    return null;
  }

  return userData;
}

/**
 * Server-side: Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Server-side: Check if user has admin role (admin or super_admin)
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && (user.role === 'admin' || user.role === 'super_admin');
}

/**
 * Server-side: Check if user has super_admin role
 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && user.role === 'super_admin';
}

/**
 * Server-side: Verify that the request has a valid admin session
 * Throws an error if not authenticated or not an admin
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }

  if (user.role !== 'admin' && user.role !== 'super_admin') {
    throw new AuthorizationError('Admin access required');
  }

  return user;
}

/**
 * Server-side: Verify that the request has a valid super admin session
 * Throws an error if not authenticated or not a super admin
 */
export async function requireSuperAdmin(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }

  if (user.role !== 'super_admin') {
    throw new AuthorizationError('Super admin access required');
  }

  return user;
}

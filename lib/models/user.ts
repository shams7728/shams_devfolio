/**
 * User Model
 * 
 * Business logic layer for User operations
 * Requirements: 3.4
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { User, CreateUserData, UpdateUserData } from '@/lib/types/database';
import { userQueries } from '@/lib/supabase/queries';

/**
 * Validation schema for creating a user
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'super_admin']).refine((val) => val === 'admin' || val === 'super_admin', {
    message: 'Role must be either admin or super_admin',
  }),
});

/**
 * Validation schema for updating a user
 */
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['admin', 'super_admin']).refine((val) => val === 'admin' || val === 'super_admin', {
    message: 'Role must be either admin or super_admin',
  }).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * User Model Class
 * 
 * Provides CRUD operations and business logic for users
 */
export class UserModel {
  /**
   * Fetch all users
   * Ordered by created_at descending
   * 
   * Requirements: 3.4
   */
  static async getAll(client: SupabaseClient): Promise<User[]> {
    return userQueries.getAll(client);
  }

  /**
   * Fetch a single user by ID
   */
  static async getById(client: SupabaseClient, id: string): Promise<User | null> {
    return userQueries.getById(client, id);
  }

  /**
   * Create a new user
   * 
   * Creates both an auth user and a database user record
   * Requirements: 3.4
   */
  static async create(
    client: SupabaseClient,
    input: CreateUserInput
  ): Promise<User> {
    // Validate input
    const validated = createUserSchema.parse(input);

    // Create auth user using admin API
    const { data: authData, error: authError } = await client.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Failed to create auth user');
    }

    // Create user record in database
    const userData: CreateUserData = {
      id: authData.user.id,
      email: validated.email,
      role: validated.role,
    };

    try {
      const user = await userQueries.create(client, userData);
      return user;
    } catch (error) {
      // If database insert fails, try to clean up the auth user
      try {
        await client.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user after database error:', cleanupError);
      }
      throw error;
    }
  }

  /**
   * Update an existing user
   * 
   * Requirements: 3.4
   */
  static async update(
    client: SupabaseClient,
    id: string,
    input: UpdateUserInput
  ): Promise<User> {
    // Validate input
    const validated = updateUserSchema.parse(input);

    // Check if user exists
    const existingUser = await userQueries.getById(client, id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Update auth user email if changed
    if (validated.email && validated.email !== existingUser.email) {
      const { error: authError } = await client.auth.admin.updateUserById(id, {
        email: validated.email,
      });

      if (authError) {
        throw new Error(authError.message || 'Failed to update auth user email');
      }
    }

    // Update user record in database
    const data: UpdateUserData = {};
    if (validated.email) data.email = validated.email;
    if (validated.role) data.role = validated.role;

    return userQueries.update(client, id, data);
  }

  /**
   * Delete a user
   * 
   * Deletes both the database record and the auth user
   * Requirements: 3.4
   */
  static async delete(client: SupabaseClient, id: string): Promise<void> {
    // Check if user exists
    const existingUser = await userQueries.getById(client, id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Delete from database first
    await userQueries.delete(client, id);

    // Delete auth user
    const { error: authError } = await client.auth.admin.deleteUser(id);
    if (authError) {
      console.error('Failed to delete auth user:', authError);
      // Don't throw here as the database record is already deleted
    }
  }
}

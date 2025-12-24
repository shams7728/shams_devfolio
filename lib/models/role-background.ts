/**
 * Role Background Model
 * 
 * Business logic layer for Role Background operations
 * Requirements: 2.7
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RoleBackground, CreateRoleBackgroundData, UpdateRoleBackgroundData } from '@/lib/types/database';

/**
 * Validation schema for creating a role background
 */
export const createRoleBackgroundSchema = z.object({
  role_id: z.string().uuid('Invalid role ID'),
  animation_type: z.enum(['data-grid', 'code-lines', 'ui-components', 'database-shapes', 'custom']),
  config: z.record(z.string(), z.any()).optional().default({}),
});

/**
 * Validation schema for updating a role background
 */
export const updateRoleBackgroundSchema = z.object({
  animation_type: z.enum(['data-grid', 'code-lines', 'ui-components', 'database-shapes', 'custom']).optional(),
  config: z.record(z.string(), z.any()).optional(),
});

export type CreateRoleBackgroundInput = z.infer<typeof createRoleBackgroundSchema>;
export type UpdateRoleBackgroundInput = z.infer<typeof updateRoleBackgroundSchema>;

/**
 * Role Background Model Class
 * 
 * Provides CRUD operations for role background configurations
 */
export class RoleBackgroundModel {
  /**
   * Fetch role background by role ID
   * 
   * Requirements: 2.7
   */
  static async getByRoleId(
    client: SupabaseClient,
    roleId: string
  ): Promise<RoleBackground | null> {
    const { data, error } = await client
      .from('role_backgrounds')
      .select('*')
      .eq('role_id', roleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  }

  /**
   * Create or update role background (upsert)
   * 
   * Requirements: 2.7
   */
  static async upsert(
    client: SupabaseClient,
    roleId: string,
    input: CreateRoleBackgroundInput | UpdateRoleBackgroundInput
  ): Promise<RoleBackground> {
    // Check if background exists
    const existing = await this.getByRoleId(client, roleId);

    if (existing) {
      // Update existing
      const validated = updateRoleBackgroundSchema.parse(input);
      
      const { data, error } = await client
        .from('role_backgrounds')
        .update(validated)
        .eq('role_id', roleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new
      const validated = createRoleBackgroundSchema.parse({
        role_id: roleId,
        ...input,
      });

      const { data, error } = await client
        .from('role_backgrounds')
        .insert(validated)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Delete role background
   * 
   * Requirements: 2.7
   */
  static async delete(
    client: SupabaseClient,
    roleId: string
  ): Promise<void> {
    const { error } = await client
      .from('role_backgrounds')
      .delete()
      .eq('role_id', roleId);

    if (error) throw error;
  }
}

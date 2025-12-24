/**
 * Role Model
 * 
 * Business logic layer for Role operations
 * Requirements: 1.1, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Role, CreateRoleData, UpdateRoleData } from '@/lib/types/database';
import { roleQueries, projectQueries } from '@/lib/supabase/queries';
import { generateSlug } from '@/lib/utils/slug';

/**
 * Validation schema for creating a role
 */
export const createRoleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
  icon_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_published: z.boolean().optional().default(false),
});

/**
 * Validation schema for updating a role
 */
export const updateRoleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less').optional(),
  icon_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_published: z.boolean().optional(),
});

/**
 * Validation schema for reordering roles
 */
export const reorderRolesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('Invalid role ID'),
      display_order: z.number().int().min(0, 'Display order must be non-negative'),
    })
  ).min(1, 'At least one item is required'),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type ReorderRolesInput = z.infer<typeof reorderRolesSchema>;

/**
 * Role Model Class
 * 
 * Provides CRUD operations and business logic for roles
 */
export class RoleModel {
  /**
   * Fetch all roles, optionally filtered by published status
   * Ordered by display_order
   * 
   * Requirements: 1.1
   */
  static async getAll(
    client: SupabaseClient,
    publishedOnly: boolean = false
  ): Promise<Role[]> {
    return roleQueries.getAll(client, publishedOnly);
  }

  /**
   * Fetch a single role by slug
   * 
   * Requirements: 1.2
   */
  static async getBySlug(
    client: SupabaseClient,
    slug: string
  ): Promise<Role | null> {
    return roleQueries.getBySlug(client, slug);
  }

  /**
   * Fetch a single role by ID
   */
  static async getById(
    client: SupabaseClient,
    id: string
  ): Promise<Role | null> {
    return roleQueries.getById(client, id);
  }

  /**
   * Create a new role
   * 
   * Automatically generates slug from title and sets display_order to max + 1
   * Requirements: 4.1
   */
  static async create(
    client: SupabaseClient,
    input: CreateRoleInput
  ): Promise<Role> {
    // Validate input
    const validated = createRoleSchema.parse(input);

    // Generate slug from title
    const slug = generateSlug(validated.title);

    // Check if slug already exists
    const existingRole = await roleQueries.getBySlug(client, slug);
    if (existingRole) {
      throw new Error(`A role with slug "${slug}" already exists`);
    }

    // Get max display_order
    const allRoles = await roleQueries.getAll(client, false);
    const maxOrder = allRoles.length > 0
      ? Math.max(...allRoles.map(r => r.display_order))
      : -1;

    // Prepare data for insertion
    const insertData = {
      title: validated.title,
      description: validated.description,
      slug,
      icon_url: validated.icon_url || undefined,
      is_published: validated.is_published ?? false,
      display_order: maxOrder + 1,
    };

    // Create role
    return roleQueries.create(client, insertData);
  }

  /**
   * Update an existing role
   * 
   * Updates slug if title changed
   * Requirements: 4.2
   */
  static async update(
    client: SupabaseClient,
    id: string,
    input: UpdateRoleInput
  ): Promise<Role> {
    // Validate input
    const validated = updateRoleSchema.parse(input);

    // Check if role exists
    const existingRole = await roleQueries.getById(client, id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    // Prepare update data
    const data: UpdateRoleData = { ...validated };

    // If title changed, regenerate slug
    if (validated.title && validated.title !== existingRole.title) {
      const newSlug = generateSlug(validated.title);
      
      // Check if new slug conflicts with another role
      const conflictingRole = await roleQueries.getBySlug(client, newSlug);
      if (conflictingRole && conflictingRole.id !== id) {
        throw new Error(`A role with slug "${newSlug}" already exists`);
      }
      
      data.slug = newSlug;
    }

    // Update role
    return roleQueries.update(client, id, data);
  }

  /**
   * Delete a role
   * 
   * Checks for associated projects and prevents deletion if any exist
   * Requirements: 4.3
   */
  static async delete(
    client: SupabaseClient,
    id: string
  ): Promise<void> {
    // Check if role exists
    const existingRole = await roleQueries.getById(client, id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    // Check for associated projects
    const projects = await projectQueries.getByRole(client, id, false);
    if (projects.length > 0) {
      throw new Error(
        `Cannot delete role with ${projects.length} associated project(s). ` +
        'Please delete or reassign the projects first.'
      );
    }

    // Delete role
    await roleQueries.delete(client, id);
  }

  /**
   * Reorder roles by updating display_order
   * 
   * Requirements: 1.3, 4.4
   */
  static async reorder(
    client: SupabaseClient,
    input: ReorderRolesInput
  ): Promise<void> {
    // Validate input
    const validated = reorderRolesSchema.parse(input);

    // Verify all roles exist
    const roleIds = validated.items.map(item => item.id);
    const roles = await Promise.all(
      roleIds.map(id => roleQueries.getById(client, id))
    );

    const missingRoles = roles
      .map((role, index) => (role ? null : roleIds[index]))
      .filter(Boolean);

    if (missingRoles.length > 0) {
      throw new Error(`Roles not found: ${missingRoles.join(', ')}`);
    }

    // Update display orders
    await roleQueries.updateOrder(client, validated.items);
  }
}

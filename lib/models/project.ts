/**
 * Project Model
 * 
 * Business logic layer for Project operations
 * Requirements: 2.1, 2.5, 5.4
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Project, CreateProjectData, UpdateProjectData } from '@/lib/types/database';
import { projectQueries, roleQueries } from '@/lib/supabase/queries';

/**
 * URL validation utility
 * Validates GitHub and live URLs
 * Requirements: 5.4
 */
const urlSchema = z.string().url('Invalid URL format').optional().or(z.literal(''));

/**
 * Validation schema for creating a project
 */
export const createProjectSchema = z.object({
  role_id: z.string().uuid('Invalid role ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  short_description: z.string().min(1, 'Short description is required').max(300, 'Short description must be 300 characters or less'),
  long_description: z.string().min(1, 'Long description is required'),
  tech_stack: z.array(z.string()).min(1, 'At least one technology is required').max(20, 'Maximum 20 technologies allowed'),
  github_url: urlSchema,
  live_url: urlSchema,
  cover_image_url: z.string().url('Invalid cover image URL'),
  gallery_urls: z.array(z.string().url('Invalid gallery image URL')).optional().default([]),
  is_published: z.boolean().optional().default(false),
});

/**
 * Validation schema for updating a project
 */
export const updateProjectSchema = z.object({
  role_id: z.string().uuid('Invalid role ID').optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less').optional(),
  short_description: z.string().min(1, 'Short description is required').max(300, 'Short description must be 300 characters or less').optional(),
  long_description: z.string().min(1, 'Long description is required').optional(),
  tech_stack: z.array(z.string()).min(1, 'At least one technology is required').max(20, 'Maximum 20 technologies allowed').optional(),
  github_url: urlSchema,
  live_url: urlSchema,
  cover_image_url: z.string().url('Invalid cover image URL').optional(),
  gallery_urls: z.array(z.string().url('Invalid gallery image URL')).optional(),
  is_published: z.boolean().optional(),
});

/**
 * Validation schema for reordering projects
 */
export const reorderProjectsSchema = z.object({
  role_id: z.string().uuid('Invalid role ID'),
  items: z.array(
    z.object({
      id: z.string().uuid('Invalid project ID'),
      display_order: z.number().int().min(0, 'Display order must be non-negative'),
    })
  ).min(1, 'At least one item is required'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ReorderProjectsInput = z.infer<typeof reorderProjectsSchema>;

/**
 * Project Model Class
 * 
 * Provides CRUD operations and business logic for projects
 */
export class ProjectModel {
  /**
   * Fetch all projects for a specific role, optionally filtered by published status
   * Ordered by display_order
   * 
   * Requirements: 2.1
   */
  static async getByRole(
    client: SupabaseClient,
    roleId: string,
    publishedOnly: boolean = false
  ): Promise<Project[]> {
    return projectQueries.getByRole(client, roleId, publishedOnly);
  }

  /**
   * Fetch a single project by ID
   */
  static async getById(
    client: SupabaseClient,
    id: string
  ): Promise<Project | null> {
    return projectQueries.getById(client, id);
  }

  /**
   * Fetch a project with its associated role
   */
  static async getByIdWithRole(
    client: SupabaseClient,
    id: string
  ): Promise<(Project & { role: any }) | null> {
    return projectQueries.getByIdWithRole(client, id);
  }

  /**
   * Create a new project
   * 
   * Validates URLs and sets display_order to max + 1 for the role
   * Requirements: 2.1, 5.1, 5.4
   */
  static async create(
    client: SupabaseClient,
    input: CreateProjectInput
  ): Promise<Project> {
    // Validate input
    const validated = createProjectSchema.parse(input);

    // Verify role exists
    const role = await roleQueries.getById(client, validated.role_id);
    if (!role) {
      throw new Error('Role not found');
    }

    // Get max display_order for this role
    const existingProjects = await projectQueries.getByRole(client, validated.role_id, false);
    const maxOrder = existingProjects.length > 0
      ? Math.max(...existingProjects.map(p => p.display_order))
      : -1;

    // Prepare data for insertion
    const insertData = {
      role_id: validated.role_id,
      title: validated.title,
      short_description: validated.short_description,
      long_description: validated.long_description,
      tech_stack: validated.tech_stack,
      github_url: validated.github_url || undefined,
      live_url: validated.live_url || undefined,
      cover_image_url: validated.cover_image_url,
      gallery_urls: validated.gallery_urls || [],
      is_published: validated.is_published ?? false,
      display_order: maxOrder + 1,
    };

    // Create project
    return projectQueries.create(client, insertData);
  }

  /**
   * Update an existing project
   * 
   * Validates URLs and updates database record
   * Requirements: 2.2, 5.3
   */
  static async update(
    client: SupabaseClient,
    id: string,
    input: UpdateProjectInput
  ): Promise<Project> {
    // Validate input
    const validated = updateProjectSchema.parse(input);

    // Check if project exists
    const existingProject = await projectQueries.getById(client, id);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    // If role_id is being changed, verify new role exists
    if (validated.role_id && validated.role_id !== existingProject.role_id) {
      const role = await roleQueries.getById(client, validated.role_id);
      if (!role) {
        throw new Error('Role not found');
      }
    }

    // Prepare update data
    const data: UpdateProjectData = { ...validated };

    // Update project
    return projectQueries.update(client, id, data);
  }

  /**
   * Delete a project
   * 
   * Returns the project data so caller can delete associated media files
   * Requirements: 2.4
   */
  static async delete(
    client: SupabaseClient,
    id: string
  ): Promise<Project> {
    // Check if project exists and fetch it
    const existingProject = await projectQueries.getById(client, id);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    // Delete project
    await projectQueries.delete(client, id);

    // Return project data so caller can delete media files
    return existingProject;
  }

  /**
   * Reorder projects within a role by updating display_order
   * 
   * Requirements: 2.5
   */
  static async reorder(
    client: SupabaseClient,
    input: ReorderProjectsInput
  ): Promise<void> {
    // Validate input
    const validated = reorderProjectsSchema.parse(input);

    // Verify role exists
    const role = await roleQueries.getById(client, validated.role_id);
    if (!role) {
      throw new Error('Role not found');
    }

    // Verify all projects exist and belong to the specified role
    const projectIds = validated.items.map(item => item.id);
    const projects = await Promise.all(
      projectIds.map(id => projectQueries.getById(client, id))
    );

    const missingProjects = projects
      .map((project, index) => (project ? null : projectIds[index]))
      .filter(Boolean);

    if (missingProjects.length > 0) {
      throw new Error(`Projects not found: ${missingProjects.join(', ')}`);
    }

    // Verify all projects belong to the specified role
    const wrongRoleProjects = projects
      .filter(project => project && project.role_id !== validated.role_id)
      .map(project => project!.id);

    if (wrongRoleProjects.length > 0) {
      throw new Error(`Projects do not belong to the specified role: ${wrongRoleProjects.join(', ')}`);
    }

    // Update display orders
    await projectQueries.updateOrder(client, validated.items);
  }
}

/**
 * Workflow Stages Model
 * 
 * Business logic layer for Workflow Stages operations
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { WorkflowStage, CreateWorkflowStageData, UpdateWorkflowStageData } from '@/lib/types/database';
import { workflowStagesQueries } from '@/lib/supabase/queries';

/**
 * Validation schema for creating a workflow stage
 */
export const createWorkflowStageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
  icon: z.string().optional().or(z.literal('')),
});

/**
 * Validation schema for updating a workflow stage
 */
export const updateWorkflowStageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less').optional(),
  icon: z.string().optional().or(z.literal('')),
});

/**
 * Validation schema for reordering workflow stages
 */
export const reorderWorkflowStagesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('Invalid stage ID'),
      display_order: z.number().int().min(0, 'Display order must be non-negative'),
    })
  ).min(1, 'At least one item is required'),
});

export type CreateWorkflowStageInput = z.infer<typeof createWorkflowStageSchema>;
export type UpdateWorkflowStageInput = z.infer<typeof updateWorkflowStageSchema>;
export type ReorderWorkflowStagesInput = z.infer<typeof reorderWorkflowStagesSchema>;

/**
 * Workflow Stages Model Class
 * 
 * Provides CRUD operations and business logic for workflow stages
 */
export class WorkflowStagesModel {
  /**
   * Fetch all workflow stages
   * Ordered by display_order
   * 
   * Requirements: 5.1, 5.2
   */
  static async getAll(client: SupabaseClient): Promise<WorkflowStage[]> {
    return workflowStagesQueries.getAll(client);
  }

  /**
   * Fetch a single workflow stage by ID
   */
  static async getById(
    client: SupabaseClient,
    id: string
  ): Promise<WorkflowStage | null> {
    return workflowStagesQueries.getById(client, id);
  }

  /**
   * Create a new workflow stage
   * 
   * Validates data and sets display_order to max + 1
   * Requirements: 5.4
   */
  static async create(
    client: SupabaseClient,
    input: CreateWorkflowStageInput
  ): Promise<WorkflowStage> {
    // Validate input
    const validated = createWorkflowStageSchema.parse(input);

    // Get max display_order
    const allStages = await workflowStagesQueries.getAll(client);
    const maxOrder = allStages.length > 0
      ? Math.max(...allStages.map(s => s.display_order))
      : -1;

    // Prepare data for insertion
    const insertData = {
      title: validated.title,
      description: validated.description,
      icon: validated.icon || undefined,
      display_order: maxOrder + 1,
    };

    // Create workflow stage
    return workflowStagesQueries.create(client, insertData);
  }

  /**
   * Update an existing workflow stage
   * 
   * Validates data and updates database record
   * Requirements: 5.4
   */
  static async update(
    client: SupabaseClient,
    id: string,
    input: UpdateWorkflowStageInput
  ): Promise<WorkflowStage> {
    // Validate input
    const validated = updateWorkflowStageSchema.parse(input);

    // Check if stage exists
    const existingStage = await workflowStagesQueries.getById(client, id);
    if (!existingStage) {
      throw new Error('Workflow stage not found');
    }

    // Prepare update data
    const data: UpdateWorkflowStageData = { ...validated };

    // Update workflow stage
    return workflowStagesQueries.update(client, id, data);
  }

  /**
   * Delete a workflow stage
   * 
   * Requirements: 5.4
   */
  static async delete(
    client: SupabaseClient,
    id: string
  ): Promise<void> {
    // Check if stage exists
    const existingStage = await workflowStagesQueries.getById(client, id);
    if (!existingStage) {
      throw new Error('Workflow stage not found');
    }

    // Delete workflow stage
    await workflowStagesQueries.delete(client, id);
  }

  /**
   * Reorder workflow stages by updating display_order
   * 
   * Requirements: 5.4
   */
  static async reorder(
    client: SupabaseClient,
    input: ReorderWorkflowStagesInput
  ): Promise<void> {
    // Validate input
    const validated = reorderWorkflowStagesSchema.parse(input);

    // Verify all stages exist
    const stageIds = validated.items.map(item => item.id);
    const stages = await Promise.all(
      stageIds.map(id => workflowStagesQueries.getById(client, id))
    );

    const missingStages = stages
      .map((stage, index) => (stage ? null : stageIds[index]))
      .filter(Boolean);

    if (missingStages.length > 0) {
      throw new Error(`Workflow stages not found: ${missingStages.join(', ')}`);
    }

    // Update display orders
    await workflowStagesQueries.updateOrder(client, validated.items);
  }
}

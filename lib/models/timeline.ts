/**
 * Timeline Model
 * 
 * Business logic layer for Timeline Milestones operations
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { TimelineMilestone, CreateTimelineMilestoneData, UpdateTimelineMilestoneData } from '@/lib/types/database';
import { timelineMilestonesQueries } from '@/lib/supabase/queries';

/**
 * Validation schema for creating a timeline milestone
 */
export const createTimelineMilestoneSchema = z.object({
  year: z.number().int('Year must be an integer').min(1900, 'Year must be 1900 or later').max(2100, 'Year must be 2100 or earlier'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
});

/**
 * Validation schema for updating a timeline milestone
 */
export const updateTimelineMilestoneSchema = z.object({
  year: z.number().int('Year must be an integer').min(1900, 'Year must be 1900 or later').max(2100, 'Year must be 2100 or earlier').optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less').optional(),
});

/**
 * Validation schema for reordering timeline milestones
 */
export const reorderTimelineMilestonesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('Invalid milestone ID'),
      display_order: z.number().int().min(0, 'Display order must be non-negative'),
    })
  ).min(1, 'At least one item is required'),
});

export type CreateTimelineMilestoneInput = z.infer<typeof createTimelineMilestoneSchema>;
export type UpdateTimelineMilestoneInput = z.infer<typeof updateTimelineMilestoneSchema>;
export type ReorderTimelineMilestonesInput = z.infer<typeof reorderTimelineMilestonesSchema>;

/**
 * Timeline Model Class
 * 
 * Provides CRUD operations and business logic for timeline milestones
 */
export class TimelineModel {
  /**
   * Fetch all timeline milestones
   * Ordered by year descending (most recent first), then by display_order
   * 
   * Requirements: 9.1, 9.2
   */
  static async getAll(client: SupabaseClient): Promise<TimelineMilestone[]> {
    return timelineMilestonesQueries.getAll(client);
  }

  /**
   * Fetch a single timeline milestone by ID
   */
  static async getById(
    client: SupabaseClient,
    id: string
  ): Promise<TimelineMilestone | null> {
    return timelineMilestonesQueries.getById(client, id);
  }

  /**
   * Create a new timeline milestone
   * 
   * Validates data and sets display_order to max + 1 for the same year
   * Requirements: 9.1, 9.5
   */
  static async create(
    client: SupabaseClient,
    input: CreateTimelineMilestoneInput
  ): Promise<TimelineMilestone> {
    // Validate input
    const validated = createTimelineMilestoneSchema.parse(input);

    // Get all milestones to calculate display_order
    const allMilestones = await timelineMilestonesQueries.getAll(client);
    
    // Find milestones with the same year
    const sameYearMilestones = allMilestones.filter(m => m.year === validated.year);
    
    // Calculate max display_order for the same year
    const maxOrder = sameYearMilestones.length > 0
      ? Math.max(...sameYearMilestones.map(m => m.display_order))
      : -1;

    // Prepare data for insertion
    const insertData = {
      year: validated.year,
      title: validated.title,
      description: validated.description,
      display_order: maxOrder + 1,
    };

    // Create timeline milestone
    return timelineMilestonesQueries.create(client, insertData);
  }

  /**
   * Update an existing timeline milestone
   * 
   * Validates data and updates database record
   * Requirements: 9.3
   */
  static async update(
    client: SupabaseClient,
    id: string,
    input: UpdateTimelineMilestoneInput
  ): Promise<TimelineMilestone> {
    // Validate input
    const validated = updateTimelineMilestoneSchema.parse(input);

    // Check if milestone exists
    const existingMilestone = await timelineMilestonesQueries.getById(client, id);
    if (!existingMilestone) {
      throw new Error('Timeline milestone not found');
    }

    // Prepare update data
    const data: UpdateTimelineMilestoneData = { ...validated };

    // Update timeline milestone
    return timelineMilestonesQueries.update(client, id, data);
  }

  /**
   * Delete a timeline milestone
   * 
   * Requirements: 9.3
   */
  static async delete(
    client: SupabaseClient,
    id: string
  ): Promise<void> {
    // Check if milestone exists
    const existingMilestone = await timelineMilestonesQueries.getById(client, id);
    if (!existingMilestone) {
      throw new Error('Timeline milestone not found');
    }

    // Delete timeline milestone
    await timelineMilestonesQueries.delete(client, id);
  }

  /**
   * Reorder timeline milestones by updating display_order
   * 
   * Requirements: 9.3
   */
  static async reorder(
    client: SupabaseClient,
    input: ReorderTimelineMilestonesInput
  ): Promise<void> {
    // Validate input
    const validated = reorderTimelineMilestonesSchema.parse(input);

    // Verify all milestones exist
    const milestoneIds = validated.items.map(item => item.id);
    const milestones = await Promise.all(
      milestoneIds.map(id => timelineMilestonesQueries.getById(client, id))
    );

    const missingMilestones = milestones
      .map((milestone, index) => (milestone ? null : milestoneIds[index]))
      .filter(Boolean);

    if (missingMilestones.length > 0) {
      throw new Error(`Timeline milestones not found: ${missingMilestones.join(', ')}`);
    }

    // Update display orders
    await timelineMilestonesQueries.updateOrder(client, validated.items);
  }
}

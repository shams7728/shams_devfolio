/**
 * Impact Metrics Model
 * 
 * Business logic layer for Impact Metrics operations
 * Requirements: 3.1, 3.2, 3.4
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ImpactMetric, CreateImpactMetricData, UpdateImpactMetricData } from '@/lib/types/database';
import { impactMetricsQueries } from '@/lib/supabase/queries';

/**
 * Validation schema for creating an impact metric
 */
export const createImpactMetricSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  value: z.number().int('Value must be an integer').min(0, 'Value must be non-negative'),
  icon: z.string().optional().or(z.literal('')),
  is_published: z.boolean().optional().default(false),
});

/**
 * Validation schema for updating an impact metric
 */
export const updateImpactMetricSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less').optional(),
  value: z.number().int('Value must be an integer').min(0, 'Value must be non-negative').optional(),
  icon: z.string().optional().or(z.literal('')),
  is_published: z.boolean().optional(),
});

/**
 * Validation schema for reordering impact metrics
 */
export const reorderImpactMetricsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('Invalid metric ID'),
      display_order: z.number().int().min(0, 'Display order must be non-negative'),
    })
  ).min(1, 'At least one item is required'),
});

export type CreateImpactMetricInput = z.infer<typeof createImpactMetricSchema>;
export type UpdateImpactMetricInput = z.infer<typeof updateImpactMetricSchema>;
export type ReorderImpactMetricsInput = z.infer<typeof reorderImpactMetricsSchema>;

/**
 * Impact Metrics Model Class
 * 
 * Provides CRUD operations and business logic for impact metrics
 */
export class ImpactMetricsModel {
  /**
   * Fetch all impact metrics, optionally filtered by published status
   * Ordered by display_order
   * 
   * Requirements: 3.1
   */
  static async getAll(
    client: SupabaseClient,
    publishedOnly: boolean = false
  ): Promise<ImpactMetric[]> {
    return impactMetricsQueries.getAll(client, publishedOnly);
  }

  /**
   * Fetch a single impact metric by ID
   */
  static async getById(
    client: SupabaseClient,
    id: string
  ): Promise<ImpactMetric | null> {
    return impactMetricsQueries.getById(client, id);
  }

  /**
   * Create a new impact metric
   * 
   * Validates data and sets display_order to max + 1
   * Requirements: 3.1
   */
  static async create(
    client: SupabaseClient,
    input: CreateImpactMetricInput
  ): Promise<ImpactMetric> {
    // Validate input
    const validated = createImpactMetricSchema.parse(input);

    // Get max display_order
    const allMetrics = await impactMetricsQueries.getAll(client, false);
    const maxOrder = allMetrics.length > 0
      ? Math.max(...allMetrics.map(m => m.display_order))
      : -1;

    // Prepare data for insertion
    const insertData = {
      title: validated.title,
      value: validated.value,
      icon: validated.icon || undefined,
      is_published: validated.is_published ?? false,
      display_order: maxOrder + 1,
    };

    // Create impact metric
    return impactMetricsQueries.create(client, insertData);
  }

  /**
   * Update an existing impact metric
   * 
   * Validates data and updates database record
   * Requirements: 3.2
   */
  static async update(
    client: SupabaseClient,
    id: string,
    input: UpdateImpactMetricInput
  ): Promise<ImpactMetric> {
    // Validate input
    const validated = updateImpactMetricSchema.parse(input);

    // Check if metric exists
    const existingMetric = await impactMetricsQueries.getById(client, id);
    if (!existingMetric) {
      throw new Error('Impact metric not found');
    }

    // Prepare update data
    const data: UpdateImpactMetricData = { ...validated };

    // Update impact metric
    return impactMetricsQueries.update(client, id, data);
  }

  /**
   * Delete an impact metric
   * 
   * Requirements: 3.4
   */
  static async delete(
    client: SupabaseClient,
    id: string
  ): Promise<void> {
    // Check if metric exists
    const existingMetric = await impactMetricsQueries.getById(client, id);
    if (!existingMetric) {
      throw new Error('Impact metric not found');
    }

    // Delete impact metric
    await impactMetricsQueries.delete(client, id);
  }

  /**
   * Reorder impact metrics by updating display_order
   * 
   * Requirements: 3.4
   */
  static async reorder(
    client: SupabaseClient,
    input: ReorderImpactMetricsInput
  ): Promise<void> {
    // Validate input
    const validated = reorderImpactMetricsSchema.parse(input);

    // Verify all metrics exist
    const metricIds = validated.items.map(item => item.id);
    const metrics = await Promise.all(
      metricIds.map(id => impactMetricsQueries.getById(client, id))
    );

    const missingMetrics = metrics
      .map((metric, index) => (metric ? null : metricIds[index]))
      .filter(Boolean);

    if (missingMetrics.length > 0) {
      throw new Error(`Impact metrics not found: ${missingMetrics.join(', ')}`);
    }

    // Update display orders
    await impactMetricsQueries.updateOrder(client, validated.items);
  }
}

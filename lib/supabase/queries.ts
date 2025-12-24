/**
 * Type-Safe Database Query Helpers
 * 
 * These helpers provide a consistent interface for database operations
 * with proper error handling and type safety.
 * 
 * Requirements: 3.2, 12.1
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Role, Project, User, ImpactMetric, WorkflowStage, TimelineMilestone } from '@/lib/types/database';
import { handleSupabaseError } from './errors';

// Use a more flexible type that doesn't enforce strict Database schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientType = SupabaseClient<any>;

/**
 * Role Queries
 */
export const roleQueries = {
  /**
   * Fetch all roles, optionally filtered by published status
   * Ordered by display_order ascending
   */
  async getAll(
    client: SupabaseClientType,
    publishedOnly: boolean = false
  ): Promise<Role[]> {
    let query = client
      .from('roles')
      .select('*')
      .order('display_order', { ascending: true });

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch roles');
    }

    return data || [];
  },

  /**
   * Fetch a single role by ID
   */
  async getById(client: SupabaseClientType, id: string): Promise<Role | null> {
    const { data, error } = await client
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch role');
    }

    return data;
  },

  /**
   * Fetch a single role by slug
   */
  async getBySlug(
    client: SupabaseClientType,
    slug: string
  ): Promise<Role | null> {
    const { data, error } = await client
      .from('roles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch role');
    }

    return data;
  },

  /**
   * Create a new role
   */
  async create(
    client: SupabaseClientType,
    data: Database['public']['Tables']['roles']['Insert']
  ): Promise<Role> {
    const { data: role, error } = await client
      .from('roles')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to create role');
    }

    return role as Role;
  },

  /**
   * Update an existing role
   */
  async update(
    client: SupabaseClientType,
    id: string,
    data: Database['public']['Tables']['roles']['Update']
  ): Promise<Role> {
    const { data: role, error } = await client
      .from('roles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to update role');
    }

    return role as Role;
  },

  /**
   * Delete a role
   */
  async delete(client: SupabaseClientType, id: string): Promise<void> {
    const { error } = await client.from('roles').delete().eq('id', id);

    if (error) {
      throw handleSupabaseError(error, 'Failed to delete role');
    }
  },

  /**
   * Update display order for multiple roles
   */
  async updateOrder(
    client: SupabaseClientType,
    updates: { id: string; display_order: number }[]
  ): Promise<void> {
    const promises = updates.map(({ id, display_order }) =>
      client.from('roles').update({ display_order }).eq('id', id)
    );

    const results = await Promise.all(promises);

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw handleSupabaseError(
        errors[0].error!,
        'Failed to update role order'
      );
    }
  },
};

/**
 * Project Queries
 */
export const projectQueries = {
  /**
   * Fetch all projects for a specific role
   * Ordered by display_order ascending
   */
  async getByRole(
    client: SupabaseClientType,
    roleId: string,
    publishedOnly: boolean = false
  ): Promise<Project[]> {
    let query = client
      .from('projects')
      .select('*')
      .eq('role_id', roleId)
      .order('display_order', { ascending: true });

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch projects');
    }

    return data || [];
  },

  /**
   * Fetch a single project by ID
   */
  async getById(
    client: SupabaseClientType,
    id: string
  ): Promise<Project | null> {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch project');
    }

    return data;
  },

  /**
   * Fetch a project with its associated role
   */
  async getByIdWithRole(
    client: SupabaseClientType,
    id: string
  ): Promise<(Project & { role: Role }) | null> {
    const { data, error } = await client
      .from('projects')
      .select('*, role:roles(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch project with role');
    }

    return data as Project & { role: Role };
  },

  /**
   * Create a new project
   */
  async create(
    client: SupabaseClientType,
    data: Database['public']['Tables']['projects']['Insert']
  ): Promise<Project> {
    const { data: project, error } = await client
      .from('projects')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to create project');
    }

    return project as Project;
  },

  /**
   * Update an existing project
   */
  async update(
    client: SupabaseClientType,
    id: string,
    data: Database['public']['Tables']['projects']['Update']
  ): Promise<Project> {
    const { data: project, error } = await client
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to update project');
    }

    return project as Project;
  },

  /**
   * Delete a project
   */
  async delete(client: SupabaseClientType, id: string): Promise<void> {
    const { error } = await client.from('projects').delete().eq('id', id);

    if (error) {
      throw handleSupabaseError(error, 'Failed to delete project');
    }
  },

  /**
   * Update display order for multiple projects within a role
   */
  async updateOrder(
    client: SupabaseClientType,
    updates: { id: string; display_order: number }[]
  ): Promise<void> {
    const promises = updates.map(({ id, display_order }) =>
      client.from('projects').update({ display_order }).eq('id', id)
    );

    const results = await Promise.all(promises);

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw handleSupabaseError(
        errors[0].error!,
        'Failed to update project order'
      );
    }
  },
};

/**
 * User Queries
 */
export const userQueries = {
  /**
   * Fetch all users
   */
  async getAll(client: SupabaseClientType): Promise<User[]> {
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch users');
    }

    return data || [];
  },

  /**
   * Fetch a single user by ID
   */
  async getById(client: SupabaseClientType, id: string): Promise<User | null> {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch user');
    }

    return data;
  },

  /**
   * Create a new user
   */
  async create(
    client: SupabaseClientType,
    data: Database['public']['Tables']['users']['Insert']
  ): Promise<User> {
    const { data: user, error } = await client
      .from('users')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to create user');
    }

    return user as User;
  },

  /**
   * Update an existing user
   */
  async update(
    client: SupabaseClientType,
    id: string,
    data: Database['public']['Tables']['users']['Update']
  ): Promise<User> {
    const { data: user, error } = await client
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to update user');
    }

    return user as User;
  },

  /**
   * Delete a user
   */
  async delete(client: SupabaseClientType, id: string): Promise<void> {
    const { error } = await client.from('users').delete().eq('id', id);

    if (error) {
      throw handleSupabaseError(error, 'Failed to delete user');
    }
  },
};

/**
 * Impact Metrics Queries
 */
export const impactMetricsQueries = {
  /**
   * Fetch all impact metrics, optionally filtered by published status
   * Ordered by display_order ascending
   */
  async getAll(
    client: SupabaseClientType,
    publishedOnly: boolean = false
  ): Promise<ImpactMetric[]> {
    let query = client
      .from('impact_metrics')
      .select('*')
      .order('display_order', { ascending: true });

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch impact metrics');
    }

    return data || [];
  },

  /**
   * Fetch a single impact metric by ID
   */
  async getById(
    client: SupabaseClientType,
    id: string
  ): Promise<ImpactMetric | null> {
    const { data, error } = await client
      .from('impact_metrics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch impact metric');
    }

    return data;
  },

  /**
   * Create a new impact metric
   */
  async create(
    client: SupabaseClientType,
    data: Database['public']['Tables']['impact_metrics']['Insert']
  ): Promise<ImpactMetric> {
    const { data: metric, error } = await client
      .from('impact_metrics')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to create impact metric');
    }

    return metric as ImpactMetric;
  },

  /**
   * Update an existing impact metric
   */
  async update(
    client: SupabaseClientType,
    id: string,
    data: Database['public']['Tables']['impact_metrics']['Update']
  ): Promise<ImpactMetric> {
    const { data: metric, error } = await client
      .from('impact_metrics')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to update impact metric');
    }

    return metric as ImpactMetric;
  },

  /**
   * Delete an impact metric
   */
  async delete(client: SupabaseClientType, id: string): Promise<void> {
    const { error } = await client
      .from('impact_metrics')
      .delete()
      .eq('id', id);

    if (error) {
      throw handleSupabaseError(error, 'Failed to delete impact metric');
    }
  },

  /**
   * Update display order for multiple impact metrics
   */
  async updateOrder(
    client: SupabaseClientType,
    updates: { id: string; display_order: number }[]
  ): Promise<void> {
    const promises = updates.map(({ id, display_order }) =>
      client.from('impact_metrics').update({ display_order }).eq('id', id)
    );

    const results = await Promise.all(promises);

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw handleSupabaseError(
        errors[0].error!,
        'Failed to update impact metrics order'
      );
    }
  },
};

/**
 * Workflow Stages Queries
 */
export const workflowStagesQueries = {
  /**
   * Fetch all workflow stages
   * Ordered by display_order ascending
   */
  async getAll(client: SupabaseClientType): Promise<WorkflowStage[]> {
    const { data, error } = await client
      .from('workflow_stages')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch workflow stages');
    }

    return data || [];
  },

  /**
   * Fetch a single workflow stage by ID
   */
  async getById(
    client: SupabaseClientType,
    id: string
  ): Promise<WorkflowStage | null> {
    const { data, error } = await client
      .from('workflow_stages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch workflow stage');
    }

    return data;
  },

  /**
   * Create a new workflow stage
   */
  async create(
    client: SupabaseClientType,
    data: Database['public']['Tables']['workflow_stages']['Insert']
  ): Promise<WorkflowStage> {
    const { data: stage, error } = await client
      .from('workflow_stages')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to create workflow stage');
    }

    return stage as WorkflowStage;
  },

  /**
   * Update an existing workflow stage
   */
  async update(
    client: SupabaseClientType,
    id: string,
    data: Database['public']['Tables']['workflow_stages']['Update']
  ): Promise<WorkflowStage> {
    const { data: stage, error } = await client
      .from('workflow_stages')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to update workflow stage');
    }

    return stage as WorkflowStage;
  },

  /**
   * Delete a workflow stage
   */
  async delete(client: SupabaseClientType, id: string): Promise<void> {
    const { error } = await client
      .from('workflow_stages')
      .delete()
      .eq('id', id);

    if (error) {
      throw handleSupabaseError(error, 'Failed to delete workflow stage');
    }
  },

  /**
   * Update display order for multiple workflow stages
   */
  async updateOrder(
    client: SupabaseClientType,
    updates: { id: string; display_order: number }[]
  ): Promise<void> {
    const promises = updates.map(({ id, display_order }) =>
      client.from('workflow_stages').update({ display_order }).eq('id', id)
    );

    const results = await Promise.all(promises);

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw handleSupabaseError(
        errors[0].error!,
        'Failed to update workflow stages order'
      );
    }
  },
};

/**
 * Timeline Milestones Queries
 */
export const timelineMilestonesQueries = {
  /**
   * Fetch all timeline milestones
   * Ordered by year descending (most recent first), then by display_order ascending
   */
  async getAll(client: SupabaseClientType): Promise<TimelineMilestone[]> {
    const { data, error } = await client
      .from('timeline_milestones')
      .select('*')
      .order('year', { ascending: false })
      .order('display_order', { ascending: true });

    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch timeline milestones');
    }

    return data || [];
  },

  /**
   * Fetch a single timeline milestone by ID
   */
  async getById(
    client: SupabaseClientType,
    id: string
  ): Promise<TimelineMilestone | null> {
    const { data, error } = await client
      .from('timeline_milestones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw handleSupabaseError(error, 'Failed to fetch timeline milestone');
    }

    return data;
  },

  /**
   * Create a new timeline milestone
   */
  async create(
    client: SupabaseClientType,
    data: Database['public']['Tables']['timeline_milestones']['Insert']
  ): Promise<TimelineMilestone> {
    const { data: milestone, error } = await client
      .from('timeline_milestones')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to create timeline milestone');
    }

    return milestone as TimelineMilestone;
  },

  /**
   * Update an existing timeline milestone
   */
  async update(
    client: SupabaseClientType,
    id: string,
    data: Database['public']['Tables']['timeline_milestones']['Update']
  ): Promise<TimelineMilestone> {
    const { data: milestone, error } = await client
      .from('timeline_milestones')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'Failed to update timeline milestone');
    }

    return milestone as TimelineMilestone;
  },

  /**
   * Delete a timeline milestone
   */
  async delete(client: SupabaseClientType, id: string): Promise<void> {
    const { error } = await client
      .from('timeline_milestones')
      .delete()
      .eq('id', id);

    if (error) {
      throw handleSupabaseError(error, 'Failed to delete timeline milestone');
    }
  },

  /**
   * Update display order for multiple timeline milestones
   */
  async updateOrder(
    client: SupabaseClientType,
    updates: { id: string; display_order: number }[]
  ): Promise<void> {
    const promises = updates.map(({ id, display_order }) =>
      client.from('timeline_milestones').update({ display_order }).eq('id', id)
    );

    const results = await Promise.all(promises);

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw handleSupabaseError(
        errors[0].error!,
        'Failed to update timeline milestones order'
      );
    }
  },
};

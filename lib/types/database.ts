/**
 * Database Types
 * 
 * TypeScript interfaces matching the Supabase database schema.
 * These types ensure type safety when working with database records.
 */

export interface User {
  id: string; // UUID
  email: string;
  role: 'super_admin' | 'admin';
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Role {
  id: string; // UUID
  title: string;
  description: string;
  slug: string;
  icon_url?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Project {
  id: string; // UUID
  role_id: string; // UUID
  title: string;
  short_description: string;
  long_description: string;
  tech_stack: string[];
  github_url?: string | null;
  live_url?: string | null;
  cover_image_url: string;
  gallery_urls: string[];
  is_published: boolean;
  display_order: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Form data types (for creating/updating records)

export interface CreateRoleData {
  title: string;
  description: string;
  slug: string;
  icon_url?: string;
  is_published?: boolean;
  display_order?: number;
}

export interface UpdateRoleData {
  title?: string;
  description?: string;
  slug?: string;
  icon_url?: string;
  is_published?: boolean;
  display_order?: number;
}

export interface CreateProjectData {
  role_id: string;
  title: string;
  short_description: string;
  long_description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  cover_image_url: string;
  gallery_urls?: string[];
  is_published?: boolean;
  display_order?: number;
}

export interface UpdateProjectData {
  role_id?: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  tech_stack?: string[];
  github_url?: string;
  live_url?: string;
  cover_image_url?: string;
  gallery_urls?: string[];
  is_published?: boolean;
  display_order?: number;
}

export interface CreateUserData {
  id: string; // Must match auth.users.id
  email: string;
  role: 'super_admin' | 'admin';
}

export interface UpdateUserData {
  email?: string;
  role?: 'super_admin' | 'admin';
}

// Advanced Features Types

export interface ImpactMetric {
  id: string; // UUID
  title: string;
  value: number;
  icon?: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface TimelineMilestone {
  id: string; // UUID
  year: number;
  title: string;
  description: string;
  display_order: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ContactMessage {
  id: string; // UUID
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string; // ISO timestamp
}

export interface ThemeSettings {
  id: string; // UUID
  accent_color: string; // Hex color
  animation_speed: number; // 0.5 - 2.0
  default_theme: 'light' | 'dark' | 'system';
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface RoleBackground {
  id: string; // UUID
  role_id: string; // UUID
  animation_type: 'data-grid' | 'code-lines' | 'ui-components' | 'database-shapes' | 'custom';
  config: Record<string, any>; // JSON configuration
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface WorkflowStage {
  id: string; // UUID
  title: string;
  description: string;
  icon?: string | null;
  display_order: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Form data types for advanced features

export interface CreateImpactMetricData {
  title: string;
  value: number;
  icon?: string;
  display_order?: number;
  is_published?: boolean;
}

export interface UpdateImpactMetricData {
  title?: string;
  value?: number;
  icon?: string;
  display_order?: number;
  is_published?: boolean;
}

export interface CreateTimelineMilestoneData {
  year: number;
  title: string;
  description: string;
  display_order?: number;
}

export interface UpdateTimelineMilestoneData {
  year?: number;
  title?: string;
  description?: string;
  display_order?: number;
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  message: string;
}

export interface UpdateContactMessageData {
  status?: 'new' | 'read' | 'archived';
}

export interface UpdateThemeSettingsData {
  accent_color?: string;
  animation_speed?: number;
  default_theme?: 'light' | 'dark' | 'system';
}

export interface CreateRoleBackgroundData {
  role_id: string;
  animation_type: 'data-grid' | 'code-lines' | 'ui-components' | 'database-shapes' | 'custom';
  config?: Record<string, any>;
}

export interface UpdateRoleBackgroundData {
  animation_type?: 'data-grid' | 'code-lines' | 'ui-components' | 'database-shapes' | 'custom';
  config?: Record<string, any>;
}

export interface CreateWorkflowStageData {
  title: string;
  description: string;
  icon?: string;
  display_order?: number;
}

export interface UpdateWorkflowStageData {
  title?: string;
  description?: string;
  icon?: string;
  display_order?: number;
}

// Extended types with relationships

export interface ProjectWithRole extends Project {
  role: Role;
}

export interface RoleWithProjects extends Role {
  projects: Project[];
}

export interface RoleWithBackground extends Role {
  background?: RoleBackground | null;
}


export interface SkillCategory {
  id: string; // UUID
  title: string;
  slug: string;
  display_order: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Skill {
  id: string; // UUID
  category_id: string; // UUID
  name: string;
  icon?: string | null;
  display_order: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Form data types for skills
export interface CreateSkillCategoryData {
  title: string;
  slug: string;
  display_order?: number;
}

export interface UpdateSkillCategoryData {
  title?: string;
  slug?: string;
  display_order?: number;
}

export interface CreateSkillData {
  category_id: string;
  name: string;
  icon?: string;
  display_order?: number;
}

export interface UpdateSkillData {
  category_id?: string;
  name?: string;
  icon?: string;
  display_order?: number;
}

export interface SkillWithCategory extends Skill {
  category: SkillCategory;
}

export interface CategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

// Supabase Database type (for type-safe queries)

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      roles: {
        Row: Role;
        Insert: Omit<Role, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Role, 'id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      impact_metrics: {
        Row: ImpactMetric;
        Insert: Omit<ImpactMetric, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ImpactMetric, 'id' | 'created_at' | 'updated_at'>>;
      };
      timeline_milestones: {
        Row: TimelineMilestone;
        Insert: Omit<TimelineMilestone, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TimelineMilestone, 'id' | 'created_at' | 'updated_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>;
      };
      theme_settings: {
        Row: ThemeSettings;
        Insert: Omit<ThemeSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ThemeSettings, 'id' | 'created_at' | 'updated_at'>>;
      };
      role_backgrounds: {
        Row: RoleBackground;
        Insert: Omit<RoleBackground, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RoleBackground, 'id' | 'created_at' | 'updated_at'>>;
      };
      workflow_stages: {
        Row: WorkflowStage;
        Insert: Omit<WorkflowStage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WorkflowStage, 'id' | 'created_at' | 'updated_at'>>;
      };
      skill_categories: {
        Row: SkillCategory;
        Insert: Omit<SkillCategory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SkillCategory, 'id' | 'created_at' | 'updated_at'>>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

/**
 * Theme Settings Model
 * 
 * Business logic layer for Theme Settings operations
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Theme Settings interface
 */
export interface ThemeSettings {
  id: string;
  accent_color: string;
  animation_speed: number;
  default_theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

/**
 * Validation schema for updating theme settings
 */
export const updateThemeSettingsSchema = z.object({
  accent_color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Accent color must be a valid hex color (e.g., #3b82f6)')
    .optional(),
  animation_speed: z.number()
    .min(0.5, 'Animation speed must be at least 0.5')
    .max(2.0, 'Animation speed must be at most 2.0')
    .optional(),
  default_theme: z.enum(['light', 'dark', 'system']).optional(),
});

export type UpdateThemeSettingsInput = z.infer<typeof updateThemeSettingsSchema>;

/**
 * Theme Settings Model Class
 * 
 * Provides get/update operations for theme settings (single row table)
 */
export class ThemeSettingsModel {
  /**
   * Fetch the current theme settings
   * 
   * Requirements: 12.1
   */
  static async get(client: SupabaseClient): Promise<ThemeSettings> {
    const { data, error } = await client
      .from('theme_settings')
      .select('*')
      .single();

    if (error) {
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        return this.createDefault(client);
      }
      throw new Error(`Failed to fetch theme settings: ${error.message}`);
    }

    return data as ThemeSettings;
  }

  /**
   * Update theme settings
   * 
   * Validates data and updates the single row
   * Requirements: 12.2, 12.3, 12.4
   */
  static async update(
    client: SupabaseClient,
    input: UpdateThemeSettingsInput
  ): Promise<ThemeSettings> {
    // Validate input
    const validated = updateThemeSettingsSchema.parse(input);

    // Get current settings to ensure row exists
    const currentSettings = await this.get(client);

    // Update theme settings
    const { data, error } = await client
      .from('theme_settings')
      .update(validated)
      .eq('id', currentSettings.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update theme settings: ${error.message}`);
    }

    return data as ThemeSettings;
  }

  /**
   * Create default theme settings
   * 
   * Internal method to initialize default settings if none exist
   */
  private static async createDefault(client: SupabaseClient): Promise<ThemeSettings> {
    const defaultSettings = {
      accent_color: '#3b82f6',
      animation_speed: 1.0,
      default_theme: 'system' as const,
    };

    const { data, error } = await client
      .from('theme_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create default theme settings: ${error.message}`);
    }

    return data as ThemeSettings;
  }
}

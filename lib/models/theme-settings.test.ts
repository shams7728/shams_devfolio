/**
 * Theme Settings Model Tests
 * 
 * Unit tests for theme settings model
 */

import { describe, it, expect } from 'vitest';
import { updateThemeSettingsSchema } from './theme-settings';

describe('ThemeSettingsModel', () => {
  describe('updateThemeSettingsSchema', () => {
    it('should validate valid accent color', () => {
      const result = updateThemeSettingsSchema.safeParse({
        accent_color: '#3b82f6',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid accent color format', () => {
      const result = updateThemeSettingsSchema.safeParse({
        accent_color: 'blue',
      });
      expect(result.success).toBe(false);
    });

    it('should reject accent color without #', () => {
      const result = updateThemeSettingsSchema.safeParse({
        accent_color: '3b82f6',
      });
      expect(result.success).toBe(false);
    });

    it('should validate valid animation speed', () => {
      const result = updateThemeSettingsSchema.safeParse({
        animation_speed: 1.5,
      });
      expect(result.success).toBe(true);
    });

    it('should reject animation speed below 0.5', () => {
      const result = updateThemeSettingsSchema.safeParse({
        animation_speed: 0.3,
      });
      expect(result.success).toBe(false);
    });

    it('should reject animation speed above 2.0', () => {
      const result = updateThemeSettingsSchema.safeParse({
        animation_speed: 2.5,
      });
      expect(result.success).toBe(false);
    });

    it('should validate valid default theme', () => {
      const result = updateThemeSettingsSchema.safeParse({
        default_theme: 'dark',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid default theme', () => {
      const result = updateThemeSettingsSchema.safeParse({
        default_theme: 'blue',
      });
      expect(result.success).toBe(false);
    });

    it('should validate all fields together', () => {
      const result = updateThemeSettingsSchema.safeParse({
        accent_color: '#ff5733',
        animation_speed: 1.2,
        default_theme: 'system',
      });
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const result = updateThemeSettingsSchema.safeParse({
        accent_color: '#ff5733',
      });
      expect(result.success).toBe(true);
    });
  });
});

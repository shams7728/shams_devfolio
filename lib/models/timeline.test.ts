/**
 * Timeline Model Tests
 * 
 * Tests for Timeline Model CRUD operations
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import { describe, it, expect } from 'vitest';
import { TimelineModel, createTimelineMilestoneSchema, updateTimelineMilestoneSchema } from './timeline';

describe('Timeline Model Validation', () => {
  describe('createTimelineMilestoneSchema', () => {
    it('should validate a valid timeline milestone', () => {
      const validData = {
        year: 2023,
        title: 'Started New Role',
        description: 'Joined the company as a senior developer',
      };

      const result = createTimelineMilestoneSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject year below 1900', () => {
      const invalidData = {
        year: 1899,
        title: 'Too Old',
        description: 'This year is too old',
      };

      const result = createTimelineMilestoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject year above 2100', () => {
      const invalidData = {
        year: 2101,
        title: 'Too Future',
        description: 'This year is too far in the future',
      };

      const result = createTimelineMilestoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty title', () => {
      const invalidData = {
        year: 2023,
        title: '',
        description: 'Valid description',
      };

      const result = createTimelineMilestoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty description', () => {
      const invalidData = {
        year: 2023,
        title: 'Valid Title',
        description: '',
      };

      const result = createTimelineMilestoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 100 characters', () => {
      const invalidData = {
        year: 2023,
        title: 'a'.repeat(101),
        description: 'Valid description',
      };

      const result = createTimelineMilestoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 500 characters', () => {
      const invalidData = {
        year: 2023,
        title: 'Valid Title',
        description: 'a'.repeat(501),
      };

      const result = createTimelineMilestoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateTimelineMilestoneSchema', () => {
    it('should validate partial updates', () => {
      const validData = {
        title: 'Updated Title',
      };

      const result = updateTimelineMilestoneSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate empty object (no updates)', () => {
      const validData = {};

      const result = updateTimelineMilestoneSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid year in update', () => {
      const invalidData = {
        year: 1800,
      };

      const result = updateTimelineMilestoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

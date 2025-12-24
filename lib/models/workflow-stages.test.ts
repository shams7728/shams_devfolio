/**
 * Workflow Stages Model Tests
 * 
 * Unit tests for Workflow Stages model validation and business logic
 * Requirements: 5.4
 */

import { describe, it, expect } from 'vitest';
import {
  createWorkflowStageSchema,
  updateWorkflowStageSchema,
  reorderWorkflowStagesSchema,
} from './workflow-stages';

describe('Workflow Stages Model', () => {
  describe('createWorkflowStageSchema', () => {
    it('should validate valid workflow stage creation data', () => {
      const validData = {
        title: 'Understand',
        description: 'Gather requirements and understand the problem space',
        icon: '🔍',
      };

      const result = createWorkflowStageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept workflow stage without icon', () => {
      const validData = {
        title: 'Analyze',
        description: 'Analyze data and identify patterns',
      };

      const result = createWorkflowStageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        description: 'Some description',
      };

      const result = createWorkflowStageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 100 characters', () => {
      const invalidData = {
        title: 'a'.repeat(101),
        description: 'Some description',
      };

      const result = createWorkflowStageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty description', () => {
      const invalidData = {
        title: 'Design',
        description: '',
      };

      const result = createWorkflowStageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 500 characters', () => {
      const invalidData = {
        title: 'Build',
        description: 'a'.repeat(501),
      };

      const result = createWorkflowStageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateWorkflowStageSchema', () => {
    it('should validate valid workflow stage update data', () => {
      const validData = {
        title: 'Updated Title',
        description: 'Updated description',
        icon: '✨',
      };

      const result = updateWorkflowStageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const validData = {
        title: 'New Title',
      };

      const result = updateWorkflowStageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow empty update object', () => {
      const validData = {};

      const result = updateWorkflowStageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid title in update', () => {
      const invalidData = {
        title: '',
      };

      const result = updateWorkflowStageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid description in update', () => {
      const invalidData = {
        description: '',
      };

      const result = updateWorkflowStageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('reorderWorkflowStagesSchema', () => {
    it('should validate valid reorder data', () => {
      const validData = {
        items: [
          { id: '123e4567-e89b-12d3-a456-426614174000', display_order: 0 },
          { id: '123e4567-e89b-12d3-a456-426614174001', display_order: 1 },
          { id: '123e4567-e89b-12d3-a456-426614174002', display_order: 2 },
        ],
      };

      const result = reorderWorkflowStagesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty items array', () => {
      const invalidData = {
        items: [],
      };

      const result = reorderWorkflowStagesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID', () => {
      const invalidData = {
        items: [{ id: 'not-a-uuid', display_order: 0 }],
      };

      const result = reorderWorkflowStagesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative display_order', () => {
      const invalidData = {
        items: [
          { id: '123e4567-e89b-12d3-a456-426614174000', display_order: -1 },
        ],
      };

      const result = reorderWorkflowStagesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-integer display_order', () => {
      const invalidData = {
        items: [
          { id: '123e4567-e89b-12d3-a456-426614174000', display_order: 1.5 },
        ],
      };

      const result = reorderWorkflowStagesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

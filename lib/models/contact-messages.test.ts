/**
 * Contact Messages Model Tests
 * 
 * Unit tests for Contact Messages model validation and business logic
 * Requirements: 11.4
 */

import { describe, it, expect } from 'vitest';
import { createContactMessageSchema, updateContactMessageSchema } from './contact-messages';

describe('Contact Messages Model', () => {
  describe('createContactMessageSchema', () => {
    it('should validate valid contact message data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with enough characters.',
      };

      const result = createContactMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const result = createContactMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const result = createContactMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        message: 'This is a test message.',
      };

      const result = createContactMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject email longer than 255 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'a'.repeat(250) + '@example.com',
        message: 'This is a test message.',
      };

      const result = createContactMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject message shorter than 10 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      };

      const result = createContactMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject message longer than 2000 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'a'.repeat(2001),
      };

      const result = createContactMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept message with exactly 10 characters', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '1234567890',
      };

      const result = createContactMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept message with exactly 2000 characters', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'a'.repeat(2000),
      };

      const result = createContactMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('updateContactMessageSchema', () => {
    it('should validate valid status update', () => {
      const validData = {
        status: 'read' as const,
      };

      const result = updateContactMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept "new" status', () => {
      const validData = {
        status: 'new' as const,
      };

      const result = updateContactMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept "archived" status', () => {
      const validData = {
        status: 'archived' as const,
      };

      const result = updateContactMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        status: 'invalid_status',
      };

      const result = updateContactMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

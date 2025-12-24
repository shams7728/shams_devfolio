/**
 * User Model Tests
 * 
 * Unit tests for User model validation and business logic
 * Requirements: 3.4
 */

import { describe, it, expect } from 'vitest';
import { createUserSchema, updateUserSchema } from './user';

describe('User Model', () => {
  describe('createUserSchema', () => {
    it('should validate valid user creation data', () => {
      const validData = {
        email: 'admin@example.com',
        password: 'securepassword123',
        role: 'admin' as const,
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'securepassword123',
        role: 'admin' as const,
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'admin@example.com',
        password: 'short',
        role: 'admin' as const,
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const invalidData = {
        email: 'admin@example.com',
        password: 'securepassword123',
        role: 'invalid_role',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept super_admin role', () => {
      const validData = {
        email: 'superadmin@example.com',
        password: 'securepassword123',
        role: 'super_admin' as const,
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('updateUserSchema', () => {
    it('should validate valid user update data', () => {
      const validData = {
        email: 'newemail@example.com',
        role: 'super_admin' as const,
      };

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const validData = {
        role: 'admin' as const,
      };

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email in update', () => {
      const invalidData = {
        email: 'not-an-email',
      };

      const result = updateUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid role in update', () => {
      const invalidData = {
        role: 'invalid_role',
      };

      const result = updateUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow empty update object', () => {
      const validData = {};

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});

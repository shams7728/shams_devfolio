/**
 * Supabase Error Handling
 * 
 * Provides consistent error handling and user-friendly error messages
 * for Supabase operations.
 * 
 * Requirements: 3.2, 12.1
 */

import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Custom error class for Supabase operations
 */
export class SupabaseError extends Error {
  code: string;
  details: string;
  hint: string;
  originalError: PostgrestError;

  constructor(error: PostgrestError, context?: string) {
    const message = context
      ? `${context}: ${error.message}`
      : error.message;
    
    super(message);
    this.name = 'SupabaseError';
    this.code = error.code;
    this.details = error.details || '';
    this.hint = error.hint || '';
    this.originalError = error;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupabaseError);
    }
  }
}

/**
 * Handle Supabase errors and convert them to user-friendly messages
 */
export function handleSupabaseError(
  error: PostgrestError,
  context?: string
): SupabaseError {
  // Map common PostgreSQL error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    // Unique constraint violation
    '23505': 'A record with this value already exists',
    
    // Foreign key violation
    '23503': 'Referenced record does not exist',
    
    // Not null violation
    '23502': 'Required field is missing',
    
    // Check constraint violation
    '23514': 'Invalid value provided',
    
    // RLS policy violation
    '42501': 'Insufficient permissions to perform this operation',
    
    // Record not found (PostgREST specific)
    'PGRST116': 'Record not found',
  };

  const userMessage = errorMessages[error.code] || error.message;
  const contextMessage = context ? `${context}: ${userMessage}` : userMessage;

  const supabaseError = new SupabaseError(error, context);
  supabaseError.message = contextMessage;

  return supabaseError;
}

/**
 * Check if an error is a Supabase error
 */
export function isSupabaseError(error: unknown): error is SupabaseError {
  return error instanceof SupabaseError;
}

/**
 * Extract user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (isSupabaseError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Log error with context for debugging
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(context ? `[${context}]` : '[Error]', error);
  }

  // In production, you might want to send errors to a monitoring service
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Wrap async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logError(error, context);
    throw error;
  }
}

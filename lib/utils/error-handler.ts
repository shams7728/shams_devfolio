/**
 * Error Handling Utilities
 * 
 * Provides standardized error handling and user-friendly error messages
 * for both client and server-side code.
 */

import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

/**
 * Convert errors to user-friendly messages
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Handle common error patterns
    if (error.message.includes('fetch failed')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (error.message.includes('ECONNREFUSED')) {
      return 'Unable to connect to the server. Please try again later.';
    }
    
    // Return the error message if it's already user-friendly
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle API route errors and return appropriate NextResponse
 */
export function handleApiError(error: unknown): NextResponse {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code 
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors (e.g., from Zod)
  if (error && typeof error === 'object' && 'issues' in error) {
    return NextResponse.json(
      { 
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.issues 
      },
      { status: 400 }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string };
    
    // Map common Supabase error codes to user-friendly messages
    const errorMap: Record<string, { message: string; status: number }> = {
      '23505': { message: 'A record with this value already exists', status: 409 },
      '23503': { message: 'Referenced record does not exist', status: 400 },
      '23502': { message: 'Required field is missing', status: 400 },
      '42501': { message: 'Insufficient permissions', status: 403 },
      'PGRST116': { message: 'Record not found', status: 404 },
    };

    const mapped = errorMap[supabaseError.code];
    if (mapped) {
      return NextResponse.json(
        { error: mapped.message, code: supabaseError.code },
        { status: mapped.status }
      );
    }
  }

  // Generic error response
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return NextResponse.json(
    { 
      error: getUserFriendlyMessage(error),
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in wrapped function:', error);
      }
      throw error;
    }
  }) as T;
}

/**
 * Log errors to console in development
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
  
  // In production, you would send this to an error tracking service
  // like Sentry, LogRocket, etc.
}

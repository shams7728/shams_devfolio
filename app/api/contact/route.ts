/**
 * Contact Form API Route
 * 
 * POST /api/contact - Submit a contact form message
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactMessagesModel } from '@/lib/models/contact-messages';
import { handleApiError, logError } from '@/lib/utils/error-handler';

// Rate limiting storage (in-memory for simplicity)
// In production, use Redis or a database
const rateLimitMap = new Map<string, number>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of rateLimitMap.entries()) {
    if (now - timestamp > 60000) { // 1 minute
      rateLimitMap.delete(key);
    }
  }
}, 300000); // 5 minutes

/**
 * Get client identifier for rate limiting
 * Uses IP address or a fallback identifier
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Check if client is rate limited
 * Limit: 1 submission per minute per client
 */
function isRateLimited(clientId: string): boolean {
  const lastSubmission = rateLimitMap.get(clientId);
  const now = Date.now();
  
  if (lastSubmission && now - lastSubmission < 60000) { // 1 minute
    return true;
  }
  
  return false;
}

/**
 * Record submission for rate limiting
 */
function recordSubmission(clientId: string): void {
  rateLimitMap.set(clientId, Date.now());
}

/**
 * POST /api/contact
 * 
 * Submit a contact form message
 * Public endpoint with rate limiting
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */
export async function POST(request: NextRequest) {
  try {
    // Get client identifier for rate limiting
    const clientId = getClientIdentifier(request);
    
    // Check rate limit
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting another message.' },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const body = await request.json();

    // Create contact message
    const message = await ContactMessagesModel.create(supabase, body);

    // Record submission for rate limiting
    recordSubmission(clientId);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    logError('POST /api/contact', error);
    return handleApiError(error);
  }
}

/**
 * Contact Messages API Route
 * 
 * GET /api/contact-messages - Get all contact messages (admin only)
 * 
 * Requirements: 11.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactMessagesModel } from '@/lib/models/contact-messages';
import { handleApiError, logError } from '@/lib/utils/error-handler';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/contact-messages
 * 
 * Fetch all contact messages, optionally filtered by status
 * Admin only
 * 
 * Query params:
 * - status: 'new' | 'read' | 'archived' (optional)
 * 
 * Requirements: 11.5
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify admin authentication
    await requireAdmin();

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'new' | 'read' | 'archived' | null;

    // Validate status if provided
    if (status && !['new', 'read', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status parameter' },
        { status: 400 }
      );
    }

    // Fetch messages
    const messages = await ContactMessagesModel.getAll(
      supabase,
      status || undefined
    );

    return NextResponse.json(messages);
  } catch (error) {
    logError('GET /api/contact-messages', error);
    return handleApiError(error);
  }
}

/**
 * Contact Message API Route (by ID)
 * 
 * GET /api/contact-messages/[id] - Get a single contact message
 * PUT /api/contact-messages/[id] - Update contact message status
 * DELETE /api/contact-messages/[id] - Delete a contact message
 * 
 * Requirements: 11.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactMessagesModel } from '@/lib/models/contact-messages';
import { handleApiError, logError } from '@/lib/utils/error-handler';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/contact-messages/[id]
 * 
 * Fetch a single contact message by ID
 * Admin only
 * 
 * Requirements: 11.5
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Verify admin authentication
    await requireAdmin();

    const { id } = await params;

    // Fetch message
    const message = await ContactMessagesModel.getById(supabase, id);

    if (!message) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    logError('GET /api/contact-messages/[id]', error);
    return handleApiError(error);
  }
}

/**
 * PUT /api/contact-messages/[id]
 * 
 * Update contact message status
 * Admin only
 * 
 * Requirements: 11.5
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Verify admin authentication
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();

    // Update message status
    const message = await ContactMessagesModel.updateStatus(supabase, id, body);

    return NextResponse.json(message);
  } catch (error) {
    logError('PUT /api/contact-messages/[id]', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/contact-messages/[id]
 * 
 * Delete a contact message
 * Admin only
 * 
 * Requirements: 11.5
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Verify admin authentication
    await requireAdmin();

    const { id } = await params;

    // Delete message
    await ContactMessagesModel.delete(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE /api/contact-messages/[id]', error);
    return handleApiError(error);
  }
}

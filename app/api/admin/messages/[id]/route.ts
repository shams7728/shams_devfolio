/**
 * Admin Contact Messages API Route
 * 
 * PATCH /api/admin/messages/[id] - Update message status
 * DELETE /api/admin/messages/[id] - Delete a message
 * 
 * Requirements: 11.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactMessagesModel } from '@/lib/models/contact-messages';
import { handleApiError, logError } from '@/lib/utils/error-handler';
import { requireAdmin } from '@/lib/auth';

/**
 * PATCH /api/admin/messages/[id]
 * 
 * Update contact message status
 * Requires admin authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Verify admin authentication
    await requireAdmin();

    const body = await request.json();

    // Update message status
    const message = await ContactMessagesModel.updateStatus(supabase, id, body);

    return NextResponse.json(message);
  } catch (error) {
    logError(`PATCH /api/admin/messages/${(await params).id}`, error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/messages/[id]
 * 
 * Delete a contact message
 * Requires admin authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Verify admin authentication
    await requireAdmin();

    // Delete message
    await ContactMessagesModel.delete(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError(`DELETE /api/admin/messages/${(await params).id}`, error);
    return handleApiError(error);
  }
}

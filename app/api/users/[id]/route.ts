/**
 * User by ID API Route
 * 
 * PUT /api/users/[id] - Update a user (super admin only)
 * DELETE /api/users/[id] - Delete a user (super admin only)
 * 
 * Requirements: 3.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserModel } from '@/lib/models/user';
import { requireSuperAdmin } from '@/lib/auth/auth';
import { handleApiError, logError, ValidationError } from '@/lib/utils/error-handler';

/**
 * PUT /api/users/[id]
 * 
 * Update a user (super admin only)
 * 
 * Requirements: 3.4
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify super admin authentication
    await requireSuperAdmin();

    const supabase = await createClient();
    const body = await request.json();
    const { id } = await params;

    // Update user
    const user = await UserModel.update(supabase, id, body);

    return NextResponse.json(user);
  } catch (error) {
    logError('PUT /api/users/[id]', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/users/[id]
 * 
 * Delete a user (super admin only)
 * Prevents deleting yourself
 * 
 * Requirements: 3.4
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify super admin authentication
    const currentUser = await requireSuperAdmin();

    const supabase = await createClient();
    const { id } = await params;

    // Prevent deleting yourself
    if (currentUser.id === id) {
      throw new ValidationError('Cannot delete your own account');
    }

    // Delete user
    await UserModel.delete(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE /api/users/[id]', error);
    return handleApiError(error);
  }
}

/**
 * Role by ID API Route
 * 
 * GET /api/roles/[id] - Get a single role (admin only)
 * PUT /api/roles/[id] - Update a role (admin only)
 * DELETE /api/roles/[id] - Delete a role (admin only)
 * 
 * Requirements: 4.2, 4.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RoleModel } from '@/lib/models/role';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError } from '@/lib/utils/error-handler';

/**
 * GET /api/roles/[id]
 * 
 * Get a single role by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const { id } = await params;

    // Get role
    const role = await RoleModel.getById(supabase, id);

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(role);
  } catch (error) {
    logError('GET /api/roles/[id]', error);
    return handleApiError(error);
  }
}

/**
 * PUT /api/roles/[id]
 * 
 * Update an existing role (admin only)
 * Updates slug if title changed
 * 
 * Requirements: 4.2
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();

    // Update role
    const role = await RoleModel.update(supabase, id, body);

    return NextResponse.json(role);
  } catch (error) {
    logError('PUT /api/roles/[id]', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/roles/[id]
 * 
 * Delete a role (admin only)
 * Prevents deletion if role has associated projects
 * 
 * Requirements: 4.3
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const { id } = await params;

    // Delete role
    await RoleModel.delete(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE /api/roles/[id]', error);
    return handleApiError(error);
  }
}

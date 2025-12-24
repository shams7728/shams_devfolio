/**
 * Roles API Route
 * 
 * GET /api/roles - Fetch all roles (with optional published filter)
 * POST /api/roles - Create a new role (admin only)
 * 
 * Requirements: 1.1, 4.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RoleModel } from '@/lib/models/role';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError } from '@/lib/utils/error-handler';

/**
 * GET /api/roles
 * 
 * Fetch all roles, optionally filtered by published status
 * Query parameters:
 * - published: 'true' to fetch only published roles
 * 
 * Requirements: 1.1
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';

    const roles = await RoleModel.getAll(supabase, publishedOnly);

    return NextResponse.json(roles);
  } catch (error) {
    logError('GET /api/roles', error);
    return handleApiError(error);
  }
}

/**
 * POST /api/roles
 * 
 * Create a new role (admin only)
 * Automatically generates slug and sets display_order
 * 
 * Requirements: 4.1
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const body = await request.json();

    // Create role
    const role = await RoleModel.create(supabase, body);

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    logError('POST /api/roles', error);
    return handleApiError(error);
  }
}

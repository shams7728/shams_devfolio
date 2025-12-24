/**
 * Users API Route
 * 
 * GET /api/users - Fetch all users (super admin only)
 * POST /api/users - Create a new user (super admin only)
 * 
 * Requirements: 3.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserModel } from '@/lib/models/user';
import { requireSuperAdmin } from '@/lib/auth/auth';
import { handleApiError, logError } from '@/lib/utils/error-handler';

/**
 * GET /api/users
 * 
 * Fetch all users (super admin only)
 * 
 * Requirements: 3.4
 */
export async function GET(request: NextRequest) {
  try {
    // Verify super admin authentication
    await requireSuperAdmin();

    const supabase = await createClient();
    const users = await UserModel.getAll(supabase);

    return NextResponse.json(users);
  } catch (error) {
    logError('GET /api/users', error);
    return handleApiError(error);
  }
}

/**
 * POST /api/users
 * 
 * Create a new user (super admin only)
 * 
 * Requirements: 3.4
 */
export async function POST(request: NextRequest) {
  try {
    // Verify super admin authentication
    await requireSuperAdmin();

    const supabase = await createClient();
    const body = await request.json();

    // Create user
    const user = await UserModel.create(supabase, body);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    logError('POST /api/users', error);
    return handleApiError(error);
  }
}

/**
 * Roles Reorder API Route
 * 
 * POST /api/roles/reorder - Update display order for multiple roles (admin only)
 * 
 * Requirements: 1.3, 4.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RoleModel } from '@/lib/models/role';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError } from '@/lib/utils/error-handler';

/**
 * POST /api/roles/reorder
 * 
 * Update display_order for multiple roles in a transaction
 * 
 * Request body:
 * {
 *   items: [
 *     { id: "uuid", display_order: 0 },
 *     { id: "uuid", display_order: 1 },
 *     ...
 *   ]
 * }
 * 
 * Requirements: 1.3, 4.4
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const body = await request.json();

    // Reorder roles
    await RoleModel.reorder(supabase, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('POST /api/roles/reorder', error);
    return handleApiError(error);
  }
}

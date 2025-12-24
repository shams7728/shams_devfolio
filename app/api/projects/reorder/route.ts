/**
 * Projects Reorder API Route
 * 
 * POST /api/projects/reorder - Update display order for multiple projects within a role (admin only)
 * 
 * Requirements: 2.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectModel } from '@/lib/models/project';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError } from '@/lib/utils/error-handler';

/**
 * POST /api/projects/reorder
 * 
 * Update display_order for multiple projects within a role scope
 * 
 * Request body:
 * {
 *   role_id: "uuid",
 *   items: [
 *     { id: "uuid", display_order: 0 },
 *     { id: "uuid", display_order: 1 },
 *     ...
 *   ]
 * }
 * 
 * Requirements: 2.5
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const body = await request.json();

    // Reorder projects
    await ProjectModel.reorder(supabase, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('POST /api/projects/reorder', error);
    return handleApiError(error);
  }
}

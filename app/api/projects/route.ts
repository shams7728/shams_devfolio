/**
 * Projects API Route
 * 
 * GET /api/projects - Fetch projects by role_id (with optional published filter)
 * POST /api/projects - Create a new project (admin only)
 * 
 * Requirements: 2.1, 5.1, 5.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectModel } from '@/lib/models/project';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError, ValidationError } from '@/lib/utils/error-handler';

/**
 * GET /api/projects
 * 
 * Fetch projects by role_id, optionally filtered by published status
 * Query parameters:
 * - role_id: UUID of the role (required)
 * - published: 'true' to fetch only published projects
 * 
 * Requirements: 2.1
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const roleId = searchParams.get('role_id');
    const publishedOnly = searchParams.get('published') === 'true';

    if (!roleId) {
      throw new ValidationError('role_id query parameter is required');
    }

    const projects = await ProjectModel.getByRole(supabase, roleId, publishedOnly);

    return NextResponse.json(projects);
  } catch (error) {
    logError('GET /api/projects', error);
    return handleApiError(error);
  }
}

/**
 * POST /api/projects
 * 
 * Create a new project (admin only)
 * Validates URLs and sets display_order automatically
 * 
 * Requirements: 2.1, 5.1, 5.4
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const body = await request.json();

    // Create project
    const project = await ProjectModel.create(supabase, body);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    logError('POST /api/projects', error);
    return handleApiError(error);
  }
}

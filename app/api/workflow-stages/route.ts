/**
 * Workflow Stages API Routes
 * 
 * GET /api/workflow-stages - Fetch all workflow stages
 * POST /api/workflow-stages - Create a new workflow stage
 * 
 * Requirements: 5.1, 5.2, 5.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { WorkflowStagesModel } from '@/lib/models/workflow-stages';
import { handleApiError } from '@/lib/utils/error-handler';

/**
 * GET /api/workflow-stages
 * Fetch all workflow stages ordered by display_order
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all workflow stages
    const stages = await WorkflowStagesModel.getAll(supabase);

    return NextResponse.json(stages);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/workflow-stages
 * Create a new workflow stage
 * 
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Create workflow stage
    const stage = await WorkflowStagesModel.create(supabase, body);

    return NextResponse.json(stage, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

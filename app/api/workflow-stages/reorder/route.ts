/**
 * Workflow Stages Reorder API Route
 * 
 * POST /api/workflow-stages/reorder - Update display order for multiple stages
 * 
 * Requirements: 5.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { WorkflowStagesModel } from '@/lib/models/workflow-stages';
import { handleApiError } from '@/lib/utils/error-handler';

/**
 * POST /api/workflow-stages/reorder
 * Update display order for multiple workflow stages
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

    // Reorder workflow stages
    await WorkflowStagesModel.reorder(supabase, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Workflow Stage API Routes (by ID)
 * 
 * GET /api/workflow-stages/[id] - Fetch a single workflow stage
 * PUT /api/workflow-stages/[id] - Update a workflow stage
 * DELETE /api/workflow-stages/[id] - Delete a workflow stage
 * 
 * Requirements: 5.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { WorkflowStagesModel } from '@/lib/models/workflow-stages';
import { handleApiError } from '@/lib/utils/error-handler';

/**
 * GET /api/workflow-stages/[id]
 * Fetch a single workflow stage by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch workflow stage
    const stage = await WorkflowStagesModel.getById(supabase, id);

    if (!stage) {
      return NextResponse.json(
        { error: 'Workflow stage not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(stage);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/workflow-stages/[id]
 * Update a workflow stage
 * 
 * Requires admin authentication
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update workflow stage
    const stage = await WorkflowStagesModel.update(supabase, id, body);

    return NextResponse.json(stage);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/workflow-stages/[id]
 * Delete a workflow stage
 * 
 * Requires admin authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete workflow stage
    await WorkflowStagesModel.delete(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

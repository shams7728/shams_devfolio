/**
 * Timeline Milestone API Routes (by ID)
 * 
 * GET /api/timeline-milestones/[id] - Fetch a single timeline milestone
 * PUT /api/timeline-milestones/[id] - Update a timeline milestone
 * DELETE /api/timeline-milestones/[id] - Delete a timeline milestone
 * 
 * Requirements: 9.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TimelineModel } from '@/lib/models/timeline';
import { handleApiError } from '@/lib/utils/error-handler';

/**
 * GET /api/timeline-milestones/[id]
 * Fetch a single timeline milestone by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch timeline milestone
    const milestone = await TimelineModel.getById(supabase, id);

    if (!milestone) {
      return NextResponse.json(
        { error: 'Timeline milestone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(milestone);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/timeline-milestones/[id]
 * Update a timeline milestone
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

    // Update timeline milestone
    const milestone = await TimelineModel.update(supabase, id, body);

    return NextResponse.json(milestone);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/timeline-milestones/[id]
 * Delete a timeline milestone
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

    // Delete timeline milestone
    await TimelineModel.delete(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

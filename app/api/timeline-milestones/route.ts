/**
 * Timeline Milestones API Routes
 * 
 * GET /api/timeline-milestones - Fetch all timeline milestones
 * POST /api/timeline-milestones - Create a new timeline milestone
 * 
 * Requirements: 9.1, 9.2, 9.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TimelineModel } from '@/lib/models/timeline';
import { handleApiError } from '@/lib/utils/error-handler';

/**
 * GET /api/timeline-milestones
 * Fetch all timeline milestones ordered by year (descending) and display_order
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all timeline milestones
    const milestones = await TimelineModel.getAll(supabase);

    return NextResponse.json(milestones);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/timeline-milestones
 * Create a new timeline milestone
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

    // Create timeline milestone
    const milestone = await TimelineModel.create(supabase, body);

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

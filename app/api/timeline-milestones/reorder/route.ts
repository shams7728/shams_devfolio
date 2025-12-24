/**
 * Timeline Milestones Reorder API Route
 * 
 * POST /api/timeline-milestones/reorder - Update display order for multiple milestones
 * 
 * Requirements: 9.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TimelineModel } from '@/lib/models/timeline';
import { handleApiError } from '@/lib/utils/error-handler';

/**
 * POST /api/timeline-milestones/reorder
 * Update display order for multiple timeline milestones
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

    // Reorder timeline milestones
    await TimelineModel.reorder(supabase, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Impact Metrics Reorder API Route
 * 
 * POST /api/impact-metrics/reorder - Reorder impact metrics (admin only)
 * 
 * Requirements: 3.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ImpactMetricsModel } from '@/lib/models/impact-metrics';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError } from '@/lib/utils/error-handler';

/**
 * POST /api/impact-metrics/reorder
 * 
 * Update display order for multiple impact metrics (admin only)
 * 
 * Body: { items: [{ id: string, display_order: number }] }
 * 
 * Requirements: 3.4
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const body = await request.json();

    // Reorder impact metrics
    await ImpactMetricsModel.reorder(supabase, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('POST /api/impact-metrics/reorder', error);
    return handleApiError(error);
  }
}

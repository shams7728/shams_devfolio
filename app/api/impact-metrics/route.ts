/**
 * Impact Metrics API Route
 * 
 * GET /api/impact-metrics - Fetch all impact metrics (with optional published filter)
 * POST /api/impact-metrics - Create a new impact metric (admin only)
 * 
 * Requirements: 3.1, 3.2, 3.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ImpactMetricsModel } from '@/lib/models/impact-metrics';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError, ValidationError } from '@/lib/utils/error-handler';

/**
 * GET /api/impact-metrics
 * 
 * Fetch all impact metrics, optionally filtered by published status
 * Query parameters:
 * - published: 'true' to fetch only published metrics
 * 
 * Requirements: 3.1
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';

    const metrics = await ImpactMetricsModel.getAll(supabase, publishedOnly);

    return NextResponse.json(metrics);
  } catch (error) {
    logError('GET /api/impact-metrics', error);
    return handleApiError(error);
  }
}

/**
 * POST /api/impact-metrics
 * 
 * Create a new impact metric (admin only)
 * Sets display_order automatically
 * 
 * Requirements: 3.1
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const body = await request.json();

    // Create impact metric
    const metric = await ImpactMetricsModel.create(supabase, body);

    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    logError('POST /api/impact-metrics', error);
    return handleApiError(error);
  }
}

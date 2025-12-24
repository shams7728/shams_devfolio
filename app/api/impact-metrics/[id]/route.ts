/**
 * Impact Metric by ID API Route
 * 
 * PUT /api/impact-metrics/[id] - Update an impact metric (admin only)
 * DELETE /api/impact-metrics/[id] - Delete an impact metric (admin only)
 * 
 * Requirements: 3.2, 3.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ImpactMetricsModel } from '@/lib/models/impact-metrics';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError } from '@/lib/utils/error-handler';

/**
 * PUT /api/impact-metrics/[id]
 * 
 * Update an existing impact metric (admin only)
 * 
 * Requirements: 3.2
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const body = await request.json();
    const { id } = await params;

    // Update impact metric
    const metric = await ImpactMetricsModel.update(supabase, id, body);

    return NextResponse.json(metric);
  } catch (error) {
    logError('PUT /api/impact-metrics/[id]', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/impact-metrics/[id]
 * 
 * Delete an impact metric (admin only)
 * 
 * Requirements: 3.4
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const { id } = await params;

    // Delete impact metric
    await ImpactMetricsModel.delete(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE /api/impact-metrics/[id]', error);
    return handleApiError(error);
  }
}

/**
 * Theme Settings API Routes
 * 
 * GET /api/theme-settings - Fetch current theme settings
 * PUT /api/theme-settings - Update theme settings (admin only)
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ThemeSettingsModel } from '@/lib/models/theme-settings';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/theme-settings
 * 
 * Fetch current theme settings (public access)
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const settings = await ThemeSettingsModel.get(supabase);

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/theme-settings
 * 
 * Update theme settings (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    await requireAdmin();

    // Parse request body
    const body = await request.json();

    // Update theme settings
    const updatedSettings = await ThemeSettingsModel.update(supabase, body);

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating theme settings:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update theme settings' },
      { status: 500 }
    );
  }
}

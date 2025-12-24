/**
 * Role Background API Routes
 * 
 * GET /api/role-backgrounds/[roleId] - Get role background by role ID
 * PUT /api/role-backgrounds/[roleId] - Create or update role background
 * DELETE /api/role-backgrounds/[roleId] - Delete role background
 * 
 * Requirements: 2.7
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RoleBackgroundModel } from '@/lib/models/role-background';

/**
 * GET /api/role-backgrounds/[roleId]
 * Fetch role background configuration by role ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const supabase = await createClient();
    const { roleId } = await params;

    const background = await RoleBackgroundModel.getByRoleId(supabase, roleId);

    if (!background) {
      return NextResponse.json(
        { error: 'Role background not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(background);
  } catch (error) {
    console.error('Error fetching role background:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role background' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/role-backgrounds/[roleId]
 * Create or update role background configuration
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const supabase = await createClient();
    const { roleId } = await params;
    const body = await request.json();

    const background = await RoleBackgroundModel.upsert(supabase, roleId, body);

    return NextResponse.json(background);
  } catch (error) {
    console.error('Error upserting role background:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save role background' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/role-backgrounds/[roleId]
 * Delete role background configuration (revert to default)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const supabase = await createClient();
    const { roleId } = await params;

    await RoleBackgroundModel.delete(supabase, roleId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting role background:', error);
    return NextResponse.json(
      { error: 'Failed to delete role background' },
      { status: 500 }
    );
  }
}

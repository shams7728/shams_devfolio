/**
 * Project by ID API Route
 * 
 * PUT /api/projects/[id] - Update a project (admin only)
 * DELETE /api/projects/[id] - Delete a project (admin only)
 * 
 * Requirements: 2.2, 2.4, 5.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectModel } from '@/lib/models/project';
import { MediaModel, STORAGE_BUCKETS } from '@/lib/models/media';
import { requireAdmin } from '@/lib/auth/auth';
import { revalidatePath } from 'next/cache';
import { handleApiError, logError, NotFoundError } from '@/lib/utils/error-handler';

/**
 * PUT /api/projects/[id]
 * 
 * Update an existing project (admin only)
 * Validates URLs and triggers ISR revalidation
 * 
 * Requirements: 2.2, 5.3
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();

    // Fetch the project to get role information for revalidation
    const existingProject = await ProjectModel.getById(supabase, id);
    if (!existingProject) {
      throw new NotFoundError('Project');
    }

    // Update project
    const project = await ProjectModel.update(supabase, id, body);

    // Trigger ISR revalidation for affected pages
    // Revalidate the role page that contains this project
    const roleWithProject = await ProjectModel.getByIdWithRole(supabase, id);
    if (roleWithProject?.role) {
      revalidatePath(`/roles/${roleWithProject.role.slug}`);
    }
    
    // Revalidate the project detail page
    revalidatePath(`/roles/${roleWithProject?.role?.slug}/projects/${id}`);

    return NextResponse.json(project);
  } catch (error) {
    logError('PUT /api/projects/[id]', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/projects/[id]
 * 
 * Delete a project (admin only)
 * Deletes associated media files from Supabase Storage
 * 
 * Requirements: 2.4
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

    // Delete project (returns project data for media cleanup)
    const deletedProject = await ProjectModel.delete(supabase, id);

    // Delete associated media files from Supabase Storage
    const mediaUrls = [
      deletedProject.cover_image_url,
      ...deletedProject.gallery_urls,
    ].filter(Boolean);

    // Use MediaModel to delete files
    if (mediaUrls.length > 0) {
      try {
        await MediaModel.deleteMultiple(supabase, mediaUrls, STORAGE_BUCKETS.PROJECT_IMAGES);
      } catch (mediaError) {
        console.error('Failed to delete some media files:', mediaError);
        // Continue even if media deletion fails - project is already deleted
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE /api/projects/[id]', error);
    return handleApiError(error);
  }
}

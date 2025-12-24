/**
 * Upload API Route
 * 
 * POST /api/upload - Upload media files to Supabase Storage (admin only)
 * 
 * Requirements: 5.2, 11.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MediaModel, STORAGE_BUCKETS } from '@/lib/models/media';
import { requireAdmin } from '@/lib/auth/auth';
import { handleApiError, logError, ValidationError } from '@/lib/utils/error-handler';

/**
 * POST /api/upload
 * 
 * Upload one or more media files to Supabase Storage
 * Supports both project images and role icons
 * 
 * Form data fields:
 * - files: File[] (required) - One or more files to upload
 * - bucket: 'project-images' | 'role-icons' (required) - Target storage bucket
 * - roleId: string (required) - Role ID for organizing files
 * - projectId: string (optional) - Project ID (required for project-images bucket)
 * 
 * Returns:
 * - urls: string[] - Array of CDN URLs for uploaded files
 * 
 * Requirements: 5.2, 11.1
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAdmin();

    const supabase = await createClient();

    // Parse multipart form data
    const formData = await request.formData();
    
    // Extract bucket type
    const bucket = formData.get('bucket') as string;
    if (!bucket || (bucket !== STORAGE_BUCKETS.PROJECT_IMAGES && bucket !== STORAGE_BUCKETS.ROLE_ICONS)) {
      throw new ValidationError('Invalid or missing bucket parameter. Must be "project-images" or "role-icons"');
    }

    // Extract role ID
    const roleId = formData.get('roleId') as string;
    if (!roleId) {
      throw new ValidationError('roleId is required');
    }

    // Extract project ID (required for project images)
    const projectId = formData.get('projectId') as string;
    if (bucket === STORAGE_BUCKETS.PROJECT_IMAGES && !projectId) {
      throw new ValidationError('projectId is required for project-images bucket');
    }

    // Extract files
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'files' && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      throw new ValidationError('No files provided');
    }

    // Validate each file before upload
    for (const file of files) {
      const validation = MediaModel.validateFile(file, bucket);
      if (!validation.valid) {
        throw new ValidationError(`File "${file.name}": ${validation.error}`);
      }
    }

    // Upload files to Supabase Storage
    const uploadResults = await MediaModel.uploadMultiple(
      supabase,
      files,
      (filename) => {
        if (bucket === STORAGE_BUCKETS.PROJECT_IMAGES) {
          return MediaModel.generateProjectImagePath(roleId, projectId!, filename);
        } else {
          return MediaModel.generateRoleIconPath(roleId, filename);
        }
      },
      bucket
    );

    // Return array of CDN URLs
    const urls = uploadResults.map(result => result.url);

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    logError('POST /api/upload', error);
    return handleApiError(error);
  }
}

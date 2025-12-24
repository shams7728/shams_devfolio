/**
 * Media Model
 * 
 * Business logic layer for media file operations
 * Requirements: 11.1, 11.2, 11.3
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

/**
 * Allowed icon MIME types (includes SVG for role icons)
 */
const ALLOWED_ICON_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
] as const;

/**
 * Maximum file sizes
 */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for project images
const MAX_ICON_SIZE = 2 * 1024 * 1024; // 2MB for role icons

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  PROJECT_IMAGES: 'project-images',
  ROLE_ICONS: 'role-icons',
} as const;

/**
 * File validation result
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Upload result
 */
export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Media Model Class
 * 
 * Provides file upload, validation, and deletion operations
 */
export class MediaModel {
  /**
   * Validate file type and size
   * 
   * Requirements: 11.1
   */
  static validateFile(
    file: File,
    bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]
  ): ValidationResult {
    // Determine allowed types and max size based on bucket
    const allowedTypes = bucket === STORAGE_BUCKETS.ROLE_ICONS
      ? ALLOWED_ICON_TYPES
      : ALLOWED_IMAGE_TYPES;
    
    const maxSize = bucket === STORAGE_BUCKETS.ROLE_ICONS
      ? MAX_ICON_SIZE
      : MAX_IMAGE_SIZE;

    // Validate file type
    if (!allowedTypes.includes(file.type as any)) {
      const typesList = allowedTypes.join(', ');
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${typesList}`,
      };
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`,
      };
    }

    return { valid: true };
  }

  /**
   * Generate unique filename with timestamp
   * 
   * Requirements: 11.2
   */
  static generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalFilename.split('.').pop() || 'jpg';
    const sanitizedName = originalFilename
      .split('.')[0]
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()
      .substring(0, 50);
    
    return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Generate storage path for project images
   * Format: /roles/{roleId}/projects/{projectId}/{filename}
   * 
   * Requirements: 11.2
   */
  static generateProjectImagePath(
    roleId: string,
    projectId: string,
    filename: string
  ): string {
    return `roles/${roleId}/projects/${projectId}/${filename}`;
  }

  /**
   * Generate storage path for role icons
   * Format: /roles/{roleId}/{filename}
   * 
   * Requirements: 11.2
   */
  static generateRoleIconPath(roleId: string, filename: string): string {
    return `roles/${roleId}/${filename}`;
  }

  /**
   * Upload a file to Supabase Storage
   * 
   * Requirements: 11.1, 11.2
   */
  static async upload(
    client: SupabaseClient,
    file: File,
    path: string,
    bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]
  ): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file, bucket);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Upload to Supabase Storage
    const { data, error } = await client.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = client.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  }

  /**
   * Upload multiple files
   * 
   * Requirements: 11.1, 11.2
   */
  static async uploadMultiple(
    client: SupabaseClient,
    files: File[],
    pathGenerator: (filename: string) => string,
    bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map(async (file) => {
      const uniqueFilename = this.generateUniqueFilename(file.name);
      const path = pathGenerator(uniqueFilename);
      return this.upload(client, file, path, bucket);
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from Supabase Storage
   * 
   * Requirements: 11.3
   */
  static async delete(
    client: SupabaseClient,
    url: string,
    bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]
  ): Promise<void> {
    // Extract path from URL
    const path = this.extractPathFromUrl(url, bucket);
    if (!path) {
      throw new Error('Invalid URL: Could not extract path');
    }

    // Delete from Supabase Storage
    const { error } = await client.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  /**
   * Delete multiple files from Supabase Storage
   * 
   * Requirements: 11.3
   */
  static async deleteMultiple(
    client: SupabaseClient,
    urls: string[],
    bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]
  ): Promise<void> {
    // Extract paths from URLs
    const paths = urls
      .map(url => this.extractPathFromUrl(url, bucket))
      .filter((path): path is string => path !== null);

    if (paths.length === 0) {
      return;
    }

    // Delete from Supabase Storage
    const { error } = await client.storage
      .from(bucket)
      .remove(paths);

    if (error) {
      throw new Error(`Batch delete failed: ${error.message}`);
    }
  }

  /**
   * Extract storage path from public URL
   * 
   * @private
   */
  private static extractPathFromUrl(
    url: string,
    bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]
  ): string | null {
    try {
      // Supabase storage URLs follow pattern:
      // https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      // Find the bucket name in the path
      const bucketIndex = pathParts.indexOf(bucket);
      if (bucketIndex === -1) {
        return null;
      }

      // Everything after the bucket name is the file path
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      return filePath || null;
    } catch {
      return null;
    }
  }

  /**
   * Get storage usage statistics (placeholder for future implementation)
   * 
   * Requirements: 11.5
   */
  static async getStorageUsage(
    client: SupabaseClient,
    bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]
  ): Promise<{ totalSize: number; fileCount: number }> {
    // Note: Supabase doesn't provide a direct API for bucket statistics
    // This would require listing all files and calculating sizes
    // For now, return placeholder values
    return {
      totalSize: 0,
      fileCount: 0,
    };
  }
}

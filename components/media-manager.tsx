'use client';

/**
 * Media Manager Component
 * 
 * Reusable media uploader with drag-and-drop, progress indicators, and previews
 * Requirements: 5.2, 11.1, 11.5
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useToast } from '@/lib/contexts/toast-context';

export interface MediaManagerProps {
  /** Current uploaded image URLs */
  value: string[];
  /** Callback when images are uploaded */
  onChange: (urls: string[]) => void;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Whether to allow multiple file selection */
  multiple?: boolean;
  /** Role ID for organizing uploads */
  roleId?: string;
  /** Project ID for organizing uploads */
  projectId?: string;
  /** Storage bucket type */
  bucket?: 'project-images' | 'role-icons';
  /** Label for the upload area */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Display mode: 'grid' for gallery, 'single' for cover image */
  mode?: 'grid' | 'single';
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export function MediaManager({
  value = [],
  onChange,
  maxFiles = 10,
  multiple = true,
  roleId,
  projectId,
  bucket = 'project-images',
  label = 'Upload Images',
  required = false,
  error,
  mode = 'grid',
}: MediaManagerProps) {
  const toast = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [storageStats, setStorageStats] = useState<{ totalSize: number; fileCount: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate if we can upload more files
  const canUploadMore = value.length + uploadProgress.filter(p => p.status === 'uploading').length < maxFiles;

  /**
   * Handle file selection
   */
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check if role is selected
    if (!roleId) {
      toast.warning('Please select a role before uploading images');
      return;
    }

    // Check file limit
    const filesToUpload = Array.from(files).slice(0, maxFiles - value.length);
    if (filesToUpload.length === 0) {
      toast.warning(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Initialize progress tracking
    const initialProgress: UploadProgress[] = filesToUpload.map(file => ({
      filename: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadProgress(prev => [...prev, ...initialProgress]);

    // Upload files
    try {
      const formData = new FormData();
      filesToUpload.forEach(file => {
        formData.append('files', file);
      });
      formData.append('bucket', bucket);
      formData.append('roleId', roleId);
      if (projectId) {
        formData.append('projectId', projectId);
      } else {
        formData.append('projectId', 'temp-' + Date.now());
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      // Update progress to complete
      setUploadProgress(prev =>
        prev.map(p =>
          initialProgress.some(ip => ip.filename === p.filename)
            ? { ...p, progress: 100, status: 'complete' as const }
            : p
        )
      );

      // Update parent component with new URLs
      if (mode === 'single') {
        onChange([data.urls[0]]);
      } else {
        onChange([...value, ...data.urls]);
      }

      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress(prev =>
          prev.filter(p => !initialProgress.some(ip => ip.filename === p.filename))
        );
      }, 2000);
    } catch (error) {
      // Update progress to error
      setUploadProgress(prev =>
        prev.map(p =>
          initialProgress.some(ip => ip.filename === p.filename)
            ? {
              ...p,
              status: 'error' as const,
              error: error instanceof Error ? error.message : 'Upload failed',
            }
            : p
        )
      );

      // Clear error progress after a delay
      setTimeout(() => {
        setUploadProgress(prev =>
          prev.filter(p => !initialProgress.some(ip => ip.filename === p.filename))
        );
      }, 5000);
    }
  }, [value, onChange, maxFiles, roleId, projectId, bucket, mode]);

  /**
   * Handle drag events
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!canUploadMore) {
      toast.warning(`Maximum ${maxFiles} files allowed`);
      return;
    }

    handleFiles(e.dataTransfer.files);
  }, [canUploadMore, maxFiles, handleFiles]);

  /**
   * Handle file input change
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so the same file can be selected again
    e.target.value = '';
  }, [handleFiles]);

  /**
   * Handle remove image
   */
  const handleRemove = useCallback((index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  }, [value, onChange]);

  /**
   * Trigger file input click
   */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-zinc-900 dark:text-white">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : error
              ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-400 dark:hover:border-blue-500 bg-zinc-50/50 dark:bg-zinc-800/50'
          }
          ${!canUploadMore ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple && mode !== 'single'}
          onChange={handleInputChange}
          disabled={!canUploadMore}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {/* Upload Icon */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : 'bg-zinc-200 dark:bg-zinc-700'
            }
          `}>
            <svg
              className={`w-8 h-8 ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Upload Text */}
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              or click to browse
            </p>
          </div>

          {/* File Info */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            <p>Accepted: JPEG, PNG, WebP</p>
            <p>Max size: {bucket === 'role-icons' ? '2MB' : '5MB'} per file</p>
            {maxFiles > 1 && (
              <p>Max files: {maxFiles} ({value.length} uploaded)</p>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-900 dark:text-white truncate flex-1">
                  {progress.filename}
                </span>
                {progress.status === 'uploading' && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                    Uploading...
                  </span>
                )}
                {progress.status === 'complete' && (
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {progress.status === 'error' && (
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              {progress.status === 'uploading' && (
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              )}
              {progress.status === 'error' && progress.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Previews */}
      {value.length > 0 && (
        <div className={mode === 'single' ? 'space-y-2' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'}>
          {value.map((url, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
            >
              {/* Image */}
              <div className={mode === 'single' ? 'relative w-full h-64' : 'relative w-full aspect-square'}>
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes={mode === 'single' ? '100vw' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'}
                  onError={(e) => console.error('Image load error:', url, e)}
                  unoptimized
                />
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">
                  Image {index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storage Usage Statistics */}
      {storageStats && (
        <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Storage Usage
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Total Files</p>
              <p className="font-medium text-zinc-900 dark:text-white">
                {storageStats.fileCount}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Total Size</p>
              <p className="font-medium text-zinc-900 dark:text-white">
                {(storageStats.totalSize / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

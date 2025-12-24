'use client';

/**
 * Project Form Component
 * 
 * Comprehensive form for creating and editing projects with validation
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { useState } from 'react';
import type { Project, Role } from '@/lib/types/database';
import { MediaManager } from '@/components/media-manager';

interface ProjectFormProps {
  project?: Project;
  roles: Role[];
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

export interface ProjectFormData {
  role_id: string;
  title: string;
  short_description: string;
  long_description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  cover_image_url: string;
  gallery_urls: string[];
  is_published: boolean;
}

export function ProjectForm({ project, roles, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    role_id: project?.role_id || '',
    title: project?.title || '',
    short_description: project?.short_description || '',
    long_description: project?.long_description || '',
    tech_stack: project?.tech_stack || [],
    github_url: project?.github_url || '',
    live_url: project?.live_url || '',
    cover_image_url: project?.cover_image_url || '',
    gallery_urls: project?.gallery_urls || [],
    is_published: project?.is_published ?? false,
  });

  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.role_id) {
      newErrors.role_id = 'Role is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!formData.short_description.trim()) {
      newErrors.short_description = 'Short description is required';
    } else if (formData.short_description.length > 300) {
      newErrors.short_description = 'Short description must be 300 characters or less';
    }

    if (!formData.long_description.trim()) {
      newErrors.long_description = 'Long description is required';
    }

    if (formData.tech_stack.length === 0) {
      newErrors.tech_stack = 'At least one technology is required';
    } else if (formData.tech_stack.length > 20) {
      newErrors.tech_stack = 'Maximum 20 technologies allowed';
    }

    if (formData.github_url && formData.github_url.trim()) {
      try {
        new URL(formData.github_url);
      } catch {
        newErrors.github_url = 'Invalid URL format';
      }
    }

    if (formData.live_url && formData.live_url.trim()) {
      try {
        new URL(formData.live_url);
      } catch {
        newErrors.live_url = 'Invalid URL format';
      }
    }

    if (!formData.cover_image_url.trim()) {
      newErrors.cover_image_url = 'Cover image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter(t => t !== tech),
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      await onSubmit(formData);
      setNotification({
        type: 'success',
        message: project ? 'Project updated successfully!' : 'Project created successfully!',
      });
      
      // Clear form if creating new project
      if (!project) {
        setFormData({
          role_id: '',
          title: '',
          short_description: '',
          long_description: '',
          tech_stack: [],
          github_url: '',
          live_url: '',
          cover_image_url: '',
          gallery_urls: [],
          is_published: false,
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save project',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl border ${
            notification.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label htmlFor="role_id" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role_id"
            value={formData.role_id}
            onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.role_id
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
          {errors.role_id && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role_id}</p>
          )}
        </div>

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.title
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., E-commerce Platform"
            maxLength={200}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {formData.title.length}/200 characters
          </p>
        </div>

        {/* Short Description Field */}
        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="short_description"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            rows={2}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.short_description
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            placeholder="Brief description for project cards..."
            maxLength={300}
          />
          {errors.short_description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.short_description}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {formData.short_description.length}/300 characters
          </p>
        </div>

        {/* Long Description Field */}
        <div>
          <label htmlFor="long_description" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Long Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="long_description"
            value={formData.long_description}
            onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
            rows={8}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.long_description
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            placeholder="Detailed project description, case study, challenges, solutions..."
          />
          {errors.long_description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.long_description}</p>
          )}
        </div>

        {/* Tech Stack Field */}
        <div>
          <label htmlFor="tech_stack" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Tech Stack <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="tech_stack"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., React, TypeScript, Node.js"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          {errors.tech_stack && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tech_stack}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tech_stack.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-blue-900 dark:hover:text-blue-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* GitHub URL Field */}
        <div>
          <label htmlFor="github_url" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            GitHub URL (Optional)
          </label>
          <input
            type="url"
            id="github_url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.github_url
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="https://github.com/username/repo"
          />
          {errors.github_url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.github_url}</p>
          )}
        </div>

        {/* Live URL Field */}
        <div>
          <label htmlFor="live_url" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Live Demo URL (Optional)
          </label>
          <input
            type="url"
            id="live_url"
            value={formData.live_url}
            onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.live_url
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="https://example.com"
          />
          {errors.live_url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.live_url}</p>
          )}
        </div>

        {/* Cover Image Upload */}
        <MediaManager
          value={formData.cover_image_url ? [formData.cover_image_url] : []}
          onChange={(urls) => setFormData({ ...formData, cover_image_url: urls[0] || '' })}
          maxFiles={1}
          multiple={false}
          roleId={formData.role_id}
          projectId={project?.id}
          bucket="project-images"
          label="Cover Image"
          required
          error={errors.cover_image_url}
          mode="single"
        />

        {/* Gallery Images Upload */}
        <MediaManager
          value={formData.gallery_urls}
          onChange={(urls) => setFormData({ ...formData, gallery_urls: urls })}
          maxFiles={10}
          multiple={true}
          roleId={formData.role_id}
          projectId={project?.id}
          bucket="project-images"
          label="Gallery Images (Optional)"
          mode="grid"
        />

        {/* Published Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_published"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-zinc-900 dark:text-white">
            Publish this project (make it visible on the public site)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

/**
 * Timeline Milestone Form Component
 * 
 * Form for creating and editing timeline milestones with validation
 * Requirements: 9.4
 */

import { useState } from 'react';
import type { TimelineMilestone } from '@/lib/types/database';

interface TimelineFormProps {
  milestone?: TimelineMilestone;
  onSubmit: (data: TimelineFormData) => Promise<void>;
  onCancel: () => void;
}

export interface TimelineFormData {
  year: number;
  title: string;
  description: string;
}

export function TimelineForm({ milestone, onSubmit, onCancel }: TimelineFormProps) {
  const [formData, setFormData] = useState<TimelineFormData>({
    year: milestone?.year || new Date().getFullYear(),
    title: milestone?.title || '',
    description: milestone?.description || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TimelineFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TimelineFormData, string>> = {};

    // Validate year
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (!Number.isInteger(formData.year)) {
      newErrors.year = 'Year must be a whole number';
    } else if (formData.year < 1900) {
      newErrors.year = 'Year must be 1900 or later';
    } else if (formData.year > 2100) {
      newErrors.year = 'Year must be 2100 or earlier';
    }

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        message: milestone ? 'Timeline milestone updated successfully!' : 'Timeline milestone created successfully!',
      });
      
      // Clear form if creating new milestone
      if (!milestone) {
        setFormData({
          year: new Date().getFullYear(),
          title: '',
          description: '',
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save timeline milestone',
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
        {/* Year Field */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.year
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., 2024"
            min={1900}
            max={2100}
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.year}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Enter a year between 1900 and 2100
          </p>
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
            placeholder="e.g., Started First Development Role"
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.description
                ? 'border-red-300 dark:border-red-700'
                : 'border-zinc-300 dark:border-zinc-600'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            placeholder="Describe this milestone in your professional journey..."
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? 'Saving...' : milestone ? 'Update Milestone' : 'Create Milestone'}
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

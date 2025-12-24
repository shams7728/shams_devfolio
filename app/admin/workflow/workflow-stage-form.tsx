'use client';

/**
 * Workflow Stage Form Component
 * 
 * Form for creating and editing workflow stages with validation
 * Requirements: 5.4
 */

import { useState } from 'react';
import type { WorkflowStage } from '@/lib/types/database';

interface WorkflowStageFormProps {
  stage?: WorkflowStage;
  onSubmit: (data: WorkflowStageFormData) => Promise<void>;
  onCancel: () => void;
}

export interface WorkflowStageFormData {
  title: string;
  description: string;
  icon?: string;
}

export function WorkflowStageForm({ stage, onSubmit, onCancel }: WorkflowStageFormProps) {
  const [formData, setFormData] = useState<WorkflowStageFormData>({
    title: stage?.title || '',
    description: stage?.description || '',
    icon: stage?.icon || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WorkflowStageFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof WorkflowStageFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

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
        message: stage ? 'Workflow stage updated successfully!' : 'Workflow stage created successfully!',
      });
      
      // Clear form if creating new stage
      if (!stage) {
        setFormData({
          title: '',
          description: '',
          icon: '',
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save workflow stage',
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
            placeholder="e.g., Understand, Analyze, Design"
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
            placeholder="Describe what happens in this stage of your workflow..."
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Icon Field */}
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Icon (Optional)
          </label>
          <input
            type="text"
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 🔍, 📊, 🎨, 🔨, ✅, 🚀"
            maxLength={10}
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Use an emoji or short text to represent this stage
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? 'Saving...' : stage ? 'Update Stage' : 'Create Stage'}
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

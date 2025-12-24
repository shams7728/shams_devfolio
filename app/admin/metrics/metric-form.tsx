'use client';

/**
 * Impact Metric Form Component
 * 
 * Form for creating and editing impact metrics with validation
 * Requirements: 3.3, 3.5
 */

import { useState } from 'react';
import type { ImpactMetric } from '@/lib/types/database';
import { useToast } from '@/lib/contexts/toast-context';

export interface MetricFormData {
  title: string;
  value: number;
  icon?: string;
  is_published: boolean;
}

interface MetricFormProps {
  metric?: ImpactMetric;
  onSubmit: (data: MetricFormData) => Promise<void>;
  onCancel: () => void;
}

export function MetricForm({ metric, onSubmit, onCancel }: MetricFormProps) {
  const { success: showSuccess, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<MetricFormData>({
    title: metric?.title || '',
    value: metric?.value || 0,
    icon: metric?.icon || '',
    is_published: metric?.is_published ?? false,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (formData.value < 0) {
      newErrors.value = 'Value must be non-negative';
    }

    if (!Number.isInteger(formData.value)) {
      newErrors.value = 'Value must be a whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      showSuccess(metric ? 'Metric updated successfully' : 'Metric created successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save metric');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {metric ? 'Edit Metric' : 'Create New Metric'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
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
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-300 dark:border-zinc-600 focus:ring-blue-500'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2`}
            placeholder="e.g., Projects Delivered"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Value */}
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Value <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.value
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-300 dark:border-zinc-600 focus:ring-blue-500'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2`}
            placeholder="e.g., 50"
            min="0"
            step="1"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.value}</p>
          )}
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Enter a whole number (will be animated from 0 to this value)
          </p>
        </div>

        {/* Icon */}
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
            placeholder="e.g., 📊 or emoji/icon identifier"
          />
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Enter an emoji or icon identifier to display with the metric
          </p>
        </div>

        {/* Published Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_published"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-zinc-900 dark:text-white">
            Publish this metric (visible on public site)
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Saving...
              </span>
            ) : (
              <span>{metric ? 'Update Metric' : 'Create Metric'}</span>
            )}
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

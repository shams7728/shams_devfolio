'use client';

/**
 * Admin Impact Metrics Management Page
 * 
 * Main page for managing impact metrics with CRUD operations and drag-and-drop reordering
 * Requirements: 3.3, 3.5
 */

import { useEffect, useState } from 'react';
import type { ImpactMetric } from '@/lib/types/database';
import { MetricForm, type MetricFormData } from './metric-form';
import { DraggableMetricList } from './draggable-metric-list';
import { useToast } from '@/lib/contexts/toast-context';

export default function AdminMetricsPage() {
  const { error: showError } = useToast();
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ImpactMetric | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<ImpactMetric | null>(null);

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/impact-metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      showError('Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle create/update metric
  const handleSubmit = async (data: MetricFormData) => {
    const url = editingMetric ? `/api/impact-metrics/${editingMetric.id}` : '/api/impact-metrics';
    const method = editingMetric ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save metric');
    }

    // Refresh metrics list
    await fetchMetrics();
    
    // Close form
    setShowForm(false);
    setEditingMetric(undefined);
  };

  // Handle delete metric
  const handleDelete = async (metric: ImpactMetric) => {
    try {
      const response = await fetch(`/api/impact-metrics/${metric.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete metric');
      }

      // Refresh metrics list
      await fetchMetrics();
      setDeleteConfirm(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete metric');
    }
  };

  // Handle reorder metrics
  const handleReorder = async (reorderedMetrics: ImpactMetric[]) => {
    const items = reorderedMetrics.map((metric, index) => ({
      id: metric.id,
      display_order: index,
    }));

    const response = await fetch('/api/impact-metrics/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reorder metrics');
    }

    // Update local state
    setMetrics(reorderedMetrics);
  };

  // Handle toggle publish
  const handleTogglePublish = async (metric: ImpactMetric) => {
    const response = await fetch(`/api/impact-metrics/${metric.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !metric.is_published }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update metric');
    }

    // Refresh metrics list
    await fetchMetrics();
  };

  // Handle edit
  const handleEdit = (metric: ImpactMetric) => {
    setEditingMetric(metric);
    setShowForm(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingMetric(undefined);
  };

  // Handle create new
  const handleCreateNew = () => {
    setEditingMetric(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            Manage Impact Metrics
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Create and organize metrics to showcase your achievements
          </p>
        </div>

        {!showForm && (
          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Metric</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <MetricForm
          metric={editingMetric}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Metrics List */}
      {!showForm && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading metrics...</p>
              </div>
            </div>
          ) : metrics.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                No metrics yet
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Get started by creating your first impact metric to showcase your achievements
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Your First Metric</span>
              </button>
            </div>
          ) : (
            <>
              <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">Drag and drop to reorder</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      The order you set here will be reflected on your public portfolio. Metrics will animate from 0 to their target values.
                    </p>
                  </div>
                </div>
              </div>

              <DraggableMetricList
                metrics={metrics}
                onReorder={handleReorder}
                onEdit={handleEdit}
                onDelete={(metric) => setDeleteConfirm(metric)}
                onTogglePublish={handleTogglePublish}
              />
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  Delete Metric
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

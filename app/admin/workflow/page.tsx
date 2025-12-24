'use client';

/**
 * Admin Workflow Stages Management Page
 * 
 * Main page for managing workflow stages with CRUD operations and drag-and-drop reordering
 * Requirements: 5.4
 */

import { useEffect, useState } from 'react';
import type { WorkflowStage } from '@/lib/types/database';
import { WorkflowStageForm, type WorkflowStageFormData } from './workflow-stage-form';
import { DraggableWorkflowStageList } from './draggable-workflow-stage-list';
import { useToast } from '@/lib/contexts/toast-context';

export default function AdminWorkflowPage() {
  const { error: showError } = useToast();
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStage, setEditingStage] = useState<WorkflowStage | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<WorkflowStage | null>(null);

  // Fetch workflow stages
  const fetchStages = async () => {
    try {
      const response = await fetch('/api/workflow-stages');
      if (!response.ok) throw new Error('Failed to fetch workflow stages');
      const data = await response.json();
      setStages(data);
    } catch (error) {
      console.error('Error fetching workflow stages:', error);
      showError('Failed to load workflow stages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle create/update stage
  const handleSubmit = async (data: WorkflowStageFormData) => {
    const url = editingStage ? `/api/workflow-stages/${editingStage.id}` : '/api/workflow-stages';
    const method = editingStage ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save workflow stage');
    }

    // Refresh stages list
    await fetchStages();
    
    // Close form
    setShowForm(false);
    setEditingStage(undefined);
  };

  // Handle delete stage
  const handleDelete = async (stage: WorkflowStage) => {
    try {
      const response = await fetch(`/api/workflow-stages/${stage.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete workflow stage');
      }

      // Refresh stages list
      await fetchStages();
      setDeleteConfirm(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete workflow stage');
    }
  };

  // Handle reorder stages
  const handleReorder = async (reorderedStages: WorkflowStage[]) => {
    const items = reorderedStages.map((stage, index) => ({
      id: stage.id,
      display_order: index,
    }));

    const response = await fetch('/api/workflow-stages/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reorder workflow stages');
    }

    // Update local state
    setStages(reorderedStages);
  };

  // Handle edit
  const handleEdit = (stage: WorkflowStage) => {
    setEditingStage(stage);
    setShowForm(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingStage(undefined);
  };

  // Handle create new
  const handleCreateNew = () => {
    setEditingStage(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            Manage Workflow Stages
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Define the stages of your professional workflow or process
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
            <span>Create New Stage</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <WorkflowStageForm
          stage={editingStage}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Stages List */}
      {!showForm && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading workflow stages...</p>
              </div>
            </div>
          ) : stages.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                No workflow stages yet
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Get started by creating your first workflow stage
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Your First Stage</span>
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
                      The order you set here will be reflected in your workflow visualization
                    </p>
                  </div>
                </div>
              </div>

              <DraggableWorkflowStageList
                stages={stages}
                onReorder={handleReorder}
                onEdit={handleEdit}
                onDelete={(stage) => setDeleteConfirm(stage)}
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
                  Delete Workflow Stage
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

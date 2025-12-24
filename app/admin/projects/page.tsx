'use client';

/**
 * Admin Projects Management Page
 * 
 * Main page for managing projects with CRUD operations, role filtering, and drag-and-drop reordering
 * Requirements: 2.1, 5.1, 5.3
 */

import { useEffect, useState } from 'react';
import type { Project, Role } from '@/lib/types/database';
import { ProjectForm, type ProjectFormData } from './project-form';
import { DraggableProjectList } from './draggable-project-list';
import { useToast } from '@/lib/contexts/toast-context';

export default function AdminProjectsPage() {
  const { error: showError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data);
      
      // Auto-select first role if available
      if (data.length > 0 && !selectedRoleId) {
        setSelectedRoleId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      showError('Failed to load roles');
    }
  };

  // Fetch projects for selected role
  const fetchProjects = async () => {
    if (!selectedRoleId) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/projects?role_id=${selectedRoleId}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      setIsLoading(true);
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId]);

  // Handle create/update project
  const handleSubmit = async (data: ProjectFormData) => {
    const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
    const method = editingProject ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save project');
    }

    // Refresh projects list
    await fetchProjects();
    
    // Close form
    setShowForm(false);
    setEditingProject(undefined);
  };

  // Handle delete project
  const handleDelete = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
      }

      // Refresh projects list
      await fetchProjects();
      setDeleteConfirm(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete project');
    }
  };

  // Handle reorder projects
  const handleReorder = async (roleId: string, reorderedProjects: Project[]) => {
    const items = reorderedProjects.map((project, index) => ({
      id: project.id,
      display_order: index,
    }));

    const response = await fetch('/api/projects/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId, items }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reorder projects');
    }

    // Update local state
    setProjects(reorderedProjects);
  };

  // Handle toggle publish
  const handleTogglePublish = async (project: Project) => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !project.is_published }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update project');
    }

    // Refresh projects list
    await fetchProjects();
  };

  // Handle edit
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  // Handle create new
  const handleCreateNew = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  if (roles.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            Manage Projects
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Create and organize projects for your roles
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            No roles available
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            You need to create at least one role before adding projects
          </p>
          <a
            href="/admin/roles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Your First Role</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            Manage Projects
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Create and organize projects for your roles
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
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* Role Filter */}
      {!showForm && (
        <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-4">
          <label htmlFor="role-filter" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Filter by Role
          </label>
          <select
            id="role-filter"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.title} ({role.is_published ? 'Published' : 'Draft'})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <ProjectForm
          project={editingProject}
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Projects List */}
      {!showForm && selectedRoleId && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Get started by creating your first project for this role
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Your First Project</span>
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
                      The order you set here will be reflected on your public portfolio
                    </p>
                  </div>
                </div>
              </div>

              <DraggableProjectList
                projects={projects}
                roleId={selectedRoleId}
                onReorder={handleReorder}
                onEdit={handleEdit}
                onDelete={(project) => setDeleteConfirm(project)}
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
                  Delete Project
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone and will also delete all associated media files.
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

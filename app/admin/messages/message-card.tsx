'use client';

/**
 * Message Card Component
 * 
 * Individual contact message card with status management and actions
 * Requirements: 11.5
 */

import { useState } from 'react';
import type { ContactMessage } from '@/lib/types/database';

interface MessageCardProps {
  message: ContactMessage;
  onUpdate: (message: ContactMessage) => void;
  onDelete: (messageId: string) => void;
}

export function MessageCard({ message, onUpdate, onDelete }: MessageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date
  const formattedDate = new Date(message.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handle status change
  const handleStatusChange = async (newStatus: 'new' | 'read' | 'archived') => {
    if (newStatus === message.status) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      const updated = await response.json();
      onUpdate(updated);
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      onDelete(message.id);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  // Status badge styling
  const statusStyles = {
    new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    read: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    archived: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
  };

  return (
    <div className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                {message.name}
              </h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusStyles[message.status]}`}>
                {message.status}
              </span>
            </div>
            <a 
              href={`mailto:${message.email}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {message.email}
            </a>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {formattedDate}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg 
              className={`w-5 h-5 text-zinc-600 dark:text-zinc-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Message Preview */}
        <p className={`text-zinc-700 dark:text-zinc-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {message.message}
        </p>
      </div>

      {/* Actions (shown when expanded) */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-0 border-t border-zinc-200/50 dark:border-zinc-700/50 mt-4">
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {/* Status Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('new')}
                disabled={isUpdating || message.status === 'new'}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
              >
                Mark New
              </button>
              <button
                onClick={() => handleStatusChange('read')}
                disabled={isUpdating || message.status === 'read'}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20"
              >
                Mark Read
              </button>
              <button
                onClick={() => handleStatusChange('archived')}
                disabled={isUpdating || message.status === 'archived'}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500/20"
              >
                Archive
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

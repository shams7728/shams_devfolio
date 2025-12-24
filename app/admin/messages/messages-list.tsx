'use client';

/**
 * Messages List Component
 * 
 * Interactive list of contact messages with filtering, status updates, and deletion
 * Requirements: 11.5
 */

import { useState } from 'react';
import type { ContactMessage } from '@/lib/types/database';
import { MessageCard } from './message-card';

interface MessagesListProps {
  initialMessages: ContactMessage[];
}

type FilterStatus = 'all' | 'new' | 'read' | 'archived';

export function MessagesList({ initialMessages }: MessagesListProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<FilterStatus>('all');

  // Filter messages based on selected status
  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.status === filter);

  // Handle message update
  const handleUpdate = (updatedMessage: ContactMessage) => {
    setMessages(prev => 
      prev.map(m => m.id === updatedMessage.id ? updatedMessage : m)
    );
  };

  // Handle message deletion
  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'read', 'archived'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {status}
              {status !== 'all' && (
                <span className="ml-2 text-xs opacity-75">
                  ({messages.filter(m => m.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
            No messages found
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            {filter === 'all' 
              ? 'No contact messages have been submitted yet.'
              : `No ${filter} messages at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

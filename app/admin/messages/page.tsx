/**
 * Admin Contact Messages Page
 * 
 * Admin interface for viewing and managing contact form submissions
 * Requirements: 11.5
 */

import { createClient } from '@/lib/supabase/server';
import { ContactMessagesModel } from '@/lib/models/contact-messages';
import { MessagesList } from './messages-list';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Contact Messages | Admin',
  description: 'Manage contact form submissions',
};

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch all messages
  const messages = await ContactMessagesModel.getAll(supabase);

  // Count by status
  const newCount = messages.filter(m => m.status === 'new').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const archivedCount = messages.filter(m => m.status === 'archived').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contact Messages
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Manage contact form submissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">New</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{newCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Read</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{readCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Archived</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{archivedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <MessagesList initialMessages={messages} />
    </div>
  );
}

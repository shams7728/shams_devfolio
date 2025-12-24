/**
 * Roles Management Loading State
 * 
 * Loading skeleton for roles management page
 * Requirements: 8.2
 */

import { RolesListSkeleton } from '@/components/loading-skeleton';

export default function RolesLoading() {
  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="animate-pulse">
          <div className="h-9 bg-zinc-200 dark:bg-zinc-700 rounded w-48 mb-2" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-64" />
        </div>
      </div>

      {/* Roles list skeleton */}
      <RolesListSkeleton />
    </div>
  );
}

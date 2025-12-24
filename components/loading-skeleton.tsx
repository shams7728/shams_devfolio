/**
 * Loading Skeleton Components
 * 
 * Reusable skeleton components for loading states
 * Improves perceived performance
 * Requirements: 8.2
 */

'use client';

export function CardSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3" />
      </div>
    </div>
  );
}

export function RoleCardSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <div className="w-20 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div className="w-20 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-zinc-200 dark:bg-zinc-700" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="w-16 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
          <div className="w-20 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
          <div className="w-16 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3" />
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6 sm:p-8 animate-pulse">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-32" />
          <div className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-28" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="flex gap-3 justify-end">
          <div className="w-24 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="w-24 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-20 lg:pb-8">
      {/* Header skeleton */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6 sm:p-8 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-2" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Quick links skeleton */}
      <div>
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-32 mb-4 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function RolesListSkeleton() {
  return (
    <div className="space-y-4">
      <RoleCardSkeleton />
      <RoleCardSkeleton />
      <RoleCardSkeleton />
    </div>
  );
}

export function ProjectsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
}

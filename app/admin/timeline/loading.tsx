/**
 * Loading state for Timeline admin page
 */

export default function Loading() {
  return (
    <div className="space-y-6 pb-20 lg:pb-8 w-full max-w-full overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="mt-2 h-4 w-96 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-48 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
      </div>

      {/* Info Box Skeleton */}
      <div className="backdrop-blur-xl bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
            <div className="h-3 w-full bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
              <div className="w-16 h-16 bg-zinc-300 dark:bg-zinc-600 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-zinc-300 dark:bg-zinc-600 rounded-lg animate-pulse" />
                <div className="w-10 h-10 bg-zinc-300 dark:bg-zinc-600 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

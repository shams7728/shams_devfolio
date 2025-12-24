/**
 * Loading state for Theme Settings page
 */

export default function Loading() {
  return (
    <div className="space-y-6 pb-20 lg:pb-8 w-full max-w-4xl">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
      </div>

      {/* Info Banner Skeleton */}
      <div className="backdrop-blur-xl bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
            <div className="h-3 w-full bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6 space-y-6">
        {/* Accent Color Skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
            <div className="flex-1 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Animation Speed Skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>

        {/* Default Theme Skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex-1 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
          <div className="h-12 w-full sm:w-40 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

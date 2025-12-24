/**
 * Loading state for admin metrics page
 */

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="mt-2 h-4 w-96 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        </div>
        <div className="h-12 w-48 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
                <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
                <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

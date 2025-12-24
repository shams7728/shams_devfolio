/**
 * Admin Messages Loading State
 * 
 * Loading skeleton for the contact messages page
 */

export default function AdminMessagesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-8 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-2">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Message Cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="rounded-xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-6"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

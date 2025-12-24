/**
 * Role Page Loading State
 * 
 * Loading skeleton for role details page
 * Requirements: 8.2
 */

export default function RoleLoading() {
  return (
    <main className="w-full overflow-x-hidden bg-zinc-50 dark:bg-black">
      {/* Back link skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-32 animate-pulse" />
      </div>

      {/* Role header skeleton */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8 animate-pulse">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
            <div className="flex-1 w-full space-y-4">
              <div className="h-12 sm:h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-3/4" />
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects section skeleton */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-8 sm:mb-12 w-48 animate-pulse" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <div className="w-16 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                    <div className="w-20 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

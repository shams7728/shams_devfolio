/**
 * Homepage Loading State
 * 
 * Loading skeleton for homepage
 * Requirements: 8.2
 */

export default function HomeLoading() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero skeleton */}
      <section className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center w-full animate-pulse">
          <div className="h-20 sm:h-24 md:h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-6 mx-auto max-w-3xl" />
          <div className="h-6 sm:h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl mx-auto max-w-2xl" />
        </div>
      </section>

      {/* Roles grid skeleton */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-12 mx-auto max-w-md animate-pulse" />
          
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

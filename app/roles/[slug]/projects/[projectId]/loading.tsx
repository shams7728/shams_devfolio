/**
 * Project Page Loading State
 * 
 * Loading skeleton for project details page
 * Requirements: 8.2
 */

export default function ProjectLoading() {
  return (
    <main className="w-full overflow-x-hidden bg-zinc-50 dark:bg-black">
      {/* Breadcrumb skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-64 animate-pulse" />
      </div>

      {/* Project header skeleton */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Cover image skeleton */}
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl bg-zinc-200 dark:bg-zinc-800 mb-8 sm:mb-12 animate-pulse" />

          {/* Title and description skeleton */}
          <div className="mb-8 sm:mb-12 space-y-6 animate-pulse">
            <div className="h-12 sm:h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-3/4" />
            <div className="space-y-3">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-5/6" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40" />
              <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40" />
            </div>
          </div>

          {/* Tech stack skeleton */}
          <div className="mb-8 sm:mb-12 animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-48 mb-6" />
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-20" />
              ))}
            </div>
          </div>

          {/* Description skeleton */}
          <div className="mb-8 sm:mb-12 animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-56 mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
            </div>
          </div>

          {/* Gallery skeleton */}
          <div className="mb-8 sm:mb-12 animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-32 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Skills Page Loading State
 */

import { NavigationBar } from '@/components/navigation-bar';
import { PageTransition } from '@/components/page-transition';

export default function SkillsLoading() {
  return (
    <PageTransition>
      <main className="w-full overflow-x-hidden bg-zinc-50 dark:bg-black min-h-screen">
        <NavigationBar />

        {/* Header Skeleton */}
        <div className="w-full bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-black border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-6 animate-pulse"></div>
            <div className="h-12 w-96 bg-zinc-200 dark:bg-zinc-800 rounded mb-4 animate-pulse"></div>
            <div className="h-6 w-full max-w-3xl bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Bar Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Category Filter Skeleton */}
          <div className="mb-8">
            <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-4 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* 3D Visualization Skeleton */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-lg overflow-hidden border border-zinc-800">
              <div className="w-full h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-zinc-400">Loading tech ecosystem...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Grid Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => (
                      <div
                        key={j}
                        className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}

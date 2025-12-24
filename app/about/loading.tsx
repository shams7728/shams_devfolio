/**
 * About Page Loading State
 */

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>
      </section>

      {/* What Drives Me Section Skeleton */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-12 max-w-md mx-auto animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mb-6 mx-auto animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section Skeleton */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 max-w-md mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-12 max-w-2xl mx-auto animate-pulse"></div>
          
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section Skeleton */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 max-w-md mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-12 max-w-2xl mx-auto animate-pulse"></div>
          
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

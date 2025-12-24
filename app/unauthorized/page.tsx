/**
 * Unauthorized Page
 * 
 * Displayed when an authenticated user tries to access admin routes
 * without proper permissions.
 * 
 * Requirements: 3.3
 */

import Link from 'next/link';

export const metadata = {
  title: 'Unauthorized | Access Denied',
  description: 'You do not have permission to access this page',
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-zinc-900 dark:text-white mb-4">
            403
          </h1>
          <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Access Denied
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

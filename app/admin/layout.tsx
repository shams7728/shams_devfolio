/**
 * Admin Dashboard Layout
 * 
 * Provides the layout structure for all admin pages including
 * sidebar navigation, user info, and logout functionality.
 * Features glassmorphism design with gradients.
 * 
 * Requirements: 3.1, 3.4
 */

import { getCurrentUser } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { AdminSidebar } from './sidebar';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your portfolio content',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify authentication (middleware already checked, but double-check)
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-zinc-50 via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Header with glassmorphism */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {/* Logo/Home Link */}
              <Link 
                href="/admin"
                className="flex items-center gap-2 group min-w-0"
              >
                <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                    />
                  </svg>
                </div>
                <h1 className="hidden sm:block text-lg lg:text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent truncate">
                  Admin Dashboard
                </h1>
              </Link>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50">
                <div className="text-sm">
                  <div className="font-medium text-zinc-900 dark:text-white truncate max-w-[120px]">
                    {user.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </div>
                </div>
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full max-w-7xl mx-auto pb-16 lg:pb-0">
        {/* Sidebar Navigation */}
        <AdminSidebar userRole={user.role} />

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

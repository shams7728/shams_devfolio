/**
 * Admin Dashboard Home Page
 * 
 * Main dashboard page showing overview stats and quick links.
 * Features glassmorphism design with gradients.
 * 
 * Requirements: 3.1, 3.4
 */

import { getCurrentUser } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';
import { roleQueries } from '@/lib/supabase/queries';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  // Fetch statistics
  const roles = await roleQueries.getAll(supabase, false);
  const publishedRoles = roles.filter(r => r.is_published);
  
  // Get total projects count
  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });
  
  // Get published projects count
  const { count: publishedProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  const stats = [
    {
      label: 'Total Roles',
      value: roles.length,
      published: publishedRoles.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Projects',
      value: totalProjects || 0,
      published: publishedProjects || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Published Content',
      value: `${Math.round(((publishedRoles.length + (publishedProjects || 0)) / (roles.length + (totalProjects || 0) || 1)) * 100)}%`,
      subtitle: `${publishedRoles.length + (publishedProjects || 0)} of ${roles.length + (totalProjects || 0)} items`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const quickLinks = [
    {
      title: 'Manage Roles',
      description: 'Add, edit, or reorder your professional roles',
      href: '/admin/roles',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Manage Projects',
      description: 'Create and update project showcases',
      href: '/admin/projects',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  if (user?.role === 'super_admin') {
    quickLinks.push({
      title: 'Manage Users',
      description: 'Control admin access and permissions',
      href: '/admin/users',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-500',
    });
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 lg:pb-8">
      {/* Welcome Header */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-900/20 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Manage your portfolio content and track your published work.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-900/20 p-6 relative overflow-hidden group"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stat.value}
                </p>
                {stat.published !== undefined && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {stat.published} published
                  </p>
                )}
                {stat.subtitle && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="block backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-900/20 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${link.gradient} shadow-lg mb-4`}>
                  <div className="text-white">
                    {link.icon}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-zinc-900 group-hover:to-zinc-700 dark:group-hover:from-white dark:group-hover:to-zinc-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                  {link.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {link.description}
                </p>
                
                <div className="mt-4 flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  <span>Go to {link.title.toLowerCase()}</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* View Public Site */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-500/5 dark:to-purple-600/5 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
              View Your Portfolio
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              See how your portfolio looks to visitors
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
          >
            <span>Open Site</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

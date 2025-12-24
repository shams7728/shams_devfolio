/**
 * Login Page
 * 
 * Provides email/password authentication for admin users.
 * Redirects to admin dashboard on successful login.
 * 
 * Requirements: 3.1, 3.2
 */

import { LoginForm } from './login-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Login | Admin Dashboard',
  description: 'Sign in to access the admin dashboard',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Admin Login
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sign in to access the dashboard
            </p>
          </div>
          
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

# Authentication System

This directory contains the authentication system for the multi-role portfolio platform.

## Overview

The authentication system provides secure access control for the admin dashboard using Supabase Auth. It implements email/password authentication, session management, and role-based access control.

## Requirements

- **3.1**: Unauthenticated users are redirected to login page
- **3.2**: Valid credentials grant access to admin dashboard
- **3.3**: Expired sessions require re-authentication
- **3.4**: Super admins can manage other administrators

## Components

### `lib/auth/auth.ts`

Core authentication utilities:

- `getCurrentUser()` - Get the current authenticated user (server-side)
- `isAuthenticated()` - Check if user is authenticated (server-side)
- `isAdmin()` - Check if user has admin role (server-side)
- `isSuperAdmin()` - Check if user has super_admin role (server-side)
- `signIn(email, password)` - Sign in with credentials (client-side)
- `signOut()` - Sign out current user (client-side)
- `getSession()` - Get current session (client-side)
- `requireAdmin()` - Verify admin access or throw error (server-side)
- `requireSuperAdmin()` - Verify super admin access or throw error (server-side)

### `middleware.ts`

Next.js middleware that:

- Protects `/admin/*` routes by verifying authentication
- Refreshes expired sessions automatically
- Redirects unauthenticated users to `/login`
- Redirects authenticated non-admins to `/unauthorized`
- Redirects authenticated users away from `/login` to `/admin`

### Login Pages

- `app/login/page.tsx` - Login page layout
- `app/login/login-form.tsx` - Login form component with validation

### Admin Dashboard

- `app/admin/layout.tsx` - Admin dashboard layout with user info
- `app/admin/logout-button.tsx` - Logout button component
- `app/admin/page.tsx` - Admin dashboard home page

### Error Pages

- `app/unauthorized/page.tsx` - Shown when user lacks admin permissions

## Usage

### Server Components

```typescript
import { getCurrentUser, requireAdmin } from '@/lib/auth';

// Get current user (returns null if not authenticated)
const user = await getCurrentUser();

// Require admin access (throws error if not admin)
const user = await requireAdmin();
```

### Client Components

```typescript
'use client';

import { signIn, signOut } from '@/lib/auth';

// Sign in
await signIn('admin@example.com', 'password');

// Sign out
await signOut();
```

### API Routes

```typescript
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  // Verify admin access
  const user = await requireAdmin();
  
  // Process request...
}
```

## Session Management

- Sessions are automatically refreshed by the middleware
- Session tokens are stored in HTTP-only cookies
- Token refresh happens transparently when accessing protected routes
- Expired sessions trigger redirect to login page

## Security Features

1. **HTTP-only cookies**: Session tokens are not accessible to JavaScript
2. **Automatic token refresh**: Sessions are refreshed before expiration
3. **Role-based access control**: Separate admin and super_admin roles
4. **Middleware protection**: All admin routes are protected at the edge
5. **Server-side verification**: Authentication is verified on the server

## Testing

To test the authentication system:

1. Ensure you have a user in the Supabase `users` table with role `admin` or `super_admin`
2. The user's `id` must match their `auth.users.id` in Supabase Auth
3. Navigate to `/login` and sign in with credentials
4. You should be redirected to `/admin` dashboard
5. Try accessing `/admin` without authentication - should redirect to `/login`
6. Sign out and verify redirect to `/login`

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

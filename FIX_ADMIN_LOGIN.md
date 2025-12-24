# Fix Admin Login Issue

## Problem
You're getting a 403 Access Denied error because the RLS (Row Level Security) policies on the `users` table are too restrictive. Users cannot read their own records, which prevents the middleware from verifying admin roles after login.

## Solution

Run this SQL in your Supabase SQL Editor:

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Click **New query**

### Step 2: Run This SQL

```sql
-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Super admins can read all users" ON users;

-- Allow users to read their own record (REQUIRED for login to work)
CREATE POLICY "Users can read own record"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow super admins to read all users
CREATE POLICY "Super admins can read all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );
```

### Step 3: Click "Run" (or press Ctrl+Enter)

### Step 4: Verify the Fix

Run the verification script:
```bash
npx tsx scripts/check-full-setup.ts
```

You should see:
```
✓ RLS policies are configured correctly
Users can read their own records
```

### Step 5: Try Logging In Again

1. Go to http://localhost:3000/login
2. Use one of your admin emails:
   - shamsmansoori5@gmail.com
   - shamsmansoori77@gmail.com
   - shamsmohd567@gmail.com
   - shamsmansoori567@gmail.com
3. Enter your password
4. You should now be able to access /admin

## Why This Happened

The original RLS policy only allowed super admins to read user records, but it didn't allow regular users to read their own record. When you log in, the middleware needs to check your role by reading your record from the `users` table. Without the "Users can read own record" policy, this check fails, resulting in the 403 error.

## What This Fix Does

1. **Drops the old policy** - Removes the restrictive policy
2. **Adds "Users can read own record"** - Allows any authenticated user to read their own record (required for login)
3. **Re-adds "Super admins can read all users"** - Allows super admins to manage other users

This is a standard security pattern - users can see their own data, but only super admins can see everyone's data.

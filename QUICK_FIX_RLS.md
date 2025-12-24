# Quick Fix for RLS Issue

## The Problem

The users table RLS policies are too restrictive. Users cannot read their own record, which prevents authentication from working.

## The Solution

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Super admins can read all users" ON users;

-- Allow users to read their own record
CREATE POLICY "Users can read own record"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Super admins can read all users
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

## Steps:

1. Go to your Supabase Dashboard
2. Click on **SQL Editor**
3. Click **"New query"**
4. Copy and paste the SQL above
5. Click **"Run"**
6. You should see "Success. No rows returned"

## Test It:

After running the SQL:

1. Go to `http://localhost:3000/login`
2. Enter your credentials:
   - Email: `shamsmohd567@gmail.com`
   - Password: (your password)
3. Click "Sign In"
4. You should now be able to access `/admin`!

## What This Does:

- **Before:** Only super admins could read from the users table
- **After:** Users can read their OWN record + super admins can read ALL records
- This allows the authentication system to verify user roles properly

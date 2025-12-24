-- =====================================================
-- Fix RLS Infinite Recursion on Users Table
-- =====================================================
-- 
-- Problem: The "Super admins can read all users" policy causes
-- infinite recursion because it queries the users table to check
-- if the current user is a super admin.
--
-- Solution: Drop the recursive policy and rely on the simple
-- "Users can read own record" policy. Super admins can use the
-- service role key for admin operations.

-- Drop ALL existing policies on users table
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Super admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Super admins can manage users" ON users;

-- Create simple, non-recursive policy
-- This allows any authenticated user to read their own record
CREATE POLICY "Users can read own record"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Note: For super admin operations (managing other users),
-- use the service role key in API routes, not RLS policies.
-- This prevents infinite recursion.

-- Verify RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

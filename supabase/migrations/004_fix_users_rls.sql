-- =====================================================
-- Fix Users Table RLS Policies
-- =====================================================
-- 
-- Issue: Users cannot read their own record from the users table
-- This prevents authentication from working properly
-- 
-- Solution: Add a policy allowing users to read their own record

-- Drop existing restrictive policy if it exists
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

-- Note: The "Users can read own record" policy will allow any authenticated user
-- to read their own record, which is necessary for the getCurrentUser() function
-- to work. The super admin policy allows super admins to read ALL user records.

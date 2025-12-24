-- =====================================================
-- Fix RLS Policies - Remove Infinite Recursion
-- =====================================================
-- This migration fixes the infinite recursion issue in RLS policies
-- by using a SECURITY DEFINER function that bypasses RLS when checking user roles

-- =====================================================
-- CREATE HELPER FUNCTION
-- =====================================================

-- Function to check if current user is an admin
-- SECURITY DEFINER allows this function to bypass RLS on the users table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DROP EXISTING ADMIN POLICIES
-- =====================================================

-- Drop roles table admin policies (keep public read policy)
DROP POLICY IF EXISTS "Admins can read all roles" ON roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON roles;
DROP POLICY IF EXISTS "Admins can update roles" ON roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON roles;

-- Drop projects table admin policies (keep public read policy)
DROP POLICY IF EXISTS "Admins can read all projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
DROP POLICY IF EXISTS "Admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;

-- =====================================================
-- RECREATE ROLES TABLE POLICIES
-- =====================================================

-- Authenticated admins can read all roles
CREATE POLICY "Admins can read all roles"
  ON roles
  FOR SELECT
  USING (is_admin());

-- Authenticated admins can insert roles
CREATE POLICY "Admins can insert roles"
  ON roles
  FOR INSERT
  WITH CHECK (is_admin());

-- Authenticated admins can update roles
CREATE POLICY "Admins can update roles"
  ON roles
  FOR UPDATE
  USING (is_admin());

-- Authenticated admins can delete roles
CREATE POLICY "Admins can delete roles"
  ON roles
  FOR DELETE
  USING (is_admin());

-- =====================================================
-- RECREATE PROJECTS TABLE POLICIES
-- =====================================================

-- Authenticated admins can read all projects
CREATE POLICY "Admins can read all projects"
  ON projects
  FOR SELECT
  USING (is_admin());

-- Authenticated admins can insert projects
CREATE POLICY "Admins can insert projects"
  ON projects
  FOR INSERT
  WITH CHECK (is_admin());

-- Authenticated admins can update projects
CREATE POLICY "Admins can update projects"
  ON projects
  FOR UPDATE
  USING (is_admin());

-- Authenticated admins can delete projects
CREATE POLICY "Admins can delete projects"
  ON projects
  FOR DELETE
  USING (is_admin());

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION is_admin() IS 'Helper function to check if current user is an admin or super_admin. Uses SECURITY DEFINER to bypass RLS on users table and prevent infinite recursion.';

-- =====================================================
-- Storage Buckets and Policies Setup
-- =====================================================

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for role icons
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'role-icons',
  'role-icons',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES - PROJECT IMAGES
-- =====================================================

-- Public read access to project images
CREATE POLICY "Public can read project images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

-- Authenticated admins can upload project images
CREATE POLICY "Admins can upload project images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update project images
CREATE POLICY "Admins can update project images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'project-images'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can delete project images
CREATE POLICY "Admins can delete project images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'project-images'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- STORAGE POLICIES - ROLE ICONS
-- =====================================================

-- Public read access to role icons
CREATE POLICY "Public can read role icons"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'role-icons');

-- Authenticated admins can upload role icons
CREATE POLICY "Admins can upload role icons"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'role-icons'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update role icons
CREATE POLICY "Admins can update role icons"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'role-icons'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can delete role icons
CREATE POLICY "Admins can delete role icons"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'role-icons'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

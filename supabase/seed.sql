-- =====================================================
-- Seed Data for Development and Testing
-- =====================================================

-- NOTE: This seed file is for development/testing purposes only
-- In production, the first super admin should be created manually
-- through Supabase Auth dashboard and then added to the users table

-- =====================================================
-- SAMPLE SUPER ADMIN USER
-- =====================================================

-- This is a placeholder. In production:
-- 1. Create user through Supabase Auth dashboard
-- 2. Get the user's UUID from auth.users
-- 3. Insert into users table with super_admin role

-- Example for development (replace with actual auth user ID):
-- INSERT INTO users (id, email, role)
-- VALUES (
--   'YOUR-AUTH-USER-UUID-HERE',
--   'admin@example.com',
--   'super_admin'
-- );

-- =====================================================
-- SAMPLE ROLES (for testing)
-- =====================================================

INSERT INTO roles (title, description, slug, is_published, display_order)
VALUES
  (
    'Web Developer',
    'Full-stack web development with modern frameworks and technologies',
    'web-developer',
    true,
    1
  ),
  (
    'Data Analyst',
    'Data analysis, visualization, and insights using Python and SQL',
    'data-analyst',
    true,
    2
  ),
  (
    'Mobile Developer',
    'Cross-platform mobile app development with Flutter',
    'mobile-developer',
    false,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SAMPLE PROJECTS (for testing)
-- =====================================================

-- Get role IDs for reference
DO $$
DECLARE
  web_dev_id UUID;
  data_analyst_id UUID;
BEGIN
  -- Get role IDs
  SELECT id INTO web_dev_id FROM roles WHERE slug = 'web-developer';
  SELECT id INTO data_analyst_id FROM roles WHERE slug = 'data-analyst';

  -- Insert sample projects for Web Developer role
  IF web_dev_id IS NOT NULL THEN
    INSERT INTO projects (
      role_id,
      title,
      short_description,
      long_description,
      tech_stack,
      github_url,
      live_url,
      cover_image_url,
      gallery_urls,
      is_published,
      display_order
    )
    VALUES
      (
        web_dev_id,
        'E-Commerce Platform',
        'A modern e-commerce platform with real-time inventory management',
        'Built a full-featured e-commerce platform with Next.js, featuring real-time inventory updates, secure payment processing with Stripe, and an admin dashboard for order management. The platform handles thousands of products and supports multiple payment methods.',
        ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL'],
        'https://github.com/example/ecommerce',
        'https://ecommerce-demo.vercel.app',
        'https://placehold.co/800x600/png',
        ARRAY['https://placehold.co/800x600/png', 'https://placehold.co/800x600/png'],
        true,
        1
      ),
      (
        web_dev_id,
        'Task Management App',
        'Collaborative task management with real-time updates',
        'Developed a collaborative task management application with real-time synchronization using Supabase. Features include team workspaces, drag-and-drop task organization, deadline tracking, and notification system.',
        ARRAY['React', 'Supabase', 'Framer Motion', 'Zustand'],
        'https://github.com/example/taskapp',
        'https://taskapp-demo.vercel.app',
        'https://placehold.co/800x600/png',
        ARRAY['https://placehold.co/800x600/png'],
        true,
        2
      )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert sample projects for Data Analyst role
  IF data_analyst_id IS NOT NULL THEN
    INSERT INTO projects (
      role_id,
      title,
      short_description,
      long_description,
      tech_stack,
      github_url,
      cover_image_url,
      gallery_urls,
      is_published,
      display_order
    )
    VALUES
      (
        data_analyst_id,
        'Sales Analytics Dashboard',
        'Interactive dashboard for sales performance analysis',
        'Created an interactive sales analytics dashboard using Python and Plotly. The dashboard provides real-time insights into sales trends, customer behavior, and revenue forecasts. Integrated with multiple data sources and automated daily reports.',
        ARRAY['Python', 'Pandas', 'Plotly', 'SQL', 'Jupyter'],
        'https://github.com/example/sales-dashboard',
        'https://placehold.co/800x600/png',
        ARRAY['https://placehold.co/800x600/png', 'https://placehold.co/800x600/png'],
        true,
        1
      )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

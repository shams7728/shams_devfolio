-- =====================================================
-- Portfolio Advanced Features
-- Database Schema Extension Migration
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

-- Impact Metrics table
-- Stores quantifiable achievement statistics displayed on the homepage
CREATE TABLE IF NOT EXISTS impact_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 0),
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Timeline Milestones table
-- Stores professional journey milestones for the growth timeline
CREATE TABLE IF NOT EXISTS timeline_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact Messages table
-- Stores messages submitted through the contact form
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Theme Settings table
-- Stores global theme customization settings (single row table)
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accent_color TEXT NOT NULL DEFAULT '#3b82f6' CHECK (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  animation_speed NUMERIC(3,2) NOT NULL DEFAULT 1.0 CHECK (animation_speed >= 0.5 AND animation_speed <= 2.0),
  default_theme TEXT NOT NULL DEFAULT 'system' CHECK (default_theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Role Backgrounds table
-- Stores custom background animation configurations for each role
CREATE TABLE IF NOT EXISTS role_backgrounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  animation_type TEXT NOT NULL CHECK (animation_type IN ('data-grid', 'code-lines', 'ui-components', 'database-shapes', 'custom')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(role_id)
);

-- Workflow Stages table
-- Stores customizable workflow/process stages
CREATE TABLE IF NOT EXISTS workflow_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Impact Metrics indexes
CREATE INDEX IF NOT EXISTS idx_impact_metrics_display_order ON impact_metrics(display_order);
CREATE INDEX IF NOT EXISTS idx_impact_metrics_is_published ON impact_metrics(is_published);
CREATE INDEX IF NOT EXISTS idx_impact_metrics_published_order ON impact_metrics(is_published, display_order) WHERE is_published = true;

-- Timeline Milestones indexes
CREATE INDEX IF NOT EXISTS idx_timeline_milestones_year ON timeline_milestones(year);
CREATE INDEX IF NOT EXISTS idx_timeline_milestones_display_order ON timeline_milestones(display_order);
CREATE INDEX IF NOT EXISTS idx_timeline_milestones_year_order ON timeline_milestones(year, display_order);

-- Contact Messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created ON contact_messages(status, created_at DESC);

-- Role Backgrounds indexes
CREATE INDEX IF NOT EXISTS idx_role_backgrounds_role_id ON role_backgrounds(role_id);

-- Workflow Stages indexes
CREATE INDEX IF NOT EXISTS idx_workflow_stages_display_order ON workflow_stages(display_order);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for impact_metrics table
CREATE TRIGGER update_impact_metrics_updated_at
  BEFORE UPDATE ON impact_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for timeline_milestones table
CREATE TRIGGER update_timeline_milestones_updated_at
  BEFORE UPDATE ON timeline_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for theme_settings table
CREATE TRIGGER update_theme_settings_updated_at
  BEFORE UPDATE ON theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for role_backgrounds table
CREATE TRIGGER update_role_backgrounds_updated_at
  BEFORE UPDATE ON role_backgrounds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for workflow_stages table
CREATE TRIGGER update_workflow_stages_updated_at
  BEFORE UPDATE ON workflow_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_stages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- IMPACT METRICS POLICIES
-- =====================================================

-- Public read access to published metrics
CREATE POLICY "Public can read published impact metrics"
  ON impact_metrics
  FOR SELECT
  USING (is_published = true);

-- Authenticated admins can read all metrics
CREATE POLICY "Admins can read all impact metrics"
  ON impact_metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can insert metrics
CREATE POLICY "Admins can insert impact metrics"
  ON impact_metrics
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update metrics
CREATE POLICY "Admins can update impact metrics"
  ON impact_metrics
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can delete metrics
CREATE POLICY "Admins can delete impact metrics"
  ON impact_metrics
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- TIMELINE MILESTONES POLICIES
-- =====================================================

-- Public read access to all timeline milestones
CREATE POLICY "Public can read timeline milestones"
  ON timeline_milestones
  FOR SELECT
  USING (true);

-- Authenticated admins can insert milestones
CREATE POLICY "Admins can insert timeline milestones"
  ON timeline_milestones
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update milestones
CREATE POLICY "Admins can update timeline milestones"
  ON timeline_milestones
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can delete milestones
CREATE POLICY "Admins can delete timeline milestones"
  ON timeline_milestones
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- CONTACT MESSAGES POLICIES
-- =====================================================

-- Public can insert contact messages (form submission)
CREATE POLICY "Public can submit contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Authenticated admins can read all messages
CREATE POLICY "Admins can read contact messages"
  ON contact_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update messages (status changes)
CREATE POLICY "Admins can update contact messages"
  ON contact_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can delete messages
CREATE POLICY "Admins can delete contact messages"
  ON contact_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- THEME SETTINGS POLICIES
-- =====================================================

-- Public read access to theme settings
CREATE POLICY "Public can read theme settings"
  ON theme_settings
  FOR SELECT
  USING (true);

-- Authenticated admins can insert theme settings
CREATE POLICY "Admins can insert theme settings"
  ON theme_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update theme settings
CREATE POLICY "Admins can update theme settings"
  ON theme_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- ROLE BACKGROUNDS POLICIES
-- =====================================================

-- Public read access to role backgrounds
CREATE POLICY "Public can read role backgrounds"
  ON role_backgrounds
  FOR SELECT
  USING (true);

-- Authenticated admins can insert role backgrounds
CREATE POLICY "Admins can insert role backgrounds"
  ON role_backgrounds
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update role backgrounds
CREATE POLICY "Admins can update role backgrounds"
  ON role_backgrounds
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can delete role backgrounds
CREATE POLICY "Admins can delete role backgrounds"
  ON role_backgrounds
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- WORKFLOW STAGES POLICIES
-- =====================================================

-- Public read access to workflow stages
CREATE POLICY "Public can read workflow stages"
  ON workflow_stages
  FOR SELECT
  USING (true);

-- Authenticated admins can insert workflow stages
CREATE POLICY "Admins can insert workflow stages"
  ON workflow_stages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can update workflow stages
CREATE POLICY "Admins can update workflow stages"
  ON workflow_stages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated admins can delete workflow stages
CREATE POLICY "Admins can delete workflow stages"
  ON workflow_stages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default theme settings (single row)
INSERT INTO theme_settings (accent_color, animation_speed, default_theme)
VALUES ('#3b82f6', 1.0, 'system')
ON CONFLICT DO NOTHING;

-- Insert default workflow stages
INSERT INTO workflow_stages (title, description, icon, display_order) VALUES
  ('Understand', 'Gather requirements and understand the problem space', '🔍', 1),
  ('Analyze', 'Analyze data and identify patterns and insights', '📊', 2),
  ('Design', 'Create architecture and design solutions', '🎨', 3),
  ('Build', 'Implement the solution with best practices', '🔨', 4),
  ('Test', 'Validate functionality and ensure quality', '✅', 5),
  ('Deploy', 'Release to production and monitor performance', '🚀', 6)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE impact_metrics IS 'Quantifiable achievement statistics displayed on the homepage';
COMMENT ON TABLE timeline_milestones IS 'Professional journey milestones for the growth timeline';
COMMENT ON TABLE contact_messages IS 'Messages submitted through the contact form';
COMMENT ON TABLE theme_settings IS 'Global theme customization settings (single row table)';
COMMENT ON TABLE role_backgrounds IS 'Custom background animation configurations for each role';
COMMENT ON TABLE workflow_stages IS 'Customizable workflow/process stages';

COMMENT ON COLUMN impact_metrics.display_order IS 'Order in which metrics appear on the homepage';
COMMENT ON COLUMN timeline_milestones.year IS 'Year of the milestone (1900-2100)';
COMMENT ON COLUMN timeline_milestones.display_order IS 'Order for milestones within the same year';
COMMENT ON COLUMN contact_messages.status IS 'Message status: new, read, or archived';
COMMENT ON COLUMN theme_settings.accent_color IS 'Hex color code for accent color (e.g., #3b82f6)';
COMMENT ON COLUMN theme_settings.animation_speed IS 'Animation speed multiplier (0.5 - 2.0)';
COMMENT ON COLUMN role_backgrounds.animation_type IS 'Type of background animation for the role';
COMMENT ON COLUMN role_backgrounds.config IS 'JSON configuration for the animation';
COMMENT ON COLUMN workflow_stages.display_order IS 'Order in which stages appear in the workflow';

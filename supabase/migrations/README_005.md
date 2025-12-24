# Migration 005: Advanced Features Schema

## Overview

This migration extends the database schema to support advanced portfolio features including 3D visuals, animations, impact metrics, timeline, contact form, theme customization, and workflow visualization.

## Created Tables

### 1. impact_metrics
Stores quantifiable achievement statistics displayed on the homepage.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `title` (TEXT) - Metric title (e.g., "Projects Delivered")
- `value` (INTEGER) - Numeric value (must be >= 0)
- `icon` (TEXT, nullable) - Icon identifier or emoji
- `display_order` (INTEGER) - Display order on homepage
- `is_published` (BOOLEAN) - Visibility flag
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `idx_impact_metrics_display_order` - For ordering
- `idx_impact_metrics_is_published` - For filtering published
- `idx_impact_metrics_published_order` - Composite for published + ordered

**RLS Policies:**
- Public: Read published metrics
- Admins: Full CRUD access

---

### 2. timeline_milestones
Stores professional journey milestones for the animated growth timeline.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `year` (INTEGER) - Year of milestone (1900-2100)
- `title` (TEXT) - Milestone title
- `description` (TEXT) - Detailed description
- `display_order` (INTEGER) - Order within same year
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `idx_timeline_milestones_year` - For year filtering
- `idx_timeline_milestones_display_order` - For ordering
- `idx_timeline_milestones_year_order` - Composite for chronological display

**RLS Policies:**
- Public: Read all milestones
- Admins: Full CRUD access

---

### 3. contact_messages
Stores messages submitted through the contact form.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `name` (TEXT) - Sender name
- `email` (TEXT) - Sender email
- `message` (TEXT) - Message content
- `status` (TEXT) - Status: 'new', 'read', or 'archived'
- `created_at` (TIMESTAMPTZ) - Submission timestamp

**Indexes:**
- `idx_contact_messages_status` - For status filtering
- `idx_contact_messages_created_at` - For chronological sorting
- `idx_contact_messages_status_created` - Composite for filtered sorting

**RLS Policies:**
- Public: Insert only (form submission)
- Admins: Read, update, delete

---

### 4. theme_settings
Stores global theme customization settings (single row table).

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `accent_color` (TEXT) - Hex color code (e.g., #3b82f6)
- `animation_speed` (NUMERIC) - Speed multiplier (0.5 - 2.0)
- `default_theme` (TEXT) - Default theme: 'light', 'dark', or 'system'
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Constraints:**
- `accent_color` must match hex pattern: `^#[0-9A-Fa-f]{6}$`
- `animation_speed` must be between 0.5 and 2.0
- `default_theme` must be one of: 'light', 'dark', 'system'

**RLS Policies:**
- Public: Read settings
- Admins: Insert, update

---

### 5. role_backgrounds
Stores custom background animation configurations for each role.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `role_id` (UUID, FK) - References roles.id
- `animation_type` (TEXT) - Animation type
- `config` (JSONB) - JSON configuration object
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Animation Types:**
- `data-grid` - Animated data grid patterns
- `code-lines` - Animated code line strokes
- `ui-components` - Soft UI component outlines
- `database-shapes` - Floating table/column shapes
- `custom` - Custom configuration

**Constraints:**
- `UNIQUE(role_id)` - One background per role
- `ON DELETE CASCADE` - Delete background when role is deleted

**Indexes:**
- `idx_role_backgrounds_role_id` - For role lookups

**RLS Policies:**
- Public: Read all backgrounds
- Admins: Full CRUD access

---

### 6. workflow_stages
Stores customizable workflow/process stages.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `title` (TEXT) - Stage title
- `description` (TEXT) - Stage description
- `icon` (TEXT, nullable) - Icon identifier or emoji
- `display_order` (INTEGER) - Display order in workflow
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `idx_workflow_stages_display_order` - For ordering

**RLS Policies:**
- Public: Read all stages
- Admins: Full CRUD access

---

## Seed Data

### Default Theme Settings
```sql
accent_color: '#3b82f6' (Blue)
animation_speed: 1.0
default_theme: 'system'
```

### Default Workflow Stages
1. 🔍 Understand - Gather requirements and understand the problem space
2. 📊 Analyze - Analyze data and identify patterns and insights
3. 🎨 Design - Create architecture and design solutions
4. 🔨 Build - Implement the solution with best practices
5. ✅ Test - Validate functionality and ensure quality
6. 🚀 Deploy - Release to production and monitor performance

---

## Triggers

All tables (except `contact_messages`) have `updated_at` triggers that automatically update the timestamp on record modification.

---

## Foreign Keys

- `role_backgrounds.role_id` → `roles.id` (ON DELETE CASCADE)

---

## Application Instructions

### Via Supabase Dashboard (Recommended)
1. Open Supabase SQL Editor
2. Copy contents of `005_advanced_features_schema.sql`
3. Paste and execute

### Via Supabase CLI
```bash
supabase db push
```

### Verification
```bash
npx tsx scripts/verify-advanced-schema.ts
```

---

## TypeScript Types

Updated types are available in `lib/types/database.ts`:
- `ImpactMetric`
- `TimelineMilestone`
- `ContactMessage`
- `ThemeSettings`
- `RoleBackground`
- `WorkflowStage`

Plus corresponding Create/Update data types.

---

## Requirements Satisfied

This migration satisfies the following requirements:
- **3.5**: Impact metrics admin interface
- **5.4**: Workflow stages admin interface
- **9.4**: Timeline admin interface
- **11.4**: Contact form data storage
- **12.1**: Theme customization storage
- **2.7**: Role background configuration

---

## Next Steps

After applying this migration:
1. Verify tables exist: `npx tsx scripts/verify-advanced-schema.ts`
2. Proceed with Task 2: Install Three.js dependencies
3. Begin implementing advanced features

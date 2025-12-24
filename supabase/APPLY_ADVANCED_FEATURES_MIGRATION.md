# Apply Advanced Features Migration

This guide explains how to apply the advanced features database schema migration to your Supabase project.

## Migration File

The migration file is located at: `supabase/migrations/005_advanced_features_schema.sql`

## Option 1: Apply via Supabase Dashboard (Recommended)

This is the most reliable method to apply the migration.

### Steps:

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query" button

3. **Copy Migration SQL**
   - Open the file: `supabase/migrations/005_advanced_features_schema.sql`
   - Copy the entire contents

4. **Paste and Execute**
   - Paste the SQL into the SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

5. **Verify Success**
   - You should see a success message
   - Run the verification script: `npx tsx scripts/verify-advanced-schema.ts`

## Option 2: Apply via Supabase CLI (Alternative)

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push
```

## What This Migration Creates

The migration creates the following tables:

### 1. **impact_metrics**
- Stores quantifiable achievement statistics
- Fields: id, title, value, icon, display_order, is_published
- Used for homepage impact metrics display

### 2. **timeline_milestones**
- Stores professional journey milestones
- Fields: id, year, title, description, display_order
- Used for animated growth timeline

### 3. **contact_messages**
- Stores contact form submissions
- Fields: id, name, email, message, status
- Used for contact form functionality

### 4. **theme_settings**
- Stores global theme customization (single row)
- Fields: id, accent_color, animation_speed, default_theme
- Used for theme customization

### 5. **role_backgrounds**
- Stores custom background animations per role
- Fields: id, role_id, animation_type, config
- Used for role-specific background effects

### 6. **workflow_stages**
- Stores customizable workflow stages
- Fields: id, title, description, icon, display_order
- Used for workflow visualization

## Seed Data

The migration also inserts default data:

- **Default theme settings**: Blue accent (#3b82f6), 1.0x speed, system theme
- **Default workflow stages**: Understand → Analyze → Design → Build → Test → Deploy

## Row Level Security (RLS)

The migration includes comprehensive RLS policies:

- **Public access**: Published metrics, timeline, workflow stages, theme settings
- **Admin access**: Full CRUD on all tables
- **Contact form**: Public can submit, admins can manage

## Verification

After applying the migration, verify it worked:

```bash
npx tsx scripts/verify-advanced-schema.ts
```

You should see:
- ✅ All 6 tables exist and are accessible
- ✅ Default theme settings exist
- ✅ 6 default workflow stages exist

## Troubleshooting

### Tables Not Created

If tables are not created:
1. Check for SQL syntax errors in the Supabase dashboard
2. Ensure you have proper permissions
3. Try applying the migration in smaller chunks

### RLS Policy Errors

If you get RLS policy errors:
1. Ensure the `users` table exists (from migration 001)
2. Check that you're using the service role key for admin operations

### Seed Data Not Inserted

If seed data is missing:
1. Check if data already exists (ON CONFLICT DO NOTHING)
2. Manually insert using the Supabase dashboard

## Need Help?

If you encounter issues:
1. Check the Supabase dashboard logs
2. Verify your environment variables in `.env.local`
3. Ensure previous migrations (001-004) were applied successfully

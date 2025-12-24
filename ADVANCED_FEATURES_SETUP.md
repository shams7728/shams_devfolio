# Advanced Features Setup Guide

This guide will help you set up the database schema for the portfolio advanced features.

## Prerequisites

- Supabase project set up and configured
- Environment variables configured in `.env.local`
- Previous migrations (001-004) applied successfully

## Step 1: Apply the Database Migration

The database schema for advanced features is defined in:
```
supabase/migrations/005_advanced_features_schema.sql
```

### Option A: Apply via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `brsohcswljcotifzmcmw`

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Execute Migration**
   - Open `supabase/migrations/005_advanced_features_schema.sql`
   - Copy the entire file contents
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Run verification: `npx tsx scripts/verify-advanced-schema.ts`

### Option B: Apply via Supabase CLI

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Link to your project
supabase link --project-ref brsohcswljcotifzmcmw

# Apply migrations
supabase db push
```

## Step 2: Verify the Migration

Run the verification script to ensure all tables were created:

```bash
npx tsx scripts/verify-advanced-schema.ts
```

Expected output:
```
✅ impact_metrics: Table exists and is accessible
✅ timeline_milestones: Table exists and is accessible
✅ contact_messages: Table exists and is accessible
✅ theme_settings: Table exists and is accessible
✅ role_backgrounds: Table exists and is accessible
✅ workflow_stages: Table exists and is accessible

✅ theme_settings: Default settings exist
   Accent color: #3b82f6
   Animation speed: 1
   Default theme: system

✅ workflow_stages: 6 default stages exist
   1. 🔍 Understand
   2. 📊 Analyze
   3. 🎨 Design
   4. 🔨 Build
   5. ✅ Test
   6. 🚀 Deploy
```

## What Was Created

### New Tables

1. **impact_metrics** - Quantifiable achievement statistics
   - Used for homepage impact metrics display
   - Admin-manageable through dashboard

2. **timeline_milestones** - Professional journey milestones
   - Used for animated growth timeline
   - Chronologically ordered by year

3. **contact_messages** - Contact form submissions
   - Public can submit, admins can manage
   - Status tracking: new, read, archived

4. **theme_settings** - Global theme customization
   - Single row table for site-wide settings
   - Controls accent color, animation speed, default theme

5. **role_backgrounds** - Role-specific background animations
   - Links to roles table
   - Configurable animation types and settings

6. **workflow_stages** - Customizable workflow visualization
   - Used for process/methodology display
   - Ordered stages with icons

### Default Data

- **Theme Settings**: Blue accent (#3b82f6), 1.0x animation speed, system theme
- **Workflow Stages**: 6 default stages (Understand → Analyze → Design → Build → Test → Deploy)

### Security (RLS Policies)

All tables have Row Level Security enabled:

- **Public Read**: Published metrics, timeline, workflow stages, theme settings, role backgrounds
- **Public Write**: Contact messages (form submission only)
- **Admin Full Access**: All CRUD operations on all tables

## Step 3: Update TypeScript Types

The TypeScript types have been updated in `lib/types/database.ts` to include:

- `ImpactMetric`
- `TimelineMilestone`
- `ContactMessage`
- `ThemeSettings`
- `RoleBackground`
- `WorkflowStage`

Plus corresponding Create/Update data types for each.

## Next Steps

After the migration is applied, you can proceed with implementing the advanced features:

1. **Task 2**: Install Three.js and 3D dependencies
2. **Task 3**: Create 3D floating portrait component
3. **Task 4**: Build role rotator with adaptive backgrounds
4. And so on...

## Troubleshooting

### Tables Not Created

If verification shows tables don't exist:
1. Check Supabase dashboard for error messages
2. Ensure you have proper permissions
3. Try applying the migration in smaller chunks
4. Check that previous migrations were applied

### RLS Policy Errors

If you get permission errors:
1. Ensure the `users` table exists
2. Verify you're logged in as an admin
3. Check RLS policies in Supabase dashboard

### Seed Data Missing

If default data wasn't inserted:
1. Check if data already exists (ON CONFLICT DO NOTHING)
2. Manually insert via Supabase dashboard
3. Check for constraint violations

## Manual Verification

You can also verify tables manually in Supabase:

1. Go to "Table Editor" in Supabase dashboard
2. You should see all 6 new tables listed
3. Click each table to view structure and data

## Need Help?

- Check `supabase/APPLY_ADVANCED_FEATURES_MIGRATION.md` for detailed migration guide
- Review the migration SQL file for table structures
- Check Supabase dashboard logs for errors

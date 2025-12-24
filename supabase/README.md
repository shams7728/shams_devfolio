# Supabase Backend Setup Guide

This directory contains all the database migrations, storage configurations, and setup instructions for the Dynamic Multi-Role Portfolio Platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup](#quick-setup)
3. [Database Schema](#database-schema)
4. [Storage Buckets](#storage-buckets)
5. [Row Level Security](#row-level-security)
6. [Creating Your First Admin User](#creating-your-first-admin-user)
7. [Running Migrations](#running-migrations)
8. [Environment Variables](#environment-variables)

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js 18+ installed
- Basic understanding of PostgreSQL

## Quick Setup

### Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Your portfolio name
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for the project to be created (takes ~2 minutes)

### Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 4: Run Database Migrations

You have two options:

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `migrations/001_initial_schema.sql`
5. Paste and click **Run**
6. Repeat for `migrations/002_storage_setup.sql`

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 5: Seed Sample Data (Optional)

For development/testing, you can load sample data:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents of `seed.sql`
3. Paste and click **Run**

## Database Schema

### Tables

#### `users`
Extended user metadata for admin users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users |
| email | TEXT | User email address |
| role | TEXT | Either 'super_admin' or 'admin' |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### `roles`
Professional roles/identities displayed on the portfolio.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Role title (e.g., "Web Developer") |
| description | TEXT | Role description |
| slug | TEXT | URL-friendly identifier (unique) |
| icon_url | TEXT | Optional icon/image URL |
| is_published | BOOLEAN | Visibility on public site |
| display_order | INTEGER | Order of appearance |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### `projects`
Portfolio projects associated with specific roles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| role_id | UUID | Foreign key to roles table |
| title | TEXT | Project title |
| short_description | TEXT | Brief description |
| long_description | TEXT | Detailed description |
| tech_stack | TEXT[] | Array of technologies |
| github_url | TEXT | GitHub repository URL |
| live_url | TEXT | Live demo URL |
| cover_image_url | TEXT | Cover image URL |
| gallery_urls | TEXT[] | Array of gallery image URLs |
| is_published | BOOLEAN | Visibility on public site |
| display_order | INTEGER | Order within role |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Relationships

- `projects.role_id` → `roles.id` (CASCADE DELETE)
- `users.id` → `auth.users.id` (CASCADE DELETE)

### Indexes

Optimized indexes for common queries:

- `roles`: slug, is_published, display_order, (is_published, display_order)
- `projects`: role_id, is_published, display_order, (role_id, is_published, display_order)

## Storage Buckets

### `project-images`
Stores project cover images and gallery images.

- **Public**: Yes (read-only for public)
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP
- **Folder Structure**: `/roles/{roleId}/projects/{projectId}/`

### `role-icons`
Stores role icons and images.

- **Public**: Yes (read-only for public)
- **File Size Limit**: 2MB
- **Allowed Types**: JPEG, PNG, WebP, SVG
- **Folder Structure**: `/roles/{roleId}/`

## Row Level Security

All tables have RLS enabled with the following policies:

### Public Access
- ✅ Read published roles
- ✅ Read published projects
- ✅ Read all storage bucket files

### Admin Access (authenticated users with admin/super_admin role)
- ✅ Read all roles (including unpublished)
- ✅ Read all projects (including unpublished)
- ✅ Create, update, delete roles
- ✅ Create, update, delete projects
- ✅ Upload, update, delete storage files

### Super Admin Access (authenticated users with super_admin role)
- ✅ All admin permissions
- ✅ Manage other admin users
- ✅ View all users

## Creating Your First Admin User

### Step 1: Create Auth User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter email and password
4. Click **Create User**
5. Copy the user's UUID (you'll need this)

### Step 2: Add to Users Table

1. Go to **SQL Editor**
2. Run this query (replace with your values):

```sql
INSERT INTO users (id, email, role)
VALUES (
  'paste-user-uuid-here',
  'your-email@example.com',
  'super_admin'
);
```

### Step 3: Verify

1. Go to **Table Editor** → **users**
2. You should see your user with super_admin role

## Running Migrations

### Manual Migration (Supabase Dashboard)

1. Open **SQL Editor**
2. Run migrations in order:
   - `001_initial_schema.sql`
   - `002_storage_setup.sql`
3. Optionally run `seed.sql` for sample data

### Automated Migration (Supabase CLI)

```bash
# Initialize Supabase locally
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Or reset and apply all migrations
supabase db reset
```

## Environment Variables

Required environment variables for your Next.js application:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Getting Your Keys

1. **Project URL**: Settings → API → Project URL
2. **Anon Key**: Settings → API → Project API keys → anon/public
3. **Service Role Key**: Settings → API → Project API keys → service_role

⚠️ **Important**: Never commit `.env.local` to version control!

## Verification Checklist

After setup, verify everything is working:

- [ ] All three tables exist (users, roles, projects)
- [ ] All indexes are created
- [ ] RLS is enabled on all tables
- [ ] Storage buckets are created (project-images, role-icons)
- [ ] Storage policies are in place
- [ ] At least one super_admin user exists
- [ ] Environment variables are configured
- [ ] Sample data loaded (optional)

## Troubleshooting

### "relation does not exist" error
- Make sure you ran all migrations in order
- Check that the UUID extension is enabled

### "permission denied" error
- Verify RLS policies are created
- Check that your user exists in the users table with correct role
- Ensure you're using the correct API key (service_role for admin operations)

### Storage upload fails
- Verify storage buckets exist
- Check storage policies are in place
- Ensure file size and type are within limits

### Can't login to admin dashboard
- Verify user exists in auth.users
- Verify user exists in users table with admin/super_admin role
- Check that email and password are correct

## Next Steps

After completing the Supabase setup:

1. ✅ Test database connection from your Next.js app
2. ✅ Implement Supabase client utilities (Task 4)
3. ✅ Set up authentication system (Task 5)
4. ✅ Build data models and API routes (Tasks 6-7)

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

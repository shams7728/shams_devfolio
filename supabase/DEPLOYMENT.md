# Supabase Deployment Checklist

Complete checklist for deploying the Supabase backend for your Dynamic Multi-Role Portfolio Platform.

## Pre-Deployment Checklist

### 1. Supabase Project Setup

- [ ] Created Supabase project at https://app.supabase.com
- [ ] Saved database password securely
- [ ] Selected appropriate region (closest to your users)
- [ ] Project is fully initialized (wait ~2 minutes after creation)

### 2. Environment Configuration

- [ ] Copied `.env.example` to `.env.local`
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` from Supabase dashboard
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase dashboard
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` from Supabase dashboard
- [ ] Generated secure `NEXTAUTH_SECRET` (use: `openssl rand -base64 32`)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your domain (or localhost for dev)

### 3. Database Migration

- [ ] Opened Supabase SQL Editor
- [ ] Ran `migrations/001_initial_schema.sql` successfully
- [ ] Ran `migrations/002_storage_setup.sql` successfully
- [ ] Verified all tables exist in Table Editor
- [ ] Verified all indexes are created
- [ ] Verified RLS is enabled on all tables

### 4. Storage Configuration

- [ ] Verified `project-images` bucket exists
- [ ] Verified `role-icons` bucket exists
- [ ] Checked bucket policies are in place
- [ ] Tested public read access to buckets
- [ ] Verified file size limits (5MB for projects, 2MB for icons)

### 5. Initial Admin User

- [ ] Created first user via Supabase Auth dashboard
- [ ] Copied user UUID from auth.users table
- [ ] Inserted user into users table with super_admin role
- [ ] Verified user can authenticate
- [ ] Tested admin access to protected routes

### 6. Verification

- [ ] Ran verification script: `npx tsx scripts/verify-supabase.ts`
- [ ] All checks passed
- [ ] No errors in console
- [ ] Connection successful

## Deployment Steps

### Step 1: Create Supabase Project

```bash
# 1. Go to https://app.supabase.com
# 2. Click "New Project"
# 3. Fill in details:
#    - Name: your-portfolio-name
#    - Database Password: [generate strong password]
#    - Region: [select closest to users]
# 4. Click "Create new project"
# 5. Wait for initialization (~2 minutes)
```

### Step 2: Get API Credentials

```bash
# In Supabase Dashboard:
# 1. Go to Settings → API
# 2. Copy "Project URL"
# 3. Copy "anon/public" key
# 4. Copy "service_role" key (keep secret!)
```

### Step 3: Configure Environment

```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your values
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### Step 4: Run Database Migrations

**Option A: Using Supabase Dashboard (Recommended)**

```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Click "New Query"
# 4. Copy contents of supabase/migrations/001_initial_schema.sql
# 5. Paste and click "Run"
# 6. Verify success message
# 7. Repeat for 002_storage_setup.sql
```

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 5: Create First Admin User

```sql
-- 1. In Supabase Dashboard, go to Authentication → Users
-- 2. Click "Add User" → "Create new user"
-- 3. Enter email and password
-- 4. Copy the user's UUID

-- 5. Go to SQL Editor and run:
INSERT INTO users (id, email, role)
VALUES (
  'paste-user-uuid-here',
  'your-email@example.com',
  'super_admin'
);

-- 6. Verify in Table Editor → users
```

### Step 6: Load Sample Data (Optional)

```bash
# For development/testing only
# In SQL Editor, run:
# supabase/seed.sql
```

### Step 7: Verify Setup

```bash
# Run verification script
npx tsx scripts/verify-supabase.ts

# Expected output:
# ✓ All environment variables set
# ✓ Successfully connected to Supabase
# ✓ All tables exist
# ✓ All storage buckets exist
# ✓ RLS policies are working
```

## Post-Deployment Verification

### Database Tables

```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('users', 'roles', 'projects');

-- Should return 3 rows
```

### Indexes

```sql
-- Verify indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('roles', 'projects');

-- Should return 8 indexes
```

### RLS Policies

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users', 'roles', 'projects');

-- All should have rowsecurity = true
```

### Storage Buckets

```sql
-- Verify buckets exist
SELECT name, public 
FROM storage.buckets 
WHERE name IN ('project-images', 'role-icons');

-- Should return 2 rows, both with public = true
```

## Production Deployment

### Additional Steps for Production

1. **Security Hardening**
   - [ ] Rotate service_role key if exposed
   - [ ] Enable 2FA for Supabase account
   - [ ] Set up IP restrictions if needed
   - [ ] Review and audit RLS policies

2. **Performance Optimization**
   - [ ] Enable connection pooling (default in Supabase)
   - [ ] Set up database backups
   - [ ] Configure point-in-time recovery
   - [ ] Monitor query performance

3. **Monitoring**
   - [ ] Set up Supabase monitoring alerts
   - [ ] Configure error tracking (Sentry, etc.)
   - [ ] Set up uptime monitoring
   - [ ] Enable database logs

4. **Backup Strategy**
   - [ ] Enable automatic daily backups
   - [ ] Test backup restoration process
   - [ ] Document backup retention policy
   - [ ] Set up off-site backup storage

5. **Domain Configuration**
   - [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
   - [ ] Configure custom domain for Supabase (optional)
   - [ ] Update CORS settings if needed
   - [ ] Set up SSL certificates

## Troubleshooting

### Common Issues

#### "relation does not exist" error

**Cause**: Migrations not run or incomplete

**Solution**:
```bash
# Re-run migrations in order
# 1. 001_initial_schema.sql
# 2. 002_storage_setup.sql
```

#### "permission denied for table" error

**Cause**: RLS policies not created or user not in users table

**Solution**:
```sql
-- Check if user exists in users table
SELECT * FROM users WHERE id = 'your-user-uuid';

-- If not, insert:
INSERT INTO users (id, email, role)
VALUES ('your-user-uuid', 'your-email', 'super_admin');
```

#### Storage upload fails

**Cause**: Bucket doesn't exist or policies not set

**Solution**:
```bash
# Re-run storage setup migration
# supabase/migrations/002_storage_setup.sql
```

#### Can't connect to Supabase

**Cause**: Wrong credentials or network issue

**Solution**:
```bash
# Verify credentials in Supabase Dashboard
# Settings → API
# Copy fresh keys to .env.local
```

### Getting Help

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues
- **Stack Overflow**: Tag with `supabase`

## Rollback Procedure

If you need to rollback the database:

```sql
-- Drop all tables (WARNING: This deletes all data!)
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop storage buckets
DELETE FROM storage.buckets WHERE name IN ('project-images', 'role-icons');

-- Then re-run migrations from scratch
```

## Migration History

| Version | File | Description | Date |
|---------|------|-------------|------|
| 001 | 001_initial_schema.sql | Initial database schema, tables, indexes, RLS | - |
| 002 | 002_storage_setup.sql | Storage buckets and policies | - |

## Next Steps

After successful deployment:

1. ✅ Test authentication flow
2. ✅ Create sample role and project
3. ✅ Test file upload to storage
4. ✅ Verify public pages display correctly
5. ✅ Test admin CRUD operations
6. ✅ Deploy Next.js application to Vercel
7. ✅ Configure production environment variables
8. ✅ Test end-to-end in production

## Support

For issues specific to this portfolio platform:
- Check the main README.md
- Review supabase/README.md
- Check supabase/SCHEMA.md for database reference

For Supabase-specific issues:
- Supabase Documentation: https://supabase.com/docs
- Community Support: https://discord.supabase.com

# Quick Setup Guide

This guide will get your Supabase backend up and running in 10 minutes.

## What Was Created

The Supabase backend infrastructure is now fully configured with:

✅ **Database Schema**
- 3 tables: `users`, `roles`, `projects`
- Foreign key relationships
- Optimized indexes for performance
- Automatic timestamp updates

✅ **Row Level Security (RLS)**
- Public read access to published content
- Admin-only write access
- Super admin user management

✅ **Storage Buckets**
- `project-images` (5MB limit, JPEG/PNG/WebP)
- `role-icons` (2MB limit, JPEG/PNG/WebP/SVG)
- Public read access, admin write access

✅ **Documentation**
- Complete setup guide
- Database schema reference
- Deployment checklist
- Visual diagrams

## Files Created

```
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql      # Database tables, indexes, RLS
│   │   └── 002_storage_setup.sql       # Storage buckets and policies
│   ├── seed.sql                        # Sample data (optional)
│   ├── README.md                       # Complete setup guide
│   ├── SCHEMA.md                       # Database reference
│   ├── DEPLOYMENT.md                   # Deployment checklist
│   └── DATABASE_DIAGRAM.md             # Visual diagrams
├── lib/
│   └── types/
│       └── database.ts                 # TypeScript types
├── scripts/
│   └── verify-supabase.ts              # Verification script
├── README.md                           # Updated with setup info
└── SETUP_GUIDE.md                      # This file
```

## Next Steps (5 Steps)

### Step 1: Create Supabase Project (2 min)

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - Name: `your-portfolio`
   - Password: [generate strong password]
   - Region: [closest to you]
4. Wait ~2 minutes for initialization

### Step 2: Get Credentials (1 min)

1. In Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key

### Step 3: Configure Environment (1 min)

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your credentials
```

### Step 4: Run Migrations (3 min)

**In Supabase Dashboard:**

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Repeat for `supabase/migrations/002_storage_setup.sql`

### Step 5: Verify Setup (1 min)

```bash
# Run verification script
npx tsx scripts/verify-supabase.ts
```

Expected output:
```
✓ NEXT_PUBLIC_SUPABASE_URL is set
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY is set
✓ Successfully connected to Supabase
✓ Table 'users' exists
✓ Table 'roles' exists
✓ Table 'projects' exists
✓ Bucket 'project-images' exists
✓ Bucket 'role-icons' exists
✓ RLS policies are enforcing write restrictions
```

## Create Your First Admin User

After migrations are complete:

1. In Supabase dashboard, go to **Authentication → Users**
2. Click **Add User → Create new user**
3. Enter email and password
4. Copy the user's UUID
5. Go to **SQL Editor** and run:

```sql
INSERT INTO users (id, email, role)
VALUES (
  'paste-user-uuid-here',
  'your-email@example.com',
  'super_admin'
);
```

## Load Sample Data (Optional)

For testing, you can load sample roles and projects:

1. Go to **SQL Editor**
2. Copy contents of `supabase/seed.sql`
3. Paste and click **Run**

This creates:
- 3 sample roles (Web Developer, Data Analyst, Mobile Developer)
- 3 sample projects with placeholder images

## Troubleshooting

### "relation does not exist" error
→ Run migrations in order: 001, then 002

### "permission denied" error
→ Make sure you created the admin user in the users table

### Storage upload fails
→ Re-run `002_storage_setup.sql`

### Can't connect
→ Double-check credentials in `.env.local`

## What's Next?

After Supabase is set up, you can:

1. ✅ **Task 3**: Implement RLS policies (already done!)
2. ⏭️ **Task 4**: Create Supabase client utilities
3. ⏭️ **Task 5**: Implement authentication system
4. ⏭️ **Task 6**: Build Role data model and API

## Documentation

For detailed information, see:

- **[supabase/README.md](./supabase/README.md)** - Complete setup guide
- **[supabase/SCHEMA.md](./supabase/SCHEMA.md)** - Database schema reference
- **[supabase/DEPLOYMENT.md](./supabase/DEPLOYMENT.md)** - Production deployment
- **[supabase/DATABASE_DIAGRAM.md](./supabase/DATABASE_DIAGRAM.md)** - Visual diagrams

## Database Schema Overview

### Tables

**users** - Admin user metadata
- Extends Supabase Auth
- Roles: super_admin, admin

**roles** - Professional roles/identities
- Title, description, slug
- Icon, published status, display order

**projects** - Portfolio projects
- Associated with roles (foreign key)
- Tech stack, links, images
- Published status, display order

### Storage

**project-images** - Project media (5MB limit)
**role-icons** - Role icons (2MB limit)

### Security

- RLS enabled on all tables
- Public read for published content
- Admin-only write access
- Super admin user management

## Support

Need help?

1. Check the documentation in `supabase/` directory
2. Run the verification script: `npx tsx scripts/verify-supabase.ts`
3. Review common issues in `supabase/DEPLOYMENT.md`
4. Check Supabase docs: https://supabase.com/docs

## Summary

Your Supabase backend is ready! The infrastructure includes:

- ✅ Complete database schema with relationships
- ✅ Optimized indexes for performance
- ✅ Row Level Security policies
- ✅ Storage buckets for media files
- ✅ TypeScript types for type safety
- ✅ Comprehensive documentation
- ✅ Verification script

Total setup time: ~10 minutes

**Next**: Create your Supabase project and run the migrations!

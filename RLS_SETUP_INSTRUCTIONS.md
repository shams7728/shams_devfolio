# RLS Setup Instructions

## 🎯 Quick Start

The Row Level Security (RLS) policies have been implemented and are ready to be applied to your Supabase database.

### Step 1: Apply the RLS Fix

Run this command to open the Supabase SQL Editor with instructions:

```bash
npm run fix:rls
```

This will:
- Open your Supabase SQL Editor in the browser
- Display the SQL that needs to be executed
- Provide step-by-step instructions

### Step 2: Execute the SQL

1. The SQL Editor should open automatically
2. Copy the SQL from the terminal output (or from `supabase/migrations/003_fix_rls_policies.sql`)
3. Paste it into the SQL Editor
4. Click **"Run"** or press `Ctrl+Enter`

### Step 3: Verify Everything Works

Run the comprehensive test suite:

```bash
npm run test:rls
```

You should see:
```
✅ All 18 tests passed!
Success Rate: 100%
```

## 📚 What Was Implemented

### RLS Policies

✅ **Public Read Access** - Visitors can view published roles and projects  
✅ **Admin Write Access** - Authenticated admins can create, update, and delete content  
✅ **Security Definer Function** - Prevents infinite recursion in policy checks  
✅ **Comprehensive Testing** - 18 automated tests verify all policies work correctly  

### Documentation

- **supabase/RLS_POLICIES.md** - Complete policy reference
- **supabase/APPLY_RLS_FIX.md** - Detailed application instructions
- **supabase/RLS_IMPLEMENTATION_SUMMARY.md** - Implementation overview

### Test Suite

- **scripts/test-rls-policies.ts** - Automated RLS policy tests
- Tests public access, unauthenticated restrictions, and admin privileges
- Creates temporary test data and cleans up automatically

## 🔒 Security Features

1. **Row-Level Security** enabled on all tables
2. **Public users** can only read published content
3. **Unauthenticated users** cannot write to any tables
4. **Authenticated admins** have full CRUD access
5. **Super admins** can manage other admin users
6. **Foreign key constraints** ensure data integrity

## 🧪 Test Coverage

The test suite verifies:

- ✅ Public can read published roles
- ✅ Public cannot read unpublished roles
- ✅ Public can read published projects
- ✅ Public cannot read unpublished projects
- ✅ Unauthenticated users cannot insert/update/delete roles
- ✅ Unauthenticated users cannot insert/update/delete projects
- ✅ Authenticated admins can perform all CRUD operations
- ✅ Authenticated admins can read all content (published and unpublished)

## 🛠️ Troubleshooting

### Tests Failing?

1. **Verify the migration was applied:**
   - Go to Supabase Dashboard → SQL Editor
   - Run: `SELECT proname FROM pg_proc WHERE proname = 'is_admin';`
   - Should return one row

2. **Check environment variables:**
   - Ensure `.env.local` has valid Supabase credentials
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Check policies exist:**
   - Run: `SELECT * FROM pg_policies WHERE tablename IN ('roles', 'projects');`
   - Should return multiple policies

### Can't Open SQL Editor?

Manually navigate to:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_REF/sql/new
```

Replace `YOUR_PROJECT_REF` with your project reference (found in your Supabase URL).

## 📋 Requirements Satisfied

✅ **Requirement 3.5:** RLS policies ensure only authenticated admins can write to roles and projects tables

✅ **Requirement 12.4:** RLS policies allow public read access to published content and restrict write access to authenticated admins

## 🎉 Next Steps

After successfully applying the RLS policies and verifying all tests pass:

1. Mark task 3 as complete in `.kiro/specs/multi-role-portfolio/tasks.md`
2. Proceed to task 4: "Create Supabase client utilities"

## 📞 Need Help?

- Check **supabase/APPLY_RLS_FIX.md** for detailed instructions
- Review **supabase/RLS_POLICIES.md** for policy reference
- See **supabase/RLS_IMPLEMENTATION_SUMMARY.md** for implementation details

---

**Note:** The RLS policies are already defined in `supabase/migrations/001_initial_schema.sql`. The fix in migration `003` resolves an infinite recursion issue by using a `SECURITY DEFINER` function.

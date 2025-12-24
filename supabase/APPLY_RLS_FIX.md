# Apply RLS Policy Fix

## Problem

The initial RLS policies have an infinite recursion issue. When checking if a user is an admin, the policies query the `users` table, which itself has RLS policies that check the `users` table, creating a circular dependency.

## Solution

We've created a `SECURITY DEFINER` function that bypasses RLS when checking user roles, preventing the infinite recursion.

## How to Apply the Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/003_fix_rls_policies.sql`
6. Paste into the SQL editor
7. Click **Run** or press `Ctrl+Enter`
8. Verify the migration was successful (you should see "Success. No rows returned")

### Option 2: Using Supabase CLI (If installed)

```bash
# Make sure you're in the project root
cd /path/to/your/project

# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

### Option 3: Manual Execution

If you prefer to execute the SQL manually, here's what the migration does:

1. **Creates a helper function** `is_admin()` that checks if the current user is an admin
   - Uses `SECURITY DEFINER` to bypass RLS on the users table
   
2. **Drops existing admin policies** for roles and projects tables
   - Keeps the public read policies intact
   
3. **Recreates admin policies** using the new `is_admin()` function
   - Prevents infinite recursion

## Verification

After applying the migration, run the RLS test suite to verify everything works:

```bash
npm run test:rls
```

You should see all 18 tests pass:

```
✅ PASS: Public can read published roles
✅ PASS: Public cannot read unpublished roles
✅ PASS: Public can read published projects
✅ PASS: Public cannot read unpublished projects
✅ PASS: Unauthenticated users cannot insert roles
✅ PASS: Unauthenticated users cannot update roles
✅ PASS: Unauthenticated users cannot delete roles
✅ PASS: Unauthenticated users cannot insert projects
✅ PASS: Unauthenticated users cannot update projects
✅ PASS: Unauthenticated users cannot delete projects
✅ PASS: Authenticated admins can read all roles
✅ PASS: Authenticated admins can insert roles
✅ PASS: Authenticated admins can update roles
✅ PASS: Authenticated admins can read all projects
✅ PASS: Authenticated admins can insert projects
✅ PASS: Authenticated admins can update projects
✅ PASS: Authenticated admins can delete projects
✅ PASS: Authenticated admins can delete roles
```

## Troubleshooting

### Error: "function is_admin() already exists"

This means the function was already created. You can either:
- Skip the function creation part
- Or use `CREATE OR REPLACE FUNCTION` (which is already in the migration)

### Error: "policy does not exist"

This is normal if the policies were never created. The `DROP POLICY IF EXISTS` statements will silently succeed.

### Tests still failing

1. Verify the migration was applied successfully
2. Check that the `is_admin()` function exists:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'is_admin';
   ```
3. Check that the policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('roles', 'projects');
   ```
4. Verify your test admin user exists in the `users` table

## What Changed

### Before (Infinite Recursion)

```sql
CREATE POLICY "Admins can read all roles"
  ON roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users  -- This triggers RLS on users table
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );
```

### After (Fixed)

```sql
-- Helper function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users  -- SECURITY DEFINER bypasses RLS
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy uses the function
CREATE POLICY "Admins can read all roles"
  ON roles
  FOR SELECT
  USING (is_admin());  -- No infinite recursion!
```

## Security Note

The `SECURITY DEFINER` keyword means the function runs with the privileges of the user who created it (typically the database owner), not the user who calls it. This is safe in this context because:

1. The function only reads from the `users` table
2. It only checks if the current authenticated user (`auth.uid()`) is an admin
3. It doesn't expose any sensitive data
4. It's used internally by RLS policies, not exposed to end users

## Next Steps

After successfully applying this fix:

1. ✅ Run `npm run test:rls` to verify all tests pass
2. ✅ Update the task status in `.kiro/specs/multi-role-portfolio/tasks.md`
3. ✅ Proceed with the next task in the implementation plan

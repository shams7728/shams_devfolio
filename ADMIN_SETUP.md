# Admin User Setup Guide

This guide explains how to create and manage admin users for your portfolio platform.

## Creating Your First Admin User

### Method 1: Using Supabase Dashboard (Recommended)

#### Step 1: Create User in Supabase Auth

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add user"** or **"Invite user"**
5. Enter the email address and password
6. Click **"Create user"**
7. **Copy the User ID (UUID)** - you'll need this in the next step

#### Step 2: Add User to Users Table

1. Go to **SQL Editor** in your Supabase Dashboard
2. Click **"New query"**
3. Paste and run this SQL (replace the placeholders):

```sql
-- Replace with actual values
INSERT INTO users (id, email, role)
VALUES (
  'PASTE-USER-UUID-FROM-STEP-1',
  'admin@example.com',
  'super_admin'  -- or 'admin'
);
```

4. Click **"Run"**

✅ Done! The user can now log in at `/login`

### Method 2: Using the Helper Script

We've created a helper script to make this easier:

```bash
# Run the script
npx tsx scripts/create-admin.ts
```

The script will prompt you for:
- User ID (UUID) from Supabase Auth
- Email address
- Role (admin or super_admin)

## User Roles

### Admin
- Can manage roles (create, edit, delete, reorder)
- Can manage projects (create, edit, delete, reorder)
- Can upload media files
- **Cannot** manage other admin users

### Super Admin
- All admin permissions
- **Can** manage other admin users (create, edit, delete)
- Can promote/demote admins

## Managing Existing Admins

### Promote User to Super Admin

```sql
UPDATE users
SET role = 'super_admin'
WHERE email = 'user@example.com';
```

### Demote Super Admin to Admin

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'user@example.com';
```

### Remove Admin Access

```sql
DELETE FROM users
WHERE email = 'user@example.com';
```

**Note:** This only removes their admin access. They'll still exist in Supabase Auth but won't be able to access the admin dashboard.

## Troubleshooting

### "User not found" error
- Make sure you created the user in **Supabase Auth** first
- Verify you copied the correct UUID

### "User already exists" error
- The user is already in the users table
- Check the users table in Supabase Dashboard → Table Editor

### "Access Denied" when logging in
- Verify the user exists in both `auth.users` AND `users` tables
- Check that the `id` in the `users` table matches the `id` in `auth.users`
- Verify the role is set to either 'admin' or 'super_admin'

### Can't access /admin routes
- Make sure you're logged in
- Check that your user has a role in the users table
- Clear browser cookies and try logging in again

## Security Best Practices

1. **Use strong passwords** for admin accounts
2. **Limit super_admin access** to only trusted users
3. **Regularly audit** admin users in your database
4. **Enable 2FA** in Supabase Auth settings (recommended)
5. **Use environment-specific admins** (different admins for dev/staging/production)

## Checking Current Admins

To see all current admin users, run this SQL query:

```sql
SELECT 
  u.id,
  u.email,
  u.role,
  u.created_at,
  au.last_sign_in_at
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;
```

## Next Steps

After creating your admin user:

1. Log in at `/login`
2. Navigate to `/admin` to access the dashboard
3. Start creating roles at `/admin/roles`
4. Add projects at `/admin/projects`

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the Supabase logs in the Dashboard
3. Verify your environment variables are set correctly
4. Review the RLS policies in `supabase/migrations/001_initial_schema.sql`

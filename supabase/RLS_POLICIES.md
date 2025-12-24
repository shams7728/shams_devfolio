# Row Level Security (RLS) Policies

This document describes the Row Level Security policies implemented for the Dynamic Multi-Role Portfolio Platform.

## Overview

Row Level Security (RLS) is a PostgreSQL feature that allows fine-grained access control at the row level. Our implementation ensures that:

1. **Public users** can only read published content (roles and projects)
2. **Unauthenticated users** cannot write to any tables
3. **Authenticated admins** have full CRUD access to all content
4. **Super admins** have additional privileges for user management

## Policy Implementation

All policies are defined in `supabase/migrations/001_initial_schema.sql`.

### Users Table Policies

The `users` table stores extended metadata for admin users and is restricted to super admins only.

| Policy Name | Operation | Access Rule |
|-------------|-----------|-------------|
| Super admins can read all users | SELECT | User must be authenticated as super_admin |
| Super admins can insert users | INSERT | User must be authenticated as super_admin |
| Super admins can update users | UPDATE | User must be authenticated as super_admin |
| Super admins can delete users | DELETE | User must be authenticated as super_admin AND not deleting themselves |

**Implementation:**
```sql
-- Example: Read policy
CREATE POLICY "Super admins can read all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );
```

### Roles Table Policies

The `roles` table stores professional roles/identities displayed on the portfolio.

| Policy Name | Operation | Access Rule |
|-------------|-----------|-------------|
| Public can read published roles | SELECT | role.is_published = true |
| Admins can read all roles | SELECT | User is authenticated as admin or super_admin |
| Admins can insert roles | INSERT | User is authenticated as admin or super_admin |
| Admins can update roles | UPDATE | User is authenticated as admin or super_admin |
| Admins can delete roles | DELETE | User is authenticated as admin or super_admin |

**Key Features:**
- Public users see only published roles (`is_published = true`)
- Admins can see all roles, including unpublished drafts
- Write operations require authentication

**Implementation:**
```sql
-- Public read access
CREATE POLICY "Public can read published roles"
  ON roles
  FOR SELECT
  USING (is_published = true);

-- Admin write access
CREATE POLICY "Admins can insert roles"
  ON roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );
```

### Projects Table Policies

The `projects` table stores portfolio projects associated with specific roles.

| Policy Name | Operation | Access Rule |
|-------------|-----------|-------------|
| Public can read published projects | SELECT | project.is_published = true |
| Admins can read all projects | SELECT | User is authenticated as admin or super_admin |
| Admins can insert projects | INSERT | User is authenticated as admin or super_admin |
| Admins can update projects | UPDATE | User is authenticated as admin or super_admin |
| Admins can delete projects | DELETE | User is authenticated as admin or super_admin |

**Key Features:**
- Public users see only published projects (`is_published = true`)
- Admins can see all projects, including unpublished drafts
- Write operations require authentication
- Foreign key constraint ensures projects reference valid roles

**Implementation:**
```sql
-- Public read access
CREATE POLICY "Public can read published projects"
  ON projects
  FOR SELECT
  USING (is_published = true);

-- Admin write access
CREATE POLICY "Admins can update projects"
  ON projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );
```

## Policy Behavior

### Public Access (Unauthenticated)

When a user visits the portfolio without authentication:

✅ **Allowed:**
- Read published roles
- Read published projects
- View role details pages
- View project details pages

❌ **Denied:**
- Read unpublished roles
- Read unpublished projects
- Create, update, or delete any content
- Access admin dashboard

### Admin Access (Authenticated)

When an admin user is authenticated:

✅ **Allowed:**
- Read all roles (published and unpublished)
- Read all projects (published and unpublished)
- Create new roles and projects
- Update existing roles and projects
- Delete roles and projects
- Toggle publish status
- Reorder content

❌ **Denied:**
- Manage other admin users (super_admin only)

### Super Admin Access (Authenticated)

Super admins have all admin privileges plus:

✅ **Additional Privileges:**
- View all admin users
- Create new admin users
- Update admin user roles
- Delete admin users (except themselves)

## Testing RLS Policies

A comprehensive test suite is provided to verify RLS policies work correctly.

### Running Tests

```bash
# Ensure environment variables are set in .env.local
npm run test:rls
```

### Test Coverage

The test suite (`scripts/test-rls-policies.ts`) verifies:

1. ✅ Public can read published roles
2. ✅ Public cannot read unpublished roles
3. ✅ Public can read published projects
4. ✅ Public cannot read unpublished projects
5. ✅ Unauthenticated users cannot insert roles
6. ✅ Unauthenticated users cannot update roles
7. ✅ Unauthenticated users cannot delete roles
8. ✅ Unauthenticated users cannot insert projects
9. ✅ Unauthenticated users cannot update projects
10. ✅ Unauthenticated users cannot delete projects
11. ✅ Authenticated admins can read all roles
12. ✅ Authenticated admins can insert roles
13. ✅ Authenticated admins can update roles
14. ✅ Authenticated admins can read all projects
15. ✅ Authenticated admins can insert projects
16. ✅ Authenticated admins can update projects
17. ✅ Authenticated admins can delete projects
18. ✅ Authenticated admins can delete roles

### Test Data

The test suite:
- Creates temporary test data (roles, projects, admin user)
- Runs all policy tests
- Cleans up test data automatically
- Reports pass/fail status for each test

## Security Considerations

### Authentication Flow

1. User authenticates via Supabase Auth
2. JWT token is issued with user ID
3. RLS policies check `auth.uid()` against `users` table
4. Access is granted or denied based on user role

### Policy Evaluation

RLS policies are evaluated at the database level:
- Policies run **before** queries execute
- Multiple policies are combined with OR logic
- Policies cannot be bypassed from application code
- Service role key bypasses RLS (use carefully!)

### Best Practices

✅ **Do:**
- Use the anon key for public client operations
- Use the service role key only in secure server environments
- Test policies thoroughly before deployment
- Keep policies simple and readable
- Document policy changes

❌ **Don't:**
- Expose service role key in client code
- Disable RLS on tables with sensitive data
- Create overly complex policy conditions
- Forget to test edge cases

## Troubleshooting

### Common Issues

**Issue:** Public users can't see published content
- **Solution:** Verify `is_published = true` on the content
- **Check:** Run query with service role to confirm data exists

**Issue:** Admins can't create content
- **Solution:** Verify user exists in `users` table with correct role
- **Check:** Confirm JWT token is being sent with requests

**Issue:** Policies not taking effect
- **Solution:** Verify RLS is enabled on the table
- **Check:** Run `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

### Debugging Queries

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View all policies on a table
SELECT * FROM pg_policies 
WHERE tablename = 'roles';

-- Test policy as specific user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub = 'user-uuid-here';
SELECT * FROM roles;
```

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 3.5:** RLS policies ensure only authenticated admins can write to roles and projects tables
- **Requirement 12.4:** RLS policies allow public read access to published content and restrict write access to authenticated admins

## Related Documentation

- [Database Schema](./SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Supabase Documentation](https://supabase.com/docs/guides/auth/row-level-security)

## Maintenance

### Adding New Policies

When adding new tables or modifying access patterns:

1. Create migration file: `supabase/migrations/XXX_policy_name.sql`
2. Enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
3. Create policies for each operation (SELECT, INSERT, UPDATE, DELETE)
4. Test policies with the test suite
5. Document policies in this file

### Modifying Existing Policies

1. Create new migration file (never modify existing migrations)
2. Drop old policy: `DROP POLICY "policy_name" ON table_name;`
3. Create new policy with updated logic
4. Update tests to reflect changes
5. Update documentation

## Version History

- **v1.0.0** (Initial): Complete RLS implementation for users, roles, and projects tables
  - Public read access to published content
  - Admin write access with authentication
  - Super admin user management

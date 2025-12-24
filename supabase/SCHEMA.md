# Database Schema Reference

Quick reference for the Dynamic Multi-Role Portfolio Platform database schema.

## Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │
│  (Supabase)     │
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────┐
│     users       │
│─────────────────│
│ id (PK, FK)     │
│ email           │
│ role            │
│ created_at      │
│ updated_at      │
└─────────────────┘


┌─────────────────┐
│     roles       │
│─────────────────│
│ id (PK)         │
│ title           │
│ description     │
│ slug (UNIQUE)   │
│ icon_url        │
│ is_published    │
│ display_order   │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│    projects     │
│─────────────────│
│ id (PK)         │
│ role_id (FK)    │
│ title           │
│ short_desc      │
│ long_desc       │
│ tech_stack[]    │
│ github_url      │
│ live_url        │
│ cover_image_url │
│ gallery_urls[]  │
│ is_published    │
│ display_order   │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

## Table Details

### users

**Purpose**: Extended metadata for admin users

**Columns**:
- `id` (UUID, PK, FK → auth.users): User identifier
- `email` (TEXT, NOT NULL, UNIQUE): Email address
- `role` (TEXT, NOT NULL): User role ('super_admin' | 'admin')
- `created_at` (TIMESTAMPTZ, NOT NULL): Creation timestamp
- `updated_at` (TIMESTAMPTZ, NOT NULL): Last update timestamp

**Constraints**:
- CHECK: role IN ('super_admin', 'admin')
- UNIQUE: email
- FK: id → auth.users(id) ON DELETE CASCADE

**Indexes**: None (small table)

---

### roles

**Purpose**: Professional roles/identities displayed on portfolio

**Columns**:
- `id` (UUID, PK): Role identifier
- `title` (TEXT, NOT NULL): Role title (e.g., "Web Developer")
- `description` (TEXT, NOT NULL): Role description
- `slug` (TEXT, NOT NULL, UNIQUE): URL-friendly identifier
- `icon_url` (TEXT, NULLABLE): Optional icon/image URL
- `is_published` (BOOLEAN, NOT NULL, DEFAULT false): Public visibility
- `display_order` (INTEGER, NOT NULL, DEFAULT 0): Display sequence
- `created_at` (TIMESTAMPTZ, NOT NULL): Creation timestamp
- `updated_at` (TIMESTAMPTZ, NOT NULL): Last update timestamp

**Constraints**:
- UNIQUE: slug

**Indexes**:
- `idx_roles_slug` ON slug
- `idx_roles_is_published` ON is_published
- `idx_roles_display_order` ON display_order
- `idx_roles_published_order` ON (is_published, display_order) WHERE is_published = true

---

### projects

**Purpose**: Portfolio projects associated with roles

**Columns**:
- `id` (UUID, PK): Project identifier
- `role_id` (UUID, NOT NULL, FK → roles): Parent role
- `title` (TEXT, NOT NULL): Project title
- `short_description` (TEXT, NOT NULL): Brief description
- `long_description` (TEXT, NOT NULL): Detailed description
- `tech_stack` (TEXT[], NOT NULL, DEFAULT '{}'): Technologies used
- `github_url` (TEXT, NULLABLE): GitHub repository URL
- `live_url` (TEXT, NULLABLE): Live demo URL
- `cover_image_url` (TEXT, NOT NULL): Cover image URL
- `gallery_urls` (TEXT[], NOT NULL, DEFAULT '{}'): Gallery image URLs
- `is_published` (BOOLEAN, NOT NULL, DEFAULT false): Public visibility
- `display_order` (INTEGER, NOT NULL, DEFAULT 0): Display sequence within role
- `created_at` (TIMESTAMPTZ, NOT NULL): Creation timestamp
- `updated_at` (TIMESTAMPTZ, NOT NULL): Last update timestamp

**Constraints**:
- FK: role_id → roles(id) ON DELETE CASCADE

**Indexes**:
- `idx_projects_role_id` ON role_id
- `idx_projects_is_published` ON is_published
- `idx_projects_display_order` ON display_order
- `idx_projects_role_published_order` ON (role_id, is_published, display_order) WHERE is_published = true

## Storage Buckets

### project-images

**Purpose**: Store project cover images and gallery images

**Configuration**:
- Public: Yes (read-only)
- File Size Limit: 5MB
- Allowed MIME Types: image/jpeg, image/jpg, image/png, image/webp

**Folder Structure**:
```
project-images/
└── roles/
    └── {roleId}/
        └── projects/
            └── {projectId}/
                ├── cover.jpg
                ├── gallery-1.jpg
                ├── gallery-2.jpg
                └── ...
```

---

### role-icons

**Purpose**: Store role icons and images

**Configuration**:
- Public: Yes (read-only)
- File Size Limit: 2MB
- Allowed MIME Types: image/jpeg, image/jpg, image/png, image/webp, image/svg+xml

**Folder Structure**:
```
role-icons/
└── roles/
    └── {roleId}/
        └── icon.svg
```

## Row Level Security Policies

### users table

| Policy | Operation | Rule |
|--------|-----------|------|
| Super admins can read all users | SELECT | User is super_admin |
| Super admins can insert users | INSERT | User is super_admin |
| Super admins can update users | UPDATE | User is super_admin |
| Super admins can delete users | DELETE | User is super_admin AND not self |

### roles table

| Policy | Operation | Rule |
|--------|-----------|------|
| Public can read published roles | SELECT | is_published = true |
| Admins can read all roles | SELECT | User is admin or super_admin |
| Admins can insert roles | INSERT | User is admin or super_admin |
| Admins can update roles | UPDATE | User is admin or super_admin |
| Admins can delete roles | DELETE | User is admin or super_admin |

### projects table

| Policy | Operation | Rule |
|--------|-----------|------|
| Public can read published projects | SELECT | is_published = true |
| Admins can read all projects | SELECT | User is admin or super_admin |
| Admins can insert projects | INSERT | User is admin or super_admin |
| Admins can update projects | UPDATE | User is admin or super_admin |
| Admins can delete projects | DELETE | User is admin or super_admin |

### storage.objects (project-images bucket)

| Policy | Operation | Rule |
|--------|-----------|------|
| Public can read project images | SELECT | bucket_id = 'project-images' |
| Admins can upload project images | INSERT | User is admin or super_admin |
| Admins can update project images | UPDATE | User is admin or super_admin |
| Admins can delete project images | DELETE | User is admin or super_admin |

### storage.objects (role-icons bucket)

| Policy | Operation | Rule |
|--------|-----------|------|
| Public can read role icons | SELECT | bucket_id = 'role-icons' |
| Admins can upload role icons | INSERT | User is admin or super_admin |
| Admins can update role icons | UPDATE | User is admin or super_admin |
| Admins can delete role icons | DELETE | User is admin or super_admin |

## Common Queries

### Get all published roles with project count

```sql
SELECT 
  r.*,
  COUNT(p.id) as project_count
FROM roles r
LEFT JOIN projects p ON p.role_id = r.id AND p.is_published = true
WHERE r.is_published = true
GROUP BY r.id
ORDER BY r.display_order;
```

### Get role with all published projects

```sql
SELECT 
  r.*,
  json_agg(
    json_build_object(
      'id', p.id,
      'title', p.title,
      'short_description', p.short_description,
      'tech_stack', p.tech_stack,
      'cover_image_url', p.cover_image_url
    ) ORDER BY p.display_order
  ) as projects
FROM roles r
LEFT JOIN projects p ON p.role_id = r.id AND p.is_published = true
WHERE r.slug = 'web-developer'
GROUP BY r.id;
```

### Get project with role information

```sql
SELECT 
  p.*,
  json_build_object(
    'id', r.id,
    'title', r.title,
    'slug', r.slug
  ) as role
FROM projects p
JOIN roles r ON r.id = p.role_id
WHERE p.id = 'project-uuid-here';
```

### Reorder roles

```sql
-- Update display_order for multiple roles
UPDATE roles
SET display_order = new_orders.order
FROM (VALUES
  ('role-uuid-1', 1),
  ('role-uuid-2', 2),
  ('role-uuid-3', 3)
) AS new_orders(id, order)
WHERE roles.id = new_orders.id::uuid;
```

### Reorder projects within a role

```sql
-- Update display_order for projects in a specific role
UPDATE projects
SET display_order = new_orders.order
FROM (VALUES
  ('project-uuid-1', 1),
  ('project-uuid-2', 2),
  ('project-uuid-3', 3)
) AS new_orders(id, order)
WHERE projects.id = new_orders.id::uuid
  AND projects.role_id = 'role-uuid-here';
```

## Triggers

### update_updated_at_column()

**Purpose**: Automatically update the `updated_at` timestamp on record updates

**Applied to**:
- users table
- roles table
- projects table

**Trigger**: BEFORE UPDATE

## Performance Considerations

### Indexed Queries (Fast)

✅ Fetch roles by slug
✅ Fetch published roles ordered by display_order
✅ Fetch projects by role_id
✅ Fetch published projects ordered by display_order

### Non-Indexed Queries (Slower)

⚠️ Full-text search on descriptions
⚠️ Filtering by tech_stack array elements
⚠️ Complex joins without proper indexes

### Optimization Tips

1. Always use indexes for WHERE clauses
2. Use partial indexes for common filtered queries
3. Limit result sets with LIMIT clause
4. Use SELECT only needed columns
5. Leverage Supabase connection pooling

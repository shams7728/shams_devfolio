# Supabase Client Utilities

This directory contains type-safe Supabase client utilities for the Multi-Role Portfolio Platform.

## Files

- **client.ts** - Browser client for client-side operations
- **server.ts** - Server clients for server-side operations (regular and admin)
- **queries.ts** - Type-safe database query helpers
- **errors.ts** - Error handling wrappers
- **index.ts** - Central export point

## Usage

### Browser Client (Client Components)

```typescript
import { supabase, roleQueries } from '@/lib/supabase';

// In a client component
export default function RolesList() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await roleQueries.getAll(supabase, true);
        setRoles(data);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    }
    fetchRoles();
  }, []);

  return <div>{/* Render roles */}</div>;
}
```

### Server Client (Server Components)

```typescript
import { createClient, roleQueries } from '@/lib/supabase';

// In a server component
export default async function RolesPage() {
  const supabase = await createClient();
  const roles = await roleQueries.getAll(supabase, true);

  return <div>{/* Render roles */}</div>;
}
```

### Admin Client (Server-side only)

```typescript
import { createAdminClient, roleQueries } from '@/lib/supabase';

// In an API route or server action
export async function POST(request: Request) {
  const adminClient = createAdminClient();
  
  // This bypasses RLS policies
  const allRoles = await roleQueries.getAll(adminClient, false);
  
  return Response.json(allRoles);
}
```

## Query Helpers

### Role Queries

```typescript
import { createClient, roleQueries } from '@/lib/supabase';

const supabase = await createClient();

// Get all published roles
const publishedRoles = await roleQueries.getAll(supabase, true);

// Get all roles (including unpublished)
const allRoles = await roleQueries.getAll(supabase, false);

// Get role by ID
const role = await roleQueries.getById(supabase, 'role-id');

// Get role by slug
const role = await roleQueries.getBySlug(supabase, 'web-developer');

// Create a new role
const newRole = await roleQueries.create(supabase, {
  title: 'Web Developer',
  description: 'Full-stack web development',
  slug: 'web-developer',
  is_published: true,
  display_order: 1,
});

// Update a role
const updatedRole = await roleQueries.update(supabase, 'role-id', {
  title: 'Senior Web Developer',
});

// Delete a role
await roleQueries.delete(supabase, 'role-id');

// Reorder roles
await roleQueries.updateOrder(supabase, [
  { id: 'role-1', display_order: 1 },
  { id: 'role-2', display_order: 2 },
]);
```

### Project Queries

```typescript
import { createClient, projectQueries } from '@/lib/supabase';

const supabase = await createClient();

// Get all published projects for a role
const projects = await projectQueries.getByRole(supabase, 'role-id', true);

// Get project by ID
const project = await projectQueries.getById(supabase, 'project-id');

// Get project with role information
const projectWithRole = await projectQueries.getByIdWithRole(supabase, 'project-id');

// Create a new project
const newProject = await projectQueries.create(supabase, {
  role_id: 'role-id',
  title: 'My Project',
  short_description: 'A brief description',
  long_description: 'A detailed description',
  tech_stack: ['React', 'TypeScript', 'Next.js'],
  cover_image_url: 'https://example.com/image.jpg',
  gallery_urls: [],
  is_published: true,
  display_order: 1,
});

// Update a project
const updatedProject = await projectQueries.update(supabase, 'project-id', {
  title: 'Updated Project Title',
});

// Delete a project
await projectQueries.delete(supabase, 'project-id');

// Reorder projects within a role
await projectQueries.updateOrder(supabase, [
  { id: 'project-1', display_order: 1 },
  { id: 'project-2', display_order: 2 },
]);
```

### User Queries

```typescript
import { createAdminClient, userQueries } from '@/lib/supabase';

// User operations typically require admin privileges
const adminClient = createAdminClient();

// Get all users
const users = await userQueries.getAll(adminClient);

// Get user by ID
const user = await userQueries.getById(adminClient, 'user-id');

// Create a new user
const newUser = await userQueries.create(adminClient, {
  id: 'auth-user-id', // Must match auth.users.id
  email: 'admin@example.com',
  role: 'admin',
});

// Update a user
const updatedUser = await userQueries.update(adminClient, 'user-id', {
  role: 'super_admin',
});

// Delete a user
await userQueries.delete(adminClient, 'user-id');
```

## Error Handling

All query helpers throw `SupabaseError` instances on failure:

```typescript
import { roleQueries, getErrorMessage, isSupabaseError } from '@/lib/supabase';

try {
  const role = await roleQueries.getById(supabase, 'invalid-id');
} catch (error) {
  if (isSupabaseError(error)) {
    console.error('Supabase error:', error.code, error.message);
  }
  
  // Get user-friendly error message
  const message = getErrorMessage(error);
  console.error(message);
}
```

### Common Error Codes

- `23505` - Unique constraint violation (duplicate value)
- `23503` - Foreign key violation (referenced record doesn't exist)
- `23502` - Not null violation (required field missing)
- `42501` - RLS policy violation (insufficient permissions)
- `PGRST116` - Record not found

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Server-side only
```

## Security Notes

1. **Browser Client**: Uses the anon key, safe to expose in the browser. RLS policies control access.
2. **Server Client**: Uses the anon key with cookie-based authentication for user context.
3. **Admin Client**: Uses the service role key, bypasses RLS. **Never expose to the browser!**

## Requirements

This implementation satisfies:
- **Requirement 3.2**: Authenticated user access to admin operations
- **Requirement 12.1**: Proper database structure with foreign key relationships

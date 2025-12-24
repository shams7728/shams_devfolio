/**
 * Global Search API Route
 * 
 * Performs full-text search across roles and projects
 * Requirements: 7.1, 7.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface SearchResult {
  type: 'role' | 'project';
  id: string;
  title: string;
  description: string;
  slug?: string;
  role_slug?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // Return empty results if no query
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const supabase = await createClient();
    const searchTerm = query.trim();

    // Search roles (published only)
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('id, title, description, slug')
      .eq('is_published', true)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(10);

    if (rolesError) {
      console.error('Error searching roles:', rolesError);
    }

    // Search projects (published only)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, short_description, role_id, roles!inner(slug)')
      .eq('is_published', true)
      .or(`title.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`)
      .limit(10);

    if (projectsError) {
      console.error('Error searching projects:', projectsError);
    }

    // Format results
    const results: SearchResult[] = [];

    // Add role results
    if (roles && Array.isArray(roles)) {
      roles.forEach((role: any) => {
        results.push({
          type: 'role',
          id: role.id,
          title: role.title,
          description: role.description,
          slug: role.slug,
        });
      });
    }

    // Add project results
    if (projects && Array.isArray(projects)) {
      projects.forEach((project: any) => {
        results.push({
          type: 'project',
          id: project.id,
          title: project.title,
          description: project.short_description,
          role_slug: project.roles?.slug,
        });
      });
    }

    // Limit total results to 20
    const limitedResults = results.slice(0, 20);

    return NextResponse.json({ results: limitedResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

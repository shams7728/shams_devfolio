/**
 * Skills Page
 * 
 * Server component that displays the tech ecosystem visualization
 * with category-based skill grouping and 3D rotating orbits
 * 
 * Requirements: 4.1, 4.2, 4.3
 */

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import SkillsPageClient from './skills-page-client';

export const metadata: Metadata = {
  title: 'Skills & Technologies | Portfolio',
  description: 'Explore my technology stack and skills through an interactive 3D visualization',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SkillsPage() {
  const supabase = await createClient();

  // Fetch all published projects to extract technologies (legacy/connections)
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true);

  // Fetch managed skills and categories
  const { data: categories } = await supabase
    .from('skill_categories')
    .select('*')
    .order('display_order', { ascending: true });

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <SkillsPageClient
      projects={projects || []}
      dbCategories={categories || []}
      dbSkills={skills || []}
    />
  );
}

/**
 * Seed Sample Data Script
 * 
 * Populates the database with sample roles and projects for testing
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedData() {
  console.log('🌱 Starting to seed sample data...\n');

  try {
    // Check if roles already exist
    const { data: existingRoles } = await supabase
      .from('roles')
      .select('id, title')
      .limit(1);

    if (existingRoles && existingRoles.length > 0) {
      console.log('ℹ️  Roles already exist in database');
      console.log('   Existing roles:', existingRoles.map(r => r.title).join(', '));
    } else {
      // Insert sample roles
      console.log('📝 Inserting sample roles...');
      const { data: roles, error: rolesError } = await supabase
        .from('roles')
        .insert([
          {
            title: 'Web Developer',
            description: 'Full-stack web development with modern frameworks and technologies',
            slug: 'web-developer',
            is_published: true,
            display_order: 1,
          },
          {
            title: 'Data Analyst',
            description: 'Data analysis, visualization, and insights using Python and SQL',
            slug: 'data-analyst',
            is_published: true,
            display_order: 2,
          },
          {
            title: 'Flutter Developer',
            description: 'Cross-platform mobile app development with Flutter',
            slug: 'flutter-developer',
            is_published: true,
            display_order: 3,
          },
        ])
        .select();

      if (rolesError) {
        console.error('❌ Error inserting roles:', rolesError.message);
        return;
      }

      console.log('✅ Inserted', roles?.length, 'roles');
    }

    // Get role IDs
    const { data: roles } = await supabase
      .from('roles')
      .select('id, slug')
      .in('slug', ['web-developer', 'data-analyst', 'flutter-developer']);

    if (!roles || roles.length === 0) {
      console.error('❌ No roles found');
      return;
    }

    const webDevRole = roles.find(r => r.slug === 'web-developer');
    const dataAnalystRole = roles.find(r => r.slug === 'data-analyst');
    const flutterDevRole = roles.find(r => r.slug === 'flutter-developer');

    // Check if projects already exist
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1);

    if (existingProjects && existingProjects.length > 0) {
      console.log('\nℹ️  Projects already exist in database');
      console.log('   Run this script with --force to recreate sample data');
    } else {
      // Insert sample projects
      console.log('\n📝 Inserting sample projects...');
      
      const sampleProjects = [];

      if (webDevRole) {
        sampleProjects.push(
          {
            role_id: webDevRole.id,
            title: 'E-Commerce Platform',
            short_description: 'A modern e-commerce platform with real-time inventory management',
            long_description: 'Built a full-featured e-commerce platform with Next.js, featuring real-time inventory updates, secure payment processing with Stripe, and an admin dashboard for order management.',
            tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL'],
            github_url: 'https://github.com/example/ecommerce',
            live_url: 'https://ecommerce-demo.vercel.app',
            cover_image_url: 'https://placehold.co/800x600/3b82f6/ffffff?text=E-Commerce+Platform',
            gallery_urls: ['https://placehold.co/800x600/3b82f6/ffffff?text=Screenshot+1'],
            is_published: true,
            display_order: 1,
          },
          {
            role_id: webDevRole.id,
            title: 'Task Management App',
            short_description: 'Collaborative task management with real-time updates',
            long_description: 'Developed a collaborative task management application with real-time synchronization using Supabase. Features include team workspaces and drag-and-drop task organization.',
            tech_stack: ['React', 'Supabase', 'Framer Motion', 'Zustand'],
            github_url: 'https://github.com/example/taskapp',
            live_url: 'https://taskapp-demo.vercel.app',
            cover_image_url: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Task+Manager',
            gallery_urls: ['https://placehold.co/800x600/8b5cf6/ffffff?text=Screenshot+1'],
            is_published: true,
            display_order: 2,
          }
        );
      }

      if (dataAnalystRole) {
        sampleProjects.push({
          role_id: dataAnalystRole.id,
          title: 'Sales Analytics Dashboard',
          short_description: 'Interactive dashboard for sales performance analysis',
          long_description: 'Created an interactive sales analytics dashboard using Python and Plotly. The dashboard provides real-time insights into sales trends and customer behavior.',
          tech_stack: ['Python', 'Pandas', 'Plotly', 'SQL', 'Jupyter'],
          github_url: 'https://github.com/example/sales-dashboard',
          cover_image_url: 'https://placehold.co/800x600/10b981/ffffff?text=Sales+Dashboard',
          gallery_urls: ['https://placehold.co/800x600/10b981/ffffff?text=Screenshot+1'],
          is_published: true,
          display_order: 1,
        });
      }

      if (flutterDevRole) {
        sampleProjects.push({
          role_id: flutterDevRole.id,
          title: 'Fitness Tracking App',
          short_description: 'Mobile app for tracking workouts and nutrition',
          long_description: 'Built a cross-platform fitness tracking app with Flutter. Features include workout logging, nutrition tracking, and progress visualization.',
          tech_stack: ['Flutter', 'Dart', 'Firebase', 'Provider'],
          github_url: 'https://github.com/example/fitness-app',
          cover_image_url: 'https://placehold.co/800x600/06b6d4/ffffff?text=Fitness+App',
          gallery_urls: ['https://placehold.co/800x600/06b6d4/ffffff?text=Screenshot+1'],
          is_published: true,
          display_order: 1,
        });
      }

      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .insert(sampleProjects)
        .select();

      if (projectsError) {
        console.error('❌ Error inserting projects:', projectsError.message);
        return;
      }

      console.log('✅ Inserted', projects?.length, 'projects');
    }

    console.log('\n✅ Sample data seeding complete!');
    console.log('\n📊 Summary:');
    
    const { count: rolesCount } = await supabase
      .from('roles')
      .select('*', { count: 'exact', head: true });
    
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    console.log(`   - Roles: ${rolesCount}`);
    console.log(`   - Projects: ${projectsCount}`);
    console.log('\n🚀 You can now view your portfolio at http://localhost:3000');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

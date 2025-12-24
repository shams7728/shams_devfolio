/**
 * Project Details Page
 * 
 * Server component that displays detailed project information
 * Implements ISR with 60-second revalidation
 * Requirements: 7.1, 7.2, 7.3, 7.4, 8.1
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectModel } from '@/lib/models/project';
import { NavigationBar } from '@/components/navigation-bar';
import { PageTransition } from '@/components/page-transition';
import { ProjectHero } from '@/components/project-details/project-hero';
import { ProjectGallery } from '@/components/project-details/project-gallery';
import { ProjectInfo } from '@/components/project-details/project-info';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    projectId: string;
  }>;
}

/**
 * Generate metadata for SEO
 * Requirements: 8.1
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const supabase = await createClient();
  const projectWithRole = await ProjectModel.getByIdWithRole(supabase, projectId);

  if (!projectWithRole) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${projectWithRole.title} | ${projectWithRole.role.title} | Multi-Role Portfolio`,
    description: projectWithRole.short_description,
    openGraph: {
      title: projectWithRole.title,
      description: projectWithRole.short_description,
      type: 'website',
      images: [
        {
          url: projectWithRole.cover_image_url,
          width: 1200,
          height: 630,
          alt: projectWithRole.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: projectWithRole.title,
      description: projectWithRole.short_description,
      images: [projectWithRole.cover_image_url],
    },
  };
}

/**
 * Project Details Page Component
 * 
 * Fetches project with role information and displays complete details
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, projectId } = await params;
  const supabase = await createClient();

  // Fetch project with role information
  const projectWithRole = await ProjectModel.getByIdWithRole(supabase, projectId);

  if (!projectWithRole || !projectWithRole.is_published) {
    notFound();
  }

  // Verify the slug matches the role
  if (projectWithRole.role.slug !== slug) {
    notFound();
  }

  const project = projectWithRole;

  return (
    <PageTransition>
      <main className="w-full overflow-x-hidden bg-black min-h-screen">
        <NavigationBar />

        {/* Advanced Hero Section */}
        <ProjectHero project={project} />

        {/* Project Information */}
        <ProjectInfo project={project} />

        {/* Interactive Gallery */}
        <ProjectGallery
          images={project.gallery_urls || []}
          title={project.title}
        />

      </main>
    </PageTransition>
  );
}

/**
 * Enable ISR with 60-second revalidation
 * Requirements: 8.3
 */
export const revalidate = 60;

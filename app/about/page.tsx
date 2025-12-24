import { Metadata } from 'next';
import AboutPageClient from './about-page-client';
import { createClient } from '@/lib/supabase/server';
import { TimelineModel } from '@/lib/models/timeline';
import { WorkflowStagesModel } from '@/lib/models/workflow-stages';

export const metadata: Metadata = {
  title: 'About | Portfolio',
  description: 'Learn about my journey, process, and what drives me',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function AboutPage() {
  const supabase = await createClient();

  // Fetch timeline milestones and workflow stages
  const [milestones, workflowStages] = await Promise.all([
    TimelineModel.getAll(supabase),
    WorkflowStagesModel.getAll(supabase),
  ]);

  return (
    <AboutPageClient
      milestones={milestones}
      workflowStages={workflowStages}
    />
  );
}

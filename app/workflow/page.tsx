/**
 * Workflow Page
 * 
 * Displays the workflow/process visualization
 * Requirements: 5.1, 5.2, 5.3
 */

import { createClient } from '@/lib/supabase/server';
import { WorkflowStagesModel } from '@/lib/models/workflow-stages';
import WorkflowVisualization from '@/components/workflow-visualization';

export const dynamic = 'force-dynamic';

export default async function WorkflowPage() {
  const supabase = await createClient();

  // Fetch workflow stages
  const stages = await WorkflowStagesModel.getAll(supabase);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Workflow Process
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A systematic approach to delivering high-quality solutions from concept to deployment
          </p>
        </div>

        {/* Workflow Visualization */}
        <WorkflowVisualization stages={stages} />
      </div>
    </div>
  );
}

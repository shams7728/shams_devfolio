/**
 * Timeline Demo Page
 * 
 * Demonstrates the Timeline component with sample data
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import { createClient } from '@/lib/supabase/server';
import { TimelineModel } from '@/lib/models/timeline';
import Timeline from '@/components/timeline';

export default async function TimelineDemoPage() {
  const supabase = await createClient();
  
  // Fetch timeline milestones
  const milestones = await TimelineModel.getAll(supabase);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Timeline
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A journey through key milestones and achievements
          </p>
        </div>

        <Timeline milestones={milestones} />

        {milestones.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No timeline milestones have been added yet.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Add milestones through the admin dashboard to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

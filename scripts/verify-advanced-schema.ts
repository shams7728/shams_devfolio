/**
 * Verify Advanced Features Schema
 * 
 * This script verifies that the advanced features tables were created successfully.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function verifySchema() {
  console.log('🔍 Verifying advanced features schema...\n');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials in environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  const tables = [
    'impact_metrics',
    'timeline_milestones',
    'contact_messages',
    'theme_settings',
    'role_backgrounds',
    'workflow_stages'
  ];
  
  console.log('Checking tables:\n');
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists and is accessible`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error}`);
    }
  }
  
  console.log('\n🔍 Checking seed data:\n');
  
  // Check theme_settings
  const { data: themeData, error: themeError } = await supabase
    .from('theme_settings')
    .select('*')
    .limit(1);
  
  if (themeError) {
    console.log(`❌ theme_settings seed data: ${themeError.message}`);
  } else if (themeData && themeData.length > 0) {
    console.log(`✅ theme_settings: Default settings exist`);
    console.log(`   Accent color: ${themeData[0].accent_color}`);
    console.log(`   Animation speed: ${themeData[0].animation_speed}`);
    console.log(`   Default theme: ${themeData[0].default_theme}`);
  } else {
    console.log(`⚠️  theme_settings: No default settings found`);
  }
  
  // Check workflow_stages
  const { data: workflowData, error: workflowError } = await supabase
    .from('workflow_stages')
    .select('*')
    .order('display_order');
  
  if (workflowError) {
    console.log(`❌ workflow_stages seed data: ${workflowError.message}`);
  } else if (workflowData && workflowData.length > 0) {
    console.log(`✅ workflow_stages: ${workflowData.length} default stages exist`);
    workflowData.forEach(stage => {
      console.log(`   ${stage.display_order}. ${stage.icon} ${stage.title}`);
    });
  } else {
    console.log(`⚠️  workflow_stages: No default stages found`);
  }
  
  console.log('\n✅ Schema verification completed');
}

verifySchema().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

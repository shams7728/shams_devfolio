/**
 * Open Supabase SQL Editor
 * 
 * This script provides instructions and optionally opens the Supabase SQL editor
 * to apply the RLS policy fix.
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function extractProjectRef(url: string): string | null {
  // Extract project ref from URL like https://xxxxx.supabase.co
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match ? match[1] : null;
}

function main() {
  console.log('🔧 Supabase RLS Policy Fix\n');
  console.log('='.repeat(60));
  
  if (!SUPABASE_URL) {
    console.error('\n❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
    process.exit(1);
  }
  
  const projectRef = extractProjectRef(SUPABASE_URL);
  
  if (!projectRef) {
    console.error('\n❌ Could not extract project reference from Supabase URL');
    process.exit(1);
  }
  
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '003_fix_rls_policies.sql');
  
  console.log('\n📋 Instructions to apply RLS policy fix:\n');
  console.log('1. Open the Supabase SQL Editor:');
  console.log(`   ${sqlEditorUrl}\n`);
  console.log('2. Copy the SQL from:');
  console.log(`   ${migrationPath}\n`);
  console.log('3. Paste it into the SQL editor');
  console.log('4. Click "Run" or press Ctrl+Enter\n');
  console.log('='.repeat(60));
  
  // Read and display the SQL
  console.log('\n📄 SQL to execute:\n');
  console.log('='.repeat(60));
  
  try {
    const sql = readFileSync(migrationPath, 'utf-8');
    console.log(sql);
    console.log('='.repeat(60));
  } catch (error) {
    console.error(`\n❌ Could not read migration file: ${error}`);
    process.exit(1);
  }
  
  console.log('\n💡 After applying the migration, run: npm run test:rls\n');
  
  // Try to open the browser (platform-specific)
  console.log('🌐 Opening SQL Editor in your browser...\n');
  
  const { exec } = require('child_process');
  const command = process.platform === 'win32' 
    ? `start ${sqlEditorUrl}`
    : process.platform === 'darwin'
    ? `open ${sqlEditorUrl}`
    : `xdg-open ${sqlEditorUrl}`;
  
  exec(command, (error: any) => {
    if (error) {
      console.log('⚠️  Could not open browser automatically');
      console.log(`   Please open manually: ${sqlEditorUrl}\n`);
    }
  });
}

main();

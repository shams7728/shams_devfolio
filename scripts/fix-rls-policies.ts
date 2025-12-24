/**
 * Fix RLS Policies Script
 * 
 * This script applies the RLS policy fix to remove infinite recursion.
 * It reads the migration file and executes it using the Supabase service role.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies to remove infinite recursion...\n');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  // Read the migration file
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '003_fix_rls_policies.sql');
  console.log(`📄 Reading migration: ${migrationPath}\n`);
  
  const sql = readFileSync(migrationPath, 'utf-8');
  
  // Execute the entire SQL as one transaction
  console.log('⚙️  Executing SQL migration...\n');
  
  try {
    // Use the Supabase SQL editor endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });
    
    if (response.ok) {
      console.log('✅ Migration applied successfully!\n');
    } else {
      const error = await response.text();
      console.log(`⚠️  Response status: ${response.status}`);
      console.log(`⚠️  This is expected if exec_sql RPC doesn't exist.\n`);
      console.log('📝 Please apply the migration manually:\n');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of:');
      console.log(`   ${migrationPath}`);
      console.log('4. Execute the SQL\n');
    }
  } catch (error: any) {
    console.log('⚠️  Could not execute via API\n');
    console.log('📝 Please apply the migration manually:\n');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of:');
    console.log(`   ${migrationPath}`);
    console.log('4. Execute the SQL\n');
  }
  
  console.log('💡 After applying the migration, run: npm run test:rls');
}

fixRLSPolicies().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

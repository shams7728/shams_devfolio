/**
 * Apply Advanced Features Schema
 * 
 * This script applies the advanced features schema migration directly to Supabase.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function applySchema() {
  console.log('🔄 Applying advanced features schema...\n');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials in environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  // Read the migration file
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '005_advanced_features_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');
  
  console.log('📄 Executing migration: 005_advanced_features_schema.sql\n');
  
  // Split SQL into individual statements and execute them
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.match(/^COMMENT ON/));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Skip comments and empty statements
    if (statement.trim().startsWith('--') || statement.trim() === ';') {
      continue;
    }
    
    try {
      // Use the REST API to execute SQL
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ query: statement })
      });
      
      if (!response.ok) {
        // Try alternative approach using Supabase client
        const { error } = await supabase.rpc('exec', { query: statement });
        
        if (error) {
          console.log(`⚠️  Statement ${i + 1}: ${error.message.substring(0, 80)}...`);
          errorCount++;
        } else {
          successCount++;
        }
      } else {
        successCount++;
      }
    } catch (error: any) {
      console.log(`⚠️  Statement ${i + 1}: ${error.message?.substring(0, 80) || error}...`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ⚠️  Errors: ${errorCount}`);
  console.log(`\n💡 Note: Some errors are expected if tables already exist or if the exec function is not available.`);
  console.log(`   Please verify the schema by running: npx tsx scripts/verify-advanced-schema.ts`);
  console.log(`\n   If tables are not created, please apply the migration manually through the Supabase SQL Editor:`);
  console.log(`   1. Go to your Supabase project dashboard`);
  console.log(`   2. Navigate to SQL Editor`);
  console.log(`   3. Copy and paste the contents of: supabase/migrations/005_advanced_features_schema.sql`);
  console.log(`   4. Click "Run" to execute the migration`);
}

applySchema().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

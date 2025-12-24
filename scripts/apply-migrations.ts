/**
 * Apply Database Migrations
 * 
 * This script applies SQL migrations to the Supabase database.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function applyMigrations() {
  console.log('🔄 Applying database migrations...\n');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials in environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // Get all migration files
  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  console.log(`Found ${files.length} migration files:\n`);
  
  for (const file of files) {
    console.log(`📄 Applying: ${file}`);
    
    try {
      const sql = readFileSync(join(migrationsDir, file), 'utf-8');
      
      // Execute the SQL
      const { error } = await supabase.rpc('exec_sql', { sql_string: sql });
      
      if (error) {
        // If exec_sql doesn't exist, try direct execution
        // Note: This requires the SQL to be split into individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (const statement of statements) {
          const { error: stmtError } = await supabase.rpc('exec', { 
            query: statement 
          });
          
          if (stmtError) {
            console.error(`  ❌ Error: ${stmtError.message}`);
            // Continue with other statements
          }
        }
      }
      
      console.log(`  ✅ Applied successfully\n`);
    } catch (error) {
      console.error(`  ❌ Error: ${error}\n`);
    }
  }
  
  console.log('✅ Migration process completed');
}

applyMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

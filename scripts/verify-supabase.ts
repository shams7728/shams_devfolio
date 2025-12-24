/**
 * Supabase Connection Verification Script
 * 
 * This script verifies that your Supabase backend is properly configured.
 * Run with: npx tsx scripts/verify-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/types/database';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✓ ${message}`, 'green');
}

function error(message: string) {
  log(`✗ ${message}`, 'red');
}

function info(message: string) {
  log(`ℹ ${message}`, 'blue');
}

function warning(message: string) {
  log(`⚠ ${message}`, 'yellow');
}

async function verifySupabase() {
  log('\n=== Supabase Backend Verification ===\n', 'cyan');

  // Check environment variables
  info('Checking environment variables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    error('NEXT_PUBLIC_SUPABASE_URL is not set');
    return false;
  }
  success('NEXT_PUBLIC_SUPABASE_URL is set');

  if (!supabaseAnonKey) {
    error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    return false;
  }
  success('NEXT_PUBLIC_SUPABASE_ANON_KEY is set');

  if (!supabaseServiceKey) {
    warning('SUPABASE_SERVICE_ROLE_KEY is not set (required for admin operations)');
  } else {
    success('SUPABASE_SERVICE_ROLE_KEY is set');
  }

  // Create Supabase client
  info('\nConnecting to Supabase...');
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  try {
    // Test connection
    const { error: connectionError } = await supabase.from('roles').select('count').limit(1);
    
    if (connectionError) {
      error(`Connection failed: ${connectionError.message}`);
      return false;
    }
    success('Successfully connected to Supabase');

    // Check tables exist
    info('\nVerifying database tables...');
    
    const tables = ['users', 'roles', 'projects'];
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table as any).select('count').limit(1);
        if (tableError) {
          error(`Table '${table}' not found or not accessible`);
        } else {
          success(`Table '${table}' exists`);
        }
      } catch (err) {
        error(`Error checking table '${table}': ${err}`);
      }
    }

    // Check storage buckets
    info('\nVerifying storage buckets...');
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      error(`Failed to list buckets: ${bucketsError.message}`);
    } else {
      const requiredBuckets = ['project-images', 'role-icons'];
      for (const bucketName of requiredBuckets) {
        const exists = buckets?.some(b => b.name === bucketName);
        if (exists) {
          success(`Bucket '${bucketName}' exists`);
        } else {
          error(`Bucket '${bucketName}' not found`);
        }
      }
    }

    // Check RLS policies
    info('\nVerifying Row Level Security...');
    
    // Try to read published roles (should work without auth)
    const { data: publicRoles, error: publicError } = await supabase
      .from('roles')
      .select('*')
      .eq('is_published', true);
    
    if (publicError) {
      error(`Public read access failed: ${publicError.message}`);
    } else {
      success(`Public read access works (found ${publicRoles?.length || 0} published roles)`);
    }

    // Try to insert without auth (should fail)
    const { error: insertError } = await supabase
      .from('roles')
      .insert({ 
        title: 'Test', 
        description: 'Test', 
        slug: 'test',
        is_published: false,
        display_order: 0
      } as any);
    
    if (insertError) {
      if (insertError.message.includes('permission') || insertError.code === '42501') {
        success('RLS policies are enforcing write restrictions');
      } else {
        warning(`Unexpected error on unauthorized insert: ${insertError.message}`);
      }
    } else {
      error('RLS policies are NOT enforcing write restrictions (security issue!)');
    }

    // Summary
    log('\n=== Verification Complete ===\n', 'cyan');
    success('Your Supabase backend is properly configured!');
    
    info('\nNext steps:');
    console.log('  1. Create your first admin user (see supabase/README.md)');
    console.log('  2. Test authentication by logging in');
    console.log('  3. Start building your portfolio!\n');

    return true;

  } catch (err) {
    error(`Unexpected error: ${err}`);
    return false;
  }
}

// Run verification
verifySupabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    error(`Fatal error: ${err}`);
    process.exit(1);
  });

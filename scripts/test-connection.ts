/**
 * Test Supabase Connection
 * 
 * This script tests your Supabase connection and environment variables
 * 
 * Usage: npx tsx scripts/test-connection.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

async function testConnection() {
  console.log('\n=== Testing Supabase Connection ===\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Environment Variables:');
  console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '✗ Missing'}`);
  console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓ Set' : '✗ Missing'}`);
  console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✓ Set' : '✗ Missing'}`);
  console.log('');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing required environment variables');
    console.error('Please check your .env.local file');
    process.exit(1);
  }

  // Test connection with anon key
  console.log('Testing connection with anon key...');
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data, error } = await supabaseAnon
      .from('roles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('   This might be a CORS issue or invalid credentials');
    } else {
      console.log('✓ Connection successful with anon key');
    }
  } catch (err) {
    console.error('❌ Network error:', err);
  }

  // Test connection with service role key
  if (supabaseServiceKey) {
    console.log('\nTesting connection with service role key...');
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    try {
      const { data, error } = await supabaseService
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        console.error('❌ Connection failed:', error.message);
      } else {
        console.log('✓ Connection successful with service role key');
      }
    } catch (err) {
      console.error('❌ Network error:', err);
    }
  }

  // Test auth
  console.log('\nTesting auth endpoint...');
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`);
    if (response.ok) {
      console.log('✓ Auth endpoint is reachable');
    } else {
      console.error('❌ Auth endpoint returned:', response.status);
    }
  } catch (err) {
    console.error('❌ Cannot reach auth endpoint:', err);
  }

  console.log('\n=== Test Complete ===\n');
}

testConnection();

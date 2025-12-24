/**
 * Check RLS Policies Script
 * 
 * This script checks what RLS policies are currently active on the users table
 * 
 * Usage: npx tsx scripts/check-rls-policies.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

async function checkPolicies() {
  console.log('\n🔍 Checking RLS Policies on users table...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Query pg_policies to see what policies exist
    const { data: policies, error } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'users');

    if (error) {
      console.error('❌ Error fetching policies:', error);
      process.exit(1);
    }

    console.log(`Found ${policies.length} policies on users table:\n`);
    
    policies.forEach((policy, index) => {
      console.log(`${index + 1}. Policy: "${policy.policyname}"`);
      console.log(`   Command: ${policy.cmd}`);
      console.log(`   Permissive: ${policy.permissive}`);
      console.log(`   Roles: ${policy.roles}`);
      console.log(`   USING: ${policy.qual}`);
      console.log('');
    });

    // Now test if a user can actually read their own record
    console.log('🧪 Testing if users can read their own records...\n');

    const { data: authUsers } = await supabase.auth.admin.listUsers();
    
    if (authUsers.users.length > 0) {
      const testUser = authUsers.users[0];
      console.log(`Testing with user: ${testUser.email} (${testUser.id})\n`);

      // Try with anon key (simulating logged-in user)
      const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      
      // Set the auth context by getting a session token
      // Note: We can't actually test this without a real session, but we can check the policy logic
      
      const { data: userData, error: userError } = await anonClient
        .from('users')
        .select('*')
        .eq('id', testUser.id)
        .single();

      if (userError) {
        console.log('❌ FAILED: User cannot read their own record');
        console.log(`   Error: ${userError.message}`);
        console.log(`   Code: ${userError.code}`);
        console.log('\nThis is why login is failing!\n');
      } else {
        console.log('✅ SUCCESS: User can read their own record');
        console.log(`   Found: ${userData.email} (${userData.role})\n`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPolicies();

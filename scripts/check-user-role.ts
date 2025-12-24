/**
 * Check User Role
 * 
 * Quick script to check if a user exists and has the right role
 * 
 * Usage: npx tsx scripts/check-user-role.ts <email>
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

async function checkUserRole() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: npx tsx scripts/check-user-role.ts <email>');
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`\n🔍 Checking user: ${email}\n`);

  // Check in auth.users
  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUser = authData.users.find(u => u.email === email);

  if (!authUser) {
    console.log('❌ User not found in auth.users');
    process.exit(1);
  }

  console.log('✅ Found in auth.users');
  console.log(`   ID: ${authUser.id}`);
  console.log(`   Email: ${authUser.email}`);
  console.log(`   Created: ${authUser.created_at}`);

  // Check in users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (userError) {
    console.log('\n❌ User not found in users table!');
    console.log(`   Error: ${userError.message}`);
    console.log('\n🔧 Fix: Add user to users table:');
    console.log(`   INSERT INTO users (id, email, role) VALUES ('${authUser.id}', '${email}', 'super_admin');\n`);
    process.exit(1);
  }

  console.log('\n✅ Found in users table');
  console.log(`   Email: ${userData.email}`);
  console.log(`   Role: ${userData.role}`);
  console.log(`   Created: ${userData.created_at}`);

  // Test if user can read their own record with anon key
  console.log('\n🧪 Testing RLS with anon key...');
  const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  const { data: testData, error: testError } = await anonClient
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (testError) {
    console.log('❌ RLS is blocking access!');
    console.log(`   Error: ${testError.message}`);
    console.log('\n   This means the "Users can read own record" policy is not working.');
    console.log('   The policy exists but may not be properly configured.\n');
  } else {
    console.log('✅ RLS allows access (but this test is without auth context)');
  }

  console.log('\n✅ User setup looks correct!');
  console.log('   If login still fails, the issue is likely with session cookies or RLS.\n');
}

checkUserRole();

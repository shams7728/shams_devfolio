/**
 * Test Login Flow
 * 
 * This script simulates the login flow to see where it's failing
 * 
 * Usage: npx tsx scripts/test-login.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function testLogin() {
  console.log('\n🧪 Testing Login Flow...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  const email = await question('Enter email: ');
  const password = await question('Enter password: ');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Step 1: Sign in
    console.log('\n1️⃣ Attempting to sign in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('❌ Sign in failed:', authError.message);
      process.exit(1);
    }

    console.log('✅ Sign in successful!');
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}`);

    // Step 2: Try to read user record (this is what middleware does)
    console.log('\n2️⃣ Checking if user can read their own record...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('❌ FAILED to read user record!');
      console.error(`   Error: ${userError.message}`);
      console.error(`   Code: ${userError.code}`);
      console.error('\n🔍 This is why you\'re getting 403 Access Denied!');
      console.error('   The middleware cannot verify your admin role.\n');
      
      console.log('🔧 To fix this, run this SQL in Supabase SQL Editor:\n');
      console.log('-- First, check if RLS is enabled');
      console.log('SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = \'users\';\n');
      console.log('-- If rowsecurity is true, check policies');
      console.log('SELECT * FROM pg_policies WHERE tablename = \'users\';\n');
      console.log('-- You may need to recreate the policy:');
      console.log('DROP POLICY IF EXISTS "Users can read own record" ON users;');
      console.log('CREATE POLICY "Users can read own record" ON users FOR SELECT USING (auth.uid() = id);\n');
      
      process.exit(1);
    }

    console.log('✅ Successfully read user record!');
    console.log(`   Role: ${userData.role}`);

    // Step 3: Check if role is admin or super_admin
    console.log('\n3️⃣ Verifying admin access...');
    if (userData.role === 'admin' || userData.role === 'super_admin') {
      console.log('✅ User has admin access!');
      console.log('\n🎉 Login flow is working correctly!');
      console.log('   You should be able to access /admin\n');
    } else {
      console.log('❌ User does not have admin role');
      console.log(`   Current role: ${userData.role}\n`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

testLogin();

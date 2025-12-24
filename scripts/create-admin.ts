/**
 * Create Admin User Script
 * 
 * This script helps you add an admin user to the users table
 * after they've been created in Supabase Auth.
 * 
 * Usage:
 * 1. Create user in Supabase Auth dashboard first
 * 2. Copy their UUID
 * 3. Run: npx tsx scripts/create-admin.ts
 */

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

async function createAdmin() {
  console.log('\n=== Create Admin User ===\n');
  console.log('Prerequisites:');
  console.log('1. User must already exist in Supabase Auth');
  console.log('2. You need their User ID (UUID) from the Auth dashboard\n');

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get user details
    const userId = await question('Enter User ID (UUID) from Supabase Auth: ');
    const email = await question('Enter user email: ');
    const roleInput = await question('Enter role (admin/super_admin) [default: admin]: ');
    
    const role = roleInput.trim() || 'admin';

    if (role !== 'admin' && role !== 'super_admin') {
      console.error('❌ Error: Role must be either "admin" or "super_admin"');
      process.exit(1);
    }

    // Verify the user exists in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);

    if (authError || !authUser) {
      console.error('❌ Error: User not found in Supabase Auth');
      console.error('Please create the user in Supabase Auth dashboard first');
      process.exit(1);
    }

    console.log(`\n✓ Found user in Auth: ${authUser.user.email}`);

    // Insert into users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        role: role,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.error('❌ Error: User already exists in users table');
      } else {
        console.error('❌ Error:', error.message);
      }
      process.exit(1);
    }

    console.log('\n✅ Success! Admin user created:');
    console.log(`   Email: ${data.email}`);
    console.log(`   Role: ${data.role}`);
    console.log(`   ID: ${data.id}`);
    console.log('\nThe user can now log in at /login\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdmin();

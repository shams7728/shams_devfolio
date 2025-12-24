/**
 * Check Admin Setup Script
 * 
 * This script verifies that your admin user is properly configured
 * 
 * Usage: npx tsx scripts/check-admin-setup.ts
 */

import { createClient } from '@supabase/supabase-js';

async function checkAdminSetup() {
  console.log('\n=== Checking Admin Setup ===\n');

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }

  console.log('✓ Environment variables found\n');

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Check users in auth.users
    console.log('Checking Supabase Auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      process.exit(1);
    }

    console.log(`✓ Found ${authUsers.users.length} user(s) in Supabase Auth\n`);

    if (authUsers.users.length === 0) {
      console.log('⚠️  No users found in Supabase Auth');
      console.log('   Create a user in Supabase Dashboard → Authentication → Users\n');
      process.exit(0);
    }

    // Display auth users
    console.log('Auth Users:');
    authUsers.users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
    });
    console.log('');

    // Check users in users table
    console.log('Checking users table...');
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('❌ Error fetching users from database:', dbError.message);
      process.exit(1);
    }

    console.log(`✓ Found ${dbUsers.length} admin user(s) in users table\n`);

    if (dbUsers.length === 0) {
      console.log('⚠️  No admin users found in users table');
      console.log('   You need to add users to the users table with this SQL:\n');
      console.log('   INSERT INTO users (id, email, role)');
      console.log('   VALUES (\'USER-UUID-FROM-AUTH\', \'email@example.com\', \'admin\');\n');
      process.exit(0);
    }

    // Display admin users
    console.log('Admin Users:');
    dbUsers.forEach((user, index) => {
      const authUser = authUsers.users.find(au => au.id === user.id);
      const lastSignIn = authUser?.last_sign_in_at 
        ? new Date(authUser.last_sign_in_at).toLocaleString()
        : 'Never';
      
      console.log(`  ${index + 1}. ${user.email}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     ID: ${user.id}`);
      console.log(`     Last sign in: ${lastSignIn}`);
      console.log('');
    });

    // Check for mismatches
    console.log('Checking for mismatches...');
    const authUserIds = new Set(authUsers.users.map(u => u.id));
    const dbUserIds = new Set(dbUsers.map(u => u.id));

    const inAuthNotInDb = authUsers.users.filter(u => !dbUserIds.has(u.id));
    const inDbNotInAuth = dbUsers.filter(u => !authUserIds.has(u.id));

    if (inAuthNotInDb.length > 0) {
      console.log('\n⚠️  Users in Auth but NOT in users table:');
      inAuthNotInDb.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
        console.log(`     Run this SQL to add them:`);
        console.log(`     INSERT INTO users (id, email, role) VALUES ('${user.id}', '${user.email}', 'admin');\n`);
      });
    }

    if (inDbNotInAuth.length > 0) {
      console.log('\n⚠️  Users in users table but NOT in Auth:');
      inDbNotInAuth.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
        console.log(`     This user cannot log in. Remove from users table or create in Auth.\n`);
      });
    }

    if (inAuthNotInDb.length === 0 && inDbNotInAuth.length === 0) {
      console.log('✓ All users are properly synced\n');
    }

    // Final instructions
    console.log('=== Next Steps ===\n');
    console.log('1. Go to http://localhost:3000/login');
    console.log('2. Log in with one of the admin users above');
    console.log('3. You should be redirected to /admin\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdminSetup();

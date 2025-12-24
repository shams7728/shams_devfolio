/**
 * Complete Setup Verification Script
 * 
 * This script checks:
 * 1. Environment variables
 * 2. Supabase connection
 * 3. Database tables
 * 4. RLS policies
 * 5. Admin users
 * 6. Sample data
 * 
 * Usage: npx tsx scripts/check-full-setup.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

async function checkFullSetup() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     PORTFOLIO WEBSITE - SETUP VERIFICATION            ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let hasErrors = false;

  // ============================================
  // 1. CHECK ENVIRONMENT VARIABLES
  // ============================================
  console.log('📋 Step 1: Checking Environment Variables...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!');
    console.error('   Please check your .env.local file\n');
    hasErrors = true;
    process.exit(1);
  }

  console.log('   ✓ NEXT_PUBLIC_SUPABASE_URL');
  console.log('   ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   ✓ SUPABASE_SERVICE_ROLE_KEY');
  console.log('');

  // ============================================
  // 2. TEST SUPABASE CONNECTION
  // ============================================
  console.log('🔌 Step 2: Testing Supabase Connection...\n');

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data, error } = await supabase.from('roles').select('count').limit(1);
    if (error) throw error;
    console.log('   ✓ Successfully connected to Supabase');
    console.log('');
  } catch (error) {
    console.error('   ❌ Failed to connect to Supabase');
    console.error('   Error:', error);
    console.error('');
    hasErrors = true;
  }

  // ============================================
  // 3. CHECK DATABASE TABLES
  // ============================================
  console.log('🗄️  Step 3: Checking Database Tables...\n');

  const tables = ['users', 'roles', 'projects'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      if (error) throw error;
      console.log(`   ✓ Table "${table}" exists`);
    } catch (error: any) {
      console.error(`   ❌ Table "${table}" not found or inaccessible`);
      console.error(`      Error: ${error.message}`);
      hasErrors = true;
    }
  }
  console.log('');

  // ============================================
  // 4. CHECK ADMIN USERS
  // ============================================
  console.log('👤 Step 4: Checking Admin Users...\n');

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (users.length === 0) {
      console.log('   ⚠️  No admin users found!');
      console.log('   You need to create an admin user first.');
      console.log('');
      hasErrors = true;
    } else {
      console.log(`   ✓ Found ${users.length} admin user(s):\n`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      ID: ${user.id}`);
        console.log('');
      });
    }
  } catch (error: any) {
    console.error('   ❌ Failed to fetch admin users');
    console.error(`      Error: ${error.message}`);
    console.error('');
    hasErrors = true;
  }

  // ============================================
  // 5. CHECK RLS POLICIES
  // ============================================
  console.log('🔒 Step 5: Checking RLS Policies...\n');

  try {
    // Test if users can read their own record (the fix we need)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;

    if (authUsers.users.length > 0) {
      const testUserId = authUsers.users[0].id;
      
      // Try to read user record with anon key (simulating logged-in user)
      const anonClient = createClient(supabaseUrl, supabaseAnonKey);
      
      // This will fail if RLS is too restrictive
      const { data: userData, error: userError } = await anonClient
        .from('users')
        .select('*')
        .eq('id', testUserId)
        .single();

      if (userError) {
        console.log('   ⚠️  RLS Policy Issue Detected!');
        console.log('   Users cannot read their own records.');
        console.log('   This will prevent login from working.');
        console.log('');
        console.log('   🔧 FIX: Run this SQL in Supabase SQL Editor:');
        console.log('');
        console.log('   DROP POLICY IF EXISTS "Super admins can read all users" ON users;');
        console.log('   CREATE POLICY "Users can read own record" ON users FOR SELECT USING (auth.uid() = id);');
        console.log('   CREATE POLICY "Super admins can read all users" ON users FOR SELECT USING (');
        console.log('     EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = \'super_admin\')');
        console.log('   );');
        console.log('');
        hasErrors = true;
      } else {
        console.log('   ✓ RLS policies are configured correctly');
        console.log('   Users can read their own records');
        console.log('');
      }
    }
  } catch (error: any) {
    console.error('   ❌ Failed to check RLS policies');
    console.error(`      Error: ${error.message}`);
    console.error('');
  }

  // ============================================
  // 6. CHECK SAMPLE DATA
  // ============================================
  console.log('📊 Step 6: Checking Sample Data...\n');

  try {
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*');

    if (rolesError) throw rolesError;

    console.log(`   Roles: ${roles.length} found`);

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) throw projectsError;

    console.log(`   Projects: ${projects.length} found`);
    console.log('');
  } catch (error: any) {
    console.error('   ❌ Failed to fetch sample data');
    console.error(`      Error: ${error.message}`);
    console.error('');
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('╔════════════════════════════════════════════════════════╗');
  if (hasErrors) {
    console.log('║  ❌ SETUP INCOMPLETE - Issues Found                   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('Please fix the issues above and run this script again.\n');
    process.exit(1);
  } else {
    console.log('║  ✅ SETUP COMPLETE - Everything looks good!           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('🎉 Your website is ready!\n');
    console.log('Next steps:');
    console.log('1. Make sure your dev server is running: npm run dev');
    console.log('2. Go to http://localhost:3000/login');
    console.log('3. Log in with your admin credentials');
    console.log('4. Start building your portfolio!\n');
  }
}

checkFullSetup();

/**
 * RLS Policy Testing Script
 * 
 * This script tests Row Level Security policies for the multi-role portfolio platform.
 * It verifies that:
 * 1. Public users can read published roles and projects
 * 2. Public users cannot read unpublished content
 * 3. Unauthenticated users cannot write to any tables
 * 4. Authenticated admins can perform all CRUD operations
 * 
 * Requirements: 3.5, 12.4
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Test results tracking
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (error) {
    console.log(`  Error: ${error}`);
  }
}

async function runTests() {
  console.log('🧪 Starting RLS Policy Tests\n');
  console.log('='.repeat(60));
  
  // Create clients
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // Test data IDs (will be created during tests)
  let testRoleId: string | null = null;
  let testProjectId: string | null = null;
  let testAdminId: string | null = null;
  
  try {
    // =====================================================
    // SETUP: Create test data using service role
    // =====================================================
    console.log('\n📦 Setting up test data...\n');
    
    // Create a test admin user
    const { data: authUser, error: authError } = await serviceClient.auth.admin.createUser({
      email: `test-admin-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      email_confirm: true,
    });
    
    if (authError || !authUser.user) {
      throw new Error(`Failed to create test admin: ${authError?.message}`);
    }
    
    testAdminId = authUser.user.id;
    console.log(`Created test admin: ${testAdminId}`);
    
    // Insert admin metadata
    const { error: userError } = await serviceClient
      .from('users')
      .insert({
        id: testAdminId,
        email: authUser.user.email!,
        role: 'admin',
      });
    
    if (userError) {
      throw new Error(`Failed to create user metadata: ${userError.message}`);
    }
    
    // Create a published test role
    const { data: publishedRole, error: roleError1 } = await serviceClient
      .from('roles')
      .insert({
        title: 'Test Published Role',
        description: 'A published role for testing',
        slug: `test-published-${Date.now()}`,
        is_published: true,
        display_order: 1,
      })
      .select()
      .single();
    
    if (roleError1 || !publishedRole) {
      throw new Error(`Failed to create published role: ${roleError1?.message}`);
    }
    
    testRoleId = publishedRole.id;
    console.log(`Created published role: ${testRoleId}`);
    
    // Create an unpublished test role
    const { data: unpublishedRole, error: roleError2 } = await serviceClient
      .from('roles')
      .insert({
        title: 'Test Unpublished Role',
        description: 'An unpublished role for testing',
        slug: `test-unpublished-${Date.now()}`,
        is_published: false,
        display_order: 2,
      })
      .select()
      .single();
    
    if (roleError2 || !unpublishedRole) {
      throw new Error(`Failed to create unpublished role: ${roleError2?.message}`);
    }
    
    console.log(`Created unpublished role: ${unpublishedRole.id}`);
    
    // Create a published test project
    const { data: publishedProject, error: projectError1 } = await serviceClient
      .from('projects')
      .insert({
        role_id: testRoleId,
        title: 'Test Published Project',
        short_description: 'A published project for testing',
        long_description: 'Detailed description of the published project',
        tech_stack: ['TypeScript', 'React'],
        cover_image_url: 'https://example.com/cover.jpg',
        is_published: true,
        display_order: 1,
      })
      .select()
      .single();
    
    if (projectError1 || !publishedProject) {
      throw new Error(`Failed to create published project: ${projectError1?.message}`);
    }
    
    testProjectId = publishedProject.id;
    console.log(`Created published project: ${testProjectId}`);
    
    // Create an unpublished test project
    const { data: unpublishedProject, error: projectError2 } = await serviceClient
      .from('projects')
      .insert({
        role_id: testRoleId,
        title: 'Test Unpublished Project',
        short_description: 'An unpublished project for testing',
        long_description: 'Detailed description of the unpublished project',
        tech_stack: ['JavaScript', 'Node.js'],
        cover_image_url: 'https://example.com/cover2.jpg',
        is_published: false,
        display_order: 2,
      })
      .select()
      .single();
    
    if (projectError2 || !unpublishedProject) {
      throw new Error(`Failed to create unpublished project: ${projectError2?.message}`);
    }
    
    console.log(`Created unpublished project: ${unpublishedProject.id}`);
    
    // =====================================================
    // TEST 1: Public read access to published roles
    // =====================================================
    console.log('\n📖 Testing public read access...\n');
    
    const { data: publicRoles, error: publicRolesError } = await anonClient
      .from('roles')
      .select('*')
      .eq('is_published', true);
    
    logTest(
      'Public can read published roles',
      !publicRolesError && publicRoles.length > 0 && publicRoles.some(r => r.id === testRoleId),
      publicRolesError?.message
    );
    
    // =====================================================
    // TEST 2: Public cannot read unpublished roles
    // =====================================================
    
    const { data: unpublishedRoles } = await anonClient
      .from('roles')
      .select('*')
      .eq('is_published', false);
    
    logTest(
      'Public cannot read unpublished roles',
      !unpublishedRoles || unpublishedRoles.length === 0,
      unpublishedRoles && unpublishedRoles.length > 0 ? 'Unpublished roles were returned' : undefined
    );
    
    // =====================================================
    // TEST 3: Public read access to published projects
    // =====================================================
    
    const { data: publicProjects, error: publicProjectsError } = await anonClient
      .from('projects')
      .select('*')
      .eq('is_published', true);
    
    logTest(
      'Public can read published projects',
      !publicProjectsError && publicProjects.length > 0 && publicProjects.some(p => p.id === testProjectId),
      publicProjectsError?.message
    );
    
    // =====================================================
    // TEST 4: Public cannot read unpublished projects
    // =====================================================
    
    const { data: unpublishedProjects } = await anonClient
      .from('projects')
      .select('*')
      .eq('is_published', false);
    
    logTest(
      'Public cannot read unpublished projects',
      !unpublishedProjects || unpublishedProjects.length === 0,
      unpublishedProjects && unpublishedProjects.length > 0 ? 'Unpublished projects were returned' : undefined
    );
    
    // =====================================================
    // TEST 5: Unauthenticated users cannot insert roles
    // =====================================================
    console.log('\n🔒 Testing write restrictions for unauthenticated users...\n');
    
    const { error: insertRoleError } = await anonClient
      .from('roles')
      .insert({
        title: 'Unauthorized Role',
        description: 'This should fail',
        slug: 'unauthorized-role',
        is_published: false,
      });
    
    logTest(
      'Unauthenticated users cannot insert roles',
      insertRoleError !== null,
      insertRoleError ? undefined : 'Insert succeeded when it should have failed'
    );
    
    // =====================================================
    // TEST 6: Unauthenticated users cannot update roles
    // =====================================================
    
    const { error: updateRoleError } = await anonClient
      .from('roles')
      .update({ title: 'Updated Title' })
      .eq('id', testRoleId);
    
    logTest(
      'Unauthenticated users cannot update roles',
      updateRoleError !== null,
      updateRoleError ? undefined : 'Update succeeded when it should have failed'
    );
    
    // =====================================================
    // TEST 7: Unauthenticated users cannot delete roles
    // =====================================================
    
    const { error: deleteRoleError } = await anonClient
      .from('roles')
      .delete()
      .eq('id', testRoleId);
    
    logTest(
      'Unauthenticated users cannot delete roles',
      deleteRoleError !== null,
      deleteRoleError ? undefined : 'Delete succeeded when it should have failed'
    );
    
    // =====================================================
    // TEST 8: Unauthenticated users cannot insert projects
    // =====================================================
    
    const { error: insertProjectError } = await anonClient
      .from('projects')
      .insert({
        role_id: testRoleId,
        title: 'Unauthorized Project',
        short_description: 'This should fail',
        long_description: 'This should fail',
        tech_stack: ['Test'],
        cover_image_url: 'https://example.com/test.jpg',
        is_published: false,
      });
    
    logTest(
      'Unauthenticated users cannot insert projects',
      insertProjectError !== null,
      insertProjectError ? undefined : 'Insert succeeded when it should have failed'
    );
    
    // =====================================================
    // TEST 9: Unauthenticated users cannot update projects
    // =====================================================
    
    const { error: updateProjectError } = await anonClient
      .from('projects')
      .update({ title: 'Updated Project Title' })
      .eq('id', testProjectId);
    
    logTest(
      'Unauthenticated users cannot update projects',
      updateProjectError !== null,
      updateProjectError ? undefined : 'Update succeeded when it should have failed'
    );
    
    // =====================================================
    // TEST 10: Unauthenticated users cannot delete projects
    // =====================================================
    
    const { error: deleteProjectError } = await anonClient
      .from('projects')
      .delete()
      .eq('id', testProjectId);
    
    logTest(
      'Unauthenticated users cannot delete projects',
      deleteProjectError !== null,
      deleteProjectError ? undefined : 'Delete succeeded when it should have failed'
    );
    
    // =====================================================
    // TEST 11: Authenticated admins can read all roles
    // =====================================================
    console.log('\n👤 Testing authenticated admin access...\n');
    
    // Sign in as the test admin
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: authUser.user.email!,
      password: 'TestPassword123!',
    });
    
    if (signInError || !signInData.session) {
      throw new Error(`Failed to sign in as admin: ${signInError?.message}`);
    }
    
    // Create authenticated client
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${signInData.session.access_token}`,
        },
      },
    });
    
    const { data: allRoles, error: allRolesError } = await authClient
      .from('roles')
      .select('*');
    
    logTest(
      'Authenticated admins can read all roles (published and unpublished)',
      !allRolesError && allRoles.length >= 2,
      allRolesError?.message
    );
    
    // =====================================================
    // TEST 12: Authenticated admins can insert roles
    // =====================================================
    
    const { data: newRole, error: adminInsertRoleError } = await authClient
      .from('roles')
      .insert({
        title: 'Admin Created Role',
        description: 'Created by authenticated admin',
        slug: `admin-role-${Date.now()}`,
        is_published: false,
      })
      .select()
      .single();
    
    logTest(
      'Authenticated admins can insert roles',
      !adminInsertRoleError && newRole !== null,
      adminInsertRoleError?.message
    );
    
    // =====================================================
    // TEST 13: Authenticated admins can update roles
    // =====================================================
    
    const { error: adminUpdateRoleError } = await authClient
      .from('roles')
      .update({ title: 'Admin Updated Title' })
      .eq('id', testRoleId);
    
    logTest(
      'Authenticated admins can update roles',
      !adminUpdateRoleError,
      adminUpdateRoleError?.message
    );
    
    // =====================================================
    // TEST 14: Authenticated admins can read all projects
    // =====================================================
    
    const { data: allProjects, error: allProjectsError } = await authClient
      .from('projects')
      .select('*');
    
    logTest(
      'Authenticated admins can read all projects (published and unpublished)',
      !allProjectsError && allProjects.length >= 2,
      allProjectsError?.message
    );
    
    // =====================================================
    // TEST 15: Authenticated admins can insert projects
    // =====================================================
    
    const { data: newProject, error: adminInsertProjectError } = await authClient
      .from('projects')
      .insert({
        role_id: testRoleId,
        title: 'Admin Created Project',
        short_description: 'Created by authenticated admin',
        long_description: 'Detailed description',
        tech_stack: ['TypeScript'],
        cover_image_url: 'https://example.com/admin-cover.jpg',
        is_published: false,
      })
      .select()
      .single();
    
    logTest(
      'Authenticated admins can insert projects',
      !adminInsertProjectError && newProject !== null,
      adminInsertProjectError?.message
    );
    
    // =====================================================
    // TEST 16: Authenticated admins can update projects
    // =====================================================
    
    const { error: adminUpdateProjectError } = await authClient
      .from('projects')
      .update({ title: 'Admin Updated Project Title' })
      .eq('id', testProjectId);
    
    logTest(
      'Authenticated admins can update projects',
      !adminUpdateProjectError,
      adminUpdateProjectError?.message
    );
    
    // =====================================================
    // TEST 17: Authenticated admins can delete projects
    // =====================================================
    
    if (newProject) {
      const { error: adminDeleteProjectError } = await authClient
        .from('projects')
        .delete()
        .eq('id', newProject.id);
      
      logTest(
        'Authenticated admins can delete projects',
        !adminDeleteProjectError,
        adminDeleteProjectError?.message
      );
    }
    
    // =====================================================
    // TEST 18: Authenticated admins can delete roles
    // =====================================================
    
    if (newRole) {
      const { error: adminDeleteRoleError } = await authClient
        .from('roles')
        .delete()
        .eq('id', newRole.id);
      
      logTest(
        'Authenticated admins can delete roles',
        !adminDeleteRoleError,
        adminDeleteRoleError?.message
      );
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed with error:', error);
    process.exit(1);
  } finally {
    // =====================================================
    // CLEANUP: Remove test data
    // =====================================================
    console.log('\n🧹 Cleaning up test data...\n');
    
    try {
      // Delete test projects (cascade will handle this when role is deleted)
      // Delete test roles
      if (testRoleId) {
        await serviceClient.from('roles').delete().eq('id', testRoleId);
      }
      
      // Delete test admin user
      if (testAdminId) {
        await serviceClient.from('users').delete().eq('id', testAdminId);
        await serviceClient.auth.admin.deleteUser(testAdminId);
      }
      
      console.log('Cleanup completed');
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
  
  // =====================================================
  // SUMMARY
  // =====================================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}`);
      if (r.error) {
        console.log(`    ${r.error}`);
      }
    });
    process.exit(1);
  } else {
    console.log('\n✅ All RLS policy tests passed!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

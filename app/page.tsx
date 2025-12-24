/**
 * Homepage - Public Portfolio Landing Page
 * 
 * Server component that fetches and displays published roles
 * Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 6.1, 9.1
 */

import { createClient } from '@/lib/supabase/server';
import { RoleModel } from '@/lib/models/role';
import { RoleBackgroundModel } from '@/lib/models/role-background';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { RolesGrid } from '@/components/roles-grid';
import { NavigationBar } from '@/components/navigation-bar';
import { PageTransition } from '@/components/page-transition';
import { SkillsShowcase } from '@/components/skills-showcase';

export default async function Home() {
  // Fetch published roles from database
  const supabase = await createClient();
  const roles = await RoleModel.getAll(supabase, true);

  // Fetch role backgrounds for the hero section
  const roleBackgroundsMap = new Map();
  for (const role of roles) {
    try {
      const background = await RoleBackgroundModel.getByRoleId(supabase, role.id);
      if (background) {
        roleBackgroundsMap.set(role.id, background);
      }
    } catch (error) {
      console.error(`Failed to fetch background for role ${role.id}:`, error);
    }
  }

  return (
    <PageTransition>
      <main className="w-full overflow-x-hidden">
        {/* Navigation bar with search */}
        <NavigationBar />

        {/* Enhanced hero section with 3D portrait and role rotator */}
        <HeroSection
          roles={roles}
          roleBackgrounds={roleBackgroundsMap}
          portraitUrl="/portrait.jpg"
        />

        {/* About Section with 3D Skills Sphere */}
        <AboutSection roles={roles} />

        {/* Roles grid with cards */}
        <RolesGrid roles={roles} />

        {/* 10. Advanced Skills Showcase (3D Multiverse) */}
        <SkillsShowcase />
      </main>
    </PageTransition>
  );
}

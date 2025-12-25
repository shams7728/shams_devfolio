/**
 * Technology Graph Utilities
 * 
 * Utilities for building technology graphs from project data
 * Requirements: 4.1, 4.2
 */

import type { Project } from '@/lib/types/database';
import type { Technology } from '@/components/3d/tech-ecosystem';
export type { Technology };

/**
 * Technology category mapping
 * Maps technology names to their categories
 */
const TECH_CATEGORIES: Record<string, string> = {
  // Frontend
  'React': 'Frontend',
  'Next.js': 'Frontend',
  'Vue': 'Frontend',
  'Angular': 'Frontend',
  'Svelte': 'Frontend',
  'Tailwind CSS': 'Frontend',
  'Bootstrap': 'Frontend',
  'Material-UI': 'Frontend',
  'Chakra UI': 'Frontend',
  'Three.js': 'Frontend',
  'D3.js': 'Frontend',
  'GSAP': 'Frontend',

  // Backend
  'Node.js': 'Backend',
  'Express': 'Backend',
  'NestJS': 'Backend',
  'Django': 'Backend',
  'FastAPI': 'Backend',
  'Flask': 'Backend',
  'Ruby on Rails': 'Backend',
  'Laravel': 'Backend',
  'Spring Boot': 'Backend',
  'ASP.NET': 'Backend',

  // Database
  'PostgreSQL': 'Database',
  'MySQL': 'Database',
  'MongoDB': 'Database',
  'Redis': 'Database',
  'SQLite': 'Database',
  'Supabase': 'Database',
  'Firebase': 'Database',
  'DynamoDB': 'Database',

  // Languages
  'JavaScript': 'Language',
  'TypeScript': 'Language',
  'Python': 'Language',
  'Java': 'Language',
  'C#': 'Language',
  'Go': 'Language',
  'Rust': 'Language',
  'PHP': 'Language',
  'Ruby': 'Language',
  'Dart': 'Language',
  'Kotlin': 'Language',
  'Swift': 'Language',

  // Mobile
  'Flutter': 'Mobile',
  'React Native': 'Mobile',
  'Ionic': 'Mobile',
  'Xamarin': 'Mobile',

  // DevOps
  'Docker': 'DevOps',
  'Kubernetes': 'DevOps',
  'Jenkins': 'DevOps',
  'GitHub Actions': 'DevOps',
  'GitLab CI': 'DevOps',
  'CircleCI': 'DevOps',

  // Cloud
  'AWS': 'Cloud',
  'Azure': 'Cloud',
  'GCP': 'Cloud',
  'Vercel': 'Cloud',
  'Netlify': 'Cloud',
  'Heroku': 'Cloud',
  'DigitalOcean': 'Cloud',

  // Tools
  'Git': 'Tools',
  'GitHub': 'Tools',
  'GitLab': 'Tools',
  'VS Code': 'Tools',
  'Webpack': 'Tools',
  'Vite': 'Tools',
  'ESLint': 'Tools',
  'Prettier': 'Tools',

  // Data Science
  'Pandas': 'Data Science',
  'NumPy': 'Data Science',
  'Matplotlib': 'Data Science',
  'Scikit-learn': 'Data Science',
  'TensorFlow': 'Data Science',
  'PyTorch': 'Data Science',
  'Jupyter': 'Data Science',

  // Testing
  'Jest': 'Testing',
  'Vitest': 'Testing',
  'Cypress': 'Testing',
  'Playwright': 'Testing',
  'Selenium': 'Testing',
  'Pytest': 'Testing',
};

/**
 * Get category for a technology
 * Returns 'Other' if not found in mapping
 */
function getTechCategory(techName: string): string {
  return TECH_CATEGORIES[techName] || 'Other';
}

/**
 * Build a technology graph from projects
 * 
 * Extracts all unique technologies from projects and builds
 * relationships based on co-occurrence in the same project
 * 
 * @param projects - Array of projects to extract technologies from
 * @returns Array of Technology objects with relationships
 */
export function buildTechGraph(projects: Project[]): Technology[] {
  // Map to store technology data
  const techMap = new Map<string, {
    name: string;
    category: string;
    relatedTech: Set<string>;
  }>();

  // First pass: collect all unique technologies
  projects.forEach(project => {
    project.tech_stack.forEach(tech => {
      if (!techMap.has(tech)) {
        techMap.set(tech, {
          name: tech,
          category: getTechCategory(tech),
          relatedTech: new Set<string>(),
        });
      }
    });
  });

  // Second pass: build relationships based on co-occurrence
  projects.forEach(project => {
    const techs = project.tech_stack;

    // For each pair of technologies in the same project
    for (let i = 0; i < techs.length; i++) {
      for (let j = i + 1; j < techs.length; j++) {
        const tech1 = techMap.get(techs[i]);
        const tech2 = techMap.get(techs[j]);

        if (tech1 && tech2) {
          // Add bidirectional relationship
          tech1.relatedTech.add(techs[j]);
          tech2.relatedTech.add(techs[i]);
        }
      }
    }
  });

  // Convert to Technology array
  const technologies: Technology[] = Array.from(techMap.entries()).map(([name, data]) => ({
    id: name, // Use name as ID for simplicity
    name: data.name,
    category: data.category,
    relatedTech: Array.from(data.relatedTech),
  }));

  return technologies;
}

/**
 * Get all unique categories from technologies
 */
export function getTechCategories(technologies: Technology[]): string[] {
  const categories = new Set<string>();
  technologies.forEach(tech => categories.add(tech.category));
  return Array.from(categories).sort();
}

/**
 * Filter technologies by category
 */
export function filterTechByCategory(
  technologies: Technology[],
  category: string
): Technology[] {
  return technologies.filter(tech => tech.category === category);
}

/**
 * Get technology statistics
 */
export function getTechStats(technologies: Technology[]): {
  totalTechs: number;
  totalCategories: number;
  totalConnections: number;
  avgConnectionsPerTech: number;
  mostConnectedTech: Technology | null;
} {
  const totalTechs = technologies.length;
  const totalCategories = getTechCategories(technologies).length;
  const totalConnections = technologies.reduce(
    (sum, tech) => sum + tech.relatedTech.length,
    0
  ) / 2; // Divide by 2 because connections are bidirectional

  const avgConnectionsPerTech = totalTechs > 0 ? totalConnections / totalTechs : 0;

  const mostConnectedTech = technologies.reduce<Technology | null>(
    (max, tech) => {
      if (!max || tech.relatedTech.length > max.relatedTech.length) {
        return tech;
      }
      return max;
    },
    null
  );

  return {
    totalTechs,
    totalCategories,
    totalConnections,
    avgConnectionsPerTech,
    mostConnectedTech,
  };
}

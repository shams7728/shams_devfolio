/**
 * EnhancedProjectCard Component Tests
 * 
 * Tests for enhanced project card with 3D tilt and neon glow
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnhancedProjectCard } from './enhanced-project-card';
import type { Project, Role } from '@/lib/types/database';

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
  },
}));

// Mock the accessibility context
vi.mock('@/lib/contexts/accessibility-context', () => ({
  useAccessibility: () => ({
    reducedMotion: false,
    contrastMode: false,
    textScale: 1,
    readabilityMode: false,
  }),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockRole: Role = {
  id: 'role-1',
  title: 'Web Developer',
  slug: 'web-developer',
  description: 'Test role description',
  icon_url: 'https://example.com/icon.png',
  display_order: 1,
  is_published: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockProject: Project & { role: Role } = {
  id: 'project-1',
  title: 'Test Project',
  slug: 'test-project',
  short_description: 'A test project description',
  full_description: 'Full description',
  cover_image_url: 'https://example.com/cover.jpg',
  tech_stack: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
  role_id: 'role-1',
  display_order: 1,
  is_published: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  role: mockRole,
};

describe('EnhancedProjectCard', () => {
  it('renders project title and description', () => {
    render(<EnhancedProjectCard project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeDefined();
    expect(screen.getByText('A test project description')).toBeDefined();
  });

  it('renders tech stack tags', () => {
    render(<EnhancedProjectCard project={mockProject} />);
    
    // Should show first 3 tech stack items
    expect(screen.getByText('React')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
    expect(screen.getByText('Next.js')).toBeDefined();
    
    // Should show "+1 more" for the 4th item
    expect(screen.getByText('+1 more')).toBeDefined();
  });

  it('renders role badge when showRoleBadge is true', () => {
    render(<EnhancedProjectCard project={mockProject} showRoleBadge={true} />);
    
    expect(screen.getByText('Web Developer')).toBeDefined();
  });

  it('does not render role badge when showRoleBadge is false', () => {
    render(<EnhancedProjectCard project={mockProject} showRoleBadge={false} />);
    
    // Role badge should not be in the card content
    const badges = screen.queryAllByText('Web Developer');
    expect(badges.length).toBe(0);
  });

  it('renders cover image with correct alt text', () => {
    render(<EnhancedProjectCard project={mockProject} />);
    
    const image = screen.getByAltText('Test Project');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe('https://example.com/cover.jpg');
  });

  it('creates correct link to project detail page', () => {
    const { container } = render(<EnhancedProjectCard project={mockProject} />);
    
    const link = container.querySelector('a');
    expect(link).toBeDefined();
    expect(link?.getAttribute('href')).toBe('/roles/web-developer/projects/project-1');
  });

  it('applies tech-tag class to tech stack items for neon glow animation', () => {
    const { container } = render(<EnhancedProjectCard project={mockProject} />);
    
    const techTags = container.querySelectorAll('.tech-tag');
    // Should have 4 tags (3 tech items + 1 "more" tag)
    expect(techTags.length).toBe(4);
  });
});

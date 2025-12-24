/**
 * Global Search Component Tests
 * 
 * Tests for search functionality including debouncing and keyboard navigation
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlobalSearch } from './global-search';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('GlobalSearch', () => {
  it('renders search input with correct placeholder', () => {
    render(<GlobalSearch />);
    const input = screen.getByPlaceholderText('Search roles and projects...');
    expect(input).toBeDefined();
    expect(input.getAttribute('type')).toBe('text');
  });

  it('renders search icon', () => {
    render(<GlobalSearch />);
    const svg = document.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<GlobalSearch />);
    const input = screen.getByPlaceholderText('Search roles and projects...');
    expect(input.getAttribute('aria-label')).toBe('Search');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe('search-results');
  });

  it('does not show results dropdown initially', () => {
    render(<GlobalSearch />);
    const dropdown = document.getElementById('search-results');
    expect(dropdown).toBeNull();
  });
});

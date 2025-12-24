/**
 * Timeline Component Tests
 * 
 * Tests for Timeline component rendering
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Timeline from './timeline';
import type { TimelineMilestone } from '@/lib/types/database';

describe('Timeline Component', () => {
  const mockMilestones: TimelineMilestone[] = [
    {
      id: '1',
      year: 2023,
      title: 'Started New Role',
      description: 'Joined the company as a senior developer',
      display_order: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      year: 2022,
      title: 'Graduated',
      description: 'Completed my degree in Computer Science',
      display_order: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  it('should render timeline with milestones', () => {
    render(<Timeline milestones={mockMilestones} />);

    // Check that years are displayed (multiple times for mobile/desktop)
    expect(screen.getAllByText('2023').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2022').length).toBeGreaterThan(0);

    // Check that titles are displayed (multiple times for mobile/desktop)
    expect(screen.getAllByText('Started New Role').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Graduated').length).toBeGreaterThan(0);

    // Check that descriptions are displayed (multiple times for mobile/desktop)
    expect(screen.getAllByText('Joined the company as a senior developer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed my degree in Computer Science').length).toBeGreaterThan(0);
  });

  it('should display empty state when no milestones', () => {
    render(<Timeline milestones={[]} />);

    expect(screen.getByText('No timeline milestones configured yet.')).toBeTruthy();
  });

  it('should render all milestone data', () => {
    render(<Timeline milestones={mockMilestones} />);

    // Verify all milestones are rendered (multiple times for mobile/desktop)
    mockMilestones.forEach((milestone) => {
      expect(screen.getAllByText(milestone.title).length).toBeGreaterThan(0);
      expect(screen.getAllByText(milestone.description).length).toBeGreaterThan(0);
    });
  });
});

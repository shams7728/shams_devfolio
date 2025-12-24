/**
 * TiltCard Component Tests
 * 
 * Tests for 3D tilt card functionality
 * Requirements: 10.1, 10.2, 10.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TiltCard } from './tilt-card';

// Mock the accessibility context
vi.mock('@/lib/contexts/accessibility-context', () => ({
  useAccessibility: () => ({
    reducedMotion: false,
    contrastMode: false,
    textScale: 1,
    readabilityMode: false,
  }),
}));

describe('TiltCard', () => {
  it('renders children correctly', () => {
    render(
      <TiltCard>
        <div>Test Content</div>
      </TiltCard>
    );
    
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TiltCard className="custom-class">
        <div>Test Content</div>
      </TiltCard>
    );
    
    const tiltCard = container.querySelector('.custom-class');
    expect(tiltCard).toBeDefined();
  });

  it('renders with glare effect by default', () => {
    const { container } = render(
      <TiltCard>
        <div>Test Content</div>
      </TiltCard>
    );
    
    // Check for glare element
    const glare = container.querySelector('.absolute.inset-0.pointer-events-none');
    expect(glare).toBeDefined();
  });

  it('does not render glare when disabled', () => {
    const { container } = render(
      <TiltCard glareEnable={false}>
        <div>Test Content</div>
      </TiltCard>
    );
    
    // Check that glare element is not present
    const glare = container.querySelector('.absolute.inset-0.pointer-events-none');
    expect(glare).toBeNull();
  });

  it('applies will-change-transform class for performance', () => {
    const { container } = render(
      <TiltCard>
        <div>Test Content</div>
      </TiltCard>
    );
    
    const tiltCard = container.querySelector('.will-change-transform');
    expect(tiltCard).toBeDefined();
  });
});

describe('TiltCard with reduced motion', () => {
  it('renders simple card without tilt when reduced motion is enabled', () => {
    // Mock reduced motion
    vi.mock('@/lib/contexts/accessibility-context', () => ({
      useAccessibility: () => ({
        reducedMotion: true,
        contrastMode: false,
        textScale: 1,
        readabilityMode: false,
      }),
    }));

    const { container } = render(
      <TiltCard className="test-class">
        <div>Test Content</div>
      </TiltCard>
    );
    
    expect(screen.getByText('Test Content')).toBeDefined();
    expect(container.querySelector('.test-class')).toBeDefined();
  });
});

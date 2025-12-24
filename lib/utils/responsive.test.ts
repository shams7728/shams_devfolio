/**
 * Responsive Utilities Tests
 * 
 * Unit tests for responsive utility functions
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  BREAKPOINTS,
  isBreakpoint,
  getCurrentBreakpoint,
  isPortrait,
  isLandscape,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveImageSizes,
  fluidClamp,
  getSpacing,
  SPACING,
} from './responsive';

describe('Responsive Utilities', () => {
  // Store original window dimensions
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
  });

  afterEach(() => {
    // Restore original dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.xs).toBe(320);
      expect(BREAKPOINTS.sm).toBe(640);
      expect(BREAKPOINTS.md).toBe(768);
      expect(BREAKPOINTS.lg).toBe(1024);
      expect(BREAKPOINTS.xl).toBe(1280);
      expect(BREAKPOINTS['2xl']).toBe(1536);
      expect(BREAKPOINTS['3xl']).toBe(1920);
      expect(BREAKPOINTS['4k']).toBe(2560);
    });
  });

  describe('isBreakpoint', () => {
    it('should return true when viewport is at or above breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      expect(isBreakpoint('xs')).toBe(true);
      expect(isBreakpoint('sm')).toBe(true);
      expect(isBreakpoint('md')).toBe(true);
      expect(isBreakpoint('lg')).toBe(true);
      expect(isBreakpoint('xl')).toBe(false);
    });

    it('should return false when viewport is below breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      expect(isBreakpoint('sm')).toBe(false);
      expect(isBreakpoint('md')).toBe(false);
    });
  });

  describe('getCurrentBreakpoint', () => {
    it('should return correct breakpoint for mobile width (320px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      expect(getCurrentBreakpoint()).toBe('xs');
    });

    it('should return correct breakpoint for tablet width (768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      expect(getCurrentBreakpoint()).toBe('md');
    });

    it('should return correct breakpoint for desktop width (1024px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      expect(getCurrentBreakpoint()).toBe('lg');
    });

    it('should return correct breakpoint for Full HD width (1920px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      expect(getCurrentBreakpoint()).toBe('3xl');
    });

    it('should return correct breakpoint for 4K width (2560px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 2560,
      });

      expect(getCurrentBreakpoint()).toBe('4k');
    });
  });

  describe('isPortrait', () => {
    it('should return true when height is greater than width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      expect(isPortrait()).toBe(true);
    });

    it('should return false when width is greater than height', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 667,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 375,
      });

      expect(isPortrait()).toBe(false);
    });
  });

  describe('isLandscape', () => {
    it('should return true when width is greater than height', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 667,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 375,
      });

      expect(isLandscape()).toBe(true);
    });

    it('should return false when height is greater than width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      expect(isLandscape()).toBe(false);
    });
  });

  describe('isMobile', () => {
    it('should return true for mobile widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      expect(isMobile()).toBe(true);
    });

    it('should return false for tablet and desktop widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      expect(isMobile()).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      expect(isTablet()).toBe(true);
    });

    it('should return false for mobile widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      expect(isTablet()).toBe(false);
    });

    it('should return false for desktop widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      expect(isTablet()).toBe(false);
    });
  });

  describe('isDesktop', () => {
    it('should return true for desktop widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      expect(isDesktop()).toBe(true);
    });

    it('should return false for mobile and tablet widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      expect(isDesktop()).toBe(false);
    });
  });

  describe('getResponsiveImageSizes', () => {
    it('should return default sizes string', () => {
      const sizes = getResponsiveImageSizes();
      expect(sizes).toContain('100vw');
      expect(sizes).toContain('50vw');
      expect(sizes).toContain('33vw');
      expect(sizes).toContain('25vw');
    });

    it('should return custom sizes string', () => {
      const sizes = getResponsiveImageSizes({
        mobile: '90vw',
        tablet: '45vw',
        desktop: '30vw',
        wide: '20vw',
      });
      expect(sizes).toContain('90vw');
      expect(sizes).toContain('45vw');
      expect(sizes).toContain('30vw');
      expect(sizes).toContain('20vw');
    });
  });

  describe('fluidClamp', () => {
    it('should generate valid CSS clamp string', () => {
      const clamp = fluidClamp(16, 24);
      expect(clamp).toContain('clamp');
      expect(clamp).toContain('16px');
      expect(clamp).toContain('24px');
    });

    it('should handle custom viewport widths', () => {
      const clamp = fluidClamp(12, 20, 320, 1920);
      expect(clamp).toContain('clamp');
      expect(clamp).toContain('12px');
      expect(clamp).toContain('20px');
    });
  });

  describe('getSpacing', () => {
    it('should return mobile spacing for mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      expect(getSpacing('sm')).toBe(SPACING.sm.mobile);
      expect(getSpacing('md')).toBe(SPACING.md.mobile);
    });

    it('should return tablet spacing for tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      expect(getSpacing('sm')).toBe(SPACING.sm.tablet);
      expect(getSpacing('md')).toBe(SPACING.md.tablet);
    });

    it('should return desktop spacing for desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      expect(getSpacing('sm')).toBe(SPACING.sm.desktop);
      expect(getSpacing('md')).toBe(SPACING.md.desktop);
    });
  });
});

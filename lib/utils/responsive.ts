/**
 * Responsive Utilities
 * 
 * Utilities and constants for responsive design
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

/**
 * Breakpoint definitions matching Tailwind CSS defaults
 * These align with the CSS custom properties in globals.css
 */
export const BREAKPOINTS = {
  xs: 320,   // Extra small devices (small phones)
  sm: 640,   // Small devices (phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (desktops)
  xl: 1280,  // Extra large devices (large desktops)
  '2xl': 1536, // 2X large devices (larger desktops)
  '3xl': 1920, // 3X large devices (Full HD)
  '4k': 2560,  // 4K displays
} as const;

/**
 * Touch target minimum size for mobile accessibility
 * Following WCAG 2.1 guidelines (44x44px minimum)
 */
export const TOUCH_TARGET_MIN_SIZE = 44;

/**
 * Check if the current viewport matches a specific breakpoint
 * @param breakpoint - The breakpoint to check
 * @returns boolean indicating if viewport is at or above the breakpoint
 */
export function isBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
}

/**
 * Get the current breakpoint name
 * @returns The name of the current breakpoint
 */
export function getCurrentBreakpoint(): keyof typeof BREAKPOINTS {
  if (typeof window === 'undefined') return 'xs';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['4k']) return '4k';
  if (width >= BREAKPOINTS['3xl']) return '3xl';
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * Check if the device is in portrait orientation
 * @returns boolean indicating portrait orientation
 */
export function isPortrait(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
}

/**
 * Check if the device is in landscape orientation
 * @returns boolean indicating landscape orientation
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
}

/**
 * Check if the device is a mobile device (based on viewport width)
 * @returns boolean indicating mobile device
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
}

/**
 * Check if the device is a tablet (based on viewport width)
 * @returns boolean indicating tablet device
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
}

/**
 * Check if the device is a desktop (based on viewport width)
 * @returns boolean indicating desktop device
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.lg;
}

/**
 * Check if the user prefers reduced motion
 * @returns boolean indicating reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers dark color scheme
 * @returns boolean indicating dark mode preference
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get responsive image sizes string for Next.js Image component
 * @param options - Configuration for responsive sizes
 * @returns sizes string for Next.js Image
 */
export function getResponsiveImageSizes(options?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  wide?: string;
}): string {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    wide = '25vw',
  } = options || {};

  return `(max-width: ${BREAKPOINTS.md}px) ${mobile}, (max-width: ${BREAKPOINTS.lg}px) ${tablet}, (max-width: ${BREAKPOINTS['2xl']}px) ${desktop}, ${wide}`;
}

/**
 * Clamp a value between min and max based on viewport width
 * Useful for fluid typography and spacing
 * @param min - Minimum value
 * @param max - Maximum value
 * @param minVw - Minimum viewport width
 * @param maxVw - Maximum viewport width
 * @returns CSS clamp string
 */
export function fluidClamp(
  min: number,
  max: number,
  minVw: number = BREAKPOINTS.sm,
  maxVw: number = BREAKPOINTS['2xl']
): string {
  const slope = (max - min) / (maxVw - minVw);
  const yAxisIntersection = -minVw * slope + min;
  
  return `clamp(${min}px, ${yAxisIntersection.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${max}px)`;
}

/**
 * Responsive spacing scale
 * Maps to Tailwind spacing but provides programmatic access
 */
export const SPACING = {
  xs: { mobile: 4, tablet: 6, desktop: 8 },
  sm: { mobile: 8, tablet: 12, desktop: 16 },
  md: { mobile: 16, tablet: 24, desktop: 32 },
  lg: { mobile: 24, tablet: 32, desktop: 48 },
  xl: { mobile: 32, tablet: 48, desktop: 64 },
  '2xl': { mobile: 48, tablet: 64, desktop: 96 },
} as const;

/**
 * Get spacing value for current breakpoint
 * @param size - Size key from SPACING
 * @returns spacing value in pixels
 */
export function getSpacing(size: keyof typeof SPACING): number {
  if (typeof window === 'undefined') return SPACING[size].mobile;
  
  if (isDesktop()) return SPACING[size].desktop;
  if (isTablet()) return SPACING[size].tablet;
  return SPACING[size].mobile;
}

# Enhanced Hero Section

## Overview

The enhanced hero section is a cinematic, full-screen landing experience that showcases the portfolio with cutting-edge 3D visuals and animations.

## Features Implemented

### 1. 3D Floating Portrait (Requirements 1.1, 1.2)
- Three.js-powered 3D portrait with subtle rotation animation
- Reactive lighting that responds to cursor proximity
- Parallax motion following mouse movement
- Lazy-loaded for optimal performance
- Automatic fallback to 2D image for browsers without WebGL support

### 2. Role Rotator with Adaptive Backgrounds (Requirements 2.1, 2.2)
- Automatically cycles through all published roles
- Smooth GSAP text transitions
- Adaptive background animations that change based on the current role:
  - **Data Analyst**: Animated data-grid light patterns
  - **Web Developer**: Animated code-line strokes
  - **Flutter Developer**: Soft UI component outlines
  - **SQL Developer**: Floating table and column shapes
- Configurable through admin dashboard

### 3. Glassmorphism Panels (Requirement 1.3)
- Frosted glass aesthetic with backdrop blur
- Semi-transparent backgrounds with subtle borders
- Responsive to light/dark theme
- Disabled in readability mode for accessibility

### 4. Parallax Motion Effects (Requirement 1.2)
- 3D portrait follows cursor movement
- Smooth camera transitions
- Decorative gradient orbs with pulse animations

### 5. GSAP Text Reveals (Requirement 1.3)
- Staggered word animations for title
- Smooth fade-in and slide-up effects
- Sequential timing for optimal visual flow
- Perspective transforms for depth

### 6. Animated CTAs (Requirement 1.3)
- Primary CTA: "View Projects" with gradient background
- Secondary CTA: "Get in Touch" with glassmorphism
- Hover effects with scale and shadow animations
- Icon animations on hover
- Back-easing for playful entrance

## Layout

The hero section uses a responsive grid layout:
- **Mobile**: Stacked layout with portrait on top
- **Desktop**: Two-column layout with text on left, portrait on right

## Performance Optimizations

1. **Lazy Loading**: 3D portrait is lazy-loaded to improve initial page load
2. **Suspense Boundary**: Loading fallback while 3D scene initializes
3. **GPU Acceleration**: All animations use transform and opacity
4. **Reduced Motion**: Respects user's motion preferences
5. **WebGL Detection**: Automatic fallback for unsupported browsers

## Accessibility

- All interactive elements are keyboard accessible
- Focus indicators for keyboard navigation
- Reduced motion support
- High contrast mode compatible
- Screen reader friendly with proper ARIA labels

## Customization

### Portrait Image
Replace `/public/portrait.svg` with your own portrait image (JPG, PNG, or WebP recommended).

### Role Backgrounds
Configure role-specific backgrounds through the admin dashboard at `/admin/roles/[id]/background`.

### Animation Timing
Adjust animation speeds in the component or through theme settings in the admin dashboard.

## Browser Support

- **Modern Browsers**: Full 3D experience with all features
- **Older Browsers**: Graceful degradation to 2D images
- **Mobile**: Optimized performance with reduced effects

## Dependencies

- `three` - 3D rendering engine
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Three.js helpers
- `gsap` - Animation library
- `next/dynamic` - Code splitting for lazy loading

## Files Modified

- `components/hero-section.tsx` - Main hero section component
- `app/page.tsx` - Homepage integration
- `app/globals.css` - Glassmorphism and animation styles
- `public/portrait.svg` - Placeholder portrait image

## Related Components

- `components/3d/floating-portrait.tsx` - 3D portrait component
- `components/animations/role-rotator.tsx` - Role rotation logic
- `components/animations/role-background.tsx` - Adaptive backgrounds

# 3D Tilt Effects Implementation

## Overview

This document describes the implementation of 3D tilt effects for project cards, including depth shadows, neon glow animations, and performance optimizations.

**Requirements Addressed:** 10.1, 10.2, 10.3, 10.4, 10.5

## Components

### 1. TiltCard Component (`components/tilt-card.tsx`)

A reusable 3D tilt card component that provides:
- Mouse-following 3D tilt effect
- Optional glare/shine effect
- GPU-accelerated transforms
- Accessibility support (respects reduced motion)
- 60fps performance optimization

**Props:**
- `children`: ReactNode - Content to render inside the card
- `className`: string - Additional CSS classes
- `tiltMaxAngle`: number - Maximum tilt angle in degrees (default: 15)
- `glareEnable`: boolean - Enable glare effect (default: true)
- `scale`: number - Hover scale factor (default: 1.05)

**Performance Features:**
- Uses `transform` and `opacity` only (GPU-accelerated)
- `will-change: transform` hint for browser optimization
- Smooth transitions with `ease-out` timing
- Respects `prefers-reduced-motion` media query

### 2. EnhancedProjectCard Component (`components/enhanced-project-card.tsx`)

Enhanced project card with:
- 3D tilt effects via TiltCard wrapper
- Staggered entrance animations using GSAP
- Neon glow animations on tech stack tags
- Enhanced depth shadows
- Smooth hover transitions

**Features:**
- Staggered fade-in animation based on card index
- Neon glow pulse on hover for tech tags
- Enhanced image zoom on hover
- Gradient overlays for depth


## Performance Optimizations

### GPU Acceleration
- All animations use `transform` and `opacity` properties only
- `will-change: transform` applied to animated elements
- `transform-style: preserve-3d` for 3D rendering context

### Frame Rate Optimization
- Debounced mouse move events
- Smooth transitions with `requestAnimationFrame`
- Optimized for 60fps performance
- Reduced complexity on mobile devices

### Accessibility
- Respects `prefers-reduced-motion` media query
- Disables tilt effects when reduced motion is enabled
- Maintains full functionality without 3D effects
- Keyboard navigation support

## CSS Enhancements

Added to `app/globals.css`:
- `.will-change-transform` - GPU acceleration hint
- `.preserve-3d` - 3D rendering context
- `.enhanced-shadow` - Depth shadows with smooth transitions
- `.neon-glow` - Pulsing neon effect for tech tags
- `.stagger-fade-in` - Entrance animation
- Mobile-specific optimizations

## Usage Examples

### Basic Usage
```tsx
import { EnhancedProjectCard } from '@/components/enhanced-project-card';

<EnhancedProjectCard 
  project={project} 
  showRoleBadge={true}
  index={0}
/>
```

### Custom Tilt Settings
```tsx
import { TiltCard } from '@/components/tilt-card';

<TiltCard 
  tiltMaxAngle={20}
  glareEnable={true}
  scale={1.1}
>
  <YourContent />
</TiltCard>
```

## Testing

Tests included for:
- TiltCard rendering and functionality
- EnhancedProjectCard rendering
- Accessibility features
- Tech stack tag rendering
- Neon glow class application

Run tests: `npm test -- components/tilt-card.test.tsx`

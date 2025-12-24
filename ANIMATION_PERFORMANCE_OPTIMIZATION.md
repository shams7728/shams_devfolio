# Animation Performance Optimization

This document describes the animation performance optimizations implemented in the portfolio application.

## Overview

The animation performance optimization system ensures smooth 60fps animations across all devices by:
- Using only GPU-accelerated properties (transform and opacity)
- Applying will-change hints strategically
- Implementing animation pooling to reuse GSAP timelines
- Debouncing scroll and resize events
- Monitoring performance metrics in development

## Requirements

**Requirement 10.5**: The Portfolio System SHALL maintain smooth 60fps performance during all card interactions.

## Implementation

### 1. GPU-Accelerated Animations

All animations use only `transform` and `opacity` properties, which are GPU-accelerated:

```typescript
// ✅ Good - GPU accelerated
gsap.to(element, {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotation: 45
});

// ❌ Bad - Not GPU accelerated
gsap.to(element, {
  width: '100px',
  height: '100px',
  backgroundColor: 'red'
});
```

### 2. Will-Change Hints

The `will-change` CSS property is applied before animations and removed after completion:

```typescript
import { applyWillChange } from '@/lib/utils/animation-performance';

// Apply will-change before animation
applyWillChange(element, ['transform', 'opacity'], 1000);

// Or manually
element.style.willChange = 'transform, opacity';
gsap.to(element, {
  x: 100,
  onComplete: () => {
    element.style.willChange = 'auto'; // Remove after animation
  }
});
```

**CSS Classes:**
- `.will-change-transform` - For transform animations
- `.will-change-opacity` - For opacity animations
- `.will-change-transform-opacity` - For both
- `.gpu-accelerated` - Forces GPU acceleration with translateZ(0)

### 3. Animation Pooling

GSAP timelines are pooled and reused to reduce memory allocation:

```typescript
import { animationPool } from '@/lib/utils/animation-performance';

// Get or create timeline
const timeline = animationPool.getTimeline('my-animation');

// Mark as active
animationPool.markActive('my-animation');

// Use timeline
timeline.to(element, { x: 100 });

// Mark as inactive when done
animationPool.markInactive('my-animation');

// Cleanup unused timelines
animationPool.cleanup();
```

**React Hook:**
```typescript
import { useAnimationPool } from '@/lib/hooks/use-animation-performance';

function MyComponent() {
  const timeline = useAnimationPool('my-component-animation');
  
  // Timeline is automatically marked active/inactive
  // and cleaned up on unmount
}
```

### 4. Debounced Scroll/Resize Events

Scroll and resize events are debounced using requestAnimationFrame:

```typescript
import { debounce, throttle } from '@/lib/utils/animation-performance';

// Debounce - waits for events to stop
const handleScroll = debounce((event) => {
  console.log('Scrolled!');
}, 150);

// Throttle - runs at most once per interval
const handleResize = throttle((event) => {
  console.log('Resized!');
}, 16); // ~60fps

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize);

// Cleanup
handleScroll.cancel();
handleResize.cancel();
```

**React Hooks:**
```typescript
import { 
  useDebouncedScroll, 
  useDebouncedResize,
  useDebouncedCallback,
  useThrottledCallback 
} from '@/lib/hooks/use-animation-performance';

function MyComponent() {
  // Debounced scroll handler
  useDebouncedScroll((event) => {
    console.log('Scrolled!');
  }, 150);

  // Debounced resize handler
  useDebouncedResize((event) => {
    console.log('Resized!');
  }, 150);

  // Debounced callback
  const debouncedSearch = useDebouncedCallback((query: string) => {
    performSearch(query);
  }, 300);

  // Throttled callback
  const throttledUpdate = useThrottledCallback(() => {
    updateUI();
  }, 16);
}
```

### 5. Performance Monitoring

Performance metrics are tracked in development mode:

```typescript
import { performanceMonitor } from '@/lib/utils/animation-performance';

// Start monitoring
performanceMonitor.start();

// Subscribe to updates
const unsubscribe = performanceMonitor.subscribe((metrics) => {
  console.log('FPS:', metrics.fps);
  console.log('Frame Time:', metrics.frameTime);
  console.log('Dropped Frames:', metrics.droppedFrames);
  console.log('Active Animations:', metrics.animationCount);
});

// Get current metrics
const metrics = performanceMonitor.getMetrics();

// Stop monitoring
performanceMonitor.stop();
unsubscribe();
```

**React Hook:**
```typescript
import { useAnimationPerformance } from '@/lib/hooks/use-animation-performance';

function PerformanceMonitor() {
  const metrics = useAnimationPerformance(true);
  
  return (
    <div>
      <p>FPS: {metrics.fps}</p>
      <p>Frame Time: {metrics.frameTime.toFixed(2)}ms</p>
      <p>Dropped Frames: {metrics.droppedFrames}</p>
    </div>
  );
}
```

## Optimized Components

The following components have been optimized:

### Impact Metrics (`components/impact-metrics.tsx`)
- Uses animation pooling for counter animations
- Applies will-change hints to metric cards
- GPU-accelerated transforms

### Role Rotator (`components/animations/role-rotator.tsx`)
- Will-change hints on text elements
- Force3D for GPU acceleration
- Automatic cleanup after animations

### Timeline (`components/timeline.tsx`)
- Will-change hints on milestone elements
- Optimized scroll-triggered animations
- GPU-accelerated transforms

### Workflow Visualization (`components/workflow-visualization.tsx`)
- Will-change hints on stage elements
- Optimized connector animations
- Sequential animation with proper cleanup

### Hero Section (`components/hero-section.tsx`)
- Will-change hints on all animated elements
- Staggered animations with GPU acceleration
- Proper cleanup after initial animations

## CSS Optimizations

### Keyframe Animations

All keyframe animations use only transform and opacity:

```css
/* ✅ Optimized */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ❌ Not optimized */
@keyframes slide-in {
  from {
    left: -100px; /* Triggers layout */
  }
  to {
    left: 0;
  }
}
```

### Will-Change Classes

```css
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

.will-change-transform-opacity {
  will-change: transform, opacity;
}

.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### Optimized Hover Effects

```css
.optimized-hover {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  will-change: transform;
}

.optimized-hover:hover {
  transform: translateY(-8px) scale(1.02);
}
```

## Best Practices

### 1. Always Use Transform/Opacity

```typescript
// ✅ Good
gsap.to(element, { x: 100, opacity: 0.5 });

// ❌ Bad
gsap.to(element, { left: '100px', backgroundColor: 'red' });
```

### 2. Apply Will-Change Before Animations

```typescript
// ✅ Good
element.style.willChange = 'transform';
gsap.to(element, {
  x: 100,
  onComplete: () => {
    element.style.willChange = 'auto';
  }
});

// ❌ Bad - will-change applied during animation
gsap.to(element, { x: 100 });
element.style.willChange = 'transform';
```

### 3. Use Animation Pooling

```typescript
// ✅ Good - reuses timeline
const timeline = animationPool.getTimeline('my-animation');
timeline.to(element, { x: 100 });

// ❌ Bad - creates new timeline every time
const timeline = gsap.timeline();
timeline.to(element, { x: 100 });
```

### 4. Debounce Scroll/Resize Events

```typescript
// ✅ Good
const handleScroll = debounce(() => {
  updateUI();
}, 150);

// ❌ Bad - runs on every scroll event
window.addEventListener('scroll', () => {
  updateUI();
});
```

### 5. Clean Up Animations

```typescript
// ✅ Good
useEffect(() => {
  const timeline = gsap.timeline();
  timeline.to(element, { x: 100 });
  
  return () => {
    timeline.kill(); // Cleanup
  };
}, []);

// ❌ Bad - no cleanup
useEffect(() => {
  gsap.to(element, { x: 100 });
}, []);
```

## Performance Targets

- **FPS**: Maintain 60fps during all animations
- **Frame Time**: Keep below 16.67ms per frame
- **Dropped Frames**: Minimize to less than 5% of total frames
- **Animation Count**: Monitor active animations, cleanup unused ones

## Monitoring in Development

Performance monitoring is automatically enabled in development mode. Check the console for warnings:

```
[Animation Performance] Initialized
Low FPS detected: 45fps. Consider reducing animation complexity or disabling some effects.
```

## Testing

Run animation performance tests:

```bash
npm test lib/utils/animation-performance.test.ts
```

## Browser Support

- Modern browsers with requestAnimationFrame support
- GPU acceleration requires WebGL support
- Graceful degradation for older browsers

## Related Files

- `lib/utils/animation-performance.ts` - Core utilities
- `lib/hooks/use-animation-performance.ts` - React hooks
- `components/animation-performance-init.tsx` - Initialization component
- `app/globals.css` - Optimized CSS animations
- `ANIMATION_PERFORMANCE_OPTIMIZATION.md` - This document

## References

- [CSS Triggers](https://csstriggers.com/) - Which CSS properties trigger layout/paint
- [GSAP Performance](https://greensock.com/docs/v3/GSAP/gsap.to()) - GSAP optimization tips
- [will-change MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) - CSS will-change property

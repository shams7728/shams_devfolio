# 3D Components

This directory contains Three.js-based 3D components for the portfolio.

## FloatingPortrait Component

A cinematic 3D floating portrait component with interactive lighting and parallax effects.

### Features

- **Three.js Scene**: Full 3D scene with camera and lighting setup
- **Texture Mapping**: Portrait image loaded as texture on 3D plane
- **Subtle Rotation**: Continuous gentle rotation animation
- **Reactive Lighting**: Point light that responds to cursor proximity
- **Parallax Motion**: Camera follows mouse movement for depth effect
- **WebGL Fallback**: Automatically falls back to 2D image if WebGL is not supported

### Usage

```tsx
import FloatingPortrait from '@/components/3d/floating-portrait';

function MyComponent() {
  return (
    <div className="w-full h-[500px]">
      <FloatingPortrait
        imageUrl="/path/to/portrait.jpg"
        enableParallax={true}
        lightingIntensity={1.5}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageUrl` | `string` | required | URL of the portrait image to display |
| `enableParallax` | `boolean` | `true` | Enable parallax motion following mouse |
| `lightingIntensity` | `number` | `1.0` | Intensity of the reactive point light |
| `className` | `string` | `''` | Additional CSS classes for the container |

### Requirements Satisfied

- **1.1**: 3D floating portrait using Three.js with subtle rotation and lighting
- **1.2**: Parallax motion following cursor position
- **1.4**: Reactive lighting that responds to cursor proximity

### Performance Considerations

- The component uses `requestAnimationFrame` for smooth 60fps animations
- WebGL detection ensures graceful degradation on unsupported devices
- Texture loading is handled with Suspense for better UX
- All animations use GPU-accelerated transforms
- **Level of Detail (LOD)**: Automatically reduces geometry complexity based on distance
- **Texture Optimization**: Textures are optimized with mipmaps and anisotropic filtering
- **Frustum Culling**: Objects outside camera view are not rendered
- **Lazy Loading**: 3D scene only initializes when visible in viewport
- **FPS Monitoring**: Real-time performance tracking with automatic quality adjustment
- **Adaptive Quality**: Automatically adjusts rendering quality based on performance

### Browser Support

- **Full Support**: Modern browsers with WebGL 1.0 or 2.0
- **Fallback**: 2D image display for browsers without WebGL
- **Tested**: Chrome, Firefox, Safari, Edge

### Testing

Visit `/test-3d` to see the component in action with different configurations.

### Troubleshooting

**Issue**: Component shows 2D fallback instead of 3D
- **Solution**: Check browser WebGL support using the WebGL detection utility

**Issue**: Performance is slow
- **Solution**: Reduce `lightingIntensity` or disable `enableParallax`

**Issue**: Image not loading
- **Solution**: Ensure the `imageUrl` is accessible and CORS-enabled

---

## TechEcosystem Component

A 3D circular visualization of technology stack with category-based grouping and interactive connections.

### Features

- **3D Circular Layout**: Technologies arranged in concentric circles by category
- **Node Positioning Algorithm**: Smart positioning for optimal visual distribution
- **Category Grouping**: Visual connections between related technologies
- **Interactive Hover**: Highlights related technologies and shows details
- **Smooth Camera Transitions**: Camera smoothly moves to focus on hovered technology
- **Performance Optimized**: Handles 50+ technology nodes at 60fps
- **WebGL Fallback**: Falls back to 2D grid layout if WebGL is not supported

### Usage

```tsx
import TechEcosystem, { Technology } from '@/components/3d/tech-ecosystem';

const technologies: Technology[] = [
  {
    id: '1',
    name: 'React',
    category: 'Frontend',
    relatedTech: ['2', '3'], // IDs of Next.js and TypeScript
  },
  {
    id: '2',
    name: 'Next.js',
    category: 'Frontend',
    relatedTech: ['1', '3'],
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'Language',
    relatedTech: ['1', '2'],
  },
  // ... more technologies
];

function MyComponent() {
  const handleTechHover = (tech: Technology | null) => {
    if (tech) {
      console.log('Hovering:', tech.name);
    }
  };

  return (
    <div className="w-full h-[600px]">
      <TechEcosystem
        technologies={technologies}
        onTechHover={handleTechHover}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `technologies` | `Technology[]` | required | Array of technology objects to visualize |
| `onTechHover` | `(tech: Technology \| null) => void` | optional | Callback when hovering over a technology |
| `className` | `string` | `''` | Additional CSS classes for the container |

### Technology Interface

```typescript
interface Technology {
  id: string;              // Unique identifier
  name: string;            // Display name
  category: string;        // Category for grouping
  relatedTech: string[];   // IDs of related technologies
}
```

### Requirements Satisfied

- **4.1**: 3D circular visualization of technologies using Three.js
- **4.2**: Category-based grouping with visual connections
- **4.3**: Hover effects showing related technologies and details
- **4.5**: Optimized for 50+ technology nodes without performance degradation

### Performance Considerations

- Uses instanced rendering for efficient node rendering
- Connection lines are only rendered when visible
- Smooth animations use lerp for GPU-accelerated transforms
- Memoization prevents unnecessary recalculations
- Optimized for 60fps with 50+ nodes

### Visual Design

- **Node Colors**: Each category gets a unique color
- **Connections**: Lines between related technologies (highlighted on hover)
- **Animations**: Gentle floating motion and rotation on hover
- **Camera**: Smooth transitions focusing on hovered technology
- **Labels**: Technology names displayed below each node

### Browser Support

- **Full Support**: Modern browsers with WebGL 1.0 or 2.0
- **Fallback**: 2D grid layout for browsers without WebGL
- **Tested**: Chrome, Firefox, Safari, Edge

### Troubleshooting

**Issue**: Performance drops with many technologies
- **Solution**: Reduce the number of connections or simplify the scene

**Issue**: Technologies overlap
- **Solution**: The algorithm automatically spaces them, but you can adjust the radius multiplier in the code

**Issue**: Related technologies not highlighting
- **Solution**: Ensure the `relatedTech` array contains valid technology IDs

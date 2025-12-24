# Accessibility System

## Overview

The accessibility system provides comprehensive support for users with different needs, including high contrast mode, text scaling, simplified animations, and keyboard navigation enhancements.

**Requirements:** 8.1, 8.2, 8.3, 8.4, 8.5

## Features

### 1. High Contrast Mode (WCAG AAA Compliance)

Provides maximum contrast between text and background for users with visual impairments.

- Black background with white text
- Yellow links, magenta visited links
- Cyan focus indicators
- 2px borders on all interactive elements

**Usage:**
```tsx
const { contrastMode, setContrastMode } = useAccessibility();

// Enable high contrast
setContrastMode(true);
```

### 2. Text Scaling System (1.0x - 2.0x)

Allows users to scale all text proportionally without breaking layouts.

- Range: 1.0x (100%) to 2.0x (200%)
- Scales all text elements proportionally
- Prevents overflow with word wrapping
- Maintains layout integrity

**Usage:**
```tsx
const { textScale, setTextScale } = useAccessibility();

// Set text scale to 150%
setTextScale(1.5);
```

### 3. Readability Mode (Simplified Animations)

Reduces visual complexity for users who find animations distracting.

- Shortens animation durations
- Removes parallax effects
- Disables 3D tilt effects
- Simplifies glassmorphism effects
- Removes decorative shadows and glows

**Usage:**
```tsx
const { readabilityMode, setReadabilityMode } = useAccessibility();

// Enable readability mode
setReadabilityMode(true);
```

### 4. Keyboard Navigation Focus Indicators

Provides clear visual feedback for keyboard navigation.

- 2px blue outline on focus
- 3px outline with shadow on focus-visible
- Enhanced focus for interactive elements
- Skip-to-main-content link

**Automatic:** Enabled by default for all users.

### 5. Reduced Motion Support

Respects system preference for reduced motion.

- Automatically detects `prefers-reduced-motion` media query
- Disables all animations when enabled
- Removes parallax and 3D effects
- Cannot be manually toggled (system preference only)

**Usage:**
```tsx
const { reducedMotion } = useAccessibility();

// Check if reduced motion is enabled
if (reducedMotion) {
  // Skip animations
}
```

## Implementation

### Context Provider

The `AccessibilityProvider` must wrap your application:

```tsx
import { AccessibilityProvider } from '@/lib/contexts/accessibility-context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
```

### Using the Hook

```tsx
import { useAccessibility } from '@/lib/contexts/accessibility-context';

function MyComponent() {
  const {
    contrastMode,
    textScale,
    readabilityMode,
    reducedMotion,
    setContrastMode,
    setTextScale,
    setReadabilityMode,
    resetSettings,
    mounted,
  } = useAccessibility();

  // Wait for mount to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div>
      {/* Your component */}
    </div>
  );
}
```

### UI Controls

Use the `AccessibilityControls` component to provide a user interface:

```tsx
import { AccessibilityControls } from '@/components/accessibility-controls';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <AccessibilityControls />
    </>
  );
}
```

## CSS Classes

The system applies the following CSS classes to `document.documentElement`:

- `.high-contrast` - High contrast mode enabled
- `.readability-mode` - Readability mode enabled
- `.reduce-motion` - Reduced motion enabled (system preference)
- `.keyboard-nav-enabled` - Keyboard navigation enhancements (always on)

## Persistence

Settings are automatically saved to `localStorage` under the key `accessibility-settings`:

```json
{
  "contrastMode": false,
  "textScale": 1.0,
  "readabilityMode": false
}
```

Note: `reducedMotion` is not persisted as it comes from system preferences.

## Preventing Flash of Unstyled Content

The system includes a script in the HTML head that applies settings before React hydration:

```html
<script>
  (function() {
    const a11ySettings = localStorage.getItem('accessibility-settings');
    if (a11ySettings) {
      const settings = JSON.parse(a11ySettings);
      // Apply settings to document.documentElement
    }
  })();
</script>
```

## Testing

Run the test suite:

```bash
npm test lib/contexts/accessibility-context.test.tsx
```

Tests cover:
- Default initialization
- Setting toggles
- Text scale clamping (1.0 - 2.0)
- localStorage persistence
- System preference detection
- Reset functionality

## Browser Compatibility

- Modern browsers with localStorage support
- CSS custom properties support
- `prefers-reduced-motion` media query support
- Graceful degradation for older browsers

## WCAG Compliance

The accessibility system helps achieve:

- **WCAG AAA** contrast ratios in high contrast mode
- **Keyboard navigation** support (WCAG 2.1.1)
- **Resize text** up to 200% (WCAG 1.4.4)
- **Animation control** (WCAG 2.3.3)

## Future Enhancements

Potential additions:
- Color blindness filters
- Screen reader announcements
- Focus trap management
- Keyboard shortcut customization

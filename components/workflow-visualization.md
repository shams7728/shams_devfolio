# Workflow Visualization Component

## Overview

The Workflow Visualization component displays a visual workflow diagram with sequential GSAP animations triggered on scroll. It's designed to showcase a professional methodology or process flow in an engaging, animated format.

## Requirements

- **5.1**: Display visual workflow diagram
- **5.2**: Show stages in sequential order with scroll-triggered animations
- **5.3**: Animate each stage sequentially with GSAP
- **5.4**: Support admin customization of workflow stages
- **5.5**: Support 4-8 customizable stages

## Features

- **Sequential Animation**: Stages animate one after another as the user scrolls
- **Smooth Transitions**: GSAP-powered animations with easing for professional feel
- **Responsive Design**: Works on all screen sizes
- **Customizable**: Stages can be managed through the admin dashboard
- **Visual Connectors**: Animated lines connect stages to show flow
- **Icon Support**: Each stage can have an emoji or icon

## Usage

### Basic Usage

```tsx
import WorkflowVisualization from '@/components/workflow-visualization';
import { WorkflowStagesModel } from '@/lib/models/workflow-stages';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const stages = await WorkflowStagesModel.getAll(supabase);

  return <WorkflowVisualization stages={stages} />;
}
```

### With Custom Styling

```tsx
<WorkflowVisualization 
  stages={stages} 
  className="my-8 px-4"
/>
```

## API Routes

### GET /api/workflow-stages
Fetch all workflow stages ordered by display_order

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Understand",
    "description": "Gather requirements and understand the problem space",
    "icon": "🔍",
    "display_order": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /api/workflow-stages
Create a new workflow stage (requires authentication)

**Request Body:**
```json
{
  "title": "Design",
  "description": "Create architecture and design solutions",
  "icon": "🎨"
}
```

### PUT /api/workflow-stages/[id]
Update a workflow stage (requires authentication)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### DELETE /api/workflow-stages/[id]
Delete a workflow stage (requires authentication)

### POST /api/workflow-stages/reorder
Reorder workflow stages (requires authentication)

**Request Body:**
```json
{
  "items": [
    { "id": "uuid-1", "display_order": 0 },
    { "id": "uuid-2", "display_order": 1 }
  ]
}
```

## Model Usage

### Fetch All Stages

```typescript
import { WorkflowStagesModel } from '@/lib/models/workflow-stages';
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const stages = await WorkflowStagesModel.getAll(supabase);
```

### Create a Stage

```typescript
const newStage = await WorkflowStagesModel.create(supabase, {
  title: 'Test',
  description: 'Validate functionality and ensure quality',
  icon: '✅',
});
```

### Update a Stage

```typescript
const updatedStage = await WorkflowStagesModel.update(supabase, stageId, {
  title: 'Updated Title',
});
```

### Delete a Stage

```typescript
await WorkflowStagesModel.delete(supabase, stageId);
```

### Reorder Stages

```typescript
await WorkflowStagesModel.reorder(supabase, {
  items: [
    { id: 'uuid-1', display_order: 0 },
    { id: 'uuid-2', display_order: 1 },
  ],
});
```

## Animation Details

The component uses GSAP with ScrollTrigger to create smooth, sequential animations:

1. **Initial State**: Stages start with `opacity: 0` and `y: 50` (below their final position)
2. **Scroll Trigger**: Animation triggers when stage enters 80% of viewport
3. **Sequential Delay**: Each stage has a 0.15s stagger delay
4. **Connector Animation**: Lines between stages animate after the stage appears
5. **Reverse on Scroll Up**: Animations reverse when scrolling back up

## Styling

The component uses Tailwind CSS classes and supports both light and dark modes:

- **Light Mode**: White cards with gray text
- **Dark Mode**: Dark gray cards with white text
- **Gradient Accents**: Blue to purple gradients for icons and connectors
- **Hover Effects**: Cards have shadow transitions on hover

## Database Schema

```sql
CREATE TABLE workflow_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Default Stages

The migration includes 6 default workflow stages:

1. **Understand** 🔍 - Gather requirements and understand the problem space
2. **Analyze** 📊 - Analyze data and identify patterns and insights
3. **Design** 🎨 - Create architecture and design solutions
4. **Build** 🔨 - Implement the solution with best practices
5. **Test** ✅ - Validate functionality and ensure quality
6. **Deploy** 🚀 - Release to production and monitor performance

## Performance

- **Lazy Loading**: GSAP plugins only load on client side
- **Context Cleanup**: GSAP context is properly cleaned up on unmount
- **Optimized Animations**: Uses GPU-accelerated properties (opacity, transform)
- **Scroll Optimization**: ScrollTrigger efficiently manages scroll events

## Browser Support

- Modern browsers with ES6+ support
- Requires JavaScript enabled for animations
- Gracefully degrades without JavaScript (static display)

## Future Enhancements

- Add custom animation types per stage
- Support for branching workflows
- Interactive stage details on click
- Progress indicator showing current stage
- Export workflow as image/PDF

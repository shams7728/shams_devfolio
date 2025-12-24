# MediaManager Component

A reusable, feature-rich media upload component with drag-and-drop support, progress indicators, and image previews.

## Features

- ✅ Drag-and-drop file upload
- ✅ Click to browse file selection
- ✅ Real-time upload progress indicators
- ✅ Image previews with delete functionality
- ✅ File validation (type, size)
- ✅ Support for single or multiple file uploads
- ✅ Two display modes: grid (gallery) and single (cover image)
- ✅ Storage usage statistics (placeholder for future implementation)
- ✅ Responsive design with dark mode support
- ✅ Integration with Supabase Storage via API routes

## Requirements

Implements requirements: 5.2, 11.1, 11.5

## Usage

### Basic Example (Single Image)

```tsx
import { MediaManager } from '@/components/media-manager';

function MyForm() {
  const [coverImage, setCoverImage] = useState('');

  return (
    <MediaManager
      value={coverImage ? [coverImage] : []}
      onChange={(urls) => setCoverImage(urls[0] || '')}
      maxFiles={1}
      multiple={false}
      roleId="role-123"
      projectId="project-456"
      bucket="project-images"
      label="Cover Image"
      required
      mode="single"
    />
  );
}
```

### Gallery Example (Multiple Images)

```tsx
import { MediaManager } from '@/components/media-manager';

function MyForm() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  return (
    <MediaManager
      value={galleryImages}
      onChange={setGalleryImages}
      maxFiles={10}
      multiple={true}
      roleId="role-123"
      projectId="project-456"
      bucket="project-images"
      label="Gallery Images"
      mode="grid"
    />
  );
}
```

### Role Icon Example

```tsx
import { MediaManager } from '@/components/media-manager';

function RoleForm() {
  const [iconUrl, setIconUrl] = useState('');

  return (
    <MediaManager
      value={iconUrl ? [iconUrl] : []}
      onChange={(urls) => setIconUrl(urls[0] || '')}
      maxFiles={1}
      multiple={false}
      roleId="role-123"
      bucket="role-icons"
      label="Role Icon"
      mode="single"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string[]` | `[]` | Array of current uploaded image URLs |
| `onChange` | `(urls: string[]) => void` | - | Callback when images are uploaded or removed |
| `maxFiles` | `number` | `10` | Maximum number of files allowed |
| `multiple` | `boolean` | `true` | Whether to allow multiple file selection |
| `roleId` | `string` | - | Role ID for organizing uploads (required for upload) |
| `projectId` | `string` | - | Project ID for organizing uploads (optional) |
| `bucket` | `'project-images' \| 'role-icons'` | `'project-images'` | Storage bucket type |
| `label` | `string` | `'Upload Images'` | Label for the upload area |
| `required` | `boolean` | `false` | Whether the field is required |
| `error` | `string` | - | Error message to display |
| `mode` | `'grid' \| 'single'` | `'grid'` | Display mode for previews |

## File Validation

The component automatically validates files based on the bucket type:

### Project Images (`project-images`)
- **Allowed types**: JPEG, PNG, WebP
- **Max size**: 5MB per file

### Role Icons (`role-icons`)
- **Allowed types**: JPEG, PNG, WebP, SVG
- **Max size**: 2MB per file

## Upload Flow

1. User selects or drops files
2. Component validates file types and sizes
3. Files are uploaded to `/api/upload` endpoint
4. Progress indicators show upload status
5. On success, URLs are returned and previews are displayed
6. Parent component receives updated URLs via `onChange`

## Storage Organization

Files are organized in Supabase Storage with the following structure:

```
project-images/
  └── roles/
      └── {roleId}/
          └── projects/
              └── {projectId}/
                  └── {filename}

role-icons/
  └── roles/
      └── {roleId}/
          └── {filename}
```

## Features in Detail

### Drag and Drop
- Visual feedback when dragging files over the upload area
- Supports dropping multiple files at once
- Prevents upload if max file limit is reached

### Progress Indicators
- Shows individual progress for each file being uploaded
- Displays success/error status with icons
- Auto-dismisses completed uploads after 2 seconds
- Auto-dismisses errors after 5 seconds

### Image Previews
- Grid layout for galleries (responsive: 2-4 columns)
- Single large preview for cover images
- Hover effects reveal delete button
- Uses Next.js Image component for optimization

### Error Handling
- Validates role selection before upload
- Shows user-friendly error messages
- Handles network errors gracefully
- Displays validation errors inline

## Accessibility

- Keyboard accessible (click to browse)
- Screen reader friendly labels
- Clear visual feedback for all states
- Error messages are properly associated with inputs

## Styling

The component uses Tailwind CSS with support for:
- Light and dark modes
- Responsive breakpoints
- Smooth transitions and animations
- Glassmorphism effects

## Future Enhancements

- Storage usage statistics (currently placeholder)
- Image cropping/editing before upload
- Bulk delete functionality
- Reordering images via drag-and-drop
- Image compression options
- Video upload support

# Error Handling and Notifications System

This document describes the comprehensive error handling and notification system implemented in the application.

## Overview

The system provides:
- **Toast Notifications**: User-friendly notifications for success, error, warning, and info messages
- **Error Boundaries**: React error boundaries to catch and display component errors gracefully
- **Standardized API Error Handling**: Consistent error responses across all API routes
- **Custom Error Classes**: Type-safe error handling with specific error types
- **Development Logging**: Detailed error logging in development mode

## Components

### 1. Toast Notification System

**Location**: `lib/contexts/toast-context.tsx`, `components/toast-container.tsx`

**Usage**:
```typescript
import { useToast } from '@/lib/contexts/toast-context';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong');
  };

  const handleWarning = () => {
    toast.warning('Please review your input');
  };

  const handleInfo = () => {
    toast.info('New feature available');
  };

  return (
    <button onClick={handleSuccess}>Show Toast</button>
  );
}
```

**Features**:
- Auto-dismiss after 5 seconds (configurable)
- Manual dismiss with close button
- Animated entrance and exit
- Stacked notifications
- Four types: success, error, warning, info

### 2. Error Boundary

**Location**: `components/error-boundary.tsx`

**Usage**:
```typescript
import { ErrorBoundary } from '@/components/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}

// With custom fallback
<ErrorBoundary 
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error('Error caught:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

**Features**:
- Catches React component errors
- Displays user-friendly error UI
- Shows error details in development mode
- Provides refresh button
- Optional custom fallback UI
- Optional error callback for logging

### 3. Custom Error Classes

**Location**: `lib/utils/error-handler.ts`

**Available Error Classes**:

```typescript
// Base application error
throw new AppError('Something went wrong', 500, 'ERROR_CODE');

// Validation error (400)
throw new ValidationError('Invalid email format', 'email');

// Authentication error (401)
throw new AuthenticationError('Please log in');

// Authorization error (403)
throw new AuthorizationError('Admin access required');

// Not found error (404)
throw new NotFoundError('User');
```

### 4. API Error Handling

**Location**: `lib/utils/error-handler.ts`

**Usage in API Routes**:
```typescript
import { handleApiError, logError, ValidationError } from '@/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      throw new ValidationError('Email is required', 'email');
    }

    // Your logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('POST /api/example', error);
    return handleApiError(error);
  }
}
```

**Features**:
- Automatic error type detection
- Appropriate HTTP status codes
- User-friendly error messages
- Supabase error mapping
- Development logging

### 5. Error Logging

**Development Mode**:
- Errors are logged to console with context
- Full stack traces available
- Error details shown in UI

**Production Mode**:
- User-friendly messages only
- No sensitive information exposed
- Ready for integration with error tracking services (Sentry, LogRocket, etc.)

## Error Response Format

All API errors return a consistent format:

```json
{
  "error": "User-friendly error message",
  "code": "ERROR_CODE"
}
```

For validation errors with details:
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `AUTHENTICATION_ERROR` | 401 | User not authenticated |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND_ERROR` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Supabase Error Mapping

The system automatically maps common Supabase/PostgreSQL error codes:

| Postgres Code | Mapped Message | Status |
|---------------|----------------|--------|
| `23505` | A record with this value already exists | 409 |
| `23503` | Referenced record does not exist | 400 |
| `23502` | Required field is missing | 400 |
| `42501` | Insufficient permissions | 403 |
| `PGRST116` | Record not found | 404 |

## Best Practices

### Client-Side

1. **Use Toast for User Feedback**:
   ```typescript
   try {
     await saveData();
     toast.success('Data saved successfully');
   } catch (error) {
     toast.error(error instanceof Error ? error.message : 'Failed to save');
   }
   ```

2. **Wrap Risky Components in Error Boundaries**:
   ```typescript
   <ErrorBoundary>
     <ComplexComponent />
   </ErrorBoundary>
   ```

3. **Handle Async Errors**:
   ```typescript
   const handleSubmit = async () => {
     try {
       const response = await fetch('/api/endpoint');
       if (!response.ok) {
         const error = await response.json();
         throw new Error(error.error);
       }
       toast.success('Success!');
     } catch (error) {
       toast.error(error instanceof Error ? error.message : 'Failed');
     }
   };
   ```

### Server-Side

1. **Use Custom Error Classes**:
   ```typescript
   if (!user) {
     throw new AuthenticationError();
   }
   
   if (!isValid(data)) {
     throw new ValidationError('Invalid data format');
   }
   ```

2. **Always Use handleApiError**:
   ```typescript
   try {
     // Your logic
   } catch (error) {
     logError('Context', error);
     return handleApiError(error);
   }
   ```

3. **Log Errors with Context**:
   ```typescript
   logError('POST /api/users', error);
   ```

## Integration with Error Tracking Services

To integrate with services like Sentry:

```typescript
// In error-boundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: errorInfo });
  }
  
  if (this.props.onError) {
    this.props.onError(error, errorInfo);
  }
}

// In error-handler.ts
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  } else {
    // Sentry.captureException(error, { tags: { context } });
  }
}
```

## Testing Error Handling

```typescript
// Test toast notifications
const { toast } = useToast();
toast.error('Test error message');

// Test error boundary
function BrokenComponent() {
  throw new Error('Test error');
}

<ErrorBoundary>
  <BrokenComponent />
</ErrorBoundary>

// Test API error handling
const response = await fetch('/api/test', {
  method: 'POST',
  body: JSON.stringify({ invalid: 'data' })
});
const error = await response.json();
console.log(error.error, error.code);
```

## Requirements Satisfied

This implementation satisfies all requirements from task 19:
- ✅ Toast notification system created
- ✅ Error boundaries implemented for React components
- ✅ Try-catch blocks added to all API routes
- ✅ User-friendly error messages displayed
- ✅ Errors logged to console in development mode

# KYC Document Upload Flow Implementation

This document describes the merchant KYC (Know Your Customer) document upload flow implementation for the Stargate Frontend.

## Overview

The KYC document upload flow is a multi-step wizard that guides merchants through:

1. **Document Type Selection** - Choose the type of document to upload (Passport, Driver's License, National ID, Business License)
2. **File Upload** - Upload a clear image or PDF of the selected document
3. **Review & Confirmation** - Review uploaded documents and submit for verification

## Components

### KYCWizard (`components/kyc/KYCWizard.tsx`)

The main multi-step wizard component that manages the entire KYC submission process.

**Props:**
- `submission?: KYCSubmission` - Optional existing submission for resuming or resubmitting

**Features:**
- Multi-step progress indicator
- Document type selection with descriptions
- File upload with validation (image/PDF, max 10MB)
- Document review with removal capability
- Error handling and user feedback
- Success confirmation

**Usage:**
```tsx
import { KYCWizard } from '@/components/kyc';

export default function MyComponent() {
  return <KYCWizard />;
}
```

### KYCStatusDisplay (`components/kyc/KYCStatusDisplay.tsx`)

Displays the current status of a KYC submission with appropriate icons and messaging.

**Props:**
- `submission?: KYCSubmission` - The KYC submission to display

**Statuses:**
- `approved` - Verification complete (green checkmark)
- `rejected` - Submission rejected with reason (red X)
- `pending_review` - Documents under review (clock icon)
- `submitted` - Documents submitted (alert icon)
- `draft` - KYC in progress (default)

**Usage:**
```tsx
import { KYCStatusDisplay } from '@/components/kyc';

export default function Dashboard() {
  const [submission] = useState<KYCSubmission>(/* ... */);
  return <KYCStatusDisplay submission={submission} />;
}
```

## Hooks

### useKYC (`hooks/useKYC.ts`)

React hook for managing KYC state and operations.

**Returns:**
```typescript
{
  submission: KYCSubmission | null;
  loading: boolean;
  error: string | null;
  refreshSubmission: () => Promise<void>;
  isApproved: boolean;
  isRejected: boolean;
  isPending: boolean;
}
```

**Usage:**
```tsx
import { useKYC } from '@/hooks/useKYC';

export default function Page() {
  const { submission, isApproved, loading } = useKYC();
  
  if (loading) return <div>Loading...</div>;
  if (isApproved) return <div>Verified!</div>;
  
  return <div>Status: {submission?.status}</div>;
}
```

## API Endpoints

All KYC operations are available through `api.kyc`:

### Get Current Submission

```typescript
const submission = await api.kyc.getSubmission();
```

Returns the merchant's current KYC submission or throws an error if none exists.

**Response Type:** `KYCSubmission`

### Upload Document

```typescript
const result = await api.kyc.uploadDocument(documentType, file);
// Returns: { id: string; file_name: string }
```

**Parameters:**
- `documentType: KYCDocumentType` - Type of document ('passport', 'drivers_license', 'national_id', 'business_license')
- `file: File` - The file to upload

**Validation:**
- File type must be image/* or PDF
- File size must be less than 10MB

### Remove Document

```typescript
await api.kyc.removeDocument(documentId);
```

Removes a previously uploaded document.

### Submit KYC

```typescript
await api.kyc.submitKYC(documentIds);
```

**Parameters:**
- `documentIds: string[]` - Array of document IDs to submit (must have at least 1)

Submits the KYC for verification. This transitions the submission from 'draft' to 'submitted'.

## Types

### KYCDocumentType

```typescript
type KYCDocumentType = 'passport' | 'drivers_license' | 'national_id' | 'business_license';
```

### KYCSubmissionStatus

```typescript
type KYCSubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending_review';
```

### KYCDocument

```typescript
interface KYCDocument {
  id: string;
  document_type: KYCDocumentType;
  file_name: string;
  file_size: number;
  file_url?: string;
  uploaded_at: string;
}
```

### KYCSubmission

```typescript
interface KYCSubmission {
  id: string;
  merchant_id: string;
  status: KYCSubmissionStatus;
  documents: KYCDocument[];
  submitted_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}
```

## Routes

- `/dashboard/kyc` - Main KYC verification page

## Features

### Multi-Step Workflow

1. **Type Selection** - User selects document type with descriptions
2. **Upload** - User uploads file with drag-and-drop support
3. **Review** - User reviews documents before submission
4. **Success** - Confirmation of successful submission

### Validation

- **File Type**: Only images (PNG, JPG, GIF) and PDFs are accepted
- **File Size**: Maximum 10MB per file
- **Required Documents**: At least one document must be uploaded before submission
- **Error Handling**: Clear error messages for validation failures

### User Experience

- Progress indicator showing current step
- Back buttons to navigate between steps
- Clear descriptions for each document type
- File preview with size information
- Remove button for each uploaded document
- Privacy & security information
- Disabled buttons during upload/submission

### State Management

- Supports resuming incomplete submissions
- Preserves uploaded documents between steps
- Maintains submission history
- Handles API errors gracefully

## Integration with Dashboard

The KYC verification is integrated into the dashboard navigation:

```typescript
{ href: '/dashboard/kyc', label: 'KYC Verification', icon: FileCheck }
```

## Backend Requirements

The following API endpoints must be implemented on the backend:

### GET /kyc/submission

Get the merchant's current KYC submission.

**Response:**
```json
{
  "id": "kyc_123",
  "merchant_id": "merchant_456",
  "status": "draft",
  "documents": [],
  "created_at": "2024-05-27T10:00:00Z",
  "updated_at": "2024-05-27T10:00:00Z"
}
```

### POST /kyc/documents

Upload a document (multipart/form-data).

**Form Fields:**
- `document_type` - Type of document
- `file` - File to upload

**Response:**
```json
{
  "id": "doc_123",
  "file_name": "passport.pdf"
}
```

### DELETE /kyc/documents/:id

Remove a previously uploaded document.

### POST /kyc/submit

Submit KYC for verification.

**Body:**
```json
{
  "document_ids": ["doc_123", "doc_456"]
}
```

## Future Enhancements

- [ ] Drag-and-drop file upload support
- [ ] Document preview/rotation before upload
- [ ] Batch document upload
- [ ] Document expiration reminders
- [ ] OCR-based document validation
- [ ] Liveness check for selfie verification
- [ ] Multi-language document support
- [ ] Email notifications for status updates
- [ ] Document reordering capability
- [ ] Webhook support for status changes

## Testing

### Unit Tests

Test individual components in isolation:

```typescript
// Test KYCWizard navigation
// Test KYCStatusDisplay status rendering
// Test file validation
// Test error handling
```

### Integration Tests

Test the full flow:

```typescript
// Test complete KYC submission flow
// Test document upload with validation
// Test submission with multiple documents
// Test rejection and resubmission
```

### E2E Tests

Test user workflows:

```typescript
// User uploads single document
// User uploads multiple documents
// User reviews and submits
// User sees success confirmation
```

## Security Considerations

- Documents are uploaded via multipart/form-data
- File type validation on client and server
- File size limits to prevent abuse
- Authentication required for all KYC endpoints
- Secure storage of uploaded documents
- Encryption in transit and at rest
- Regular security audits recommended

## Accessibility

The KYC wizard includes:

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Clear error messages
- Color-independent status indicators

## Performance

- Efficient file upload with client-side validation
- Progress indicators for long uploads
- Lazy loading of status information
- Memoization of component state
- Optimized re-renders

## Troubleshooting

### File Upload Fails

1. Check file size (must be < 10MB)
2. Verify file type (must be image or PDF)
3. Check network connectivity
4. Review browser console for detailed errors

### Submission Error

1. Ensure at least one document is uploaded
2. Verify API endpoint is accessible
3. Check authentication status
4. Review error message from backend

### Status Not Updating

1. Refresh the page
2. Click the refresh button (if available)
3. Clear browser cache
4. Check network connectivity

## Support

For issues or questions regarding the KYC implementation, please contact the development team or consult the main project README.

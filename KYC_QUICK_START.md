# KYC Quick Start Guide

Get the KYC verification system up and running in minutes.

## Prerequisites

- Node.js 16+
- Next.js 14+
- Existing Stargate Frontend installation

## Installation

No additional packages required! KYC uses existing dependencies:
- `react-hook-form`
- `zod`
- `lucide-react`
- `tailwindcss`

## 1. Add KYC to Your Dashboard (5 minutes)

### Step 1: Import the banner component

```tsx
// app/dashboard/page.tsx
'use client';

import { KYCPromptBanner } from '@/components/kyc';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      
      {/* Add this line */}
      <KYCPromptBanner />
      
      {/* Rest of your dashboard */}
    </div>
  );
}
```

### Step 2: Done!

The banner will automatically appear for merchants who haven't completed KYC.

## 2. Implement Backend Endpoints (30 minutes)

Your backend needs to implement these endpoints:

### GET /kyc/submission

Return merchant's current KYC submission.

```typescript
// Response
{
  "id": "kyc_abc123",
  "merchant_id": "merchant_xyz789",
  "status": "draft",  // or: submitted, approved, rejected, pending_review
  "documents": [
    {
      "id": "doc_123",
      "document_type": "passport",
      "file_name": "john_doe_passport.pdf",
      "file_size": 245000,
      "uploaded_at": "2024-05-27T10:30:00Z"
    }
  ],
  "created_at": "2024-05-27T09:00:00Z",
  "updated_at": "2024-05-27T10:30:00Z",
  "submitted_at": null,
  "reviewed_at": null,
  "rejection_reason": null
}
```

### POST /kyc/documents

Upload a document (multipart/form-data).

**Form Fields:**
- `document_type` - Type of document
- `file` - File to upload

```typescript
// Response
{
  "id": "doc_456",
  "file_name": "john_doe_drivers_license.pdf"
}
```

### DELETE /kyc/documents/:id

Remove a document.

### POST /kyc/submit

Submit KYC for verification.

```typescript
// Request
{
  "document_ids": ["doc_123", "doc_456"]
}

// Response
{
  "id": "kyc_abc123",
  "status": "submitted",
  "submitted_at": "2024-05-27T10:35:00Z"
}
```

## 3. Test the Implementation

### Using the Frontend

1. Navigate to `http://localhost:3000/dashboard/kyc`
2. Click "Select Document Type"
3. Choose a document type (e.g., Passport)
4. Upload a test file
5. Review and submit

### Using cURL

```bash
# Get submission
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/kyc/submission

# Upload document
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document_type=passport" \
  -F "file=@/path/to/passport.pdf" \
  http://localhost:3001/kyc/documents

# Submit KYC
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"document_ids": ["doc_123"]}' \
  http://localhost:3001/kyc/submit
```

## 4. Customize (Optional)

### Change Document Types

Edit `components/kyc/KYCWizard.tsx`:

```typescript
const DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport', description: 'Valid international passport' },
  // Add more types
];
```

### Modify Status Display

Edit `components/kyc/KYCStatusDisplay.tsx`:

```typescript
const getStatusConfig = (status) => {
  // Customize colors, icons, messages
};
```

### Update Styles

Use Tailwind classes in component files:

```tsx
className="p-4 bg-violet text-white rounded-lg"
```

Available colors in Stargate:
- `violet` - Primary
- `mint` - Success
- `ocean` - Hover
- `slate` - Neutral
- `red` - Error
- `blue` - Info
- `orange` - Warning

## 5. Common Tasks

### Check KYC Status Programmatically

```typescript
import { useKYC } from '@/hooks/useKYC';

function MyComponent() {
  const { isApproved, isPending, isRejected } = useKYC();
  
  if (isApproved) return <div>Verified!</div>;
  if (isPending) return <div>Under review...</div>;
  if (isRejected) return <div>Please resubmit</div>;
  
  return <div>Incomplete</div>;
}
```

### Restrict Features by KYC Status

```typescript
import { useKYC } from '@/hooks/useKYC';

function HighValueFeature() {
  const { isApproved } = useKYC();
  
  if (!isApproved) {
    return (
      <div>
        <p>Complete KYC verification to access this feature</p>
        <Link href="/dashboard/kyc">Complete KYC</Link>
      </div>
    );
  }
  
  return <div>Feature content</div>;
}
```

### Upload Document Programmatically

```typescript
import { api } from '@/lib/api';

async function uploadUserDocument() {
  const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
  
  try {
    const result = await api.kyc.uploadDocument('passport', file);
    console.log('Uploaded:', result.file_name);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Validate Files Before Upload

```typescript
import { validateKYCFile, formatFileSize } from '@/lib/kyc-utils';

const file = event.target.files[0];
const validation = validateKYCFile(file);

if (!validation.valid) {
  console.error(validation.error);
} else {
  console.log(`File is valid: ${formatFileSize(file.size)}`);
}
```

## 6. Deployment

### Environment Variables

Ensure `NEXT_PUBLIC_API_URL` is set correctly:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Build

```bash
npm run build
npm run start
```

### Testing

```bash
npm run test
npm run typecheck
```

## 7. Troubleshooting

### File Upload Returns 400

- Check Content-Type headers
- Verify file size < 10MB
- Ensure file extension is correct

### KYC Page Shows Loading Forever

- Check browser console for errors
- Verify API endpoint is accessible
- Check authentication token

### Status Not Updating

- Manually call `refreshSubmission()` from useKYC hook
- Clear browser cache
- Verify backend API implementation

### Button Variants Not Working

- Ensure Button component is updated to v2
- Check Tailwind CSS is configured correctly
- Verify className is being applied

## 8. Next Steps

1. ✅ Implement backend endpoints
2. ✅ Test with sample files
3. ✅ Add database models
4. ✅ Implement document storage
5. ✅ Create verification workflow
6. ✅ Setup email notifications
7. ✅ Create admin dashboard for review
8. ✅ Deploy to production

## Need Help?

- 📖 Read [KYC_IMPLEMENTATION.md](./KYC_IMPLEMENTATION.md) for full documentation
- 💡 See [EXAMPLES.md](./components/kyc/EXAMPLES.md) for code samples
- 🧪 Check [TESTING.md](./components/kyc/TESTING.md) for test examples
- 🐛 Debug using browser DevTools Network tab

## Support

For issues, questions, or suggestions:

1. Check the FAQ below
2. Review component documentation
3. Contact the development team

## FAQ

**Q: Can users upload multiple documents at once?**  
A: Yes! Users can upload multiple documents in the same submission. Use the wizard multiple times or batch uploads.

**Q: What's the maximum file size?**  
A: 10MB per file. This is configurable in `validateKYCFile()`.

**Q: Can users edit submitted documents?**  
A: No, but they can resubmit if rejected. The wizard handles this automatically.

**Q: How do I change the required documents?**  
A: Edit `DOCUMENT_TYPES` in `KYCWizard.tsx` and backend validation.

**Q: Is KYC required for all users?**  
A: It's optional by default. Make it required by checking KYC status in middleware.

**Q: How long does verification take?**  
A: Depends on backend implementation. Can be instant, manual, or automated.

**Q: Can I customize the UI?**  
A: Yes! All components use Tailwind and are fully customizable.

**Q: What about GDPR compliance?**  
A: Implement data deletion and retention policies in your backend.

**Q: How do I track KYC metrics?**  
A: Add logging to API calls and create analytics dashboards.

---

**Last Updated**: May 27, 2024  
**Version**: 1.0.0

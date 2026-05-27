# KYC Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Stargate Frontend                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Dashboard Pages (Next.js)                │  │
│  │                                                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │  │
│  │  │ Dashboard   │  │ Settings    │  │ KYC Page   │  │  │
│  │  │ (+ Banner)  │  │ (Integration)│ │(Main UI)   │  │  │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │  │
│  │         ↓                ↓                ↓          │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                    ↓              ↓              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        React Components & Custom Hooks              │  │
│  │                                                      │  │
│  │  ┌───────────────────┐  ┌──────────────────────┐   │  │
│  │  │ KYCWizard         │  │ useKYC Hook          │   │  │
│  │  │ - Type Selection  │  │ - State Management   │   │  │
│  │  │ - File Upload     │  │ - Status Flags       │   │  │
│  │  │ - Review          │  │ - Refresh Method     │   │  │
│  │  │ - Submit          │  │                      │   │  │
│  │  └───────────────────┘  └──────────────────────┘   │  │
│  │                                                      │  │
│  │  ┌───────────────────┐  ┌──────────────────────┐   │  │
│  │  │ KYCStatusDisplay  │  │ KYCPromptBanner      │   │  │
│  │  │ - Show Status     │  │ - Dashboard Alert    │   │  │
│  │  │ - Color Coding    │  │ - Quick Link         │   │  │
│  │  │ - Messages        │  │                      │   │  │
│  │  └───────────────────┘  └──────────────────────┘   │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓              ↓              ↓                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            API Layer (lib/api.ts)                    │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────┐    │  │
│  │  │ api.kyc.getSubmission()                    │    │  │
│  │  │ api.kyc.uploadDocument(type, file)         │    │  │
│  │  │ api.kyc.removeDocument(id)                 │    │  │
│  │  │ api.kyc.submitKYC(documentIds)             │    │  │
│  │  └────────────────────────────────────────────┘    │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓              ↓              ↓                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            HTTP Requests (Fetch API)                │  │
│  │                                                      │  │
│  │  GET /kyc/submission                                │  │
│  │  POST /kyc/documents (multipart/form-data)          │  │
│  │  DELETE /kyc/documents/:id                          │  │
│  │  POST /kyc/submit                                   │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓              ↓              ↓                     │
└─────────────────────────────────────────────────────────────┘
         ↓              ↓              ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend API Server                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            KYC Controllers                          │  │
│  │                                                      │  │
│  │  - GET /kyc/submission                              │  │
│  │  - POST /kyc/documents                              │  │
│  │  - DELETE /kyc/documents/:id                        │  │
│  │  - POST /kyc/submit                                 │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓              ↓              ↓                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Business Logic & Validation                   │  │
│  │                                                      │  │
│  │  - Document validation                              │  │
│  │  - Status transitions                               │  │
│  │  - Document storage                                 │  │
│  │  - Verification workflow                            │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓              ↓              ↓                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database                               │  │
│  │                                                      │  │
│  │  - kyc_submissions table                            │  │
│  │  - kyc_documents table                              │  │
│  │  - File storage (S3, local, etc.)                   │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Journey                             │
└─────────────────────────────────────────────────────────────┘

Start
  ↓
┌─────────────────────────┐
│  Visit Dashboard        │
└─────────────────────────┘
  ↓
┌─────────────────────────┐      ┌──────────────────────────┐
│  See KYC Banner?        │ No → │ Proceed Normally         │
│  (If KYC Incomplete)    │      │                          │
└─────────────────────────┘      └──────────────────────────┘
  ↓ Yes
┌─────────────────────────┐
│  Click "Get Started"    │
│  or Navigate to /kyc    │
└─────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Step 1: Select Document Type   │
│                                 │
│  • Passport                     │
│  • Driver's License             │
│  • National ID                  │
│  • Business License             │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Step 2: Upload Document        │
│                                 │
│  • Choose file                  │
│  • Validate (size, type)        │
│  • Upload to server             │
│  • Confirm upload               │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐    ┌──────────────────────┐
│  Upload Another Document?       │ No │ Continue to Review   │
│  (Optional)                     │ → │                      │
└─────────────────────────────────┘    └──────────────────────┘
  ↓ Yes
  └─ Return to Step 1 ──┐
                        │
                        ↓
┌─────────────────────────────────┐
│  Step 3: Review & Confirm       │
│                                 │
│  • View all uploaded documents  │
│  • Remove if needed             │
│  • Review privacy notice        │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Submit for Verification        │
│                                 │
│  • Send to backend              │
│  • Update status to "submitted" │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Success Screen                 │
│                                 │
│  "KYC Submitted Successfully"   │
│  "We'll notify you when done"   │
└─────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────┐
│  Backend Review Process (Not shown to user)  │
│                                              │
│  Status: pending_review                     │
│  → Manual or Automated Review               │
│  → approved / rejected                      │
└──────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────┐
│  User Sees Updated Status on Dashboard          │
│                                                 │
│  ✓ Approved: All features unlocked              │
│  ✗ Rejected: Resubmit with correct documents   │
│  ⏳ Pending: Still under review                 │
└─────────────────────────────────────────────────┘

End
```

## Data Model

```typescript
// KYCSubmission (main entity)
{
  id: string;                          // Unique ID
  merchant_id: string;                 // Link to merchant
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending_review';
  documents: KYCDocument[];            // Array of documents
  submitted_at?: Date;                 // When submitted
  reviewed_at?: Date;                  // When reviewed
  rejection_reason?: string;           // Why rejected (if rejected)
  created_at: Date;                    // Creation timestamp
  updated_at: Date;                    // Last update
}

// KYCDocument (individual file)
{
  id: string;                          // Unique ID
  document_type: 'passport' | 'drivers_license' | 'national_id' | 'business_license';
  file_name: string;                   // Original filename
  file_size: number;                   // Size in bytes
  file_url?: string;                   // URL for retrieval (optional)
  uploaded_at: Date;                   // Upload timestamp
}
```

## State Management Flow

```
┌──────────────────────────────────┐
│  useKYC Hook (State Manager)    │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  api.kyc.getSubmission()         │
│  ↓ (Load existing submission)    │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  submission state                │
│  loading state                   │
│  error state                     │
│  Computed: isApproved,           │
│           isRejected,            │
│           isPending              │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  Component receives state via    │
│  useKYC hook                     │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  Render appropriate view:        │
│  • Loading spinner               │
│  • KYCWizard (not submitted)    │
│  • Status display (submitted)    │
│  • Success (approved)            │
│  • Rejection (rejected)          │
└──────────────────────────────────┘
```

## File Upload Process

```
┌─────────────────────────────────┐
│  User selects file              │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Client-side validation:        │
│  • File type check              │
│  • File size check              │
└─────────────────────────────────┘
  ↓ Valid
┌─────────────────────────────────┐
│  Create FormData                │
│  • document_type: string        │
│  • file: File object            │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  api.kyc.uploadDocument()       │
│  (POST /kyc/documents)          │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Backend processes:             │
│  • Validates file               │
│  • Scans for malware            │
│  • Stores in cloud/disk         │
│  • Creates DB record            │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Return document ID             │
│  { id: "doc_123",               │
│    file_name: "..." }           │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Add to uploadedDocs array      │
│  Show in UI with remove option  │
└─────────────────────────────────┘
```

## Component Hierarchy

```
App
└── Dashboard Layout
    ├── Sidebar (Navigation with KYC link)
    └── Main Content
        ├── Dashboard Page
        │   └── KYCPromptBanner
        │
        └── KYC Page
            ├── Status Display (if exists)
            └── KYCWizard
                ├── Step 1: Type Selection
                ├── Step 2: File Upload
                └── Step 3: Review & Submit
                    ├── Document List
                    │   └── Each Document Item
                    └── Buttons (Back, Submit)
```

## Status Transition Diagram

```
┌──────────┐
│  Draft   │ (Initial state - local only)
└─────┬────┘
      │ api.kyc.submitKYC()
      ↓
┌──────────────┐
│  Submitted   │ (Sent to backend)
└─────┬────────┘
      │ Backend starts review
      ↓
┌──────────────────┐
│  Pending Review  │ (Under review)
└─────┬────────────┘
      │
      ├─ Backend approves ──→ ┌──────────┐
      │                       │ Approved │ (Done!)
      │                       └──────────┘
      │
      └─ Backend rejects ──→ ┌──────────┐
                             │ Rejected │ (Can resubmit)
                             └──────────┘
```

## Error Handling Flow

```
┌──────────────────────┐
│  Action (upload,     │
│  submit, etc.)       │
└──────────────────────┘
  ↓
┌──────────────────────┐
│  Try/Catch block     │
└──────────────────────┘
  ↓
  ├─ Validation Error ──→ ┌─────────────────────┐
  │                        │ Show error message  │
  │                        │ User can retry      │
  │                        └─────────────────────┘
  │
  ├─ Network Error ──────→ ┌─────────────────────┐
  │                        │ Retry connection    │
  │                        │ Show error message  │
  │                        └─────────────────────┘
  │
  ├─ 401 Unauthorized ──→  ┌─────────────────────┐
  │                        │ Redirect to login   │
  │                        └─────────────────────┘
  │
  ├─ 4xx Client Error ──→  ┌─────────────────────┐
  │                        │ Show error details  │
  │                        │ Guide user action   │
  │                        └─────────────────────┘
  │
  └─ Success ──────────→   ┌─────────────────────┐
                           │ Update state        │
                           │ Show success        │
                           │ Proceed next step   │
                           └─────────────────────┘
```

---

This architecture is:
- **Modular**: Each component has a single responsibility
- **Scalable**: Easy to add new document types or statuses
- **Secure**: Authentication required, validation at multiple levels
- **Maintainable**: Clear separation of concerns
- **Testable**: Each layer can be tested independently
- **Extensible**: Add features without breaking existing code

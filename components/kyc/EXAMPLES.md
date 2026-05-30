/**
 * KYC Integration Examples
 * 
 * This file shows how to integrate KYC components into various parts of the application.
 */

// ============================================================================
// Example 1: Adding KYC Prompt Banner to Dashboard
// ============================================================================
// File: app/dashboard/page.tsx
// 
// 'use client';
// 
// import { KYCPromptBanner } from '@/components/kyc';
// import { StatsCards } from '@/components/dashboard/StatsCards';
// 
// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-semibold text-ink">Dashboard</h1>
//       </div>
//       
//       <KYCPromptBanner />
//       
//       <StatsCards />
//       
//       {/* Rest of dashboard content */}
//     </div>
//   );
// }

// ============================================================================
// Example 2: Using KYC Status in Account Settings
// ============================================================================
// File: components/settings/AccountStatus.tsx
// 
// 'use client';
// 
// import { useKYC } from '@/hooks/useKYC';
// import { KYCStatusDisplay } from '@/components/kyc';
// import Link from 'next/link';
// import { Button } from '@/components/ui/Button';
// 
// export function AccountStatus() {
//   const { submission, isApproved } = useKYC();
//   
//   return (
//     <div className="space-y-4">
//       <h2 className="text-lg font-semibold text-ink">Account Status</h2>
//       
//       {submission && <KYCStatusDisplay submission={submission} />}
//       
//       {!isApproved && (
//         <Link href="/dashboard/kyc">
//           <Button className="w-full">Complete KYC Verification</Button>
//         </Link>
//       )}
//     </div>
//   );
// }

// ============================================================================
// Example 3: Using useKYC Hook in Custom Component
// ============================================================================
// 
// 'use client';
// 
// import { useKYC } from '@/hooks/useKYC';
// import { Loader2 } from 'lucide-react';
// 
// export function MyCustomComponent() {
//   const { submission, loading, isApproved, refreshSubmission } = useKYC();
//   
//   if (loading) {
//     return <Loader2 className="animate-spin" />;
//   }
//   
//   return (
//     <div>
//       {isApproved && <p>Your account is verified!</p>}
//       
//       {submission && (
//         <p>Status: {submission.status}</p>
//       )}
//       
//       <button onClick={refreshSubmission}>
//         Refresh Status
//       </button>
//     </div>
//   );
// }

// ============================================================================
// Example 4: Protected Route with KYC Check
// ============================================================================
// File: middleware.ts
// 
// import { NextRequest, NextResponse } from 'next/server';
// 
// export function middleware(request: NextRequest) {
//   // Check if route requires KYC
//   if (request.nextUrl.pathname.startsWith('/dashboard/high-value-features')) {
//     // Fetch KYC status from API
//     // If not approved, redirect to KYC page
//     // This would typically be done server-side
//   }
//   
//   return NextResponse.next();
// }

// ============================================================================
// Example 5: API Usage in Server Component
// ============================================================================
// 
// import { api } from '@/lib/api';
// 
// async function getKYCStatus() {
//   try {
//     const submission = await api.kyc.getSubmission();
//     return submission;
//   } catch (error) {
//     // KYC doesn't exist yet
//     return null;
//   }
// }

// ============================================================================
// Example 6: File Upload with Validation
// ============================================================================
// 
// import { validateKYCFile, formatFileSize } from '@/lib/kyc-utils';
// import { api } from '@/lib/api';
// 
// async function handleFileUpload(file: File, documentType: string) {
//   // Validate file
//   const validation = validateKYCFile(file);
//   if (!validation.valid) {
//     console.error(validation.error);
//     return;
//   }
//   
//   // Upload
//   const result = await api.kyc.uploadDocument(documentType, file);
//   console.log(`File uploaded: ${result.file_name}`);
// }

// ============================================================================
// Example 7: Status Message Display
// ============================================================================
// 
// import { getStatusMessage, getStatusBadgeColor } from '@/lib/kyc-utils';
// 
// export function StatusBadge({ status }: { status: KYCSubmissionStatus }) {
//   const message = getStatusMessage(status);
//   const color = getStatusBadgeColor(status);
//   
//   const colors: Record<typeof color, string> = {
//     green: 'bg-mint text-white',
//     red: 'bg-red-600 text-white',
//     yellow: 'bg-orange-600 text-white',
//     blue: 'bg-blue-600 text-white',
//     gray: 'bg-slate-600 text-white',
//   };
//   
//   return (
//     <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[color]}`}>
//       {message}
//     </span>
//   );
// }

// ============================================================================
// Example 8: Handling Rejection and Resubmission
// ============================================================================
// 
// import { parseRejectionReasons } from '@/lib/kyc-utils';
// 
// export function RejectionGuide({ submission }: { submission: KYCSubmission }) {
//   if (submission.status !== 'rejected') return null;
//   
//   const suggestions = parseRejectionReasons(submission.rejection_reason || '');
//   
//   return (
//     <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//       <h3 className="font-semibold text-red-900 mb-3">KYC Rejected</h3>
//       <p className="text-sm text-red-700 mb-3">{submission.rejection_reason}</p>
//       
//       <p className="text-sm font-medium text-red-900 mb-2">Please resubmit with:</p>
//       <ul className="space-y-1">
//         {suggestions.map((suggestion, idx) => (
//           <li key={idx} className="text-sm text-red-700 flex gap-2">
//             <span>•</span>
//             <span>{suggestion}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export {};

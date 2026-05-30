import { KYCDocumentType, KYCSubmissionStatus } from '@/types';

/**
 * Get display label for document type
 */
export function getDocumentTypeLabel(type: KYCDocumentType): string {
  const labels: Record<KYCDocumentType, string> = {
    passport: 'Passport',
    drivers_license: "Driver's License",
    national_id: 'National ID',
    business_license: 'Business License',
  };
  return labels[type];
}

/**
 * Get description for document type
 */
export function getDocumentTypeDescription(type: KYCDocumentType): string {
  const descriptions: Record<KYCDocumentType, string> = {
    passport: 'Valid international passport',
    drivers_license: 'Government-issued driver license',
    national_id: 'Government-issued national identification',
    business_license: 'Business registration or license document',
  };
  return descriptions[type];
}

/**
 * Check if a status means KYC is complete
 */
export function isKYCComplete(status: KYCSubmissionStatus): boolean {
  return status === 'approved' || status === 'rejected';
}

/**
 * Check if a status means KYC is pending
 */
export function isKYCPending(status: KYCSubmissionStatus): boolean {
  return status === 'pending_review' || status === 'submitted';
}

/**
 * Check if a status means KYC can be edited
 */
export function canEditKYC(status: KYCSubmissionStatus): boolean {
  return status === 'draft' || status === 'rejected';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file for KYC upload
 */
export function validateKYCFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Please upload an image (PNG, JPG, GIF) or PDF.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds limit. Maximum size is ${formatFileSize(maxSize)}.` };
  }

  return { valid: true };
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status: KYCSubmissionStatus): 'green' | 'red' | 'yellow' | 'blue' | 'gray' {
  switch (status) {
    case 'approved':
      return 'green';
    case 'rejected':
      return 'red';
    case 'pending_review':
    case 'submitted':
      return 'yellow';
    case 'draft':
      return 'blue';
    default:
      return 'gray';
  }
}

/**
 * Get status message
 */
export function getStatusMessage(status: KYCSubmissionStatus): string {
  const messages: Record<KYCSubmissionStatus, string> = {
    approved: 'Your KYC has been verified.',
    rejected: 'Your KYC submission was rejected.',
    pending_review: 'Your documents are under review.',
    submitted: 'Your documents have been submitted.',
    draft: 'KYC verification in progress.',
  };
  return messages[status];
}

/**
 * Parse rejection reason to show helpful suggestions
 */
export function parseRejectionReasons(reason: string): string[] {
  const suggestions: string[] = [];

  if (reason.toLowerCase().includes('blurred') || reason.toLowerCase().includes('unclear')) {
    suggestions.push('Ensure all text is legible and not blurred');
  }

  if (reason.toLowerCase().includes('expired')) {
    suggestions.push('Document must be valid and not expired');
  }

  if (reason.toLowerCase().includes('edge') || reason.toLowerCase().includes('corner')) {
    suggestions.push('All corners of the document must be visible');
  }

  if (reason.toLowerCase().includes('complete')) {
    suggestions.push('All required information must be visible');
  }

  if (suggestions.length === 0) {
    suggestions.push('Clear, unobstructed photos of all required documents');
  }

  return suggestions;
}

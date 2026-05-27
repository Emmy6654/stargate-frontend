'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useKYC } from '@/hooks/useKYC';

/**
 * KYC Banner Component - Shows on dashboard if KYC is not complete
 * Can be added to dashboard/page.tsx to prompt merchants to complete KYC
 */
export function KYCPromptBanner() {
  const { isApproved, isPending, loading } = useKYC();

  if (loading || isApproved || isPending) {
    return null;
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 mb-6">
      <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h3 className="font-semibold text-blue-900">Complete KYC Verification</h3>
        <p className="text-sm text-blue-800 mt-1">Verify your identity to unlock higher transaction limits and access all features.</p>
      </div>
      <Link href="/dashboard/kyc">
        <Button className="whitespace-nowrap">
          Get Started <ArrowRight size={16} />
        </Button>
      </Link>
    </div>
  );
}
